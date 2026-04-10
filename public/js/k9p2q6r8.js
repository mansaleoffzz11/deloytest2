// Modal Manager
const Modal = {
    activeCount: 0,
    scrollY: 0,

    lockPageScroll() {
        try {
            this.scrollY = window.scrollY || window.pageYOffset || 0;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${this.scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } catch (_) { /* noop */ }
    },

    unlockPageScroll() {
        try {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window.scrollTo(0, this.scrollY || 0);
        } catch (_) { /* noop */ }
    },

    create(id, content) {
        const html = `
            <div id="${id}" class="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[2px] px-4 py-6 sm:px-6 sm:py-10 hidden">
                <div class="bg-white w-full max-w-md sm:max-w-lg max-h-[calc(100vh-4rem)] shadow-lg p-4 sm:p-5 rounded-2xl flex flex-col overflow-y-auto transform scale-0 opacity-0 transition-all duration-200">
                    ${content}
                </div>
            </div>
        `;
        document.getElementById('modalsContainer').insertAdjacentHTML('beforeend', html);
        try {
            // Re-apply translations for newly inserted nodes (ensures placeholders/text are localized)
            if (window.I18N && typeof window.I18N.setLang === 'function') {
                window.I18N.setLang(window.currentLang || (window.I18N.lang || 'en'));
            }
        } catch (_) { /* noop */ }
    },

    open(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        this.activeCount += 1;
        if (this.activeCount === 1) this.lockPageScroll();
        modal.classList.remove('hidden');
        setTimeout(() => {
            const content = modal.querySelector('div > div');
            if (!content) return;
            content.classList.remove('scale-0', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    },

    close(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        const content = modal.querySelector('div > div');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-0', 'opacity-0');
        }
        setTimeout(() => {
            modal.remove();
            this.activeCount = Math.max(0, this.activeCount - 1);
            if (this.activeCount === 0) this.unlockPageScroll();
        }, 200);
    }
};

if (typeof window !== 'undefined') window.Modal = Modal;

