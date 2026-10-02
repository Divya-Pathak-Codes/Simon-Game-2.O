/* =========================================
   SIMON GAME
========================================= */


/* ---------- ELEMENTS ---------- */

const pads =
    document.querySelectorAll(".simon-pad");

const startButton =
    document.getElementById("startButton");

const startText =
    document.getElementById("startText");

const centerMessage =
    document.getElementById("centerMessage");

const statusText =
    document.getElementById("statusText");

const levelDisplay =
    document.getElementById("level");

const levelCenter =
    document.getElementById("levelCenter");

const scoreDisplay =
    document.getElementById("score");

const bestScoreDisplay =
    document.getElementById("bestScore");

const comboDisplay =
    document.getElementById("combo");

const comboFill =
    document.getElementById("comboFill");

const soundToggle =
    document.getElementById("soundToggle");

const settingsBtn =
    document.getElementById("settingsBtn");

const settingsModal =
    document.getElementById("settingsModal");

const closeModal =
    document.getElementById("closeModal");

const modalSound =
    document.getElementById("modalSound");

const levelBars =
    document.querySelectorAll(".bar");


/* ---------- GAME DATA ---------- */

const colors =
    ["green", "red", "yellow", "blue"];

let sequence = [];

let playerSequence = [];

let level = 0;

let score = 0;

let combo = 0;

let bestScore =
    Number(localStorage.getItem("simonBestScore")) || 0;

let gameRunning = false;

let acceptingInput = false;

let soundEnabled = true;


/* ---------- DISPLAY BEST SCORE ---------- */

bestScoreDisplay.textContent =
    bestScore;


/* =========================================
   START GAME
========================================= */

startButton.addEventListener(
    "click",
    startGame
);


async function startGame() {

    sequence = [];

    playerSequence = [];

    level = 0;

    score = 0;

    combo = 0;

    gameRunning = true;

    acceptingInput = false;

    startText.textContent =
        "RESTART GAME";

    updateDisplay();

    statusText.textContent =
        "WATCH THE PATTERN";

    centerMessage.textContent =
        "GET READY";

    await sleep(500);

    nextRound();
}


/* =========================================
   NEXT ROUND
========================================= */

async function nextRound() {

    level++;

    playerSequence = [];

    updateDisplay();

    const randomColor =
        colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];

    sequence.push(randomColor);

    acceptingInput = false;

    statusText.textContent =
        "WATCH THE PATTERN";

    centerMessage.textContent =
        "WATCH";

    await sleep(500);

    await playSequence();

    acceptingInput = true;

    statusText.textContent =
        "YOUR TURN";

    centerMessage.textContent =
        "REPEAT";

}


/* =========================================
   PLAY COMPUTER SEQUENCE
========================================= */

async function playSequence() {

    for (
        const color of sequence
    ) {

        await sleep(250);

        await flashPad(color);

        await sleep(120);
    }
}


/* =========================================
   FLASH PAD
========================================= */

function flashPad(color) {

    return new Promise(resolve => {

        const pad =
            document.querySelector(
                `[data-color="${color}"]`
            );

        pad.classList.add("active");

        playTone(color);

        setTimeout(() => {

            pad.classList.remove(
                "active"
            );

            resolve();

        }, 430);
    });
}


/* =========================================
   PLAYER CLICK
========================================= */

pads.forEach(pad => {

    pad.addEventListener(
        "click",
        () => {

            if (
                !gameRunning ||
                !acceptingInput
            ) return;

            const color =
                pad.dataset.color;

            playerMove(color);
        }
    );

});


/* =========================================
   PLAYER MOVE
========================================= */

function playerMove(color) {

    padPress(color);

    playerSequence.push(color);

    const index =
        playerSequence.length - 1;


    /* WRONG */

    if (
        playerSequence[index]
        !== sequence[index]
    ) {

        gameOver();

        return;
    }


    /* CORRECT */

    combo++;

    score +=
        10 * combo;

    updateDisplay();


    /* COMPLETED ROUND */

    if (
        playerSequence.length
        === sequence.length
    ) {

        acceptingInput = false;

        statusText.textContent =
            "PERFECT!";

        centerMessage.textContent =
            "CORRECT";

        setTimeout(
            nextRound,
            900
        );
    }
}


