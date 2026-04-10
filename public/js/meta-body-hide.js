(function () {
  try {
    if (document.getElementById('ticketId')) {
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity .2s ease';
    }
  } catch (_) {}
})();
