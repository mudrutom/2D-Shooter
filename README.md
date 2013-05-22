# 2D Shooter
Published at [http://mudrutom.github.io/2D-Shooter](http://mudrutom.github.io/2D-Shooter) via GitHub Pages.

## Description
As the name suggests 2D Shooter is a 2D action-shooter game where the player needs to
survive multiple waves of enemies. At the beginning of the game the player is located in the
center of a rectangular playground and the waves of enemies are approaching from all edges.
The playground is visible form above as a 2D plane where the player and enemies are moving
(up, down, left and right). The player posses a long-range weapon and can move and shoot
in any direction, the enemies can only attack at close-range if they get near the player. The
player starts with a certain number of hit-points (health), which is decreased by the enemy
attacks, if the number of hit-points reaches zero the game ends. The ultimate goal is to
survive countless waves of enemies as long as possible. Time survived is then saved under
players’ name and can be compared with other players. Note that the game can’t be won, it
will only get harder and harder until the player finally looses all hit-points.

This game has been inspired by a computer game [Crimsonland](http://www.youtube.com/watch?v=XqMCNl1d1Qg).

## Functional requirements
* starting, re-starting and exiting the game
* interaction with the game:
 * moving of the player in the playground (up, down, left and right) using a specified keyboard keys
 * shooting the players’ weapon by a mouse click on the playground in a desired shooting direction
* generating the waves of enemies that will attack the player, where the numbers and difficulty of enemies will increase over time
* events in the game will be accompanied by an appropriate sound effects
* configuration of the game settings
* the player can login into the game
* management of multiple players (create, edit and delete)
* displaying the game statistics and high-scores of players

## Non-functional requirements
* compliance with HTML5 and CSS3 standards
* using the OOP approach in JavaScript code
* source-code documentation with comments
* web-page layout with responsive design
* displaying of 2D graphics in the HTML5 Canvas environment
* ability to use the application offline
* compatibility with modern web browsers

## Implementation notes
This application is purely client-based with no server-side support. The project aims to demonstrate the
capabilities of modern web-browsers and the cutting-edge web technologies HTML5, CSS3 and new JavaScript API.

The game environment itself will be implemented using the HTML5 Canvas and by using
the KineticJS JavaScript library. Other features of the application, such as player management
and game configuration, will be implemented by basic HTML components with some
JavaScript support. User data, like high-scores and player information, will be persisted via
new Web Storage JavaScript API.
