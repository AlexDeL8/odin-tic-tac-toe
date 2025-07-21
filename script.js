// GLOBAL VARS
const MAX_MOVES = 9;

// ELEMENTS
const gameBoard = document.getElementById("gameBoard");
const gameCells = document.querySelectorAll(".gameBoardCell");
const newGameBtn = document.getElementById("newGameBtn");
const player1Wins = document.getElementById("player1WinsNumber");
const player2Wins = document.getElementById("player2WinsNumber");
const winnerLabel = document.getElementById("winnerLabel");
const winnerName = document.getElementById("winnerName");

// OBJECTS
const Player = (name, marker) => {
    const id = crypto.randomUUID();
    let numOfWins = 0;
    const getId = () => id;
    const getWins = () => numOfWins;
    const incrementWins = () => ++numOfWins;
    // TODO: Update marker and display
    
    return { name, marker, getId, getWins, incrementWins };
}

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

// SINGLETONS
const GameBoard = (() => {
    let gameBoard = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    const getBoard = () => {
        return gameBoard;
    };

    const resetBoard = () => {
        gameBoard.forEach(row => {
            for(let i = 0; i < row.length; i++) {
                row[i] = null;
            }
        });
        GameDisplayController.resetBoard();
    };

    const updateBoard = (row, col, marker) => {
        if(gameBoard[row][col] !== null) {
            return false;
        }
        gameBoard[row][col] = marker;
        return true;
    };

    const checkWin = (marker) => {
        const checkHorizontal = () => {
            for(let row of gameBoard) {
                if(row.every(value => value === marker)) {
                    Game.endGame();
                    return true;
                }
            }
            return false;
        };

        const checkVertical = () => {
            for(let col = 0; col < gameBoard[0].length; col++) {
                for(let row = 0; row < gameBoard.length; row++) {
                    if(gameBoard[row][col] !== marker) {
                        break;
                    }
                    if(row === 2) {
                        Game.endGame();
                        return true;
                    }
                }
            }
            return false;
        };

        const checkDiagonal = () => {
            if((gameBoard[0][0] === marker && gameBoard[1][1] === marker && gameBoard[2][2] === marker) || 
            (gameBoard[0][2] === marker && gameBoard[1][1] === marker && gameBoard[2][0] === marker)) {
                Game.endGame();
                return true;
            }
            return false;
        };

        return checkHorizontal() || checkVertical() || checkDiagonal();
    };

    return { 
        getBoard, 
        resetBoard,
        updateBoard, 
        checkWin 
    };
})();

const GameDisplayController = (() => {
    const updateWinner = (player = null) => {
        if(player === null) {
            // Reset and hide text
            winnerLabel.style.display = 'none';
            winnerLabel.innerText = '';
            winnerName.style.display = 'none';
            winnerName.innerText = '';
        } else if(player === 'Tie') {
            winnerLabel.innerText = 'Tie!'
            winnerLabel.style.display = 'block';
        } else {
            // Set and show text
            updateWins();
            winnerLabel.innerText = 'Winner: '
            winnerLabel.style.display = 'block';
            winnerName.innerText = player.name;
            winnerName.style.display = 'block';
        }
    };

    const updateWins = () => {
        if(Game.getPlayer1Turn()) {
            player1Wins.innerText = player1.getWins();
        } else {
            player2Wins.innerText = player2.getWins();
        }
    };

    const fillCell = (elementId, marker) => {
        const cellElement = document.getElementById(elementId);
        cellElement.classList.add('playerMarker', marker === player1.marker ? 'player1Marker' : 'player2Marker');
        cellElement.innerText = marker
    };

    const resetBoard = () => {
        gameCells.forEach(cell => {
            cell.innerText = null;
            cell.className = 'gameBoardCell';
        });
    }

    const enableGameBoard = () => {
        gameBoard.classList.remove("disabled");
    };

    const disableGameBoard = () => {
        gameBoard.classList.add("disabled");
    };
    
    const enableNewGameBtn = () => {
        newGameBtn.ariaDisabled = false;
        newGameBtn.disabled = false;
    };

    const disableNewGameBtn = () => {
        newGameBtn.ariaDisabled = true;
        newGameBtn.disabled = true;
    };

    return { 
        updateWinner, 
        fillCell,
        resetBoard,
        enableGameBoard, 
        disableGameBoard, 
        enableNewGameBtn, 
        disableNewGameBtn 
    };
})();

const Game = ((player1, player2) => {
    let gameStarted = false;
    let winner = null;
    let player1Turn = winner === null ? true : winner === player1.name ? true : false;
    let turns = 0;
    GameDisplayController.updateWinner(winner);

    const startGame = () => {
        if(gameStarted) {
            return;
        }
        GameBoard.resetBoard();
        GameDisplayController.resetBoard();
        GameDisplayController.updateWinner(null);
        turns = 0;
        gameStarted = true;
        GameDisplayController.disableNewGameBtn();
        GameDisplayController.enableGameBoard();
        return;
    };

    const endGame = () => {
        GameDisplayController.disableGameBoard();
        gameStarted = false;
        turns = 0;
        GameDisplayController.enableNewGameBtn();
        return;
    };

    const getPlayer1Turn = () => {
        return player1Turn;
    };

    const makeMove = (row, col, player, cellId) => {
        const validMove = GameBoard.updateBoard(row, col, player.marker);
        if(!validMove) {
            return;
        }
        GameDisplayController.fillCell(cellId, player.marker);
        if(GameBoard.checkWin(player.marker)) { 
            winner = player;
            player.incrementWins();
            GameDisplayController.updateWinner(winner);
            endGame();
        }
        player1Turn = !player1Turn;
        turns++;
        if(turns === MAX_MOVES) {
            winner = "Tie";
            GameDisplayController.updateWinner(winner);
            endGame();
        }
    };

    const getTurns = () => {
        return turns;
    };

    return { 
        startGame, 
        endGame, 
        getPlayer1Turn, 
        makeMove, 
        getTurns 
    };
})(player1, player2);

// EVENT LISTENERS
gameBoard.addEventListener("click", (event) => {
    if(gameBoard.classList.contains("disabled")) {
        return;
    }
});

gameCells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
        if(gameBoard.classList.contains("disabled")) {
            return;
        }
        const currentPlayer = Game.getPlayer1Turn() ? player1 : player2;
        Game.makeMove(cell.dataset.cellRow, cell.dataset.cellCol, currentPlayer, cell.id);
    });
});

newGameBtn.addEventListener("click", () => {
    Game.startGame();
});