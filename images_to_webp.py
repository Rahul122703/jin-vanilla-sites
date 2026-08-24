#!/usr/bin/env python3
"""
images_to_webp.py

Finds image references (.jpg/.jpeg/.png/.gif) inside your code files
(html, css, scss, js, php), converts ONLY those referenced image files
to .webp, and rewrites every reference in the code to point to the new
.webp path.

Usage:
    python3 images_to_webp.py /path/to/project-root
    python3 images_to_webp.py /path/to/project-root --dry-run
    python3 images_to_webp.py /path/to/project-root --quality 82
    python3 images_to_webp.py /path/to/project-root --delete-originals

By default originals are KEPT on disk (safer). Pass --delete-originals
to remove them once converted.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Optional

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required. Install it with: pip install Pillow --break-system-packages")

# File types to scan for image references
CODE_EXTS = {".html", ".htm", ".css", ".scss", ".js", ".php", ".json"}

# Image types eligible for conversion (skip .svg, .webp, .gif-with-animation risk)
CONVERTIBLE_EXTS = {".jpg", ".jpeg", ".png"}

# Matches quoted or url()-wrapped paths ending in a convertible image extension
IMAGE_REF_RE = re.compile(
    r"""(?P<quote>['"(])(?P<path>[^'")\s]+\.(?:jpg|jpeg|png))(?P=quote)"""
    r"""|url\(\s*(?P<path2>[^'")\s]+\.(?:jpg|jpeg|png))\s*\)""",
    re.IGNORECASE,
)


def find_code_files(root: Path):
    return [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in CODE_EXTS]


def extract_image_refs(text: str):
    refs = set()
    for m in IMAGE_REF_RE.finditer(text):
        path = m.group("path") or m.group("path2")
        if path:
            refs.add(path)
    return refs


def resolve_image_path(root: Path, code_file: Path, ref: str) -> Optional[Path]:
    """Try to resolve a referenced path to a real file on disk."""
    # Skip remote URLs (http://, https://, protocol-relative //, data URIs)
    if re.match(r"^(https?:)?//", ref, re.IGNORECASE) or ref.lower().startswith("data:"):
        return None

    ref_clean = ref.split("?")[0].split("#")[0]  # strip query/hash
    candidates = [
        code_file.parent / ref_clean,
        root / ref_clean.lstrip("/"),
    ]
    for c in candidates:
        try:
            c = c.resolve()
        except (OSError, ValueError):
            continue
        if c.exists() and c.is_file():
            return c
    return None


def convert_to_webp(img_path: Path, quality: int, dry_run: bool) -> Path:
    webp_path = img_path.with_suffix(".webp")
    if dry_run:
        return webp_path
    with Image.open(img_path) as im:
        # Preserve transparency for PNGs, flatten mode issues otherwise
        if im.mode in ("P", "LA"):
            im = im.convert("RGBA")
        im.save(webp_path, "WEBP", quality=quality, method=6)
    return webp_path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("root", type=str, help="Project root directory to scan")
    ap.add_argument("--quality", type=int, default=82, help="WebP quality 0-100 (default 82)")
    ap.add_argument("--dry-run", action="store_true", help="Show what would happen, change nothing")
    ap.add_argument("--delete-originals", action="store_true", help="Delete original file after successful conversion")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        sys.exit(f"Path does not exist: {root}")

    code_files = find_code_files(root)
    print(f"Scanning {len(code_files)} code files under {root} ...")

    # Map: referenced path string (as it appears in a given code file) -> resolved Path
    file_refs = {}  # code_file -> set(ref strings)
    all_resolved = {}  # resolved image Path -> set of raw ref strings that pointed to it

    for cf in code_files:
        text = cf.read_text(errors="ignore")
        refs = extract_image_refs(text)
        if not refs:
            continue
        file_refs[cf] = refs
        for ref in refs:
            resolved = resolve_image_path(root, cf, ref)
            if resolved and resolved.suffix.lower() in CONVERTIBLE_EXTS:
                all_resolved.setdefault(resolved, set()).add(ref)

    if not all_resolved:
        print("No convertible, referenced images found. Nothing to do.")
        return

    print(f"\nFound {len(all_resolved)} unique referenced images to convert:\n")
    total_before = 0
    total_after = 0
    converted_map = {}  # resolved original Path -> webp Path

    for img_path in sorted(all_resolved):
        size_before = img_path.stat().st_size
        total_before += size_before
        try:
            webp_path = convert_to_webp(img_path, args.quality, args.dry_run)
        except Exception as e:
            print(f"  [SKIP] {img_path.relative_to(root)} -> error: {e}")
            continue

        size_after = webp_path.stat().st_size if (webp_path.exists() and not args.dry_run) else size_before

        # Safety check: if the webp came out LARGER than the original, discard it
        # and keep the original file/reference untouched.
        if not args.dry_run and size_after >= size_before:
            webp_path.unlink(missing_ok=True)
            total_after += size_before
            print(f"  [SKIP] {img_path.relative_to(root)}  "
                  f"webp was larger ({size_before/1024:.1f} KB -> {size_after/1024:.1f} KB) — kept original")
            continue

        total_after += size_after if not args.dry_run else size_before

        converted_map[img_path] = webp_path
        savings = (1 - size_after / size_before) * 100 if (size_before and not args.dry_run) else 0
        tag = "[DRY-RUN]" if args.dry_run else "[OK]"
        print(f"  {tag} {img_path.relative_to(root)}  "
              f"({size_before/1024:.1f} KB -> {size_after/1024:.1f} KB, {savings:.0f}% smaller)")

        if args.delete_originals and not args.dry_run:
            img_path.unlink()

    # Rewrite references in code files
    print(f"\nUpdating references in {len(file_refs)} code files...")
    files_changed = 0
    for cf, refs in file_refs.items():
        text = cf.read_text(errors="ignore")
        original_text = text
        for ref in refs:
            resolved = resolve_image_path(root, cf, ref)
            if resolved in converted_map:
                new_ref = re.sub(r"\.(jpe?g|png)$", ".webp", ref, flags=re.IGNORECASE)
                text = text.replace(ref, new_ref)
        if text != original_text:
            files_changed += 1
            if not args.dry_run:
                cf.write_text(text)
            print(f"  updated: {cf.relative_to(root)}")

    print(f"\nDone. {len(converted_map)} images converted, {files_changed} code files updated.")
    if not args.dry_run and total_before:
        print(f"Total size: {total_before/1024/1024:.2f} MB -> {total_after/1024/1024:.2f} MB "
              f"({(1 - total_after/total_before)*100:.0f}% reduction)")
    if args.dry_run:
        print("This was a dry run — nothing was changed. Re-run without --dry-run to apply.")


if __name__ == "__main__":
    main()
