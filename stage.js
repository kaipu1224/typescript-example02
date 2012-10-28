var game;
(function (game) {
    var WIDTH;
    var HEIGHT;
    var key;
    var Asset = (function () {
        function Asset(path) {
            var _this = this;
            this.images = [];
            _.each(path, function (p) {
                var image = new Image();
                image.src = p;
                image.alt = p;
                _this.images.push(image);
            });
        }
        Asset.prototype.getImage = function (name) {
            var retImage = null;
            _.each(this.images, function (img) {
                if(img.alt == name) {
                    retImage = img;
                }
            });
            return retImage;
        };
        return Asset;
    })();    
    var KeyState = (function () {
        function KeyState() {
            var _this = this;
            window.onkeydown = function (e) {
                _this.keyPressed(e.keyCode);
            };
            window.onkeyup = function (e) {
                _this.keyReleased(e.keyCode);
            };
        }
        KeyState.KEY_SPACE = 32;
        KeyState.KEY_LEFT = 37;
        KeyState.KEY_TOP = 38;
        KeyState.KEY_RIGHT = 39;
        KeyState.KEY_BOTTOM = 40;
        KeyState.KEY_ENTER = 13;
        KeyState.prototype.keyPressed = function (keyCode) {
            switch(keyCode) {
                case KeyState.KEY_LEFT: {
                    this.left = true;
                    break;

                }
                case KeyState.KEY_RIGHT: {
                    this.right = true;
                    break;

                }
                case KeyState.KEY_TOP: {
                    this.top = true;
                    break;

                }
                case KeyState.KEY_BOTTOM: {
                    this.bottom = true;
                    break;

                }
                case KeyState.KEY_SPACE: {
                    this.space = true;
                    break;

                }
                case KeyState.KEY_ENTER: {
                    this.enter = true;
                    break;

                }
            }
        };
        KeyState.prototype.keyReleased = function (keyCode) {
            switch(keyCode) {
                case KeyState.KEY_LEFT: {
                    this.left = false;
                    break;

                }
                case KeyState.KEY_RIGHT: {
                    this.right = false;
                    break;

                }
                case KeyState.KEY_TOP: {
                    this.top = false;
                    break;

                }
                case KeyState.KEY_BOTTOM: {
                    this.bottom = false;
                    break;

                }
                case KeyState.KEY_SPACE: {
                    this.space = false;
                    break;

                }
                case KeyState.KEY_ENTER: {
                    this.enter = false;
                    break;

                }
            }
        };
        KeyState.prototype.isPressed = function (keyCode) {
            switch(keyCode) {
                case KeyState.KEY_LEFT: {
                    return this.left;

                }
                case KeyState.KEY_RIGHT: {
                    return this.right;

                }
                case KeyState.KEY_TOP: {
                    return this.top;

                }
                case KeyState.KEY_BOTTOM: {
                    return this.bottom;

                }
                case KeyState.KEY_SPACE: {
                    return this.space;

                }
                case KeyState.KEY_ENTER: {
                    return this.enter;

                }
            }
            return false;
        };
        return KeyState;
    })();    
    var Stage = (function () {
        function Stage() {
            this.canvas = $("#stage");
            console.log("set canvas size");
            this.canvas.get(0).width = window.innerWidth - 12;
            this.canvas.get(0).height = window.innerHeight - 12;
            WIDTH = this.canvas.get(0).width;
            HEIGHT = this.canvas.get(0).height;
            console.log("canvas width = " + WIDTH + " height = " + HEIGHT);
            console.log("set canvas events");
            this.canvas.focus();
            this.canvas.click(function (e) {
                console.log("clicked x = " + e.pageX + " y = " + e.pageY);
            });
            key = new KeyState();
            this.loadImages();
            this.player = new Player(WIDTH / 2 - 10, HEIGHT - 20, 20, 20, 3, 3);
        }
        Stage.prototype.loadImages = function () {
            console.log("load images");
            var imgs = new Asset([
                "images/enemy01.png", 
                "images/enemy02.png", 
                "images/enemy03.png"
            ]);
        };
        Stage.prototype.start = function () {
            var _this = this;
            var gameLoop = (function () {
                return window.requestAnimationFrame || (window).webkitRequestAnimationFrame || (window).mozRequestAnimationFrame || (window).oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                    window.setTimeout(callback, 1000 / 60, new Date().getTime());
                };
            })();
            var update = function () {
                _this.updateState();
                _this.paint();
                gameLoop(update);
            };
            gameLoop(update);
        };
        Stage.prototype.updateState = function () {
            this.player.update();
        };
        Stage.prototype.paint = function () {
            var g = this.canvas.get(0).getContext("2d");
            this.paintBackground(g);
            this.player.paint(g);
        };
        Stage.prototype.paintBackground = function (g) {
            g.fillStyle = "black";
            g.fillRect(0, 0, WIDTH, HEIGHT);
        };
        return Stage;
    })();
    game.Stage = Stage;    
    var Player = (function () {
        function Player(x, y, sx, sy, vx, vy) {
            this.x = x;
            this.y = y;
            this.sx = sx;
            this.sy = sy;
            this.vx = vx;
            this.vy = vy;
        }
        Player.prototype.update = function () {
            this.move();
        };
        Player.prototype.move = function () {
            if(key.isPressed(KeyState.KEY_LEFT)) {
                this.x -= this.vx;
            }
            if(key.isPressed(KeyState.KEY_RIGHT)) {
                this.x += this.vx;
            }
            if(key.isPressed(KeyState.KEY_TOP)) {
                this.y -= this.vy;
            }
            if(key.isPressed(KeyState.KEY_BOTTOM)) {
                this.y += this.vy;
            }
            if(this.x < 0) {
                this.x = 0;
            }
            if(this.x + this.sx > WIDTH) {
                this.x = WIDTH - this.sx;
            }
            if(this.y < 0) {
                this.y = 0;
            }
            if(this.y + this.sy > HEIGHT) {
                this.y = HEIGHT - this.sy;
            }
        };
        Player.prototype.paint = function (g) {
            g.fillStyle = "yellow";
            g.fillRect(this.x, this.y, this.sx, this.sy);
        };
        return Player;
    })();    
})(game || (game = {}));

