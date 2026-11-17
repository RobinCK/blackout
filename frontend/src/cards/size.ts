export const CARD_SIZES = ['small', 'medium', 'large'] as const;

export type CardSize = (typeof CARD_SIZES)[number];

export type SizeSetting = CardSize | 'auto';

export const SIZE_ROWS: Readonly<Record<CardSize, number>> = {
  small: 3,
  medium: 6,
  large: 9,
};

const ROW_HEIGHT = 56;
const ROW_GAP = 8;
const CARD_SIZE_UNIT = 50;
const CARD_CHROME = 36;

export function rowsHeight(rows: number): number {
  return rows * (ROW_HEIGHT + ROW_GAP) - ROW_GAP;
}

export function rowsCardSize(rows: number): number {
  return Math.ceil(rowsHeight(rows) / CARD_SIZE_UNIT);
}

export function contentHeight(size: CardSize): number {
  return rowsHeight(SIZE_ROWS[size]) - CARD_CHROME;
}

export function sizesBetween(min: CardSize, max: CardSize): readonly CardSize[] {
  return CARD_SIZES.slice(CARD_SIZES.indexOf(min), CARD_SIZES.indexOf(max) + 1);
}

export function clampSize(size: SizeSetting, min: CardSize, max: CardSize): SizeSetting {
  if (size === 'auto') {
    return size;
  }

  if (CARD_SIZES.indexOf(size) < CARD_SIZES.indexOf(min)) {
    return min;
  }

  return CARD_SIZES.indexOf(size) > CARD_SIZES.indexOf(max) ? max : size;
}

export function sizeRows(size: SizeSetting): number | undefined {
  return size === 'auto' ? undefined : SIZE_ROWS[size];
}

export function tierOf(rows: number | undefined): SizeSetting {
  if (rows === undefined) {
    return 'auto';
  }

  if (rows >= SIZE_ROWS.large) {
    return 'large';
  }

  return rows >= SIZE_ROWS.medium ? 'medium' : 'small';
}

export function isSizeSetting(value: unknown): value is SizeSetting {
  return value === 'auto' || CARD_SIZES.some((size) => size === value);
}

export function gridRows(config: object): number | undefined {
  const options: unknown = (config as { readonly grid_options?: unknown }).grid_options;

  if (typeof options !== 'object' || options === null) {
    return undefined;
  }

  const rows: unknown = (options as { readonly rows?: unknown }).rows;

  return typeof rows === 'number' && Number.isFinite(rows) && rows >= 1
    ? Math.round(rows)
    : undefined;
}
