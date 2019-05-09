let Finish = function (game) {};

Finish.prototype = {
    preload: function () {
        game.load.image('bg', 'images/backgrounds/background.jpg');
        game.load.image('donut', 'images/donut.png');
        game.load.image('donut-shadow', 'images/big-shadow.png');
        game.load.image('timeup', 'images/text-timeup.png');
        game.load.image('victory', 'images/victory.png');
        game.load.image('lose', 'images/lose.png');
        game.load.image('sfx', 'images/btn-sfx.png');
        game.load.image('menu', 'images/menu.png');
        game.load.image('play', 'images/btn-play.png');

        game.load.audio('bg-audio', 'audio/background.mp3');
    },

    create: function () {
        game.add.image(0, 0, 'bg');

        let donut_shadow = game.add.image(game.world.centerX + 10, game.world.centerY + 10, 'donut-shadow');
        donut_shadow.anchor.setTo(0.5, 0.5);

        let donut = game.add.image(game.world.centerX, game.world.centerY, 'donut');
        donut.anchor.setTo(0.5, 0.5);

        let timeup = game.add.image(game.world.centerX, game.world.centerY - 220, 'timeup');
        timeup.anchor.setTo(0.5, 0.5);

        if (game.score >= 500) {
            let victory = game.add.image(game.world.centerX, game.world.centerY - 20, 'victory');
            victory.anchor.setTo(0.5, 0.5);
        } else {
            let lose = game.add.image(game.world.centerX, game.world.centerY - 20, 'lose');
            lose.anchor.setTo(0.5, 0.5);
        }

        let play = game.add.image(game.world.centerX, game.world.centerY + 200, 'play');
        play.inputEnabled = true;
        play.anchor.setTo(0.5, 0.5);

        let sfx = game.add.image(100, game.height - 100, 'sfx');
        sfx.inputEnabled = true;
        sfx.anchor.setTo(0.5, 0.5);

        let menu = game.add.image(game.width - 100, game.height - 100, 'menu');
        menu.inputEnabled = true;
        menu.anchor.setTo(0.5, 0.5);

        sfx.events.onInputOver.add(this.hover, this);
        sfx.events.onInputDown.add(function () {
            game.soundOn = !game.soundOn
        }, this);

        menu.events.onInputOver.add(this.hover, this);
        menu.events.onInputDown.add(function () {
            game.state.start('Menu')
        }, this);
        play.events.onInputOver.add(this.hover, this);

        play.events.onInputDown.add(function () {
            game.state.start('Game')
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