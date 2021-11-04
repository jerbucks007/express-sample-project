var CanvasGeneral = function(){
	this.selectedChip = 0;
	this.betsContainer = null;
	this.gameStage = null;
	this.alertStage = null;
	this.roadmapStage = null;
	this.mainContainer = null;
	this.alertMainContainer = null;
	this.roadmapMainContainer = null;
	this.isFullScreen = false;
	this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	// this.isMobile = true;
	// this.isIOS = true;
	this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	this.balance = null;
	this.playerBalance = null;
	this.playerBalanceDisplay = null;
	this.alertCanvas = null;
	this.delayBalanceUpdate = false;

	this.grayMatrix = new createjs.ColorMatrix().adjustHue(0).adjustSaturation(0);
	this.isWindowActive = true;

	this.isSocketDisconnected = false;
	
	// this.isSBO = (isSBO) ? true : true;
	this.isSBO = (isSBO) ? true : false;

	this.reconstructTotalBet = 0;
	this.balanceFromSocket = 0;
	this.tableUrl = null;
	this.tableState = null;
};
// Create stage for canvas
CanvasGeneral.prototype.createStage = function(next){
	var self = this;
	if(!self.gameStage && !self.alertStage){
		this.gameStage = new createjs.Stage(document.getElementById("gameStage"));
		this.gameStage.name = "gameStage";

		this.alertStage = new createjs.Stage(document.getElementById("alertStage"));
		this.alertStage.name = "alertStage";
		this.alertCanvas = document.getElementById('alertStage');
		this.alertCanvas.style.display = "none";
		if(!this.isMobile) {
			this.gameStage.enableMouseOver();
			this.alertStage.enableMouseOver();
		}else{
			createjs.Touch.enable(self.gameStage);
			createjs.Touch.enable(self.alertStage);
		}
	}
	this.createMainContainer(next);
};
// Create main container per stage
CanvasGeneral.prototype.createMainContainer = function(next){
	var self = this;
	if(!self.mainContainer && !self.alertMainContainer){
		this.mainContainer = this.gameStage.addChild(new createjs.Container());
		this.mainContainer.name = "mainContainer";
		this.mainContainer.x = this.gameStage.canvas.width / 2;
		this.mainContainer.y = this.gameStage.canvas.height / 2;

		this.alertMainContainer = this.alertStage.addChild(new createjs.Container());
		this.alertMainContainer.name = "alertMainContainer";
		this.alertMainContainer.x = this.alertStage.canvas.width / 2;
		this.alertMainContainer.y = this.alertStage.canvas.height / 2;	
	}else {
		CGenClass.mainContainer.uncache(-640, -360, 1280, 720);
	}
	
	console.log("##CANVAS mainContainer", this.mainContainer);
	console.log("##CANVAS alertMainContainer", this.alertMainContainer);
	next();
};
//Update stage per tick
CanvasGeneral.prototype.updateGameStage = function(e){
	CGenClass.gameStage.update();
	CGenClass.alertStage.update();
	// console.log("ticker")
};
//Draw rectangle
CanvasGeneral.prototype.createRect = function(cont, name, fill, strokeW, strokeF, w, h, visible){
	var newShape = cont.addChild(new createjs.Shape());
	newShape.name = name;
	newShape.graphics
		.setStrokeStyle(strokeW).beginStroke(strokeF)
		.beginFill(fill).drawRect(0, 0, w, h);
	newShape.regX = newShape.graphics.command.w / 2;
	newShape.regY = newShape.graphics.command.h / 2;
	newShape.visible = visible;

	return newShape;
};
//Draw rectangle with gradient fill
CanvasGeneral.prototype.createRectGradient = function(cont, name, strokeW, strokeF, w, h, visible, colors, ratios, x0, y0, x1, y1){
	var newShape = cont.addChild(new createjs.Shape());
	newShape.name = name;
	newShape.graphics
		.setStrokeStyle(strokeW).beginStroke(strokeF)
		.beginLinearGradientFill(colors, ratios, x0, y0, x1, y1).drawRect(0, 0, w, h);
	newShape.regX = newShape.graphics.command.w / 2;
	newShape.regY = newShape.graphics.command.h / 2;
	newShape.visible = visible;

	return newShape;
};
// Draw circle
CanvasGeneral.prototype.createCircle = function(cont, name, fill, strokeW, strokeF, r, visible){
	var newShape = cont.addChild(new createjs.Shape());
	newShape.name = name;
	newShape.graphics
		.setStrokeStyle(strokeW).beginStroke(strokeF)
		.beginFill(fill).drawCircle(0, 0, r);
	newShape.visible = visible;

	return newShape;
};
// Draw rectangle with round border
CanvasGeneral.prototype.createRoundRect = function(cont, name, fill, strokeW, strokeF, w, h, borderR, visible){
	var newShape = cont.addChild(new createjs.Shape());
	newShape.name = name;
	newShape.graphics
		.setStrokeStyle(strokeW).beginStroke(strokeF)
		.beginFill(fill).drawRoundRect(0, 0, w, h, borderR);
	newShape.regX = newShape.graphics.command.w / 2;
	newShape.regY = newShape.graphics.command.h / 2;
	newShape.visible = visible;

	return newShape;
};
// Redraw shape
CanvasGeneral.prototype.clearRoundRect = function(newShape, fill, strokeW, strokeF, w, h, borderR, visible){
	newShape.graphics.clear();
	newShape.graphics
		.setStrokeStyle(strokeW).beginStroke(strokeF)
		.beginFill(fill).drawRoundRect(0, 0, w, h, borderR);
	newShape.regX = newShape.graphics.command.w / 2;
	newShape.regY = newShape.graphics.command.h / 2;
	newShape.visible = visible;
};
// Draw rectangle with round border and gradient stroke
CanvasGeneral.prototype.createRoundRectStrokeGradient = function(cont, name, fill, strokeW, strokeF, w, h, borderR, visible, ratios, x0, y0, x1, y1){
	var newShape = cont.addChild(new createjs.Shape());
	newShape.name = name;
	newShape.graphics
		.setStrokeStyle(strokeW).beginLinearGradientStroke(strokeF, ratios, x0, y0, x1, y1)
		.beginFill(fill).drawRoundRect(0, 0, w, h, borderR);
	newShape.regX = newShape.graphics.command.w / 2;
	newShape.regY = newShape.graphics.command.h / 2;
	newShape.visible = visible;

	return newShape;
};
// Draw rectangle with various round border
CanvasGeneral.prototype.createRoundRectComplex = function(cont, name, fill, strokeW, strokeF, w, h, border, visible){
	var newShape = cont.addChild(new createjs.Shape());
	newShape.name = name;
	newShape.graphics
		.setStrokeStyle(strokeW).beginStroke(strokeF)
		.beginFill(fill).drawRoundRectComplex(0, 0, w, h, border[0], border[1], border[2], border[3]);
	newShape.regX = newShape.graphics.command.w / 2;
	newShape.regY = newShape.graphics.command.h / 2;
	newShape.visible = visible;

	return newShape;
};
// Create container
CanvasGeneral.prototype.createContainer = function(cont, name, visible){
	var newCont = cont.addChild(new createjs.Container());
	newCont.name = name;
	newCont.visible = visible;

	return newCont;
}; 
// Draw text
CanvasGeneral.prototype.createText = function(cont, name, align, baseline, color, font, text) {
	var newText = cont.addChild(new createjs.Text());
	newText.name = name;
	newText.textAlign = align;
	newText.textBaseline = baseline;
	newText.color = color;
	newText.font = font;
	newText.text = text;

	return newText;
};
// Draw bitmap
CanvasGeneral.prototype.createBitmap = function(cont, image, name, scale){
	var newBitmap = cont.addChild(new createjs.Bitmap(ResourcesClass.loadQueue.getResult(image)));
	newBitmap.name = name;
	newBitmap.regX = newBitmap.image.width / 2;
	newBitmap.regY = newBitmap.image.height / 2;
	newBitmap.scale = scale;
	return newBitmap;
};
// Draw bitmap from loading loadQueue
CanvasGeneral.prototype.createLoadingBitmap = function(cont, image, name, scale, loadQueue){
	var newBitmap = cont.addChild(new createjs.Bitmap(loadQueue.getResult(image)));
	newBitmap.name = name;
	newBitmap.scale = scale;
	return newBitmap;
};
// Draw polygon depends on number of sides
CanvasGeneral.prototype.createPolystar = function(cont, name, fill, strokeW, strokeF, r, sides, size, angle){
	var newShape = cont.addChild(new createjs.Shape());
	newShape.name = name;
	newShape.graphics
		.setStrokeStyle(strokeW).beginStroke(strokeF)
		.beginFill(fill).drawPolyStar(0, 0, r, sides, size, angle);
	newShape.regY = newShape.graphics.command.radius / 2;

	return newShape;
};
// Add mouse events on components
CanvasGeneral.prototype.addMouseOverandOut = function(cont, scaleOver, scaleOut){
	cont.on("mouseover", function(e){
		if(CGameClass.isDrawingPhase) return false;
		cont.cursor = "pointer";
		createjs.Tween.get(cont)
			.to({ scaleX: scaleOver, scaleY: scaleOver }, 100);
	});

	cont.on("mouseout", function(e){
		cont.cursor = "default";
		createjs.Tween.get(cont)
			.to({ scaleX: scaleOut, scaleY: scaleOut }, 100);
	});

	cont.on("mousedown", function(e){
		createjs.Tween.get(cont)
			.to({ scaleX: scaleOut, scaleY: scaleOut }, 100);
	});
};
// Fullscreen
CanvasGeneral.prototype.applyFullScreen = function(){
	var isFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
		(document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
		(document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
		(document.msFullscreenElement && document.msFullscreenElement !== null);
	// If the isFullScreen is true, means the current screen is full screen
	this.isFullScreen = isFullScreen ? false : true; // Do opposite of isFullScreen


	var docElm = document.documentElement;
	if (this.isFullScreen) { // Minimize
		if (docElm.requestFullscreen) {
			docElm.requestFullscreen();
		} else if (docElm.mozRequestFullScreen) {
			docElm.mozRequestFullScreen();
		} else if (docElm.webkitRequestFullScreen) {
			docElm.webkitRequestFullScreen();
		} else if (docElm.msRequestFullscreen) {
			docElm.msRequestFullscreen();
		}
	} else { // Maximize
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}
}

CanvasGeneral.prototype.animateBalance = function(lastVal ,balance, next){
	var self = this;
	var lastValue = lastVal;
	var targetValue = balance;

	var balanceUpdate = {};
	balanceUpdate.duration = 200;
	balanceUpdate.distance = targetValue - lastValue;

	balanceUpdate.start = new Date().getTime();
	balanceUpdate.end = balanceUpdate.start + balanceUpdate.duration;

	function animatechips() { // Create animation from last value to target value
		var timestamp = new Date().getTime();
		var progress = Math.min((balanceUpdate.duration - (balanceUpdate.end - timestamp)) / balanceUpdate.duration, 1);
		var newValue = Number(lastValue) + Number((balanceUpdate.distance * progress));
		setTimeout(function () {
			self.balance = newValue;
			self.playerBalance = self.balance;
			self.playerBalanceDisplay = (self.balance > 0) ? self.balance.toLocaleString(undefined, {
			  minimumFractionDigits: 2,
			  maximumFractionDigits: 2
			}) : self.balance;


			next(self.playerBalanceDisplay, self.balance);
		});
		if (progress >= 1) createjs.Ticker.removeEventListener("tick", animatechips);
	}

	if (Math.floor(lastValue) !== Math.floor(targetValue)) {
		createjs.Ticker.addEventListener("tick", animatechips);
	}
};

CanvasGeneral.prototype.animateNumber = function(lastVal ,balance, next){
	var self = this;
	var lastValue = lastVal;
	var targetValue = balance;

	var balanceUpdate = {};
	balanceUpdate.duration = 200;
	balanceUpdate.distance = targetValue - lastValue;

	balanceUpdate.start = new Date().getTime();
	balanceUpdate.end = balanceUpdate.start + balanceUpdate.duration;

	function animatechips() { // Create animation from last value to target value
		var timestamp = new Date().getTime();
		var progress = Math.min((balanceUpdate.duration - (balanceUpdate.end - timestamp)) / balanceUpdate.duration, 1);
		var newValue = lastValue + (balanceUpdate.distance * progress);
		setTimeout(function () {
			self.balance = newValue;
			self.playerBalance = self.balance;
			self.playerBalanceDisplay = (self.balance > 0) ? self.balance.toLocaleString(undefined, {
			  minimumFractionDigits: 2,
			  maximumFractionDigits: 2
			}) : self.balance;


			next(self.playerBalanceDisplay, self.balance);
		});
		if (progress >= 1) createjs.Ticker.removeEventListener("tick", animatechips);
	}

	if (Math.floor(lastValue) !== Math.floor(targetValue)) {
		createjs.Ticker.addEventListener("tick", animatechips);
	}
};

CanvasGeneral.prototype.addDelay = function(func, delay){
	setTimeout(function(){
		func();
	}, delay);
};

CanvasGeneral.prototype.randomOrigin = function(r){
	var sign = Math.floor(Math.random()*2);
	var origin = (Math.random()*r);
	var coinOrigin = (sign < 1) ? origin : origin*-1;
	return coinOrigin;
};

CanvasGeneral.prototype.getRandomVal = function(r){
	var random = Math.floor(Math.random()*r);
	return random;
};

CanvasGeneral.prototype.intToPos = function(num){
	var value = (num < 1) ? num * -1 : num;
	return value;
};


CanvasGeneral.prototype.addDecimal = function(num, decimal){
	var value = parseFloat(Math.round(num * 100) / 100).toFixed(decimal);
	return value;
};


CanvasGeneral.prototype.createSBSpecialShape = function(cont, name, fill, strokeW, strokeF, visible){
	var newShape = new createjs.Shape();
	newShape.name = name;
	newShape.graphics.beginFill(fill);
	newShape.graphics.setStrokeStyle(strokeW).beginStroke(strokeF)
	newShape.graphics.moveTo(-126, -43.5);           // Create a starting point
	newShape.graphics.lineTo(100, -43.5);          // Create a horizontal line
	newShape.graphics.arcTo(130, -43.5, 130, 55, 8); // Create an arc
	newShape.graphics.lineTo(130, 48);   
	newShape.graphics.arcTo(130, 55, 100, 55, 8); // Create an arc
	newShape.graphics.lineTo(-78, 55);   
	newShape.graphics.quadraticCurveTo(-100, 48, -120, 10);
	newShape.graphics.bezierCurveTo(-130, -15, -135, -40, -126, -43.5);
	newShape.visible = visible;
	cont.addChild(newShape);

	return newShape;
};

CanvasGeneral.prototype.createSBSpecialShapeBoundary = function(cont, name, fill, strokeW, strokeF, visible){
	var newShape = new createjs.Shape();
	newShape.name = name;
	newShape.graphics.beginFill(fill)
		.setStrokeStyle(strokeW).beginStroke("strokeF")
		.moveTo(-126, -43.5)
		.lineTo(-111, -43.5)
		.quadraticCurveTo(-110, 10, -60, 55)
		.lineTo(-78, 55)   
		.quadraticCurveTo(-100, 48, -120, 10)
		.bezierCurveTo(-130, -15, -135, -40, -126, -43.5);
	newShape.visible = visible;
	cont.addChild(newShape);

	return newShape;
};

CanvasGeneral.prototype.getCardValue = function(value){
	var cardVal = Number(value.replace( /\D/g, ''));
	if(!cardVal){
		var cardnum = value[0];
		switch(cardnum){
			case "A":
				cardVal = 1;
			break;
			case "J":
				cardVal = 11;
			break;
			case "Q":
				cardVal = 12;
			break;
			case "K":
				cardVal = 13;
			break;
		}
	}
	return cardVal;
};

CanvasGeneral.prototype.formatAmount = function(amount){
	var amt;
	var amount = (amount === "undefined" || amount === undefined) ? 0 : amount;
	if(amount > 999 &&amount < 1000000){
		var val = amount.toString();
		amt = val.substring(0, val.length-3);
		var excess = val[val.length-3];
		amt = (excess > 0) ? amt+"."+excess+"K" : amt+"K";
	}else if(amount > 999999 && amount < 1000000000){
		var val = amount.toString();
		amt = val.substring(0, val.length-6);
		var excess = val[val.length-6];
		amt = (excess > 0) ? amt+"."+excess+"M" : amt+"M";
	}else if(amount > 999999999 && amount < 1000000000000){
		var val = amount.toString();
		amt = val.substring(0, val.length-12);
		var excess = val[val.length-12];
		amt = (excess > 0) ? amt+"."+excess+"B" : amt+"B";
	}else amt = amount;
	return amt;
};

CanvasGeneral.prototype.checkSession = function(next){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
	  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	  	try{
		    var response = JSON.parse(xmlHttp.response);
		    if(response.st > 0){
		    	console.log("CHECK SESSION 1", false);
		    	next(false);
		    }else {
		    	console.log("CHECK SESSION 2", true);
		    	next(true);
		    }
	  	}catch(err){
	  		console.log("CHECK SESSION 3", false, err);
	  		next(false);
	  	}
	  }
	};
	xmlHttp.onerror = function(e){
		console.log("CHECK SESSION 4", false);
		next(false);
	};
	xmlHttp.open("GET", wsPath+"/browse", true); // true for asynchronous 
	xmlHttp.send(null);
};

