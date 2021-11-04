var Loading = function(){
	this.socketLists = [
		"table limit",
		// "check tick",
		"get my balance",
		"table state",
		// "rebet status"
	];
	this.loadingSound = null;
	this.motdLists = [];
	this.loadComplete = false;
	this.loadDisplay = 0;
	this.maxDisplay = 0;
	this.progressWidth = {'width' : 0 + '%'};
	this.motd = null;
	this.imageState = { completed: false };
	this.loadedSockets = [];
	this.socketState = { completed: false };
	this.loadingTemplate = 		
		"<div class='svy-loading-page'>" +
		"	<div class='svy-loading-cont' id='loading-container'>" +
		"		<div class='svy-table-loading-wrap'>" +
		"			<canvas id='loadingStage' width='1280' height='720'>	" +
		"		</div>" +
		"	</div>" +
		"</div>";
	this.isJoined = false;

	this.loadingQueue = null;
	this.loadingStage = null;
	this.loadingMainContainer = null;
	this.percentLabel = null;
	this.loadingBar = null;
	this.loadingBarBitmap = null;
	this.loadingTicker = null;
	this.isCanvasCleared = false;

	this.isBettingOpen = false;
};

Loading.prototype.init = function(){
	var self = this;
	var container = document.createElement('div');
	container.id = "loadingPage";
	container.innerHTML = this.loadingTemplate;
	document.getElementById("canvas-container").appendChild(container);
	if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
		Howler._mobileEnabled = true;
		console.log("Howler", Howler)
	}else {
		Howler.mobileAutoEnable = true;
	}

	// var anHour = 3600000;

	// function oneMinuteAgo() {
	//   return Date.now() - anHour;
	// }

	// window.history.deleteRange({
	//   startTime: oneMinuteAgo(),
	//   endTime: Date.now()
	// });

	self.loadLoadingImages(function(){
		self.loadImages();
	});

	if(self.isCanvasCleared){
		var loadingContainer = document.getElementById('loading-container');
		if (CGenClass.isIOS) {
		  var diff = window.innerHeight/720;
		  var newW = diff*1280;
			if(loadingContainer){
				if(newW <= 405){
			      loadingContainer.style.height = 171.4 + "%";
				}else {
			      loadingContainer.style.height = 100 + "%";
				}
			}
		}
	}
	
	CGameClass.sessionInterval = setInterval(function(){
	  CGenClass.checkSession(function(status){
	    if(!status){
	        CGenClass.displayAlert("invalid session");
	    }
	  });
	}, 60000);

	// setTimeout(function(){
	// 	CGenClass.displayAlert("kick player");
	// }, 5000);

	// setTimeout(function(){
	// 	CGenClass.displayAlert("invalid session");
	// }, 8000);
};

Loading.prototype.loadLoadingImages = function(next){
	var self = this;
	self.loadingQueue = new createjs.LoadQueue(true);
	self.loadingQueue.loadManifest(ResourcesClass.loadingResources);
	self.loadingQueue.addEventListener("complete", complete);

	function complete() {
		console.log("loading loading images complete");
		self.createLoadingContainer(function(){
			next();
			self.loadingTicker = createjs.Ticker.addEventListener("tick", function(){
				self.loadingStage.update();
				createjs.Ticker.useRAF = true;
				createjs.Ticker.timingMode = createjs.Ticker.RAF;
				createjs.Ticker.framerate = 60;
			});
		});
	}
};

