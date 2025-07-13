const Player = (name, marker) => {
    let numOfWins = 0
    const getWins = () => numOfWins;
    const incrementWins = () => ++numOfWins;
    
    return {name, marker, getWins, incrementWins};
}

const Gameboard = (() => {
    let gameboard = [[],[],[]]
})();

const GameDisplayController = (() => {
    const winnerText = document.getElementById("winnerText");
})();

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");
console.log(player1)
console.log(player2)