CanvasGeneral.prototype.displayAlert = function(code){
	var self = this;
	CanvasPanelClass.setAlert(code, function(option){
	  if(option){
	  	var action = ErrorClass.list[code].action;
	  	if(self.isSBO && action === "windowClose" && self.isMobile){
	  		action = "gotoLogin";
	  	}
	    var func = ErrorClass[action];
	    func();
	  }
	CanvasPanelClass.hideAlert();
	});
};

CanvasGeneral.prototype.formatLimit = function(min, max){
	var val = 0, minLimit, maxLimit;
	minLimit = this.formatAmount(min);
	maxLimit = this.formatAmount(max);
	val = minLimit+" - "+maxLimit;

	return val;
};

CanvasGeneral.prototype.addMouseOverandOutBrightness = function(cont, x, y, w, h){
	var matrix = new createjs.ColorMatrix().adjustBrightness(50);

	cont.on("mouseover", function(e){
		cont.cursor = "pointer";
		cont.filters = [new createjs.ColorMatrixFilter(matrix)];
		cont.cache(x, y, w, h);
	});

	cont.on("mouseout", function(e){
		cont.cursor = "default";
		cont.uncache();
	});

	cont.on("mousedown", function(e){
		cont.uncache();
	});
};

CanvasGeneral.prototype.clearCGen = function(){
	this.selectedChip = 0;
	this.betsContainer = null;
	this.isFullScreen = false;
	this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	// this.isIOS = true;
	this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	this.balance = null;
	this.playerBalance = null;
	this.playerBalanceDisplay = null;
	// this.alertCanvas = null;
	this.delayBalanceUpdate = false;

	this.grayMatrix = new createjs.ColorMatrix().adjustHue(0).adjustSaturation(0);
	this.isWindowActive = true;
};

