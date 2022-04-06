const faUnique = document.querySelector('.fa-unique');
const faUnique2 = document.querySelector('.fa-unique2');
const quickStart = document.querySelector('.quickstart');
const startGame = document.querySelector('.startbtn')
const mainBox = document.querySelector('.maincontainer');
const gameForm = document.querySelector('.gameform');
const playerAnnounce = document.querySelector('.player-announce');
const score1 = document.querySelector('.score1');
const score2 = document.querySelector('.score2');
const roundsPick = document.querySelector('#roundspick');
const roundsWrapper = document.querySelector('#wrapper2');
const roundsVal = document.querySelector('.rounds-val');
const pieces = document.querySelector('#pieces');
const classicMarkers = document.querySelector('.classic-markers');
const customMarkers = document.querySelector('.custom-markers')
const option1 = document.querySelector('#option1');
const option2 = document.querySelector('#option2');
const playerOneName = document.querySelector('#player1name');
const playerTwoName = document.querySelector('#player2name');
const currentRound = document.querySelector('.current-round');
const totalRounds = document.querySelector('.total-rounds');
const playerOneLabel = document.querySelector('.player1-label');
const playerTwoLabel = document.querySelector('.player2-label');
const roundAnnounce = document.createElement('span');
const announcements = document.querySelector('.announcements');
const expandInstructions = document.querySelector('.expand-instructions');
const expandBtn = document.querySelector('.expandbtn');
const instructionsText = document.querySelector('.instructions-text');
const quitBtn = document.querySelector('.quitbtn');
const tieBtn = document.createElement('button');
const roundDiv = document.querySelector('.round-number');

// Player factory
const Players = (name, marker, score) => {
    return {name, marker, score};
}

const Modes = (mode) => {
    const getMode = () => mode;
    
    const setMode = (input) => {
        mode = input;
    }

    return {getMode, setMode};
}
let roundsMode = Modes("single");
const playerOne = Players("Player 1", "X", 0)
const playerTwo = Players("Player 2", "O", 0)
let activePlayer = playerOne;
let rounds = 1;
let roundsPassed = 1;
let tieBreaker = false;
let wentFirst = "";

