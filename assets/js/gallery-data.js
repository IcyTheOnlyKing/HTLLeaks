const fallbackItems = [
  {
    type: 'image',
    title: 'Neon Skyline',
    description: 'Stimmungsvoller Blick über eine futuristische Stadt bei Nacht.',
    src: 'assets/gallery/sample-1.svg',
    tags: ['Image']
  },
  {
    type: 'image',
    title: 'Ocean Dreams',
    description: 'Ein abstraktes Spiel aus Cyan- und Blautönen, inspiriert vom Meer.',
    src: 'assets/gallery/sample-2.svg',
    tags: ['Image']
  },
  {
    type: 'image',
    title: 'Golden Hour',
    description: 'Warme Abendsonne trifft auf kräftige Orangetöne und moderne Typografie.',
    src: 'assets/gallery/sample-3.svg',
    tags: ['Image']
  }
];

const MANIFEST_PATH = 'assets/gallery/gallery-manifest.json';

const normaliseItem = (item) => {
  const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];

  return {
    type: item.type || 'image',
    title: item.title || 'Unbenanntes Medium',
    description: item.description || '',
    src: item.src,
    poster: item.poster || '',
    tags
  };
};

export async function loadGalleryItems() {
  try {
    const response = await fetch(MANIFEST_PATH, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Manifest konnte nicht geladen werden (${response.status})`);
    }

    const manifest = await response.json();
    if (!Array.isArray(manifest.items)) {
      throw new Error('Ungültiges Manifest-Format: "items" fehlt.');
    }

    const items = manifest.items
      .filter((item) => typeof item?.src === 'string')
      .map(normaliseItem);

    if (items.length === 0) {
      console.warn('Das Manifest ist leer – Fallback-Daten werden verwendet.');
      return fallbackItems;
    }

    return items;
  } catch (error) {
    console.warn('Konnte Manifest nicht laden, verwende Fallback-Daten.', error);
    return fallbackItems;
  }
}

export default loadGalleryItems;
