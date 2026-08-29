/* Toast notification system */
const Toast = {
  show(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    toast.onclick = () => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); };
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); } }, 4000);
  },
  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  warning(msg) { this.show(msg, 'warning'); },
  info(msg) { this.show(msg, 'info'); },
};
export default Toast;
