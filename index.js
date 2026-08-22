// Configuration Supabase
const SUPABASE_URL = 'https://qsqenkvrerrbzibkjoml.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'sb_publishable_FLqzd6wXyc5e_veOYAVN9g_AXBaGASo';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
};

// Mappage des classes CSS de couleur par chaîne
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

// Mappage des couleurs CSS par catégorie
const categoryColorMap = {
  'Documentaire': 'text-blue-600',
  'Musique': 'text-red-600',
  'Gaming': 'text-green-600',
  'Talk-Show': 'text-purple-600',
  'Culture': 'text-yellow-600'
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des icônes Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Gestion du menu Mobile
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

  // Lancement du chargement dynamique des données
  loadBroadcasts();
  loadShows();
  loadFooterLinks();
});

// 1. Chargement des antennes TV & Radio (section #chaines)
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

// 2. Chargement des émissions (section #programmes) avec décodage des 12 chiffres
async function loadShows() {
  try {
    const [showsRes, broadcastRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/shows?select=*&order=id.asc`, { headers }),
      fetch(`${SUPABASE_URL}/broadcast?select=*&order=id.asc`, { headers })
    ]);

    const shows = await showsRes.json();
    const broadcasts = await broadcastRes.json();

    const showsContainer = document.getElementById('shows-grid');
    if (!showsContainer) return;

    showsContainer.innerHTML = '';

    shows.forEach(show => {
      // Normalisation à 12 chiffres (ex: "101100000001")
      const fullIdStr = String(show.id).padStart(12, '0');
      
      // Extraction du code canal sur les 3 premiers chiffres (ex: 101)
      const channelCode = parseInt(fullIdStr.substring(0, 3), 10);

      // Correspondance avec l'antenne dans la table broadcast
      const matchingBroadcast = broadcasts.find(b => 
        (show.broadcast_id && b.id === show.broadcast_id) || 
        b.tv_number === channelCode || 
        b.radio_number === channelCode || 
        b.id === channelCode
      ) || {
        name: 'Furnality Network',
        broadcast_type: 'tv'
      };

      const categoryColor = categoryColorMap[show.category] || 'text-gray-600';
      const isRadio = matchingBroadcast.broadcast_type === 'radio';
      const badgeType = isRadio ? 'RADIO' : 'TV';

      const card = document.createElement('article');
      card.className = 'program-card';

      card.innerHTML = `
        <div class="p-6 flex flex-col h-full justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="eyebrow text-xs font-bold ${categoryColor}">${show.category || 'Programme'}</span>
              <span class="badge-broadcast text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${isRadio ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-gray-100 text-gray-700 border-gray-200'} border">
                ${badgeType} • ${matchingBroadcast.name}
              </span>
            </div>
            <h3 class="text-lg font-bold text-black mb-2 leading-snug">${show.title}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">${show.description || ''}</p>
          </div>
        </div>
      `;

      showsContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des émissions :', err);
  }
}

// 3. Chargement des réseaux sociaux dans le footer
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
