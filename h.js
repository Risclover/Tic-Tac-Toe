
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
// Player factory
const Players = (name, marker, score) => {
    return {name, marker, score};
}

const playerOne = Players("Player 1", "X", 0)
const playerTwo = Players("Player 2", "O", 0)
let activePlayer = playerOne;
let rounds = 1;
let roundsPassed = 1;
let tieBreaker = false;

// Game Setup 
const gameSetup = (() => {
    let roundsMode = "single";

    instructionsText.addEventListener('click', function() {
        if(expandBtn.textContent === "expand_more") {
            expandBtn.textContent = "expand_less";
            expandInstructions.style.display = "block";
        } else {
            expandBtn.textContent = "expand_more";
            expandInstructions.style.display = "none";
        }
    })
    function quickPlay() {
        gamePlay.startGame();
    }

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
                    roundsMode = "pick";
                    console.log(`Rounds: ${rounds}; Rounds Mode: ${roundsMode}`);
                }
            });
        } else {
            roundsWrapper.style.display = "none";
            roundsVal.value = "";
            
            // Rounds mode: "single"
            if (roundsPick.value === 'Single') {
                roundsMode = "single";
                rounds = 1;
    
            // Rounds mode: "ongoing"
            } else if (roundsPick.value === 'Ongoing') {
                roundsMode = "ongoing";
                rounds = Number.MAX_SAFE_INTEGER;    
            }
            console.log(`Rounds: ${rounds}; Rounds Mode: ${roundsMode}`);
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

    return {setRounds, quickPlay, roundsMode}
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
        remainingSpots = 9;
        winner = "";
        winnerDeclared = false;
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        roundsPassed += 1;
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
        if(playerOne.marker === "X") {
            activePlayer = playerOne;
        } else if (playerTwo.marker === "X") {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
        console.log(`Active player: ${activePlayer.name}`)

        playerAnnounce.textContent = `${activePlayer.name} goes first.`;
        playerAnnounce.appendChild(roundAnnounce);
        currentRound.textContent = roundsPassed;
        totalRounds.textContent = rounds;
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
                    if(tieBreaker === false) {
                        newRound
                    } else {
                        tieBreakerRound();
                    }
                }
            });
        });
    }

    function playRound() {
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

    function gameTie() {
        roundAnnounce.textContent = "It's a draw. Nobody scores.";    
        console.log("It's a tie - no winner!");
        if(roundsPassed === rounds) {
            if(playerOne.score != playerTwo.score) {
                endGame();
            } else {
                endGame();
            }
        } else {
            newRound();
        }
    }

    function changePlayer() {
        if(activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
        playerAnnounce.textContent = `It's ${activePlayer.name}'s turn.`;
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
                roundAnnounce.textContent = `Tic-tac-toe, 3 in a row ~ ${activePlayer.name} wins this round!`
                console.log('Winner: ' + winner);
                if(winner === playerOne.name) {
                    playerOne.score += 1;
                } else {
                    playerTwo.score += 1;
                }
                
                score1.textContent = parseInt(playerOne.score);
                score2.textContent = parseInt(playerTwo.score);
            } 
        })
        if(winnerDeclared === true) {
            if(roundsPassed === rounds) {
                if(playerOne.score != playerTwo.score) {
                    endGame();
                } else {
                    endGame();
                }
            } else {
                newRound();
            }
        }
    }

    function endGame() {
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
        }
        playerAnnounce.appendChild(restartBtn);
        disableBoard();
    }

    function tieGame() {
        playerAnnounce.textContent = `It's a tie game! Would you like to play one more round? This one's for all the marbles.`;
        const yesBtn = document.createElement('button');
        yesBtn.textContent = "Play tiebreaker";
        playerAnnounce.appendChild(yesBtn);
        yesBtn.addEventListener('click', lastRound);
    }

    function lastRound() {
        tieBreaker = true;
        createGameboard();
    }

    function tieBreakerRound() {
        checkWinner();
    }

    function disableBoard() {
        mainBox.innerHTML = "";
    }

    startGame.addEventListener('click', createGameboard);
    
    return {newRound, board};
})();


/*
    [X] Figure out how to set who goes first at the start of each round
        - Answer: Alternate who goes first.
    [X] Figure out how to make entire game end when rounds are over
    [X] Set up turn announcements
    [ ] Set up "(name) goes first" announcements @ start of new round
    [ ] Figure out how to implement "tiebreaker" rounds if scores are tied @ the end
        [ ] And also if the score is tied when the player presses the "Quit" button
        [ ] And also if there is a Draw for the tiebreaker round
*/