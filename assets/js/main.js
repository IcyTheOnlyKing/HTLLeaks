import { loadGalleryItems } from './gallery-data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const galleryContainer = document.querySelector('#gallery');
  const filterContainer = document.querySelector('#filters');
  const searchInput = document.querySelector('#search');
  const backdrop = document.querySelector('#backdrop');
  const backdropMedia = document.querySelector('#backdrop-media');
  const backdropTitle = document.querySelector('#backdrop-title');
  const backdropDescription = document.querySelector('#backdrop-description');
  const backdropTags = document.querySelector('#backdrop-tags');

  if (!galleryContainer) return;

  let galleryItems = [];

  try {
    galleryItems = await loadGalleryItems();
  } catch (error) {
    console.error('Die Galerie konnte nicht geladen werden.', error);
  }

  const tags = Array.from(new Set(galleryItems.flatMap((item) => item.tags || [])));
  tags.sort();

  const renderFilters = () => {
    filterContainer.innerHTML = '';

    const allButton = createFilterChip('Alle', 'all', true);
    filterContainer.appendChild(allButton);

    tags.forEach((tag) => {
      filterContainer.appendChild(createFilterChip(tag, tag.toLowerCase()));
    });
  };

  const createFilterChip = (label, value, active = false) => {
    const button = document.createElement('button');
    button.className = `filter-chip px-4 py-2 fw-medium text-sm text-slate-200 d-inline-flex align-items-center gap-2 ${active ?
 'active' : ''}`;
    button.dataset.filter = value;
    button.innerHTML = `<i class="bi bi-sliders"></i>${label}`;
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.remove('active'));
      button.classList.add('active');
      applyFilter();
    });
    return button;
  };

  const setBackdropLayout = (type = 'image') => {
    if (type === 'audio') {
      backdropMedia.className = 'audio-backdrop bg-dark d-flex align-items-center justify-content-center p-4';
    } else {
      backdropMedia.className = 'ratio ratio-16x9 bg-dark';
    }
  };

  const createGalleryCard = (item) => {
    const card = document.createElement('div');
    card.className = `glass-card gallery-item ${item.type}`;
    card.dataset.tags = (item.tags || []).map((tag) => tag.toLowerCase()).join(',');
    card.dataset.type = item.type;
    card.dataset.title = item.title.toLowerCase();
    card.dataset.description = (item.description || '').toLowerCase();

    if (item.type === 'video') {
      const media = document.createElement('video');
      media.src = item.src;
      media.controls = false;
      media.muted = true;
      media.loop = true;
      media.autoplay = true;
      media.playsInline = true;
      media.poster = item.poster || '';
      card.appendChild(media);
    } else if (item.type === 'audio') {
      const placeholder = document.createElement('div');
      placeholder.className = 'audio-placeholder';
      placeholder.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
      card.appendChild(placeholder);
    } else {
      const media = document.createElement('img');
      media.src = item.src;
      media.alt = item.title;
      media.loading = 'lazy';
      card.appendChild(media);
    }

    const meta = document.createElement('div');
    meta.className = 'gallery-meta';
    const typeLabel = item.type === 'video' ? 'Video' : item.type === 'audio' ? 'Audio' : 'Foto';
    meta.innerHTML = `
      <div class="fw-semibold fs-5 mb-1">${item.title}</div>
      <span>${typeLabel}</span>
    `;

    card.appendChild(meta);

    card.addEventListener('click', () => openBackdrop(item));

    return card;
  };

  const renderGallery = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      const hasSourceItems = Array.isArray(galleryItems) && galleryItems.length > 0;
      const message = hasSourceItems
        ? 'Keine Treffer gefunden. Passe deine Filter oder die Suche an.'
        : 'Keine Medien gefunden. Ergänze Dateien im Ordner <code>assets/gallery</code> und führe <code>npm run generate:manifest</code> aus.';

      galleryContainer.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-folder-x"></i>
          <p class="mb-0">${message}</p>
        </div>
      `;
      return;
    }

    galleryContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    items.forEach((item) => fragment.appendChild(createGalleryCard(item)));
    galleryContainer.appendChild(fragment);
  };

  const applyFilter = () => {
    const activeChip = filterContainer.querySelector('.filter-chip.active');
    const selectedFilter = activeChip ? activeChip.dataset.filter : 'all';
    const query = (searchInput.value || '').trim().toLowerCase();

    const filteredItems = galleryItems.filter((item) => {
      const normalisedTags = (item.tags || []).map((tag) => tag.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || normalisedTags.includes(selectedFilter);
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });

    renderGallery(filteredItems);
  };

  const openBackdrop = (item) => {
    setBackdropLayout(item.type);
    backdropMedia.innerHTML = '';
    if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.poster = item.poster || '';
      video.playsInline = true;
      video.className = 'w-100';
      backdropMedia.appendChild(video);
    } else if (item.type === 'audio') {
      const audio = document.createElement('audio');
      audio.src = item.src;
      audio.controls = true;
      audio.autoplay = true;
      audio.className = 'w-100 audio-player';
      backdropMedia.appendChild(audio);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title;
      img.className = 'w-100';
      backdropMedia.appendChild(img);
    }

    backdropTitle.textContent = item.title;
    backdropDescription.textContent = item.description || '';
    backdropTags.innerHTML = '';
    (item.tags || []).forEach((tag) => {
      const badge = document.createElement('span');
      badge.className = 'badge rounded-pill text-bg-primary-subtle text-primary-emphasis me-2';
      badge.textContent = tag;
      backdropTags.appendChild(badge);
    });

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeBackdrop = () => {
    backdrop.classList.remove('active');
    backdropMedia.innerHTML = '';
    setBackdropLayout();
    document.body.style.overflow = '';
  };

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop || event.target.dataset.action === 'close-backdrop') {
      closeBackdrop();
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape' && backdrop.classList.contains('active')) {
      closeBackdrop();
    }
  });

  searchInput.addEventListener('input', () => {
    window.requestAnimationFrame(applyFilter);
  });

  renderFilters();
  renderGallery(galleryItems);
});
