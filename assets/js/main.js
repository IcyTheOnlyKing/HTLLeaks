import galleryItems from './gallery-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.querySelector('#gallery');
  const filterContainer = document.querySelector('#filters');
  const searchInput = document.querySelector('#search');
  const backdrop = document.querySelector('#backdrop');
  const backdropMedia = document.querySelector('#backdrop-media');
  const backdropTitle = document.querySelector('#backdrop-title');
  const backdropDescription = document.querySelector('#backdrop-description');
  const backdropTags = document.querySelector('#backdrop-tags');

  if (!galleryContainer) return;

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
    button.className = `filter-chip px-4 py-2 fw-medium text-sm text-slate-200 d-inline-flex align-items-center gap-2 ${active ? 'active' : ''}`;
    button.dataset.filter = value;
    button.innerHTML = `<i class="bi bi-sliders"></i>${label}`;
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.remove('active'));
      button.classList.add('active');
      applyFilter();
    });
    return button;
  };

  const createGalleryCard = (item) => {
    const card = document.createElement('div');
    card.className = 'glass-card gallery-item';
    card.dataset.tags = (item.tags || []).map((tag) => tag.toLowerCase()).join(',');
    card.dataset.type = item.type;
    card.dataset.title = item.title.toLowerCase();
    card.dataset.description = (item.description || '').toLowerCase();

    const media = document.createElement(item.type === 'video' ? 'video' : 'img');
    media.src = item.src;
    if (item.type === 'video') {
      media.controls = false;
      media.muted = true;
      media.loop = true;
      media.autoplay = true;
      media.playsInline = true;
      media.poster = item.poster || '';
    } else {
      media.alt = item.title;
      media.loading = 'lazy';
    }

    const meta = document.createElement('div');
    meta.className = 'gallery-meta';
    meta.innerHTML = `
      <div class="fw-semibold fs-5 mb-1">${item.title}</div>
      <span>${item.type === 'video' ? 'Video' : 'Foto'}</span>
    `;

    card.appendChild(media);
    card.appendChild(meta);

    card.addEventListener('click', () => openBackdrop(item));

    return card;
  };

  const renderGallery = (items) => {
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
      const matchesFilter = selectedFilter === 'all' || (item.tags || []).map((tag) => tag.toLowerCase()).includes(selectedFilter);
      const matchesQuery = !query || item.title.toLowerCase().includes(query) || (item.description || '').toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });

    renderGallery(filteredItems);
  };

  const openBackdrop = (item) => {
    backdropMedia.innerHTML = '';
    if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.poster = item.poster || '';
      video.className = 'w-100';
      backdropMedia.appendChild(video);
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
