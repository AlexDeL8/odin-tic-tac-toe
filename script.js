// ELEMENTS
const winnerText = document.getElementById("winnerText");

// EVENT LISTENERS
// TODO:

// OBJECTS
const Player = (name, marker) => {
    let numOfWins = 0;
    const getWins = () => numOfWins;
    const incrementWins = () => ++numOfWins;
    
    return { name, marker, getWins, incrementWins };
}

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

// SINGLETONS
const Gameboard = (() => {
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    const getBoard = () => {
        return gameboard;
    };

    const updateBoard = (row, col, marker) => {
        if(gameboard[row][col] !== null) {
            console.log(gameboard);
            return false;
        }
        gameboard[row][col] = marker;
        console.log(gameboard);
        return true;
    };

    const checkWin = (marker) => {
        const checkHorizontal = () => {
            for(let row of gameboard) {
                if(row.every(value => value === marker)) {
                    return true;
                }
            }
            return false;
        };

        const checkVertical = () => {
            for(let col = 0; col < gameboard[0].length; col++) {
                for(let row = 0; row < gameboard.length; row++) {
                    if(gameboard[row][col] !== marker) {
                        break;
                    }
                    if(row === 2) {
                        return true;
                    }
                }
            }
            return false;
        };

        const checkDiagonal = () => {
            if((gameboard[0][0] === marker && gameboard[1][1] === marker && gameboard[2][2] === marker) || 
            (gameboard[0][2] === marker && gameboard[1][1] === marker && gameboard[2][0] === marker)) {
                return true
            }
            return false
        };

        return checkHorizontal() || checkVertical() || checkDiagonal();
    };

    return { getBoard, updateBoard, checkWin };
})();

const GameDisplayController = (() => {
    const updateWinner = (playerName = null) => {
        winnerText.innerText = playerName ?? '';
    }

    return { updateWinner }
})();

const Game = ((player1, player2) => {
    let winner = null;
    GameDisplayController.updateWinner(winner)
    let player1Turn = winner === null ? true : winner === player1.name ? true : false;
    let turns = 0
    while(winner === null && turns < 9) {
        const currentPlayer = player1Turn ? player1 : player2;
        const marker = currentPlayer.marker
        let [row, col] = prompt(`${currentPlayer.name}: Enter {row} {col} to fill cell`).split(' ');
        let validMove = Gameboard.updateBoard(row, col, marker);

        while(!validMove) {
            [row, col] = prompt(`${currentPlayer.name}: That cell is already filled, choose another.`).split(' ');
            validMove = Gameboard.updateBoard(row, col, marker);
        }
        player1Turn = !player1Turn
        turns++
        if(Gameboard.checkWin(currentPlayer.marker)) {
            winner = currentPlayer.name
        } else if(turns === 9) {
            winner = "Tie"
        }
    }
    GameDisplayController.updateWinner(winner)
})(player1, player2);