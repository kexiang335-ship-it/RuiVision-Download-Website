const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const progressBar = document.getElementById('progressBar');

function updatePageState() {
  header.classList.toggle('scrolled', window.scrollY > 24);
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  progressBar.style.transform = `scaleY(${progress})`;
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

const storySteps = [...document.querySelectorAll('[data-story]')];
const storyCards = [...document.querySelectorAll('[data-card]')];
const storyDots = [...document.querySelectorAll('.stage-dots i')];
const storyStage = document.getElementById('storyStage');
const stageCounter = document.getElementById('stageCounter');

function activateStory(index) {
  const safeIndex = Math.max(0, Math.min(storySteps.length - 1, Number(index) || 0));
  storyStage.dataset.active = String(safeIndex);
  stageCounter.textContent = `${String(safeIndex + 1).padStart(2, '0')} / ${String(storySteps.length).padStart(2, '0')}`;
  storySteps.forEach((step, position) => step.classList.toggle('active', position === safeIndex));
  storyCards.forEach((card, position) => {
    card.classList.toggle('active', position === safeIndex);
    card.classList.toggle('past', position < safeIndex);
  });
  storyDots.forEach((dot, position) => dot.classList.toggle('active', position === safeIndex));
}

if ('IntersectionObserver' in window) {
  const storyObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activateStory(visible.target.dataset.story);
  }, { threshold: [0.2, 0.35, 0.55], rootMargin: '-26% 0px -42% 0px' });
  storySteps.forEach((step) => storyObserver.observe(step));
}

activateStory(0);

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const contactModal = document.getElementById('contactModal');
const contactDialog = contactModal.querySelector('.contact-dialog');
const contactClose = contactModal.querySelector('[data-contact-close]');
let contactTrigger = null;

function setContactOpen(open, trigger = null) {
  contactModal.classList.toggle('open', open);
  contactModal.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('modal-open', open);
  if (open) {
    contactTrigger = trigger;
    window.setTimeout(() => contactClose.focus(), 20);
  } else {
    contactTrigger?.focus();
    contactTrigger = null;
  }
}

document.querySelectorAll('[data-contact-open]').forEach((button) => {
  button.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开导航');
    setContactOpen(true, button);
  });
});
contactClose.addEventListener('click', () => setContactOpen(false));
contactModal.addEventListener('click', (event) => {
  if (!contactDialog.contains(event.target)) setContactOpen(false);
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactModal.classList.contains('open')) setContactOpen(false);
});

const revealNodes = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -28px' });
  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add('visible'));
}

function latestReleaseUrl() {
  if (!window.location.hostname.endsWith('.github.io')) return null;
  const owner = window.location.hostname.split('.')[0];
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const repo = pathParts[0] || `${owner}.github.io`;
  return `https://github.com/${owner}/${repo}/releases/latest/download/RuiVision-Setup-0.3.7.exe`;
}

const releaseUrl = latestReleaseUrl();
document.querySelectorAll('[data-download]').forEach((link) => {
  if (releaseUrl) {
    link.href = releaseUrl;
    link.removeAttribute('download');
  }
});

document.getElementById('currentYear').textContent = String(new Date().getFullYear());
