const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const progressBar = document.getElementById('progressBar');
const progressValue = document.getElementById('progressValue');

function updatePageState() {
  header.classList.toggle('scrolled', window.scrollY > 24);
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  progressBar.style.transform = `scaleY(${progress})`;
  progressValue.textContent = String(Math.round(progress * 100)).padStart(2, '0');
}

updatePageState();
window.addEventListener('scroll', updatePageState, { passive: true });
window.addEventListener('resize', updatePageState, { passive: true });

menuToggle.addEventListener('click', () => {
  const open = !siteNav.classList.contains('open');
  siteNav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const tabButtons = [...document.querySelectorAll('[data-product-tab]')];
const tabPanels = [...document.querySelectorAll('[data-product-panel]')];

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.productTab;
    tabButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    tabPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.productPanel === target));
  });
});

document.querySelectorAll('.faq details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const revealNodes = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px' });
  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add('visible'));
}

function latestReleaseUrl() {
  if (!window.location.hostname.endsWith('.github.io')) return null;
  const owner = window.location.hostname.split('.')[0];
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const repo = pathParts[0] || `${owner}.github.io`;
  return `https://github.com/${owner}/${repo}/releases/latest/download/RuiVision-Creator-Studio-portable-v0.3.1-final.zip`;
}

const releaseUrl = latestReleaseUrl();
document.querySelectorAll('[data-download]').forEach((link) => {
  if (releaseUrl) {
    link.href = releaseUrl;
    link.removeAttribute('download');
  }
  link.addEventListener('click', () => link.setAttribute('data-clicked', 'true'));
});

document.getElementById('currentYear').textContent = String(new Date().getFullYear());
