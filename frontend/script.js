function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) t.classList.add('active');
  window.scrollTo(0, 0);
}

let callTimer = null, callSeconds = 0;

function startCallTimer() {
  callSeconds = 0;
  clearInterval(callTimer);
  callTimer = setInterval(() => {
    callSeconds++;
    const m = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const s = String(callSeconds % 60).padStart(2, '0');
    document.querySelectorAll('.call-timer').forEach(el => el.textContent = m + ':' + s);
  }, 1000);
}
function stopCallTimer() { clearInterval(callTimer); }

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1800);
}

function createMeeting() {
  goTo('screen-creating-room');
  setTimeout(() => {
    const code = 'GEEK-' + Math.floor(1000 + Math.random() * 9000);
    const c = document.getElementById('organizerRoomCode');
    const l = document.getElementById('inviteLink');
    if (c) c.textContent = code;
    if (l) l.textContent = location.origin + location.pathname + '?room=' + code;
    goTo('screen-organizer');
    showToast('Комната создана');
  }, 1000);
}

function startCall() {
  goTo('screen-active-call');
  startCallTimer();
}

function connectToMeeting() {
  goTo('screen-connecting');
  setTimeout(() => {
    goTo('screen-active-call');
    startCallTimer();
  }, 1500);
}

function endCallForAll() {
  stopCallTimer();
  goTo('screen-ended-by-organizer');
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input[name="email"]').value.trim();
  const pass = this.querySelector('input[name="password"]').value;
  if (!email) { showToast('Введите email'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Некорректный email'); return; }
  if (!pass) { showToast('Введите пароль'); return; }
  if (pass.length < 8) { showToast('Пароль минимум 8 символов'); return; }
  goTo('screen-home');
  showToast('Вы вошли в аккаунт');
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelector('input[name="name"]').value.trim();
  const email = this.querySelector('input[name="email"]').value.trim();
  const pass = this.querySelector('input[name="password"]').value;
  const confirm = this.querySelector('input[name="confirm"]').value;
  if (!name || name.length < 2) { showToast('Введите имя'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Некорректный email'); return; }
  if (!pass || pass.length < 8) { showToast('Пароль минимум 8 символов'); return; }
  if (pass !== confirm) { showToast('Пароли не совпадают'); return; }
  goTo('screen-home');
  showToast('Аккаунт создан');
});

document.getElementById('joinForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const v = document.getElementById('roomCodeInput').value.trim();
  if (!v) { showToast('Введите код'); return; }
  connectToMeeting();
});

document.getElementById('copyInviteBtn').addEventListener('click', () => {
  const text = document.getElementById('inviteLink').textContent;
  navigator.clipboard.writeText(text).catch(() => {});
  showToast('Ссылка скопирована');
});

document.getElementById('leaveCallBtn').addEventListener('click', () => {
  stopCallTimer();
  goTo('screen-user-left');
});

document.getElementById('callMicBtn').addEventListener('click', function() {
  this.classList.toggle('active');
  this.classList.toggle('off');
  showToast(this.classList.contains('off') ? 'Микрофон выключен' : 'Микрофон включён');
});

document.getElementById('callCamBtn').addEventListener('click', function() {
  this.classList.toggle('active');
  this.classList.toggle('off');
  showToast(this.classList.contains('off') ? 'Камера выключена' : 'Камера включена');
});

document.getElementById('callLinkBtn').addEventListener('click', () => {
  showToast('Ссылка скопирована');
});

document.getElementById('callScreenBtn').addEventListener('click', () => {
  showToast('Демонстрация экрана');
});
