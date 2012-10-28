/// <reference path="jquery.d.ts" />
/// <reference path="underscore.browser.d.ts" />

module game {
	var WIDTH : number;
	var HEIGHT : number;
	var key : KeyState;

	class Asset {
		// 画像
		private images : HTMLImageElement[];

		constructor(path:string[]){
			this.images = [];
			_.each(path, (p)=>{
				var image = new Image();
				image.src = p;
				image.alt = p;
				this.images.push(image);
			});
		}

		public getImage(name:string):HTMLImageElement{
			var retImage = null;
			_.each(this.images, (img)=>{
				if(img.alt == name){
					retImage = img;
				}
			});
			return retImage;
		}
	}

	// キーコード定義
	class KeyState {
		public static KEY_SPACE : number = 32;
		public static KEY_LEFT : number = 37;
		public static KEY_TOP : number = 38;
		public static KEY_RIGHT : number = 39;
		public static KEY_BOTTOM : number = 40;
		public static KEY_ENTER : number = 13;

		private left : bool;
		private right : bool;
		private top : bool;
		private bottom : bool;
		private space : bool;
		private enter : bool;

		constructor(){
			window.onkeydown = (e) =>{
				this.keyPressed(e.keyCode);
			};
			window.onkeyup = (e)=>{
				this.keyReleased(e.keyCode);
			};
		}

		private keyPressed(keyCode : number){
			switch(keyCode){
				case KeyState.KEY_LEFT : this.left = true; break;
				case KeyState.KEY_RIGHT : this.right = true; break;
				case KeyState.KEY_TOP : this.top = true; break;
				case KeyState.KEY_BOTTOM : this.bottom = true; break;
				case KeyState.KEY_SPACE : this.space = true; break;
				case KeyState.KEY_ENTER : this.enter = true; break;
			}
		}

		private keyReleased(keyCode : number){
			switch(keyCode){
				case KeyState.KEY_LEFT : this.left = false; break;
				case KeyState.KEY_RIGHT : this.right = false; break;
				case KeyState.KEY_TOP : this.top = false; break;
				case KeyState.KEY_BOTTOM : this.bottom = false; break;
				case KeyState.KEY_SPACE : this.space = false; break;
				case KeyState.KEY_ENTER : this.enter = false; break;
			}
		}

		public isPressed(keyCode : number){
			switch(keyCode){
				case KeyState.KEY_LEFT : return this.left;
				case KeyState.KEY_RIGHT : return this.right;
				case KeyState.KEY_TOP : return this.top;
				case KeyState.KEY_BOTTOM : return this.bottom;
				case KeyState.KEY_SPACE : return this.space;
				case KeyState.KEY_ENTER : return this.enter;
			}
			return false;
		}
	}

	// ゲームのメインクラス
	export class Stage {
		// 描画用キャンバス
		private canvas : JQuery;

		// プレイヤー
		private player : Player;

		// コンストラクタ
		constructor(){
			this.canvas = $("#stage");
			console.log("set canvas size");
			this.canvas.get(0).width = window.innerWidth - 12;
			this.canvas.get(0).height = window.innerHeight - 12;
			WIDTH = this.canvas.get(0).width;
			HEIGHT = this.canvas.get(0).height;
			console.log("canvas width = " + WIDTH + " height = " + HEIGHT);

			console.log("set canvas events");
			this.canvas.focus();
			this.canvas.click((e:JQueryEventObject)=>{
				console.log("clicked x = " + e.pageX + " y = " + e.pageY);
			});
			
			key = new KeyState();

			this.loadImages();

			// プレイヤー生成
			this.player = new Player(WIDTH/2 - 10, HEIGHT - 20, 20, 20, 3, 3);
		}

		private loadImages() : void {
			console.log("load images");
			var imgs = new Asset(["images/enemy01.png","images/enemy02.png","images/enemy03.png"]);
		}

		// 開始処理
		start() : void {

			var gameLoop : (callback: () => void) => void = (function(){ 
			  return window.requestAnimationFrame || 
			  (<any>window).webkitRequestAnimationFrame || 
			  (<any>window).mozRequestAnimationFrame || 
			  (<any>window).oRequestAnimationFrame || 
			  window.msRequestAnimationFrame || 
			  function(callback){
			      window.setTimeout(callback, 1000 / 60, new Date().getTime()); 
			  }; 
			})();

			var update = () => {
				this.updateState();
				this.paint();
				gameLoop(update);
			};

			gameLoop(update);
		}

		// 状態更新
		private updateState() : void {
			this.player.update();
		}

		// 描画
		private paint() : void {
			var g : CanvasRenderingContext2D = this.canvas.get(0).getContext("2d");
			// clear background
			this.paintBackground(g);

			this.player.paint(g);

		}

		// 背景描画
		private paintBackground(g : CanvasRenderingContext2D):void{
			g.fillStyle = "black";
			g.fillRect(0,0,WIDTH, HEIGHT);
		}
	}

	class Player {
		// 位置
		private x : number;
		private y : number;
		// サイズ
		private sx : number;
		private sy : number;
		// 速度
		private vx : number;
		private vy : number;

		constructor(x:number, y:number, sx:number, sy:number, vx:number, vy:number) {
			this.x = x;
			this.y = y;
			this.sx = sx;
			this.sy = sy;
			this.vx = vx;
			this.vy = vy;
		}

		public update():void{
			this.move();
		}

		private move():void {
			if(key.isPressed(KeyState.KEY_LEFT)) this.x -= this.vx;
			if(key.isPressed(KeyState.KEY_RIGHT)) this.x += this.vx;
			if(key.isPressed(KeyState.KEY_TOP)) this.y -= this.vy;
			if(key.isPressed(KeyState.KEY_BOTTOM)) this.y += this.vy;

			// 移動位置の制限
			if(this.x < 0) this.x = 0;
			if(this.x + this.sx > WIDTH) this.x = WIDTH - this.sx;
			if(this.y < 0) this.y = 0;
			if(this.y + this.sy > HEIGHT) this.y = HEIGHT - this.sy;
		}

		public paint(g:CanvasRenderingContext2D):void{
			g.fillStyle = "yellow";
			g.fillRect(this.x, this.y, this.sx, this.sy);
		}
	}
}