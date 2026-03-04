/* ══════════════════════════════════════════════
   Smart KART Admin — Shared Layout JS
   Include AFTER api-service.js on every admin page
══════════════════════════════════════════════ */

/* ── Sidebar toggle ──────────────────────────── */
window.toggleSidebar = function () {
    document.getElementById('a-sidebar').classList.toggle('open');
    document.getElementById('a-overlay').classList.toggle('open');
};
window.closeSidebar = function () {
    document.getElementById('a-sidebar').classList.remove('open');
    document.getElementById('a-overlay').classList.remove('open');
};

/* ── Clock ───────────────────────────────────── */
window._startAdminClock = function () {
    function tick() {
        const now = new Date();
        const timeEl = document.getElementById('a-tb-time');
        const dateEl = document.getElementById('a-tb-date');
        if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        if (dateEl) dateEl.textContent = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    }
    tick(); setInterval(tick, 1000);
};

/* ── Theme toggle ────────────────────────────── */
window._initAdminTheme = function () {
    const toggle = document.getElementById('a-theme-toggle');
    const apply = dark => {
        document.body.classList.toggle('dark', dark);
        if (toggle) toggle.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        try { localStorage.setItem('sk-theme', dark ? 'dark' : 'light'); } catch (e) { }
    };
    const saved = localStorage.getItem('sk-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    apply(saved === 'dark');
    if (toggle) toggle.addEventListener('click', () => apply(!document.body.classList.contains('dark')));
};

/* ── Toast (compatible with api-service showToast) ── */
if (!window.showToast) {
    window.showToast = function (msg, type = 'info') {
        let c = document.getElementById('a-toast-container');
        if (!c) { c = document.createElement('div'); c.id = 'a-toast-container'; document.body.appendChild(c); }
        const t = document.createElement('div');
        const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
        const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
        t.className = `a-toast a-toast-${type}`;
        t.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}" style="color:${colors[type] || '#3b82f6'}"></i>${msg}`;
        c.appendChild(t);
        requestAnimationFrame(() => { requestAnimationFrame(() => { t.classList.add('show'); }); });
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3500);
    };
}

/* ── Date formatter ──────────────────────────── */
if (!window.formatDate) {
    window.formatDate = function (d) {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };
}

/* ── Init user info in topbar ────────────────── */
window._initAdminUser = function () {
    const user = Auth.getUser();
    const name = user?.customer_name?.split(' ')[0] || 'Admin';
    const init = name.charAt(0).toUpperCase();
    ['a-tb-name', 'a-sb-name'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = name; });
    ['a-tb-avatar', 'a-sb-avatar'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = init; });
};

/* ── Run everything on DOMContentLoaded ───────── */
document.addEventListener('DOMContentLoaded', () => {
    _initAdminTheme();
    _startAdminClock();
    _initAdminUser();

    // Close sidebar on overlay click
    const overlay = document.getElementById('a-overlay');
    if (overlay) overlay.addEventListener('click', closeSidebar);
});
