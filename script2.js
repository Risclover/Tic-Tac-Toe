let playerOne;
let playerTwo;
let roundsMode;
let markerMode;
let rounds = 0;
let activePlayer = playerOne;

const gameForm = document.querySelector('.gameform');
const mainBox = document.querySelector('.maincontainer');
const quickStart = document.querySelector('.quickstart');
const startBtn = document.querySelector('.startbtn');
const roundsPick = document.querySelector('#roundspick');
const pieces = document.querySelector('#pieces');
const player1Name = document.querySelector('#player1name');
const player2Name = document.querySelector('#player2name');
const wrapper2 = document.getElementById('wrapper2');
const wrapper = document.getElementById('wrapper');
const playerAnnounce = document.querySelector('.player-announce');
const roundsVal = document.querySelector('.rounds-val');
const option1 = document.getElementById('option1');
const option2 = document.getElementById('option2');

const Player = (name, marker, score) => {
    return {name, marker, score};
}

const Modes = (mode) => {
    const getMode = () => mode;
    
    const setMode = (input) => {
        mode = input;
    }

    return {getMode, setMode};
}

// Sets set rounds mode, set markers mode, rounds
const gameSetup = (() => {
    playerOne = Player("Player 1", "X", 0);
    playerTwo = Player("Player 2", "O", 0);
    roundsMode = Modes();
    markerMode = Modes();

    roundsPick.addEventListener('change', function() {
        roundsMode.setMode(roundsPick.value);
        if (roundsMode.getMode() === "Single") {
            rounds = 1;
            console.log('Rounds: ' + rounds);
        } else if (roundsMode.getMode() === "Infinite") {
            rounds = 100000;
            console.log('Rounds: ' + rounds);
        } else if (roundsMode.getMode() === "Pick") {
            roundsVal.addEventListener('change', function() {
                rounds = Number(roundsVal.value);
                console.log('Rounds: ' + rounds);
            })
        }
    });
    
    pieces.addEventListener('change', function() {
        markerMode.setMode(pieces.value);
        console.log('Marker mode: ' + markerMode.getMode());
    });

    option1.addEventListener('change', function() {
        playerOne.marker = option1.value;
        console.log('Player 1 Marker: ' + playerOne.marker);
        if(playerOne.marker === "X") {
            playerTwo.marker = "O";
            console.log('Player 2 Marker: ' + playerTwo.marker);
            activePlayer = playerOne;
        } else {
            playerTwo.marker = "X";
            console.log('Player 2 Marker: ' + playerTwo.marker);
            activePlayer = playerTwo;
        } 
    })

    option2.addEventListener('change', function() {
        playerTwo.marker = option2.value;
        console.log('Player 2 Marker: ' + playerTwo.marker);
        if(playerTwo.marker === "X") {
            playerOne.marker = "O";
            activePlayer = playerTwo;
            console.log('Player 1 Marker: ' + playerOne.marker);
        } else {
            playerOne.marker = "X";
            activePlayer = playerOne;
            console.log('Player 1 Marker: ' + playerOne.marker);
        }
    })

    player1Name.addEventListener('change', function() {
        playerOne.name = player1Name.value;
        console.log('Player 1 Name: ' + playerOne.name);
    })

    player2Name.addEventListener('change', function() {
        playerTwo.name = player2Name.value;
        console.log('Player 2 Name: ' + playerTwo.name);
    })

})();

const gameBoard = (() => {
    let remainingMoves = 9;
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
    function createGameboard() {
        const mainBox = document.querySelector('.maincontainer');
        mainBox.innerHTML = "";
        mainBox.style.gridTemplateColumns = `1fr 1fr 1fr`;
        mainBox.style.gridTemplateRows = `1fr 1fr 1fr`;
        for(let i = 0; i < 9; i++) {
            let square = document.createElement('div');
            mainBox.appendChild(square);
            square.classList.add('square', 's' + i);
        }

        const squares = document.querySelectorAll('.square');
        squares.forEach((square, index) => {
            square.addEventListener('click', event => {
                if(event.target.textContent.length == 0 && !game.gameOver) {
                    event.target.textContent = activePlayer.marker;
                    switch (true){
                        case square.classList.contains('s0'):
                            board[0][0] = activePlayer.marker;
                            break;
                        case square.classList.contains('s1'):
                            board[0][1] = activePlayer.marker;
                            break;
                        case square.classList.contains('s2'):
                            board[0][2] = activePlayer.marker;
                            break;
                        
                    }
                    remainingMoves -= 1;
                    game.checkWin();
                    if(!game.gameOver) {
                        if(remainingMoves > 0) {
                            changePlayer();
                            displayController.announceTurn(activePlayer.name);
                        } else if (remainingMoves === 0) {
                            playerAnnounce.textContent = "Draw!";
                        }
                    }
                }
            })
        })
    }

    const changePlayer = () => {
        if(activePlayer == playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }

        console.log(`Active player: ${activePlayer.name}`);
    }

    return {createGameboard, board};
})();

const displayController = (() => {
    option1.addEventListener('change', matchOptions);
    option2.addEventListener('change', matchOptions);
    roundsPick.addEventListener('change', function() {
        if(roundsPick.value === "Pick") {
            wrapper2.style.display = "flex";
        } else {
            wrapper2.style.display = "none";
        }
    });

    pieces.addEventListener('change', function() {
        if(pieces.value === "Players") {
            wrapper.style.display = "flex";
        } else {
            wrapper.style.display = "none";
        }
    })

    function matchOptions(e) {
        let option = e.target.selectedIndex;
        option1.selectedIndex = option;
        option2.selectedIndex = option;
    };

    function announceTurn(name) {
        playerAnnounce.textContent = `It is ${name}'s turn.`;
        console.log(name);
    }

    quickStart.addEventListener('click', function() {
        gameForm.style.display = "none";
        mainBox.style.display = "grid";
        gameBoard.activePlayer = playerOne;
        gameBoard.createGameboard();
    });
    return {announceTurn};
})();

const game = (() => {
    let gameOver = false;

    function checkWin() {

        const winningCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]

        for (let i = 0; i < winningCombinations.length; i++) {
            const combo = winningCombinations[i];
            if (activePlayer.marker === gameBoard.board[i][0] 
                && activePlayer.marker === gameBoard.board[i][1]
                && activePlayer.marker === gameBoard.board[i][2]) {
                    playerAnnounce.textContent = `${activePlayer.name} wins!`
                    gameOver = true
                    return true
            }
        } return false
    }

    return {gameOver, checkWin};
})();