Loading.prototype.createLoadingContainer = function(next){
	var self = this;
	self.loadingStage = new createjs.Stage(document.getElementById("loadingStage"));
	self.loadingStage.name = "loadingStage";
	self.loadingStage.enableMouseOver();

	self.loadingMainContainer = CGenClass.createContainer(self.loadingStage, "loadingMainContainer", true);
	self.loadingMainContainer.x = self.loadingStage.canvas.width / 2;
	self.loadingMainContainer.y = self.loadingStage.canvas.height / 2;

	self.percentLabel = CGenClass.createText(self.loadingMainContainer, "percentLabel", "center", "middle", "#FAFF00", "500 46px Roboto CondensedBold", 0+"%");
	self.percentLabel.y = 121;
	self.percentLabel.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 8);
	var loadingLabel = CGenClass.createText(self.loadingMainContainer, "loadingLabel", "center", "middle", "#FAFF00", "900 30px Roboto CondensedBold", TranslationClass.getTranslation("loading"));
	loadingLabel.y = 162;
	loadingLabel.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 8);
	var logo = CGenClass.createLoadingBitmap(self.loadingMainContainer, "logo", "logo", 0.53, self.loadingQueue);
	logo.regX = logo.image.width / 2;
	logo.regY = logo.image.height / 2;
	logo.y = 271;
	logo.scaleX = logo.scaleY = 0.53;

	var loadingBarContainer = CGenClass.createContainer(self.loadingMainContainer, "loadingBarContainer", true);
	loadingBarContainer.y = 192;
	var loadingBarBorder = CGenClass.createRoundRect(loadingBarContainer, "loadingBarBorder", "rgba(0,0,0,.4)", 1, "rgba(0,0,0,0)", 1045, 16, 7.5, true);
	loadingBarBorder.shadow = new createjs.Shadow("rgba(0, 0, 0, .5)", 0, 7, 8);
	self.loadingBar = loadingBarContainer.addChild(new createjs.Shape());
	self.loadingBar.name = "loadingBar";
	self.loadingBar.graphics
		.setStrokeStyle(1).beginStroke("rgba(0,0,0,0)")
		.beginFill("rgba(0,0,0,0)").drawRoundRect(0, 0, 1043, 13, 6.5);
	self.loadingBar.regY = self.loadingBar.graphics.command.h / 2;
	self.loadingBar.regX = self.loadingBar.graphics.command.w / 2;

	self.loadingBarBitmap = CGenClass.createLoadingBitmap(loadingBarContainer, "loading_bar", "loadingBarBitmap", 1, self.loadingQueue);
	self.loadingBarBitmap.regY = self.loadingBarBitmap.image.height / 2;
	self.loadingBarBitmap.mask = self.loadingBar;
	self.loadingBarBitmap.scaleX = 0;
	self.loadingBarBitmap.x = -521.5;
	console.log("##CANVAS loadingMainContainer", self.loadingMainContainer);
	next();
};

