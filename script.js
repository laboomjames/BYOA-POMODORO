let timeLeft;
let timerId = null;
let isWorkTime = true;
let sessionCount = 1;
let originalTitle = document.title;

// DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleModeButton = document.getElementById('toggle-mode');
const sessionCountDisplay = document.getElementById('session-count');
const dateDisplay = document.querySelector('.date-display');

// Constants
const WORK_TIME = 25 * 60;    // 25 minutes in seconds
const SHORT_BREAK = 5 * 60;   // 5 minutes in seconds
const LONG_BREAK = 15 * 60;   // 15 minutes in seconds
const SESSIONS_BEFORE_LONG_BREAK = 3;

function updateDate() {
    const now = new Date();
    const options = { 
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options).toUpperCase();
}

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    document.title = `${formattedTime} - ${isWorkTime ? 'WORK' : 'BREAK'}`;
}

function startTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        startButton.textContent = 'START';
        timerId = null;
        return;
    }

    if (!timeLeft) {
        timeLeft = isWorkTime ? WORK_TIME : getBreakTime();
    }

    startButton.textContent = 'PAUSE';
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'START';
            handleTimerComplete();
        }
    }, 1000);
}

function getBreakTime() {
    return sessionCount % SESSIONS_BEFORE_LONG_BREAK === 0 ? LONG_BREAK : SHORT_BREAK;
}

function handleTimerComplete() {
    playNotification();
    if (isWorkTime) {
        sessionCount++;
        sessionCountDisplay.textContent = sessionCount;
    }
    toggleMode();
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    sessionCount = 1;
    sessionCountDisplay.textContent = sessionCount;
    timeLeft = WORK_TIME;
    updateDisplay(timeLeft);
    startButton.textContent = 'START';
    toggleModeButton.textContent = 'MODE';
    modeText.textContent = 'WORK MODE ACTIVE';
    document.title = originalTitle;
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : getBreakTime();
    updateDisplay(timeLeft);
    
    toggleModeButton.textContent = 'MODE';
    modeText.textContent = isWorkTime ? 'WORK MODE ACTIVE' : 
        (getBreakTime() === LONG_BREAK ? 'LONG BREAK ACTIVE' : 'SHORT BREAK ACTIVE');
    
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'START';
}

function playNotification() {
    try {
        const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA==');
        audio.play();
    } catch (e) {
        console.log('Notification sound failed to play');
    }
}

document.addEventListener('visibilitychange', () => {
    if (timeLeft) {
        updateDisplay(timeLeft);
    }
});

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleModeButton.addEventListener('click', toggleMode);

// Initialize
updateDate();
setInterval(updateDate, 1000);
timeLeft = WORK_TIME;
updateDisplay(timeLeft); 