/**
 * Created with RubyMine.
 * By: superrunt
 * Date: 1/12/15
 * Time: 3:51 PM
 */

function Player(name, token, winningScores, gridSize) {
    var self = this;
    self.name = name;
    self.scores = ko.observableArray([]);
    self.token = token;
    self.winningScores = winningScores;
    self.gridSize = gridSize;

    // helper method for getting all possible combos, if more scores
    // than the grid width
    self.combine = function(arr, min) {
        console.log("combine");
        var fn = function(n, src, got, all) {
            if (n == 0) {
                if (got.length > 0) {
                    all[all.length] = got;
                }
                return;
            }
            for (var j = 0; j < src.length; j++) {
                fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
            }
            return;
        }
        var all = [];
        for (var i = min; i < arr.length; i++) {
            fn(i, arr, [], all);
        }
        all.push(arr);
        console.log(all);
        return all;
    }

    // Check if current score is a winner
    self.isWinningScore = function () {
        console.log(self.scores().length === self.gridSize());
        console.log(typeof self.gridSize());
        console.log(typeof self.scores().length);

        if ( self.scores().length < self.gridSize() )  return;

        // if number of scores collected is equal to grid width
        // we can just sum up the current scores array and check
        // if it's in the array of possible winner scores
        if ( self.scores().length === self.gridSize() ) {
            var score = self.scores().reduce(function(a, b) {
                return a + b;
            });
            return self.winningScores().indexOf(score) !== -1;
            // if number of scores is larger we gotta sum up all possible
            // combos of number sets of size equal to grid width
        } else if ( self.scores().length > self.gridSize() ) {
            var scoreArrays = self.combine(self.scores(), self.gridSize());
            for (var j = 0; j < scoreArrays.length; j++) {
                var score = 0;
                score = scoreArrays[j].reduce(function(a, b) {
                    return a + b;
                });
                if ( self.winningScores().indexOf(score) !== -1 ) {
                    return true;
                }
            }
        }
    };
}

function BoardCell (cellValue) {
    var self = this;

    // handle click on cell
    self.set = function ( ) {
        if (this.firstChild.nodeValue !== "") return;

        // access GameViewModel
        var gameView = ko.dataFor(this);

        this.firstChild.nodeValue = gameView.turn.token;

        gameView.moves += 1;
        gameView.turn.scores().push(this.cellValue);
        if (gameView.turn.isWinningScore()) {
            gameView.alert(new Alert(gameView.turn.name + " wins! Play another game?", true,
                [
                    { text: "Yes, please!", action: gameView.startGame },
                    { text: "Yes, but reload settings", action: gameView.reloadGame },
                    { text: "No thanks", action: function () { gameView.showAlert(false); } }
                ]));
            gameView.showAlert(true);
        } else if (gameView.moves === gameView.cells.length) {
            gameView.alert(new Alert("It's a tie! Play another game?", false,
                [
                    { text: "Yes, please!", action: gameView.startGame },
                    { text: "Yes, but reload settings", action: gameView.reloadGame },
                    { text: "No thanks", action: function () { gameView.showAlert(false); } }
                ]));
            gameView.showAlert(true);
        } else {
            gameView.turn = (gameView.turn == gameView.players()[0]) ? gameView.players()[1] : gameView.players()[0];
            // TODO: add indicator in UI for who's turn it is
        }
    };

    // create cell
    self.element = document.createElement("td");
    self.element.cellValue = cellValue;
    self.element.width = self.element.height = 50;
    self.element.align = self.element.valign = 'center';
    self.element.onclick = self.set;
    self.element.appendChild(document.createTextNode(""));
}

// UI messages
function Alert (message, isSuccess, buttons) {
    // button = { text: "", action: someFunc }
    var self = this;
    self.message = message;
    self.isSuccess = isSuccess;
    self.buttons = buttons;
}