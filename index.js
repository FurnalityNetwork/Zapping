const categoryColorMap = {
  'Documentaire': 'text-blue-600',
  'Musique': 'text-red-600',
  'Gaming': 'text-green-600',
  'Talk-Show': 'text-purple-600',
  'Culture': 'text-yellow-600'
};

async function loadShows() {
  try {
    // Récupération simultanée des shows et des antennes
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
      // Normalisation de l'ID à 12 chiffres avec padding
      const fullIdStr = String(show.id).padStart(12, '0');
      
      // Extraction des 3 premiers chiffres correspondant au canal broadcast (ex: "001", "003", "101")
      const channelCode = parseInt(fullIdStr.substring(0, 3), 10);

      // Recherche dans la table broadcast via l'ID de la chaîne (tv_number, radio_number ou id direct)
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
