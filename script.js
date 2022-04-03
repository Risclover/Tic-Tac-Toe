const gameForm = document.querySelector('.gameform');
const mainBox = document.querySelector('.maincontainer');
const startBtn = document.querySelector('.startbtn');
const roundsPick = document.querySelector('#roundspick');
const pieces = document.querySelector('#pieces');
const player1Name = document.querySelector('#player1name');
const player2Name = document.querySelector('#player2name');
const wrapper2 = document.getElementById('wrapper2');
const wrapper = document.getElementById('wrapper');
const playerAnnounce = document.querySelector('.player-announce');
const roundsVal = document.querySelector('.rounds-val');

let currentPlayer = "";
let round = 1;
let option1 = document.getElementById('option1');
let option2 = document.getElementById('option2');
let winner = "";
let player1Turn = true;
let gameSquares = [];

option1.addEventListener('change', matchOptions);
option2.addEventListener('change', matchOptions);

startBtn.addEventListener('click', gameSetup);
pieces.addEventListener('change', piecesChange);
roundsPick.addEventListener('change', roundChange);

const gamePlay = {
    players: {
        player1: {
            name: "",
            piece: "",
            score: 0
        },
        player2: {
            name: "",
            piece: "",
            score: 0
        }
    },
    gameBoard: {
        row1: ["", "", ""],
        row2: ["", "", ""],
        row3: ["", "", ""]
    },
    gameRounds: {
        roundsMode: "",
        rounds: 0
    },
    gamePieces: ""
}

function piecesChange() {
    if(pieces.value === "Players") {
        wrapper.style.display = "flex";
        gamePlay.gamePieces = "Players pick";
    } else if (pieces.value === "Alternate") {
        wrapper.style.display = "none";
        gamePlay.gamePieces = "Alternate pieces";
    } else if (pieces.value === "Random") {
        gamePlay.gamePieces = "Random pieces";
    }
}

function roundChange() {
    if(roundsPick.value === "Pick") {
        wrapper2.style.display = "flex";
        gamePlay.gameRounds.roundsMode = "Pick mode";
    } else if (roundsPick.value === "Single") {
        wrapper2.style.display = "none";
        gamePlay.gameRounds.roundsMode = "Single mode";
        gamePlay.gameRounds.rounds = 1;
    } else if (roundsPick.value === "Infinite") {
        wrapper2.style.display = "none";
        gamePlay.gameRounds.roundsMode = "Infinite mode";
        gamePlay.gameRounds.rounds = 100000;
    }
}

function matchOptions(e) {
 let option = e.target.selectedIndex;
 option1.selectedIndex = option;
 option2.selectedIndex = option;
}

function gameSetup() {
    setPieces();
    startGame();
}

function setPieces() {
    gamePlay.gameRounds.rounds = roundsVal.value;
    gamePlay.players.player1.name = player1Name.value;
    gamePlay.players.player2.name = player2Name.value;
    if(gamePlay.gamePieces === "Players pick") {
        gamePlay.players.player1.piece = option1.value;
        gamePlay.players.player2.piece = option2.value;
    } else if (gamePlay.gamePieces === "Alternate pieces") {
        if(gamePlay.gameRounds.rounds % 2 === 0) {
            gamePlay.players.player1.piece = "X";
            gamePlay.players.player2.piece = "O";
        } else {
            gamePlay.players.player1.piece = "O";
            gamePlay.players.player2.piece = "X";
        }
    } else if (gamePlay.gamePieces === "Random pieces") {
        wrapper.style.display = "none";
        let randomChoice = Math.floor(Math.random() * 2 + 1);
        if(randomChoice === 1) {
            gamePlay.players.player1.piece = "X";
            gamePlay.players.player2.piece = "O";
        } else {
            gamePlay.players.player1.piece = "O";
            gamePlay.players.player2.piece = "X";
        }
    }
}


function startGame() {
    if(gamePlay.players.player1.piece === 'X') {
         player1Turn = true;
    } else if(gamePlay.players.player1.piece === "O") {
         player1Turn = false;
    }
    gameForm.style.display = "none";
    mainBox.style.display = "grid";
    
    createGameboard();
}

function createGameboard() {
    mainBox.innerHTML = "";
    mainBox.style.gridTemplateColumns = `1fr 1fr 1fr`;
    mainBox.style.gridTemplateRows = `1fr 1fr 1fr`;
    for(let i = 0; i < 9; i++) {
        let square = document.createElement('div');
        mainBox.appendChild(square);
        square.classList.add('square', 's' + i)
        square.style.display="flex";
        square.style.alignItems = "center";
        square.style.cursor = "pointer";
        square.style.justifyContent = "center";
        square.addEventListener('click', clickSquare);
    }
    
    if(player1Turn === true) {
        currentPlayer = gamePlay.players.player1.name;
    } else {
        currentPlayer = gamePlay.players.player2.name;
    }
    playerAnnounce.textContent = `It is ${currentPlayer}'s turn.`;
}

