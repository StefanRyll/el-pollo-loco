const SHORT_DELAY = 300;
const MEDIUM_DELAY = 1000;
const LONG_DELAY = 2000;
const ADD = 'add';
const REMOVE = 'remove';

/**
 * Fades in an element by adding the 'fadeIn' class to it.
 * @param {string} id - The ID of the element to fade in.
 */
function fadeIn(id) {
    document.getElementById(id).classList.add('fadeIn');
}

/**
 * Fades out an element by adding the 'fadeOut' class to it.
 * @param {string} id - The ID of the element to fade out.
 */
function fadeOut(id) {
    document.getElementById(id).classList.add('fadeOut');
}

/**
 * Toggles the 'd-none' class on an element to control its display.
 * @param {string} id - The ID of the element.
 * @param {string} actionType - The action type to perform ('add' or 'remove').
 */
function toggleDisplayNone(id, actionType) {
    if (actionType == 'add') {
        document.getElementById(id).classList.add('d-none');
    } else {
        document.getElementById(id).classList.remove('d-none');
    }
}

/**
 * Sets a delay before executing a function.
 * @param {function} fn - The function to execute after the delay.
 * @param {number} time - The delay time in milliseconds.
 */
function setDelay(fn, time) {
    setTimeout(fn, time);
}

/**
 * Toggles the visibility of an element and applies fade-in animation.
 * @param {string} id - The ID of the element.
 */
function toggleInfo(id) {
    document.getElementById(id).classList.toggle('d-none');
    document.getElementById(id).classList.toggle('fadeIn');
    if (id.toLowerCase().includes('info')) {
        document.getElementById(id).innerHTML = createHtmlForInfo(id);
    }
}

/**
 * Mutes or unmutes the game sounds and updates the volume button appearance.
 */
function muteSound() {
    let button = document.getElementById('volumeBtn');
    soundMuted = !soundMuted;
    let objects = [world.character, ...world.level.enemies, world];
    objects.forEach(obj => {
        for (let key in obj) {
            if (key.toLowerCase().includes('sound')) {
                obj[key].muted = soundMuted;
                button.style.backgroundImage = `url('img/control/volume${soundMuted ? "-mute" : ""}.png')`;
            }
        }
    });
}

/**
 * Performs pre-sound settings by muting or unmuting sounds and updating the volume button appearance.
 */
function preSoundSetting() {
    let button = document.getElementById('volumeBtn');
    let objects = [world.character, ...world.level.enemies, world];
    objects.forEach(obj => {
        for (let key in obj) {
            if (key.toLowerCase().includes('sound')) {
                obj[key].muted = soundMuted;
                button.style.backgroundImage = `url('img/control/volume${soundMuted ? "-mute" : ""}.png')`;
            }
        }
    });
}

/**
 * Sets a stoppable interval by executing a function repeatedly at a specified time interval.
 * @param {function} fn - The function to execute at each interval.
 * @param {number} time - The interval time in milliseconds.
 */
function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
}


/**
 * Prevents an event from propagating further.
 * @param {Event} event - The event to prevent from propagating.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Toggles fullscreen mode for the game screen.
 */
function toggleFullscreen() {
    fullScreenEnabled = !fullScreenEnabled;
    let element = document.getElementById('gameScreen');
    let button = document.getElementById('fullScreenBtn');
    let snake = document.getElementById('snake')
    if (!fullScreenEnabled) {
        enterFullscreen(element)
        button.style.backgroundImage = `url('img/control/windowed.png')`;
        snake.style.display = `none`;
    } else {
        exitFullscreen()
        button.style.backgroundImage = `url('img/control/fullscreen.png')`;
        snake.style.display = `block`;
    }
}

/**
 * Enters fullscreen mode for an element.
 * @param {HTMLElement} element - The element to enter fullscreen mode.
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) { // for IE11 (remove June 15, 2022)
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) { // iOS Safari
        element.webkitRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode.
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * Saves the sound settings to the local storage.
 */
function saveSettings() {
    localStorage.setItem('sound', soundMuted);
}

/**
 * Loads the sound settings from the local storage.
 */
function loadSettings() {
    soundMuted = JSON.parse(localStorage.getItem('sound'));
}