import type { ReactiveController, ReactiveControllerHost } from 'lit';

import type { HomeAssistant } from '../types/ha';
import type { QueuePayload } from '../types/payload';
import { fetchQueue, QueueNotFoundError } from './queue-store';

const REFRESH_MS = 60_000;
const TICK_MS = 20_000;

export type QueueError = 'no_entity' | 'not_found' | 'failed';

export class QueueController implements ReactiveController {
  payload: QueuePayload | undefined;
  error: QueueError | undefined;
  now = Date.now();

  private hass: HomeAssistant | undefined;
  private entityId: string | undefined;
  private days = 1;
  private version = '';
  private requested = '';
  private refreshTimer: ReturnType<typeof setInterval> | undefined;
  private tickTimer: ReturnType<typeof setInterval> | undefined;

  constructor(private readonly host: ReactiveControllerHost) {
    host.addController(this);
  }

  hostConnected(): void {
    this.refreshTimer = setInterval(() => this.load(true), REFRESH_MS);
    this.tickTimer = setInterval(() => {
      this.now = Date.now();
      this.host.requestUpdate();
    }, TICK_MS);
  }

  hostDisconnected(): void {
    clearInterval(this.refreshTimer);
    clearInterval(this.tickTimer);
  }

  sync(hass: HomeAssistant, entityId: string | undefined, days: number): void {
    this.hass = hass;

    if (!entityId) {
      this.payload = undefined;
      this.error = 'no_entity';

      return;
    }

    const version = hass.states[entityId]?.last_updated ?? '';
    const changed = entityId !== this.entityId || days !== this.days || version !== this.version;

    this.entityId = entityId;
    this.days = days;
    this.version = version;

    if (changed) {
      this.load(false);
    }
  }

  private load(force: boolean): void {
    const { hass, entityId } = this;

    if (!hass || !entityId) {
      return;
    }

    const version = force ? `${this.version}|${Date.now()}` : this.version;
    const request = `${entityId}|${this.days}|${version}`;

    if (!force && request === this.requested) {
      return;
    }

    this.requested = request;
    fetchQueue(hass, entityId, this.days, version)
      .then((payload) => {
        this.payload = payload;
        this.error = undefined;
      })
      .catch((error: unknown) => {
        this.error = error instanceof QueueNotFoundError ? 'not_found' : 'failed';
      })
      .finally(() => {
        this.now = Date.now();
        this.host.requestUpdate();
      });
  }
}