function clickSquare() {
    if(this.textContent != "") {
        this.textContent = "";
    } else {
        if(player1Turn === true && gamePlay.players.player1.piece === "X") {
            this.textContent = "X"
        } else if(player1Turn === true && gamePlay.players.player1.piece === "O") {
            this.textContent = "O";
        } else if(player1Turn === false && gamePlay.players.player2.piece === "X") {
            this.textContent = "X";
        } else if(player1Turn === false && gamePlay.players.player2.piece === "O") {
            this.textContent = "O";
        }
        switch(true) {
            case this.classList.contains('s0'): 
                gamePlay.gameBoard.row1[0] = this.textContent;
                break;
            case this.classList.contains('s1'):
                gamePlay.gameBoard.row1[1] = this.textContent;
                break;
            case this.classList.contains('s2'):
                gamePlay.gameBoard.row1[2] = this.textContent;
                break;
            case this.classList.contains('s3'):
                gamePlay.gameBoard.row2[0] = this.textContent;
                break;
            case this.classList.contains('s4'):
                gamePlay.gameBoard.row2[1] = this.textContent;
                break;
            case this.classList.contains('s5'):
                gamePlay.gameBoard.row2[2] = this.textContent;
                break;
            case this.classList.contains('s6'):
                gamePlay.gameBoard.row3[0] = this.textContent;
                break;
            case this.classList.contains('s7'):
                gamePlay.gameBoard.row3[1] = this.textContent;
                break;
            case this.classList.contains('s8'):
                gamePlay.gameBoard.row3[2] = this.textContent;
                break;
        }
    }
    gameSquares.push(this.textContent);
    if (
        ((gamePlay.gameBoard.row1[0] === gamePlay.gameBoard.row1[1]) && (gamePlay.gameBoard.row1[1] === gamePlay.gameBoard.row1[2]) && (gamePlay.gameBoard.row1[0] != "") && (gamePlay.gameBoard.row1[1] != "") && (gamePlay.gameBoard.row1[2] != "")) || 
        ((gamePlay.gameBoard.row2[0] === gamePlay.gameBoard.row2[1]) && (gamePlay.gameBoard.row2[1] === gamePlay.gameBoard.row2[2]) && (gamePlay.gameBoard.row2[0] != "") && (gamePlay.gameBoard.row2[1] != "") && (gamePlay.gameBoard.row2[2] != "")) || 
        ((gamePlay.gameBoard.row3[0] === gamePlay.gameBoard.row3[1]) && (gamePlay.gameBoard.row3[1] === gamePlay.gameBoard.row3[2]) &&
        (gamePlay.gameBoard.row3[0] != "") && (gamePlay.gameBoard.row3[1] != "") && (gamePlay.gameBoard.row3[2] != "")) || 
        ((gamePlay.gameBoard.row1[0] === gamePlay.gameBoard.row2[0]) && (gamePlay.gameBoard.row2[0] === gamePlay.gameBoard.row3[0]) && (gamePlay.gameBoard.row1[0] != "") && (gamePlay.gameBoard.row2[0] != "") && (gamePlay.gameBoard.row3[0] != "")) || 
        ((gamePlay.gameBoard.row1[1] === gamePlay.gameBoard.row2[1]) && (gamePlay.gameBoard.row2[1] === gamePlay.gameBoard.row3[1]) && (gamePlay.gameBoard.row1[1] != "") && (gamePlay.gameBoard.row2[1] != "") && (gamePlay.gameBoard.row3[1] != "")) ||
        ((gamePlay.gameBoard.row1[2] === gamePlay.gameBoard.row2[2]) && (gamePlay.gameBoard.row2[2] === gamePlay.gameBoard.row3[2]) && (gamePlay.gameBoard.row1[2] != "") && (gamePlay.gameBoard.row2[2] != "") && (gamePlay.gameBoard.row3[2] != "")) ||
        ((gamePlay.gameBoard.row1[0] === gamePlay.gameBoard.row2[1]) && (gamePlay.gameBoard.row2[1] === gamePlay.gameBoard.row3[2]) && 
        (gamePlay.gameBoard.row1[0] != "") && (gamePlay.gameBoard.row2[1] != "") && (gamePlay.gameBoard.row3[2] != "")) || 
        ((gamePlay.gameBoard.row1[2] === gamePlay.gameBoard.row2[1]) && (gamePlay.gameBoard.row2[1] === gamePlay.gameBoard.row3[0]) && 
        (gamePlay.gameBoard.row1[2] != "") && (gamePlay.gameBoard.row2[1] != "") && (gamePlay.gameBoard.row3[0] != ""))
     ) {
        if((gamePlay.gameBoard.row1[0] === gamePlay.gameBoard.row1[1]) && (gamePlay.gameBoard.row1[1] === gamePlay.gameBoard.row1[2])) {
            if(gamePlay.gameBoard.row1[0] === gamePlay.players.player1.piece) {
                gamePlay.players.player1.score += 1;
            } else {
                gamePlay.players.player2.score += 1;
            }
        } else if ((gamePlay.gameBoard.row2[0] === gamePlay.gameBoard.row2[1]) && (gamePlay.gameBoard.row2[1] === gamePlay.gameBoard.row2[2])) {
            if(gamePlay.gameBoard.row2[0] === gamePlay.players.player1.piece) {
                gamePlay.players.player1.score += 1;
            } else {
                gamePlay.players.player2.score += 1;
            }
        } else if ((gamePlay.gameBoard.row3[0] === gamePlay.gameBoard.row3[1]) && (gamePlay.gameBoard.row3[1] === gamePlay.gameBoard.row3[2])) {
            if(gamePlay.gameBoard.row3[0] === gamePlay.players.player1.piece) {
                gamePlay.players.player1.score += 1;
            } else {
                gamePlay.players.player2.score += 1;
            }
        } else if ((gamePlay.gameBoard.row1[0] === gamePlay.gameBoard.row2[0]) && (gamePlay.gameBoard.row2[0] === gamePlay.gameBoard.row3[0])) {
            if(gamePlay.gameBoard.row1[0] === gamePlay.players.player1.piece) {
                gamePlay.players.player1.score += 1;
            } else {
                gamePlay.players.player2.score += 1;
            }
        } else if ((gamePlay.gameBoard.row1[1] === gamePlay.gameBoard.row2[1]) && (gamePlay.gameBoard.row2[1] === gamePlay.gameBoard.row3[1])) {
            if(gamePlay.gameBoard.row1[1] === gamePlay.players.player1.piece) {
                gamePlay.players.player1.score += 1;
            } else {
                gamePlay.players.player2.score += 1;
            }
        } else if ((gamePlay.gameBoard.row1[2] === gamePlay.gameBoard.row2[2]) && (gamePlay.gameBoard.row2[2] === gamePlay.gameBoard.row3[2])) {
            if(gamePlay.gameBoard.row1[2] === gamePlay.players.player1.piece) {
                gamePlay.players.player1.score += 1;
            } else {
                gamePlay.players.player2.score += 1;
            }
        } else if ((gamePlay.gameBoard.row1[0] === gamePlay.gameBoard.row2[1]) && (gamePlay.gameBoard.row2[1] === gamePlay.gameBoard.row3[2])) {
            if(gamePlay.gameBoard.row1[0] === gamePlay.players.player1.piece) {
                gamePlay.players.player1.score += 1;
            } else {
                gamePlay.players.player2.score += 1;
            }
        } else if((gamePlay.gameBoard.row1[2] === gamePlay.gameBoard.row2[1]) && (gamePlay.gameBoard.row2[1] === gamePlay.gameBoard.row3[0])) {
            if(gamePlay.gameBoard.row1[2] === gamePlay.players.player1.piece) {
                gamePlay.players.player1.score += 1;
            } else {
                gamePlay.players.player2.score += 1;
            }
        }
        roundOver();
    } else {
        if(player1Turn === true) {
            currentPlayer = gamePlay.players.player1.name;
            player1Turn = false;
        } else {
            player1Turn = true;
            currentPlayer = gamePlay.players.player2.name;
        }
        playerAnnounce.textContent = `It is ${currentPlayer}'s turn.`;
    }
    
}

