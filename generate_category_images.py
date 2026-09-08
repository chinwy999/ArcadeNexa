from PIL import Image, ImageDraw, ImageFont
import os

# بيانات الفئات مع الألوان
categories = {
    'action': {'color': '#FF4444', 'icon': '⚔️'},
    'adventure': {'color': '#2ECC71', 'icon': '🧭'},
    'air-combat': {'color': '#3498DB', 'icon': '✈️'},
    'animal': {'color': '#E74C3C', 'icon': '🐾'},
    'arcade': {'color': '#F39C12', 'icon': '🕹️'},
    'ball': {'color': '#9B59B6', 'icon': '⚫'},
    'basketball': {'color': '#E67E22', 'icon': '🏀'},
    'battle': {'color': '#C0392B', 'icon': '⚔️'},
    'beauty-dress-up': {'color': '#E91E63', 'icon': '✨'},
    'bike': {'color': '#3498DB', 'icon': '🏍️'},
    'block': {'color': '#8E44AD', 'icon': '🧩'},
    'board': {'color': '#16A085', 'icon': '🎲'},
    'boat': {'color': '#2980B9', 'icon': '⛵'},
    'brain': {'color': '#D35400', 'icon': '🧠'},
    'building': {'color': '#34495E', 'icon': '🏗️'},
    'car': {'color': '#E74C3C', 'icon': '🏎️'},
    'card': {'color': '#8E44AD', 'icon': '🃏'},
    'casual': {'color': '#27AE60', 'icon': '😊'},
    'cats': {'color': '#F39C12', 'icon': '🐱'},
    'clicker': {'color': '#3498DB', 'icon': '🖱️'},
    'cooking': {'color': '#E67E22', 'icon': '👨‍🍳'},
    'drawing': {'color': '#E74C3C', 'icon': '✏️'},
    'educational': {'color': '#2980B9', 'icon': '🎓'},
    'farming': {'color': '#27AE60', 'icon': '🌾'},
    'fighting': {'color': '#C0392B', 'icon': '👊'},
    'flying': {'color': '#3498DB', 'icon': '🦅'},
    'games-for-girls': {'color': '#E91E63', 'icon': '💕'},
    'golf': {'color': '#27AE60', 'icon': '⛳'},
    'hidden-object': {'color': '#8E44AD', 'icon': '🔍'},
    'hyper-casual': {'color': '#F39C12', 'icon': '⚡'},
    '2048': {'color': '#34495E', 'icon': '#'},
    'horror': {'color': '#2C3E50', 'icon': '👻'},
    'idle': {'color': '#95A5A6', 'icon': '⏰'},
    'io': {'color': '#3498DB', 'icon': '🌐'},
    'match-3': {'color': '#9B59B6', 'icon': '🟩'},
    'math': {'color': '#E74C3C', 'icon': '🔢'},
    'memory': {'color': '#2980B9', 'icon': '🧠'},
    'mmorpg': {'color': '#8E44AD', 'icon': '👥'},
    'monster': {'color': '#C0392B', 'icon': '👹'},
    'open-world': {'color': '#16A085', 'icon': '🗺️'},
    'platformer': {'color': '#E67E22', 'icon': '🚀'},
    'puzzle': {'color': '#9B59B6', 'icon': '🧩'},
    'quiz': {'color': '#F39C12', 'icon': '❓'},
    'racing': {'color': '#E74C3C', 'icon': '🏁'},
    'robots': {'color': '#34495E', 'icon': '🤖'},
    'rpg': {'color': '#8E44AD', 'icon': '🛡️'},
    'runner': {'color': '#3498DB', 'icon': '🏃'},
    'sandbox': {'color': '#D35400', 'icon': '📦'},
    'shooter': {'color': '#C0392B', 'icon': '🎯'},
    'simulation': {'color': '#2980B9', 'icon': '✈️'},
    'snake': {'color': '#27AE60', 'icon': '🐍'},
    'space': {'color': '#2C3E50', 'icon': '🚀'},
    'sports': {'color': '#E74C3C', 'icon': '🏆'},
    'stealth': {'color': '#34495E', 'icon': '🕵️'},
    'strategy': {'color': '#8E44AD', 'icon': '♞'},
    'survival': {'color': '#27AE60', 'icon': '⛺'},
    'tank': {'color': '#34495E', 'icon': '🪖'},
    'time-management': {'color': '#F39C12', 'icon': '⏱️'},
    'trivia': {'color': '#2980B9', 'icon': '💡'},
    'tycoon': {'color': '#D35400', 'icon': '📈'},
    'word': {'color': '#3498DB', 'icon': '📝'},
    'zombie': {'color': '#C0392B', 'icon': '🧟'},
}

# مسار المجلد
output_dir = os.path.expanduser('~/arcadenexa-project/public/images/categories')
os.makedirs(output_dir, exist_ok=True)

# إنشاء صور لكل فئة
for category_name, data in categories.items():
    # حجم الصورة
    width, height = 400, 300
    
    # إنشاء صورة بخلفية اللون
    img = Image.new('RGB', (width, height), color=data['color'])
    draw = ImageDraw.Draw(img)
    
    # رسم gradient بسيط (تغميق في الأسفل)
    for y in range(height):
        factor = y / height
        r = int(int(data['color'][1:3], 16) * (1 - factor * 0.3))
        g = int(int(data['color'][3:5], 16) * (1 - factor * 0.3))
        b = int(int(data['color'][5:7], 16) * (1 - factor * 0.3))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # إضافة الأيقونة (emoji أو رمز)
    try:
        # محاولة استخدام خط يدعم emoji
        font_size = 80
        font = ImageFont.load_default()
    except:
        font = ImageFont.load_default()
    
    # رسم الأيقونة في المنتصف
    icon_text = data['icon']
    icon_bbox = draw.textbbox((0, 0), icon_text, font=font)
    icon_width = icon_bbox[2] - icon_bbox[0]
    icon_x = (width - icon_width) // 2
    icon_y = (height // 2) - 60
    draw.text((icon_x, icon_y), icon_text, fill='white', font=font)
    
    # رسم اسم الفئة أسفل الأيقونة
    category_display = category_name.replace('-', ' ').title()
    text_bbox = draw.textbbox((0, 0), category_display, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (width - text_width) // 2
    text_y = height - 80
    draw.text((text_x, text_y), category_display, fill='white', font=font)
    
    # حفظ الصورة بصيغة webp
    output_path = os.path.join(output_dir, f'{category_name}.webp')
    img.save(output_path, 'WEBP', quality=85)
    print(f'✅ تم إنشاء: {category_name}.webp')

print('\n✨ تم إنشاء جميع الصور بنجاح!')
