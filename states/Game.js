let Game = function (game) {
    game.tileGrid = [];
    game.n = 5;
    game.dx = 85;
    game.dy = 80
};

Game.prototype = {
    preload: function () {
        game.load.image('bg', 'images/backgrounds/background.jpg');
        game.load.image('bg-score', 'images/bg-score.png');
        game.load.image('time', 'images/time.png');
        game.load.image('sfx', 'images/btn-sfx.png');
        game.load.image('menu', 'images/menu.png');

        game.load.image('gem01', 'images/game/gem-01.png');
        game.load.image('gem02', 'images/game/gem-02.png');
        game.load.image('gem03', 'images/game/gem-03.png');
        game.load.image('gem04', 'images/game/gem-04.png');
        game.load.image('gem05', 'images/game/gem-05.png');
        game.load.image('gem06', 'images/game/gem-06.png');
        game.load.image('gem07', 'images/game/gem-07.png');
        game.load.image('gem08', 'images/game/gem-08.png');
        game.load.image('gem09', 'images/game/gem-09.png');
        game.load.image('gem10', 'images/game/gem-10.png');
        game.load.image('gem11', 'images/game/gem-11.png');
        game.load.image('gem12', 'images/game/gem-12.png');

        game.load.image('particle', 'images/particles/particle_ex1.png');

        game.load.audio('bg-audio', 'audio/background.mp3');
        game.load.audio('swap-audio', 'audio/select-7.mp3');
        game.load.audio('drop-audio', 'audio/select-1.mp3');
        game.load.audio('kill-audio', 'audio/kill.mp3');
    },

    create: function () {
        game.add.image(0, 0, 'bg');
        game.add.image(610, 65, 'bg-score');
        game.add.image(610, 250, 'time');

        let sfx = game.add.image(695, 520, 'sfx');
        sfx.inputEnabled = true;
        sfx.anchor.setTo(0.5, 0.5);

        let menu = game.add.image(895, 520, 'menu');
        menu.inputEnabled = true;
        menu.anchor.setTo(0.5, 0.5);

        sfx.events.onInputOver.add(this.hover, this);
        sfx.events.onInputDown.add(function () {
            game.soundOn = !game.soundOn
        }, this);

        menu.events.onInputOver.add(this.hover, this);
        menu.events.onInputDown.add(function () {
            game.state.start('Menu');
            if (game.interval) {
                clearInterval(game.interval)
            }
        }, this);

        game.tileTypes = [
            'gem01', 'gem02', 'gem03',
            'gem04', 'gem05', 'gem06'
        ];

        game.bonusTileTypes = [
            'gem07', 'gem08', 'gem09',
            'gem10', 'gem11', 'gem12'
        ];

        game.score = 0;
        this.createScoreAndTimer();

        game.activeTile1 = null;
        game.activeTile2 = null;
        game.horizontalMatch = false;
        game.verticalMatch = false;

        game.canMove = false;

        game.tileWidth = game.cache.getImage('gem01').width;
        game.tileHeight = game.cache.getImage('gem01').height;

        game.tiles = game.add.group();

        for (let i = 0; i < game.n; i++) {
            game.tileGrid[i] = [];
            for (let j = 0; j < game.n; j++) {
                game.tileGrid[i][j] = null
            }
        };

        if (!game.bgAudio) {
            game.bgAudio = game.sound.add('bg-audio');
            game.bgAudio.loop = true;
            if (!game.bgAudio.isPlaying) {
                game.bgAudio.play()
            }
        };
        game.swapAudio = game.sound.add('swap-audio');
        game.dropAudio = game.sound.add('drop-audio');
        game.killAudio = game.sound.add('kill-audio');

        this.initTiles();
    },

    update: function () {
        if (game.activeTile1 && !game.activeTile2) {
            let hoverX = game.input.x;
            let hoverY = game.input.y;

            let hoverPosX = Math.floor(hoverX / game.tileWidth) - 1;
            let hoverPosY = Math.floor(hoverY / game.tileHeight) - 1;

            let difX = (hoverPosX - game.startPosX);
            let difY = (hoverPosY - game.startPosY);

            if (!(hoverPosY > game.tileGrid[0].length - 1 || hoverPosY < 0) &&
                !(hoverPosX > game.tileGrid.length - 1 || hoverPosX < 0)) {
                if ((Math.abs(difY) == 1 && difX == 0) ||
                    (Math.abs(difX) == 1 && difY == 0)) {
                    game.canMove = false;

                    game.activeTile2 = game.tileGrid[hoverPosX][hoverPosY];
                    game.activeTile2.scale.setTo(1.05);

                    this.swapTiles();

                    game.time.events.add(600, function () {
                        this.checkMatch();
                    }, this);
                }
            }
        };

        if (game.soundOn) {
            game.bgAudio.resume()
        } else {
            game.bgAudio.pause()
        }
    },

    initTiles: function () {
        for (let i = 0; i < game.tileGrid.length; i++) {
            for (let j = 0; j < game.tileGrid.length; j++) {
                let tile = this.addTile(i, j);
                game.tileGrid[i][j] = tile;
            }
        };

        if (game.soundOn) {
            game.dropAudio.play()
        };

        game.time.events.add(600, function () {
            this.checkMatch();
        }, this)
    },

    addTile: function (x, y, key) {

        let tileToAdd = (key) ?
            key :
            game.tileTypes[Math.floor(Math.random() * (game.tileTypes.length - 1))];

        let tile = game.tiles.create((x * game.tileWidth) + (game.dx + game.tileWidth / 2), 0, tileToAdd);

        if (key) {
            game.tileGrid[x][y] = tile
        };

        game.add.tween(tile).to({
            y: y * game.tileHeight + (game.dy + game.tileHeight / 2)
        }, 500, Phaser.Easing.Linear.In, true);

        tile.anchor.setTo(0.5, 0.5);

        tile.inputEnabled = true;

        tile.tileType = tileToAdd;

        tile.events.onInputDown.add(this.tileDown, this);

        return tile;
    },

    tileDown: function (tile, pointer) {
        if (game.canMove) {
            game.activeTile1 = tile;
            game.activeTile1.scale.setTo(1.05);

            game.startPosX = (tile.x - (game.dx + game.tileWidth / 2)) / game.tileWidth;
            game.startPosY = (tile.y - (game.dy + game.tileHeight / 2)) / game.tileHeight;
        }
    },

    swapTiles: function () {
        if (game.activeTile1 && game.activeTile2) {

            let tile1Pos = {
                x: (game.activeTile1.x - (game.dx + game.tileWidth / 2)) / game.tileWidth,
                y: (game.activeTile1.y - (game.dy + game.tileHeight / 2)) / game.tileHeight
            };
            let tile2Pos = {
                x: (game.activeTile2.x - (game.dx + game.tileWidth / 2)) / game.tileWidth,
                y: (game.activeTile2.y - (game.dy + game.tileHeight / 2)) / game.tileHeight
            };

            game.tileGrid[tile1Pos.x][tile1Pos.y] = game.activeTile2;
            game.tileGrid[tile2Pos.x][tile2Pos.y] = game.activeTile1;

            game.add.tween(game.activeTile1).to({
                x: tile2Pos.x * game.tileWidth + (game.dx + game.tileWidth / 2),
                y: tile2Pos.y * game.tileHeight + (game.dy + game.tileHeight / 2)
            }, 200, Phaser.Easing.Linear.In, true);
            game.add.tween(game.activeTile2).to({
                x: tile1Pos.x * game.tileWidth + (game.dx + game.tileWidth / 2),
                y: tile1Pos.y * game.tileHeight + (game.dy + game.tileHeight / 2)
            }, 200, Phaser.Easing.Linear.In, true);

            game.activeTile1 = game.tileGrid[tile1Pos.x][tile1Pos.y];
            game.activeTile2 = game.tileGrid[tile2Pos.x][tile2Pos.y];

            if (game.soundOn) {
                game.swapAudio.play()
            }
        }
    },

    checkMatch: function () {
        let matches = this.getMatches(game.tileGrid);

        if (matches.length > 0) {
            this.removeTileGroup(matches);

            this.resetTile();

            this.fillTile();

            game.time.events.add(400, function () {
                this.tileUp();
            }, this);

            game.time.events.add(600, function () {
                this.checkMatch();
            }, this)
        } else {
            this.swapTiles();
            game.time.events.add(400, function () {
                this.tileUp();
                game.canMove = true
            }, this);
        }
    },

    tileUp: function () {
        if (game.activeTile1) {
            game.activeTile1.scale.setTo(1)
        };
        if (game.activeTile2) {
            game.activeTile2.scale.setTo(1)
        };

        game.activeTile1 = null;
        game.activeTile2 = null
    },

    getMatches: function (tileGrid) {

        let matches = [];
        let groups = [];

        for (let i = 0; i < tileGrid.length; i++) {
            let tempArr = tileGrid[i];
            groups = [];
            for (let j = 0; j < tempArr.length; j++) {
                if (j < tempArr.length - 2) {
                    if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2]) {
                        if (tileGrid[i][j].tileType == tileGrid[i][j + 1].tileType &&
                            tileGrid[i][j + 1].tileType == tileGrid[i][j + 2].tileType) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[i][j]) == -1) {
                                    matches.push(groups);
                                    groups = [];
                                }
                            };

                            if (groups.indexOf(tileGrid[i][j]) == -1) {
                                groups.push(tileGrid[i][j]);
                            };
                            if (groups.indexOf(tileGrid[i][j + 1]) == -1) {
                                groups.push(tileGrid[i][j + 1]);
                            };
                            if (groups.indexOf(tileGrid[i][j + 2]) == -1) {
                                groups.push(tileGrid[i][j + 2]);
                            }
                        }
                    }
                }
            };
            if (groups.length > 0) {
                matches.push(groups)
            }
        };

        for (j = 0; j < tileGrid.length; j++) {
            let tempArr = tileGrid[j];
            groups = [];
            for (i = 0; i < tempArr.length; i++) {
                if (i < tempArr.length - 2)
                    if (tileGrid[i][j] && tileGrid[i + 1][j] && tileGrid[i + 2][j]) {
                        if (tileGrid[i][j].tileType == tileGrid[i + 1][j].tileType &&
                            tileGrid[i + 1][j].tileType == tileGrid[i + 2][j].tileType) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[i][j]) == -1) {
                                    matches.push(groups);
                                    groups = [];
                                }
                            };

                            if (groups.indexOf(tileGrid[i][j]) == -1) {
                                groups.push(tileGrid[i][j]);
                            };
                            if (groups.indexOf(tileGrid[i + 1][j]) == -1) {
                                groups.push(tileGrid[i + 1][j]);
                            };
                            if (groups.indexOf(tileGrid[i + 2][j]) == -1) {
                                groups.push(tileGrid[i + 2][j]);
                            }
                        }
                    }
            };
            if (groups.length > 0) {
                matches.push(groups)
            }
        }

        return matches
    },

    removeTileGroup: function (matches) {
        for (let i = 0; i < matches.length; i++) {
            let positions = [];
            let tempArr = matches[i];

            for (let j = 0; j < tempArr.length; j++) {
                let tile = tempArr[j];
                let tilePos = this.getTilePos(game.tileGrid, tile);

                positions.push(tilePos, tile.key);

                game.tiles.remove(tile);

                this.addEmitter(tilePos);

                this.incrementScore();

                if (tilePos.x != -1 && tilePos.y != -1) {
                    game.tileGrid[tilePos.x][tilePos.y] = null;
                }
            };

            let pos = this.getMatchesLineCenter(positions);

            if (tempArr.length > 3) {
                let bonusTileKeyNum = Math.floor(Math.random() * (game.bonusTileTypes.length - 0.1));
                let bonusTileType = game.bonusTileTypes[bonusTileKeyNum];

                this.addTile(pos.x, pos.y, bonusTileType);

                this.activateBonusTile(pos, bonusTileType)
            };

        };

        if (game.soundOn) {
            game.killAudio.play()
        }
    },

    getMatchesLineCenter: function (positions) {
        let res = [],
            resX,
            resY;
        let middle = ((Math.floor(positions.length / 2) + 1) % 2) ?
            Math.floor(positions.length / 2) :
            Math.floor(positions.length / 2) - 1;

        for (let i = 0; i < positions.length - 2; i += 2) {
            if (positions[i].x != -1 && positions[i].y != -1) {
                if (positions[i].x == positions[i + 2].x) {
                    resX = positions[i].x
                } else {
                    resX = positions[middle].x
                };

                if (positions[i].y == positions[i + 2].y) {
                    resY = positions[i].y
                } else {
                    resY = positions[i + 2].y

                }
            }
        };

        res.x = resX;
        res.y = resY;

        return res;
    },

    activateBonusTile: function (pos, bonusTileType) {
        let bonusTile = game.tileGrid[pos.x][pos.y];

        game.time.events.add(300, function () {
            bonusTile.scale.setTo(1.1);
            game.time.events.add(400, function () {
                bonusTile.scale.setTo(1);
                game.time.events.add(400, function () {
                    bonusTile.scale.setTo(1.1);
                    game.time.events.add(400, function () {
                        bonusTile.scale.setTo(1);
                        game.time.events.add(400, function () {
                            bonusTile.scale.setTo(1.1);
                            game.time.events.add(400, function () {
                                this.doBonuses(pos, bonusTileType)
                            }, this)
                        }, this)
                    }, this)
                }, this)
            }, this)
        }, this);


    },

    doBonuses: function (pos, bonusTileType) {
        let horizontal,
            vertical;
        switch (bonusTileType) {
            case 'gem07':
                this.removeOfType();

                horizontal = false;
                vertical = false;
                this.removeLines(pos, horizontal, vertical);
                break;
            case 'gem08':
                horizontal = true;
                vertical = true
                this.removeLines(pos, horizontal, vertical);
                break;
            case 'gem09':
                horizontal = false;
                vertical = true;
                this.removeLines(pos, horizontal, vertical);
                break;
            case 'gem10':
                horizontal = true;
                vertical = false;
                this.removeLines(pos, horizontal, vertical);
                break;
            case 'gem11':
                game.timer += 5;

                horizontal = false;
                vertical = false;
                this.removeLines(pos, horizontal, vertical);
                break;
            case 'gem12':
                game.score *= 2;
                game.scoreLabel.text = game.score;

                horizontal = false;
                vertical = false;
                this.removeLines(pos, horizontal, vertical);
                break;
            default:
                console.log('No such bonus donut!');
                break
        }
    },

    removeLines: function (pos, horizontal, vertical) {
        let removeGroup = [];
        for (let i = 0; i < game.tileGrid.length; i++) {
            if (vertical) {
                removeGroup.push(game.tileGrid[pos.x][i]);
                game.tileGrid[pos.x][i] = null;

                let tilePos = {
                    x: pos.x,
                    y: i
                };
                this.addEmitter(tilePos)
            };
            if (horizontal) {
                removeGroup.push(game.tileGrid[i][pos.y]);
                game.tileGrid[i][pos.y] = null;

                let tilePos = {
                    x: i,
                    y: pos.y
                };
                this.addEmitter(tilePos)
            }
        };

        if (!horizontal && !vertical) {
            removeGroup[0] = game.tileGrid[pos.x][pos.y];
            game.tileGrid[pos.x][pos.y] = null;

            let tilePos = {
                x: pos.x,
                y: pos.y
            };
            this.addEmitter(tilePos)
        };

        for (let i = 0; i < removeGroup.length; i++) {
            game.tiles.remove(removeGroup[i])
        };

        this.resetTile();

        this.fillTile();

        game.time.events.add(600, function () {
            this.checkMatch();
        }, this);

        if (game.soundOn) {
            game.killAudio.play()
        }
    },

    removeOfType: function () {
        let removeGroup = [];
        let removeType = game.tileTypes[Math.floor(Math.random() * (game.tileTypes.length - 1))];

        for (let i = 0; i < game.tileGrid.length; i++) {
            for (let j = 0; j < game.tileGrid.length; j++) {
                if (game.tileGrid[i][j].key == removeType) {
                    removeGroup.push(game.tileGrid[i][j]);
                    game.tileGrid[i][j] = null;

                    let tilePos = {
                        x: i,
                        y: j
                    };
                    this.addEmitter(tilePos)
                }
            }
        };

        for (let i = 0; i < removeGroup.length; i++) {
            game.tiles.remove(removeGroup[i])
        };

        this.resetTile();

        this.fillTile();

        game.time.events.add(600, function () {
            this.checkMatch();
        }, this);

        if (game.soundOn) {
            game.killAudio.play()
        }
    },

    addEmitter: function (tilePos) {
        if (tilePos.x != -1 && tilePos.y != -1) {
            let x = tilePos.x * game.tileWidth + game.tileHeight / 2 + game.dx,
                y = tilePos.y * game.tileHeight + game.tileHeight / 2 + game.dy;
            let emitter = game.add.emitter(0, 0, 100);
            emitter.makeParticles('particle');
            emitter.gravity = 0;
            emitter.x = x;
            emitter.y = y;
            emitter.start(true, 4000, null, 10);
            game.time.events.add(400, function () {
                emitter.destroy();
            }, this);
        };
    },

    getTilePos: function (tileGrid, tile) {
        let pos = {
            x: -1,
            y: -1
        };

        for (let i = 0; i < tileGrid.length; i++) {
            for (let j = 0; j < tileGrid[i].length; j++) {
                if (tile == tileGrid[i][j]) {
                    pos.x = i;
                    pos.y = j;
                    break;
                }
            }
        }

        return pos;
    },

    resetTile: function () {
        for (let i = 0; i < game.tileGrid.length; i++) {
            for (let j = game.tileGrid[i].length - 1; j > 0; j--) {
                if (game.tileGrid[i][j] == null && game.tileGrid[i][j - 1] != null) {
                    let tempTile = game.tileGrid[i][j - 1];

                    game.tileGrid[i][j] = tempTile;
                    game.tileGrid[i][j - 1] = null;

                    game.add.tween(tempTile).to({
                        y: (game.tileHeight * j) + (game.dy + game.tileHeight / 2)
                    }, 200, Phaser.Easing.Linear.In, true);

                    j = game.tileGrid[i].length;
                }
            }
        }
    },

    fillTile: function () {
        for (let i = 0; i < game.tileGrid.length; i++) {
            for (let j = 0; j < game.tileGrid.length; j++) {
                if (game.tileGrid[i][j] == null) {
                    let tile = this.addTile(i, j);

                    game.tileGrid[i][j] = tile;
                }
            }
        };

        if (game.soundOn) {
            game.time.events.add(500, function () {
                game.dropAudio.play()
            }, this);
        }
    },

    createScoreAndTimer: function () {
        let font = "70px Comic Sans MS";

        game.scoreLabel = game.add.text(800, 110, game.score, {
            font: font,
            fill: "#fff"
        });
        game.scoreLabel.anchor.setTo(0.5, 0);
        game.scoreLabel.align = 'center';

        game.timer = 30;

        game.timerLabel = game.add.text(800, 300, '0:' + game.timer, {
            font: font,
            fill: "#fff"
        });
        game.timerLabel.anchor.setTo(0.5, 0);
        game.timerLabel.align = 'center';

        game.interval = setInterval(() => {
            game.timer--;
            if (game.timer > 9) {
                game.timerLabel.text = '0:' + game.timer
            } else {
                game.timerLabel.text = '0:0' + game.timer;
                game.timerLabel.addColor("#fcaaaa", 0)
            };

            if (game.timer <= 0) {
                clearInterval(game.interval);
                game.state.start('Finish')
            }
        }, 1000);
    },

    incrementScore: function () {
        game.score += 10;
        game.scoreLabel.text = game.score
    },

    hover: function (item, pointer) {
        item.scale.setTo(1.1);
        item.events.onInputOut.add((item) => {
            item.scale.setTo(1);
        }, this)
    }
};