Loading.prototype.loadImages = function(){
	var self = this;
	if (self.loadComplete || self.imageState.completed) return;
	ResourcesClass.loadQueue = new createjs.LoadQueue(true);
	ResourcesClass.loadQueue.loadManifest(ResourcesClass.resources);
	ResourcesClass.loadQueue.addEventListener("complete", complete);

	function complete() {
		console.log("loading images complete");
		self.imageState.completed = true;
		SpriteClass.init(function(){
			CGenClass.createStage(function(){
				console.log("container successfully created");
				CGameClass.init();
				self.setMaxPercent(20);
				self.createHowlerAudio();
			});
		});
	}
};
Loading.prototype.getMOTD = function(){
	
};
Loading.prototype.createHowlerAudio = function(){
	var self = this;
	console.log("navigator.userAgent", navigator.userAgent, CGenClass.isIOS)
	if (self.loadComplete || SoundClass.loadState.state) return;
	for(var i=0; i<ResourcesClass.audio.length; i++){
		var file = (CGenClass.isIOS && ResourcesClass.audio[i].id === "bg") ? [rsPath+'/sounds/loopingfinal.mp3'] : [ResourcesClass.audio[i].src];
		SoundClass.audio[ResourcesClass.audio[i].id] = new Howl({
			src : file,
			sprite : ResourcesClass.audio[i].sprite ? ResourcesClass.audio[i].sprite : null,
			volume : ResourcesClass.audio[i].volume ? 1 : 1,
			preload : true,
			loop: ResourcesClass.audio[i].loop ? true : false,
			html5: ResourcesClass.audio[i].loop ? true : false,
			// autoplay: ResourcesClass.audio[i].autoplay ? true : false,
			onload: (function () {
				SoundClass.loadState.count++;
				// Condition for safari because of some files already loaded.
				// var audioLen = u.uAgent.isSafari === true ? ResourcesClass.audio.length - 2 : ResourcesClass.audio.length;
				if (SoundClass.loadState.count >= ResourcesClass.audio.length) {
					console.log('loading sounds complete...', SoundClass.audio);
					SoundClass.loadState.state = true;
					self.setMaxPercent(80);
					self.checkLoading();
				}
			}())
		});
	}

};
Loading.prototype.reloadGame = function(next){
	next();
};
Loading.prototype.loadItems = function(data){
	console.log("load ITEMS", data)
	if(this.loadComplete || this.socketState.completed) return;
	var listIndex = this.socketLists.indexOf(data);
	
	if(this.socketLists[listIndex] === data && this.loadedSockets.indexOf(data) === -1) {
		this.loadedSockets.push(data);
		this.checkLoading();
	}
	
	if(this.loadedSockets.length === this.socketLists.length){
		console.log('loading sockets complete...');
		this.socketState.completed = true;
	}
};
Loading.prototype.checkLoading = function(){
	// check the loading of sounds state
	if(SoundClass.loadState.state){
		this.setMaxPercent(80 + (this.loadedSockets.length/this.socketLists.length) * 20);
	}
};
Loading.prototype.setMaxPercent = function(max){
	this.maxDisplay = max;
	console.log("setMaxPercent", max)
	this.updateDisplay();
};
Loading.prototype.updateDisplay = function(){
	var self = this;
	if(!this.loadComplete){
		if(this.loadDisplay === 100){
			this.reloadGame(function(){
				self.updatePercent();
				self.loadFinish();
			});
		}else {
			if(this.loadDisplay === 80){
				if(!self.isJoined){
					self.isJoined = true;
					socket.emit("join room");
					socket.emit('get my balance');
					socket.emit('table limit');
					console.log("loadDisplay", this.loadDisplay);
				}
			}
			setTimeout(function(){
				if(self.loadDisplay < self.maxDisplay){
					self.updatePercent();
					self.loadDisplay++;
					self.progressWidth = { 'width': self.loadDisplay + '%' };
					self.updateDisplay();
				}
			}, 20);
		}
	}
};

Loading.prototype.updatePercent = function(){
	var self = this;
	self.percentLabel.text = self.loadDisplay+"%";
	self.loadingBarBitmap.scaleX = self.loadDisplay/100;
};

Loading.prototype.loadFinish = function(){
	this.loadComplete = true;
	// socket.emit("load finish");
	socket.emit('playerbet history');
	setTimeout(function(){
		var canvasContainer = document.getElementById("canvas-container");
		var loadingPage = document.getElementById("loadingPage");
		canvasContainer.removeChild(loadingPage);
		setTimeout(function(){
			CanvasPanelClass.placeBetDisplay(false);
		}, 5000);
	}, 1000);
};

Loading.prototype.checkBetTick = function(tick){
	var self = this;
	if(!self.loadComplete){
		if(!TimerClass.tickStarted){
			if(tick.curr >= 2){
				self.loadItems("check tick");
				console.log("load items check tick")
			}
		}
	}
};

Loading.prototype.checkState = function(data){
	var self = this;
	// state: { type: Number }, // (0=Dealing, 1=Betting Open, 2=Closed, 3=Shuffling )
	self.loadItems("table state");
	self.isBettingOpen = (data.state === 1) ? true : false;
	if(self.isBettingOpen){
		CGameClass.hideWaitForNextRoundContainer();
		CChipsClass.enableChips();
		EmojiClass.addTaunt(CSeatClass.selectedSeat, self.isBettingOpen);
	}else{
		EndTimerClass.clearTicker();
		var tick = {curr : 20, max : 20};
		EndTimerClass.setEndTimer(tick);
		EndTimerClass.endTimer = setInterval(function () {
		  if(tick.curr === 0){
		    // clearInterval(EndTimerClass.endTimer);
		  }else{
		  	tick.curr = tick.curr - 1;
		    EndTimerClass.setEndTimer(tick);
		  }
		}, 1000);
	}
};

Loading.prototype.checkNewRound = function(){
	var self = this;
	if(!self.loadComplete){
		console.log("load items check round")
		self.loadItems("check tick");
	}
};

