/* Main App Entry Point */
import { setupRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check theme
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    const router = setupRouter();
    router.start();
});
