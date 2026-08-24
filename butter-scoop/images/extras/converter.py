import os

PROJECT_FOLDER = r"C:\Users\YourName\Desktop\my-project"

OLD_IMAGE = "a.jpg"
NEW_IMAGE = "a.webp"

SUPPORTED_EXTENSIONS = (
    ".html",
    ".css",
    ".js",
    ".jsx",
    ".tsx",
    ".ts",
)


def update_image_paths():
    updated_files = 0

    for root, _, files in os.walk(PROJECT_FOLDER):
        for file in files:
            if not file.lower().endswith(SUPPORTED_EXTENSIONS):
                continue

            file_path = os.path.join(root, file)

            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                if OLD_IMAGE not in content:
                    continue

                updated_content = content.replace(
                    OLD_IMAGE,
                    NEW_IMAGE
                )

                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(updated_content)

                updated_files += 1
                print(f"Updated: {file_path}")

            except Exception as error:
                print(f"Failed: {file_path}")
                print(f"Error: {error}")

    print("\nDone!")
    print(f"Total files updated: {updated_files}")


if __name__ == "__main__":
    update_image_paths()