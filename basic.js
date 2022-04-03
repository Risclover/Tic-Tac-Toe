const Player = (name, marker) => {
    return {name, marker};
}

const playerOne = Player('Player 1', 'X');
const playerTwo = Player('Player 2', 'O');

const quickStart = document.querySelector('.quickstart');
const mainBox = document.querySelector('.maincontainer');
const gameForm = document.querySelector('.gameform');

const displayController = (() => {
    quickStart.addEventListener('click', startGame);
    
    function startGame() {
        mainBox.style.display = "grid";
        gameForm.style.display = "none";
        gameBoard.createBoard();
    }


})();

const gameBoard = (() => {
    let activePlayer = playerOne;
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
                e.target.textContent = activePlayer.marker;
                board[index] = activePlayer.marker;
                checkWinner();
                changePlayer();
            })
        })
    }


    function changePlayer() {
        if(activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
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
            } 
        })
    }

    return {createBoard, board}
})();
