var endTimer = function(){
	this.time = 0;
	this.timerLabel = null;
	this.tickStarted = false;

	this.isShaking = false;
	this.isRotating = false;
	this.timerval = {};

	this.isTickAdded = false;
	this.tickListener = null;
	this.isStartedWithMax = null;

	this.rebetStatusChanged = false;

	this.endTimer = null;
	this.endTimerContainer = null;
};

endTimer.prototype.createTimerContainer = function(){
	var self = this;
	self.endTimerContainer = CGenClass.createContainer(CGameClass.waitForNextRoundContainer, "endTimerContainer", true);
	self.endTimerContainer.y = -85;
	self.endTimerContainer.scaleY = self.endTimerContainer.scaleX = 1.51;
	self.endTimerContainer.alpha = 0;

	var outSideinnerCircle = self.endTimerContainer.addChild(new createjs.Shape());
	outSideinnerCircle.graphics
		.setStrokeStyle(2)
		.beginLinearGradientStroke(["#FFF","#8F8F8F"], [0, 1], 0, 20, 0, 60)
		.beginFill("#000")
		.drawCircle(0, 0, 56)
	outSideinnerCircle.name = "outSideinnerCircle";
	outSideinnerCircle.shadow = new createjs.Shadow("rgba(0, 0, 0, .6)", 0, 6, 9);

	// var timerBg = CGenClass.createBitmap(self.endTimerContainer, "timerbg", "timerBg", 1);
	var timerBg = SpriteClass.createSprite(self.endTimerContainer, SpriteClass.tableSpriteSheet, "timerbg", "timerBg", 1);
	timerBg.mask = outSideinnerCircle;
	timerBg.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 12);

	var innerSideCircle = self.endTimerContainer.addChild(new createjs.Shape());
	innerSideCircle.graphics
		.beginRadialGradientFill(["#111111", "#111111"], [0, 1], 0, 0, 10, 0, 0, 55)
		.moveTo(0, 0)
		.arc(0, 0, 55, 0, 0)
	innerSideCircle.name = "innerSideCircle";

	var innerTimerCircle = self.endTimerContainer.addChild(new createjs.Shape());
	innerTimerCircle.graphics
		.setStrokeStyle(2)
		.beginStroke("rgba(105, 110, 105, .2)")
		.beginFill("#000")
		.drawCircle(0, 0, 48)
	innerTimerCircle.name = "innerTimerCircle";

	var gradient = self.endTimerContainer.addChild(new createjs.Shape());
		gradient.graphics
			.setStrokeStyle(0).beginStroke("rgba(0,0,0,0)")
			.beginLinearGradientFill(["rgba(0,0,0,0)","rgba(196,196,196,.4)","rgba(0,0,0,0)"], [0, 1, 1], 0, 0, 0, 45)
			.drawCircle(0, 0, 45)
	gradient.name = "gradient";
	gradient.scaleY = -1;

	var crcl = self.endTimerContainer.addChild(new createjs.Shape());
	crcl.graphics
		.beginFill("#03fe00")
		.drawCircle(0, -52, 4);
	crcl.name = "mainCircle";

	this.timerLabel = CGenClass.createText(self.endTimerContainer, "timerLabel", "center", "middle", "#03fe00", "900 50px Lato", null);
	this.timerLabel.shadow = new createjs.Shadow("#03fe00", 0, 0, 15);

	console.log("self.endTimerContainer", self.endTimerContainer);
};

endTimer.prototype.setEndTimer = function(tick){
	console.log("WAIT TIMER", tick)
	if(!this.timerLabel) return false;
	this.timerval = tick;
	this.timerLabel.text = tick.curr;
	this.tickStarted = (tick.curr === 0) ? false : true;
	createjs.Tween.get(EndTimerClass.endTimerContainer)
		.to({alpha : (tick.curr === 0) ? 0 : 1}, (tick.curr === 0) ? 0 : 300);
	this.startTimer(tick);
	if(tick.curr === 0){
		clearInterval(EndTimerClass.endTimer);
		createjs.Tween.get(EndTimerClass.timerLabel, {loop : false, override:true})
			.to({rotation : 0}, 80);
		EndTimerClass.clearTicker();
		setTimeout(function(){
			EndTimerClass.clearTimer();
		}, 1000);
	}

};

endTimer.prototype.rotateCircle = function(degree){
	var crcl = EndTimerClass.endTimerContainer.getChildByName("mainCircle");
	var self = this;
	var multiplier = 1000;
	// console.log("MULTIPLEIER", multiplier, self.timerval.curr);
	if(!self.isRotating){
		self.isRotating = true;
		crcl.rotation = degree;
		createjs.Tween.get(crcl)
			.to({rotation : 360}, (self.timerval.curr)*multiplier);
	}
};

endTimer.prototype.shakeTimer = function(){
	var self = this;
	console.log("------shakeTimer", self.isShaking)
	if(!self.isShaking){
		self.isShaking = true;
		createjs.Tween.get(self.timerLabel, {loop : true, reversed : true})
			.to({rotation : 10}, 80)
			.to({rotation : -10}, 80);
	}
};

