/**
 * Created with RubyMine.
 * By: superrunt
 * Date: 1/10/15
 * Time: 9:01 PM
 */

(function () {
    // set up all the game
    var loadGame = function () {

         ko.applyBindings(new GameViewModel());

         // input fields should clear on focus
         $("input").on('focus', function () {
             this.value = "";
         });
    }

    /*
     * Add the play function to the list of load events.
     */
    if (typeof window.onload === "function") {
        var oldOnLoad = window.onload;
        window.onload = function () {
            oldOnLoad();
            loadGame();
        };
    } else {
        window.onload = loadGame();
    }
}());
