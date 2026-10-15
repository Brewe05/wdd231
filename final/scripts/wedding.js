import {
  MAX_SEATS, SEATS_PER_ROW, DATA_URL, RSVP_KEY, VISIT_KEY,
  ARRIVAL_TIME, CEREMONY_TIME, WEDDING_DATE_LABEL, WEDDING_DATE_ISO,
  REL_LABELS, REL_RANK
} from './wedding-config.js';

(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // storage 
  function getRsvps() {
    try {
      const raw = localStorage.getItem(RSVP_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) { console.error('RSVPs unreadable:', err); return []; }
  }
  function saveRsvp(entry) {
    try {
      const all = getRsvps();
      all.push(entry);
      localStorage.setItem(RSVP_KEY, JSON.stringify(all));
      return true;
    } catch (err) { console.error('RSVP not saved:', err); return false; }
  }
  function latestRsvp() { const a = getRsvps(); return a.length ? a[a.length - 1] : null; }
  function getVisits() { try { return Number(localStorage.getItem(VISIT_KEY)) || 0; } catch (e) { return 0; } }
  function bumpVisits() {
    try { const next = getVisits() + 1; localStorage.setItem(VISIT_KEY, String(next)); return next; }
    catch (e) { return 1; }
  }
 /* Load guest data */
  async function loadGuests() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error('Guest list request failed: ' + response.status);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Guest list file is not an array.');
      return data;
    } catch (error) {
      console.error('Guest list could not be loaded:', error);
      return [];
    }
  }

  function mergeLists(invited, rsvps) {
    const a = (invited || []).map((g) => ({
      id: String(g.id != null ? g.id : g.name),
      name: g.name,
      relationship: g.relationship,
      role: g.role || 'Invited guest',
      attending: g.attending === true,
      note: g.note || '',
      partySize: 1,
      source: 'Invitation list'
    }));
    const b = (rsvps || []).map((r, i) => ({
      id: 'web-' + i,
      name: r.name,
      relationship: r.relationship,
      role: 'Replied through the website',
      attending: r.attending === 'yes',
      note: r.reason || '',
      partySize: Number(r.partySize) || 1,
      source: 'Website RSVP'
    }));
    return a.concat(b);
  }

  function buildPlan(guests) {
    const attending = guests.filter((g) => g.attending);
    const ordered = attending.slice().sort((x, y) => {
      const d = (REL_RANK[x.relationship] || 9) - (REL_RANK[y.relationship] || 9);
      return d !== 0 ? d : x.name.localeCompare(y.name);
    });
    const plan = new Map();
    let next = 1;
    ordered.forEach((g) => {
      const size = Math.max(1, Number(g.partySize) || 1);
      const start = next;
      const end = Math.min(next + size - 1, MAX_SEATS);
      plan.set(g.name.toLowerCase(), Object.assign({}, g, { seat: start, seatStart: start, seatEnd: end }));
      next = end + 1;
    });
    return plan;
  }
  function seatsUsed(plan) {
    let highest = 0;
    plan.forEach((e) => { if (e.seatEnd > highest) highest = e.seatEnd; });
    return Math.min(highest, MAX_SEATS);
  }
  function describeSeat(seat) {
    const row = Math.ceil(seat / SEATS_PER_ROW);
    const pos = ((seat - 1) % SEATS_PER_ROW) + 1;
    const half = SEATS_PER_ROW / 2;
    return { row: row, side: pos <= half ? 'left' : 'right' };
  }
  function seatSentence(entry) {
    if (!entry) return 'Seat not yet assigned.';
    const d = describeSeat(entry.seatStart);
    if (entry.seatEnd > entry.seatStart) {
      return `Seats ${entry.seatStart} to ${entry.seatEnd}, starting in row ${d.row} on the ${d.side} side of the aisle.`;
      }
      return `Seat ${entry.seatStart}, in row ${d.row} on the ${d.side} side of the aisle.`;
  }

  function initNav() {
    const btn = $('.nav-toggle');
    const nav = $('#site-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a') && window.matchMedia('(max-width:47.99em)').matches) {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
  function initYear() { $$('.year').forEach((el) => { el.textContent = new Date().getFullYear(); }); }
  function initCountdown() {
    const el = $('#countdown');
    if (!el) return;
    const target = new Date(WEDDING_DATE_ISO).getTime();
    function tick() {
      const d = target - Date.now();
      if (d <= 0) { el.innerHTML = '<li><span class="num">&#10003;</span><span class="lbl">Married</span></li>'; return; }
      const days = Math.floor(d / 86400000);
      const hours = Math.floor((d % 86400000) / 3600000);
      const mins = Math.floor((d % 3600000) / 60000);
      const secs = Math.floor((d % 60000) / 1000);
      el.innerHTML = `
        <li><span class="num">${days}</span><span class="lbl">Days</span></li>
        <li><span class="num">${hours}</span><span class="lbl">Hours</span></li>
        <li><span class="num">${mins}</span><span class="lbl">Minutes</span></li>
        <li><span class="num">${secs}</span><span class="lbl">Seconds</span></li>`;
    }
    tick();
    window.setInterval(tick, 1000);
  }

  async function initRsvpPage() {
    const form = $('#rsvp-form');
    if (!form) return;

    const msg = $('#form-message');
    const capacityNote = $('#capacity-note');
    const welcome = $('#welcome-back');
    const welcomeTitle = $('#welcome-title');
    const welcomeText = $('#welcome-text');
    const reason = $('#reason');
    const reasonLabel = $('#reason-label');
    const reasonOpt = $('#reason-optional');
    const reasonHint = $('#reason-hint');

    const invited = await loadGuests();
    let plan = new Map();

    function refresh() {
      plan = buildPlan(mergeLists(invited, getRsvps()));
      const used = seatsUsed(plan);
      const remaining = Math.max(0, MAX_SEATS - used);
      if (capacityNote) {
        capacityNote.textContent = used + ' of ' + MAX_SEATS + ' seats are taken. ' +
          (remaining === 1 ? '1 seat is' : remaining + ' seats are') + ' still open.';
      }
      return { used: used, remaining: remaining };
    }
    function showMsg(type, text) {
      if (!msg) return;
      msg.hidden = false;
      msg.className = 'alert alert--' + type;
      msg.textContent = text;
    }
    function clearMsg() { if (msg) { msg.hidden = true; msg.textContent = ''; } }

    function syncReason() {
      const attending = form.querySelector('input[name="attending"]:checked');
      if (attending && attending.value === 'no') {
        reason.required = true;
        reason.setAttribute('aria-required', 'true');
        if (reasonLabel) reasonLabel.firstChild.textContent = 'Please tell us why you cannot make it ';
        if (reasonOpt) reasonOpt.hidden = true;
        if (reasonHint) reasonHint.textContent = 'We would love to know so we can keep you in our thoughts.';
      } else {
        reason.required = false;
        reason.removeAttribute('aria-required');
        if (reasonLabel) reasonLabel.firstChild.textContent = 'A message for the couple ';
        if (reasonOpt) reasonOpt.hidden = false;
        if (reasonHint) reasonHint.textContent = 'Dietary needs, a song request, or a note for us.';
      }
    }

    const priorVisits = getVisits();
    bumpVisits();
    const previous = latestRsvp();
    refresh();
    if (welcome && priorVisits >= 1 && previous) {
      const seatEntry = plan.get(String(previous.name).toLowerCase());
      welcome.hidden = false;
      if (previous.attending === 'yes') {
        welcomeTitle.textContent = 'Welcome back, ' + previous.name + '!';
        welcomeText.innerHTML =
          'You have already told us you will be joining us on <strong>' + WEDDING_DATE_LABEL + '</strong>. ' +
          'Please arrive by <strong>' + ARRIVAL_TIME + '</strong> so you are seated before the ' +
          CEREMONY_TIME + ' ceremony. ' +
          (seatEntry
            ? 'Your seat is <strong>number ' + seatEntry.seatStart + '</strong>' +
              (seatEntry.seatEnd > seatEntry.seatStart ? ' (seats ' + seatEntry.seatStart + '&ndash;' + seatEntry.seatEnd + ')' : '') +
              '. ' + esc(seatSentence(seatEntry))
            : 'Your seat will be confirmed shortly.');
      } else {
        welcomeTitle.textContent = 'Welcome back, ' + previous.name;
        welcomeText.textContent =
          'We have you down as unable to attend on ' + WEDDING_DATE_LABEL + '. You will be missed. ' +
          'If plans change, send us another reply or email brentwelsford@gmail.com.';
      }
    }

    form.addEventListener('submit', (event) => {
      const data = new FormData(form);
      const attending = data.get('attending');
      const partySize = Math.max(1, Number(data.get('partySize')) || 1);
      const { remaining } = refresh();
      clearMsg();

      if (remaining === 0) {
        event.preventDefault();
        showMsg('error',
          'We are so sorry, but the guest list is full. All ' + MAX_SEATS +
          ' seats have already been taken. Please reach out to us as soon as possible at ' +
          'brentwelsford@gmail.com or 072 527 3575 so we can see if we can make another plan for you.');
        return;
      }
      if (attending === 'yes' && partySize > remaining) {
        event.preventDefault();
        showMsg('error',
          'There ' + (remaining === 1 ? 'is only 1 seat' : 'are only ' + remaining + ' seats') +
          ' left out of ' + MAX_SEATS + '. Please reduce the number of people in your party, ' +
          'or contact us at brentwelsford@gmail.com or 072 527 3575 so we can try to make a plan.');
        return;
      }

      const entry = {
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        phone: String(data.get('phone') || '').trim(),
        relationship: String(data.get('relationship') || 'friend'),
        attending: attending,
        partySize: attending === 'yes' ? partySize : 0,
        reason: String(data.get('reason') || '').trim(),
        submitted: new Date().toISOString()
      };

      if (!saveRsvp(entry)) {
        event.preventDefault();
        showMsg('error', 'Your reply could not be saved on this device. Please try again.');
        return;
      }

      const { remaining: after } = refresh();
      const seatEntry = plan.get(entry.name.toLowerCase());
      const seatField = form.querySelector('#seat-field');
      if (seatField && seatEntry) seatField.value = seatSentence(seatEntry);

      if (attending === 'yes') {
        showMsg('success',
          'Thank you, ' + entry.name + '. Your seat is reserved. ' +
          (seatEntry ? seatSentence(seatEntry) : '') +
          ' There ' + (after === 1 ? 'is 1 seat' : 'are ' + after + ' seats') + ' left.');
      } else {
        showMsg('success', 'Thank you for letting us know, ' + entry.name + '. We will miss you on the day.');
      }
    });

    $$('input[name="attending"]', form).forEach((r) => r.addEventListener('change', syncReason));
    syncReason();
  }

  async function initDetailsPage() {
    const grid = $('#guest-grid');
    if (!grid) return;

    const summary = $('#guest-summary');
    const status = $('#guest-status');
    const filterBar = $('#guest-filters');
    const chart = $('#seat-chart');
    const modal = $('#guest-modal');
    const modalTitle = $('#guest-modal-title');
    const modalBody = $('#guest-modal-body');
    const modalClose = $('#guest-modal-close');

    const invited = await loadGuests();
    if (!invited.length) {
      if (status) {
        status.textContent = 'We could not load the guest list right now. Please refresh the page.';
        status.className = 'alert alert--error';
      }
      return;
    }

    const merged = mergeLists(invited, getRsvps());
    const plan = buildPlan(merged);
    const used = seatsUsed(plan);
    const remaining = Math.max(0, MAX_SEATS - used);
    const attendingCount = merged.filter((g) => g.attending).length;

    if (summary) {
      summary.textContent = merged.length + ' people are on the list. ' +
        attendingCount + ' have confirmed they are coming, using ' + used + ' of the ' +
        MAX_SEATS + ' seats. ' + (remaining === 1 ? '1 seat is' : remaining + ' seats are') + ' still open.';
    }

    let activeFilter = 'all';

    function renderGuests() {
      const visible = activeFilter === 'all'
        ? merged
        : merged.filter((g) => g.relationship === activeFilter);

      if (!visible.length) {
        grid.innerHTML = '<p class="empty">No guests match this filter yet.</p>';
        if (status) status.textContent = 'Showing 0 guests.';
        return;
      }

      grid.innerHTML = visible.map(function (g) {
        const seat = plan.get(g.name.toLowerCase());
        const seatLabel = seat
          ? 'Seat ' + seat.seatStart + (seat.seatEnd > seat.seatStart ? '&ndash;' + seat.seatEnd : '')
          : 'Not seated';
        return `
          <article class="guest-card guest-card--${esc(g.relationship)}">
            <h3>${esc(g.name)}</h3>
            <p class="role">${esc(g.role)}</p>
            <ul>
              <li><span class="label">Connection</span> ${esc(REL_LABELS[g.relationship] || 'Guest')}</li>
              <li><span class="label">Phone</span> ${esc(g.phone)}</li>
              <li><span class="label">Seat</span> ${seatLabel}</li>
              <li><span class="label">Attending</span> ${g.attending ? 'Yes' : 'No'}</li>
            </ul>
            <button class="btn btn--ghost" type="button" data-guest="${esc(g.name)}">More details</button>
          </article>`;
      }).join('');

      if (status) status.textContent = 'Showing ' + visible.length + ' of ' + merged.length + ' guests.';
    }

    function openModal(name) {
      const guest = merged.find(function (g) { return g.name.toLowerCase() === name.toLowerCase(); });
      if (!guest || !modal) return;
      const seat = plan.get(guest.name.toLowerCase());
      modalTitle.textContent = guest.name;
      modalBody.innerHTML = `
        <dl class="modal-list">
          <dt>Connection</dt><dd>${esc(REL_LABELS[guest.relationship] || 'Guest')}</dd>
          <dt>Role</dt><dd>${esc(guest.role)}</dd>
          <dt>Phone</dt><dd>${esc(guest.phone)}</dd>
          <dt>Email</dt><dd>${esc(guest.email)}</dd>
          <dt>Attending</dt><dd>${guest.attending ? 'Yes &mdash; 21 October 2027' : 'No &mdash; cannot attend'}</dd>
          <dt>Seating</dt><dd>${esc(seat ? seatSentence(seat) : 'Not yet seated')}</dd>
          <dt>Note</dt><dd>${esc(guest.note) || '&mdash;'}</dd>
          <dt>Source</dt><dd>${esc(guest.source)}</dd>
        </dl>`;
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
    }
    function closeModal() {
      if (!modal) return;
      if (typeof modal.close === 'function') modal.close();
      else modal.removeAttribute('open');
    }

    function renderChart() {
      if (!chart) return;
      const owner = new Map();
      plan.forEach(function (e) {
        for (let s = e.seatStart; s <= e.seatEnd; s += 1) owner.set(s, e);
      });
      const totalRows = Math.ceil(MAX_SEATS / SEATS_PER_ROW);
      let html = '';
      for (let row = 1; row <= totalRows; row += 1) {
        const first = (row - 1) * SEATS_PER_ROW + 1;
        const last = Math.min(row * SEATS_PER_ROW, MAX_SEATS);
        const nums = [];
        for (let s = first; s <= last; s += 1) nums.push(s);
        const half = Math.ceil(nums.length / 2);
        const left = nums.slice(0, half);
        const right = nums.slice(half);

        function seatHtml(s) {
          const o = owner.get(s);
          const kind = o ? 'seat--' + o.relationship : 'seat--empty';
          const title = o
            ? 'Seat ' + s + ' — ' + o.name + ' (' + (REL_LABELS[o.relationship] || 'Guest') + ')'
            : 'Seat ' + s + ' — open';
          return `<span class="seat ${kind}" title="${esc(title)}" aria-label="${esc(title)}">${s}</span>`;
        }
        html += `
          <div class="seat-row">
            <span class="seat-row__label">Row ${row}</span>
            <div class="seat-line">${left.map(seatHtml).join('')}</div>
            <div class="aisle" aria-hidden="true"></div>
            <div class="seat-line">${right.map(seatHtml).join('')}</div>
          </div>`;
      }
      chart.innerHTML = html;
    }

    if (filterBar) {
      filterBar.addEventListener('click', function (e) {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        activeFilter = btn.dataset.filter;
        $$('.filter-btn', filterBar).forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        renderGuests();
      });
    }
    grid.addEventListener('click', function (e) {
      const btn = e.target.closest('button[data-guest]');
      if (btn) openModal(btn.dataset.guest);
    });
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    renderGuests();
    renderChart();
  }

  async function initConfirmPage() {
    const list = $('#confirm-list');
    if (!list) return;

    const params = new URLSearchParams(window.location.search);
    const reply = {
      name: params.get('name') || 'Guest',
      email: params.get('email') || '',
      phone: params.get('phone') || '',
      relationship: params.get('relationship') || '',
      attending: params.get('attending') || '',
      partySize: params.get('partySize') || '1',
      reason: params.get('reason') || '',
      seat: params.get('seat') || ''
    };
    const isAttending = reply.attending === 'yes';

    let seatText = reply.seat;
    try {
      const invited = await loadGuests();
      const plan = buildPlan(mergeLists(invited, getRsvps()));
      const entry = plan.get(reply.name.toLowerCase());
      if (entry) seatText = seatSentence(entry);
    } catch (error) {
      console.error('Seat lookup failed:', error);
    }

    const heading = $('#confirm-heading');
    const lead = $('#confirm-lead');
    const banner = $('#confirm-message');

    if (heading) heading.textContent = isAttending
      ? 'Thank you, ' + reply.name + '!'
      : 'Thank you for letting us know, ' + reply.name;
    if (lead) lead.textContent = isAttending
      ? 'We cannot wait to celebrate with you on ' + WEDDING_DATE_LABEL + '.'
      : 'We are sorry you cannot make it on ' + WEDDING_DATE_LABEL + ', but we are grateful that you told us.';
    if (banner) banner.textContent = isAttending
      ? 'Your place is confirmed. Please arrive by ' + ARRIVAL_TIME + ' for the ' + CEREMONY_TIME + ' ceremony.'
      : 'If your plans change, you are always welcome to send us another reply.';

    function row(term, value) { return `<div><dt>${term}</dt><dd>${value}</dd></div>`; }

    list.innerHTML = [
      row('Name', esc(reply.name)),
      row('Email', esc(reply.email)),
      row('Mobile', esc(reply.phone)),
      row('Connection', esc(REL_LABELS[reply.relationship] || 'Not given')),
      row('Attending', isAttending ? 'Yes, on 21 October 2027' : 'No, unable to attend'),
      row('Party size', isAttending ? esc(reply.partySize) : '0'),
      row('Seating', isAttending ? esc(seatText || 'Your seat will be confirmed shortly.') : 'Not applicable'),
      row('Arrival time', isAttending ? ARRIVAL_TIME + ' (ceremony at ' + CEREMONY_TIME + ')' : 'Not applicable'),
      row('Message', esc(reply.reason) || 'No message left')
    ].join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initYear();
    initCountdown();
    initRsvpPage();
    initDetailsPage();
    initConfirmPage();
  });
})();