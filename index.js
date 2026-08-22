const SUPABASE_URL = 'https://qsqenkvrerrbzibkjoml.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'sb_publishable_FLqzd6wXyc5e_veOYAVN9g_AXBaGASo';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
};

const channelClassMap = {
  'CenterofStream': 'ch-cos',
  'Music Video Channel - MVC': 'ch-mvc',
  'Streaming Game FR': 'ch-sgfr',
  'Stream Animation Zone': 'ch-saz',
  'Asta of Mitologi': 'ch-aom',
  'Toku Dungeon': 'ch-td',
  'CANAL 7': 'ch-c7',
  'CANAL 8': 'ch-c8',
  'Direct 9': 'ch-d9',
  'One by Furnality': 'ch-obf',
  'Furnality Radio': 'ch-radio'
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Menu Mobile
  const menuBtn = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // Chargement des données
  loadBroadcasts();
  loadShows();
  loadFooterLinks();
});

// 1. Récupération des antennes (broadcast)
async function loadBroadcasts() {
  try {
    const res = await fetch(`${SUPABASE_URL}/broadcast?select=*&order=id.asc`, { headers });
    const data = await res.json();

    const tvContainer = document.getElementById('tv-channels-grid');
    const radioContainer = document.getElementById('radio-channels-grid');

    if (!tvContainer || !radioContainer) return;

    tvContainer.innerHTML = '';
    radioContainer.innerHTML = '';

    data.forEach(item => {
      const isTv = item.broadcast_type === 'tv';
      const container = isTv ? tvContainer : radioContainer;

      const styleClass = channelClassMap[item.name] || '';
      const active = item.is_active && item.stream_url;

      const card = document.createElement(active ? 'a' : 'div');
      
      if (active) {
        card.href = item.stream_url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = `channel-card ${styleClass}`;
      } else {
        card.className = 'channel-card opacity-50 grayscale cursor-not-allowed';
        card.title = 'Inactif';
      }

      const imgHtml = item.logo_url 
        ? `<img src="${item.logo_url}" alt="${item.name}" class="h-10 mb-2 object-contain" />`
        : `<span class="text-sm font-bold mt-1 text-center leading-tight">${item.name}</span>`;

      card.innerHTML = imgHtml;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Erreur chargement broadcasts:', err);
  }
}

// 2. Récupération des programmes (shows)
async function loadShows() {
  try {
    const res = await fetch(`${SUPABASE_URL}/shows?select=*&order=id.asc`, { headers });
    const data = await res.json();

    const showsContainer = document.getElementById('shows-grid');
    if (!showsContainer) return;

    showsContainer.innerHTML = '';

    data.forEach(show => {
      const card = document.createElement('article');
      card.className = 'program-card';

      card.innerHTML = `
        <div class="p-6">
          <p class="eyebrow text-xs mb-2 text-blue-600">${show.category || 'Programme'}</p>
          <h3 class="text-lg font-bold text-black mb-2">${show.title}</h3>
          <p class="text-sm text-gray-600">${show.description || ''}</p>
        </div>
      `;

      showsContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Erreur chargement shows:', err);
  }
}

// 3. Récupération des liens réseaux (footer_links)
async function loadFooterLinks() {
  try {
    const res = await fetch(`${SUPABASE_URL}/footer_links?select=*&order=id.asc`, { headers });
    const data = await res.json();

    const furnalityNav = document.getElementById('footer-furnality');
    const officeNav = document.getElementById('footer-office');
    const channelsNav = document.getElementById('footer-channels');

    if (furnalityNav) furnalityNav.innerHTML = '';
    if (officeNav) officeNav.innerHTML = '';
    if (channelsNav) channelsNav.innerHTML = '';

    data.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'footer-link';
      a.textContent = link.label;

      // Répartition par id
      if (link.id >= 1000 && link.id < 2000 && furnalityNav) {
        furnalityNav.appendChild(a);
      } else if (link.id >= 2000 && link.id < 3000 && officeNav) {
        officeNav.appendChild(a);
      } else if (link.id >= 3000 && channelsNav) {
        channelsNav.appendChild(a);
      }
    });
  } catch (err) {
    console.error('Erreur chargement footer_links:', err);
  }
}
