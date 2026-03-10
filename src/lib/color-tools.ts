export type ColorFormatResult =
  | {
      ok: true;
      hex: string;
      rgb: string;
      hsl: string;
    }
  | {
      ok: false;
      error: string;
    };

type Rgb = { r: number; g: number; b: number };

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, value));
}

function normalizeHex(hex: string) {
  const trimmed = hex.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    return trimmed
      .split("")
      .map((char) => char + char)
      .join("")
      .toUpperCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  return null;
}

function hexToRgb(hex: string): Rgb {
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function parseRgb(input: string): Rgb | null {
  const match = input.trim().match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (!match) {
    return null;
  }
  const channels = match.slice(1).map((value) => Number.parseInt(value, 10));
  if (channels.some((value) => Number.isNaN(value) || value < 0 || value > 255)) {
    return null;
  }
  return { r: channels[0], g: channels[1], b: channels[2] };
}

function parseHsl(input: string): Rgb | null {
  const match = input
    .trim()
    .match(/^hsl\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
  if (!match) {
    return null;
  }

  let hue = Number.parseFloat(match[1]);
  const saturation = Number.parseInt(match[2], 10);
  const lightness = Number.parseInt(match[3], 10);
  if (
    Number.isNaN(hue) ||
    Number.isNaN(saturation) ||
    Number.isNaN(lightness) ||
    saturation < 0 ||
    saturation > 100 ||
    lightness < 0 ||
    lightness > 100
  ) {
    return null;
  }

  hue = ((hue % 360) + 360) % 360;
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;
  if (hue < 60) {
    rPrime = c;
    gPrime = x;
  } else if (hue < 120) {
    rPrime = x;
    gPrime = c;
  } else if (hue < 180) {
    gPrime = c;
    bPrime = x;
  } else if (hue < 240) {
    gPrime = x;
    bPrime = c;
  } else if (hue < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return {
    r: clampChannel(Math.round((rPrime + m) * 255)),
    g: clampChannel(Math.round((gPrime + m) * 255)),
    b: clampChannel(Math.round((bPrime + m) * 255)),
  };
}

function rgbToHex({ r, g, b }: Rgb) {
  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function rgbToHsl({ r, g, b }: Rgb) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  if (delta !== 0) {
    if (max === rn) {
      hue = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      hue = (bn - rn) / delta + 2;
    } else {
      hue = (rn - gn) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) {
      hue += 360;
    }
  }

  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  return `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
}

export function convertColorInput(input: string): ColorFormatResult {
  const normalized = input.trim();
  if (!normalized) {
    return {
      ok: false,
      error: "변환할 색상 값을 입력해 주세요.",
    };
  }

  let rgb: Rgb | null = null;
  const hex = normalizeHex(normalized);
  if (hex) {
    rgb = hexToRgb(hex);
  } else {
    rgb = parseRgb(normalized) ?? parseHsl(normalized);
  }

  if (!rgb) {
    return {
      ok: false,
      error: "HEX, RGB, HSL 형식 중 하나로 올바른 값을 입력해 주세요.",
    };
  }

  return {
    ok: true,
    hex: rgbToHex(rgb),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: rgbToHsl(rgb),
  };
}
