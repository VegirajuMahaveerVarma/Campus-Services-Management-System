import { events } from './services/api';

const setupEventRegistration = async () => {
  if (localStorage.getItem('campus_role') !== 'STUDENT') return;
  const response = await events.list().catch(() => null);
  if (!response) return;
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.cards .card'));
  cards.forEach((card, index) => {
    const event = response.data[index];
    if (!event?.id || card.querySelector('[data-registration-button]')) return;
    const button = document.createElement('button');
    button.className = 'primary event-register-button';
    button.dataset.registrationButton = 'true';
    button.textContent = 'Register for event';
    button.onclick = () => openRegistration(event.id, event.title);
    const body = card.querySelector('.card-body');
    body?.appendChild(button);
  });
};

const openRegistration = (eventId: number, eventTitle: string) => {
  document.querySelector('[data-registration-modal]')?.remove();
  const overlay = document.createElement('div');
  overlay.dataset.registrationModal = 'true';
  overlay.className = 'registration-overlay';
  overlay.innerHTML = `
    <div class="registration-modal" role="dialog" aria-modal="true">
      <button class="registration-close" aria-label="Close">×</button>
      <span class="eyebrow">Event registration</span>
      <h2>Register for ${escapeHtml(eventTitle)}</h2>
      <p>Enter your details to reserve your place.</p>
      <form class="registration-form">
        <label>Full name<input name="fullName" required placeholder="Your full name"></label>
        <label>Gmail<input name="email" required type="email" placeholder="you@gmail.com"></label>
        <label>Phone number<input name="phone" required inputmode="tel" placeholder="9876543210"></label>
        <label>Roll number<input name="rollNumber" required placeholder="Your roll number"></label>
        <div class="registration-message"></div>
        <button class="primary wide" type="submit">Submit registration</button>
      </form>
    </div>`;
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
    message.textContent = '';
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

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char] || char));

const observer = new MutationObserver(() => setupEventRegistration());
observer.observe(document.body, { childList: true, subtree: true });
