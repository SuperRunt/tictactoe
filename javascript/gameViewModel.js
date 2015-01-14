/**
 * Created with RubyMine.
 * By: superrunt
 * Date: 1/12/15
 * Time: 3:53 PM
 */

function GameViewModel () {

    var self = this;

    self.moves = 0;
    self.cells = [];
    // show/hide DOM elements
    self.showSetup = ko.observable(true);
    self.showGame = ko.observable(false);
    self.showAlert = ko.observable(false);
    self.alert = ko.observable(new Alert("", true, ""));
    // board size
    self.cellsWide = ko.roundedIntegerObservable(3);
    self.cellsTotal = ko.computed(function() {
        return Math.pow(self.cellsWide(), 2);
    }, this);
    // Winning scores get calculated based on the size of the grid.
    // Leaving all this 'exploded' for sake of readability. If we were
    // dealing with a huge number of squares, I'd say stuffing it all in
    // one 'for (i = 0; i < gridWidth; i += 1)' loop would make more sense,
    // to avoid looping through several times
    self.winningScores = ko.computed(function() {
        var i, j, winner;
        var gridWidth = self.cellsWide();
        var winners = [];
        // horizontal sums (using formula for sum of geometric series)
        for (i = 0; i < gridWidth; i += 1) {
            winner = -1 * Math.pow(2, i*gridWidth) * (1 - Math.pow(2, gridWidth));
            winners.push(winner);
        }
        // vertical sums
        for (i = 0; i < gridWidth; i += 1) {
            winner = 0;
            for (j=0; j < gridWidth; j += 1) {
                winner += Math.pow(2, i+(j*gridWidth));
            }
            winners.push(winner);
        }
        // diagonal left->right sum
        winner = 0;
        for (i = 0; i < gridWidth; i += 1) {
            winner += Math.pow(2, gridWidth*i + i);
        }
        winners.push(winner);
        // diagonal right->left sum
        winner = 0;
        for (i = 0; i < gridWidth; i += 1) {
            winner += Math.pow(2, (gridWidth-1)*(i+1));
        }
        winners.push(winner);
        console.log(winners);
        return winners;
    }, this);

    self.players = ko.observableArray([
        // TODO: can I access winningScores w something like $parent or dataFor in the Palyer model?
        new Player("Player 1", "X", self.winningScores, self.cellsWide),
        new Player("Player 2", "O", self.winningScores, self.cellsWide)
    ]);

    // X always gets to start
    // TODO: add a coin toss for who starts
    self.turn = self.players()[0];

    self.reloadGame = function () {
        window.location = "";
    };

    // Clear board, set scores back to 0, set turn back to player X, and empty the squares
    self.startGame = function () {
        // in case alerts were shown
        self.showAlert(false);
        self.turn = self.players()[0];
        self.moves = 0;
        var i;
        if ( self.cells.length > 0 ) {
            for (i = 0; i < self.cellsTotal(); i += 1) {
                self.cells[i].element.firstChild.nodeValue = "";
            }
        }
        if ( self.players().length > 0 ) {
            for ( i = 0; i < self.players().length; i += 1) {
                self.players()[i].scores().length = 0;
            }
        }
    };

    // Build game board (it's a table), add cellValue to each td
    // Start new game
    self.play = function () {
        self.showGame(true);
        self.showSetup(false);
        var board = document.createElement("table");
        var cellValue = 1;
        var i, j, row, cell, parent;

        board.border = 2;
        for (i = 0; i < self.cellsWide(); i += 1) {
            row = document.createElement("tr");
            board.appendChild(row);
            for (j = 0; j < self.cellsWide(); j += 1) {
                cell = new BoardCell(cellValue);
                row.appendChild(cell.element);
                self.cells.push(cell);
                // assign binary cell value
                cellValue += cellValue;
            }
        }
        // Attach to element with id 'tictactoe'
        parent = document.getElementById("tictactoe");
        parent.appendChild(board);
        self.startGame();
    };

}