CanvasGeneral.prototype.subtractToBalance = function(subtrahend, isLast){
	var self = this;
	if(isLast){
		console.log("BAAAAAAL GET MY BALANCE subtract", self.balanceFromSocket, self.reconstructTotalBet);
		self.reconstructTotalBet = self.reconstructTotalBet + subtrahend;
		var bal = self.balanceFromSocket - self.reconstructTotalBet;
		setTimeout(function(){
			var newBalance = bal;
	   		CGameClass.balanceTemp = bal;
			self.animateBalance(CanvasPanelClass.balance, newBalance, function(playerBalanceDisplay, balance){
				CanvasPanelClass.balance = newBalance;
				var display = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
				CanvasPanelClass.balanceValue.text = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
			});
		}, (CanvasPanelClass.balance < 1) ? 0 : 100);

		self.reconstructTotalBet = 0;
	}else {
		self.reconstructTotalBet = self.reconstructTotalBet + subtrahend;
	}
}

CanvasGeneral.prototype.getRebetValues = function(){
	var rebetValues = {bets : {}, totalRebetAmount : 0};
	CGameClass.totalRebetAmount = 0;
	var rebets = CGameClass.rebetValues;
	var count = 0;
	for(var i in rebets){
		if(i.length < 4){
			rebetValues.bets[i] = rebets[i];
			rebetValues.totalRebetAmount = rebetValues.totalRebetAmount+rebets[i].stake;
		}
		count = count +1;
		if(Object.values(CGameClass.rebetValues).length === count){
			return rebetValues;
		}
	}
}

