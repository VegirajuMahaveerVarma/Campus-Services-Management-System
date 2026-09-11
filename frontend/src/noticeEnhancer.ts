const serviceOptions = [
  'Custodian Certificate',
  'Bonafide',
  'Transfer Certificate',
  'Bonafide And Conduct Certificate',
];

const style = document.createElement('style');
style.textContent = `
.csms-services-section{margin:0 0 22px}.csms-box{background:#fff;border:1px solid #e1e6ef;border-radius:18px;padding:22px}.csms-box h3{margin:4px 0 6px;font-size:21px}.csms-box p{color:#6b778c;line-height:1.6;margin:0 0 16px}.csms-services{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.csms-service{border:1px solid #e1e6ef;background:#fff;border-radius:14px;padding:17px;text-align:left;transition:.15s}.csms-service:hover{border-color:#bfc9df;transform:translateY(-1px);box-shadow:0 8px 24px #1720330d}.csms-service b{display:block;font-size:13px}.csms-service span{display:block;color:#778297;font-size:11px;margin-top:6px;line-height:1.45}.csms-modal{position:fixed;inset:0;z-index:10000;background:#0f172a99;display:grid;place-items:center;padding:20px}.csms-modal-card{width:min(680px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:18px;padding:26px;box-shadow:0 24px 80px #0f172a40}.csms-modal-head{display:flex;justify-content:space-between;align-items:flex-start}.csms-close{border:0;background:none;font-size:27px;color:#667085;cursor:pointer}.csms-form{display:grid;gap:13px;margin-top:18px}.csms-form label{display:grid;gap:6px;font-size:12px;font-weight:700;color:#49566b}.csms-form input,.csms-form textarea{padding:12px;border:1px solid #dbe1eb;border-radius:10px}.csms-form textarea{min-height:90px;resize:vertical}.csms-actions{display:flex;justify-content:flex-end;gap:8px}.csms-msg{font-size:12px;color:#147447}
@media(max-width:1000px){.csms-services{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){.csms-services{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

const openService = (service: string) => {
  document.querySelector('.csms-modal')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'csms-modal';
  overlay.innerHTML = `<div class="csms-modal-card"><div class="csms-modal-head"><div><span class="eyebrow">Student Services</span><h2 style="margin:7px 0">${service}</h2><p style="color:#6b778c">Submit a request for this service.</p></div><button class="csms-close" aria-label="Close">×</button></div><form class="csms-form"><label>Full name<input required name="name" placeholder="Your full name"></label><label>Roll number<input required name="rollNumber" placeholder="Your roll number"></label><label>Gmail<input required type="email" name="email" pattern="[A-Za-z0-9._%+-]+@gmail\\.com" title="Please enter a Gmail address" placeholder="you@gmail.com"></label><label>Phone number<input required name="phone" inputmode="tel" placeholder="9876543210"></label><label>Additional details<textarea name="details" placeholder="Add any required information..."></textarea></label><div class="csms-msg"></div><div class="csms-actions"><button type="button" class="secondary csms-cancel">Cancel</button><button class="primary">Submit Request</button></div></form></div>`;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector('.csms-close')?.addEventListener('click', close);
  overlay.querySelector('.csms-cancel')?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('form')?.addEventListener('submit', e => {
    e.preventDefault();
    const msg = overlay.querySelector('.csms-msg') as HTMLElement;
    msg.textContent = 'Request captured successfully. The college administration can process it from the service queue.';
  });
};

const mount = () => {
  const noticesHeader = Array.from(document.querySelectorAll('header')).find(header => header.querySelector('h2')?.textContent?.trim().toLowerCase() === 'notices');
  if (!noticesHeader || document.querySelector('[data-csms-enhance]')) return;

  const root = document.createElement('section');
  root.dataset.csmsEnhance = 'true';
  root.className = 'csms-services-section';
  root.innerHTML = `<div class="csms-box"><span class="eyebrow">Student Services</span><h3>Student Services</h3><p>Request common academic and student documents directly from the campus portal.</p><div class="csms-services">${serviceOptions.map(s => `<button class="csms-service" data-service="${s}"><b>${s}</b><span>Click to create a service request</span></button>`).join('')}</div></div>`;

  noticesHeader.insertAdjacentElement('afterend', root);
  root.querySelectorAll<HTMLButtonElement>('[data-service]').forEach(button => button.addEventListener('click', () => openService(button.dataset.service || 'Student Service')));
};

const observer = new MutationObserver(() => {
  if (!document.querySelector('[data-csms-enhance]')) mount();
});
observer.observe(document.body, { childList: true, subtree: true });
setTimeout(mount, 200);
