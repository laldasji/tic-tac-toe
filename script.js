const pickSide = document.querySelector('#pickSide');
const zeroSelect = pickSide.querySelector('#zero');
const crossSelect = pickSide.querySelector('#cross');
const declareWinner = document.querySelector('#declareWinner');
const boxes = document.querySelectorAll('.box');
const passStatus = declareWinner.querySelector('#passStatus');
const respectStatus = declareWinner.querySelector('#respectStatus');
const passAudio = document.querySelector('#missionPassed');
passAudio.addEventListener('ended', () => {
    audio.currentTime = 0;
});

const failAudio = document.querySelector('#missionFailed');
failAudio.addEventListener('ended', () => {
    audio.currentTime = 0;
});

function checkIfNextWinningMove(gameBoard, playerSymbol) {
    console.log(`Checking for: ${playerSymbol}`)
    // Check rows, columns, and diagonals for a winning move
    for (let i = 0; i < 3; i++) {
        // Check rows
        if (gameBoard[i][0] === '' && gameBoard[i][1] === playerSymbol && gameBoard[i][2] === playerSymbol) {
            console.log([true, i, 0]);
            return [true, i, 0];
        }
        if (gameBoard[i][0] === playerSymbol && gameBoard[i][1] === '' && gameBoard[i][2] === playerSymbol) {
            console.log([true, i, 1]);
            return [true, i, 1];
        }
        if (gameBoard[i][0] === playerSymbol && gameBoard[i][1] === playerSymbol && gameBoard[i][2] === '') {
            console.log([true, i, 2]);
            return [true, i, 2];
        }

        // Check columns
        if (gameBoard[0][i] === '' && gameBoard[1][i] === playerSymbol && gameBoard[2][i] === playerSymbol) {
            console.log([true, 0, i]);
            return [true, 0, i];
        }
        if (gameBoard[0][i] === playerSymbol && gameBoard[1][i] === '' && gameBoard[2][i] === playerSymbol) {
            console.log([true, 1, i]);
            return [true, 1, i];
        }
        if (gameBoard[0][i] === playerSymbol && gameBoard[1][i] === playerSymbol && gameBoard[2][i] === '') {
            console.log([true, 2, i]);
            return [true, 2, i];
        }
    }

    // Check diagonals
    if (gameBoard[0][0] === '' && gameBoard[1][1] === playerSymbol && gameBoard[2][2] === playerSymbol) {
        console.log([true, 0, 0]);
        return [true, 0, 0];
    }
    if (gameBoard[0][0] === playerSymbol && gameBoard[1][1] === '' && gameBoard[2][2] === playerSymbol) {
        console.log([true, 1, 1]);
        return [true, 1, 1];
    }
    if (gameBoard[0][0] === playerSymbol && gameBoard[1][1] === playerSymbol && gameBoard[2][2] === '') {
        console.log([true, 2, 2]);
        return [true, 2, 2];
    }

    if (gameBoard[0][2] === '' && gameBoard[1][1] === playerSymbol && gameBoard[2][0] === playerSymbol) {
        console.log([true, 0, 2]);
        return [true, 0, 2];
    }
    if (gameBoard[0][2] === playerSymbol && gameBoard[1][1] === '' && gameBoard[2][0] === playerSymbol) {
        console.log([true, 1, 1]);
        return [true, 1, 1];
    }
    if (gameBoard[0][2] === playerSymbol && gameBoard[1][1] === playerSymbol && gameBoard[2][0] === '') {
        console.log([true, 2, 0]);
        return [true, 2, 0];
    }
    console.log('none');
    return [false, -1, -1];
}

