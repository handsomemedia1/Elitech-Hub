# -*- coding: utf-8 -*-
import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def download_font():
    font_url = "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat-Bold.ttf"
    font_path = "Montserrat-Bold.ttf"
    if not os.path.exists(font_path):
        try:
            urllib.request.urlretrieve(font_url, font_path)
        except:
            font_path = "arial.ttf"
    
    font_url_reg = "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat-Regular.ttf"
    font_path_reg = "Montserrat-Regular.ttf"
    if not os.path.exists(font_path_reg):
        try:
            urllib.request.urlretrieve(font_url_reg, font_path_reg)
        except:
            font_path_reg = "arial.ttf"

    font_url_black = "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat-Black.ttf"
    font_path_black = "Montserrat-Black.ttf"
    if not os.path.exists(font_path_black):
        try:
            urllib.request.urlretrieve(font_url_black, font_path_black)
        except:
            font_path_black = "arial.ttf"
        
    return font_path, font_path_reg, font_path_black

def create_flyer(bg_path, logo_path, out_path, size, is_instagram=False):
    width, height = size
    
    # 1. Base Image
    bg = Image.open(bg_path).convert("RGBA")
    
    # Resize and crop to fill
    bg_w, bg_h = bg.size
    ratio = max(width/bg_w, height/bg_h)
    bg = bg.resize((int(bg_w*ratio), int(bg_h*ratio)), Image.Resampling.LANCZOS)
    x = (bg.width - width) // 2
    y = (bg.height - height) // 2
    bg = bg.crop((x, y, x+width, y+height))
    
    # Add a dark glass overlay for text readability
    overlay = Image.new("RGBA", (width, height), (10, 15, 26, 210))
    bg = Image.alpha_composite(bg, overlay)
    
    draw = ImageDraw.Draw(bg)
    font_bold, font_reg, font_black = download_font()
    
    # 2. Draw Logo
    try:
        logo = Image.open(logo_path).convert("RGBA")
        logo_w, logo_h = logo.size
        target_logo_h = 60 if not is_instagram else 90
        logo_ratio = target_logo_h / logo_h
        logo = logo.resize((int(logo_w * logo_ratio), target_logo_h), Image.Resampling.LANCZOS)
        
        logo_x = 50 if not is_instagram else 80
        logo_y = 50 if not is_instagram else 80
        bg.paste(logo, (logo_x, logo_y), logo)
    except Exception as e:
        print("Logo error:", e)

    # 3. Typography Setup
    title_font = ImageFont.truetype(font_black, 65 if not is_instagram else 90)
    sub_font = ImageFont.truetype(font_bold, 30 if not is_instagram else 45)
    body_font = ImageFont.truetype(font_bold, 24 if not is_instagram else 36)
    small_font = ImageFont.truetype(font_reg, 20 if not is_instagram else 30)
    
    margin_x = 50 if not is_instagram else 80
    start_y = 150 if not is_instagram else 250

    # Draw Badge "New Program"
    badge_text = "NEW PROGRAM"
    badge_w = draw.textlength(badge_text, font=body_font)
    draw.rounded_rectangle([margin_x, start_y, margin_x + badge_w + 30, start_y + 45 if not is_instagram else start_y + 60], radius=15, fill=(195, 21, 28, 50), outline="#fc8181", width=2)
    draw.text((margin_x + 15, start_y + (7 if not is_instagram else 10)), badge_text, font=body_font, fill="#fc8181")
    
    start_y += 70 if not is_instagram else 100
    
    # Title
    title = "Learn AI Powered\nCybersecurity in 6 Weeks"
    draw.text((margin_x, start_y), title, font=title_font, fill="#ffffff", spacing=10)
    
    start_y += 160 if not is_instagram else 230
    
    # Technologies (Cyan accent)
    tech = "PowerShell | Python | Ubuntu | AI Security Systems"
    if is_instagram:
        tech = "PowerShell | Python | Ubuntu\nAI Security Systems"
    draw.text((margin_x, start_y), tech, font=sub_font, fill="#06B6D4", spacing=15)
    
    start_y += 60 if not is_instagram else 140
    
    # Features List
    features = [
        "+ 4 Weeks Training & 2 Weeks Internship",
        "+ 100% Internship Guaranteed",
        "+ 100% Virtual Class & Recordings Provided",
        "+ CAC & SMEDAN Certified"
    ]
    
    for f in features:
        draw.text((margin_x, start_y), f, font=body_font, fill="#e2e8f0")
        start_y += 40 if not is_instagram else 60
        
    # Price Box (Right side or Bottom)
    box_w = 280 if not is_instagram else 400
    box_h = 100 if not is_instagram else 150
    
    if not is_instagram:
        box_x = width - box_w - 50
        box_y = height - box_h - 130
    else:
        box_x = margin_x
        box_y = start_y + 60
        start_y += box_h + 80
        
    # Draw glassmorphism box for price
    draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + box_h], radius=20, fill=(255,255,255,20), outline="#ffffff", width=1)
    
    price_label = "PRICE:"
    draw.text((box_x + 30, box_y + (20 if not is_instagram else 30)), price_label, font=small_font, fill="#94a3b8")
    
    price_val = "$100 USD"
    draw.text((box_x + 30, box_y + (45 if not is_instagram else 65)), price_val, font=ImageFont.truetype(font_black, 45 if not is_instagram else 65), fill="#10B981")
    
    # Start Date and Contact (Bottom)
    if not is_instagram:
        bottom_y = height - 90
    else:
        bottom_y = height - 160
        
    draw.line([(margin_x, bottom_y - 20), (width - margin_x, bottom_y - 20)], fill=(255,255,255,50), width=1)
    
    date_text = "START DATE: JUNE 8TH, 2026"
    draw.text((margin_x, bottom_y), date_text, font=sub_font, fill="#c3151c")
    
    contact_text = "elitechub.com  |  +234 708 196 8062"
    cw = draw.textlength(contact_text, font=body_font)
    draw.text((width - margin_x - cw, bottom_y + (5 if not is_instagram else 10)), contact_text, font=body_font, fill="#ffffff")
    
    # Save image to artifacts folder so user can easily click and view
    bg.save(out_path)
    print(f"Generated {out_path}")

bg_image = r"C:\Users\lenovo\.gemini\antigravity\brain\c3f77e41-ea05-4d69-9458-e24516638925\cyber_bg_abstract_1778894640364.png"
logo_image = r"c:\Users\lenovo\OneDrive\Desktop\elitech-hub\assets\images\logo.png"

out_linkedin = r"C:\Users\lenovo\.gemini\antigravity\brain\c3f77e41-ea05-4d69-9458-e24516638925\linkedin_ad_flyer.png"
out_instagram = r"C:\Users\lenovo\.gemini\antigravity\brain\c3f77e41-ea05-4d69-9458-e24516638925\instagram_ad_flyer.png"

create_flyer(bg_image, logo_image, out_linkedin, (1200, 628), False)
create_flyer(bg_image, logo_image, out_instagram, (1080, 1350), True)