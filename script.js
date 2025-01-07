let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleModeButton = document.getElementById('toggle-mode');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const WORK_QUOTES = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal. - Winston Churchill",
    "Focus on being productive instead of busy. - Tim Ferriss",
    "Don't count the days, make the days count. - Muhammad Ali",
    "Quality is not an act, it is a habit. - Aristotle"
];

const REST_QUOTES = [
    "Take a break, you've earned it! 🌟",
    "Rest is not idleness, it is the key to better work. - John Lubbock",
    "Your mind will answer most questions if you learn to relax. - Albert Einstein",
    "Sometimes the most productive thing you can do is relax. - Mark Black",
    "Recovery is not a sign of weakness, it's an art of preparation. 🎯"
];

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function updateTitle(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Pomodoro Timer`;
}

function startTimer() {
    if (timerId !== null) return;

    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    updateDisplay(timeLeft);

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);
        updateTitle(timeLeft);

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            isWorkTime = !isWorkTime;
            modeText.textContent = isWorkTime ? 'Time to focus!' : 'Time for a break!';
            
            // Update quote when timer completes
            const quotes = isWorkTime ? WORK_QUOTES : REST_QUOTES;
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('quote-text').textContent = randomQuote;
            
            // Play notification sound
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play();
        }
    }, 1000);

    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    updateDisplay(timeLeft);
    modeText.textContent = 'Time to focus!';
    startButton.textContent = 'Start';
    document.getElementById('quote-text').textContent = WORK_QUOTES[0];
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    updateDisplay(timeLeft);
    toggleModeButton.textContent = isWorkTime ? 'Rest Mode' : 'Work Mode';
    modeText.textContent = isWorkTime ? 'Time to focus!' : 'Time for a break!';
    
    // Get random quote based on mode
    const quotes = isWorkTime ? WORK_QUOTES : REST_QUOTES;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-text').textContent = randomQuote;
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', resetTimer);

toggleModeButton.addEventListener('click', () => {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
    toggleMode();
});

// Initialize display
resetTimer(); 