/**
 * Titik Hukum - Shared Theme Manager (Dark Mode)
 * Menyinkronkan preferensi tema (Light / Dark) di seluruh halaman Role User Biasa.
 */

(function () {
    const STORAGE_KEY = 'titikhukum_theme';

    const sunSvg = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="block">
            <circle cx="12" cy="12" r="4.5"></circle>
            <line x1="12" y1="1.5" x2="12" y2="4"></line>
            <line x1="12" y1="20" x2="12" y2="22.5"></line>
            <line x1="4.22" y1="4.22" x2="6" y2="6"></line>
            <line x1="18" y1="18" x2="19.78" y2="19.78"></line>
            <line x1="1.5" y1="12" x2="4" y2="12"></line>
            <line x1="20" y1="12" x2="22.5" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="6" y2="18"></line>
            <line x1="18" y1="6" x2="19.78" y2="4.22"></line>
        </svg>
    `;

    const moonSvg = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="block">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;

    function getPreferredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateIcons(isDark) {
        const iconContainers = document.querySelectorAll('#navThemeIconContainer, #navThemeIconContainerMobile, .theme-toggle-icon');
        iconContainers.forEach(container => {
            container.innerHTML = isDark ? sunSvg : moonSvg;
            container.style.transition = 'transform 0.3s ease';
            container.style.transform = isDark ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        // Sinkronisasi switch toggle di halaman Pengaturan
        const settingsToggle = document.getElementById('darkModeToggle');
        if (settingsToggle) {
            settingsToggle.checked = isDark;
        }
    }

    function applyTheme(theme, save = true) {
        const isDark = theme === 'dark';
        if (isDark) {
            document.documentElement.classList.add('dark');
            if (document.body) document.body.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            if (document.body) document.body.classList.remove('dark');
        }

        if (save) {
            localStorage.setItem(STORAGE_KEY, theme);
        }

        // Logo di navbar coklat (.navbar-brown) SELALU putih (logo-white.png) baik di mode terang maupun mode gelap.
        // Logo gelap (logo.png) hanya dipakai di chatbot (chat.html) saat mode terang karena latar header-nya putih.
        const logoImgs = document.querySelectorAll('img[src$="logo.png"], img[src$="logo-white.png"]');
        logoImgs.forEach(img => {
            // Jika menggunakan dual-img markup (dark:hidden / dark:block), serahkan ke Tailwind CSS
            if (img.classList.contains('dark:hidden') || img.classList.contains('dark:block')) return;

            // Jika di dalam navbar-brown, pastikan SELALU logo-white.png
            if (img.closest('.navbar-brown') || img.closest('header.navbar-brown') || !window.location.pathname.includes('chat')) {
                if (!img.src.endsWith('logo-white.png')) {
                    img.src = img.src.replace(/logo\.png$/, 'logo-white.png');
                }
                return;
            }

            // Khusus halaman chatbot (chat.html): mode gelap = logo-white.png, mode terang = logo.png
            if (isDark) {
                img.src = img.src.replace(/logo\.png$/, 'logo-white.png');
            } else {
                img.src = img.src.replace(/logo-white\.png$/, 'logo.png');
            }
        });

        updateIcons(isDark);
    }

    function toggleTheme() {
        const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
    }

    // Expose secara global agar fungsi onclick eksisting tetap berfungsi
    window.TitikHukumTheme = {
        applyTheme,
        toggleTheme,
        getPreferredTheme,
        isDark: () => document.documentElement.classList.contains('dark')
    };

    // Override toggleNavTheme & toggleDarkModeSetting eksisting
    window.toggleNavTheme = toggleTheme;
    window.toggleDarkModeSetting = function () {
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            applyTheme(toggle.checked ? 'dark' : 'light', true);
        } else {
            toggleTheme();
        }
    };

    // Sinkronisasi perubahan tema jika dibuka di multi-tab
    window.addEventListener('storage', function (e) {
        if (e.key === STORAGE_KEY && e.newValue) {
            applyTheme(e.newValue, false);
        }
    });

    // Inisialisasi awal saat DOM siap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyTheme(getPreferredTheme(), false);
        });
    } else {
        applyTheme(getPreferredTheme(), false);
    }
})();
