Playing around with knockout.js, and becoming a fan in the process.

Real quick about the logic behind the game:
Every cell gets a cellValue = 2^n. I keep track of both player's cellValues in a score array, and as soon as the score
array has a length larger than or equal to the board width (in cells), I start summing sets (equal in number to the board width) of those
scores. I then check if any of those sums are in the winning scores array, that gets calculated when the user enters
a board size.