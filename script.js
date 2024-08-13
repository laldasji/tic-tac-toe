const pickSide = document.querySelector('#pickSide');
let zeroSelect = pickSide.querySelector('#zero');
let crossSelect = pickSide.querySelector('#cross');
const declareWinner = document.querySelector('#declareWinner');
let boxes = document.querySelectorAll('.box');
const passStatus = declareWinner.querySelector('#passStatus');
const respectStatus = declareWinner.querySelector('#respectStatus');
const passAudio = document.querySelector('#missionPassed');
const failAudio = document.querySelector('#missionFailed');
let playAgain = document.querySelector('#playAgain');
const gameGrid = document.querySelector('#gameGrid');


passAudio.addEventListener('ended', () => {
    passAudio.currentTime = 0;
});

failAudio.addEventListener('ended', () => {
    failAudio.currentTime = 0;
});

(function gameLoop() {
    let playerSymbol;
    let gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    let playerMoves = [];
    let aiMoves = [];
    let totalChances = 0;
    let isPlayerMove = true;

    zeroSelect.addEventListener('click', () => {
        playerSymbol = false;
        isPlayerMove = false;
        pickSide.classList.add('dissolve');
        setTimeout(() => {
            pickSide.style.display = 'none';
        }, 500);
        // added because glitches and gets visible for a fraction of a second
        setTimeout(() => {
            pickSide.classList.remove('dissolve');
            makeAIPlay();
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

    function resetGame()
    {
        // clear all event listeners from boxes
        boxes.forEach((box) => {
            let newElement = box.cloneNode(true);
            newElement.className = 'box boxDarken';
            newElement.textContent = '';
            gameGrid.replaceChild(newElement, box);
        });
        boxes = document.querySelectorAll('.box');

        // clear event listener from playAgain button
        let newElement = playAgain.cloneNode(true);
        declareWinner.replaceChild(newElement, playAgain);
        playAgain = document.querySelector('#playAgain');

        // clear the mark selection event listeners
        let newCross = crossSelect.cloneNode(true);
        let newZero = zeroSelect.cloneNode(true);
        pickSide.replaceChild(newCross, crossSelect);
        pickSide.replaceChild(newZero, zeroSelect);
        crossSelect = pickSide.querySelector('#cross');
        zeroSelect = pickSide.querySelector('#zero');

        // set visibility to initial visibility
        declareWinner.style.display = 'none';
        pickSide.style.display = 'grid';
        gameLoop();
    }

    function checkIfNextWinningMove(checkForSymbol) {
        // console.log(`Checking for: ${checkForSymbol}`)
        // Check rows, columns, and diagonals for a winning move
        for (let i = 0; i < 3; i++) {
            // Check rows
            if (gameBoard[i][0] === '' && gameBoard[i][1] === checkForSymbol && gameBoard[i][2] === checkForSymbol) {
                // console.log([true, i, 0]);
                return [true, i, 0];
            }
            if (gameBoard[i][0] === checkForSymbol && gameBoard[i][1] === '' && gameBoard[i][2] === checkForSymbol) {
                // console.log([true, i, 1]);
                return [true, i, 1];
            }
            if (gameBoard[i][0] === checkForSymbol && gameBoard[i][1] === checkForSymbol && gameBoard[i][2] === '') {
                // console.log([true, i, 2]);
                return [true, i, 2];
            }

            // Check columns
            if (gameBoard[0][i] === '' && gameBoard[1][i] === checkForSymbol && gameBoard[2][i] === checkForSymbol) {
                // console.log([true, 0, i]);
                return [true, 0, i];
            }
            if (gameBoard[0][i] === checkForSymbol && gameBoard[1][i] === '' && gameBoard[2][i] === checkForSymbol) {
                // console.log([true, 1, i]);
                return [true, 1, i];
            }
            if (gameBoard[0][i] === checkForSymbol && gameBoard[1][i] === checkForSymbol && gameBoard[2][i] === '') {
                // console.log([true, 2, i]);
                return [true, 2, i];
            }
        }

        // Check diagonals
        if (gameBoard[0][0] === '' && gameBoard[1][1] === checkForSymbol && gameBoard[2][2] === checkForSymbol) {
            // console.log([true, 0, 0]);
            return [true, 0, 0];
        }
        if (gameBoard[0][0] === checkForSymbol && gameBoard[1][1] === '' && gameBoard[2][2] === checkForSymbol) {
            // console.log([true, 1, 1]);
            return [true, 1, 1];
        }
        if (gameBoard[0][0] === checkForSymbol && gameBoard[1][1] === checkForSymbol && gameBoard[2][2] === '') {
            // console.log([true, 2, 2]);
            return [true, 2, 2];
        }

        if (gameBoard[0][2] === '' && gameBoard[1][1] === checkForSymbol && gameBoard[2][0] === checkForSymbol) {
            // console.log([true, 0, 2]);
            return [true, 0, 2];
        }
        if (gameBoard[0][2] === checkForSymbol && gameBoard[1][1] === '' && gameBoard[2][0] === checkForSymbol) {
            // console.log([true, 1, 1]);
            return [true, 1, 1];
        }
        if (gameBoard[0][2] === checkForSymbol && gameBoard[1][1] === checkForSymbol && gameBoard[2][0] === '') {
            // console.log([true, 2, 0]);
            return [true, 2, 0];
        }
        // console.log('none');
        return [false, -1, -1];
    }

    function checkWinner() {
        // true if any winner, true if x wins, false if O wins
        function isWinningLine(a, b, c) {
            return a !== '' && a === b && a === c;
        }

        // Check rows
        for (let i = 0; i < 3; i++) {
            if (isWinningLine(gameBoard[i][0], gameBoard[i][1], gameBoard[i][2])) {
                return true;
            }
        }

        // Check columns
        for (let i = 0; i < 3; i++) {
            if (isWinningLine(gameBoard[0][i], gameBoard[1][i], gameBoard[2][i])) {
                return true;
            }
        }

        // Check diagonals
        if (isWinningLine(gameBoard[0][0], gameBoard[1][1], gameBoard[2][2])) {
            return true;
        }
        if (isWinningLine(gameBoard[0][2], gameBoard[1][1], gameBoard[2][0])) {
            return true;
        }

        // No winner
        return false;
    }

    function bestPossibleMove() {
        // check if AI has winning move!
        if (aiMoves.length >= 2) {
            let canWin = checkIfNextWinningMove(playerSymbol ? 'O' : 'X');
            if (canWin[0])
                return [canWin[1], canWin[2]];
        }
        // if can't win, block opponent!
        if (playerMoves.length >= 2) {
            // returns [bool, row, column]
            let aboutToWin = checkIfNextWinningMove(playerSymbol ? 'X' : 'O');
            if (aboutToWin[0])
                return [aboutToWin[1], aboutToWin[2]];

        }
        // first fill center
        if (gameBoard[1][1] == '')
            return [1, 1];

        // else fill corners
        const corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
        const edges = [[0,1],[1,0],[1,2],[2,1]];
        let filledEdges = [];
        const correspondingCorners = [[2,0],[2,2],[0,0],[0,2]];
        let emptyCorners = [];
        let filledCorners = [];
        for (let i = 0; i < corners.length; i++) {
            if (gameBoard[corners[i][0]][corners[i][1]] == '')
                emptyCorners.push(corners[i]);
            else
                filledCorners.push(corners[i]);
            if (gameBoard[edges[i][0]][edges[i][1]])
                filledEdges.push(i);
        }

        // case 1: all corners empty
        if (emptyCorners.length == 4) {
            // case 1.1: if one edge is filled
            if (filledEdges.length == 1)
                return correspondingCorners[filledEdges[0]];
            // else return random corner
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

    function declareWin(playerWins) {
        if (playerWins) {
            passStatus.textContent = 'mission passed!';
            passStatus.className = 'pass';
            respectStatus.textContent = 'respect ++';
            declareWinner.style.display = 'grid';
            passAudio.play();
        }
        else {
            passStatus.textContent = 'mission failed!';
            passStatus.className = 'fail';
            respectStatus.textContent = 'respect --';
            declareWinner.style.display = 'grid';
            failAudio.play();
        }
    }

    function declareDraw() {
        passStatus.textContent = 'draw!';
        passStatus.className = 'draw';
        respectStatus.textContent = 'Good Game!';
        declareWinner.style.display = 'grid';
        passAudio.play();
    }

    function makeAIPlay() {
        let aiMove = bestPossibleMove(gameBoard, playerSymbol, playerMoves, aiMoves);
        aiMoves.push(aiMove);
        gameBoard[aiMove[0]][aiMove[1]] = playerSymbol ? 'O' : 'X';
        totalChances++;
        boxes[aiMove[0] * 3 + aiMove[1]].textContent = playerSymbol ? 'O' : 'X';
        boxes[aiMove[0] * 3 + aiMove[1]].classList.add(playerSymbol ? 'zero' : 'cross', 'fadeIn');
        boxes[aiMove[0] * 3 + aiMove[1]].classList.toggle('boxDarken');
        // true means AI wins
        setTimeout(() => {
            boxes[aiMove[0] * 3 + aiMove[1]].classList.toggle('fadeIn');
            let winner = checkWinner(gameBoard);
            if (winner)
                declareWin(false);
            else if (totalChances == 9)
                declareDraw();
            else
                isPlayerMove = true;
        }, 500);
    }

    playAgain.addEventListener('click', resetGame);

    for (let i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener('click', () => {
            let row = Math.floor(i / 3);
            let column = i % 3;
            if (isPlayerMove && gameBoard[row][column] == '') {
                gameBoard[row][column] = playerSymbol ? 'X' : 'O';
                playerMoves.push([row, column]);
                totalChances++;
                isPlayerMove = false;
                boxes[row * 3 + column].textContent = playerSymbol ? 'X' : 'O';
                boxes[row * 3 + column].classList.add(playerSymbol ? 'cross' : 'zero', 'fadeIn');
                boxes[row * 3 + column].classList.toggle('boxDarken');
                // true means player wins
                setTimeout(() => {
                    boxes[row * 3 + column].classList.toggle('fadeIn');
                    let winner = checkWinner(gameBoard);
                    if (winner)
                        declareWin(true);
                    else if (totalChances == 9)
                        declareDraw();
                    else
                        makeAIPlay();
                }, 500);
            }
        });
}})();