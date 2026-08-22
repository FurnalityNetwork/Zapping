document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des icônes
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

    // Fermeture du menu au clic sur un lien
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }
});
