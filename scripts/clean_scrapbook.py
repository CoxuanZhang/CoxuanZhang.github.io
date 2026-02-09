import os

def rename_photos():
    os.chdir("Personal/Scrapbook/img")
    files = [f for f in os.listdir() if os.path.isfile(f)]
    temp_names = []
    # First pass: rename all to temp names
    for i, filename in enumerate(files):
        temp_name = f"__temp__{i}__.png"
        os.rename(filename, temp_name)
        temp_names.append(temp_name)
    # Second pass: rename temp names to final names
    for count, temp_name in enumerate(temp_names):
        final_name = f"{count:03d}.png"
        os.rename(temp_name, final_name)
    print(f"Renamed {len(files)} scrapbook photos")
    os.chdir(os.path.join(os.pardir, os.pardir))

if __name__ == '__main__':
    rename_photos()