endTimer.prototype.startTimer = function(timer){
	var self = this;
	var crcl = self.endTimerContainer.getChildByName("mainCircle");
	var innerSideCircle = self.endTimerContainer.getChildByName("innerSideCircle");

	var bettingStatusContainer = CGameClass.gameContainer.getChildByName("bettingStatusContainer");
	var bettingOpenStatusContainer = bettingStatusContainer.getChildByName("bettingOpenStatusContainer");
	var gradientLineContainer = bettingOpenStatusContainer.getChildByName("gradientLineContainer");

	self.timerLabel.text = timer.curr;
	createjs.Tween.get(self.timerLabel)
		.to({scale: 1.2}, 100)
		.to({scale: 1}, 100);


	var innerTimer = innerSideCircle;
	var max = timer.max;
	var time = timer.curr;
	var currDeg = (360 / max) * (max - time);
	var angle = -90;
	var degree = currDeg;
	var startAngle = angle * Math.PI / 180;
	var endAngle = Math.min(360, angle + degree) * Math.PI / 180;
	var color = (time === max / 2);
	

	innerTimer.graphics.clear();
	innerTimer.graphics
		.beginRadialGradientFill(["#111111", "#111111"], [0, 1], 0, 0, 10, 0, 0, 55)
		.moveTo(0, 0)
		.arc(0, 0, 55, startAngle, endAngle);
	self.rotateCircle(degree);

	// createjs.Ticker.removeEventListener("tick", animateTimer);

	function animateTimer(event) {
		time -= event.delta / 1000;
		currDeg = (360 / max) * (max - time);
		angle = -90;
		degree = currDeg;
		startAngle = angle * Math.PI / 180;
		endAngle = Math.min(360, angle + degree) * Math.PI / 180;
		innerTimer.graphics.clear();
		innerTimer.graphics
			.beginRadialGradientFill(["#111111", "#111111"], [0, 1], 0, 0, 10, 0, 0, 55)
			.moveTo(0, 0)
			.arc(0, 0, 55, startAngle, endAngle);

		// console.log("degree", degree)
		if(degree >= 90 && degree <= 100){
			self.timerLabel.color = "#cdff01"; //yellow green
			self.timerLabel.shadow = new createjs.Shadow("#cdff01", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#cdff01")
				.drawCircle(0, -52, 4);
		}else if(degree >= 100 && degree <= 170){
			self.timerLabel.color = "#fbff01"; //yellow
			self.timerLabel.shadow = new createjs.Shadow("#fbff01", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#fbff01")
				.drawCircle(0, -52, 4);
		}else if(degree >= 170 && degree <= 185){
			self.timerLabel.color = "#fcbd00"; //yellow orange
			self.timerLabel.shadow = new createjs.Shadow("#fcbd00", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#fcbd00")
				.drawCircle(0, -52, 4);
		}else if(degree >= 185 && degree <= 260){
			self.timerLabel.color = "#fe7b02"; //orange
			self.timerLabel.shadow = new createjs.Shadow("#fe7b02", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#fe7b02")
				.drawCircle(0, -52, 4);
		}else if(degree >= 260 && degree <= 280){
			self.timerLabel.color = "#ff5901"; //red orange
			self.timerLabel.shadow = new createjs.Shadow("#ff5901", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#ff5901")
				.drawCircle(0, -52, 4);
		}else if(degree >= 280 && degree <=360){  
			self.timerLabel.color = "#ff0100"; //red
			self.timerLabel.shadow = new createjs.Shadow("#ff0100", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#ff0100")
				.drawCircle(0, -52, 4);
			self.shakeTimer();
		}else if(degree > 360){
			createjs.Tween.get(self.timerLabel, {loop : false, override:true})
				.to({rotation : 0}, 80);
		}else{
			self.timerLabel.color = "#03fe00"; //orange
			self.timerLabel.shadow = new createjs.Shadow("#03fe00", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#03fe00")
				.drawCircle(0, -52, 4);
		}
	}
	console.log("TIMER", self.isTickAdded, self.tickListener)
	if(!self.isTickAdded) {
		self.isTickAdded = true;
		self.tickListener = createjs.Ticker.on("tick", animateTimer);
	}
};

endTimer.prototype.clearTimer = function(){
	this.time = 0;
	this.timerLabel = null;
	this.tickStarted = false;

	this.isShaking = false;
	this.isRotating = false;
	this.timerval = {};

	this.isTickAdded = false;
	this.tickListener = null;
};

endTimer.prototype.clearTicker = function(){
	var self = this;
	createjs.Ticker.off("tick", self.tickListener);
	this.time = 0;
	this.tickStarted = false;

	this.isShaking = false;
	this.isRotating = false;
	this.timerval = {};

	this.isTickAdded = false;
	this.tickListener = null;
};

var EndTimerClass = new endTimer();