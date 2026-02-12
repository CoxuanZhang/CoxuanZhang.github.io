import os
from PIL import Image

def compress_image(input_path, output_path, max_size_kb=250, quality=85):
    img = Image.open(input_path)
    img_format = img.format
    # Try reducing quality until under max_size_kb
    for q in range(quality, 10, -5):
        img.save(output_path, format=img_format, quality=q, optimize=True)
        if os.path.getsize(output_path) <= max_size_kb * 1024:
            break

def compress_photos_in_comma_folders(root_dir='Personal/Camera/Photos'):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        if ',' in os.path.basename(dirpath):
            for fname in filenames:
                if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
                    fpath = os.path.join(dirpath, fname)
                    compress_image(fpath, fpath)

if __name__ == '__main__':
    compress_photos_in_comma_folders()