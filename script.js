let timeLeft;
let timerId = null;
let isWorkTime = true;
let sessionCount = 1;

// DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleModeButton = document.getElementById('toggle-mode');
const sessionCountDisplay = document.getElementById('session-count');

// Constants
const WORK_TIME = 25 * 60;    // 25 minutes in seconds
const SHORT_BREAK = 5 * 60;   // 5 minutes in seconds
const LONG_BREAK = 15 * 60;   // 15 minutes in seconds
const SESSIONS_BEFORE_LONG_BREAK = 3;

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        startButton.textContent = 'Start';
        timerId = null;
        return;
    }

    if (!timeLeft) {
        timeLeft = isWorkTime ? WORK_TIME : getBreakTime();
    }

    startButton.textContent = 'Pause';
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Start';
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
    startButton.textContent = 'Start';
    toggleModeButton.textContent = 'Work Mode';
    modeText.textContent = 'Time to focus!';
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : getBreakTime();
    updateDisplay(timeLeft);
    
    // Update UI elements
    toggleModeButton.textContent = isWorkTime ? 'Work Mode' : 'Break Mode';
    modeText.textContent = isWorkTime ? 'Time to focus!' : 
        (getBreakTime() === LONG_BREAK ? 'Time for a long break!' : 'Time for a short break!');
    
    // Reset timer state
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
}

function playNotification() {
    try {
        const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA==');
        audio.play();
    } catch (e) {
        console.log('Notification sound failed to play');
    }
}

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleModeButton.addEventListener('click', toggleMode);

// Initialize timer
timeLeft = WORK_TIME;
updateDisplay(timeLeft); 