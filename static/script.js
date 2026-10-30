const boardElement = document.getElementById("board");
const fen = boardElement.dataset.fen;
const solution = boardElement.dataset.solution;
const feedback = document.getElementById("feedback");

const pieceSymbols = {
    K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
    k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟"
};

// Convert the FEN into 64 square entries.
const placement = fen.split(" ")[0];
const ranks = placement.split("/");
const squares = [];

for (const rank of ranks) {
    for (const character of rank) {
        if ("12345678".includes(character)) {
            const emptyCount = Number(character);

            for (let n = 0; n < emptyCount; n++) {
                squares.push("");
            }
        } else {
            squares.push(character);
        }
    }
}

let selectedSquare = null;
let selectedElement = null;
let solved = false;

// Draw the board.
for (let i = 0; i < 64; i++) {
    const square = document.createElement("div");
    const row = Math.floor(i / 8);
    const col = i % 8;

    square.classList.add("square");

    if ((row + col) % 2 === 0) {
        square.classList.add("light");
    } else {
        square.classList.add("dark");
    }

    const piece = squares[i];

    if (piece !== "") {
        square.textContent = pieceSymbols[piece];
    }

    const file = "abcdefgh"[col];
    const rank = 8 - row;
    const coordinate = file + rank;

    square.addEventListener("click", function () {
        if (solved) {
            return;
        }

        // First click: select a starting square.
        if (selectedSquare === null) {
            if (square.textContent === "") {
                return;
            }

            selectedSquare = coordinate;
            selectedElement = square;
            square.style.boxShadow = "inset 0 0 0 4px #f5c542";
            feedback.textContent = "Now click the destination square.";
        } else {
            // Clicking the selected square again cancels selection.
            if (coordinate === selectedSquare) {
                selectedElement.style.boxShadow = "";
                selectedSquare = null;
                selectedElement = null;
                feedback.textContent = "";
                return;
            }

            // Second click: check the attempted move.
            const move = selectedSquare + coordinate;

            if (move === solution) {
                square.textContent = selectedElement.textContent;
                selectedElement.textContent = "";

                // Replace a pawn with its promoted piece, if needed.
                if (solution.length === 5) {
                    const promotion = solution[4];
                    const whiteToMove = fen.split(" ")[1] === "w";

                    square.textContent = pieceSymbols[
                        whiteToMove ? promotion.toUpperCase() : promotion
                    ];
                }

                feedback.textContent = "Correct!";
                solved = true;
            } else {
                feedback.textContent = "Try again.";
            }

            selectedElement.style.boxShadow = "";
            selectedSquare = null;
            selectedElement = null;
        }
    });

    boardElement.appendChild(square);
}