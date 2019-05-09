let game = new Phaser.Game(
    1000,
    624,
    Phaser.AUTO,
    'phaser-example'
);
let scale = new Phaser.ScaleManager(game);

scale.setShowAll();
scale.pageAlignVertically = true;
scale.pageAlignHorizontally = true;
scale.setShowAll();
scale.refresh();

game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Tutorials', Tutorials);
game.state.add('Finish', Finish);

game.state.start('Menu');