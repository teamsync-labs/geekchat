const screens = document.querySelectorAll(".screen");
const headerActions = document.getElementById("headerActions");
const toast = document.getElementById("toast");

const organizerRoomCode = document.getElementById("organizerRoomCode");
const inviteLink = document.getElementById("inviteLink");
const activeRoomTitle = document.getElementById("activeRoomTitle");
const callTimer = document.getElementById("callTimer");

let currentRoomCode = "GEEK-0000";
let timerInterval = null;
let callSeconds = 0;
let localStream = null;
let isMicOn = true;
let isCamOn = true;

// ============================================================
// НАВИГАЦИЯ
// ============================================================
function showScreen(name) {
  screens.forEach((screen) => { screen.classList.remove("active"); });
  const target = document.getElementById(`screen-${name}`);
  if (!target) { document.getElementById("screen-home").classList.add("active"); return; }
  target.classList.add("active");
  updateHeader(name);
  if (name !== "active-call") { stopCallTimer(); }
}

function updateHeader(screenName) {
  const hiddenOn = ["active-call", "creating-room", "connecting", "organizer", "guest-setup"];
  headerActions.style.display = hiddenOn.includes(screenName) ? "none" : "flex";
}

function generateRoomCode() {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `GEEK-${number}`;
}

function createRoom() {
  showScreen("creating-room");
  setTimeout(() => {
    currentRoomCode = generateRoomCode();
    organizerRoomCode.textContent = currentRoomCode;
    inviteLink.textContent = `${window.location.origin}${window.location.pathname}?room=${currentRoomCode}`;
    showScreen("organizer");
  }, 900);
}

function connectToRoom(code) {
  showScreen("connecting");
  setTimeout(() => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode || normalizedCode === "ERROR" || normalizedCode === "INVALID") {
      showScreen("invalid-room");
      return;
    }
    currentRoomCode = normalizedCode;
    activeRoomTitle.textContent = `Комната ${currentRoomCode}`;
    showScreen("guest-setup");
  }, 800);
}

function startCall() {
  activeRoomTitle.textContent = `Комната ${currentRoomCode}`;
  showScreen("active-call");
  startCallTimer();
  startCamera();
}

function startCallTimer() {
  stopCallTimer();
  callSeconds = 0;
  callTimer.textContent = "00:00";
  timerInterval = setInterval(() => {
    callSeconds += 1;
    const minutes = String(Math.floor(callSeconds / 60)).padStart(2, "0");
    const seconds = String(callSeconds % 60).padStart(2, "0");
    callTimer.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function stopCallTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => { toast.classList.remove("show"); }, 1600);
}

// ============================================================
// КАМЕРА И МИКРОФОН
// ============================================================
async function startCamera() {
  try {
    const constraints = {
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      audio: true
    };
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Обновляем все видео-элементы
    document.querySelectorAll('video').forEach(video => {
      if (video.id === 'localVideoPreview' || video.id === 'callLocalVideo') {
        video.srcObject = localStream;
        video.play();
      }
    });
    
    // Обновляем состояние кнопок
    isMicOn = true;
    isCamOn = true;
    updateAllButtons();
    return localStream;
  } catch (error) {
    console.error('Ошибка доступа к камере:', error);
    showToast('Не удалось получить доступ к камере/микрофону');
    return null;
  }
}

function stopCamera() {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  document.querySelectorAll('video').forEach(video => {
    if (video.id === 'localVideoPreview' || video.id === 'callLocalVideo') {
      video.srcObject = null;
    }
  });
}

function toggleMicrophone(button) {
  if (!localStream) {
    startCamera().then(() => {
      toggleMicrophone(button);
    });
    return;
  }
  const audioTrack = localStream.getAudioTracks()[0];
  if (audioTrack) {
    isMicOn = !isMicOn;
    audioTrack.enabled = isMicOn;
    updateButtonState(button, isMicOn);
    showToast(isMicOn ? '🎙 Микрофон включён' : '🔴 Микрофон выключен');
  }
}

function toggleCamera(button) {
  if (!localStream) {
    startCamera().then(() => {
      toggleCamera(button);
    });
    return;
  }
  const videoTrack = localStream.getVideoTracks()[0];
  if (videoTrack) {
    isCamOn = !isCamOn;
    videoTrack.enabled = isCamOn;
    updateButtonState(button, isCamOn);
    showToast(isCamOn ? '📷 Камера включена' : '🔴 Камера выключена');
  }
}

function updateButtonState(button, isOn) {
  if (!button) return;
  button.classList.remove('active', 'off');
  if (isOn) {
    button.classList.add('active');
  } else {
    button.classList.add('off');
  }
}

function updateAllButtons() {
  const micButtons = document.querySelectorAll('#micToggleBtn, #callMicBtn');
  const camButtons = document.querySelectorAll('#camToggleBtn, #callCamBtn');
  micButtons.forEach(btn => updateButtonState(btn, isMicOn));
  camButtons.forEach(btn => updateButtonState(btn, isCamOn));
}

// ============================================================
// НАВИГАЦИЯ ПО КНОПКАМ
// ============================================================
document.querySelectorAll("[data-screen]").forEach((button) => {
  button.addEventListener("click", () => {
    const screenName = button.getAttribute("data-screen");
    if (screenName === 'home' || screenName === 'login' || screenName === 'register' || screenName === 'join') {
      stopCamera();
    }
    showScreen(screenName);
  });
});

document.getElementById("createRoomBtn").addEventListener("click", createRoom);
document.getElementById("createRoomBtnFromLeft").addEventListener("click", createRoom);
document.getElementById("startCallBtn").addEventListener("click", startCall);
document.getElementById("guestJoinCallBtn").addEventListener("click", startCall);

document.getElementById("leaveCallBtn").addEventListener("click", () => {
  stopCallTimer();
  stopCamera();
  showScreen("user-left");
});

document.getElementById("joinForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("roomCodeInput");
  connectToRoom(input.value);
});

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  showScreen("home");
  showToast("✅ Вы вошли в аккаунт");
});

