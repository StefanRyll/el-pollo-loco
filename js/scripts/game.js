let canvas;
let world;
let keyboard = new Keyboard();
let imagesToLoad = 0;
let imageLoaded = 0;
let percent = 0;
let gameStarted = false;
let soundMuted;
let intervalIds = [];
let fullScreenEnabled = false;

/**
 * Loads the game and initializes various components.
 * @param {boolean} newStart - Indicates whether it is a new start of the game.
 * @returns {Promise<void>}
 */
async function loadGame(newStart) {
    loadSettings();
    if (newStart) resetGame();
    await generateHTML();
    setupTouchListeners();
    initLevel();
    init();
    preSoundSetting();
}

/**
 * Initializes the game by creating the canvas and setting up the game world.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

/**
 * Generates HTML content for the game screen.
 * @returns {Promise<void>}
 */
async function generateHTML() {
    document.getElementById('gameScreen').innerHTML = createHtmlForGame();
}

/**
 * Starts the game by fading out the start screen, displaying the loading screen, and initiating the game setup.
 */
function startGame() {
    fadeOut('startScreen');
    fadeIn('loadingScreen');
    toggleDisplayNone('loadingScreen', REMOVE);
    setDelay(() => toggleDisplayNone('startScreen', ADD), MEDIUM_DELAY);
    setDelay(() => {
        fadeOut('loadingScreen');
        setDelay(() => {
            fadeIn('canvasContainer');
            toggleDisplayNone('canvasContainer', REMOVE);
            gameStarted = true;
            setMusic('gameMusic_sound');
            setDelay(() => toggleDisplayNone('loadingScreen', ADD), LONG_DELAY - SHORT_DELAY);
        }, SHORT_DELAY);
    }, LONG_DELAY);
}

/**
 * Pauses or resumes the game based on the current game state.
 */
function pauseGame() {
    if (!world.gamePaused) {
        togglePause(true, '', 'img/control/play.png');
    } else {
        togglePause(false, this.CheckForMusic(), 'img/control/pause.png')
    }
}

/**
 * Toggles the pause state of the game and updates the pause button appearance.
 * @param {boolean} pause - Indicates whether the game should be paused.
 * @param {string} sound - The name of the music sound to play or stop.
 * @param {string} imgPath - The path to the image used for the pause button.
 */
function togglePause(pause, sound, imgPath) {
    let button = document.getElementById('pauseBtn');
    world.gamePaused = pause;
    setMusic(sound);
    button.style.backgroundImage = `url(${imgPath})`;
}

/**
 * Stops the game by clearing interval IDs, displaying the end screen, and stopping any playing music.
 */
function stopGame() {
    intervalIds.forEach(clearInterval);
    document.getElementById('endScreen').classList.remove('d-none');
    setMusic();
    saveSettings();
}

/**
 * Sets the music to be played in the game.
 * @param {string} music - The name of the music file to be played.
 */
function setMusic(music) {
    let sounds = [world.gameMusic_sound, world.endBossFight_sound, world.character.walking_sound];
    sounds.forEach(sound => sound.pause());
    if (music) {
        world[music].volume = 0.3;
        world[music].play();
    }
}

/**
 * Checks for the appropriate music sound based on the game state.
 * @returns {string} - The name of the music sound to play.
 */
function CheckForMusic() {
    if (world.endbossFight) {
        return 'endBossFight_sound';
    } else {
        return 'gameMusic_sound';
    }
}

/**
 * Resets the game state.
 */
function resetGame() {
    canvas = null;
    world = null;
    gameStarted = false;
}


// MOBILE CONTROL ELEMENTS

/**
 * Sets up touch event listeners for mobile controls.
 */
function setupTouchListeners() {
    document.getElementById('canvas').addEventListener('touchstart', (e) => {
        e.preventDefault();
    });
    attachTouchListenersToButton('leftKey', 'LEFT');
    attachTouchListenersToButton('rightKey', 'RIGHT');
    attachTouchListenersToButton('jumpKey', 'UP');
    attachTouchListenersToButton('throwKey', 'W');
}

/**
 * Attaches touch event listeners to a button element.
 * @param {string} buttonId - The ID of the button element.
 * @param {string} keyboardKey - The corresponding keyboard key.
 */
function attachTouchListenersToButton(buttonId, keyboardKey) {
    const buttonElement = document.getElementById(buttonId);
    buttonElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[keyboardKey] = true;
    });
    buttonElement.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[keyboardKey] = false;
    });
}

// KEYBOARD LISTENER

/**
 * Listens for keydown events and updates the keyboard state accordingly.
 * @param {Event} e - The keydown event.
 */
window.addEventListener('keydown', (e) => {
    if (e.key == ' ') {
        keyboard.UP = true;
    }
    if (e.key == 'ArrowDown') {
        keyboard.DOWN = true;
    }
    if (e.key == 'ArrowRight') {
        keyboard.RIGHT = true;
    }
    if (e.key == 'ArrowLeft') {
        keyboard.LEFT = true;
    }
    if (e.key == 'w') {
        keyboard.W = true;
    }
});


window.addEventListener('keyup', (e) => {
    if (e.key == ' ') {
        keyboard.UP = false;
    }
    if (e.key == 'ArrowDown') {
        keyboard.DOWN = false;
    }
    if (e.key == 'ArrowRight') {
        keyboard.RIGHT = false;
    }
    if (e.key == 'ArrowLeft') {
        keyboard.LEFT = false;
    }
    if (e.key == 'w') {
        keyboard.W = false;
    }
});