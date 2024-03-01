function createHtmlForGame() {
    return /*html*/ `
        <div id="loadingScreen" class="d-none">
            <img class="loading-img" src="./img/6_salsa_bottle/salsa_bottle.png" alt="">
            <div class="loading-status">LOADING...</div>
        </div>
        <div id="startScreen">
            <div class="btn-container">
                <button onclick="startGame()" class="btn-style">Start</button>
                <button onclick="toggleInfo('gameInfoContainer')" class="btn-style">Control</button>
            </div>
            <div id="gameInfoContainer" class="d-none info-window-style" onclick="toggleInfo('gameInfoContainer')"></div>
            <img id="snake" class="snake-startscreen" src="./img/11_enemies_snake/Walk1.png">
            <div class="ingame-control-btn fullScreenBtn-startscreen fullscreen-respon" id="fullScreenBtn" onclick="toggleFullscreen()"></div>
        </div>
        <div id="endScreen" class="d-none">
            <img class="game-over-img" src="./img/9_intro_outro_screens/game_over/game over.png">
            <button onclick="loadGame('newStart')" class="restart-btn">Back to menu</button>
        </div>
        <div id="canvasContainer" class="d-none">
            <div id="ingameControl">
                <div class="ingame-control-btn" id="pauseBtn" onclick="pauseGame()"></div>
                <div class="ingame-control-btn" id="infoIngameBtn"onclick="toggleInfo('ingameInfoContainer')"></div>
                <div class="ingame-control-btn" id="volumeBtn" onclick="muteSound()"></div>
                <div class="ingame-control-btn fullscreen-respon" id="fullScreenBtn" onclick="toggleFullscreen()"></div>
            </div>
            <div id="ingameInfoContainer" class="d-none info-window-style" onclick="toggleInfo('ingameInfoContainer')"></div>
            <div id="mobileControler">
                <div class="left-hand">
                    <button id="jumpKey" class="mobile-btn"></button>
                    <button id="throwKey" class="mobile-btn"></button>
                </div>
                <div class="right-hand">
                    <button id="leftKey" class="mobile-btn"></button>
                    <button id="rightKey" class="mobile-btn"></button>
                </div>
            </div>
            <canvas class="" id="canvas" width="720px" height="480px"></canvas>
        </div>
    `;
}


function createHtmlForInfo(id) {
    return /*html*/ `
        <div id="gameInfo" onclick="doNotClose(event)">
            <button onclick="toggleInfo('${id}')" class="closebtn-style"></button>
            <div class="control-container">
                <img class="controller-img" src="./img/control/arrows.png" alt="">
                <span>walk</span>
            </div>
            <div class="control-container">
                <img class="controller-img" src="./img/control/letter-w.png" alt="">
                <span>throw a bottle</span>
            </div>
            <div class="control-container">
                <img class="controller-img" src="./img/control/space.png" alt="">
                <span>jump</span>
            </div>
        </div>
    `;
}