/* Modal component */
const Modal = {
  show({ title, content, buttons = [] }) {
    this.close();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    const btnsHtml = buttons.map(b =>
      `<button class="btn ${b.class || 'btn-primary'}" data-action="${b.action || ''}">${b.text}</button>`
    ).join('');
    overlay.innerHTML = `
      <div class="modal-card" style="position:relative">
        <button class="modal-close" id="modal-close-btn">&times;</button>
        <h2>${title}</h2>
        <div>${content}</div>
        ${btnsHtml ? `<div class="modal-actions">${btnsHtml}</div>` : ''}
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#modal-close-btn').onclick = () => this.close();
    overlay.addEventListener('click', e => { if (e.target === overlay) this.close(); });
    buttons.forEach(b => {
      if (b.onClick) {
        const btn = overlay.querySelector(`[data-action="${b.action}"]`);
        if (btn) btn.onclick = () => { b.onClick(); this.close(); };
      }
    });
    document.addEventListener('keydown', this._escHandler);
  },
  close() {
    const el = document.getElementById('modal-overlay');
    if (el) el.remove();
    document.removeEventListener('keydown', this._escHandler);
  },
  _escHandler(e) { if (e.key === 'Escape') Modal.close(); }
};
export default Modal;
