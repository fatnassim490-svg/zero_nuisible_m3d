/* ==============================
   Zéro Nuisibles M3D - script.js
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------
     1. Menu burger mobile (tiroir latéral droite)
     Ouvre/ferme le tiroir + l'overlay sombre associé
  --------------------------------------- */
  const btnMenuMobile = document.getElementById('btn-menu-mobile');
  const btnFermerMenuMobile = document.getElementById('btn-fermer-menu-mobile');
  const menuMobile = document.getElementById('menu-mobile');
  const overlayMenuMobile = document.getElementById('overlay-menu-mobile');

  function ouvrirMenuMobile() {
    overlayMenuMobile.classList.remove('hidden');
    // Force un reflow avant de passer l'opacité à 1, pour que la transition CSS s'applique
    requestAnimationFrame(() => {
      overlayMenuMobile.classList.remove('opacity-0');
    });
    menuMobile.classList.remove('translate-x-full');
    menuMobile.classList.add('translate-x-0');
    btnMenuMobile.setAttribute('aria-expanded', 'true');
    document.body.classList.add('overflow-hidden'); // empêche le scroll du fond pendant que le tiroir est ouvert
  }

  function fermerMenuMobile() {
    menuMobile.classList.remove('translate-x-0');
    menuMobile.classList.add('translate-x-full');
    overlayMenuMobile.classList.add('opacity-0');
    btnMenuMobile.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden');

    // Masque complètement l'overlay une fois la transition d'opacité terminée
    setTimeout(() => {
      overlayMenuMobile.classList.add('hidden');
    }, 300);
  }

  btnMenuMobile.addEventListener('click', ouvrirMenuMobile);
  btnFermerMenuMobile.addEventListener('click', fermerMenuMobile);
  overlayMenuMobile.addEventListener('click', fermerMenuMobile);

  // Ferme le tiroir automatiquement au clic sur un lien de navigation
  document.querySelectorAll('#menu-mobile a').forEach((lien) => {
    lien.addEventListener('click', fermerMenuMobile);
  });

  /* ---------------------------------------
     2. Header : ombre renforcée après scroll
     Ajoute une classe CSS quand l'utilisateur a scrollé
  --------------------------------------- */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  /* ---------------------------------------
     3. Animations simples au scroll (fade-in-up)
     Utilise IntersectionObserver pour révéler les sections au scroll
  --------------------------------------- */
  const elementsAnimes = document.querySelectorAll('.fade-in-up');

  const observateur = new IntersectionObserver((entries) => {
    entries.forEach((entree) => {
      if (entree.isIntersecting) {
        entree.target.classList.add('visible');
        observateur.unobserve(entree.target);
      }
    });
  }, { threshold: 0.15 });

  elementsAnimes.forEach((el) => observateur.observe(el));

  /* ---------------------------------------
     4. Validation du formulaire de contact
     Vérifie que les champs requis sont remplis avant "l'envoi"
     (pas de vrai envoi serveur ici : message de confirmation simulé,
     à connecter à Formspree via l'attribut action du formulaire)
  --------------------------------------- */
  const formulaire = document.getElementById('form-contact');
  const messageConfirmation = document.getElementById('msg-confirmation');

  formulaire.addEventListener('submit', (evenement) => {
    let formulaireValide = true;

    // Valide chaque champ requis du formulaire
    const champsRequis = formulaire.querySelectorAll('[required]');

    champsRequis.forEach((champ) => {
      const messageErreur = champ.parentElement.querySelector('.msg-erreur');
      const valeurVide = champ.value.trim() === '';

      // Validation spécifique du téléphone (format simple algérien)
      const estTelephoneInvalide =
        champ.id === 'telephone' &&
        !valeurVide &&
        !/^0[5-7][0-9]{8}$/.test(champ.value.replace(/\s/g, ''));

      if (valeurVide || estTelephoneInvalide) {
        formulaireValide = false;
        champ.classList.add('border-red-500');
        if (messageErreur) messageErreur.classList.remove('hidden');
      } else {
        champ.classList.remove('border-red-500');
        if (messageErreur) messageErreur.classList.add('hidden');
      }
    });

    if (!formulaireValide) {
      evenement.preventDefault();
      return;
    }

    // Simulation d'envoi réussi (à remplacer par le vrai envoi Formspree en production)
    evenement.preventDefault();
    messageConfirmation.classList.remove('hidden');
    formulaire.reset();

    // Masque le message de confirmation après quelques secondes
    setTimeout(() => {
      messageConfirmation.classList.add('hidden');
    }, 6000);
  });

  /* ---------------------------------------
     5. Année courante dans le footer
  --------------------------------------- */
  document.getElementById('annee-courante').textContent = new Date().getFullYear();

  /* ---------------------------------------
     6. Carrousel horizontal des avis clients (mobile)
     Fait défiler le conteneur d'une largeur de carte à chaque clic
  --------------------------------------- */
  const carrouselAvis = document.getElementById('carrousel-avis');
  const btnAvisPrecedent = document.getElementById('btn-avis-precedent');
  const btnAvisSuivant = document.getElementById('btn-avis-suivant');

  function distanceDefilement() {
    // Fait défiler d'une carte : largeur de la première carte + l'espace (gap) entre les cartes
    const premiereCarte = carrouselAvis.querySelector('div');
    if (!premiereCarte) return 300;
    const stylesGap = parseInt(window.getComputedStyle(carrouselAvis).columnGap || 24, 10);
    return premiereCarte.offsetWidth + stylesGap;
  }

  btnAvisPrecedent.addEventListener('click', () => {
    carrouselAvis.scrollBy({ left: -distanceDefilement(), behavior: 'smooth' });
  });

  btnAvisSuivant.addEventListener('click', () => {
    carrouselAvis.scrollBy({ left: distanceDefilement(), behavior: 'smooth' });
  });

});
