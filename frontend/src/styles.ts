import { css } from 'lit';

export const tokens = css`
  :host {
    --bo-on: var(--blackout-on-color, var(--success-color, #43a047));
    --bo-off: var(--blackout-off-color, #ff7a59);
    --bo-possible: var(--blackout-possible-color, var(--warning-color, #ffa600));
    --bo-emergency: var(--blackout-emergency-color, var(--bo-off));
    --bo-battery: var(--blackout-battery-color, var(--success-color, #43a047));
    --bo-unknown: var(
      --blackout-unknown-color,
      color-mix(in srgb, var(--primary-text-color) 12%, transparent)
    );
    --bo-text: var(--primary-text-color);
    --bo-muted: var(--secondary-text-color);
    --bo-faint: color-mix(in srgb, var(--primary-text-color) 45%, transparent);
    --bo-surface: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    --bo-divider: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    --bo-track: color-mix(in srgb, var(--bo-on) 22%, transparent);
    --bo-track-strong: color-mix(in srgb, var(--bo-on) 32%, transparent);
    --bo-mono: var(
      --blackout-mono-font,
      ui-monospace,
      'SF Mono',
      'JetBrains Mono',
      Menlo,
      Consolas,
      monospace
    );
    --bo-hatch: repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--bo-off) 75%, transparent) 0 3px,
      transparent 3px 6px
    );
    --bo-hatch-skipped: repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--bo-off) 65%, transparent) 0 2px,
      transparent 2px 6px
    );
    --bo-hatch-muted: repeating-linear-gradient(
      -45deg,
      var(--bo-unknown) 0 3px,
      transparent 3px 6px
    );
    display: block;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
    }
  }
`;

export const cardStyles = css`
  ha-card {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    padding: 18px 20px 16px;
    overflow: hidden;
    container-type: inline-size;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 28px;
    margin-bottom: 14px;
    cursor: default;
  }

  .header.clickable {
    cursor: pointer;
  }

  .title {
    min-width: 0;
    overflow: hidden;
    color: var(--bo-muted);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    line-height: 16px;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .header-side {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    color: var(--bo-muted);
    font-size: 12px;
  }

  .badge {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 10px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--tone) 16%, transparent);
    color: var(--tone);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .badge::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .badge.solid {
    background: var(--tone);
    color: var(--text-primary-color, #fff);
  }

  .badge.solid::before {
    display: none;
  }

  .badge ha-icon {
    --mdc-icon-size: 14px;
  }

  .badge.plain {
    background: var(--bo-surface);
    color: var(--bo-text);
  }

  .badge.plain::before {
    display: none;
  }

  .tone-on {
    --tone: var(--bo-on);
  }

  .tone-off {
    --tone: var(--bo-off);
  }

  .tone-possible {
    --tone: var(--bo-possible);
  }

  .tone-emergency {
    --tone: var(--bo-emergency);
  }

  .tone-muted {
    --tone: var(--bo-muted);
  }

  .mono {
    font-family: var(--bo-mono);
    font-variant-numeric: tabular-nums;
  }

  .muted {
    color: var(--bo-muted);
  }

  .divider {
    height: 1px;
    margin: 16px 0 14px;
    background: var(--bo-divider);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(var(--stat-columns, 4), minmax(0, 1fr));
    gap: 10px 14px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .stat-label {
    overflow: hidden;
    color: var(--bo-muted);
    font-size: 11px;
    line-height: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stat-value {
    overflow: hidden;
    color: var(--tone, var(--bo-text));
    font-family: var(--bo-mono);
    font-size: 15px;
    font-weight: 600;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stat-note {
    overflow: hidden;
    color: var(--bo-muted);
    font-family: var(--bo-mono);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stat-value .unit,
  .unit {
    margin-left: 3px;
    color: var(--bo-muted);
    font-family: var(--paper-font-body1_-_font-family, inherit);
    font-size: 11px;
    font-weight: 400;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
    color: var(--bo-muted);
    font-size: 11px;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }

  .swatch.on,
  .fill-on {
    background: var(--bo-track-strong);
  }

  .swatch.off,
  .fill-off {
    background: var(--bo-off);
  }

  .swatch.possible,
  .fill-possible {
    background: color-mix(in srgb, var(--bo-possible) 70%, transparent);
  }

  .swatch.unknown,
  .fill-unknown {
    background: var(--bo-unknown);
  }

  .swatch.hatch,
  .fill-hatch {
    background: var(--bo-hatch);
  }

  .swatch.skipped,
  .fill-skipped {
    background: var(--bo-hatch-skipped), var(--bo-track-strong);
  }

  .swatch.hatch-muted,
  .fill-hatch-muted {
    background: var(--bo-hatch-muted);
  }

  .hover-band {
    position: absolute;
    z-index: 1;
    border-radius: 3px;
    box-shadow: 0 0 0 1.5px var(--bo-text);
    pointer-events: none;
  }

  .hover-tip {
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px 10px;
    border: 1px solid var(--bo-divider);
    border-radius: 8px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1e));
    box-shadow: 0 6px 18px rgb(0 0 0 / 30%);
    color: var(--bo-muted);
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - 8px));
  }

  .hover-tip.start {
    transform: translate(-16px, calc(-100% - 8px));
  }

  .hover-tip.end {
    transform: translate(calc(-100% + 16px), calc(-100% - 8px));
  }

  .hover-title {
    color: var(--bo-text);
    font-family: var(--bo-mono);
    font-weight: 600;
  }

  .hover-line {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .hover-line .swatch {
    flex: none;
  }

  .message {
    padding: 8px 0;
    color: var(--bo-muted);
    font-size: 13px;
  }

  .message.error {
    color: var(--error-color);
  }

  @container (max-width: 360px) {
    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

export const barStyles = css`
  .row {
    display: grid;
    grid-template-columns: var(--row-label-width, 56px) minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }

  .row-label {
    overflow: hidden;
    color: var(--bo-muted);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bar {
    position: relative;
    height: var(--bar-height, 14px);
    border-radius: 3px;
    background: var(--bo-surface);
  }

  .seg {
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .seg:first-child {
    border-radius: 3px 0 0 3px;
  }

  .seg.future {
    opacity: 0.45;
  }

  .fill-actual {
    background: var(--bo-off);
  }

  .fill-faint {
    background: transparent;
  }

  .fill-battery {
    background: var(--bo-battery);
    border-radius: 3px;
  }

  .fill-battery-low {
    background: var(--bo-possible);
    border-radius: 3px;
  }

  .now {
    position: absolute;
    top: -4px;
    bottom: -4px;
    width: 2px;
    border-radius: 1px;
    background: var(--bo-text);
    transform: translateX(-1px);
    pointer-events: none;
  }

  .bar-text {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-left: 8px;
    overflow: hidden;
    color: color-mix(in srgb, #000 80%, var(--bo-battery));
    font-family: var(--bo-mono);
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
  }

  .axis {
    margin-top: 6px;
  }

  .ticks {
    position: relative;
    height: 14px;
  }

  .tick {
    position: absolute;
    color: var(--bo-faint);
    font-size: 10px;
    transform: translateX(-50%);
  }

  .tick:first-child {
    transform: none;
  }

  .tick:last-child {
    transform: translateX(-100%);
  }
`;
