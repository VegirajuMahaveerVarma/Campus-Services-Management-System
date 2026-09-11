const serviceOptions = [
  'Custodian Certificate',
  'Bonafide',
  'Transfer Certificate',
  'Bonafide And Conduct Certificate',
];

const holidays2026: Record<string, string> = {
  '2026-01-01':'New Year','2026-01-14':'Bhogi','2026-01-15':'Sankranti / Pongal','2026-01-16':'Kanumu','2026-01-17':'Shab-e-Meraj','2026-01-23':'Sri Panchami','2026-01-26':'Republic Day',
  '2026-02-04':'Shab-e-Barat','2026-02-15':'Mahashivaratri','2026-03-03':'Holi','2026-03-10':'Shahadat HZT Ali (R.A.)','2026-03-13':'Jumatul-Vida','2026-03-17':'Shab-e-Qader','2026-03-19':'Ugadi','2026-03-21':'Ramzan (Eid-ul-Fitr)','2026-03-22':'Following day of Ramzan','2026-03-27':'Sri Rama Navami','2026-03-31':'Mahaveer Jayanthi',
  '2026-04-03':'Good Friday','2026-04-05':'Babu Jagjivan Ram Birthday','2026-04-14':'Dr. B.R. Ambedkar Birthday','2026-04-20':'Basava Jayanthi','2026-05-01':'Buddha Purnima','2026-05-27':'Eid-ul-Azha (Bakrid)',
  '2026-06-04':'Eid-e-Ghadeer','2026-06-25':'9th Moharram','2026-06-26':'Moharram','2026-07-16':'Ratha Yathra','2026-08-04':'Arbayeen','2026-08-10':'Bonalu','2026-08-15':'Independence Day','2026-08-21':'Varalakshmi Vratham','2026-08-26':'Eid Milad-un-Nabi','2026-08-28':'Sravana Purnima / Rakhi',
  '2026-09-04':'Sri Krishnashtami','2026-09-14':'Vinayaka Chavithi','2026-09-23':'Yazdahum Shareef','2026-10-02':'Mahatma Gandhi Jayanthi','2026-10-18':'Saddula Bathukamma','2026-10-19':'Maharnavami','2026-10-20':'Vijaya Dasami','2026-10-21':'Following day of Vijaya Dasami','2026-10-26':'Birthday of Hazrath Syed Mohd. Juvanpuri',
  '2026-11-08':'Naraka Chathurdhi / Deepavali','2026-11-24':'Karthika Pournami','2026-12-24':'Christmas Eve','2026-12-25':'Christmas','2026-12-26':'Boxing Day / Hazrath Ali Birthday',
};

