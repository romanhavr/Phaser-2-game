let Tutorials = function(game) {};

Tutorials.prototype = {
    preload: function () {
        game.load.image('bg', 'images/backgrounds/background.jpg');
        game.load.image('sfx', 'images/btn-sfx.png');
        game.load.image('menu', 'images/menu.png');
        game.load.image('tut-1', 'images/tutorials/tut-1.png');
        game.load.image('tut-2', 'images/tutorials/tut-2.png');
        game.load.image('tut-3', 'images/tutorials/tut-3.png');
        game.load.image('tut-4', 'images/tutorials/tut-4.png');
        game.load.image('tut-5', 'images/tutorials/tut-5.png');

        game.load.audio('bg-audio', 'audio/background.mp3');
    },

    create: function () {
        game.add.image(0, 0, 'bg');

        let sfx = game.add.image(100, game.height - 100, 'sfx');
        sfx.inputEnabled = true;
        sfx.anchor.setTo(0.5, 0.5);

        let menu = game.add.image(game.width - 100, game.height - 100, 'menu');
        menu.inputEnabled = true;
        menu.anchor.setTo(0.5, 0.5);

        game.add.image(20, 20, 'tut-1');
        game.add.image(game.world.centerX + 20, 20, 'tut-2');
        game.add.image(20, 220, 'tut-3');
        game.add.image(game.world.centerX + 20, 220, 'tut-4');
        game.add.image(200, 420, 'tut-5');

        sfx.events.onInputOver.add(this.hover, this);
        sfx.events.onInputDown.add(function () {
            game.soundOn = !game.soundOn
        }, this);

        menu.events.onInputOver.add(this.hover, this);
        menu.events.onInputDown.add(function () {
            game.state.start('Menu')
        }, this);
        
        if (!game.bgAudio) {
            game.bgAudio = game.sound.add('bg-audio');
            game.bgAudio.loop = true;
            if (!game.bgAudio.isPlaying) {
                game.bgAudio.play()
            }
        };
    },

    update: function () {
        if (game.soundOn) {
            game.bgAudio.resume()
        } else {
            game.bgAudio.pause()
        };
    },

    hover: function (item, pointer) {
        item.scale.setTo(1.1);
        item.events.onInputOut.add((item) => {
            item.scale.setTo(1);
        }, this)
    },
};