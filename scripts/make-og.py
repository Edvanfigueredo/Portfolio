"""Generate the Open Graph preview images (1200x630) for both languages.
Run from the repository root:  python3 scripts/make-og.py
Uses the site's own self-hosted fonts and the profile photo. Requires Pillow."""
from PIL import Image, ImageDraw, ImageFont

FONTS = "src/assets/fonts/"
OUT = "src/assets/img/"
INK, MUTED, ACCENT, PAPER = (20, 33, 61), (86, 96, 116), (11, 85, 99), (250, 250, 247)

COPY = {
    "en": ("Connecting technology, data and AI to business transformation.",
           "Technology Consulting · AI & Data", "Financial Services"),
    "pt": ("Conectando tecnologia, dados e IA à transformação dos negócios.",
           "Consultoria em Tecnologia · IA & Dados", "Serviços Financeiros"),
}

serif = ImageFont.truetype(FONTS + "source-serif-4-latin-600-normal.woff2", 50)
name_f = ImageFont.truetype(FONTS + "ibm-plex-sans-latin-600-normal.woff2", 34)
mono = ImageFont.truetype(FONTS + "ibm-plex-mono-latin-400-normal.woff2", 22)
small = ImageFont.truetype(FONTS + "ibm-plex-sans-latin-400-normal.woff2", 24)

photo = Image.open(OUT + "edvan-640.jpg").convert("RGB")
ph_w = 250
photo = photo.resize((ph_w, int(ph_w * photo.height / photo.width)), Image.LANCZOS)

def wrap(draw, text, font, width):
    lines, line = [], ""
    for word in text.split():
        trial = (line + " " + word).strip()
        if draw.textlength(trial, font=font) <= width:
            line = trial
        else:
            lines.append(line); line = word
    return lines + [line]

for lang, (statement, eyebrow1, eyebrow2) in COPY.items():
    im = Image.new("RGB", (1200, 630), PAPER)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 1200, 10), fill=ACCENT)
    x, text_w = 72, 1200 - 72 - ph_w - 72 - 56
    d.text((x, 84), eyebrow1.upper(), font=mono, fill=ACCENT)
    d.text((x, 116), eyebrow2.upper(), font=mono, fill=ACCENT)
    d.text((x, 176), "Edvan Figuerêdo Araujo", font=name_f, fill=INK)
    y = 262
    for line in wrap(d, statement, serif, text_w):
        d.text((x, y), line, font=serif, fill=INK); y += 62
    d.line((x, y + 30, x + 80, y + 30), fill=INK, width=3)
    d.text((x, y + 52), "edvanfigueredo.github.io/Portfolio", font=small, fill=MUTED)
    ph_h = min(photo.height, 400)
    im.paste(photo.crop((0, 0, ph_w, ph_h)), (1200 - ph_w - 72, (630 - ph_h) // 2))
    im.save(f"{OUT}og-{lang}.jpg", quality=86, optimize=True, progressive=True)
    print("written", f"{OUT}og-{lang}.jpg")