/* =========================================
   PLAYER PAD PRESS
========================================= */

function padPress(color) {

    const pad =
        document.querySelector(
            `[data-color="${color}"]`
        );

    pad.classList.add("active");

    playTone(color);

    setTimeout(() => {

        pad.classList.remove(
            "active"
        );

    }, 180);
}


/* =========================================
   GAME OVER
========================================= */

function gameOver() {

    acceptingInput = false;

    gameRunning = false;

    statusText.textContent =
        "GAME OVER";

    centerMessage.textContent =
        "GAME OVER";

    startText.textContent =
        "PLAY AGAIN";

    combo = 0;

    comboFill.style.width =
        "0%";


    /* BEST SCORE */

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "simonBestScore",
            bestScore
        );

        bestScoreDisplay.textContent =
            bestScore;
    }

    updateDisplay();

}


/* =========================================
   RESET
========================================= */

function resetGame() {

    sequence = [];

    playerSequence = [];

    level = 0;

    score = 0;

    combo = 0;

    gameRunning = false;

    acceptingInput = false;

    startText.textContent =
        "START GAME";

    statusText.textContent =
        "READY TO PLAY";

    centerMessage.textContent =
        "PRESS START";

    updateDisplay();
}


/* =========================================
   RESET WITH DOUBLE CLICK
========================================= */

startButton.addEventListener(
    "dblclick",
    resetGame
);


/* =========================================
   SCORE DISPLAY
========================================= */

function updateDisplay() {

    levelDisplay.textContent =
        level;

    levelCenter.textContent =
        level;

    scoreDisplay.textContent =
        score;

    comboDisplay.textContent =
        combo;


    /* Level bars */

    levelBars.forEach(
        (bar, index) => {

            if (
                index < (level % 9 || 1)
            ) {

                bar.classList.add(
                    "active"
                );

            } else {

                bar.classList.remove(
                    "active"
                );
            }
        }
    );


    /* Combo progress */

    const comboPercent =
        Math.min(
            combo * 15,
            100
        );

    comboFill.style.width =
        comboPercent + "%";
}


/* =========================================
   SOUND
========================================= */

soundToggle.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;

        soundToggle.classList.toggle(
            "active",
            soundEnabled
        );

        modalSound.textContent =
            soundEnabled
            ? "ON"
            : "OFF";
    }
);


/* =========================================
   SOUND GENERATOR
========================================= */

function playTone(color) {

    if (!soundEnabled) return;

    const frequencies = {

        green: 329.63,

        red: 440,

        yellow: 523.25,

        blue: 659.25

    };


    try {

        const audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();


        oscillator.type =
            "sine";

        oscillator.frequency.value =
            frequencies[color];


        gain.gain.setValueAtTime(
            0.12,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.25
        );


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + .25
        );

    } catch (error) {

        console.log(
            "Audio unavailable"
        );
    }
}


/* =========================================
   SETTINGS MODAL
========================================= */

settingsBtn.addEventListener(
    "click",
    () => {

        settingsModal.classList.add(
            "show"
        );
    }
);


closeModal.addEventListener(
    "click",
    () => {

        settingsModal.classList.remove(
            "show"
        );
    }
);


settingsModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            settingsModal
        ) {

            settingsModal.classList.remove(
                "show"
            );
        }
    }
);


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    event => {

        const keys = {

            "1": "green",

            "2": "red",

            "3": "yellow",

            "4": "blue"

        };

        const color =
            keys[event.key];

        if (
            color &&
            gameRunning &&
            acceptingInput
        ) {

            playerMove(color);
        }

    }
);


/* =========================================
   UTILITY
========================================= */

function sleep(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}


/* =========================================
   INITIALIZE
========================================= */

updateDisplay();
