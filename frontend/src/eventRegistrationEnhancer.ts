import { events } from './services/api';

let timer: number | undefined;
let loading = false;

const setupEventRegistration = async () => {
  if (loading || localStorage.getItem('campus_role') !== 'STUDENT') return;
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.cards .card'));
  if (!cards.length || cards.every(card => card.querySelector('[data-registration-button]'))) return;
  loading = true;
  const response = await events.list().catch(() => null);
  loading = false;
  if (!response) return;
  cards.forEach((card, index) => {
    const event = response.data[index];
    if (!event?.id || card.querySelector('[data-registration-button]')) return;
    const button = document.createElement('button');
    button.className = 'primary';
    button.dataset.registrationButton = 'true';
    button.textContent = 'Register for event';
    button.style.marginTop = '14px';
    button.onclick = () => openRegistration(event.id, event.title);
    card.querySelector('.card-body')?.appendChild(button);
  });
};

const scheduleSetup = () => {
  window.clearTimeout(timer);
  timer = window.setTimeout(setupEventRegistration, 80);
};

const openRegistration = (eventId: number, eventTitle: string) => {
  document.querySelector('[data-registration-modal]')?.remove();
  const overlay = document.createElement('div');
  overlay.dataset.registrationModal = 'true';
  Object.assign(overlay.style, {position:'fixed',inset:'0',zIndex:'9999',background:'rgba(15,23,42,.55)',display:'grid',placeItems:'center',padding:'20px'});
  overlay.innerHTML = `<div role="dialog" aria-modal="true" style="width:min(480px,100%);background:#fff;border-radius:18px;padding:28px;box-shadow:0 24px 80px rgba(15,23,42,.25);position:relative"><button class="registration-close" aria-label="Close" style="position:absolute;right:16px;top:12px;border:0;background:none;font-size:28px;color:#667085;cursor:pointer">×</button><span class="eyebrow">Event registration</span><h2 style="margin:8px 0">Register for ${escapeHtml(eventTitle)}</h2><p style="color:#667085">Enter your details to reserve your place.</p><form class="registration-form" style="display:grid;gap:13px"><label style="display:grid;gap:6px;font-size:12px;font-weight:700;color:#49566b">Full name<input name="fullName" required placeholder="Your full name"></label><label style="display:grid;gap:6px;font-size:12px;font-weight:700;color:#49566b">Gmail<input name="email" required type="email" pattern="[A-Za-z0-9._%+-]+@gmail\\.com" title="Please enter a Gmail address" placeholder="you@gmail.com"></label><label style="display:grid;gap:6px;font-size:12px;font-weight:700;color:#49566b">Phone number<input name="phone" required inputmode="tel" placeholder="9876543210"></label><label style="display:grid;gap:6px;font-size:12px;font-weight:700;color:#49566b">Roll number<input name="rollNumber" required placeholder="Your roll number"></label><div class="registration-message"></div><button class="primary wide" type="submit">Submit registration</button></form></div>`;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector('.registration-close')?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());
    const message = form.querySelector('.registration-message') as HTMLElement;
    const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    submit.disabled = true;
    submit.textContent = 'Registering…';
    try {
      await events.register(eventId, data);
      message.className = 'registration-message success';
      message.textContent = 'Registration successful! See you at the event.';
      submit.textContent = 'Registered';
      setTimeout(close, 1400);
    } catch (error: any) {
      message.className = 'registration-message error';
      message.textContent = error?.response?.data?.message || 'Registration failed. Please try again.';
      submit.disabled = false;
      submit.textContent = 'Submit registration';
    }
  });
};

const observer = new MutationObserver(scheduleSetup);
observer.observe(document.body, { childList: true, subtree: true });
scheduleSetup();
