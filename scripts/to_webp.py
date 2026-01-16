#

import os
import sys
import json
import re
from pathlib import Path
from PIL import Image

# 支持的图片扩展名（小写）
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.tif', '.gif'}

# 图片后缀正则：匹配字符串末尾的图片扩展（区分大小写但兼容）
IMAGE_SUFFIX_PATTERN = re.compile(r'\.(png|jpe?g|bmp|tiff?|gif)"')

def ensure_raw_dir(file_path: Path) -> Path:
    """确保 raw 目录存在，并返回 raw 目录路径"""
    raw_dir = file_path.parent / "raw"
    raw_dir.mkdir(exist_ok=True)
    return raw_dir

def convert_image_to_webp(img_path: Path):
    """将单张图片转换为 webp，并移动原图到 raw"""
    try:
        with Image.open(img_path) as img:
            # 处理模式
            if img.mode in ("RGBA", "LA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")

            # 保存为 .webp（文件名保留原扩展 + .webp）
            webp_path = img_path.with_name(img_path.name + ".webp")
            img.save(webp_path, "WEBP", quality=85, method=6)
            print(f"✅ Converted: {img_path} → {webp_path}")

            # 移动原图到 raw/
            raw_dir = ensure_raw_dir(img_path)
            target_in_raw = raw_dir / img_path.name
            if target_in_raw.exists():
                print(f"⚠️  Warning: {target_in_raw} already exists, skipping move.")
            else:
                img_path.rename(target_in_raw)
                print(f"📁 Moved original to: {target_in_raw}")

    except Exception as e:
        print(f"❌ Error processing {img_path}: {e}")

def process_images(root_dir: Path):
    """递归处理所有图片"""
    for ext in IMAGE_EXTENSIONS:
        for img_file in root_dir.rglob(f"*{ext}"):
            # 跳过 raw 文件夹内的图片（防止重复处理）
            if "raw" in img_file.parts:
                continue
            convert_image_to_webp(img_file)

def update_json_files(root_dir: Path):
    """遍历所有 JSON 文件，替换图片路径为 .webp"""
    json_files = root_dir.rglob("*.json")
    for json_file in json_files:
        try:
            print(f"📝 Reading: {json_file}")
            content = json_file.read_text(encoding='utf-8')
            original_content = content

            # 使用正则查找并替换：仅当字符串以 .png"、.jpg" 等结尾时才加 .webp
            def replacer(match):
                full_match = match.group(0)
                # 检查是否已经是 .webp 结尾（避免重复）
                if full_match.lower().endswith('.webp"'):
                    return full_match
                # 否则追加 .webp
                return full_match[:-1] + ".webp\""

            content = IMAGE_SUFFIX_PATTERN.sub(replacer, content)

            if content != original_content:
                json_file.write_text(content, encoding='utf-8')
                print(f"✅ Updated JSON: {json_file}")
        except Exception as e:
            print(f"❌ Error updating JSON {json_file}: {e}")

def main():
    # 获取输入路径
    if len(sys.argv) > 1:
        input_path = Path(sys.argv[1]).resolve()
    else:
        input_path = Path("../public").resolve()

    if not input_path.exists():
        print(f"❌ Error: Path does not exist: {input_path}")
        sys.exit(1)

    print(f"📁 Working on directory: {input_path}")

    # Step 1: 转换所有图片
    print("\n🔄 Converting images to WebP...")
    process_images(input_path)

    # Step 2: 更新 JSON 文件中的路径
    print("\n🔄 Updating JSON files...")
    update_json_files(input_path)

    print("\n🎉 All done!")

if __name__ == "__main__":
    main()