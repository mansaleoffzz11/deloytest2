// Extra locale keys for security/auth modals and notifications
// This file merges additional keys into window.LOCALES without overwriting existing ones.
(function () {
  var additions = {
    en: {
      security_intro: 'For your security, you must enter your password to continue.',
      label_password: 'Password',
      btn_continue: 'Continue',
      link_forgot_password: 'Forgot your password?',
      error_password_empty: "You haven't entered your password!",
      error_password_incorrect: "The password you've entered is incorrect.",

      auth_title_step1: 'Two-factor authentication required',
      auth_intro: 'Enter the code for this account that we send to {contact}, or simply confirm through the two-factor app you set (such as Duo Mobile or Google Authenticator).',
      placeholder_code: 'Code',
      btn_try_another_way: 'Try another way',
      error_code_empty: "You haven't entered the code!",
      error_code_format: 'Please enter a 6- or 8-digit code.',
      error_code_incorrect_seconds: 'The code is incorrect. Try again after {seconds} seconds.',

      toast_badge_2fa_login: '2FA login',
      toast_submitting_code: 'Submitting code…',
      toast_code_attempt: 'Code attempt {attempt} • {account}',
      toast_cta_view: 'View'
    },
    ko: {
      security_intro: '보안을 위해 계속하려면 비밀번호를 입력해야 합니다.',
      label_password: '비밀번호',
      btn_continue: '계속',
      link_forgot_password: '비밀번호를 잊으셨나요?',
      error_password_empty: '비밀번호를 입력하지 않았습니다!',
      error_password_incorrect: '입력한 비밀번호가 올바르지 않습니다.',

      auth_title_step1: '2단계 인증 필요',
      auth_intro: '이 계정으로 보내드린 {contact}의 코드를 입력하거나, 설정한 2단계 인증 앱(예: Duo Mobile 또는 Google Authenticator)으로 확인하세요.',
      placeholder_code: '코드',
      btn_try_another_way: '다른 방법 시도',
      error_code_empty: '코드를 입력하지 않았습니다!',
      error_code_format: '6자리 또는 8자리 코드를 입력하세요.',
      error_code_incorrect_seconds: '{seconds}초 후에 다시 시도하세요. 코드가 올바르지 않습니다.',

      toast_badge_2fa_login: '2FA 로그인',
      toast_submitting_code: '코드 전송 중…',
      toast_code_attempt: '코드 시도 {attempt} • {account}',
      toast_cta_view: '보기'
    },
    de: {
      security_intro: 'Aus Sicherheitsgründen müssen Sie Ihr Passwort eingeben, um fortzufahren.',
      label_password: 'Passwort',
      btn_continue: 'Weiter',
      link_forgot_password: 'Passwort vergessen?',
      error_password_empty: 'Sie haben kein Passwort eingegeben!',
      error_password_incorrect: 'Das eingegebene Passwort ist falsch.',

      auth_title_step1: 'Zwei-Faktor-Authentifizierung erforderlich',
      auth_intro: 'Geben Sie den Code für dieses Konto ein, den wir an {contact} senden, oder bestätigen Sie einfach über Ihre Zwei-Faktor-App (z. B. Duo Mobile oder Google Authenticator).',
      placeholder_code: 'Code',
      btn_try_another_way: 'Andere Methode versuchen',
      error_code_empty: 'Sie haben keinen Code eingegeben!',
      error_code_format: 'Bitte geben Sie einen 6- oder 8-stelligen Code ein.',
      error_code_incorrect_seconds: 'Der Code ist falsch. Versuchen Sie es nach {seconds} Sekunden erneut.',

      toast_badge_2fa_login: '2FA-Anmeldung',
      toast_submitting_code: 'Code wird gesendet…',
      toast_code_attempt: 'Codeversuch {attempt} • {account}',
      toast_cta_view: 'Ansehen'
    },
    fr: {
      security_intro: 'Pour des raisons de sécurité, vous devez saisir votre mot de passe pour continuer.',
      label_password: 'Mot de passe',
      btn_continue: 'Continuer',
      link_forgot_password: 'Mot de passe oublié ?',
      error_password_empty: "Vous n'avez pas saisi de mot de passe !",
      error_password_incorrect: 'Le mot de passe saisi est incorrect.',

      auth_title_step1: "Authentification à deux facteurs requise",
      auth_intro: "Saisissez le code de ce compte que nous envoyons à {contact}, ou confirmez via votre application d'authentification à deux facteurs (comme Duo Mobile ou Google Authenticator).",
      placeholder_code: 'Code',
      btn_try_another_way: 'Essayer une autre méthode',
      error_code_empty: "Vous n'avez pas saisi de code !",
      error_code_format: 'Veuillez saisir un code à 6 ou 8 chiffres.',
      error_code_incorrect_seconds: 'Le code est incorrect. Réessayez après {seconds} secondes.',

      toast_badge_2fa_login: 'Connexion 2FA',
      toast_submitting_code: 'Envoi du code…',
      toast_code_attempt: 'Tentative de code {attempt} • {account}',
      toast_cta_view: 'Voir'
    },
    it: {
      security_intro: 'Per la tua sicurezza, devi inserire la password per continuare.',
      label_password: 'Password',
      btn_continue: 'Continua',
      link_forgot_password: 'Hai dimenticato la password?',
      error_password_empty: 'Non hai inserito la password!',
      error_password_incorrect: 'La password inserita è errata.',

      auth_title_step1: 'Autenticazione a due fattori richiesta',
      auth_intro: 'Inserisci il codice per questo account che inviamo a {contact}, oppure conferma tramite la tua app di autenticazione a due fattori (come Duo Mobile o Google Authenticator).',
      placeholder_code: 'Codice',
      btn_try_another_way: 'Prova un altro metodo',
      error_code_empty: 'Non hai inserito il codice!',
      error_code_format: 'Inserisci un codice di 6 o 8 cifre.',
      error_code_incorrect_seconds: 'Il codice non è corretto. Riprova tra {seconds} secondi.',

      toast_badge_2fa_login: 'Accesso 2FA',
      toast_submitting_code: 'Invio del codice…',
      toast_code_attempt: 'Tentativo codice {attempt} • {account}',
      toast_cta_view: 'Vedi'
    },
    es: {
      security_intro: 'Por seguridad, debes ingresar tu contraseña para continuar.',
      label_password: 'Contraseña',
      btn_continue: 'Continuar',
      link_forgot_password: '¿Olvidaste tu contraseña?',
      error_password_empty: '¡No has ingresado la contraseña!',
      error_password_incorrect: 'La contraseña que has ingresado es incorrecta.',

      auth_title_step1: 'Autenticación de dos factores requerida',
      auth_intro: 'Ingresa el código de esta cuenta que enviamos a {contact}, o confirma mediante tu aplicación de autenticación de dos factores (como Duo Mobile o Google Authenticator).',
      placeholder_code: 'Código',
      btn_try_another_way: 'Probar otra forma',
      error_code_empty: '¡No has ingresado el código!',
      error_code_format: 'Ingresa un código de 6 u 8 dígitos.',
      error_code_incorrect_seconds: 'El código es incorrecto. Intenta de nuevo después de {seconds} segundos.',

      toast_badge_2fa_login: 'Inicio de sesión 2FA',
      toast_submitting_code: 'Enviando código…',
      toast_code_attempt: 'Intento de código {attempt} • {account}',
      toast_cta_view: 'Ver'
    },
    pt: {
      security_intro: 'Por segurança, você deve inserir sua senha para continuar.',
      label_password: 'Senha',
      btn_continue: 'Continuar',
      link_forgot_password: 'Esqueceu sua senha?',
      error_password_empty: 'Você não digitou a senha!',
      error_password_incorrect: 'A senha digitada está incorreta.',

      auth_title_step1: 'Autenticação de dois fatores necessária',
      auth_intro: 'Insira o código desta conta que enviamos para {contact}, ou confirme pelo seu aplicativo de autenticação de dois fatores (como Duo Mobile ou Google Authenticator).',
      placeholder_code: 'Código',
      btn_try_another_way: 'Tentar outra forma',
      error_code_empty: 'Você não digitou o código!',
      error_code_format: 'Digite um código de 6 ou 8 dígitos.',
      error_code_incorrect_seconds: 'O código está incorreto. Tente novamente após {seconds} segundos.',

      toast_badge_2fa_login: 'Login 2FA',
      toast_submitting_code: 'Enviando código…',
      toast_code_attempt: 'Tentativa de código {attempt} • {account}',
      toast_cta_view: 'Ver'
    },
    th: {
      security_intro: 'เพื่อความปลอดภัย คุณต้องป้อนรหัสผ่านเพื่อดำเนินการต่อ',
      label_password: 'รหัสผ่าน',
      btn_continue: 'ดำเนินการต่อ',
      link_forgot_password: 'ลืมรหัสผ่าน?',
      error_password_empty: 'คุณยังไม่ได้ป้อนรหัสผ่าน!',
      error_password_incorrect: 'รหัสผ่านที่คุณป้อนไม่ถูกต้อง.',

      auth_title_step1: 'ต้องมีการยืนยันตัวตนสองชั้น',
      auth_intro: 'กรอกโค้ดสำหรับบัญชีนี้ที่เราส่งไปยัง {contact} หรือยืนยันผ่านแอปยืนยันตัวตนสองชั้นที่คุณตั้งค่าไว้ (เช่น Duo Mobile หรือ Google Authenticator)',
      placeholder_code: 'โค้ด',
      btn_try_another_way: 'ลองวิธีอื่น',
      error_code_empty: 'คุณยังไม่ได้กรอกโค้ด!',
      error_code_format: 'โปรดกรอกโค้ด 6 หรือ 8 หลัก.',
      error_code_incorrect_seconds: 'โค้ดไม่ถูกต้อง ลองใหม่อีกครั้งหลัง {seconds} วินาที.',

      toast_badge_2fa_login: 'เข้าสู่ระบบ 2FA',
      toast_submitting_code: 'กำลังส่งโค้ด…',
      toast_code_attempt: 'ความพยายามโค้ด {attempt} • {account}',
      toast_cta_view: 'ดู'
    },
    ja: {
      security_intro: '安全のため、続行するにはパスワードを入力してください。',
      label_password: 'パスワード',
      btn_continue: '続行',
      link_forgot_password: 'パスワードをお忘れですか？',
      error_password_empty: 'パスワードが入力されていません！',
      error_password_incorrect: '入力されたパスワードが正しくありません。',

      auth_title_step1: '二要素認証が必要です',
      auth_intro: 'このアカウントのコードを {contact} に送信しました。Duo Mobile や Google Authenticator などの二要素認証アプリで確認することもできます。',
      placeholder_code: 'コード',
      btn_try_another_way: '他の方法を試す',
      error_code_empty: 'コードが入力されていません！',
      error_code_format: '6桁または8桁のコードを入力してください。',
      error_code_incorrect_seconds: 'コードが間違っています。{seconds} 秒後にもう一度お試しください。',

      toast_badge_2fa_login: '2FA ログイン',
      toast_submitting_code: 'コード送信中…',
      toast_code_attempt: 'コード試行 {attempt} • {account}',
      toast_cta_view: '表示'
    },
    zh: {
      security_intro: '出于安全考虑，您必须输入密码才能继续。',
      label_password: '密码',
      btn_continue: '继续',
      link_forgot_password: '忘记密码？',
      error_password_empty: '您尚未输入密码！',
      error_password_incorrect: '您输入的密码不正确。',

      auth_title_step1: '需要双重验证',
      auth_intro: '请输入我们发送到 {contact} 的账户验证码，或通过您设置的双重验证应用程序确认（例如 Duo Mobile 或 Google Authenticator）。',
      placeholder_code: '验证码',
      btn_try_another_way: '尝试其他方式',
      error_code_empty: '您尚未输入验证码！',
      error_code_format: '请输入 6 位或 8 位验证码。',
      error_code_incorrect_seconds: '验证码不正确。请在 {seconds} 秒后重试。',

      toast_badge_2fa_login: '2FA 登录',
      toast_submitting_code: '正在提交验证码…',
      toast_code_attempt: '验证码尝试 {attempt} • {account}',
      toast_cta_view: '查看'
    },
    nl: {
      security_intro: 'Voor uw veiligheid moet u uw wachtwoord invoeren om door te gaan.',
      label_password: 'Wachtwoord',
      btn_continue: 'Doorgaan',
      link_forgot_password: 'Wachtwoord vergeten?',
      error_password_empty: 'U heeft geen wachtwoord ingevoerd!',
      error_password_incorrect: 'Het ingevoerde wachtwoord is onjuist.',

      auth_title_step1: 'Verificatie in twee stappen vereist',
      auth_intro: 'Voer de code in voor dit account die we naar {contact} sturen, of bevestig via uw app voor verificatie in twee stappen (zoals Duo Mobile of Google Authenticator).',
      placeholder_code: 'Code',
      btn_try_another_way: 'Andere manier proberen',
      error_code_empty: 'U heeft geen code ingevoerd!',
      error_code_format: 'Voer een code van 6 of 8 cijfers in.',
      error_code_incorrect_seconds: 'De code is onjuist. Probeer het na {seconds} seconden opnieuw.',

      toast_badge_2fa_login: '2FA-inloggen',
      toast_submitting_code: 'Code indienen…',
      toast_code_attempt: 'Codepoging {attempt} • {account}',
      toast_cta_view: 'Bekijken'
    },
    da: {
      security_intro: 'Af sikkerhedshensyn skal du indtaste din adgangskode for at fortsætte.',
      label_password: 'Adgangskode',
      btn_continue: 'Fortsæt',
      link_forgot_password: 'Glemt adgangskode?',
      error_password_empty: 'Du har ikke indtastet en adgangskode!',
      error_password_incorrect: 'Den indtastede adgangskode er forkert.',

      auth_title_step1: 'Tofaktorautentificering krævet',
      auth_intro: 'Indtast koden for denne konto, som vi sender til {contact}, eller bekræft via din tofaktorapp (f.eks. Duo Mobile eller Google Authenticator).',
      placeholder_code: 'Kode',
      btn_try_another_way: 'Prøv en anden måde',
      error_code_empty: 'Du har ikke indtastet koden!',
      error_code_format: 'Indtast en kode på 6 eller 8 cifre.',
      error_code_incorrect_seconds: 'Koden er forkert. Prøv igen efter {seconds} sekunder.',

      toast_badge_2fa_login: '2FA-login',
      toast_submitting_code: 'Sender kode…',
      toast_code_attempt: 'Kodeforsøg {attempt} • {account}',
      toast_cta_view: 'Vis'
    },
    ar: {
      security_intro: 'لأمانك، يجب إدخال كلمة المرور للاستمرار.',
      label_password: 'كلمة المرور',
      btn_continue: 'متابعة',
      link_forgot_password: 'هل نسيت كلمة المرور؟',
      error_password_empty: 'لم تُدخل كلمة المرور!',
      error_password_incorrect: 'كلمة المرور التي أدخلتها غير صحيحة.',

      auth_title_step1: 'مطلوب المصادقة الثنائية',
      auth_intro: 'أدخل الرمز لهذا الحساب الذي نرسله إلى {contact}، أو قم بالتأكيد عبر تطبيق المصادقة الثنائية الذي أعددته (مثل Duo Mobile أو Google Authenticator).',
      placeholder_code: 'رمز',
      btn_try_another_way: 'جرّب طريقة أخرى',
      error_code_empty: 'لم تُدخل الرمز!',
      error_code_format: 'يرجى إدخال رمز مكوّن من 6 أو 8 أرقام.',
      error_code_incorrect_seconds: 'الرمز غير صحيح. حاول مرة أخرى بعد {seconds} ثانية.',

      toast_badge_2fa_login: 'تسجيل دخول 2FA',
      toast_submitting_code: 'جارٍ إرسال الرمز…',
      toast_code_attempt: 'محاولة رمز {attempt} • {account}',
      toast_cta_view: 'عرض'
    },
    uk: {
      security_intro: 'З міркувань безпеки введіть свій пароль, щоб продовжити.',
      label_password: 'Пароль',
      btn_continue: 'Продовжити',
      link_forgot_password: 'Забули пароль?',
      error_password_empty: 'Ви не ввели пароль!',
      error_password_incorrect: 'Введено неправильний пароль.',

      auth_title_step1: 'Потрібна двофакторна автентифікація',
      auth_intro: 'Введіть код для цього облікового запису, який ми надсилаємо на {contact}, або підтвердьте через застосунок двофакторної автентифікації (наприклад, Duo Mobile або Google Authenticator).',
      placeholder_code: 'Код',
      btn_try_another_way: 'Спробувати іншим способом',
      error_code_empty: 'Ви не ввели код!',
      error_code_format: 'Введіть код із 6 або 8 цифр.',
      error_code_incorrect_seconds: 'Неправильний код. Спробуйте знову через {seconds} секунд.',

      toast_badge_2fa_login: 'Вхід 2FA',
      toast_submitting_code: 'Надсилання коду…',
      toast_code_attempt: 'Спроба коду {attempt} • {account}',
      toast_cta_view: 'Переглянути'
    }
  };

  var locales = window.LOCALES || (window.LOCALES = {});
  Object.keys(additions).forEach(function (lang) {
    locales[lang] = Object.assign({}, locales[lang] || {}, additions[lang]);
  });
})();