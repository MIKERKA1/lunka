"""Prepares the site photos: crops and resizes Unsplash originals into src/assets/photos.

Usage: python -I scripts/photos.py <folder with originals named photo-<id>.jpg>
Originals were downloaded from images.unsplash.com at 1800 px wide. The list of photos,
authors and licences lives in src/data/photos.ts; this script only knows file names and crops.
Hero tips are cropped here because the CSP forbids inline object-position styles.
"""
import sys
from pathlib import Path
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "photos"
TIP = 9 / 20  # width / height of a hero «nail»

# name: (unsplash photo id, crop) where crop is (centre x, top y, bottom y) as fractions, or None
PHOTOS = {
    "tip-square": ("photo-1709839454771-704f7af2ce0c", (0.40, 0.15, 0.80)),
    "tip-oval": ("photo-1612887390768-fb02affea7a6", (0.55, 0.05, 0.85)),
    "tip-almond": ("photo-1736434518489-0eb84070017f", (0.55, 0.00, 0.80)),
    "tip-french": ("photo-1762373349045-c2decd4ec3f3", (0.45, 0.20, 1.00)),
    "tip-red": ("photo-1660241657459-554031137e4f", (0.50, 0.00, 0.90)),
    "nude-fur": ("photo-1610992015762-45dca7fa3a85", None),
    "nude-white": ("photo-1630843599725-32ead7671867", None),
    "nude-pastel": ("photo-1688583417770-ff6cc18071dc", None),
    "nude-ring": ("photo-1587729927031-830c32f520da", None),
    "nude-ombre": ("photo-1704757671022-e023c45c9d2f", None),
    "nude-accent": ("photo-1648844421727-cde6c4246b13", None),
    "french-mug": ("photo-1667207229737-0adf3c700d5e", None),
    "french-blue": ("photo-1772322586702-73125782bd99", None),
    "french-lace": ("photo-1646335940123-b9008ebb358c", None),
    "french-classic": ("photo-1517837317028-6ce34fd27c34", None),
    "bright-red": ("photo-1748163432725-454f46f68340", None),
    "bright-watch": ("photo-1664650026748-698eefbdd325", None),
    "bright-cobalt": ("photo-1772322586634-9867476143b9", None),
    "bright-flower": ("photo-1561158317-757a4631770e", None),
    "bright-green": ("photo-1606168054091-74617220d1db", None),
    "design-winter": ("photo-1735236007245-9dc6e28bbe56", None),
    "design-tortoise": ("photo-1604654894610-df63bc536371", None),
    "design-abstract": ("photo-1571290274554-6a2eaa771e5f", None),
    "design-navy": ("photo-1754799670312-8e7da8e40ad7", None),
    "design-pearl": ("photo-1769687209448-025548dfca8b", None),
    "design-glitter": ("photo-1607779097040-26e80aa78e66", None),
    "pedi-pink": ("photo-1664643411326-6c589531be3c", None),
    "pedi-red": ("photo-1707725238063-0c54fb6963d1", None),
    "pedi-blue": ("photo-1668237150532-945907c2450d", None),
    "pedi-navy": ("photo-1778098221994-015e8abb4336", None),
    "work-salon": ("photo-1632345031435-8727f6897d53", None),
    "work-tools": ("photo-1775500835259-d3b3f6d6e2f2", None),
    "work-pedicure": ("photo-1519419451778-14599a49ec41", None),
    "work-polish": ("photo-1619607146034-5a05296c8f9a", None),
    "work-marble": ("photo-1599206676335-193c82b13c9e", None),
    "master-anya": ("photo-1648844421753-351afd50486a", None),
}


def crop_tip(im: Image.Image, cx: float, top: float, bottom: float) -> Image.Image:
    h = (bottom - top) * im.height
    w = h * TIP
    left = min(max(cx * im.width - w / 2, 0), im.width - w)
    return im.crop((round(left), round(top * im.height), round(left + w), round(bottom * im.height)))


def main(src: Path) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (pid, crop) in PHOTOS.items():
        im = Image.open(src / f"{pid}.jpg").convert("RGB")
        if crop:
            im = crop_tip(im, *crop)
        im.thumbnail((1600, 1600), Image.LANCZOS)
        # Saved without EXIF: originals may carry camera and location metadata.
        im.save(OUT / f"{name}.jpg", quality=86, optimize=True, progressive=True)
        print(f"{name}: {im.width}x{im.height}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
