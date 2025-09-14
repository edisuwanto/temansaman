/* ========== Main site JS (a11y, theme, portal gating, data helpers) ========== */

document.addEventListener('DOMContentLoaded', () => {
  initActiveNav();
  initThemeToggle();
  initContrastToggle();
  initFontControls();
  initFormLinks();
  initBackToTop();
  initPortalGating();
  announceOnToggle();
});

function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || "index.html";
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === path) {
      a.setAttribute('aria-current', 'page');
      a.classList.add('active');
    }
  });
}

/* ===== Theme: dark / light ===== */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  const saved = localStorage.getItem('saman-theme') || 'light';
  applyTheme(saved);
  toggle.checked = saved === 'dark';
  toggle.addEventListener('change', (e) => {
    const mode = e.target.checked ? 'dark' : 'light';
    applyTheme(mode);
    liveAnnounce(mode === 'dark' ? 'Mode gelap aktif.' : 'Mode terang aktif.');
  });
}
function applyTheme(mode) {
  document.documentElement.setAttribute('data-bs-theme', mode);
  localStorage.setItem('saman-theme', mode);
}

/* ===== High contrast ===== */
function initContrastToggle() {
  const toggle = document.getElementById('contrastToggle');
  if (!toggle) return;
  const saved = localStorage.getItem('saman-contrast') === '1';
  document.documentElement.classList.toggle('theme-contrast', saved);
  toggle.checked = saved;
  toggle.addEventListener('change', (e) => {
    const on = e.target.checked;
    document.documentElement.classList.toggle('theme-contrast', on);
    localStorage.setItem('saman-contrast', on ? '1' : '0');
    liveAnnounce(on ? 'Mode kontras tinggi aktif.' : 'Mode kontras tinggi nonaktif.');
  });
}

/* ===== Font controls ===== */
function initFontControls() {
  const inc = document.getElementById('fontInc');
  const dec = document.getElementById('fontDec');
  const reset = document.getElementById('fontReset');
  const html = document.documentElement;

  const base = 100;
  let current = parseInt(localStorage.getItem('saman-fontscale') || base, 10);
  html.style.fontSize = current + '%';

  function apply(val) {
    current = Math.max(80, Math.min(160, val));
    html.style.fontSize = current + '%';
    localStorage.setItem('saman-fontscale', current);
    liveAnnounce(`Ukuran font ${current}%`);
  }

  inc?.addEventListener('click', () => apply(current + 10));
  dec?.addEventListener('click', () => apply(current - 10));
  reset?.addEventListener('click', () => apply(base));
}

/* ===== Form links ===== */
function initFormLinks() {
  if (typeof CONFIG === 'undefined' || !CONFIG.forms) return;
  document.querySelectorAll('[data-form]').forEach(a => {
    const key = a.getAttribute('data-form');
    if (CONFIG.forms[key]) a.href = CONFIG.forms[key];
  });
}

/* ===== Back to top ===== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== Live announce ===== */
function liveAnnounce(message) {
  const region = document.getElementById('ariaLiveRegion');
  if (!region) return;
  region.textContent = '';
  setTimeout(() => region.textContent = message, 50);
}
function announceOnToggle() {
  document.querySelectorAll('[data-announce]').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-msg') || 'Perubahan diterapkan.';
      liveAnnounce(msg);
    });
  });
}

