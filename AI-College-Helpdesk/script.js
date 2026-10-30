/* AI College Helpdesk: rule-based demo (vanilla JS).
   All data below is SAMPLE data stored only in this browser (localStorage). */
(() => {
  'use strict';

  const STORAGE_KEY = 'aiCollegeHelpdesk.v1';
  const THEME_KEY = 'aiCollegeHelpdesk.theme';
  const NOT_FOUND = "I couldn't find verified information about this question. Please contact the college helpdesk.";
  const DEMO_NOTE = 'Demo content stored in this browser. Not an official announcement.';

  const CATEGORIES = {
    faq: ['Admissions', 'Academics', 'Examinations', 'Certificates', 'General Queries'],
    notice: ['Admissions', 'Academics', 'Examinations', 'Certificates', 'General'],
    event: ['Academic', 'Cultural', 'Technical', 'Sports', 'Workshop']
  };

  const SUGGESTED = [
    'What are the college office hours?',
    'How can I find examination notifications?',
    'Where can I get a bonafide certificate?',
    'How do I contact the admissions department?',
    'Where can I find upcoming events?'
  ];

  const QUICK_CARDS = [
    { icon: '🎓', title: 'Admissions', text: 'Applying and contacting admissions', ask: 'How do I apply for admission?' },
    { icon: '📚', title: 'Academics', text: 'Calendar and course information', ask: 'Where can I view the academic calendar?' },
    { icon: '📝', title: 'Examinations', text: 'Notifications and results', ask: 'How can I find examination notifications?' },
    { icon: '🏛️', title: 'Departments', text: 'Departments and programmes', ask: 'What departments does the college have?' },
    { icon: '🕘', title: 'Office Hours', text: 'When the office is open', ask: 'What are the college office hours?' },
    { icon: '🤝', title: 'Student Services', text: 'Support and services', ask: 'What student services are available?' }
  ];

  /* Sample data. Replace with verified college information. */
  const DEFAULT_DATA = {
    faqs: [
      { id: 'faq-1', category: 'General Queries', question: 'What are the college office hours?', answer: 'This demo does not contain verified office timings. Replace this sample answer with your college\'s confirmed office hours, or contact the helpdesk.', source: 'Office Hours (sample)' },
      { id: 'faq-2', category: 'Examinations', question: 'How can I find examination notifications?', answer: 'Examination notifications are listed in the Notices section under the Examinations category. Check it regularly and confirm details with the examination office.', source: 'Notices: Examinations (sample)' },
      { id: 'faq-3', category: 'Certificates', question: 'Where can I get a bonafide certificate?', answer: 'Bonafide certificates are normally requested from the college office. This is a sample answer, so confirm the exact process with your college.', source: 'Certificate Requests (sample)' },
      { id: 'faq-4', category: 'Admissions', question: 'How do I contact the admissions department?', answer: 'Use the sample contact shown in the page footer. Replace it with the verified admissions contact details before real use.', source: 'Admissions Contact (sample)' },
      { id: 'faq-5', category: 'General Queries', question: 'Where can I find upcoming events?', answer: 'Upcoming events are listed in the Events section of this site. All events shown here are sample entries.', source: 'Events page (sample)' },
      { id: 'faq-6', category: 'Admissions', question: 'How do I apply for admission?', answer: 'Admission steps and eligibility should be published in official admission notices. Add the verified process in the Admin panel or contact the helpdesk.', source: 'Admission Notices (sample)' },
      { id: 'faq-7', category: 'Academics', question: 'Where can I view the academic calendar?', answer: 'The academic calendar would be published as a notice in the Academics category. No official calendar is included in this demo.', source: 'Academic Calendar (sample)' },
      { id: 'faq-8', category: 'Certificates', question: 'How do I request a transcript or marksheet?', answer: 'Transcript and marksheet requests usually go through the college office or examination section. Confirm the real procedure with your college.', source: 'Certificate Requests (sample)' },
      { id: 'faq-9', category: 'General Queries', question: 'What departments does the college have?', answer: 'Department details are not included in this demo. Add verified department information in the Admin panel or contact the helpdesk.', source: 'Departments (sample)' },
      { id: 'faq-10', category: 'General Queries', question: 'What student services are available?', answer: 'This site covers FAQs, notices and events. Add verified details about other student services in the Admin panel.', source: 'Student Services (sample)' }
    ],
    notices: [
      { id: 'n-1', title: 'Sample: Admission information notice', category: 'Admissions', date: '2026-11-02', description: 'Placeholder showing where admission announcements would appear. Not an official notice.' },
      { id: 'n-2', title: 'Sample: Examination notification', category: 'Examinations', date: '2026-11-10', description: 'Placeholder for examination schedules and instructions. Fictional date and content.' },
      { id: 'n-3', title: 'Sample: Academic calendar update', category: 'Academics', date: '2026-11-15', description: 'Placeholder for academic calendar changes. Replace with verified information.' },
      { id: 'n-4', title: 'Sample: Certificate request process', category: 'Certificates', date: '2026-11-18', description: 'Placeholder describing where certificate request guidance would be posted.' },
      { id: 'n-5', title: 'Sample: Campus facilities notice', category: 'General', date: '2026-11-20', description: 'Placeholder for general campus announcements. Not an official announcement.' }
    ],
    events: [
      { id: 'e-1', title: 'Sample: Tech Symposium', category: 'Technical', date: '2026-12-05', description: 'A fictional technical event used to show how event cards look.' },
      { id: 'e-2', title: 'Sample: Cultural Evening', category: 'Cultural', date: '2026-12-12', description: 'A fictional cultural programme. Not a real scheduled event.' },
      { id: 'e-3', title: 'Sample: Career Skills Workshop', category: 'Workshop', date: '2026-12-18', description: 'A fictional workshop entry for demonstration purposes.' },
      { id: 'e-4', title: 'Sample: Inter-department Sports Meet', category: 'Sports', date: '2027-01-10', description: 'A fictional sports event with a made-up date.' }
    ]
  };

  /* ---------- Utilities ---------- */
  const $ = (id) => document.getElementById(id);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const uid = (prefix) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const empty = (msg) => `<div class="empty">${esc(msg)}</div>`;

  let toastTimer;
  /** Shows a short confirmation message at the bottom of the screen. */
  function toast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------- Data storage ---------- */
  /** Loads saved demo data from localStorage, or falls back to sample data. */
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.faqs) && Array.isArray(saved.notices) && Array.isArray(saved.events)) return saved;
    } catch (e) { /* ignore corrupt or unavailable storage */ }
    return clone(DEFAULT_DATA);
  }
  let data = load();
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (e) { toast('Could not save to this browser. Changes will be lost on refresh.'); }
  }
  /** Saves and re-renders every section after a data change. */
  function commit() { save(); renderAll(); }

  /* ---------- Chatbot ---------- */
  const STOP = new Set('a an the is are am was were be do does did i me my we you your can could should would will to of in on for and or at by with from about how what where when which who there any please tell get find need want it this that college helpdesk'.split(' '));
  const SYNONYMS = { exam: 'examination', marksheet: 'transcript', timing: 'hour', time: 'hour', fest: 'event', admit: 'admission' };

  /** Lowercases, removes stop words, and lightly normalises words for matching. */
  function tokens(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter((w) => w && !STOP.has(w))
      .map((w) => (w.length > 3 ? w.replace(/s$/, '') : w))
      .map((w) => SYNONYMS[w] || w);
  }
  const overlap = (queryTokens, text) => {
    const set = new Set(tokens(text));
    return queryTokens.filter((t) => set.has(t)).length;
  };
  /** Returns the best item whose title shares at least one keyword with the query. */
  function bestMatch(queryTokens, items, titleOf, bodyOf) {
    let top = null;
    items.forEach((item) => {
      const hits = overlap(queryTokens, titleOf(item));
      const score = hits * 3 + overlap(queryTokens, bodyOf(item));
      if (hits >= 1 && (!top || score > top.score)) top = { item, score };
    });
    return top;
  }

  /** Rule-based answer from local data. Returns { text, source? }. */
  function localAnswer(question) {
    if (/^(hi|hello|hey|good (morning|afternoon|evening)|thanks|thank you)\b/i.test(question.trim())) {
      return { text: 'Hello! Ask me about office hours, notices, events or certificates. I only answer from the sample FAQ data in this demo.' };
    }
    const qt = tokens(question);
    if (!qt.length) return { text: NOT_FOUND };

    const faq = bestMatch(qt, data.faqs, (f) => f.question, (f) => f.answer + ' ' + f.category);
    if (faq) return { text: faq.item.answer, source: { title: faq.item.source || 'FAQ: ' + faq.item.category, href: '#faqs' } };

    const notice = bestMatch(qt, data.notices, (n) => n.title, (n) => n.description + ' ' + n.category);
    if (notice) {
      const n = notice.item;
      return { text: `Related notice: "${n.title}" (${fmtDate(n.date)}). ${n.description}`, source: { title: n.title + ' (demo notice)', href: '#notices' } };
    }
    const event = bestMatch(qt, data.events, (e) => e.title, (e) => e.description + ' ' + e.category);
    if (event) {
      const e = event.item;
      return { text: `Related event: "${e.title}" on ${fmtDate(e.date)}. ${e.description}`, source: { title: e.title + ' (demo event)', href: '#events' } };
    }
    return { text: NOT_FOUND };
  }

  /* Integration point: replace `answer` with a fetch() call to a real AI/RAG backend
     that returns { text, source }. The rest of the chat UI will keep working. */
  const AnswerProvider = {
    async answer(question) { return localAnswer(question); }
  };

  let chatBusy = false;
  function addMessage(role, text, source) {
    const msg = document.createElement('div');
    msg.className = 'msg ' + role;
    const p = document.createElement('p');
    p.textContent = text;
    msg.appendChild(p);
    if (source) {
      const a = document.createElement('a');
      a.className = 'source';
      a.href = source.href;
      a.textContent = 'Source: ' + source.title;
      msg.appendChild(a);
    }
    $('chatLog').appendChild(msg);
    $('chatLog').scrollTop = $('chatLog').scrollHeight;
    return msg;
  }
  function addTyping() {
    const msg = document.createElement('div');
    msg.className = 'msg bot typing';
    msg.setAttribute('aria-label', 'Assistant is typing');
    msg.innerHTML = '<span></span><span></span><span></span>';
    $('chatLog').appendChild(msg);
    $('chatLog').scrollTop = $('chatLog').scrollHeight;
    return msg;
  }
  function addWelcome() {
    addMessage('bot', "Hi! I'm the helpdesk assistant. This is a rule-based demo that answers only from the sample FAQ data. Try one of the suggested questions below.");
  }

  /** Sends a user message and shows the assistant's reply. */
  async function sendMessage(text) {
    text = text.trim();
    if (chatBusy) return;
    if (!text) { addMessage('bot', 'Please type a question first, for example "What are the college office hours?"'); return; }
    chatBusy = true;
    addMessage('user', text);
    $('chatInput').value = '';
    const typing = addTyping();
    try {
      const [reply] = await Promise.all([AnswerProvider.answer(text), delay(600)]);
      typing.remove();
      addMessage('bot', reply.text, reply.source);
    } catch (err) {
      typing.remove();
      addMessage('bot', 'Something went wrong while looking that up. Please try again.');
    }
    chatBusy = false;
  }
  function askAssistant(text) {
    $('ask').scrollIntoView();
    sendMessage(text);
  }

  /* ---------- Filtering ---------- */
  const filters = { faq: 'All', notice: 'All', event: 'All' };
  const query = (id) => $(id).value.trim().toLowerCase();
  const inCategory = (type, item) => filters[type] === 'All' || item.category === filters[type];
  const visibleFaqs = () => data.faqs.filter((f) => inCategory('faq', f) && (!query('faqSearch') || (f.question + ' ' + f.answer + ' ' + f.category).toLowerCase().includes(query('faqSearch'))));
  const visibleNotices = () => data.notices.filter((n) => inCategory('notice', n) && (!query('noticeSearch') || (n.title + ' ' + n.description + ' ' + n.category).toLowerCase().includes(query('noticeSearch'))))
    .sort((a, b) => b.date.localeCompare(a.date));
  const visibleEvents = () => data.events.filter((e) => inCategory('event', e) && (!query('eventSearch') || (e.title + ' ' + e.description + ' ' + e.category).toLowerCase().includes(query('eventSearch'))))
    .sort((a, b) => a.date.localeCompare(b.date));

  /* ---------- Rendering: public sections ---------- */
  function renderChips(type, containerId) {
    $(containerId).innerHTML = ['All', ...CATEGORIES[type]].map((c) =>
      `<button type="button" class="chip${c === filters[type] ? ' active' : ''}" data-filter="${type}" data-value="${esc(c)}" aria-pressed="${c === filters[type]}">${esc(c)}</button>`).join('');
  }

  function renderFaqs() {
    renderChips('faq', 'faqFilters');
    const list = visibleFaqs();
    $('faqList').innerHTML = list.length ? list.map((f) => `
      <div class="faq-item">
        <button class="faq-q" type="button" aria-expanded="false" aria-controls="ans-${f.id}">${esc(f.question)}</button>
        <div class="faq-a" id="ans-${f.id}" hidden>
          <p>${esc(f.answer)}</p>
          <div class="meta"><span class="badge">${esc(f.category)}</span>${f.source ? `<a href="#notices">Source: ${esc(f.source)}</a>` : ''}</div>
        </div>
      </div>`).join('') : empty('No FAQs match your search. Try a different word or choose "All".');
  }

  const itemCard = (item) => `
    <article class="card">
      <div class="meta"><span class="badge">${esc(item.category)}</span><span>${fmtDate(item.date)}</span></div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
      <button class="btn btn-ghost btn-sm" type="button" data-detail="${item.id}">View details</button>
    </article>`;

  function renderNotices() {
    renderChips('notice', 'noticeFilters');
    const list = visibleNotices();
    $('noticeList').innerHTML = list.length ? list.map(itemCard).join('') : empty('No notices match your search. Try a different word or choose "All".');
  }
  function renderEvents() {
    renderChips('event', 'eventFilters');
    const list = visibleEvents();
    $('eventList').innerHTML = list.length ? list.map(itemCard).join('') : empty('No events match your search. Try a different word or choose "All".');
  }

  function renderHome() {
    $('quickCards').innerHTML = QUICK_CARDS.map((c) => `
      <button type="button" class="card clickable" data-ask="${esc(c.ask)}">
        <div class="icon-bubble" aria-hidden="true">${c.icon}</div>
        <h3>${esc(c.title)}</h3><p>${esc(c.text)}</p>
      </button>`).join('');
    const recent = [...data.notices].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
    $('homeNotices').innerHTML = recent.length ? recent.map((n) => `
      <button type="button" class="card clickable" data-detail="${n.id}">
        <div class="meta"><span class="badge">${esc(n.category)}</span><span>${fmtDate(n.date)}</span></div>
        <h3>${esc(n.title)}</h3>
      </button>`).join('') : empty('No notices yet. Add one in the Admin panel.');
    $('popularQuestions').innerHTML = data.faqs.slice(0, 4).map((f) => `
      <button type="button" class="card clickable" data-ask="${esc(f.question)}"><h3>${esc(f.question)}</h3><p>Ask the assistant</p></button>`).join('')
      || empty('No questions yet. Add one in the Admin panel.');
  }

  /* ---------- Rendering: admin ---------- */
  const adminRow = (type, id, title, category, editable) => `
    <div class="admin-row">
      <span>${esc(title)} <span class="badge">${esc(category)}</span></span>
      <span class="actions">
        ${editable ? `<button type="button" class="btn btn-ghost btn-sm" data-edit="${type}:${id}" aria-label="Edit ${esc(title)}">Edit</button>` : ''}
        <button type="button" class="btn btn-ghost btn-sm btn-danger" data-del="${type}:${id}" aria-label="Delete ${esc(title)}">Delete</button>
      </span>
    </div>`;

  function renderAdmin() {
    const q = query('adminSearch');
    const match = (...parts) => !q || parts.join(' ').toLowerCase().includes(q);
    const none = '<p class="muted">No matching records.</p>';
    $('adminStats').innerHTML = [['FAQs', data.faqs.length], ['Notices', data.notices.length], ['Events', data.events.length]]
      .map(([label, n]) => `<div class="card"><div class="stat-value">${n}</div><p>${label} stored in this browser</p></div>`).join('');
    const faqs = data.faqs.filter((f) => match(f.question, f.answer, f.category));
    const notices = data.notices.filter((n) => match(n.title, n.description, n.category));
    const events = data.events.filter((e) => match(e.title, e.description, e.category));
    $('adminFaqList').innerHTML = faqs.map((f) => adminRow('faq', f.id, f.question, f.category, true)).join('') || none;
    $('adminNoticeList').innerHTML = notices.map((n) => adminRow('notice', n.id, n.title, n.category, true)).join('') || none;
    $('adminEventList').innerHTML = events.map((e) => adminRow('event', e.id, e.title, e.category, false)).join('') || none;
  }

  function renderAll() { renderHome(); renderFaqs(); renderNotices(); renderEvents(); renderAdmin(); }

  /* ---------- Detail dialog ---------- */
  const dialog = document.createElement('dialog');
  dialog.className = 'detail-dialog';
  dialog.setAttribute('aria-labelledby', 'dlgTitle');
  dialog.innerHTML = '<h3 id="dlgTitle"></h3><div class="meta" id="dlgMeta"></div><p id="dlgBody"></p><p class="muted" id="dlgNote"></p><button type="button" class="btn btn-primary btn-sm" id="dlgClose">Close</button>';
  document.body.appendChild(dialog);
  dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target.id === 'dlgClose') dialog.close(); });

  function showDetail(id) {
    const item = data.notices.find((n) => n.id === id) || data.events.find((e) => e.id === id);
    if (!item) return;
    $('dlgTitle').textContent = item.title;
    $('dlgMeta').innerHTML = `<span class="badge">${esc(item.category)}</span><span>${fmtDate(item.date)}</span>`;
    $('dlgBody').textContent = item.description;
    $('dlgNote').textContent = DEMO_NOTE;
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
  }

  /* ---------- Admin forms ---------- */
  const fail = (errorId, message, fieldId) => { $(errorId).textContent = message; $(fieldId).focus(); };

  function fillSelect(id, list) { $(id).innerHTML = list.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join(''); }

  function resetFaqForm() {
    $('faqForm').reset(); $('faqId').value = ''; $('faqError').textContent = '';
    $('faqSubmit').textContent = 'Add FAQ'; $('faqCancel').hidden = true;
  }
  function resetNoticeForm() {
    $('noticeForm').reset(); $('noticeId').value = ''; $('noticeError').textContent = '';
    $('noticeSubmit').textContent = 'Add notice'; $('noticeCancel').hidden = true;
  }

  $('faqForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const rec = { question: $('faqQuestion').value.trim(), category: $('faqCategory').value, answer: $('faqAnswer').value.trim(), source: $('faqSource').value.trim() };
    if (rec.question.length < 8) return fail('faqError', 'Enter a question of at least 8 characters.', 'faqQuestion');
    if (rec.answer.length < 10) return fail('faqError', 'Enter an answer of at least 10 characters.', 'faqAnswer');
    const id = $('faqId').value;
    const existing = id && data.faqs.find((f) => f.id === id);
    if (existing) { Object.assign(existing, rec); toast('FAQ updated'); }
    else { data.faqs.unshift({ id: uid('faq-'), ...rec }); toast('FAQ added'); }
    resetFaqForm(); commit();
  });

  $('noticeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const rec = { title: $('noticeTitle').value.trim(), category: $('noticeCategory').value, date: $('noticeDate').value, description: $('noticeDesc').value.trim() };
    if (rec.title.length < 5) return fail('noticeError', 'Enter a title of at least 5 characters.', 'noticeTitle');
    if (!rec.date) return fail('noticeError', 'Choose a publication date.', 'noticeDate');
    if (rec.description.length < 10) return fail('noticeError', 'Enter a description of at least 10 characters.', 'noticeDesc');
    const id = $('noticeId').value;
    const existing = id && data.notices.find((n) => n.id === id);
    if (existing) { Object.assign(existing, rec); toast('Notice updated'); }
    else { data.notices.unshift({ id: uid('n-'), ...rec }); toast('Notice added'); }
    resetNoticeForm(); commit();
  });

  $('eventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const rec = { title: $('eventTitle').value.trim(), category: $('eventCategory').value, date: $('eventDate').value, description: $('eventDesc').value.trim() };
    if (rec.title.length < 5) return fail('eventError', 'Enter a title of at least 5 characters.', 'eventTitle');
    if (!rec.date) return fail('eventError', 'Choose an event date.', 'eventDate');
    if (rec.description.length < 10) return fail('eventError', 'Enter a description of at least 10 characters.', 'eventDesc');
    data.events.unshift({ id: uid('e-'), ...rec });
    $('eventForm').reset(); $('eventError').textContent = '';
    toast('Event added'); commit();
  });

  $('faqCancel').addEventListener('click', resetFaqForm);
  $('noticeCancel').addEventListener('click', resetNoticeForm);

  /** Loads a record into its form for editing. */
  function startEdit(type, id) {
    if (type === 'faq') {
      const f = data.faqs.find((x) => x.id === id); if (!f) return;
      $('faqId').value = f.id; $('faqQuestion').value = f.question; $('faqCategory').value = f.category;
      $('faqAnswer').value = f.answer; $('faqSource').value = f.source || '';
      $('faqSubmit').textContent = 'Save changes'; $('faqCancel').hidden = false;
      $('faqForm').scrollIntoView({ block: 'center' }); $('faqQuestion').focus();
    } else {
      const n = data.notices.find((x) => x.id === id); if (!n) return;
      $('noticeId').value = n.id; $('noticeTitle').value = n.title; $('noticeCategory').value = n.category;
      $('noticeDate').value = n.date; $('noticeDesc').value = n.description;
      $('noticeSubmit').textContent = 'Save changes'; $('noticeCancel').hidden = false;
      $('noticeForm').scrollIntoView({ block: 'center' }); $('noticeTitle').focus();
    }
  }

  /** Deletes a record after confirmation. */
  function deleteRecord(type, id) {
    const key = { faq: 'faqs', notice: 'notices', event: 'events' }[type];
    if (!window.confirm(`Delete this ${type}? This cannot be undone.`)) return;
    data[key] = data[key].filter((x) => x.id !== id);
    if ($('faqId').value === id) resetFaqForm();
    if ($('noticeId').value === id) resetNoticeForm();
    toast(type.charAt(0).toUpperCase() + type.slice(1) + ' deleted');
    commit();
  }

  /* ---------- Global event handling ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    let el;
    if ((el = t.closest('[data-ask]'))) return askAssistant(el.dataset.ask);
    if ((el = t.closest('[data-detail]'))) return showDetail(el.dataset.detail);
    if ((el = t.closest('[data-filter]'))) { filters[el.dataset.filter] = el.dataset.value; return { faq: renderFaqs, notice: renderNotices, event: renderEvents }[el.dataset.filter](); }
    if ((el = t.closest('.faq-q'))) {
      const open = el.getAttribute('aria-expanded') === 'true';
      el.setAttribute('aria-expanded', String(!open));
      $(el.getAttribute('aria-controls')).hidden = open;
      return;
    }
    if ((el = t.closest('[data-edit]'))) return startEdit(...el.dataset.edit.split(':'));
    if ((el = t.closest('[data-del]'))) return deleteRecord(...el.dataset.del.split(':'));
    if (t.closest('.main-nav a')) closeMenu();
  });

  $('faqSearch').addEventListener('input', renderFaqs);
  $('noticeSearch').addEventListener('input', renderNotices);
  $('eventSearch').addEventListener('input', renderEvents);
  $('adminSearch').addEventListener('input', renderAdmin);

  $('heroSearchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('heroSearchInput').value.trim();
    if (!q) { toast('Type a word to search, such as "exam".'); return; }
    ['faqSearch', 'noticeSearch', 'eventSearch'].forEach((id) => { $(id).value = q; });
    filters.faq = filters.notice = filters.event = 'All';
    renderFaqs(); renderNotices(); renderEvents();
    const results = [['faqs', visibleFaqs().length, 'FAQ'], ['notices', visibleNotices().length, 'notice'], ['events', visibleEvents().length, 'event']];
    const first = results.find((r) => r[1] > 0);
    toast(first ? results.map((r) => `${r[1]} ${r[2]}${r[1] === 1 ? '' : 's'}`).join(', ') + ' found' : 'No results found. Try the assistant instead.');
    $(first ? first[0] : 'ask').scrollIntoView();
  });

  $('chatForm').addEventListener('submit', (e) => { e.preventDefault(); sendMessage($('chatInput').value); });
  $('clearChat').addEventListener('click', () => { $('chatLog').innerHTML = ''; addWelcome(); toast('Chat cleared'); });

  $('resetData').addEventListener('click', () => {
    if (!window.confirm('Reset all FAQs, notices and events to the original sample data?')) return;
    data = clone(DEFAULT_DATA);
    resetFaqForm(); resetNoticeForm();
    toast('Demo data reset'); commit();
  });

  /* ---------- Theme and navigation ---------- */
  function applyTheme(theme) { document.documentElement.setAttribute('data-theme', theme); }
  (function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* storage unavailable */ }
    applyTheme(stored || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  })();
  $('themeToggle').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    toast(next === 'dark' ? 'Dark mode on' : 'Light mode on');
  });

  function closeMenu() {
    $('mainNav').classList.remove('open');
    $('menuToggle').setAttribute('aria-expanded', 'false');
    $('menuToggle').setAttribute('aria-label', 'Open menu');
  }
  $('menuToggle').addEventListener('click', () => {
    const open = $('mainNav').classList.toggle('open');
    $('menuToggle').setAttribute('aria-expanded', String(open));
    $('menuToggle').setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* Highlight the nav link for the section currently on screen. */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.main-nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['home', 'ask', 'faqs', 'notices', 'events', 'about', 'admin'].forEach((id) => observer.observe($(id)));
  }

  /* ---------- Start ---------- */
  fillSelect('faqCategory', CATEGORIES.faq);
  fillSelect('noticeCategory', CATEGORIES.notice);
  fillSelect('eventCategory', CATEGORIES.event);
  $('suggestions').innerHTML = SUGGESTED.map((q) => `<button type="button" class="chip" data-ask="${esc(q)}">${esc(q)}</button>`).join('');
  addWelcome();
  renderAll();
})();
