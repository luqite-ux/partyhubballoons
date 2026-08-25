#!/usr/bin/env python3
"""Normalize the supplied RQW catalog images without altering product geometry."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageOps


CANVAS = (1200, 900)
CONTENT_BOX = (48, 128, 1152, 852)
BRAND_BOX = (48, 34, 226, 107)
FONT_PATH = Path(r"C:\Windows\Fonts\times.ttf")
MANIFEST_PATTERN = re.compile(
    r'^\s*\["(?P<slug>[^"]+)",\s*"(?P<source>[^"]+)",\s*"(?P<name>[^"]+)"\],\s*$',
    re.MULTILINE,
)


def parse_manifest(path: Path) -> list[dict[str, str]]:
    text = path.read_text(encoding="utf-8")
    products = [match.groupdict() for match in MANIFEST_PATTERN.finditer(text)]
    if len(products) != 53:
        raise ValueError(f"Expected 53 products in {path}, found {len(products)}")
    return products


def flatten_to_white(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    white = Image.new("RGBA", rgba.size, "white")
    white.alpha_composite(rgba)
    return white.convert("RGB")


def detect_subject_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    white = Image.new("RGB", image.size, "white")
    difference = ImageChops.difference(image, white).convert("L")
    foreground = difference.point(lambda value: 255 if value > 9 else 0)
    bounds = foreground.getbbox()
    if bounds is None:
        raise ValueError("No visible product pixels detected")

    margin = max(4, round(min(image.size) * 0.012))
    left, top, right, bottom = bounds
    return (
        max(0, left - margin),
        max(0, top - margin),
        min(image.width, right + margin),
        min(image.height, bottom + margin),
    )


def fit_subject(subject: Image.Image) -> tuple[Image.Image, tuple[int, int, int, int]]:
    content_width = CONTENT_BOX[2] - CONTENT_BOX[0]
    content_height = CONTENT_BOX[3] - CONTENT_BOX[1]
    fitted = ImageOps.contain(
        subject,
        (content_width, content_height),
        method=Image.Resampling.LANCZOS,
    )
    left = CONTENT_BOX[0] + (content_width - fitted.width) // 2
    top = CONTENT_BOX[1] + (content_height - fitted.height) // 2
    return fitted, (left, top, left + fitted.width, top + fitted.height)


def render_product(source: Path, output: Path) -> dict[str, object]:
    with Image.open(source) as opened:
        image = flatten_to_white(opened)

    detected_bounds = detect_subject_bounds(image)
    subject = image.crop(detected_bounds)
    fitted, placed_bounds = fit_subject(subject)

    canvas = Image.new("RGB", CANVAS, "white")
    canvas.paste(fitted, placed_bounds[:2])
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype(str(FONT_PATH), 74)
    draw.text((BRAND_BOX[0], BRAND_BOX[1]), "RQW", fill="black", font=font)

    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, format="PNG", optimize=True)
    return {
        "source": source.name,
        "output": output.name,
        "sourceSize": list(image.size),
        "detectedBounds": list(detected_bounds),
        "placedBounds": list(placed_bounds),
        "brandBox": list(BRAND_BOX),
        "canvas": list(CANVAS),
    }


def build_contact_sheet(outputs: list[Path], destination: Path) -> None:
    thumb_size = (280, 210)
    columns = 4
    rows = (len(outputs) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * thumb_size[0], rows * thumb_size[1]), "#f5f1f4")
    for index, output in enumerate(outputs):
        with Image.open(output) as image:
            thumb = image.convert("RGB").resize(thumb_size, Image.Resampling.LANCZOS)
        x = (index % columns) * thumb_size[0]
        y = (index // columns) * thumb_size[1]
        sheet.paste(thumb, (x, y))
    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(destination, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--audit", type=Path, required=True)
    parser.add_argument("--contact-sheet", type=Path, required=True)
    args = parser.parse_args()

    if not FONT_PATH.exists():
        raise FileNotFoundError(f"Required serif font is missing: {FONT_PATH}")

    products = parse_manifest(args.manifest)
    expected_sources = {product["source"] for product in products}
    actual_sources = {path.name for path in args.source_dir.iterdir() if path.is_file()}
    if expected_sources != actual_sources:
        missing = sorted(expected_sources - actual_sources)
        unexpected = sorted(actual_sources - expected_sources)
        raise ValueError(f"Source mismatch. Missing={missing}; unexpected={unexpected}")

    audit: list[dict[str, object]] = []
    outputs: list[Path] = []
    for product in products:
        source = args.source_dir / product["source"]
        output = args.output_dir / f'{product["slug"]}.png'
        audit.append(render_product(source, output))
        outputs.append(output)

    args.audit.parent.mkdir(parents=True, exist_ok=True)
    args.audit.write_text(
        json.dumps(audit, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    build_contact_sheet(outputs, args.contact_sheet)


if __name__ == "__main__":
    main()
