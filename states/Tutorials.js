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
        let bg = game.add.image(0, 0, 'bg');
        bg.scale.setTo(game.scaleValue);

        let sfx = game.add.image(
            100 * game.scaleValue,
            game.height - 100 * game.scaleValue,
            'sfx'
        );
        sfx.inputEnabled = true;
        sfx.anchor.setTo(0.5, 0.5);
        sfx.scale.setTo(game.scaleValue);

        let menu = game.add.image(
            game.width - 100 * game.scaleValue,
            game.height - 100 * game.scaleValue,
            'menu'
        );
        menu.inputEnabled = true;
        menu.anchor.setTo(0.5, 0.5);
        menu.scale.setTo(game.scaleValue);

        let tut1 = game.add.image(
            20 * game.scaleValue,
            20 * game.scaleValue,
            'tut-1'
        );
        tut1.scale.setTo(game.scaleValue);
        let tut2 = game.add.image(
            game.world.centerX + 20 * game.scaleValue,
            20 * game.scaleValue,
            'tut-2'
        );
        tut2.scale.setTo(game.scaleValue);
        let tut3 = game.add.image(
            20 * game.scaleValue,
            220 * game.scaleValue,
            'tut-3'
        );
        tut3.scale.setTo(game.scaleValue);
        let tut4 = game.add.image(
            game.world.centerX + 20 * game.scaleValue,
            220 * game.scaleValue,
            'tut-4'
        );
        tut4.scale.setTo(game.scaleValue);
        let tut5 = game.add.image(
            200 * game.scaleValue,
            420 * game.scaleValue,
            'tut-5'
        );
        tut5.scale.setTo(game.scaleValue);

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

    hover: function (item) {
        item.scale.setTo(1.1 * game.scaleValue);
        item.events.onInputOut.add((item) => {
            item.scale.setTo(1 * game.scaleValue);
        }, this)
    },
};