const defaultScale = 1.6;
let windowScale = window.innerWidth / window.innerHeight;

let gameWidth,
    gameHeight;

if (windowScale >= defaultScale) {
  gameWidth = window.innerHeight * defaultScale;
  gameHeight = '100%'
}else {
  gameWidth = '100%';
  gameHeight = window.innerWidth / defaultScale
};

let game = new Phaser.Game(
  gameWidth,
  gameHeight,
    Phaser.CANVAS,
    '',
    'phaser-example'
);

if (windowScale >= defaultScale) {
  game.scaleValue = window.innerHeight / 624
}else {
  game.scaleValue = window.innerWidth / 1000
};

game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Tutorials', Tutorials);
game.state.add('Finish', Finish);

game.state.start('Menu');