document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  showScreen("home");
  showToast("✅ Аккаунт создан");
});

document.getElementById("copyInviteBtn").addEventListener("click", async () => {
  const text = inviteLink.textContent;
  try {
    await navigator.clipboard.writeText(text);
    showToast("📋 Ссылка скопирована");
  } catch (error) {
    showToast("❌ Не удалось скопировать");
  }
});

// ============================================================
// КНОПКИ МИКРОФОНА И КАМЕРЫ
// ============================================================
document.getElementById("micToggleBtn").addEventListener("click", function() {
  toggleMicrophone(this);
});

document.getElementById("camToggleBtn").addEventListener("click", function() {
  toggleCamera(this);
});

document.getElementById("callMicBtn").addEventListener("click", function() {
  toggleMicrophone(this);
});

document.getElementById("callCamBtn").addEventListener("click", function() {
  toggleCamera(this);
});

// ============================================================
// ПРЕДПРОСМОТР КАМЕРЫ НА ЭКРАНЕ ГОСТЯ
// ============================================================
const guestSetupScreen = document.getElementById('screen-guest-setup');
if (guestSetupScreen) {
  const observer = new MutationObserver(() => {
    if (guestSetupScreen.classList.contains('active')) {
      setTimeout(() => {
        if (!localStream) {
          startCamera().then(() => {
            const vid = document.getElementById('localVideoPreview');
            if (vid && localStream) {
              vid.srcObject = localStream;
              vid.play();
            }
          });
        }
      }, 500);
    }
  });
  observer.observe(guestSetupScreen, { attributes: true, attributeFilter: ['class'] });
}

// ============================================================
// ПРЕДПРОСМОТР В АКТИВНОМ ЗВОНКЕ
// ============================================================
const activeCallScreen = document.getElementById('screen-active-call');
if (activeCallScreen) {
  const observer = new MutationObserver(() => {
    if (activeCallScreen.classList.contains('active')) {
      setTimeout(() => {
        if (!localStream) {
          startCamera().then(() => {
            const vid = document.getElementById('callLocalVideo');
            if (vid && localStream) {
              vid.srcObject = localStream;
              vid.play();
            }
          });
        }
      }, 500);
    }
  });
  observer.observe(activeCallScreen, { attributes: true, attributeFilter: ['class'] });
}

// ============================================================
// ДОБАВЛЯЕМ ВИДЕО В ПЛИТКИ
// ============================================================
// Для экрана гостя
const videoPreview = document.querySelector('.video-preview');
if (videoPreview) {
  const video = document.createElement('video');
  video.id = 'localVideoPreview';
  video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:26px;background:rgba(0,0,0,0.3);display:none;';
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  videoPreview.style.position = 'relative';
  videoPreview.appendChild(video);
  
  const checkStream = setInterval(() => {
    if (localStream) {
      video.style.display = 'block';
      const avatar = videoPreview.querySelector('.avatar');
      if (avatar) avatar.style.display = 'none';
      clearInterval(checkStream);
    }
  }, 500);
}

// Для активного звонка
const callTiles = document.querySelectorAll('.call-tile');
callTiles.forEach((tile, index) => {
  if (index === 0) {
    const video = document.createElement('video');
    video.id = 'callLocalVideo';
    video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:26px;background:rgba(0,0,0,0.3);display:none;';
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    tile.style.position = 'relative';
    tile.prepend(video);
    
    const checkStream = setInterval(() => {
      if (localStream) {
        video.style.display = 'block';
        const avatar = tile.querySelector('.avatar');
        if (avatar) avatar.style.display = 'none';
        clearInterval(checkStream);
      }
    }, 500);
  }
});

// ============================================================
// ОСТАНОВКА КАМЕРЫ ПРИ ВЫХОДЕ
// ============================================================
window.addEventListener('beforeunload', () => {
  stopCamera();
});

// ============================================================
// ОТКРЫТИЕ КОМНАТЫ ИЗ URL
// ============================================================
function openRoomFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room");
  if (room) {
    document.getElementById("roomCodeInput").value = room;
    connectToRoom(room);
  }
}

openRoomFromUrl();
