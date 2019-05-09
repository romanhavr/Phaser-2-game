let Menu = function (game) {
    game.soundOn = true
};

Menu.prototype = {
    preload: function () {
        game.load.image('bg', 'images/backgrounds/background.jpg');
        game.load.image('donut', 'images/donut.png');
        game.load.image('donut-shadow', 'images/big-shadow.png');
        game.load.image('logo', 'images/donuts_logo.png');
        game.load.image('sfx', 'images/btn-sfx.png');
        game.load.image('play', 'images/btn-play.png');

        game.load.audio('bg-audio', 'audio/background.mp3');
    },

    create: function () {
        game.add.image(0, 0, 'bg');

        let donut_shadow = game.add.image(game.world.centerX + 10, game.world.centerY + 10, 'donut-shadow');
        donut_shadow.anchor.setTo(0.5, 0.5);

        let donut = game.add.image(game.world.centerX, game.world.centerY, 'donut');
        donut.anchor.setTo(0.5, 0.5);

        let logo = game.add.image(game.world.centerX, game.world.centerY - 180, 'logo');
        logo.anchor.setTo(0.5, 0.5);

        let play = game.add.image(game.world.centerX, game.world.centerY + 165, 'play');
        play.inputEnabled = true;
        play.anchor.setTo(0.5, 0.5);

        let sfx = game.add.image(100, game.height - 100, 'sfx');
        sfx.inputEnabled = true;
        sfx.anchor.setTo(0.5, 0.5);
        sfx.events.onInputOver.add(this.hover, this);
        sfx.events.onInputDown.add(function () {
            game.soundOn = !game.soundOn
        }, this);

        let font = "40px Comic Sans MS";
        let tutorials = game.add.text(
            game.width - 20,
            game.height - 60,
            'TUTORIALS', {
                font: font,
                fill: "#fff"
            }
        );
        tutorials.inputEnabled = true;
        tutorials.anchor.setTo(1, 1);
        tutorials.setShadow(1, 1, 'rgba(0,0,0,0.9)', 15);

        play.events.onInputOver.add(this.hover, this);
        tutorials.events.onInputOver.add(this.hover, this);

        play.events.onInputDown.add(function () {
            game.state.start('Game')
        }, this);
        tutorials.events.onInputDown.add(function () {
            game.state.start('Tutorials')
        }, this);

        if (!game.bgAudio) {
            game.bgAudio = game.sound.add('bg-audio');
            game.bgAudio.loop = true;
            if (!game.bgAudio.isPlaying) {
                game.bgAudio.play()
            }
        }
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