// s0, s1, s2
// s3, s4, s5
// s6, s7, s8

// s0, s3, s6
// s1, s4, s7
// s2, s5, s8

// s0, s4, s8
// s2, s4, s6

function roundOver() {
    round++;
    continueGame();
}

function continueGame() {
    if(gamePlay.gamePieces === "Alternate pieces") {
        if(gamePlay.players.player1.piece === "X") {
            gamePlay.players.player1.piece === "O";
            gamePlay.players.player2.piece === "X";
        } else {
            gamePlay.players.player1.piece === "X";
            gamePlay.players.player2.piece === "O";
        }
    } else if (gamePlay.gamePieces === "Random pieces") {
        let randomChoice = Math.floor(Math.random() * 2 + 1);
        if(randomChoice === 1) {
            gamePlay.players.player1.piece = "X";
            gamePlay.players.player2.piece = "O";
        } else {
            gamePlay.players.player1.piece = "O";
            gamePlay.players.player2.piece = "X";
        }
    }
    if(gamePlay.gameRounds.roundsMode === "Single mode") {
        gameOver();
    } else if (gamePlay.gameRounds.roundsMode === "Infinite mode") {
        createGameboard();
    } else if(gamePlay.gameRounds.roundsMode === "Pick mode") {
        if(round != gamePlay.gameRounds.rounds) {
            createGameboard();
        } else {
            gameOver();
        }
    }
}

function gameOver() {
    if(gamePlay.players.player1.score > gamePlay.players.player2.score) {
        winner = gamePlay.players.player1.name;
    } else if (gamePlay.players.player2.score > gamePlay.players.player1.score) {
        winner = gamePlay.players.player2.name;
    } else if (gamePlay.players.player2.score === gamePlay.players.player1.score) {
        winner = "Nobody";
    }
    playerAnnounce.textContent = `Game over! ${winner} wins!`;
}