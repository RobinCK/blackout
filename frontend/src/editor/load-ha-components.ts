interface ConfigurableCard {
  getConfigElement?: () => Promise<unknown> | unknown;
}

const COMPONENT_SOURCES: Readonly<Record<string, string>> = {
  'ha-form': 'hui-button-card',
  'ha-entity-picker': 'hui-entities-card',
  'ha-expansion-panel': 'hui-tile-card',
};

async function loadEditorOf(cardTag: string): Promise<void> {
  const card = customElements.get(cardTag) as
    (CustomElementConstructor & ConfigurableCard) | undefined;

  await card?.getConfigElement?.();
}

export async function loadHaComponents(): Promise<void> {
  const missing = Object.entries(COMPONENT_SOURCES).filter(([tag]) => !customElements.get(tag));

  if (missing.length === 0) {
    return;
  }

  const helpers = await window.loadCardHelpers?.();

  if (!helpers) {
    return;
  }

  await Promise.all(
    missing.map(async ([, cardTag]) => {
      if (!customElements.get(cardTag)) {
        await helpers.createCardElement({ type: cardTag.replace(/^hui-|-card$/g, '') });
      }

      await loadEditorOf(cardTag);
    }),
  );
}
