
/* PACER JS - MAIN + 4 SECTIONS */

const fullpage = document.querySelector('#fullpage');
const pages = [...document.querySelectorAll('.page')];
const navLinks = [...document.querySelectorAll('.nav-link')];

const currentEl = document.querySelector('.hero-current');
const bars = [...document.querySelectorAll('.hero-bar')];

const searchOverlay = document.querySelector('.search-overlay');
const menuOverlay = document.querySelector('.menu-overlay');

/* 01. MAIN BANNER SWIPER */

const heroSwiper = new Swiper('.hero-swiper', {
  direction: 'horizontal',
  slidesPerView: 1,
  speed: 750,
  loop: false,
  grabCursor: true,

  keyboard: {
    enabled: true,
    onlyInViewport: true
  },

  on: {
    slideChange() {
      const index = this.realIndex;

      currentEl.textContent =
        String(index + 1).padStart(2, '0');

      bars.forEach((bar, i) => {
        bar.classList.toggle('active', i === index);
      });
    }
  }
});

/* 02. BANNER INDICATORS */

bars.forEach((bar, index) => {
  bar.addEventListener('click', () => {
    heroSwiper.slideTo(index);
  });
});

/* 03. FULLPAGE MOVE */

function moveToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  fullpage.scrollTo({
    top: target.offsetTop,
    behavior: 'smooth'
  });
}

/* 04. CLOSE OVERLAYS */

function closeOverlays() {
  searchOverlay.hidden = true;
  menuOverlay.hidden = true;
}

/* 05. HEADER & MENU NAVIGATION */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href').slice(1);

    if (!document.getElementById(id)) return;

    event.preventDefault();
    closeOverlays();
    moveToSection(id);
  });
});

/* 06. NEXT BUTTON */

document.querySelectorAll('[data-next]').forEach(button => {
  button.addEventListener('click', () => {
    moveToSection(button.dataset.next);
  });
});

/* 07. HEADER ACTIVE STATE */

let scrollScheduled = false;

function updateActiveNav() {
  let activePage = pages[0];
  let nearestDistance = Infinity;

  const containerTop = fullpage.getBoundingClientRect().top;

  pages.forEach(page => {
    const distance = Math.abs(
      page.getBoundingClientRect().top - containerTop
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      activePage = page;
    }
  });

  navLinks.forEach(link => {
    const isActive =
      link.getAttribute('href') === '#' + activePage.id;

    link.classList.toggle('active', isActive);
  });
}

fullpage.addEventListener('scroll', () => {
  if (scrollScheduled) return;

  scrollScheduled = true;

  requestAnimationFrame(() => {
    updateActiveNav();
    scrollScheduled = false;
  });
}, { passive: true });

updateActiveNav();

/* 08. SEARCH OPEN */

document.querySelector('.search-open').addEventListener('click', () => {
  menuOverlay.hidden = true;
  searchOverlay.hidden = false;
  searchOverlay.querySelector('input').focus();
});

/* 09. SEARCH CLOSE */

document.querySelector('.search-close').addEventListener('click', () => {
  closeOverlays();
});

/* 10. MENU OPEN */

document.querySelector('.menu-open').addEventListener('click', () => {
  searchOverlay.hidden = true;
  menuOverlay.hidden = false;
});

/* 11. MENU CLOSE */

document.querySelector('.menu-close').addEventListener('click', () => {
  closeOverlays();
});

/* 12. ESC KEY */

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeOverlays();
  }
});

/* 13. SEARCH */

document.querySelector('.search-form').addEventListener('submit', event => {
  event.preventDefault();

  const keyword = event.currentTarget
    .querySelector('input')
    .value.trim()
    .toLowerCase();

  if (!keyword) return;

  const sections = ['brand', 'cities', 'community', 'store'];

  const matched = sections.find(section =>
    section.includes(keyword)
  );

  if (matched) {
    closeOverlays();
    moveToSection(matched);
  } else {
    document.querySelector('.search-info').textContent =
      '일치하는 섹션이 없습니다.';
  }
});

/* ==========================================
   PACER CAMPAIGN POPUP
========================================== */

const pacerPopup = document.querySelector('#pacerPopup');
const popupToday = document.querySelector('#popupToday');
const popupCloseButtons = document.querySelectorAll('.pacer-popup-close');
const popupCTA = document.querySelector('.pacer-popup-cta');

const popupStorageKey = 'pacerPopupHideUntil';

function closePacerPopup() {
  if (popupToday?.checked) {
    try {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      localStorage.setItem(
        popupStorageKey,
        String(tomorrow.getTime())
      );
    } catch (error) {
      console.warn('팝업 설정 저장 실패:', error);
    }
  }

  pacerPopup?.classList.remove('show');
}

function openPacerPopup() {
  let hideUntil = 0;

  try {
    hideUntil = Number(
      localStorage.getItem(popupStorageKey) || 0
    );
  } catch (error) {
    console.warn('팝업 설정 확인 실패:', error);
  }

  // if (Date.now() < hideUntil) return;

  pacerPopup?.classList.add('show');
}

popupCloseButtons.forEach(button => {
  button.addEventListener('click', closePacerPopup);
});

popupCTA?.addEventListener('click', () => {
  closePacerPopup();
  moveToSection('cities');
});

pacerPopup?.addEventListener('click', event => {
  if (event.target === pacerPopup) {
    closePacerPopup();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' &&
      pacerPopup?.classList.contains('show')) {
    closePacerPopup();
  }
});

// 처음 접속했을 때 팝업 표시
openPacerPopup();
