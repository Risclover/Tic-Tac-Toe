# Tic-Tac-Toe
 
## Table of Contents
- [Tic-Tac-Toe](#tic-tac-toe)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Updates](#updates)
  - [How to Play](#how-to-play)
    - [Quick Start](#quick-start)
    - [Custom Game](#custom-game)
    - [How to Play](#how-to-play-1)
    - [Using Custom Markers](#using-custom-markers)
  - [Build](#build)
  - [Links](#links)

## Description
[Back to Top](#table-of-contents)

This is the classic game Tic Tac Toe played with two players on a single computer. Play a single round or as many rounds as you want; the player with the highest score wins!


## Updates
[Back to Top](#table-of-contents)



## How to Play
[Back to Top](#table-of-contents)

### Quick Start
Click the "Start Game" button at the bottom of the form without filling any details out if you want to start a quick game. 

Doing so will start a game with the following details:

* Player 1: X
* Player 2: O
* Rounds: 1

### Custom Game

Fill in form elements for any settings you wish to customize.

1. Fill in each player's name. Leaving these fields blank will result in the players being called "Player 1" and "Player 2".
   
2. Enter how many rounds you'd like to play. Leaving this dropdown menu blank will result in a 1-round game.
   * **Single Round**: Play a 1-round game.
   * **Pick Rounds**: Decide how many rounds you want to play. Input this number into the input box that appears after making this selection.
   * **Ongoing Rounds**: Play up to the maximum amount of rounds possible (9,007,199,254,740,991 rounds). Click the "Stop Game" button whenever you decide you're done.
  
3. Pick your markers. Leaving this blank will result in Player 1 playing X's and Player 2 playing O's.
   * **Classic (X's and O's)**: Use the classic X and O markers. Decide who gets what.
   * **Custom**: Pick unique markers via the Fontawesome icons collection. (For more detail on how to do this, refer to the [Using Custom Markers](#using-custom-markers) section.)


### How to Play
1. Once the game begins, players will click on squares to set their markers.
2. The first player to get 3 in a row in any direction wins.
3. Make sure that you watch the top area to see who's turn it is. 
  - First round: Whomever chose X goes first. If you're using custom markers, or if you didn't choose any markers, then Player 1 will go first.
  - Subsequent rounds: Players will alternate going first each round.
4. If you fill the board with markers and nobody gets 3 in a row, this will result in a draw. If you're playing a designated number of rounds, note that this *will* count as a round played.
5. The game ends in the following circumstances:
   - 1 Round: When a player gets 3 in a row or when players tie.
   - Picked Rounds: When the number of rounds have been played, the player with the highest score wins.
   - Ongoing Rounds: Goes on infinitely, or until the "Stop Game" button is pressed.
6. If, when the game ends, players have identical scores, the game will offer a tiebreaker round. Please note that this is 100% optional. 
   - Whoever wins the tiebreaker round wins.
   - If players get another tie, additional tiebreaker rounds will continue to be offered until someone scores a point.

### Using Custom Markers
You have the option of using custom markers if you want. This game uses the Fontawesome library of icons to accomplish this. Simply follow these instructions.

1. Select the "Custom" option in the "Game pieces" dropdown menu. Doing so will make two new input boxes appear (one for each player's marker).
2. Go to the Fontawesome website at https://www.fontawesome.com/.
3. Click 'Icons' in the top bar.
4. Make sure that the version is set to the latest.
5. Use the filters to search for free icons only. **Pro icons will NOT work.**
6. When you find an icon, click on it. This will make a window pop up.
7. You should see a code snippet in the following format. Click on it to copy it to your clipboard (or copy it another way).

    ```html
    <i class="fa-small fa-cactus"></i>
    ```
8. Paste the code snippet into the appropriate player's custom marker input box.

As long as the version number is correct, and as long as you use a free icon, this should 100% work!


## Build
[Back to Top](#table-of-contents)

## Links
[Back to Top](#table-of-contents)
