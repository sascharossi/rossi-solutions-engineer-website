"""Erzeugt die Website-Varianten des Hero-Fotos aus originals/sascha-original.webp.

Nur Skalierung (Lanczos) und Neu-Kodierung: kein Nachschärfen, keine Retusche, kein Zuschnitt.
Das ICC-Farbprofil des Originals bleibt erhalten, EXIF/Metadaten werden nicht übernommen.

Aufruf (aus dem Projektordner):  python3 scripts/optimize-hero.py
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "originals" / "sascha-original.webp"
OUT = ROOT / "public" / "img"
WIDTHS = [448, 640, 832]  # 2x der dargestellten Breiten 224 / 288-320 / 384-416 CSS-Pixel
QUALITY = {"avif": 72, "webp": 88, "jpg": 88}


def psnr(a: Image.Image, b: Image.Image) -> float:
    x = np.asarray(a.convert("RGB"), dtype=np.float64)
    y = np.asarray(b.convert("RGB"), dtype=np.float64)
    mse = np.mean((x - y) ** 2)
    return 99.0 if mse == 0 else 10 * np.log10(255.0**2 / mse)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC)
    icc = src.info.get("icc_profile")
    src = src.convert("RGB")
    w0, h0 = src.size
    print(f"Original: {w0}x{h0}, {SRC.stat().st_size / 1024:.0f} KB")
    for w in WIDTHS:
        h = round(h0 * w / w0)
        ref = src.resize((w, h), Image.LANCZOS)
        for ext, q in QUALITY.items():
            path = OUT / f"sascha-{w}.{ext}"
            kw = {"icc_profile": icc} if icc else {}
            if ext == "avif":
                ref.save(path, "AVIF", quality=q, speed=4, **kw)
            elif ext == "webp":
                ref.save(path, "WEBP", quality=q, method=6, **kw)
            else:
                ref.save(path, "JPEG", quality=q, optimize=True, progressive=True, **kw)
            dec = Image.open(path).convert("RGB")
            assert dec.size == (w, h)
            print(f"  {path.name:20s} {w}x{h}  {path.stat().st_size / 1024:6.1f} KB  PSNR {psnr(ref, dec):5.1f} dB")


if __name__ == "__main__":
    main()