function checkWinner(gameBoard) {
    // true if any winner, true if x wins, false if O wins
    function isWinningLine(a, b, c) {
        return a !== '' && a === b && a === c;
    }

    // Check rows
    for (let i = 0; i < 3; i++) {
        if (isWinningLine(gameBoard[i][0], gameBoard[i][1], gameBoard[i][2])) {
            return [true, gameBoard[i][0] === 'X'];
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        if (isWinningLine(gameBoard[0][i], gameBoard[1][i], gameBoard[2][i])) {
            return [true, gameBoard[0][i] === 'X'];
        }
    }

    // Check diagonals
    if (isWinningLine(gameBoard[0][0], gameBoard[1][1], gameBoard[2][2])) {
        return [true, gameBoard[0][0] === 'X'];
    }
    if (isWinningLine(gameBoard[0][2], gameBoard[1][1], gameBoard[2][0])) {
        return [true, gameBoard[0][2] === 'X'];
    }

    // No winner
    return [false, false];
}

function bestPossibleMove(gameBoard, playerSymbol, playerMoves, aiMoves) {
    // check if AI has winning move!
    if (aiMoves.length >= 2) {
        let canWin = checkIfNextWinningMove(gameBoard, playerSymbol ? 'O' : 'X');
        if (canWin[0])
            return [canWin[1], canWin[2]];
    }
    // if can't win, block opponent!
    if (playerMoves.length >= 2) {
        // returns [bool, row, column]
        let aboutToWin = checkIfNextWinningMove(gameBoard, playerSymbol ? 'X' : 'O');
        if (aboutToWin[0])
            return [aboutToWin[1], aboutToWin[2]];

    }
    // first fill center
    if (gameBoard[1][1] == '')
        return [1, 1];

    // else fill corners
    const corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
    let emptyCorners = [];
    let filledCorners = [];
    for (let i = 0; i < corners.length; i++) {
        if (gameBoard[corners[i][0]][corners[i][1]] == '')
            emptyCorners.push(corners[i]);
        else
            filledCorners.push(corners[i]);
    }

    // case 1: all corners empty, return any one corner
    if (emptyCorners.length == 4) {
        // if one edge is filled
        return corners[Math.floor(Math.random() * 4)];
    }
    // case 2: 3 corners empty
    // 2.1 one corner filled
    else if (emptyCorners.length == 3) {
        let candidateCorners = [
            [Math.abs(filledCorners[0][0] - 2), filledCorners[0][1]],
            [filledCorners[0][0], Math.abs(filledCorners[0][1] - 2)]
        ];
        return candidateCorners[Math.floor(Math.random() * 2)];
    }
    else if (emptyCorners.length >= 1) {
        return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    // fill edges
    if (gameBoard[0][1] == '')
        return [0, 1];
    else if (gameBoard[1][0] == '')
        return [1, 0];
    else if (gameBoard[1][2] == '')
        return [1, 2];
    else if (gameBoard[2][1])
        return [2, 1];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameBoard[i][j] == '')
                return [i, j];
        }
    }
    return [-1, -1];
}


let playerSymbol;
let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let playerMoves = [];
let aiMoves = [];
let totalChances = 0;

zeroSelect.addEventListener('click', () => {
    playerSymbol = false;
    pickSide.classList.add('dissolve');
    setTimeout(() => {
        pickSide.style.display = 'none';
    }, 500);
    // added because glitches and gets visible for a fraction of a second
    setTimeout(() => {
        pickSide.classList.remove('dissolve');
    }, 510);
});

crossSelect.addEventListener('click', () => {
    playerSymbol = true;
    pickSide.classList.add('dissolve');
    setTimeout(() => {
        pickSide.style.display = 'none';
    }, 500);
    // added because glitches and gets visible for a fraction of a second
    setTimeout(() => {
        pickSide.classList.remove('dissolve');
    }, 510);
});


function updateBoard() {
    let index = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameBoard[i][j] == '')
            {
                index++;
                continue;
            }
            boxes[index].className = '';
            boxes[index].classList.add(gameBoard[i][j] == 'X' ? 'cross' : 'zero');
            boxes[index].textContent = gameBoard[i][j];
            index++;
        }
    }
}

for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', () => {
        let row = Math.floor(i / 3);
        let column = i % 3;
        if (gameBoard[row][column] == '') {
            gameBoard[row][column] = playerSymbol ? 'X' : 'O';
            playerMoves.push([row, column]);
            totalChances++;
            let winner = checkWinner(gameBoard);
            if (winner[0])
            {
                passStatus.textContent = 'mission passed!';
                passStatus.classList.add('pass');
                respectStatus.textContent = 'respect ++';
                declareWinner.style.display = 'grid';
                passAudio.play();
            }
            if (totalChances < 9) {
                let aiMove = bestPossibleMove(gameBoard, playerSymbol, playerMoves, aiMoves);
                aiMoves.push(aiMove);
                gameBoard[aiMove[0]][aiMove[1]] = playerSymbol ? 'O' : 'X';
                totalChances++;
                let winner = checkWinner(gameBoard);
                if (winner[0])
                {
                    passStatus.textContent = 'mission failed!';
                    passStatus.classList.add('fail');
                    respectStatus.textContent = 'respect --';
                    declareWinner.style.display = 'grid';
                    failAudio.play();
                }
            }
        }
        updateBoard();
    });
}

