#!/usr/bin/env python3
"""
compress_videos.py

Finds <video> src references in your code files, and re-encodes those
video files with ffmpeg to a much smaller size (H.264, reduced bitrate/
resolution), WITHOUT touching filenames or code references — so no
find-and-replace is needed for this one. Originals are backed up.

Requires ffmpeg to be installed and on your PATH:
    Windows: https://www.gyan.dev/ffmpeg/builds/  (add the bin/ folder to PATH)
    Mac:     brew install ffmpeg
    Linux:   sudo apt install ffmpeg

Usage:
    python3 compress_videos.py /path/to/project-root
    python3 compress_videos.py /path/to/project-root --dry-run
    python3 compress_videos.py /path/to/project-root --max-width 1920 --crf 28
    python3 compress_videos.py /path/to/project-root --keep-backup false

CRF (Constant Rate Factor) controls quality/size tradeoff:
    18-20 = visually near-lossless, bigger files
    23    = ffmpeg default, good balance
    26-30 = noticeably smaller, still fine for background/hero video
Lower number = higher quality = bigger file. Default here is 27
(background/hero videos rarely need high fidelity since they're
usually blurred, small, or have text overlaid on top).
"""

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

CODE_EXTS = {".html", ".htm", ".css", ".scss", ".js", ".php"}
VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".avi", ".webm"}

VIDEO_REF_RE = re.compile(
    r"""['"]([^'"]+\.(?:mp4|mov|m4v|avi))['"]""",
    re.IGNORECASE,
)


def check_ffmpeg():
    if shutil.which("ffmpeg") is None:
        sys.exit(
            "ffmpeg not found on PATH.\n"
            "Install it first:\n"
            "  Windows: https://www.gyan.dev/ffmpeg/builds/ (add bin/ to PATH)\n"
            "  Mac:     brew install ffmpeg\n"
            "  Linux:   sudo apt install ffmpeg"
        )


def find_code_files(root: Path):
    return [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in CODE_EXTS]


def find_referenced_videos(root: Path):
    found = {}  # resolved Path -> raw ref (for reporting)
    for cf in find_code_files(root):
        text = cf.read_text(errors="ignore")
        for m in VIDEO_REF_RE.finditer(text):
            ref = m.group(1)
            if re.match(r"^(https?:)?//", ref, re.IGNORECASE):
                continue  # remote URL, skip
            ref_clean = ref.split("?")[0].split("#")[0]
            candidates = [cf.parent / ref_clean, root / ref_clean.lstrip("/")]
            for c in candidates:
                try:
                    c = c.resolve()
                except (OSError, ValueError):
                    continue
                if c.exists() and c.suffix.lower() in VIDEO_EXTS:
                    found[c] = ref
                    break
    return found


def compress_video(src: Path, max_width: int, crf: int, dry_run: bool) -> Path:
    tmp_out = src.with_suffix(".compressed.mp4")
    if dry_run:
        return tmp_out

    cmd = [
        "ffmpeg", "-y", "-i", str(src),
        "-vf", f"scale='min({max_width},iw)':-2",
        "-c:v", "libx264", "-crf", str(crf), "-preset", "slow",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",  # allows video to start playing before fully downloaded
        str(tmp_out),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr[-800:])
    return tmp_out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("root", type=str, help="Project root directory to scan")
    ap.add_argument("--max-width", type=int, default=1920, help="Max video width in px (default 1920)")
    ap.add_argument("--crf", type=int, default=27, help="Quality 18(best/biggest)-30(smallest). Default 27")
    ap.add_argument("--dry-run", action="store_true", help="Show what would happen, change nothing")
    ap.add_argument("--no-backup", action="store_true", help="Don't keep a .original.mp4 backup copy")
    args = ap.parse_args()

    check_ffmpeg()
    root = Path(args.root).resolve()
    if not root.exists():
        sys.exit(f"Path does not exist: {root}")

    print(f"Scanning code files under {root} for <video>/src references...")
    videos = find_referenced_videos(root)

    if not videos:
        print("No referenced video files found. Nothing to do.")
        return

    print(f"\nFound {len(videos)} referenced video(s):\n")
    total_before = 0
    total_after = 0

    for video_path in sorted(videos):
        size_before = video_path.stat().st_size
        total_before += size_before
        print(f"  {video_path.relative_to(root)}  ({size_before/1024/1024:.1f} MB)")

        if args.dry_run:
            print(f"    [DRY-RUN] would re-encode to max width {args.max_width}px, CRF {args.crf}")
            total_after += size_before
            continue

        try:
            tmp_out = compress_video(video_path, args.max_width, args.crf, args.dry_run)
        except Exception as e:
            print(f"    [SKIP] ffmpeg error: {e}")
            total_after += size_before
            continue

        size_after = tmp_out.stat().st_size

        if size_after >= size_before:
            print(f"    [SKIP] compressed version was not smaller ({size_after/1024/1024:.1f} MB) — keeping original")
            tmp_out.unlink(missing_ok=True)
            total_after += size_before
            continue

        # Back up original, then replace it (keeping the same filename/extension
        # so NO code references need to change)
        if not args.no_backup:
            backup_path = video_path.with_name(video_path.stem + ".original" + video_path.suffix)
            if not backup_path.exists():
                shutil.copy2(video_path, backup_path)

        tmp_out.replace(video_path)  # overwrite original with compressed version, same filename
        total_after += size_after
        savings = (1 - size_after / size_before) * 100
        print(f"    [OK] {size_before/1024/1024:.1f} MB -> {size_after/1024/1024:.1f} MB ({savings:.0f}% smaller)")

    print(f"\nDone.")
    if total_before:
        print(f"Total: {total_before/1024/1024:.1f} MB -> {total_after/1024/1024:.1f} MB "
              f"({(1 - total_after/total_before)*100:.0f}% reduction)")
    if args.dry_run:
        print("This was a dry run — nothing was changed. Re-run without --dry-run to apply.")
    elif not args.no_backup:
        print("Originals backed up as *.original.mp4 next to each compressed file.")


if __name__ == "__main__":
    main()