/* ===== Helpers ===== */
function setupTableFilter(inputSelector, tableSelector) {
  const input = document.querySelector(inputSelector);
  const table = document.querySelector(tableSelector);
  if (!input || !table) return;
  input.addEventListener('input', () => {
    const term = input.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });
}
function downloadCSV(filename, rows) {
  const processVal = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = rows.map(r => r.map(processVal).join(',')).join('\n');
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Gagal memuat ${path}`);
  return await res.json();
}

/* ===== ICS generator ===== */
function toICSDate(dt) {
  const p = (n) => String(n).padStart(2,'0');
  return dt.getFullYear() + p(dt.getMonth()+1) + p(dt.getDate()) + 'T' + p(dt.getHours()) + p(dt.getMinutes()) + p(dt.getSeconds());
}
function dayNameToIndex(id) {
  const map = {'minggu':0,'ahad':0,'senin':1,'selasa':2,'rabu':3,'kamis':4,'jumat':5,"jum'at":5,'sabtu':6};
  return map[(id||'senin').toLowerCase()] ?? 1;
}
function nextMonday(d=new Date()){const x=new Date(d);const day=x.getDay();const diff=(8-day)%7||7;x.setDate(x.getDate()+diff-(day===1?0:0));return x;}
function generateICS(scheduleItems) {
  const weekStart = nextMonday();
  const events = [];
  for (const s of scheduleItems) {
    const idx = dayNameToIndex(s.hari||s.day||'senin');
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + (idx-1));
    const [sh,sm]=(s.mulai||s.start).split(':').map(Number);
    const [eh,em]=(s.selesai||s.end).split(':').map(Number);
    const start = new Date(d); start.setHours(sh, sm||0, 0, 0);
    const end = new Date(d);   end.setHours(eh, em||0, 0, 0);
    const uid = `${Date.now()}-${Math.random().toString(16).slice(2)}@saman.site`;
    events.push([
      "BEGIN:VEVENT",
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      `SUMMARY:${(s.kelas||'Kelas') + (s.asatidz?(' - '+s.asatidz):'')}`,
      `LOCATION:${s.ruang||''}`,
      `DESCRIPTION:Halaqoh:${s.halaqoh||'-'} | Mapel:${s.mata_pelajaran||s.mapel||'-'}`,
      `UID:${uid}`,
      "END:VEVENT"
    ].join('\n'));
  }
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Saman//Jadwal//ID",...events,"END:VCALENDAR"].join('\n');
}
function downloadICS(filename, scheduleItems) {
  const ics = generateICS(scheduleItems);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

/* ===== Portal gating (client-side) ===== */
function portalEnabled() {
  return localStorage.getItem('saman-portal') === '1';
}
function setPortal(on) {
  localStorage.setItem('saman-portal', on ? '1' : '0');
  document.documentElement.setAttribute('data-portal', on ? '1' : '0');
  document.querySelectorAll('.portal-only').forEach(el => {
    el.hidden = !on;
    el.setAttribute('aria-hidden', (!on).toString());
  });
  const link = document.getElementById('portalNav');
  const admin = document.getElementById('adminNav');
  const btn = document.getElementById('portalToggle');
  const badge = document.getElementById('portalBadge');
  if (link) link.classList.toggle('d-none', !on);
  if (admin) admin.classList.toggle('d-none', !on);
  if (btn) btn.textContent = on ? 'Keluar Portal' : 'Masuk Portal';
  if (badge) badge.style.display = on ? 'inline-block' : 'none';
}
async function verifyPass(input) {
  if (!window.crypto?.subtle) return false;
  try {
    const enc = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    const hex = Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
    const expected = (CONFIG.admin && CONFIG.admin.passhash || '').toLowerCase().trim();
    return expected && hex === expected;
  } catch { return false; }
}
function initPortalGating() {
  setPortal(portalEnabled());
  const btn = document.getElementById('portalToggle');
  if (btn) {
    btn.addEventListener('click', async () => {
      if (portalEnabled()) {
        setPortal(false);
        liveAnnounce('Portal nonaktif.');
      } else {
        const pass = prompt('Masukkan kata sandi portal:');
        if (pass && await verifyPass(pass)) {
          setPortal(true);
          liveAnnounce('Portal aktif.');
        } else {
          alert('Kata sandi salah.');
        }
      }
    });
  }
}

/* ===== Visibility filter for dataset rows ===== */
function isVisibleForRow(row) {
  const vis = (row.visibility || '').toLowerCase();
  if (portalEnabled()) return true;
  return vis !== 'portal';
}

/* Expose helpers to pages */
window.SAMAN = { loadJSON, setupTableFilter, downloadCSV, downloadICS, isVisibleForRow, portalEnabled };
