/// <reference path="jquery.d.ts" />
/// <reference path="underscore.browser.d.ts" />

module game {
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

	// ゲームのメインクラス
	export class Stage {
		// 描画用キャンバス
		private canvas : JQuery;
		// サイズ
		private width : number;
		private height: number;

		// コンストラクタ
		constructor(canvas : JQuery){
			this.canvas = canvas;
			console.log("set canvas size");
			this.canvas.get(0).width = window.innerWidth;
			this.canvas.get(0).height = window.innerHeight;
			this.width = this.canvas.get(0).width;
			this.height = this.canvas.get(0).height;
			console.log("canvas width = " + this.width + " height = " + this.height);

			console.log("set canvas events");
			this.canvas.focus();
			this.canvas.click((e:JQueryEventObject)=>{
				console.log("clicked x = " + e.pageX + " y = " + e.pageY);
			});
			var keyEvent = (e) => {
				console.log("key pressed = " + e.keyCode);
			};
			window.addEventListener("keydown", keyEvent);

			this.loadImages();
		}

		private loadImages() : void {
			console.log("load images");
			var imgs = new Asset(["images/enemy01.png","images/enemy02.png","images/enemy03.png"]);
			var aaa = imgs.getImage("images/enemy02.png");
			
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

		}

		// 描画
		private paint() : void {
			var g : CanvasRenderingContext2D = this.canvas.get(0).getContext("2d");
			// clear background
			this.paintBackground(g);

		}

		// 背景描画
		private paintBackground(g : CanvasRenderingContext2D):void{
			g.fillStyle = "black";
			g.fillRect(0,0,this.width, this.height);
		}
	}
}