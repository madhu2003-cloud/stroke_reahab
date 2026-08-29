/* Loader/spinner utilities */
const Loader = {
  show() {
    if (document.getElementById('global-loader')) return;
    const el = document.createElement('div');
    el.id = 'global-loader';
    el.className = 'loader-overlay';
    el.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(el);
  },
  hide() {
    const el = document.getElementById('global-loader');
    if (el) el.remove();
  },
  skeleton(containerId, count = 3) {
    const c = document.getElementById(containerId);
    if (!c) return;
    let html = '';
    for (let i = 0; i < count; i++) {
      html += '<div class="skeleton skeleton-card" style="margin-bottom:16px"></div>';
    }
    c.innerHTML = html;
  },
  inlineSpinner() {
    return '<span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite"></span>';
  }
};
export default Loader;