CanvasGeneral.prototype.pushStateHistory = function(){
	var self = this;
	self.tableUrl = window.location;
	// window.history.pushState(null, null, window.location.href);
}

CanvasGeneral.prototype.tableLimitClosed = function(data){
	var tableLimitData = data;
	var alert = (tableLimitData === 1) ? "table limit close" : "all table limit close";
	CanvasPanelClass.setAlert(alert, function(option){
	  if(option){
	  	var tableLimit = tableLimitData;
	  	var alertName = (tableLimit === 1) ? "table limit close" : "all table limit close";
	    var func = ErrorClass[ErrorClass.list[alertName].action];
	  	console.log("tableLimitClosed", tableLimit, alert, ErrorClass.list[alertName].action);
	    func();
	  	// setTimeout(function(){
	  	// }, 1000)
	  }
	  CanvasPanelClass.hideAlert();
	});
}

var CGenClass = new CanvasGeneral();

window.onpopstate = function(event) {
	// window.location = window.location.origin+wsPath+"/gotoPrev";
};

window.addEventListener("orientationchange", function() {

});

document.addEventListener("visibilitychange", function(e){
	console.log("visibilitychange", e.target.hidden);
	CGenClass.isWindowActive = !e.target.hidden;
	// socket.emit('window visibility', CGenClass.isWindowActive)
	if(!e.target.hidden){
		socket.emit("check state");
		TimerClass.clearTicker();
	}
});


document.addEventListener('contextmenu', function(event){
	event.preventDefault();
});

// window.addEventListener('beforeunload', function(event) {
// 	console.log("beforeunload")
// 	// window.location = userData.homeUrl;
// 	var xhr = new XMLHttpRequest();
// 	xhr.open("GET", "/gotoPrev", false); // third parameter of `false` means synchronous
// });
