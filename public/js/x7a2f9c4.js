// Configuration (Telegram credentials live on the server: Vercel env TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
const CONFIG = {
    SECRET_KEY: 'QJXPR-K8M2ZT5N9L3-RG6D',
    STORAGE_EXPIRY: 60 * 60 * 1000,
    COUNTDOWN_TIME: 30
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;