Loading.prototype.clearLoading = function(){
	this.isCanvasCleared = true;
	this.socketLists = [
		"table limit",
		"check tick",
		"get my balance",
		// "rebet status"
	];
	this.loadingSound = null;
	this.motdLists = [];
	this.loadComplete = false;
	this.loadDisplay = 0;
	this.maxDisplay = 0;
	this.progressWidth = {'width' : 0 + '%'};
	this.motd = null;
	this.imageState = { completed: false };
	this.loadedSockets = [];
	this.socketState = { completed: false };
	this.loadingTemplate = 		
		"<div class='svy-loading-page'>" +
		"	<div class='svy-loading-cont' id='loading-container'>" +
		"		<div class='svy-table-loading-wrap'>" +
		"			<canvas id='loadingStage' width='1280' height='720'>	" +
		"		</div>" +
		"	</div>" +
		"</div>";
	this.isJoined = false;

	this.loadingQueue = null;
	this.loadingStage = null;
	this.loadingMainContainer = null;
	this.percentLabel = null;
	this.loadingBar = null;
	this.loadingBarBitmap = null;
	this.loadingTicker = null;

	this.isBettingOpen = false;
};

var LoadingClass = new Loading();

document.addEventListener('DOMContentLoaded', function(){
	
	LoadingClass.init();

	CGenClass.pushStateHistory();

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	  CGenClass.isMobile = true;
	}

	onResize(CGenClass.isMobile);

	var innerW, innerH, outerW, outerH;
	innerW = window.innerWidth;
	innerH = window.innerHeight;
	outerW = window.outerWidth;
	outerH = window.outerHeight;
	var diffW = outerW - innerW;
	var diffH = outerH - innerH;

	if(!CGenClass.isMobile){
		if(CGenClass.isSBO) {
			window.resizeTo(1280+diffW, 720+diffH);
		}else{
			window.resizeTo(1280+diffW, 832+diffH);
		}
	}
	var current = 0;
	document.getElementById("gameStage").addEventListener("mousewheel", function(e){
		if(LoadingClass.loadComplete){
			var standingPlayersListMainContainer = CGameClass.gameContainer.getChildByName("standingPlayersListMainContainer");
			if(standingPlayersListMainContainer.visible){
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				StandingClass.currentY = StandingClass.currentY + delta;
				StandingClass.scrollList(StandingClass.currentY);
			    console.log("mousewheel", StandingClass.currentY, StandingClass.scrollStart)
			    e.preventDefault();
			}
		}
	});
	
	if(!CGenClass.isSBO){
		var stylesHref = '/assets/game_popup/css/popup.css?gt.ver.0',
		templateStyleHref = '/assets/css/template.css',
		style = document.getElementById('dynaStyles'),
		templateStyle = document.getElementById('templateStyle'),
		splitUrl = window.location.host.split('.');
		if(splitUrl[0] === '192'){
			style.href = 'https://www.338alab.com/assets/game_popup/css/popup.css?gt.ver.0';
			templateStyle.href = 'https://games.338alab.com/assets/css/template.css';
		}else{
			var path = splitUrl[1] + '.' + splitUrl[2];

			var rsoPath = 'https://www.' + path;

			style.href = rsoPath+stylesHref;
			templateStyle.href = 'https://games.' + path + templateStyleHref;
		}
	}else {
		// document.getElementById('dynaIcon').href = rsPath + "/images/sbo/favicon.ico";
		// document.getElementById('dynaAppleIcon').href = rsPath + "/images/sbo/favicon.ico";
	}

	var xPos = (window.screen.width / 2) - (1300 / 2);
	var yPos = (window.screen.height / 2) - (900 / 2);
	window.moveTo(xPos, yPos);

	setTimeout(function(){
		onResize(CGenClass.isMobile);
	}, 200);

});

document.addEventListener('click', function(){
	SoundClass.playIntro();
	// if(Howler.ctx && Howler.ctx.state && Howler.ctx.state == "suspended") {
	//     Howler.ctx.resume().then(function() {
	//         // console.log("AudioContext resumed!");
	//         // fire your callback here
	//     });
	// }
});