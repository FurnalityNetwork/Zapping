document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des icônes Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Menu Mobile Toggle
  const menuBtn = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    // Fermeture du menu lors du clic sur un lien mobile
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }
});
