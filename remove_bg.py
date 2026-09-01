import os
from PIL import Image

def remove_background(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    # Sample top-left corner pixel as background color reference
    bg_sample = datas[0]
    bg_r, bg_g, bg_b = bg_sample[0], bg_sample[1], bg_sample[2]

    new_data = []
    for item in datas:
        r, g, b, a = item
        # Check if color is close to background or light gray/white
        diff = max(abs(r - bg_r), abs(g - bg_g), abs(b - bg_b))
        
        # If it's the background color or very close to light gray/white
        if diff < tolerance or (r > 220 and g > 220 and b > 220):
            # Transparent
            new_data.append((255, 255, 255, 0))
        else:
            # Keep original pixel
            new_data.append(item)

    img.putdata(new_data)
    
    # Save transparent PNG
    img.save(output_path, "PNG")
    print(f"Successfully saved transparent logo to: {output_path}")

    # Also create a pure white version with transparent background for dark headers/navbars
    white_img = Image.new("RGBA", img.size)
    white_data = []
    for item in new_data:
        r, g, b, a = item
        if a > 0:
            # Invert darkness to alpha or make it pure white with preserved alpha
            darkness = 255 - int((r + g + b) / 3)
            # Map darkness to alpha transparency
            alpha = min(255, int(a * (darkness / 255) * 1.5))
            if alpha > 15:
                white_data.append((255, 255, 255, alpha))
            else:
                white_data.append((255, 255, 255, 0))
        else:
            white_data.append((255, 255, 255, 0))

    white_img.putdata(white_data)
    white_output_path = os.path.join(os.path.dirname(output_path), "logo-white.png")
    white_img.save(white_output_path, "PNG")
    print(f"Successfully saved white logo for dark navbar to: {white_output_path}")

if __name__ == "__main__":
    base_dir = r"c:\BRIN\ui-titikhukum\assets"
    input_file = os.path.join(base_dir, "logo.png")
    output_file = os.path.join(base_dir, "logo.png") # overwrite or transparent version
    
    remove_background(input_file, output_file)
