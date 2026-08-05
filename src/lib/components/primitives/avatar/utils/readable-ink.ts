/**
 * Picks a foreground (`#000000` or `#ffffff`) that maximizes contrast against a
 * solid hex background, using the sRGB relative-luminance formula from WCAG 2.
 *
 * The threshold (0.179) is the luminance where black and white give *equal*
 * contrast, so always choosing the better of the two guarantees at least
 * ~4.58:1 — above the 4.5:1 AA floor for normal text — for any input color.
 *
 * Accepts `#rgb` or `#rrggbb`; anything unparsable falls back to white.
 */
export function readableInk(hexColor: string): '#000000' | '#ffffff' {
	const hex = hexColor.replace('#', '');
	const full =
		hex.length === 3
			? hex
					.split('')
					.map((c) => c + c)
					.join('')
			: hex;

	if (!/^[0-9a-fA-F]{6}$/.test(full)) return '#ffffff';

	const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
	const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
	const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

	return luminance > 0.179 ? '#000000' : '#ffffff';
}
