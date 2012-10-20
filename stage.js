var game;
(function (game) {
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
                console.log(img.alt);
                if(img.alt == name) {
                    retImage = img;
                }
            });
            return retImage;
        };
        return Asset;
    })();    
    var Stage = (function () {
        function Stage(canvas) {
            this.canvas = canvas;
            console.log("set canvas size");
            this.canvas.get(0).width = window.innerWidth;
            this.canvas.get(0).height = window.innerHeight;
            this.width = this.canvas.get(0).width;
            this.height = this.canvas.get(0).height;
            console.log("canvas width = " + this.width + " height = " + this.height);
            console.log("set canvas events");
            this.canvas.focus();
            this.canvas.click(function (e) {
                console.log("clicked x = " + e.pageX + " y = " + e.pageY);
            });
            var keyEvent = function (e) {
                console.log("key pressed = " + e.keyCode);
            };
            window.addEventListener("keydown", keyEvent);
            this.loadImages();
        }
        Stage.prototype.loadImages = function () {
            console.log("load images");
            var imgs = new Asset([
                "images/enemy01.png", 
                "images/enemy02.png", 
                "images/enemy03.png"
            ]);
            var aaa = imgs.getImage("images/enemy02.png");
            console.log(aaa.src);
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
        };
        Stage.prototype.paint = function () {
            var g = this.canvas.get(0).getContext("2d");
            this.paintBackground(g);
        };
        Stage.prototype.paintBackground = function (g) {
            g.fillStyle = "black";
            g.fillRect(0, 0, this.width, this.height);
        };
        return Stage;
    })();
    game.Stage = Stage;    
})(game || (game = {}));