const fixedHoliday = (year: number, month: number, day: number, name: string) => ({ date: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`, name });

const getHoliday = (year: number, month: number, day: number) => {
  const key = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  if (year === 2026 && holidays2026[key]) return holidays2026[key];
  const fixed: Record<string,string> = {
    [`${year}-01-01`]: 'New Year', [`${year}-01-26`]: 'Republic Day', [`${year}-05-01`]: 'May Day',
    [`${year}-08-15`]: 'Independence Day', [`${year}-10-02`]: 'Mahatma Gandhi Jayanthi', [`${year}-12-25`]: 'Christmas',
  };
  return fixed[key];
};

const isSecondOrFourthSaturday = (date: Date) => date.getDay() === 6 && (Math.ceil(date.getDate() / 7) === 2 || Math.ceil(date.getDate() / 7) === 4);

const renderCalendar = (year: number) => {
  const months = Array.from({length:12}, (_,m) => {
    const first = new Date(year, m, 1).getDay();
    const days = new Date(year, m + 1, 0).getDate();
    const cells = Array.from({length:first}, () => '<span class="csms-cal-empty"></span>');
    for (let d=1; d<=days; d++) {
      const dt = new Date(year,m,d);
      const holiday = getHoliday(year,m,d);
      const weekend = dt.getDay() === 0;
      const saturday = isSecondOrFourthSaturday(dt);
      const cls = holiday ? 'holiday' : (weekend || saturday ? 'weekend' : '');
      const label = holiday || (saturday ? '2nd/4th Saturday' : (weekend ? 'Sunday' : ''));
      cells.push(`<span class="csms-cal-day ${cls}" title="${label}">${d}</span>`);
    }
    return `<section class="csms-month"><h4>${new Date(year,m,1).toLocaleString([], {month:'long'})}</h4><div class="csms-week"><b>Su</b><b>Mo</b><b>Tu</b><b>We</b><b>Th</b><b>Fr</b><b>Sa</b></div><div class="csms-grid">${cells.join('')}</div></section>`;
  });
  return months.join('');
};

const style = document.createElement('style');
style.textContent = `
.csms-enhance{margin-top:24px;display:grid;gap:20px}.csms-box{background:#fff;border:1px solid #e1e6ef;border-radius:18px;padding:22px}.csms-box h3{margin:4px 0 6px;font-size:21px}.csms-box p{color:#6b778c;line-height:1.6;margin:0 0 16px}.csms-years{display:flex;gap:7px;flex-wrap:wrap;margin:14px 0}.csms-year{border:1px solid #dbe1eb;background:#fff;border-radius:9px;padding:8px 13px;font-weight:750}.csms-year.active{background:#172033;color:#fff;border-color:#172033}.csms-calendar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.csms-month{border:1px solid #edf0f5;border-radius:13px;padding:12px}.csms-month h4{margin:0 0 9px;font-size:14px}.csms-week,.csms-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}.csms-week b{font-size:9px;text-align:center;color:#8a95a8}.csms-cal-day,.csms-cal-empty{min-height:25px;display:grid;place-items:center;border-radius:6px;font-size:10px}.csms-cal-day.weekend{background:#f5f6f8;color:#69758a}.csms-cal-day.holiday{background:#fff0f0;color:#b42318;font-weight:800}.csms-legend{display:flex;gap:16px;flex-wrap:wrap;font-size:11px;color:#68748a;margin-top:13px}.csms-dot{width:10px;height:10px;border-radius:3px;display:inline-block;margin-right:5px;vertical-align:-1px}.csms-dot.h{background:#fff0f0;border:1px solid #ffd4d4}.csms-dot.w{background:#f5f6f8;border:1px solid #e1e6ef}.csms-services{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.csms-service{border:1px solid #e1e6ef;background:#fff;border-radius:14px;padding:17px;text-align:left;transition:.15s}.csms-service:hover{border-color:#bfc9df;transform:translateY(-1px);box-shadow:0 8px 24px #1720330d}.csms-service b{display:block;font-size:13px}.csms-service span{display:block;color:#778297;font-size:11px;margin-top:6px;line-height:1.45}.csms-modal{position:fixed;inset:0;z-index:10000;background:#0f172a99;display:grid;place-items:center;padding:20px}.csms-modal-card{width:min(680px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:18px;padding:26px;box-shadow:0 24px 80px #0f172a40}.csms-modal-head{display:flex;justify-content:space-between;align-items:flex-start}.csms-close{border:0;background:none;font-size:27px;color:#667085;cursor:pointer}.csms-form{display:grid;gap:13px;margin-top:18px}.csms-form label{display:grid;gap:6px;font-size:12px;font-weight:700;color:#49566b}.csms-form input,.csms-form textarea{padding:12px;border:1px solid #dbe1eb;border-radius:10px}.csms-form textarea{min-height:90px;resize:vertical}.csms-actions{display:flex;justify-content:flex-end;gap:8px}.csms-msg{font-size:12px;color:#147447}
@media(max-width:1000px){.csms-calendar{grid-template-columns:repeat(2,minmax(0,1fr))}.csms-services{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){.csms-calendar{grid-template-columns:1fr}.csms-services{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

const openService = (service: string) => {
  document.querySelector('.csms-modal')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'csms-modal';
  overlay.innerHTML = `<div class="csms-modal-card"><div class="csms-modal-head"><div><span class="eyebrow">Student Services</span><h2 style="margin:7px 0">${service}</h2><p style="color:#6b778c">Submit a request for this service.</p></div><button class="csms-close">×</button></div><form class="csms-form"><label>Full name<input required name="name" placeholder="Your full name"></label><label>Roll number<input required name="rollNumber" placeholder="Your roll number"></label><label>Gmail<input required type="email" name="email" placeholder="you@gmail.com"></label><label>Phone number<input required name="phone" placeholder="9876543210"></label><label>Additional details<textarea name="details" placeholder="Add any required information..."></textarea></label><div class="csms-msg"></div><div class="csms-actions"><button type="button" class="secondary csms-cancel">Cancel</button><button class="primary">Submit Request</button></div></form></div>`;
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
  const headings = Array.from(document.querySelectorAll('header h2'));
  const noticesPage = headings.find(h => h.textContent?.trim().toLowerCase() === 'notices');
  const content = document.querySelector('.content');
  if (!noticesPage || !content || document.querySelector('[data-csms-enhance]')) return;
  const root = document.createElement('div');
  root.dataset.csmsEnhance = 'true';
  root.className = 'csms-enhance';
  root.innerHTML = `<section class="csms-box"><span class="eyebrow">Academic calendar</span><h3>Holiday Calendar 2026–2030</h3><p>College holiday calendar with public holidays, Sundays, and the 2nd and 4th Saturdays of every month.</p><div class="csms-years">${[2026,2027,2028,2029,2030].map(y=>`<button class="csms-year ${y===2026?'active':''}" data-year="${y}">${y}</button>`).join('')}</div><div class="csms-calendar" data-calendar>${renderCalendar(2026)}</div><div class="csms-legend"><span><i class="csms-dot h"></i>Public holiday</span><span><i class="csms-dot w"></i>Sunday / 2nd or 4th Saturday</span></div></section><section class="csms-box"><span class="eyebrow">Student Services</span><h3>Student Services</h3><p>Request common academic and student documents directly from the campus portal.</p><div class="csms-services">${serviceOptions.map(s=>`<button class="csms-service" data-service="${s}"><b>${s}</b><span>Click to create a service request</span></button>`).join('')}</div></section>`;
  content.appendChild(root);
  root.querySelectorAll<HTMLButtonElement>('[data-year]').forEach(button => button.addEventListener('click', () => {
    root.querySelectorAll('.csms-year').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const calendar = root.querySelector('[data-calendar]') as HTMLElement;
    calendar.innerHTML = renderCalendar(Number(button.dataset.year));
  }));
  root.querySelectorAll<HTMLButtonElement>('[data-service]').forEach(button => button.addEventListener('click', () => openService(button.dataset.service || 'Student Service')));
};

const observer = new MutationObserver(() => {
  if (!document.querySelector('[data-csms-enhance]')) mount();
});
observer.observe(document.body, {childList:true, subtree:true});
setTimeout(mount, 200);
