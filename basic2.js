// Player factory; create player's "profile" (name, marker, and score)
const Players = (name, marker, score) => {
    return {name, marker, score};
}

// Modes facotry; get and set the game's rounds mode
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

const mainBox = document.querySelector('.maincontainer');
const playerAnnounce = document.querySelector('.player-announce');
const roundsPick = document.querySelector('#roundspick');
const totalRounds = document.querySelector('.total-rounds');

let activePlayer = playerOne;
let rounds = 1;
let roundsPassed = 1;
let tieBreaker = false;
let wentFirst = "";

// Game Setup; takes the form responses and sets up the game according to what the player chooses.
const gameSetup = (() => {
    const pieces = document.querySelector('#pieces');
    const playerOneName = document.querySelector('#player1name');
    const playerTwoName = document.querySelector('#player2name');
    const option1 = document.querySelector('#option1');
    const option2 = document.querySelector('#option2');
    const instructionsText = document.querySelector('.instructions-text');
    const faUnique = document.querySelector('.fa-unique');
    const faUnique2 = document.querySelector('.fa-unique2');

    instructionsText.addEventListener('click', function() {
        const expandBtn = document.querySelector('.expandbtn');
        const expandInstructions = document.querySelector('.expand-instructions');
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
        const playerOneLabel = document.querySelector('.player1-label');
        playerOne.name = playerOneName.value;
        playerOneLabel.textContent = playerOne.name;
        console.log(`Player 1's name is ${playerOne.name}.`)
    }

    function setNamesP2() {
        const playerTwoLabel = document.querySelector('.player2-label');
        playerTwo.name = playerTwoName.value;
        playerTwoLabel.textContent = playerTwo.name;
        console.log(`Player 2's name is ${playerTwo.name}.`)

    }

    // Set up # of rounds and rounds mode
    function setRounds() {
        const roundsVal = document.querySelector('.rounds-val');
        const roundsWrapper = document.querySelector('#wrapper2');
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
        const classicMarkers = document.querySelector('.classic-markers');
        const customMarkers = document.querySelector('.custom-markers');
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


    // Form element "on change" event listeners
    pieces.addEventListener('change', setMarkers);
    roundsPick.addEventListener('change', setRounds);
    playerOneName.addEventListener('change', setNamesP1);
    playerTwoName.addEventListener('change', setNamesP2);
    option1.addEventListener('change', matchOptions);
    option2.addEventListener('change', matchOptions);

    return {setRounds}
})();


// Game Play; everything that happens during the actual gameplay.
const gamePlay = (() => {
    const startGame = document.querySelector('.startbtn');
    const quitBtn = document.querySelector('.quitbtn');
    let remainingSpots = 9;
    let winner = "";
    let winnerDeclared = false;
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    // 
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

    // Creates the tic tac toe grid/gameboard. Also contains what happens when a square is clicked on.
    function createGameboard() {
        document.querySelector('.announcements').style.display = "flex";
        mainBox.style.display = "grid";
        document.querySelector('.gameform').style.display = "none";
        mainBox.innerHTML = "";
        if (roundsPick.value === 'Ongoing') {
            quitBtn.style.display = "block";
            quitBtn.addEventListener('click', function() {
                endGame();
            })
        }
        mainBox.style.gridTemplateColumns = `1fr 1fr 1fr`;
        mainBox.style.gridTemplateRows = `1fr 1fr 1fr`;
        for(let i = 0; i < 9; i++) {
            let square = document.createElement('div');
            mainBox.appendChild(square);
            square.classList.add('square', 's' + i);
        }
        const roundAnnounce = document.createElement('span');
        playerAnnounce.appendChild(roundAnnounce);
        document.querySelector('.current-round').textContent = roundsPassed;
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

    // After the gameboard is set up and a square is clicked on, this is what happens when a round is "played"
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

    // Condition for when the round is tied
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

    // Changes players after each round
    function changePlayer() {
        console.log(`Remaining spots: ${remainingSpots}; Winner declared: ${winnerDeclared}; winner: ${winner}`)
        const p1LabelBack = document.querySelector('.label-back1');
        const p2LabelBack = document.querySelector('.label-back2');
        if(activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
        if(activePlayer === playerOne) {
            p1LabelBack.style.backgroundColor = "#fff189";
            p2LabelBack.style.backgroundColor = "white";
        } else {
            p1LabelBack.style.backgroundColor = "white";
            p2LabelBack.style.backgroundColor = "#fff189";
        }
        console.log(winnerDeclared)
        playerAnnounce.textContent = `It's ${activePlayer.name}'s turn.`
        if (winnerDeclared === true) {
            document.querySelector('.win-announce').textContent += `${winner} won that round!`;
        }
    }

    // Checks for winning line of markers
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

                document.querySelector('.score1').textContent = parseInt(playerOne.score);
                document.querySelector('.score2').textContent = parseInt(playerTwo.score);
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

    // End of game function.
    function endGame() {
        const tieBtn = document.createElement('button');
        if(roundsMode.getMode() === "ongoing") {
            quitBtn.style.display = "none";
        }
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

    // What happens when there's a tie breaker. (Sets up information and goes to newRound()).
    function tieBreakerRound() {
        winnerDeclared = false;
        tieBreaker = true;
        document.querySelector('.round-number').innerHTML = "<p><strong>Rounds:</strong> Tiebreaker";
        newRound();
    }

    // Disables the board (aka makes it go bye-bye)
    function disableBoard() {
        mainBox.style.display = "none";
    }


    startGame.addEventListener('click', createGameboard);
    
    return {newRound, board, remainingSpots, endGame};
})();