const Player = (name, marker, score) => {
    return {name, marker, score};
}

const playerOne = Player('Player 1', 'X', 0);
const playerTwo = Player('Player 2', 'O', 0);

const faUnique = document.querySelector('.fa-unique');
const faUnique2 = document.querySelector('.fa-unique2');
const quickStart = document.querySelector('.quickstart');
const mainBox = document.querySelector('.maincontainer');
const gameForm = document.querySelector('.gameform');
const playerAnnounce = document.querySelector('.player-announce');
const score1 = document.querySelector('.score1');
const score2 = document.querySelector('.score2');


const displayController = (() => {
    quickStart.addEventListener('click', startGame);
    faUnique.addEventListener('change', function() {
        playerOne.marker = faUnique.value;
    })
    faUnique2.addEventListener('change', function() {
        playerTwo.marker = faUnique2.value;
    })
    function startGame() {
        mainBox.style.display = "grid";
        gameForm.style.display = "none";
        gameBoard.createBoard();
    }

    return {startGame};
})();

const gameSetup = (() => {
    
})();

const gameBoard = (() => {
    let activePlayer = playerOne;
    let remainingSpots = 9;
    let winnerDeclared = false;
    let winner = "";
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]

    function createBoard() {
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
            square.addEventListener('click', function(e) {
                if(e.target.textContent === "") {
                    if(activePlayer === playerOne) {
                        if(playerOne.marker != "X" && playerOne.marker != "O") {
                            e.target.innerHTML = playerOne.marker;
                        } else {
                            if(playerOne.marker === "X") {
                                e.target.innerHTML = '<i class="fa-solid fa-xmark fa-lg"></i>';
                            } else if (playerOne.marker === "O") {
                                e.target.innerHTML = '<i class="fa-regular fa-circle fa-lg"></i>';
                            }
                        }
                    } else if (activePlayer === playerTwo) {
                        if(playerTwo.marker != "X" && playerTwo.marker != "O") {
                            e.target.innerHTML = playerTwo.marker;
                        } else {
                            if(playerTwo.marker === "X") {
                                e.target.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                            } else if (playerTwo.marker === "O") {
                                e.target.innerHTML = '<i class="fa-regular fa-circle"></i>';
                            }
                        }
                    }
                    board[index] = activePlayer.marker;
                    remainingSpots -= 1;
                    checkWinner();
                    if(winnerDeclared === false) {
                        if(remainingSpots > 0) {
                            changePlayer();
                            console.log("Current player: " + activePlayer.name);
                        } else if (remainingSpots === 0) {
                            gameTie();
                        }
                    }
                }
            })
        })
    }

    function gameTie() {
        playerAnnounce.textContent = "Draw!";
        console.log("It's a tie - no winner!");
        startNextRound();
    }

    function changePlayer() {
        if(activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
        playerAnnounce.textContent = `It's ${activePlayer.name}'s turn.`;
    }

    const winningAxes = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    // check winner
    function checkWinner() {
        winningAxes.forEach((item, index) => { // [0, 1, 2, 3, 4, 5, 6, 7]
            if (board[item[0]] === activePlayer.marker && board[item[1]] === activePlayer.marker && board[item[2]] === activePlayer.marker) {
                console.log('winner!');
                winnerDeclared = true;
                console.log('Winner Declared: ' + winnerDeclared);
                winner = activePlayer.name;
                playerAnnounce.textContent = `Tic-tac-toe, 3 in a row ~ ${activePlayer.name} wins this round!`
                console.log('Winner: ' + winner);
                if(winner === playerOne.name) {
                    playerOne.score += 1;
                } else {
                    playerTwo.score += 1;
                }
                
                score1.textContent = parseInt(playerOne.score);
                score2.textContent = parseInt(playerTwo.score);
                startNextRound();
            } 
        })
    }

    function startNextRound() {
        let nextBtn = document.createElement('button');
        nextBtn.textContent = "Start Next Round";
        playerAnnounce.appendChild(nextBtn);
        nextBtn.addEventListener('click', displayController.startGame);
    }

    return {createBoard, board}
})();