// Game Setup 
const gameSetup = (() => {
    instructionsText.addEventListener('click', function() {
        if(expandBtn.textContent === "expand_more") {
            expandBtn.textContent = "expand_less";
            expandInstructions.style.display = "block";
        } else {
            expandBtn.textContent = "expand_more";
            expandInstructions.style.display = "none";
        }
    })

    // Set player names
    function setNamesP1() {
        playerOne.name = playerOneName.value;
        playerOneLabel.textContent = playerOne.name;
        console.log(`Player 1's name is ${playerOne.name}.`)
    }

    function setNamesP2() {
        playerTwo.name = playerTwoName.value;
        playerTwoLabel.textContent = playerTwo.name;
        console.log(`Player 2's name is ${playerTwo.name}.`)

    }

    // Set up # of rounds and rounds mode
    function setRounds() {
        let roundsValue = roundsVal.value;

        // Rounds mode: "pick"
        if(roundsPick.value === "Pick") {
            roundsWrapper.style.display = "flex";
            roundsVal.addEventListener('change', function() {
                if(roundsValue.match("/\D/ig")) {
                    playerAnnounce.textContent = "ERROR: Please enter a valid number in the '# of Rounds' input box.";
                } else {
                    rounds = parseInt(roundsVal.value);
                    roundsMode.setMode("pick");
                    console.log(`Rounds: ${rounds}; Rounds Mode: ${roundsMode}`);
                }
            });
        } else {
            roundsWrapper.style.display = "none";
            roundsVal.value = "";
            
            // Rounds mode: "single"
            if (roundsPick.value === 'Single') {
                roundsMode.setMode("single");
                rounds = 1;
    
            // Rounds mode: "ongoing"
            } else if (roundsPick.value === 'Ongoing') {
                roundsMode.setMode("ongoing");
                rounds = Number.MAX_SAFE_INTEGER;    
                totalRounds.textContent = "∞";
                quitBtn.style.display = "block";
                quitBtn.addEventListener('click', function() {
                    gamePlay.endGame();
                })
            }
            console.log(`Rounds: ${rounds}; Rounds Mode: ${roundsMode.getMode()}`);
        }

    }

    function matchOptions(e) {
        let option = e.target.selectedIndex;
        option1.selectedIndex = option;
        option2.selectedIndex = option;
        setMarkers();
    };

    // Set player markers
    function setMarkers() {
        if(pieces.value === "Classic") {
            classicMarkers.style.display = "flex";
            customMarkers.style.display = "none";

            if(option1.value === "X") {
                playerOne.marker = "X";
                playerTwo.marker = "O";
            } else if (option1.value === "O") {
                playerOne.marker = "O";
                playerTwo.marker = "X";
            }
            console.log(`Player 1's marker: ${playerOne.marker}`);
            console.log(`Player 2's marker: ${playerTwo.marker}`);
            
        } else if(pieces.value === "Custom") {
            customMarkers.style.display = "flex";
            classicMarkers.style.display = "none";
        }
        if(playerOne.marker === "X") {
            activePlayer = playerOne;
        } else if (playerTwo.marker === "X") {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
        console.log(`Active player: ${activePlayer.name}`)
    }

    faUnique.addEventListener('change', function() {
        playerOne.marker = faUnique.value;
        console.log(`Player 1 marker: ${playerOne.marker}`)
    })
    faUnique2.addEventListener('change', function() {
        playerTwo.marker = faUnique2.value;
        console.log(`Player 2 marker: ${playerTwo.marker}`)
    })

    pieces.addEventListener('change', setMarkers);
    roundsPick.addEventListener('change', setRounds);
    playerOneName.addEventListener('change', setNamesP1);
    playerTwoName.addEventListener('change', setNamesP2);
    option1.addEventListener('change', matchOptions);
    option2.addEventListener('change', matchOptions);

    return {setRounds}
})();



// Game Play
const gamePlay = (() => {
    let remainingSpots = 9;
    let winner = "";
    let winnerDeclared = false;
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    function newRound() {
        if(tieBreaker === true) {
            playerAnnounce.textContent = `${activePlayer.name} goes first.`
        } else {
            playerAnnounce.textContent = `${winner} won that round!`
        }
        playerAnnounce.textContent = `${winner} won that round!`
        remainingSpots = 9;
        winner = "";
        winnerDeclared = false;
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        roundsPassed += 1;
        if(wentFirst === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
        wentFirst = activePlayer;
        console.log(`Starting new round (round ${rounds}) is: ${activePlayer.name}!`)
        createGameboard();
    };

    function createGameboard() {
        announcements.style.display = "flex";
        mainBox.style.display = "grid";
        gameForm.style.display = "none";
        mainBox.innerHTML = "";
        mainBox.style.gridTemplateColumns = `1fr 1fr 1fr`;
        mainBox.style.gridTemplateRows = `1fr 1fr 1fr`;
        for(let i = 0; i < 9; i++) {
            let square = document.createElement('div');
            mainBox.appendChild(square);
            square.classList.add('square', 's' + i);
        }
        playerAnnounce.appendChild(roundAnnounce);
        currentRound.textContent = roundsPassed;
        if(roundsMode.getMode() !== "ongoing") {
            totalRounds.textContent = rounds;
        }
        if(roundsPassed === 1) {
            playerAnnounce.textContent = `${activePlayer.name} goes first.`;
        }
        const squares = document.querySelectorAll('.square');
        squares.forEach((square, index) => {
            square.addEventListener('click', function() {
                if(this.innerHTML === "" && square.textContent === "") {
                    if(activePlayer === playerOne) {
                        if(playerOne.marker != "X" && playerOne.marker != "O") {
                            this.innerHTML = playerOne.marker;
                        } else {
                            if(playerOne.marker === "X") {
                                this.innerHTML = '<i class="fa-solid fa-x"></i>';
                            } else if (playerOne.marker === "O") {
                                this.innerHTML = '<i class="fa-regular fa-circle"></i>';
                            }
                        }
                    } else if (activePlayer === playerTwo) {
                        if(playerTwo.marker != "X" && playerTwo.marker != "O") {
                            this.innerHTML = playerTwo.marker;
                        } else {
                            if(playerTwo.marker === "X") {
                                this.innerHTML = '<i class="fa-solid fa-x"></i>';
                            } else if (playerTwo.marker === "O") {
                                this.innerHTML = '<i class="fa-regular fa-circle"></i>';
                            }
                        }
                    }
                    board[index] = activePlayer.marker;
                    playRound();
                }
            });
        });
    }

    function playRound() {
        document.querySelector('.win-announce').textContent = "";
        remainingSpots -= 1;
        winnerDeclared = false;
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

    function gameTie() {
        winner = "Nobody";
        if(tieBreaker === true && roundsMode.getMode() === "ongoing") {
            endGame();
        } else if((tieBreaker === true) || (roundsPassed === rounds) && roundsMode.getMode() != "ongoing") {
            endGame();
        } else {
            newRound();
        }
    }

    function changePlayer() {
        console.log(`Remaining spots: ${remainingSpots}; Winner declared: ${winnerDeclared}; winner: ${winner}`)
        if(activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
        if(activePlayer === playerOne) {
            
            playerOneLabel.style.backgroundColor = "#fff189";
            playerTwoLabel.style.backgroundColor = "white";
        } else {
            playerOneLabel.style.backgroundColor = "white";
            playerTwoLabel.style.backgroundColor = "#fff189";
        }
        console.log(winnerDeclared)
        playerAnnounce.textContent = `It's ${activePlayer.name}'s turn.`
        if (winnerDeclared === true) {
            document.querySelector('.win-announce').textContent += `${winner} won that round!`;
        }
    }

    function checkWinner() {
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
        winningAxes.forEach((item, index) => { // [0, 1, 2, 3, 4, 5, 6, 7]
            if (board[item[0]] === activePlayer.marker && board[item[1]] === activePlayer.marker && board[item[2]] === activePlayer.marker) {
                console.log('winner!');
                winnerDeclared = true;
                console.log('Winner Declared: ' + winnerDeclared);
                winner = activePlayer.name;
                console.log('Winner: ' + winner);
                if(winner === playerOne.name) {
                    playerOne.score += 1;
                } else {
                    playerTwo.score += 1;
                }
                document.querySelector('.win-announce').textContent = `${winner} won that round!`;

                score1.textContent = parseInt(playerOne.score);
                score2.textContent = parseInt(playerTwo.score);
            } 
        })
        if(winnerDeclared === true) {
            if(tieBreaker === true) {  
                endGame();
            } else {
                if(roundsPassed === rounds) {
                    endGame();
                } else {
                    newRound();
                }
            }
        }
    }

    function endGame() {
        document.querySelector('.win-announce').textContent = "";
        const restartBtn = document.createElement('button');
        restartBtn.classList.add('restart');
        restartBtn.textContent = "Start over";
        restartBtn.addEventListener('click', function() {
            location.reload();
            return false;
        })
        if(playerOne.score > playerTwo.score) {
            playerAnnounce.textContent = `${playerOne.name} wins!`;
        } else if (playerOne.score < playerTwo.score) {
            playerAnnounce.textContent = `${playerTwo.name} wins!`;
        } else {
            playerAnnounce.textContent = `It's a tie, so nobody wins! Would you like to play a tiebreaker round?`
            playerAnnounce.appendChild(tieBtn);
        }
        tieBtn.textContent = "Play tiebreaker";
        tieBtn.classList.add('restart');
        tieBtn.addEventListener('click', tieBreakerRound)
        playerAnnounce.appendChild(restartBtn);
        disableBoard();
    }

    function tieBreakerRound() {
        winnerDeclared = false;
        tieBreaker = true;
        roundDiv.innerHTML = "<p><strong>Rounds:</strong> Tiebreaker";
        newRound();
    }

    function disableBoard() {
        mainBox.style.display = "none";
    }

    startGame.addEventListener('click', createGameboard);
    
    return {newRound, board, remainingSpots, endGame};
})();


/*

    [x] Figure out how to make entire game end when rounds are over
    [x] Set up turn announcements
    [x] Set up "(name) goes first" announcements @ start of new round
    [ ] Figure out how to do tiebreakers
        [ ] And also what to do if tiebreaker is also a draw

*/