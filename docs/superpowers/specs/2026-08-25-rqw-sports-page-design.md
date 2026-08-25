# RQW Sports Product Page Design

## Goal

Add a new `/rqw-sports` page that follows the visual structure of the existing public `/rqw` page while presenting the 53 supplied sports, toy, fitness, swimming, fishing, and outdoor product images.

## Confirmed scope

- Keep the existing public site, homepage, data integrations, and `/rqw` behavior unchanged.
- Add a standalone `/rqw-sports` route.
- Preserve every supplied product image without generative redraw, stretching, or subject cropping.
- Normalize all product images to the same 1200 × 900 canvas.
- Normalize perceived subject scale by trimming source whitespace and fitting the detected subject inside a shared safe area.
- Reserve a shared top-left brand zone and render `RQW` in black serif type at a fixed size and position matching the supplied reference.
- Use the Chinese source filenames as evidence of product identity and provide concise English product names on the English page. Do not invent dimensions, prices, MOQ, specifications, certifications, or commercial promises.
- Render three equal cards per row on desktop, two on tablet, and one on a 390 px phone.

## Image normalization

Each source image is analyzed against its background to find the visible product bounds. The subject is cropped only to remove surrounding whitespace, never through visible product pixels. It is then proportionally fitted inside a shared content safe area below the `RQW` mark. Wide, tall, and slender products use the same maximum fit box, so their aspect ratios remain intact while their dominant dimension reaches a consistent visual limit.

All deliverables use a white 1200 × 900 canvas. `RQW` is rendered at the same top-left coordinates and font size on every image. The output filename is a stable ASCII slug derived from the product manifest, while the original Chinese filename remains recorded in the manifest for traceability.

## Page structure

The route uses a focused catalog page rather than modifying the main multilingual product database. It contains:

1. A restrained RQW header area identifying the collection.
2. A responsive catalog grid containing all 53 supplied products.
3. Equal-height white product cards with a fixed 4:3 image stage and the product name below.

The page intentionally omits unsupported prices, sizes, purchase claims, and product details.

## Verification

- Automated tests verify the route metadata, product count, unique slugs, source-name traceability, `RQW` brand text, and responsive grid hooks.
- Asset tests verify that all 53 generated PNG files exist and have exactly 1200 × 900 dimensions.
- The image normalization script produces an audit JSON containing the detected source bounds and final placement for every product.
- Browser verification covers desktop and 390 px mobile screenshots, product-card consistency, overflow, console errors, and visual spot checks across wide, tall, pale, and irregular products.

