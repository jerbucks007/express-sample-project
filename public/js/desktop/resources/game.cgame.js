var CanvasGame = function(){
	this.betOption = [
		{name : "Dragon", label: "D", displayname: "D R A G O N", w: 500, h: 274, x: -381, y: -139, color: "rgba(213, 0, 0, .5)", betValue : 0, border: [9, 9, 9, 9], code: "DRG", font : "900 58px Roboto CondensedBold", fcolor: "#d50000", ratio: "1:1", tableLimit: "dragontiger"},
		{name : "Tiger", label: "T", displayname: "T I G E R", w: 500, h: 274, x: 381, y: -139, color: "rgba(0, 0, 255, .3)", betValue : 0, border: [9, 9, 9, 9], code: "TGR", font : "900 58px Roboto CondensedBold", fcolor: "#0000ff", ratio: "1:1", tableLimit: "dragontiger"},
		{name : "Tie", label: "Tie", displayname: "TIE", w: 196, h: 180, x: 0, y: 96, color: "rgba(14, 232, 55, .3)", betValue : 0, border: [9, 9, 9, 9], code: "TIE", font : "900 24px Roboto CondensedBold", fcolor: "#0ee837", ratio: "8:1", tableLimit: "tie"},
	];
	this.sideBetOption = [
		{name : "Big", label: "B", w: 262, h: 99.5, x0: -119, x1: -147, y: -52, color: "gray", betValue : 0, border: [9, 9, 9, 9], code:"BIG", ratio : "1:1", tableLimit: "bigsmall"},
		{name : "Small", label: "S", w: 262, h: 99.5, x0: 147, x1: 119, y: -52, color: "gray", betValue : 0, border: [9, 9, 9, 9], code:"SML", ratio : "1:1", tableLimit: "bigsmall"},
		{name : "Red", label: "R", w: 262, h: 99.5, x0: -120, x1: -147, y: 52, color: "red", betValue : 0, border: [9, 9, 9, 9], code:"RED", ratio : "1:1", tableLimit: "suitcolor"},
		{name : "Black", label: "BLK", w: 262, h: 99.5, x0: 147, x1: 118, y: 52, color: "black", betValue : 0, border: [9, 9, 9, 9], code:"BLK", ratio : "1:1", tableLimit: "suitcolor"},
	];	
	this.cardSlot = [
		{name: "Dragon", w: 105, h: 162, r: 8, x: -67},
		{name: "Tiger", w: 105, h: 162, r: 8, x: 69},
	];
	this.gameContainer = null;
	this.betHereMainContainer = null;
	this.results = [];
	this.resourcesComplete = false;
	this.tableDetails = null;
	this.haveBet = false;
	this.allBets = [];

	this.betOrigins = {
		DRG : {x: -382, y: -215, tbx : -381, tby : -23}, 
		TGR : {x: 382, y: -215, tbx : 381, tby : -23}, 
		TIE : {x: 0, y: 20, tbx : 0, tby : 27},
		DRGBIG : {x: -500, y: -27, tbx : -500, tby : 23}, 
		DRGSML : {x: -234, y: -27, tbx : -233, tby : 23}, 
		DRGRED : {x: -502, y: 76, tbx : -500, tby : 127}, 
		DRGBLK : {x: -234, y: 76, tbx : -233, tby : 127}, 
		TGRBIG : {x: 234, y: -27, tbx : 233, tby : 23}, 
		TGRSML : {x: 502, y: -27, tbx : 500, tby : 23}, 
		TGRRED : {x: 234, y: 76, tbx : 233, tby : 127}, 
		TGRBLK : {x: 502, y: 76, tbx : 500, tby : 127}, 
	};
	this.totalBetTemp = 0;
	this.balanceTemp = 0;

	this.cardValueDrg = null;
	this.cardValueTgr = null;

	this.tableMinVal = null;
	this.tableMaxVal = null;

	this.rebetValues = {};
	this.totalRebetAmount = 0;

	this.standingplayerCount = null;

	this.gameRoundLabel = null;

	this.statusLabel = null;
	this.tableBitmap = null;
	this.gradientLineTop = null;
	this.gradientLineBot = null;
	this.isDrawingPhase = false;
	// this.isPlayerBet = false;
	this.gameTicker = null;

	this.numOfRounds = 0;
	this.isBetHereVisible = false;
	// this.isPlaceBetInfoVisible = (localStorage.getItem("isPlaceBetAlreadyShowed")) ? false : true;
	this.isPlaceBetInfoVisible = true;
	this.placeBetInfoContainer = null;
	this.canBet = true;

	this.rebetValuesTemp = {};
	this.totalRebetTemp = null;

	this.sessionInterval = null;

	this.isSideBetDisabled = false;
	this.sideBetDisableContainer = null;
	this.roundCounter = 0;

	this.tableNameLabel = null;
	this.playerCountLabel = null;
	this.tableInfo = {tableName : "null", maxPlayer: 50};
	this.tableNameHitArea = null;

	this.waitForNextRoundContainer = null;
	this.playerCountIcon = null;

	this.currentBetType = null;
};

CanvasGame.prototype.init = function(){
	var self = this;
	this.createGameContainer(function(){
		self.createTableContainer(function(){
			self.createTableHeaderContainer(function(){
				self.createCardSlotContainer(function(){
					TimerClass.createTimerContainer(function(){
						RoadMapClass.createRoadmapContainer(function(){
							self.createSideBetDisableContainer(function(){
								self.createBetsContainer(function(){
									self.createBetHereContainer(function(){
										self.createShufflingContainer(function(){
											CSeatClass.createSeats(function(){
												self.createTotalBetContainer(function(){
													self.createWaitForNextRoundContainer();
													self.createMinMaxContainer(function(){
														EmojiClass.createBubbleContainer(function(){
															EmojiClass.createTauntContainer(function(){
																self.createBettingStatusContainer(function(){
																	StandingClass.createStandingContainer(function(){
																		self.createNotifContainer(function(){
																			self.createResultContainer(function(){
																				CanvasPanelClass.init();
																				self.gameTicker = createjs.Ticker.on("tick", CGenClass.updateGameStage);
																				console.log("##CANVAS- mainContainer", CGenClass.mainContainer);
																				console.log("##CANVAS- alertMainContainer", CGenClass.alertMainContainer);
																				self.resourcesComplete = true;
																				if(CGenClass.isMobile){
																					createjs.Ticker.useRAF = true;
																					createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
																					createjs.Ticker.framerate = 30;
																					createjs.Ticker.setFPS(30);
																				}else{
																					createjs.Ticker.useRAF = true;
																					if(!CGenClass.isSafari) createjs.Ticker.timingMode = createjs.Ticker.RAF;
																					createjs.Ticker.framerate = 60;
																				}
																			});
																		});
																	});
																});
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
};
CanvasGame.prototype.createGameContainer = function(next){
	var self = this;
	self.gameContainer = CGenClass.createContainer(CGenClass.mainContainer, "gameContainer", true);

	console.log("##CANVAS gameContainer", self.gameContainer);
	next();
};
CanvasGame.prototype.createTableContainer = function(next){
	var self = this;
	var tableContainer = CGenClass.createContainer(this.gameContainer, "tableContainer", true);
	tableContainer.y = -80;

	self.tableBitmap = CGenClass.createBitmap(tableContainer, "table", "tableBitmap", 1);
	self.tableBitmap.y = 80;
	var betOptionsContainer = CGenClass.createContainer(tableContainer, "betOptionsContainer", true);
	for(var i=0; i<self.betOption.length; i++){
		(function () {
			var index = i;
			var betOptionContainer = CGenClass.createContainer(betOptionsContainer, "betOptionContainer-"+index, true);
			betOptionContainer.x = self.betOption[index].x;
			betOptionContainer.y = self.betOption[index].y;
			var betBgContainer = CGenClass.createContainer(betOptionContainer, "betBgContainer", true);
			var betOptionBg = CGenClass.createRoundRectComplex(betBgContainer, "betOptionBg", self.betOption[index].color, 1, "rgba(0, 0, 0, 0)", self.betOption[index].w, self.betOption[index].h, self.betOption[index].border, true);
			betOptionBg.alpha = 0;
			var betOptionHitArea = CGenClass.createRoundRectComplex(betBgContainer, "betOptionHitArea", "rgba(255, 255, 255, 1)", 1, "#000", self.betOption[index].w, self.betOption[index].h, self.betOption[index].border, false);
			betBgContainer.hitArea = betOptionHitArea;
			var betLabel = CGenClass.createText(betOptionContainer, "betLabel", "center", "middle", self.betOption[index].fcolor, self.betOption[index].font, TranslationClass.getTranslation(self.betOption[index].name));
			betLabel.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 6);
			betLabel.y = (index < 2) ? -20 : -7;
			var betRatio = CGenClass.createText(betOptionContainer, "betRatio", "center", "middle", "#dde8e4", "700 18px Roboto CondensedBold", self.betOption[index].ratio);
			betRatio.y = (index < 2) ? 17 : 20;
			betBgContainer.on("click", function(e){
				self.sendBet(self.betOption[index].code, null, false, self.betOption[index].tableLimit, CChipsClass.chips[CGenClass.selectedChip]);
			});
			console.log("##CANVAS betOptionContainer", betOptionContainer);
			if(index<2){
				self.createSideBetContainer(index, betOptionContainer, self.betOption[index].color, self.betHereMainContainer);
			}else {
				var tieInfo = CGenClass.createText(betOptionContainer, "tieInfo", "center", "middle", "#FFF", "200 18px Roboto Condensed", TranslationClass.getTranslation("allSideBets"));
				tieInfo.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 4, 6);
				tieInfo.y = 103;
			}
		})();
	}
	console.log("##CANVAS tableContainer", tableContainer);
	next();
};
CanvasGame.prototype.createSideBetContainer = function(index, betOptionContainer, color, betHereMainContainer){
	var self = this;
	var border = (index > 0) ? [7, 7, 120, 7] : [7, 7, 7, 120];
	var sideBetOptionsContainer = CGenClass.createContainer(betOptionContainer, "sideBetOptionsContainer", true);
	sideBetOptionsContainer.y = 243;
	for(var i=0; i<self.sideBetOption.length; i++){
		(function () {
			var sindex = i;
			var sideBetOptionContainer = CGenClass.createContainer(sideBetOptionsContainer, "sideBetOptionContainer-"+sindex, true);
			sideBetOptionContainer.x = self.sideBetOption[sindex]["x"+index];
			sideBetOptionContainer.y = self.sideBetOption[sindex].y;
			console.log("sideBetOptionContainer", sideBetOptionContainer)
			var sidebetBgContainer = CGenClass.createContainer(sideBetOptionContainer, "sidebetBgContainer", true);
			var sbBorder = self.sideBetOption[sindex].border;
			var betOptionHitArea, sideBetOptionBg, boundaryCont;
			if((sindex === 2 && index < 1) || (sindex > 2 && index > 0)){
				sideBetOptionBg = CGenClass.createSBSpecialShape(sidebetBgContainer, "sideBetOptionBg", color, 1, "rgba(0, 0, 0, 0)", true);
				sideBetOptionBg.alpha = 0;
				betOptionHitArea = CGenClass.createSBSpecialShape(sidebetBgContainer, "betOptionHitArea", "rgba(255, 255, 255, 1)", 1, "#000", false);
				sidebetBgContainer.y = -5;
				sidebetBgContainer.x = (sindex === 2 && index < 1) ? 1 : -1;
				sideBetOptionContainer.hitArea = betOptionHitArea;
				sideBetOptionContainer.scaleX = (sindex === 2 && index < 1) ? 1 : -1;
				var sideBetOptionLabel = CGenClass.createText(sideBetOptionContainer, "sideBetOptionLabel", "center", "middle", "#ddebe6", "700 24px Roboto CondensedBold", TranslationClass.getTranslation(self.sideBetOption[sindex].name).toUpperCase());
				sideBetOptionLabel.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 6);
				sideBetOptionLabel.y = -8;
				sideBetOptionLabel.scaleX = (sindex === 2 && index < 1) ? 1 : -1;
				var sideBetRatio = CGenClass.createText(sideBetOptionContainer, "sideBetRatio", "center", "middle", "#dde8e4", "700 18px Roboto CondensedBold", self.sideBetOption[sindex].ratio);
				sideBetRatio.y = 18;
				sideBetRatio.scaleX = (sindex === 2 && index < 1) ? 1 : -1;
			}else{
				sideBetOptionBg = CGenClass.createRoundRectComplex(sidebetBgContainer, "sideBetOptionBg", color, 1, "rgba(0, 0, 0, 0)", self.sideBetOption[sindex].w, self.sideBetOption[sindex].h, sbBorder, true);
				sideBetOptionBg.alpha = 0;
				betOptionHitArea = CGenClass.createRoundRectComplex(sidebetBgContainer, "sideBetOptionBg", "rgba(255, 255, 255, 1)", 1, "#000", self.sideBetOption[sindex].w, self.sideBetOption[sindex].h, sbBorder, false);
				sideBetOptionContainer.hitArea = betOptionHitArea;
				var sideBetOptionLabel = CGenClass.createText(sideBetOptionContainer, "sideBetOptionLabel", "center", "middle", "#ddebe6", "700 24px Roboto CondensedBold", TranslationClass.getTranslation(self.sideBetOption[sindex].name).toUpperCase());
				sideBetOptionLabel.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 6);
				sideBetOptionLabel.y = -8;
				var sideBetRatio = CGenClass.createText(sideBetOptionContainer, "sideBetRatio", "center", "middle", "#dde8e4", "700 18px Roboto CondensedBold", self.sideBetOption[sindex].ratio);
				sideBetRatio.y = 18;
			}

			sideBetOptionContainer.on("click", function(e){
				// if(!self.isSideBetDisabled){
					var betType = (index < 2) ? self.betOption[index].code : null;
					self.sendBet(betType, self.sideBetOption[sindex].code, false, self.sideBetOption[sindex].tableLimit, CChipsClass.chips[CGenClass.selectedChip]);
				// }else{
					  
				// }
			});
		})();
	}
	console.log("##CANVAS sideBetOptionsContainer", sideBetOptionsContainer);
};
CanvasGame.prototype.createCardSlotContainer = function(next){
	var self = this;
	var tableContainer = this.gameContainer.getChildByName("tableContainer");
	var cardSlotMainContainer = CGenClass.createContainer(tableContainer, "cardSlotMainContainer", true);
	cardSlotMainContainer.y = -97;
	for(var i=0; i<self.cardSlot.length; i++){
		(function () {
			var index = i;
			var cardSlotContainer = CGenClass.createContainer(cardSlotMainContainer, "cardSlotContainer-"+index, true);
			cardSlotContainer.x = self.cardSlot[index].x;
			cardSlotContainer.y = -47;
			cardSlotContainer.scale = 1.41;
		})();
	}
	self.cardValueDrg = CGenClass.createText(cardSlotMainContainer, "cardValueDrg", "center", "middle", "#FFF", "400 40px Roboto Condensed", "");
	self.cardValueDrg.y = (CGenClass.isMobile && CGenClass.isIOS) ? 68 : 73;
	self.cardValueDrg.x = self.cardSlot[0].x;
	self.cardValueTgr = CGenClass.createText(cardSlotMainContainer, "cardValueTgr", "center", "middle", "#FFF", "400 40px Roboto Condensed", "");
	self.cardValueTgr.y = (CGenClass.isMobile && CGenClass.isIOS) ? 68 :73;
	self.cardValueTgr.x = self.cardSlot[1].x;

	console.log("##CANVAS cardSlotMainContainer", cardSlotMainContainer, self.cardValueDrg);
	next();
};
CanvasGame.prototype.createBetsContainer = function(next){
	var self = this;
	CGenClass.betsContainer = CGenClass.createContainer(self.gameContainer, "betsContainer", true);
	CGenClass.betsContainer.y = -80;

	var fpsLabel = CGenClass.createText(CGenClass.mainContainer, "fpsLabel", "center", "middle", "green", "900 25px Century Gothic", "");
	next();
};

CanvasGame.prototype.createSideBetDisableContainer = function(next){
	var self = this;
	self.sideBetDisableMainContainer = CGenClass.createContainer(self.gameContainer, "sideBetDisableMainContainer", false);
	self.sideBetDisableMainContainer.y = -80;
	for(var i=0; i<self.betOption.length; i++){
		(function () {
			var index = i;		
			if(index<2){
				for(var ii=0; ii<self.sideBetOption.length; ii++){
					(function () {
						var sindex = ii;
						var sbBorder = self.sideBetOption[sindex].border;
						if((sindex === 2 && index < 1) || (sindex > 2 && index > 0)){
							var sideBetDisableContainer = CGenClass.createContainer(self.sideBetDisableMainContainer, "betHereContainer-"+index+sindex, true);
							sideBetDisableContainer.x = self.sideBetOption[sindex]["x"+index] + self.betOption[index].x;
							sideBetDisableContainer.y = 150;
							sideBetDisableContainer.scaleX = (index > 0) ? -1 : 1;
							var betHereBg = CGenClass.createSBSpecialShape(sideBetDisableContainer, "betHereBg", "rgba(0, 0, 0, .5)", 1, "rgba(0,0,0,0)", true);
						}else{
							var sideBetDisableContainer = CGenClass.createContainer(self.sideBetDisableMainContainer, "betHereContainer-"+index+sindex, true);
							sideBetDisableContainer.x = self.sideBetOption[sindex]["x"+index] + self.betOption[index].x;
							sideBetDisableContainer.y = (sindex > 1) ? 157 : 52;
							var betHereBg = CGenClass.createRoundRectComplex(sideBetDisableContainer, "betHereBg", "rgba(0, 0, 0, .5)", 1, "rgba(0, 0, 0, 0)", self.sideBetOption[sindex].w, self.sideBetOption[sindex].h, sbBorder, true);
						}
					})();
				}
			}
		})();
	}
	next();
};

CanvasGame.prototype.disableSideBetContainer = function(data){
	var self = this;
	self.roundCounter = data.counter;
	if(self.roundCounter > 50){
		self.isSideBetDisabled = true;
		self.sideBetDisableMainContainer.visible = true;
	}else {
		self.isSideBetDisabled = false;
		self.sideBetDisableMainContainer.visible = false;
	}
	if(self.roundCounter === 51){
	  CanvasPanelClass.setAlert("side bet alert", function(option){
		  if(option){
	      var func = ErrorClass[ErrorClass.list["side bet alert"].action];
	      func();
	      CanvasPanelClass.hideAlert();
	    }
	  });
	  setTimeout(function(){
	  	if(CanvasPanelClass.currentErrorCode === "side bet alert"){
	  		CanvasPanelClass.hideAlert();
	  	}
	  }, 1500)
	}
};

CanvasGame.prototype.createBetHereContainer = function(next){
	var self = this;
	self.betHereMainContainer = CGenClass.createContainer(self.gameContainer, "betHereMainContainer", false);
	self.betHereMainContainer.y = -80;
	for(var i=0; i<self.betOption.length; i++){
		(function () {
			var index = i;		
			var betHereContainer = CGenClass.createContainer(self.betHereMainContainer, "betHereContainer-"+index, true);
			betHereContainer.x = self.betOption[index].x;
			betHereContainer.y = self.betOption[index].y;
			var betHereBg = CGenClass.createRoundRectComplex(betHereContainer, "betHereBg", "rgba(0,0,0,.5)", 1, "rgba(0, 0, 0, 0)", self.betOption[index].w, self.betOption[index].h, self.betOption[index].border, true);
			var betHereBorder = CGenClass.createBitmap(betHereContainer, (index<2) ? "bethere_main" : "bethere_tie", "betHereBorder", 1);
			var betHereText = CGenClass.createText(betHereContainer, "betHereText", "center", "middle", "#FFF", (index < 2) ? "200 30px Roboto Condensed" : "200 20px Roboto Condensed" , TranslationClass.getTranslation("tapToPlaceBet"));
			betHereText.shadow = new createjs.Shadow("rgba(0, 255, 255, 1)", 0, 0, 6);
			betHereText.y = (index < 2) ? 65 : 55;
			if(index<2){
				for(var ii=0; ii<self.sideBetOption.length; ii++){
					(function () {
						var sindex = ii;
						var sbBorder = self.sideBetOption[sindex].border;
						if((sindex === 2 && index < 1) || (sindex > 2 && index > 0)){
							var sidebetHereContainer = CGenClass.createContainer(self.betHereMainContainer, "betHereContainer-"+index+sindex, true);
							sidebetHereContainer.x = self.sideBetOption[sindex]["x"+index] + self.betOption[index].x;
							sidebetHereContainer.y = 150;
							sidebetHereContainer.scaleX = (index > 0) ? -1 : 1;
							var betHereBg = CGenClass.createSBSpecialShape(sidebetHereContainer, "betHereBg", "rgba(0, 0, 0, .5)", 1, "rgba(0,0,0,0)", true);
							var betHereBorder = CGenClass.createBitmap(sidebetHereContainer, "bethere_subspec", "betHereBorder", 1);
							betHereBorder.scaleX = -1;
							betHereBorder.y = 5;
						}else{
							var sidebetHereContainer = CGenClass.createContainer(self.betHereMainContainer, "betHereContainer-"+index+sindex, true);
							sidebetHereContainer.x = self.sideBetOption[sindex]["x"+index] + self.betOption[index].x;
							sidebetHereContainer.y = (sindex > 1) ? 157 : 52;
							var betHereBg = CGenClass.createRoundRectComplex(sidebetHereContainer, "betHereBg", "rgba(0, 0, 0, .5)", 1, "rgba(0, 0, 0, 0)", self.sideBetOption[sindex].w, self.sideBetOption[sindex].h, sbBorder, true);
							var betHereBorder = CGenClass.createBitmap(sidebetHereContainer, "bethere_sub", "betHereBorder", 1);
						}
					})();
				}
			}
		})();
	}

	var betHereHeader = CGenClass.createContainer(self.betHereMainContainer, "betHereHeader", true);
	betHereHeader.y = -256;
	var shoeContainer = CGenClass.createContainer(betHereHeader, "shoeContainer", true);
	var shoeContainerBg = CGenClass.createRect(shoeContainer, "shoeContainerBg", "#FFF", 0, "#000", 180, 90, false);
	shoeContainer.hitArea = shoeContainerBg;
	shoeContainer.x = 208;
	shoeContainer.y = 18;
	var shoeSprite = SpriteClass.createSprite(shoeContainer, SpriteClass.tableSpriteSheet, "shoe", "shoeSprite", 1);

	var burnCardsContainer = CGenClass.createContainer(betHereHeader, "burnCardsContainer", true);
	burnCardsContainer.x = -168; //-162
	burnCardsContainer.y = 6; //0
	var burnSprite = SpriteClass.createSprite(burnCardsContainer, SpriteClass.tableSpriteSheet, "burnCard", "burnSprite", 1);
	next();
};

CanvasGame.prototype.createTotalBetContainer = function(next){
	var self = this;
	var tableContainer = self.gameContainer.getChildByName("tableContainer");
	var totalBetsContainer = CGenClass.createContainer(self.gameContainer, "totalBetsContainer", true);
	totalBetsContainer.y = -80;
	for(var i in self.betOrigins){
		(function(){
			var index = i;
			var totalBetContainer = CGenClass.createContainer(totalBetsContainer, "totalBetContainer-"+index, true);
			totalBetContainer.x = self.betOrigins[i].tbx;
			totalBetContainer.y = self.betOrigins[i].tby;
			totalBetContainer.alpha = 0;
			var betAmountBg = SpriteClass.createSprite(totalBetContainer, SpriteClass.tableSpriteSheet, "betamountbg", "betAmountBg", 1);
			var betValue = CGenClass.createText(totalBetContainer, "betValue", "center", "middle", "#FFF", "200 25px Roboto Condensed", 0);
			console.log("totalBetContainer", totalBetContainer, i)
		})();
	}
	next();
};

CanvasGame.prototype.createShufflingContainer = function(next){
	var shuffleAnimationContainer = CGenClass.createContainer(CGenClass.mainContainer, "shuffleAnimationContainer", false);
	var animation = shuffleAnimationContainer.addChild(new createjs.Sprite(SpriteClass.cardShufflingSpriteSheet, "run"));
	animation.name = "animation";
	animation.paused = true;

	next();
};

CanvasGame.prototype.createNotifContainer = function(next){
	var notifContainer = CGenClass.createContainer(CGenClass.mainContainer, "notifContainer", false);
	notifContainer.y = -57;
	notifContainer.alpha = 0;
	var notifbg = SpriteClass.createSprite(notifContainer, SpriteClass.tableSpriteSheet, "notifbg", "notifbg", 1);
	var notifLabel = CGenClass.createText(notifContainer, "notifLabel", "center", "middle", "#D60000", "900 40px Roboto CondensedBold", "");
	notifLabel.y = 5;
	var notifHitArea = CGenClass.createRect(notifContainer, "notifHitArea", "#FFF", 0, "#000", 1252, 80, false);
	notifContainer.hitArea = notifHitArea;

	notifContainer.on("click", function(){

	});
	console.log("notifContainer", notifContainer);
	next();
};

CanvasGame.prototype.createResultContainer = function(next){
	var self = this;
	var resultContainer = CGenClass.createContainer(self.gameContainer, "resultContainer", false);
	resultContainer.y = -67;

	var resultBg = CGenClass.createRect(resultContainer, "resultBg", "rgba(0, 0, 0, .8)", 2, "rgba(255,255,255,0)", 1280, 198, true);
	var glow1 = SpriteClass.createSprite(resultContainer, SpriteClass.resultSpriteSheet, "win_glow", "glow1", 0);
	var glow2 = SpriteClass.createSprite(resultContainer, SpriteClass.resultSpriteSheet, "win_glow", "glow2", 0);
	var tigerLogo = SpriteClass.createSprite(resultContainer, SpriteClass.resultSpriteSheet, "tiger", "tigerLogo", 0);
	var dragonLogo = SpriteClass.createSprite(resultContainer, SpriteClass.resultSpriteSheet, "dragon", "dragonLogo", 0);
	var tieLabel = SpriteClass.createSprite(resultContainer, SpriteClass.resultSpriteSheet, "tie", "tieLabel", 0);
	var dragonWinLabel = SpriteClass.createSprite(resultContainer, SpriteClass.resultSpriteSheet, "dragonwins", "dragonWinLabel", 0);
	var tigerWinLabel = SpriteClass.createSprite(resultContainer, SpriteClass.resultSpriteSheet, "tigerwins", "tigerWinLabel", 0);
	var shiningAnimationCont = CGenClass.createContainer(resultContainer, "shiningAnimationCont", false);
	var animation = shiningAnimationCont.addChild(new createjs.Sprite(SpriteClass.shiningSpriteSheet, "run"));
	animation.name = "animation";
	animation.paused = true;
	var whiteBG = CGenClass.createRect(resultContainer, "whiteBG", "rgba(255,255,255,.8)", 2, "rgba(255,255,255,1)", 1280, 800, true);
	whiteBG.y = 26, whiteBG.alpha = 0;

	console.log("##CANVAS resultContainer", resultContainer);
	console.log("##CANVAS resultContainer, tigerLogo", tigerLogo);
	console.log("##CANVAS resultContainer, dragonLogo", dragonLogo);
	console.log("##CANVAS resultContainer, tieLabel", tieLabel);
	console.log("##CANVAS resultContainer, dragonWinLabel", dragonWinLabel);
	console.log("##CANVAS resultContainer, tigerWinLabel", tigerWinLabel);
	console.log("##CANVAS resultContainer, glow1", glow1);
	console.log("##CANVAS resultContainer, glow2", glow2);
	console.log("##CANVAS resultContainer, animation", animation);
	console.log("##CANVAS resultContainer, whiteBG", whiteBG);
	next();
};

CanvasGame.prototype.showResult = function(){
	var self = this;
	self.clearResult();
	var resultContainer = self.gameContainer.getChildByName("resultContainer");
	var resultBg = resultContainer.getChildByName("resultBg");
	var glow1 = resultContainer.getChildByName("glow1");
	var glow2 = resultContainer.getChildByName("glow2");
	var tigerLogo = resultContainer.getChildByName("tigerLogo");
	var dragonLogo = resultContainer.getChildByName("dragonLogo");
	var tieLabel = resultContainer.getChildByName("tieLabel");
	var dragonWinLabel = resultContainer.getChildByName("dragonWinLabel");
	var tigerWinLabel = resultContainer.getChildByName("tigerWinLabel");
	var shiningAnimationCont = resultContainer.getChildByName("shiningAnimationCont");
	var animation = shiningAnimationCont.getChildByName("animation");
	var whiteBG = resultContainer.getChildByName("whiteBG");
	StandingClass.displayStandingPlayerList(false);
	EmojiClass.openTauntList(false, 2);
	self.displayMinMaxContainer(false);
	console.log("click now")
	if(self.results[0] === "DRG"){
		shiningAnimationCont.x = 150;
		resultBg.alpha = 0;
		dragonLogo.scale = 1, dragonLogo.x = -900, dragonLogo.y = -19;
		glow1.alpha = 0, glow1.scaleX = -1, glow1.scaleY = 1;
		glow2.alpha = 0, glow2.scaleX = -1, glow2.scaleY = 1;
		dragonWinLabel.alpha = 0, dragonWinLabel.x = 209, dragonWinLabel.y = -5;
		resultContainer.visible = true;
		createjs.Tween.get()
			.call(function(){
				createjs.Tween.get(whiteBG)
					.to({alpha : 1}, 100)
					.to({alpha : 0}, 100)
			})
			.wait(150)
			.call(function(){
				createjs.Tween.get(resultBg)
					.to({alpha : 1}, 100)
			})
			.call(function(){
				createjs.Tween.get(dragonLogo)
					.to({x : 0}, 100)
					.to({x : -358}, 100)
			})
			.call(function(){
				createjs.Tween.get(dragonWinLabel)
					.wait(200)
					.to({alpha : 1, scale : 1.1}, 150)
					.call(function(){
						shiningAnimationCont.visible = true;
						SoundClass.playAudio(self.results[0]+"win");
						animation.paused = false;
					})
					.to({scale : 1}, 150)
			})
			.call(function(){
				createjs.Tween.get(glow1)
					.wait(100)
					.to({alpha: 1, x : 480, y : -20}, 100)
					.to({x : 500, y : -40}, 5000)
				createjs.Tween.get(glow2)
					.wait(100)
					.to({alpha: 1, x : -50, y : 65}, 100)
					.to({x : -70, y: 85}, 5000)
			});
	}else if(self.results[0] === "TGR"){
		shiningAnimationCont.x = -150;
		resultBg.alpha = 0;
		tigerLogo.scale = 1, tigerLogo.x = 900, tigerLogo.y = -19;
		glow1.alpha = 0, glow1.scale = 1;
		glow2.alpha = 0, glow2.scale = 1;
		tigerWinLabel.alpha = 0, tigerWinLabel.x = -209, tigerWinLabel.y = -5;
		resultContainer.visible = true
		createjs.Tween.get()
			.call(function(){
				createjs.Tween.get(whiteBG)
					.to({alpha : 1}, 100)
					.to({alpha : 0}, 100)
			})
			.wait(150)
			.call(function(){
				createjs.Tween.get(resultBg)
					.to({alpha : 1}, 100)
			})
			.call(function(){
				createjs.Tween.get(tigerLogo)
					.to({x : 0}, 100)
					.to({x : 358}, 100)
			})
			.call(function(){
				createjs.Tween.get(tigerWinLabel)
					.wait(200)
					.to({alpha : 1, scale : 1.1}, 150)
					.call(function(){
						shiningAnimationCont.visible = true;
						SoundClass.playAudio(self.results[0]+"win");
						animation.paused = false;
					})
					.to({scale : 1}, 150)
			})
			.call(function(){
				createjs.Tween.get(glow1)
					.wait(100)
					.to({alpha: 1, x : -450, y : -15}, 100)
					.to({x : -470, y : -35}, 5000)
				createjs.Tween.get(glow2)
					.wait(100)
					.to({alpha: 1, x : 50, y : 65}, 100)
					.to({x : 70, y: 85}, 5000)
			});
		}else {
			shiningAnimationCont.x = 0;
			resultBg.alpha = 0, resultBg.scaleY = .606;
			dragonLogo.scale = .844, dragonLogo.x = -860, dragonLogo.y = 7;
			tigerLogo.scale = .844, tigerLogo.x = 860, tigerLogo.y = 7;
			tieLabel.alpha = 0;
			glow1.alpha = 0, glow1.rotation = 194, glow1.scale = 1, glow1.y = -50;
			glow2.alpha = 0, glow2.rotation = 14, glow2.scale = 1, glow2.y = 50;
			resultContainer.visible = true;
			createjs.Tween.get()
				.call(function(){
					createjs.Tween.get(whiteBG)
						.to({alpha : 1}, 100)
						.to({alpha : 0}, 100)
				})
				.wait(150)
				.call(function(){
					createjs.Tween.get(resultBg)
						.to({alpha : 1}, 100)
				})
				.call(function(){
					createjs.Tween.get(tigerLogo)
						.to({x : 210}, 100)
						.to({x : 416}, 100)
					createjs.Tween.get(dragonLogo)
						.to({x : -210}, 100)
						.to({x : -416}, 100)
				})
				.call(function(){
					createjs.Tween.get(tieLabel)
						.wait(200)
						.to({alpha : 1, scale : 1.1}, 150)
						.call(function(){
							shiningAnimationCont.visible = true;
							SoundClass.playAudio(self.results[0]+"win");
							animation.paused = false;
						})
						.to({scale : 1}, 150)
				})
				.call(function(){
					createjs.Tween.get(glow1)
						.wait(100)
						.to({alpha: 1, y : -88}, 100)
					createjs.Tween.get(glow2)
						.wait(100)
						.to({alpha: 1, y : 88}, 100)
				});
		}
	createjs.Tween.get(resultContainer)
		.wait(2000)
		.to({alpha : 0}, 500)
		.call(function(){
			console.log("Clear result")
			self.clearResult();
		});
};

CanvasGame.prototype.clearResult = function(){
	var self = this;
	var resultContainer = self.gameContainer.getChildByName("resultContainer");
	var resultBg = resultContainer.getChildByName("resultBg");
	var glow1 = resultContainer.getChildByName("glow1");
	var glow2 = resultContainer.getChildByName("glow2");
	var tigerLogo = resultContainer.getChildByName("tigerLogo");
	var dragonLogo = resultContainer.getChildByName("dragonLogo");
	var tieLabel = resultContainer.getChildByName("tieLabel");
	var dragonWinLabel = resultContainer.getChildByName("dragonWinLabel");
	var tigerWinLabel = resultContainer.getChildByName("tigerWinLabel");
	var shiningAnimationCont = resultContainer.getChildByName("shiningAnimationCont");
	resultContainer.visible = false;
	resultContainer.alpha = 1;
	glow1.x = 0, glow1.y = 0, glow1.scale = 0, glow1.rotation = 0;
	glow2.x = 0, glow2.y = 0, glow2.scale = 0, glow2.rotation = 0;
	tigerLogo.x = 0, tigerLogo.y = 0, tigerLogo.scale = 0;
	dragonLogo.x = 0, dragonLogo.y = 0, dragonLogo.scale = 0;
	tieLabel.x = 0, tieLabel.y = 0, tieLabel.scale = 0, tieLabel.alpha = 0;
	dragonWinLabel.x = 0, dragonWinLabel.y = 0, dragonWinLabel.scale = 0, dragonWinLabel.alpha = 0;
	tigerWinLabel.x = 0, tigerWinLabel.y = 0, tigerWinLabel.scale = 0, tigerWinLabel.alpha = 0;
	resultBg.scale = 1;
	shiningAnimationCont.visible = false;
	shiningAnimationCont.removeAllChildren();
	var animation = shiningAnimationCont.addChild(new createjs.Sprite(SpriteClass.shiningSpriteSheet, "run"));
	animation.name = "animation";
	animation.paused = true;
};

CanvasGame.prototype.createWaitForNextRoundContainer = function(){
	var self = this;
	self.waitForNextRoundContainer = CGenClass.createContainer(self.gameContainer, "waitForNextRoundContainer", true);
	var waitForNextRoundContainerBg = CGenClass.createRect(self.waitForNextRoundContainer, "waitForNextRoundContainerBg", "rgba(0,0,0,.6)", 1, "rgba(0,0,0,0)", 1280, 331, true);
	waitForNextRoundContainerBg.y = -38;
	var waitForNextRoundLabel = CGenClass.createText(self.waitForNextRoundContainer, "waitForNextRoundLabel", "center", "middle", "#FFF", "500 50px Roboto Condensed", "PLEASE WAIT FOR THE NEXT ROUND");
	waitForNextRoundLabel.y = 71;
	waitForNextRoundLabel.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 15);
	var waitForNextRoundLabelB = CGenClass.createText(self.waitForNextRoundContainer, "waitForNextRoundLabelB", "center", "middle", "#FFF", "500 50px Roboto Condensed", "PLEASE WAIT FOR THE NEXT ROUND");
	waitForNextRoundLabelB.y = 71;
	waitForNextRoundLabelB.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 15);
	EndTimerClass.createTimerContainer();
	console.log("waitForNextRoundContainer", self.waitForNextRoundContainer)
};

CanvasGame.prototype.hideWaitForNextRoundContainer = function(){
	var self = this;
	self.waitForNextRoundContainer.visible = false;
	CSeatClass.seatsContainer.visible = true;
	RoadMapClass.roadmapContainer.visible = true;
	EndTimerClass.setEndTimer({curr: 0, max: 20});
};

CanvasGame.prototype.setNotif = function(notif){
	if(notif !== "bet failed"){
		var notifContainer = CGenClass.mainContainer.getChildByName("notifContainer");
		var notifLabel = notifContainer.getChildByName("notifLabel");
		notifLabel.text = notif.label.toUpperCase();
		notifContainer.scale = (notifContainer.visible) ? 1 : 2;
		notifContainer.visible = true;
		notifContainer.visible = (!TimerClass.tickStarted) ? false : notifContainer.visible;
		createjs.Tween.get(notifContainer, {override:true})
			.to({alpha : 1, scale : 1}, 150)
			.wait(700)
			.to({alpha : 0, scale : 1.2}, 200)
			.call(function(){
				notifContainer.visible = false;
			});
	}else{
		CanvasPanelClass.setAlert("bet failed", function(option){
		  if(option){
		    var func = ErrorClass[ErrorClass.list["bet failed"].action];
		    func();
		  }
		  CanvasPanelClass.hideAlert();
		}, data);

		setTimeout(function(){
		  if(CanvasPanelClass.currentErrorCode === "bet failed"){
		    CanvasPanelClass.hideAlert();
		  }
		}, 2000);
	}
};

CanvasGame.prototype.sendBet = function(betType, sideBetType, bound, tableLimit, betAmount){
	var self = this;
	SoundClass.playIntro();
	console.log("SEND BET LOW", TimerClass.tickStarted, self.canBet)
	if(!TimerClass.tickStarted) return false;
	if(!self.canBet) return false;
	CGenClass.checkSession(function(status){
		if(status){
			if(sideBetType && self.isSideBetDisabled){
				  CanvasPanelClass.setAlert("side bet alert", function(option){
					  if(option){
				      var func = ErrorClass[ErrorClass.list["side bet alert"].action];
				      func();
				      CanvasPanelClass.hideAlert();
				    }
				  });
				  setTimeout(function(){
				  	if(CanvasPanelClass.currentErrorCode === "side bet alert"){
				  		CanvasPanelClass.hideAlert();
				  	}
				  }, 1500)
				return false;
			}
			self.canBet = false;
			var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
			var footerContainer = panelContainer.getChildByName("footerContainer");
			var standingPlayerContainer = self.gameContainer.getChildByName("standingPlayerContainer");
			var betTypeLabel = (sideBetType) ? betType+sideBetType : betType;
			var destX = self.betOrigins[betTypeLabel].x;
			var destY = self.betOrigins[betTypeLabel].y;
			var distanceY = (betTypeLabel.length > 3) ? 22 : (betTypeLabel === "TIE") ? 50 : 75;
			var distanceX = (betTypeLabel.length > 3) ? 70 : (betTypeLabel === "TIE") ? 50 : 75;
			destX = CGenClass.randomOrigin(distanceX) + destX;
			destY = CGenClass.randomOrigin(distanceY) + destY;
			var coinOrigX = standingPlayerContainer.x;
			var coinOrigY = standingPlayerContainer.y;
			if(CSeatClass.selectedSeat !== null){
				coinOrigX = CSeatClass.seatsContainer.x + CSeatClass.seatsContainer.children[CSeatClass.selectedSeat].x;
				coinOrigY = CSeatClass.seatsContainer.y + CSeatClass.seatsContainer.children[CSeatClass.selectedSeat].y;
			}
			var playerBet = {
				betAmount : betAmount,
				pos : (CSeatClass.selectedSeat === null) ? -1 : CSeatClass.selectedSeat,
				betType : (sideBetType) ? betType+sideBetType : betType,
				destination : {x : destX, y : destY},
				displayname : userData.displayname,
				er : userData.exchangeRate.value,
			};
			var betCode = (sideBetType) ? betType+sideBetType : betType;
			self.currentBetType = { tableLimit : tableLimit, betType : betCode};
			var coin = "coin"+(CGenClass.selectedChip+1);
			socket.emit("player bet", playerBet);
		}else{
			CGenClass.displayAlert("invalid session");
		}
	});
};

CanvasGame.prototype.checkBetTypeBoundary = function(x, y, betType, sideBetType, bound){
	var self = this;
	var betIndex = self.betOption.findIndex(x => x.code === betType);
	var sideBetIndex = (sideBetType) ? self.sideBetOption.findIndex(x => x.code === sideBetType) : null;
	var bottomBound, topBound, leftBound, rightBound;
	var finalX, finalY;
	if(sideBetType === null){
		bottomBound = ((self.betOption[betIndex].y + (self.betOption[betIndex].h/2))-20)-80;
		topBound = ((self.betOption[betIndex].y - (self.betOption[betIndex].h/2))+20)-80;
		leftBound = (self.betOption[betIndex].x - (self.betOption[betIndex].w/2))+20;
		rightBound = (self.betOption[betIndex].x + (self.betOption[betIndex].w/2))-20;
	}else {
		bottomBound = (self.betOrigins[betType+sideBetType].y + (self.sideBetOption[sideBetIndex].h/2))-20;
		topBound = (self.betOrigins[betType+sideBetType].y - (self.sideBetOption[sideBetIndex].h/2))+20;
		leftBound = (self.betOrigins[betType+sideBetType].x - (self.sideBetOption[sideBetIndex].w/2))+20;
		rightBound = (self.betOrigins[betType+sideBetType].x + (self.sideBetOption[sideBetIndex].w/2))-20;
	}
	if(topBound > y){
		finalY = topBound;
	}else if(bottomBound < y){
		finalY = bottomBound;
	}else finalY = y;

	if(leftBound > x){
		finalX = leftBound;
	}else if(rightBound < x){
		finalX = rightBound;
	}else finalX = x;

	if(bound){
		finalX = (x < 0) ? x+20 : x-20;
	}
	var dest = {x : finalX, y: finalY};
	return dest;
};

CanvasGame.prototype.animateBet = function(betDetails){
	var self = this;
	var displayname = PlayerClass.players.findIndex(x => x.displayname === betDetails.displayname);
	var index = displayname;
	var betAmount = betDetails.betAmount * (betDetails.er / userData.exchangeRate.value);
	var coin = CChipsClass.defaultChips.findIndex(x => x === betAmount);
	var isPlayer = (betDetails.displayname === userData.displayname) ? true : false;

	var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
	var footerContainer = panelContainer.getChildByName("footerContainer");
	var standingPlayerContainer = this.gameContainer.getChildByName("standingPlayerContainer");
	var coinOrigX, coinOrigY;
	if(betDetails.pos < 0){
		coinOrigX = standingPlayerContainer.x;
		coinOrigY = standingPlayerContainer.y;
	}else {
		coinOrigX = CSeatClass.seatsContainer.x + CSeatClass.seatsContainer.children[betDetails.pos].x;
		coinOrigY = CSeatClass.seatsContainer.y + CSeatClass.seatsContainer.children[betDetails.pos].y;
	}
	if(userData.displayname === betDetails.displayname){
		this.haveBet = (!this.haveBet) ? true : this.haveBet;
		CanvasPanelClass.disableHome(false);
		self.storeRebet(betDetails);
		this.canBet = true;
		console.log("canBet", self.canBet)
		self.isBetHereVisible = false;
		self.animateBetHere(self.isBetHereVisible);
	}
	console.log("coin max", coin, betAmount)
	if(coin < 0 && betAmount > 1){
		CanvasPanelClass.getChipList(betAmount, betDetails.betType, function(list, code){
			console.log("MIN animateCoin", betAmount, list)
			for(var j=0; j<list.length; j++){
				(function(){
					var indexj = j;
					var coinListIndex = CChipsClass.defaultChips.findIndex(x => x === list[indexj]);
					console.log("MIN animateCoin", coinListIndex)
					betDetails.betAmount = list[indexj];
					PlayerClass.storeBets(betDetails);
					CGameClass.setTotalBet(betDetails);
					CGameClass.allBets.push(betDetails);

					// bet amount * ( e.r nung nag bet ) / ( e.r nung nakakakita )
					setTimeout(function(){
						CGameClass.animateCoin(coinOrigX, coinOrigY, betDetails.destination.x, betDetails.destination.y, coinListIndex, code, index, isPlayer);
					}, 100*indexj);
				})();
			}
		});
	}else{
		PlayerClass.storeBets(betDetails);
		this.setTotalBet(betDetails);
		this.allBets.push(betDetails);

		this.animateCoin(coinOrigX, coinOrigY, betDetails.destination.x, betDetails.destination.y, coin, betDetails.betType, index, isPlayer);
	}
};

CanvasGame.prototype.setTotalBet = function(betDetails){
	var self = this;
	var tableContainer = self.gameContainer.getChildByName("tableContainer");
	var totalBetsContainer = self.gameContainer.getChildByName("totalBetsContainer");
	var coin = CChipsClass.defaultChips.findIndex(x => x === betDetails.betAmount);
	if(betDetails.displayname === userData.displayname){
		var totalBetContainer = totalBetsContainer.getChildByName("totalBetContainer-"+betDetails.betType);
		var betValue = totalBetContainer.getChildByName("betValue");
		var removedComma = (typeof(betValue.text) === 'number') ? betValue.text : betValue.text.replace(/\,/g,'');
		var betVal = Number(removedComma) + CChipsClass.defaultChips[coin];
		betValue.text = betVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		createjs.Tween.get(totalBetContainer)
			.to({alpha : 1}, 200);
		console.log("SET BET VALUE MAX", betVal, betValue.text)
		CanvasPanelClass.totalBetValue.text = CanvasPanelClass.totalBet.toLocaleString();

		self.totalBetTemp = self.totalBetTemp+CChipsClass.defaultChips[coin];
		CGenClass.animateNumber(CanvasPanelClass.totalBet, self.totalBetTemp, function(playerBalanceDisplay, balance){
			CanvasPanelClass.totalBet = self.totalBetTemp;
			var display = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
			CanvasPanelClass.totalBetValue.text = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
		});
	}
};

CanvasGame.prototype.animateCoin = function(coinOrigX, coinOrigY, destX, destY, coin, betType, playerIndex, isPlayer){
	var tableContainer = this.gameContainer.getChildByName("tableContainer");
	if(coin > -1){
		var betsBg = SpriteClass.createSprite(CGenClass.betsContainer, SpriteClass.tableSpriteSheet, "nvcoin"+(coin+1), "betsBg-"+betType+"-"+playerIndex, 0.743);
		betsBg.cache(-35, -35, 70, 70);
	}else{
		// var betsBg = SpriteClass.createSprite(CGenClass.betsContainer, SpriteClass.tableSpriteSheet, "nvcoin"+(coin+1), "betsBg-"+betType+"-"+playerIndex, 0.743);
		var betsBg = CGenClass.createBitmap(CGenClass.betsContainer, "decimal_chip", "betsBg-"+betType+"-"+playerIndex,  0.743);
		betsBg.cache(0, 0, 70, 70);
	}

	betsBg.x = coinOrigX;
	betsBg.y = coinOrigY+80;

	CGenClass.betsContainer.cache(-640, -500, 1280, 1000);
	var rotation = CGenClass.getRandomVal(90);
	destY = destY-tableContainer.y;
	createjs.Tween.get(betsBg)
		.call(function(){
			CGenClass.betsContainer.uncache();
			if(isPlayer) SoundClass.playAudio("chip");
		})
		.to({x : destX, y: destY, rotation: rotation}, 200)
		.call(function(){
			CGenClass.betsContainer.cache(-640, -500, 1280, 1000);
		});
};


CanvasGame.prototype.createTableHeaderContainer = function(next){
	var tableContainer = this.gameContainer.getChildByName("tableContainer");
	var tableHeaderContainer = CGenClass.createContainer(tableContainer, "tableHeaderContainer", true);
	tableHeaderContainer.y = -256;
	var shoeContainer = CGenClass.createContainer(tableHeaderContainer, "shoeContainer", true);
	var shoeContainerBg = CGenClass.createRect(shoeContainer, "shoeContainerBg", "#FFF", 0, "#000", 180, 90, false);
	shoeContainer.hitArea = shoeContainerBg;
	shoeContainer.x = 208;
	shoeContainer.y = 18;
	var shoeSprite = SpriteClass.createSprite(shoeContainer, SpriteClass.tableSpriteSheet, "shoe", "shoeSprite", 1);

	var coinTrayContainer = CGenClass.createContainer(tableHeaderContainer, "coinTrayContainer", true);
	var coinTraySprite = SpriteClass.createSprite(coinTrayContainer, SpriteClass.tableSpriteSheet, "cointray", "coinTraySprite", 1);

	var burnCardsContainer = CGenClass.createContainer(tableHeaderContainer, "burnCardsContainer", true);
	burnCardsContainer.x = -168; //-162
	burnCardsContainer.y = 6; //0
	var burnSprite = SpriteClass.createSprite(burnCardsContainer, SpriteClass.tableSpriteSheet, "burnCard", "burnSprite", 1);

	shoeContainer.on("click", function(){
	});

	burnCardsContainer.on("click", function(){
	});
	console.log("tableHeaderContainer", tableHeaderContainer);
	console.log("shoeContainerBg", shoeContainerBg);
	next();
};

CanvasGame.prototype.createMinMaxContainer = function(next){
	var self = this;
	var tableLimitBGContainer = CGenClass.createContainer(self.gameContainer, "tableLimitBGContainer", false);
	var sHitarea = CGenClass.createRect(tableLimitBGContainer, "sHitarea", "red", 2, "rgba(255,255,255,1)", 1280, 720, false);
	tableLimitBGContainer.hitArea = sHitarea;

	tableLimitBGContainer.on("click", function(){
		CGenClass.checkSession(function(status){
			if(status){
				self.displayMinMaxContainer(false);
			}else{
				CGenClass.displayAlert("invalid session");
			}
		});
	});

	var standingPlayerOuterBG = CGenClass.createContainer(CGameClass.gameContainer, "standingPlayerOuterBG", false);
	var sHitarea = CGenClass.createRect(standingPlayerOuterBG, "sHitarea", "blue", 2, "rgba(255,255,255,1)", 1280, 720, false);
	standingPlayerOuterBG.hitArea = sHitarea;

	standingPlayerOuterBG.on("click", function(){
		CGenClass.checkSession(function(status){
			if(status){
				StandingClass.displayStandingPlayerList(false);
			}else{
				CGenClass.displayAlert("invalid session");
			}
		});
	});

	EmojiClass.tauntBgContainer = CGenClass.createContainer(CGameClass.gameContainer, "tauntBgContainer", false);
	var sHitarea = CGenClass.createRect(EmojiClass.tauntBgContainer, "sHitarea", "green", 2, "rgba(255,255,255,1)", 1280, 720, false);
	EmojiClass.tauntBgContainer.hitArea = sHitarea;

	EmojiClass.tauntBgContainer.on("click", function(){
		CGenClass.checkSession(function(status){
			if(status){
				EmojiClass.openTauntList(false, 3);
			}else{
				CGenClass.displayAlert("invalid session");
			}
		});
	});


	var tableLimitContainer = CGenClass.createContainer(self.gameContainer, "tableLimitContainer", true);
	tableLimitContainer.x = -263;
	tableLimitContainer.y = -322;
	var tableLimitContentContainer = CGenClass.createContainer(tableLimitContainer, "tableLimitContentContainer", false);
	tableLimitContentContainer.y = 45;
	var minmaxLabelCont = CGenClass.createContainer(tableLimitContainer, "minmaxLabelCont", true);
	var tableLimit = SpriteClass.createSprite(minmaxLabelCont, SpriteClass.tableSpriteSheet, "minmaxCont", "tableLimit", 1);
	var tableLimitLabelContainer = CGenClass.createContainer(minmaxLabelCont, "tableLimitLabelContainer", true);
	this.tableMinVal = CGenClass.createText(tableLimitLabelContainer, "tableMinVal", "center", "middle", "#FFF", "200 14px Roboto Condensed", "MIN 500K");
	this.tableMinVal.y = -14;
	this.tableMaxVal = CGenClass.createText(tableLimitLabelContainer, "tableMaxVal", "center", "middle", "#FFF", "200 14px Roboto Condensed", "MAX 100M");
	this.tableMaxVal.y = 1;
	tableLimitLabelContainer.x = -10;
	var tableLimitArrow = CGenClass.createBitmap(minmaxLabelCont, "arrow", "tableLimitArrow", .47);
	tableLimitArrow.x = 35;
	tableLimitArrow.y = -7;

	tableLimitContentContainer.on("click", function(){});

	minmaxLabelCont.on("click", function(){
		CGenClass.checkSession(function(status){
			if(status){
				StandingClass.displayStandingPlayerList(false);
				EmojiClass.openTauntList(false, 4);
				self.displayMinMaxContainer(!tableLimitContentContainer.visible)
			}else{
				CGenClass.displayAlert("invalid session");
			}
		});
	});

	minmaxLabelCont.on("mouseover", function(e){
		if(self.isDrawingPhase) return false;
		minmaxLabelCont.cursor = "pointer";
		createjs.Tween.get(tableLimitArrow)
			.to({ scaleX: .67, scaleY: .67 }, 100);
	});

	minmaxLabelCont.on("mouseout", function(e){
		minmaxLabelCont.cursor = "default";
		createjs.Tween.get(tableLimitArrow)
			.to({ scaleX: .47, scaleY: .47 }, 100);
	});

	minmaxLabelCont.on("mousedown", function(e){
		createjs.Tween.get(tableLimitArrow)
			.to({ scaleX: .47, scaleY: .47 }, 100);
	});

	console.log("##CANVAS tableLimitContainer", tableLimitContainer);

	var gameRoundContainer = CGenClass.createContainer(self.gameContainer, "gameRoundContainer", true);
	var gameRoundBg = CGenClass.createRect(gameRoundContainer, "gameRoundBg", "#FFF", 0, "#000", 300, 60, false);
	gameRoundBg.x = 100;
	gameRoundContainer.hitArea = gameRoundBg;
	gameRoundContainer.on("click", function(){});

	self.gameRoundLabel = CGenClass.createText(gameRoundContainer, "gameRoundLabel", "left", "middle", "#FFF ", "200 18px Roboto Condensed", TranslationClass.getTranslation("gameRound"));
	self.gameRoundLabel.shadow = new createjs.Shadow("#000", 0, 0, 10);
	gameRoundContainer.y = -330;
	gameRoundContainer.x = -619;

	//change to visible true once the tablenamelabel layout is okay na
	var tableNameContainer = CGenClass.createContainer(self.gameContainer, "tableNameContainer", true);
	self.tableNameHitArea =  CGenClass.createRoundRect(tableNameContainer, "tableNameHitArea", "#FFF", 0, "#000", 300, 40, 0, false);
	tableNameContainer.hitArea = self.tableNameHitArea;
	tableNameContainer.on("click", function(){});

	self.tableNameLabel = CGenClass.createText(tableNameContainer, "tableNameLabel", "left", "middle", "#FFF ", "200 18px Roboto Condensed", "null");
	self.tableNameLabel.shadow = new createjs.Shadow("#000", 0, 0, 10);
	tableNameContainer.y = -330;
	tableNameContainer.x = 285;
	// this.playerCountLabel = null;

	self.playerCountIcon = SpriteClass.createSprite(tableNameContainer, SpriteClass.panelSpriteSheet, "player", "playerCountIcon", .66);
	self.playerCountIcon.y = -1;

	self.playerCountLabel = CGenClass.createText(tableNameContainer, "playerCountLabel", "left", "middle", "#FFF ", "200 18px Roboto Condensed", "null");
	self.playerCountLabel.shadow = new createjs.Shadow("#000", 0, 0, 10);
	tableNameContainer.y = -330;
	tableNameContainer.x = 285;
	console.log("tableNameContainer", tableNameContainer)
	next();
};

CanvasGame.prototype.displayMinMaxContainer = function(visible){
	var self = this;
	var tableLimitContainer = self.gameContainer.getChildByName("tableLimitContainer");
	var tableLimitContentContainer = tableLimitContainer.getChildByName("tableLimitContentContainer");
	var minmaxLabelCont = tableLimitContainer.getChildByName("minmaxLabelCont");
	var tableLimitArrow = minmaxLabelCont.getChildByName("tableLimitArrow");
	var tableLimitBGContainer = self.gameContainer.getChildByName("tableLimitBGContainer");
	if(visible){
		tableLimitContentContainer.visible = true;
		tableLimitBGContainer.visible = true;
		tableLimitArrow.rotation = 180;
		createjs.Tween.get(tableLimitContentContainer)
			.to({y : 94}, 150)
	}else{
		createjs.Tween.get(tableLimitContentContainer)
			.to({y : 45}, 150)
			.call(function(){
				tableLimitContentContainer.visible = false;
				tableLimitBGContainer.visible = false;
				tableLimitArrow.rotation = 0;
			})
	}
};

CanvasGame.prototype.setTableDetails = function(details){
	var self = this;
	self.tableDetails = details;
	console.log("tableDetails", details)
	self.tableMinVal.text = "MIN "+CGenClass.formatAmount(details.dragontigerMin);
	self.tableMaxVal.text = "MAX "+CGenClass.formatAmount(details.dragontigerMax);

	var maxLength = 0;

	var tableLimitContainer = self.gameContainer.getChildByName("tableLimitContainer");
	var tableLimitContentContainer = tableLimitContainer.getChildByName("tableLimitContentContainer");

	var tableLimitContentBorder = CGenClass.createRoundRect(tableLimitContentContainer, "tableLimitContentBorder", "#ebebeb", 0, "#ebebeb", 188, 136, 6, true);
	var tableLimitContentBg = CGenClass.createRoundRect(tableLimitContentContainer, "tableLimitContentBg", "#1a1a1a", 0, "#1a1a1a", 180, 120, 6, true);

	var tblLimitContentLabelContainer = CGenClass.createContainer(tableLimitContentContainer, "tblLimitContentLabelContainer", true);
	tblLimitContentLabelContainer.x = -81;
	var tblDrgLabel = CGenClass.createText(tblLimitContentLabelContainer, "tblDrgLabel", "left", "middle", "#ffc500 ", "200 14px Roboto Condensed", "DRAGON :");
	tblDrgLabel.y = -47;
	var tblTgrLabel = CGenClass.createText(tblLimitContentLabelContainer, "tblTgrLabel", "left", "middle", "#ffc500 ", "200 14px Roboto Condensed", "TIGER :");
	tblTgrLabel.y = -23;
	var tblTieLabel = CGenClass.createText(tblLimitContentLabelContainer, "tblTieLabel", "left", "middle", "#ffc500 ", "200 14px Roboto Condensed", "TIE :");
	var tblBlkRdLabel = CGenClass.createText(tblLimitContentLabelContainer, "tblBlkRdLabel", "left", "middle", "#ffc500 ", "200 14px Roboto Condensed", "BLACK / RED :");
	tblBlkRdLabel.y = 23;
	var tblBgSmlLabel = CGenClass.createText(tblLimitContentLabelContainer, "tblBgSmlLabel", "left", "middle", "#ffc500 ", "200 14px Roboto Condensed", "BIG / SMALL :");
	tblBgSmlLabel.y = 47;

	var tblLimitContentValueContainer = CGenClass.createContainer(tableLimitContentContainer, "tblLimitContentValueContainer", true);
	var tblDrgValue = CGenClass.createText(tblLimitContentValueContainer, "tblDrgValue", "left", "middle", "#FFF ", "200 14px Roboto Condensed", CGenClass.formatLimit(details.dragontigerMin, details.dragontigerMax));
	tblDrgValue.y = -47;
	var tblTgrValue = CGenClass.createText(tblLimitContentValueContainer, "tblTgrValue", "left", "middle", "#FFF ", "200 14px Roboto Condensed", CGenClass.formatLimit(details.dragontigerMin, details.dragontigerMax));
	tblTgrValue.y = -23;
	var tblTieValue = CGenClass.createText(tblLimitContentValueContainer, "tblTieValue", "left", "middle", "#FFF ", "200 14px Roboto Condensed", CGenClass.formatLimit(details.tieMin, details.tieMax));
	var tblBlkRdValue = CGenClass.createText(tblLimitContentValueContainer, "tblBlkRdValue", "left", "middle", "#FFF ", "200 14px Roboto Condensed", CGenClass.formatLimit(details.suitcolorMin, details.suitcolorMax));
	tblBlkRdValue.y = 23;
	var tblBgSmlValue = CGenClass.createText(tblLimitContentValueContainer, "tblBgSmlValue", "left", "middle", "#FFF ", "200 14px Roboto Condensed", CGenClass.formatLimit(details.bigsmallMin, details.bigsmallMax));
	tblBgSmlValue.y = 47;

	maxLength = tblDrgLabel.getBounds().width + tblDrgValue.getBounds().width;
	maxLength = ((tblTgrLabel.getBounds().width + tblTgrValue.getBounds().width) > maxLength) ? tblTgrLabel.getBounds().width + tblTgrValue.getBounds().width : maxLength;
	maxLength = ((tblTieLabel.getBounds().width + tblTieValue.getBounds().width) > maxLength) ? tblTieLabel.getBounds().width + tblTieValue.getBounds().width : maxLength;
	maxLength = ((tblBlkRdLabel.getBounds().width + tblBlkRdValue.getBounds().width) > maxLength) ? tblBlkRdLabel.getBounds().width + tblBlkRdValue.getBounds().width : maxLength;
	maxLength = ((tblBgSmlLabel.getBounds().width + tblBgSmlValue.getBounds().width) > maxLength) ? tblBgSmlLabel.getBounds().width + tblBgSmlValue.getBounds().width : maxLength;
	maxLength = Math.floor(maxLength) + 40;

	var valMaxLength = tblDrgValue.getBounds().width;
	valMaxLength = (tblTgrValue.getBounds().width > valMaxLength) ? tblTgrValue.getBounds().width : valMaxLength;
	valMaxLength = (tblTieValue.getBounds().width > valMaxLength) ? tblTieValue.getBounds().width : valMaxLength;
	valMaxLength = (tblBlkRdValue.getBounds().width > valMaxLength) ? tblBlkRdValue.getBounds().width : valMaxLength;
	valMaxLength = (tblBgSmlValue.getBounds().width > valMaxLength) ? tblBgSmlValue.getBounds().width : valMaxLength;

	CGenClass.clearRoundRect(tableLimitContentBorder, "#ebebeb", 0, "#ebebeb", maxLength+8, 136, 6, true);
	CGenClass.clearRoundRect(tableLimitContentBg, "#1a1a1a", 0, "#1a1a1a", maxLength, 120, 6, true);

	var diff = maxLength-10;
	tblLimitContentLabelContainer.x = (diff/2) * -1;
	tblLimitContentValueContainer.x = ((maxLength/2)-valMaxLength)-10;

	console.log("tableLimitContentContainer", tableLimitContentContainer, maxLength, valMaxLength);
};

CanvasGame.prototype.createBettingStatusContainer = function(next){
	var self = this;
	var bettingStatusContainer = CGenClass.createContainer(self.gameContainer, "bettingStatusContainer", true);

	var bettingOpenStatusContainer = CGenClass.createContainer(bettingStatusContainer, "bettingOpenStatusContainer", false);
	bettingOpenStatusContainer.alpha = 0;
	bettingOpenStatusContainer.y = -276;
	var statusBg = SpriteClass.createSprite(bettingOpenStatusContainer, SpriteClass.tableSpriteSheet, "betamountbg", "statusBg", 1);
	statusBg.scaleX = 1.376;
	statusBg.scaleY = 0.88;

	self.statusLabel = CGenClass.createText(bettingOpenStatusContainer, "statusLabel", "center", "middle", "#0EE937", "200 24px Carter", TranslationClass.getTranslation("bettingOpen"));
	self.statusLabel.y = (CGenClass.isMobile && CGenClass.isIOS) ? 0 : 3;

	var maskRect = CGenClass.createRect(bettingOpenStatusContainer, "maskRect", "rgba(0,0,0,0)", 0, "rgba(0,0,0,0)", 235, 48, true);

	var gradientLineContainer = CGenClass.createContainer(bettingOpenStatusContainer, "gradientLineContainer", true);
	self.gradientLineTop = gradientLineContainer.addChild(new createjs.Shape());
	self.gradientLineTop.name = "gradientLineTop";
	self.gradientLineTop.graphics
		.setStrokeStyle(3, "round").beginStroke("rgba(33, 249, 70, .6)")
		.moveTo(-34.5, 0)
		.lineTo(34.5, 0)
	self.gradientLineTop.shadow = new createjs.Shadow("#21F946", 0, 0, 4);
	self.gradientLineBot = gradientLineContainer.addChild(new createjs.Shape());
	self.gradientLineBot.name = "gradientLineBot";
	self.gradientLineBot.graphics
		.setStrokeStyle(3, "round").beginStroke("rgba(33, 249, 70, .6)")
		.moveTo(-34.5, 0)
		.lineTo(34.5, 0)
	self.gradientLineBot.shadow = new createjs.Shadow("#21F946", 0, 0, 4);
	self.gradientLineTop.y = -18, self.gradientLineTop.x = 155, self.gradientLineBot.y = 18, self.gradientLineBot.x = -155;
	gradientLineContainer.mask = maskRect;

	var gradientWhite = bettingOpenStatusContainer.addChild(new createjs.Shape());
	gradientWhite.graphics
		.beginLinearGradientFill(["rgba(0,0,0,0)","rgba(255,255,255,.7)","rgba(0,0,0,0)"], [0, .5, 1], 65, 65, 5, 35)
		.drawRect(0, 0, 100, 35);
	gradientWhite.y = -17.5, gradientWhite.x = -40, gradientWhite.scaleX = -1, gradientWhite.alpha = 0;
	console.log("gradientWhite", gradientWhite)

	createjs.Tween.get(self.gradientLineTop, {loop: true})
		.to({x: -155}, 500)
		.to({x: 155})
		.wait(2000)
	createjs.Tween.get(self.gradientLineBot, {loop: true})
		.to({x: 155}, 500)
		.to({x: -155})
		.wait(2000)
	createjs.Tween.get(gradientWhite, {loop: true})
		.wait(600)
		.to({x: 40, alpha:1}, 200)
		.to({x: 150, alpha:0}, 200)
		.to({x: -40})
		.wait(1500)

	var bettingCloseStatusContainer = CGenClass.createContainer(bettingStatusContainer, "bettingCloseStatusContainer", false);
	bettingCloseStatusContainer.y = -60;
	bettingCloseStatusContainer.alpha = 0;
	var closeBG = SpriteClass.createSprite(bettingCloseStatusContainer, SpriteClass.tableSpriteSheet, "bettingclose", "closeBG", 1);
	next();
};

CanvasGame.prototype.bettingStatDisplay = function(status){
	var bettingStatusContainer = this.gameContainer.getChildByName("bettingStatusContainer");
	var bettingOpenStatusContainer = bettingStatusContainer.getChildByName("bettingOpenStatusContainer");
	var bettingCloseStatusContainer = bettingStatusContainer.getChildByName("bettingCloseStatusContainer");
	var notifContainer = CGenClass.mainContainer.getChildByName("notifContainer");
	bettingOpenStatusContainer.visible = status;
	// if(!status) CSeatClass.disableSeat(true);
	createjs.Tween.get(bettingOpenStatusContainer)
		.to({alpha : (status) ? 1 : 0}, 300);
	bettingCloseStatusContainer.visible = !status;
	if(!status) {
		SoundClass.playAudio("no_more_bets");
		if(CanvasPanelClass.currentErrorCode === "leave game") {
			CanvasPanelClass.hideAlert();
		}
		this.isDrawingPhase = true;
		notifContainer.visible = false;
		this.betHereMainContainer.visible = false;
		EmojiClass.openTauntList(false, 1);
		StandingClass.displayStandingPlayerList(false);
	}
	createjs.Tween.get(bettingCloseStatusContainer)
		.to({alpha : (status) ? 0 : 1, scale : (status) ? 1.5 : 1}, 150)
		.wait(1300)
		.to({alpha : (status) ? 1 : 0, scale : (status) ? 1 : 1.5}, 100);

};

CanvasGame.prototype.animateBurnCard = function(count){
	var self = this;
	var tableContainer = self.gameContainer.getChildByName("tableContainer");
	var tableHeaderContainer = tableContainer.getChildByName("tableHeaderContainer");
	var shoeContainer = tableHeaderContainer.getChildByName("shoeContainer");
	var burnCardsContainer = tableHeaderContainer.getChildByName("burnCardsContainer");
	var origX = self.gameContainer.x + tableHeaderContainer.x + shoeContainer.x;
	var destX = self.gameContainer.x + tableHeaderContainer.x + burnCardsContainer.x;

	for(var i=0; i<count; i++){
		var index = i;
		var burnCardSprite = SpriteClass.createSprite(tableHeaderContainer, SpriteClass.cardSpriteSheet, "BCK", "burnCardSprite", .205);
		if(burnCardSprite){
			burnCardSprite.x = 170;
			burnCardSprite.y = 26;
			burnCardSprite.rotation = -43;
		}
		createjs.Tween.get(burnCardSprite)
			.wait(index*450)
			.to({x : 0, y: 80, rotation: 0, scale : .2883}, 200)
			.to({x : destX, y: 0}, 200)
			.call(function(){	
				tableHeaderContainer.removeChildAt(3);
			});
	}
};

CanvasGame.prototype.animateBurnCards = function(count){
	var self = this;
	var tableContainer = self.gameContainer.getChildByName("tableContainer");
	var tableHeaderContainer = tableContainer.getChildByName("tableHeaderContainer");
	var shoeContainer = tableHeaderContainer.getChildByName("shoeContainer");
	var burnCardsContainer = tableHeaderContainer.getChildByName("burnCardsContainer");
	var burnSprite = burnCardsContainer.getChildByName("burnSprite");
	var destX = self.gameContainer.x + tableHeaderContainer.x + burnCardsContainer.x;
	var burnCardSpritesContainer = CGenClass.createContainer(tableHeaderContainer, "burnCardSpritesContainer", true);
	var origX = (count%2 < 1) ? (((count-1)/2)*-47) : ((Math.round((count-2)/2))*-47);
	for(var i=0; i<count; i++){
		var index = i;
		var burnCardSprite = SpriteClass.createSprite(burnCardSpritesContainer, SpriteClass.cardSpriteSheet, "BCK", "burnCardSprite", .205);
		if(burnCardSprite){
			burnCardSprite.x = 170;
			burnCardSprite.y = 26;
			burnCardSprite.rotation = -43;
			burnCardSprite.alpha = 0;
		}
		console.log("burnCardSprite", burnCardSprite)
		createjs.Tween.get(burnCardSprite)
			.wait(index*200)
			.to({y : 332, scale : .437, x : 0, rotation: 0, alpha : 1}, 100)
			.to({scale : .5}, 30)
			.to({scale : .437}, 30)
			.wait((count-index)*200)
			.to({x : origX}, 150)
			.call(function(){
				var showCardSprite = tableHeaderContainer.children[3];
				createjs.Tween.get(showCardSprite)
					.wait(900)
					.to({scaleX: 0}, 50)
					.call(function(){
						showCardSprite.gotoAndStop("BCK");
					})
					.to({scaleX: .437, scaleY : .437}, 50)
					.to({y : 332}, 100)
					.to({alpha : 0})
			})
			.wait(1000)
			.to({x : 0}, 200)
			.to({x : destX, y: 0, alpha : 0, scale : .205}, 300)
			.call(function(){
				burnSprite.gotoAndStop("burnCard");
				tableHeaderContainer.removeChildAt(4);
				tableHeaderContainer.removeChildAt(3);
			});
		origX = origX+47;
	}
	console.log("tableHeaderContainer", tableHeaderContainer);
};

CanvasGame.prototype.animateYellowCard = function(){
	var tableContainer = this.gameContainer.getChildByName("tableContainer");
	var tableHeaderContainer = tableContainer.getChildByName("tableHeaderContainer");
	var shoeContainer = tableHeaderContainer.getChildByName("shoeContainer");
	var burnCardsContainer = tableHeaderContainer.getChildByName("burnCardsContainer");
	var origX = this.gameContainer.x + tableHeaderContainer.x + shoeContainer.x;

	var destX = this.gameContainer.x + tableHeaderContainer.x + burnCardsContainer.x;


	var burnCardYlw = CGenClass.createRoundRect(tableHeaderContainer, "burnCardYlw", "yellow", 0, "#000", 46, 74, 2, true);
	burnCardYlw.x = origX;
	createjs.Tween.get(burnCardYlw)
		.to({x : 0, y: 80}, 200)
		.to({x : destX, y: 0}, 200)
		.call(function(){	
			tableHeaderContainer.removeChildAt(3);
		});
	console.log("tableHeaderContainer", tableHeaderContainer);
};

CanvasGame.prototype.animateShowCard = function(card){
	var tableContainer = this.gameContainer.getChildByName("tableContainer");
	var tableHeaderContainer = tableContainer.getChildByName("tableHeaderContainer");
	var shoeContainer = tableHeaderContainer.getChildByName("shoeContainer");
	var burnCardsContainer = tableHeaderContainer.getChildByName("burnCardsContainer");
	var burnSprite = burnCardsContainer.getChildByName("burnSprite");
	var origX = this.gameContainer.x + tableHeaderContainer.x + shoeContainer.x;

	var destX = this.gameContainer.x + tableHeaderContainer.x + burnCardsContainer.x;

	var showCardSprite = SpriteClass.createSprite(tableHeaderContainer, SpriteClass.cardSpriteSheet, "BCK", "showCardSprite", .205);
	showCardSprite.x = 170;
	showCardSprite.y = 26;
	showCardSprite.rotation = -43;
	console.log("showCardSprite", showCardSprite)
	createjs.Tween.get(showCardSprite)
		.to({x : 0, y: 188, scaleX: .437, scaleY : .437, rotation : 0}, 100)
		.wait(200)
		.to({scaleX: 0}, 100)
		.call(function(){
			showCardSprite.gotoAndStop(card);
		})
		.to({scaleX: .437, scaleY : .437}, 150);
};

CanvasGame.prototype.animateDrawCard = function(card, index){
	var self = this;
	var tableContainer = self.gameContainer.getChildByName("tableContainer");
	var tableHeaderContainer = tableContainer.getChildByName("tableHeaderContainer");
	var shoeContainer = tableHeaderContainer.getChildByName("shoeContainer");
	var cardSlotMainContainer = tableContainer.getChildByName("cardSlotMainContainer");

	var cardSlotContainer = cardSlotMainContainer.getChildByName("cardSlotContainer-"+index);
	var cardValue = (index < 1) ? self.cardValueDrg : self.cardValueTgr;

	var drawCardContainer = CGenClass.createContainer(cardSlotContainer, "drawCardContainer", true);
	var cardVal = CGenClass.getCardValue(card.value);
	var showBCardSprite = SpriteClass.createSprite(drawCardContainer, SpriteClass.cardSpriteSheet, "BCK", "showBCardSprite", 0.15);
	var showFCardSprite = SpriteClass.createSprite(drawCardContainer, SpriteClass.cardSpriteSheet, card.value, "showFCardSprite", 0.32);
	showFCardSprite.visible = false;
	var origX = shoeContainer.x - cardSlotContainer.x;
	var origY = tableHeaderContainer.y - cardSlotMainContainer.y - tableContainer.y;
	showBCardSprite.x = (index < 1) ? 167 : 70;
	showBCardSprite.y = -60;
	showBCardSprite.rotation = -45;


	var polygon = new createjs.Shape();
	polygon.graphics.beginFill("rgba(0, 0, 0, 0)");
	polygon.graphics.moveTo(-90, -75).lineTo(90, -75).lineTo(90, -75).lineTo(60, 75).lineTo(-90, 75).lineTo(-90, -75);
	drawCardContainer.addChild(polygon);
	createjs.Tween.get(showBCardSprite)
		.to({x : 0, y : 0, scale: 0.32, rotation : 0}, 300)
		.call(function(){
			showBCardSprite.mask = polygon;
			showFCardSprite.mask = polygon;
			showFCardSprite.visible = true;
			showFCardSprite.x = 120;
			showFCardSprite.y = 27;
			createjs.Tween.get(polygon)
				.to({rotation: 10, x: -35}, 40)
				.to({rotation: 0, x: -45}, 60)
				.to({x: -55}, 60)
				.to({x: -60}, 40)
				.to({x: -70}, 60)
				.to({rotation: -2, x: -80}, 60)
				.to({rotation: -5, x: -90}, 60)
				.to({rotation: -5, x: -100}, 60)
				.to({rotation: -6, x: -115}, 60)
				.to({rotation: -6, x: -115}, 60)
				.call(function(){
					SoundClass.playAudio("flip");
				})
				.to({rotation: 0, x: 0}, 60);

			createjs.Tween.get(showFCardSprite)
				.to({x: 74, y : 27, rotation: 40}, 40)
				.to({x: 60, y : 13, rotation: 25}, 60)
				.to({x: 40, y : 7, rotation: 20}, 60)
				.to({x: 31, y : 5, rotation: 20}, 40)
				.to({x: 10, y : 2, rotation: 20}, 60)
				.to({x: -10, y : -1, rotation: 20}, 60)
				.to({x: -35, y : -5, rotation: 15}, 60)
				.call(function(){
					showBCardSprite.visible = false;
				})
				.to({x: -55, y : -5, rotation: 10}, 60)
				.to({x: -75, y : -5, rotation: 5}, 60)
				.to({x: -80, y : -5, rotation: 5}, 60)
				.to({x: 0, y : 0, rotation: 0}, 60)
				.call(function(){
					var cardType = (index < 1) ? "DRG" : "TGR";
					SoundClass.playSprite("hand_values", cardType+cardVal);
					cardValue.text = cardVal;
					showFCardSprite.shadow = new createjs.Shadow("rgba(0, 0, 0, .5)", 0, 8, 10);
				})
		});
};

CanvasGame.prototype.burnDrawCard = function(){
	var self = this;
	var tableContainer = self.gameContainer.getChildByName("tableContainer");
	var tableHeaderContainer = tableContainer.getChildByName("tableHeaderContainer");
	var shoeContainer = tableHeaderContainer.getChildByName("shoeContainer");
	var cardSlotMainContainer = tableContainer.getChildByName("cardSlotMainContainer");

	for(var i=0; i<2; i++){
		(function(){
			var index = i;
			var cardSlotContainer = cardSlotMainContainer.getChildByName("cardSlotContainer-"+index);
			var drawCardContainer = cardSlotContainer.getChildByName("drawCardContainer");
			if(drawCardContainer){
				var showBCardSprite = drawCardContainer.getChildByName("showBCardSprite");
				var showFCardSprite = drawCardContainer.getChildByName("showFCardSprite");

				createjs.Tween.get(showFCardSprite)
					.call(function(){
						showBCardSprite.scaleX = 0;
						showBCardSprite.visible = true;
					})
					.wait(500)
					.to({scaleX : 0}, 150)
					.call(function(){
						createjs.Tween.get(showBCardSprite)
							.to({scaleX : -0.32}, 150)
							.call(function(){
								self.cardValueTgr.text = null;
								self.cardValueDrg.text = null;
							})
					})
					.wait(300)
					.call(function(){
						createjs.Tween.get(drawCardContainer)
							.to({scale : 0.45, x : (index < 1)? -71 : -167, y : -82, alpha : 0}, 300)
							.call(function(){
								if(index > 0){
									socket.emit('playerbet history');
									socket.emit('get my balance');
								}
							});
						self.isDrawingPhase = false;
					})
				}
		})();

	}
};

CanvasGame.prototype.animateCoinToDealer = function(){
	var self = this;
	CGenClass.betsContainer.uncache();
	var tableContainer = self.gameContainer.getChildByName("tableContainer");
	var totalBetsContainer = self.gameContainer.getChildByName("totalBetsContainer");
	for(var i=0; i<CGenClass.betsContainer.children.length; i++){
		(function(){
			var index = i;
			var betsBg = CGenClass.betsContainer.children[index];
			var betType = betsBg.name.split("-")[1];
			var betIndex = self.results.findIndex(x => x === betType);
			if(betIndex < 0){
				createjs.Tween.get(betsBg)
					.wait(1700)
					.to({y: -280, x: 0}, 200);
			}
		})();
	}

	for(var i in self.betOrigins){
		var totalBetContainer = totalBetsContainer.getChildByName("totalBetContainer-"+i);
		var betValue = totalBetContainer.getChildByName("betValue");
		var betIndex = self.results.findIndex(x => x === i);
		if(betIndex < 0){
			betValue.text = 0;
			createjs.Tween.get(totalBetContainer)
				.wait(2000)
				.to({alpha : 0}, 200);
		}
	}
	self.showBetOptionWinner();
	setTimeout(function(){
		self.animateBackToTable();
	}, 2200);
	console.log("PROCESS 1 animateCoinToDealer")
};

CanvasGame.prototype.animateBackToTable = function(){
	console.log("PROCESS 2 animateBackToTable", PlayerClass.players.length)
	var self = this;
	for(var i=0; i<PlayerClass.players.length; i++){
		var index = i;
		var player = PlayerClass.players[index];
		if(player.bets){
			console.log("PROCESS 2 animateBackToTable 2", player.bets)
			for(var j=0; j<player.bets.length; j++){
				var pindex = j;
				var bets = player.bets[pindex];
				var betType = bets.betType;
				var betIndex = self.results.findIndex(x => x === betType);
				var coin = CChipsClass.defaultChips.findIndex(x => x === bets.betAmount);
				console.log("PROCESS 2 3 animateBackToTable 2", coin, bets.betAmount)
				if(betIndex > -1){
					var loop = (betType === "TIE") ? 8 : 1;
					for(var ii=0; ii<loop; ii++){
						self.createChipstoTable(coin, betType, index);
					}
				}
			}

		}
		var tieRes = self.results.findIndex(x => x === "TIE");
		if(tieRes > -1){
			if(player.totalBets){
				if(player.totalBets["DRG"] > 0){
					var betAmount = Math.floor(player.totalBets["DRG"]/2);
					CanvasPanelClass.getChipList(betAmount, "DRG", function(list, code){
						for(var k=0; k<list.length; k++){
							var coin = CChipsClass.defaultChips.findIndex(x => x === list[k]);
							self.createChipstoTable(coin, "DRG", index);
						}
					});
				}

				if(player.totalBets["TGR"] > 0){
					var betAmount = Math.floor(player.totalBets["TGR"]/2);
					CanvasPanelClass.getChipList(betAmount, "TGR", function(list, code){
						for(var k=0; k<list.length; k++){
							var coin = CChipsClass.defaultChips.findIndex(x => x === list[k]);
							self.createChipstoTable(coin, "TGR", index);
						}
					});
				}
			}
		}
		if((index+1) === PlayerClass.players.length){
			setTimeout(function(){
				self.removeOtherChips();
				setTimeout(function(){
					self.animateCoinToPlayers();
				}, 300);
			}, 100);
		}
	}
};

CanvasGame.prototype.createChipstoTable = function(coin, betType, index){
	var self = this;
	var betsBg = SpriteClass.createSprite(CGenClass.betsContainer, SpriteClass.tableSpriteSheet, "nvcoin"+(coin+1), "betsBg-"+betType+"-"+index, 0.743);
	betsBg.cache(-35, -35, 70, 70);
	betsBg.y = -280;
	var destX = self.betOrigins[betType].x;
	var destY = self.betOrigins[betType].y+80;
	var distanceY = (betType.length > 3) ? 22 : (betType === "TIE") ? 50 : 75;
	var distanceX = (betType.length > 3) ? 70 : (betType === "TIE") ? 50 : 75;
	destX = CGenClass.randomOrigin(distanceX) + destX;
	destY = CGenClass.randomOrigin(distanceY) + destY;
	createjs.Tween.get(betsBg)
		.to({y: destY, x: destX}, 200);
}

CanvasGame.prototype.removeOtherChips = function(){
	for(var i=0; i<CGenClass.betsContainer.children.length; i++){
		var bet = CGenClass.betsContainer.children[i];
		if(bet.y === -280){
			createjs.Tween.get(bet)
				.to({alpha : 0}, 100);
		}
	}
};

CanvasGame.prototype.animateCoinToPlayers = function(){
	var standingPlayerContainer = this.gameContainer.getChildByName("standingPlayerContainer");
	var destX, destY;

	for(var i=0; i<CGenClass.betsContainer.children.length; i++){
		var betChip = CGenClass.betsContainer.children[i];
		var scale = 1;
		if(betChip.y !== -280){
			var playerIndex = betChip.name.split("-")[2];
			playerIndex = Number(playerIndex);
			var playerPos = PlayerClass.players[playerIndex].pos;
			console.log("playerIndex", playerIndex, playerPos, PlayerClass.players[playerIndex])
			if(playerPos < 0){
				console.log("playerIndex if")
				destX = standingPlayerContainer.x;
				destY = standingPlayerContainer.y;
			}else {
				console.log("playerIndex else")
				destX = CSeatClass.seatsContainer.x + CSeatClass.seatsContainer.children[playerPos].x;
				destY = CSeatClass.seatsContainer.y + CSeatClass.seatsContainer.children[playerPos].y;
			}
			createjs.Tween.get(betChip)
				.to({x : destX, y: destY+80}, 400)
				.to({alpha : 0});
		}
	}

	this.burnDrawCard();
};

CanvasGame.prototype.showBetOptionWinner = function(){
	var self = this;
	var tableContainer = this.gameContainer.getChildByName("tableContainer");
	var betOptionsContainer = tableContainer.getChildByName("betOptionsContainer");
	var totalBetsContainer = self.gameContainer.getChildByName("totalBetsContainer");
	var animateBetOption = function(bg){
		createjs.Tween.get(bg)
			.to({alpha : 1}, 150)
			.to({alpha : 0}, 150)
			.to({alpha : 1}, 150)
			.to({alpha : 0}, 150)
			.to({alpha : 1}, 150)
			.wait(1700)
			.to({alpha : 0}, 150);
	};
	var tieRes = self.results.findIndex(x => x === "TIE");
	var playerIndex = PlayerClass.players.findIndex(x => x.displayname === userData.displayname);
	if(tieRes > -1 && PlayerClass.players[playerIndex].totalBets){
		if(PlayerClass.players[playerIndex].totalBets["DRG"] > 0){
			var betRes = self.betOption.findIndex(x => x.code === "DRG");
			var totalBetContainer = totalBetsContainer.getChildByName("totalBetContainer-"+"DRG");
			var betValue = totalBetContainer.getChildByName("betValue");
				var betVal = Number(PlayerClass.players[playerIndex].totalBets["TGR"]) / 2
				betValue.text = betVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
				createjs.Tween.get(totalBetContainer)
					.to({alpha : 0}, 200)
					.wait(400)
					.to({alpha : 1}, 100)
					.wait(200)
					.to({alpha : 0}, 200);
		}

		if(PlayerClass.players[playerIndex].totalBets["TGR"] > 0){
			var betRes = self.betOption.findIndex(x => x.code === "TGR");
			var totalBetContainer = totalBetsContainer.getChildByName("totalBetContainer-"+"TGR");
			var betValue = totalBetContainer.getChildByName("betValue");
				var betVal = Number(PlayerClass.players[playerIndex].totalBets["TGR"]) / 2
				betValue.text = betVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
				createjs.Tween.get(totalBetContainer)
					.to({alpha : 0}, 200)
					.wait(400)
					.to({alpha : 1}, 100)
					.wait(200)
					.to({alpha : 0}, 200);
		}

	}

	for(var i=0; i<this.results.length; i++){
		var betRes = this.betOption.findIndex(x => x.code === this.results[i]);
		var totalBetContainer = totalBetsContainer.getChildByName("totalBetContainer-"+self.results[i]);
		var betValue = totalBetContainer.getChildByName("betValue");
		var removedComma = (typeof(betValue.text) === 'number') ? betValue.text : betValue.text.replace(/\,/g,'');
		if(Number(removedComma) > 0) {
			var multiplier = (self.results[i] === "TIE") ? 8 : 2;
			var betVal = Number(removedComma) * multiplier;
			betValue.text = betVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
			createjs.Tween.get(totalBetContainer)
				.to({alpha : 1}, 200);
			createjs.Tween.get(totalBetContainer)
				.wait(800)
				.to({alpha : 0}, 200);
		} 
		if(this.results[i].length > 3){
			var res = this.results[i];
			var sideBetMainCode = res[0]+res[1]+res[2];
			var sideBetCode = res[3]+res[4]+res[5];
			var sideBetMain = this.betOption.findIndex(x => x.code === sideBetMainCode);
			var sideBet = this.sideBetOption.findIndex(x => x.code === sideBetCode);
			var betOptionContainer = betOptionsContainer.getChildByName("betOptionContainer-"+sideBetMain);
			var sideBetOptionsContainer = betOptionContainer.getChildByName("sideBetOptionsContainer");
			var sideBetOptionContainer = sideBetOptionsContainer.getChildByName("sideBetOptionContainer-"+sideBet);
			var sidebetBgContainer = sideBetOptionContainer.getChildByName("sidebetBgContainer");
			var sideBetOptionBg = sidebetBgContainer.getChildByName("sideBetOptionBg");
			if(!self.isSideBetDisabled){
				animateBetOption(sideBetOptionBg);
			}
		}
		if(betRes > -1){
			var betOptionContainer = betOptionsContainer.getChildByName("betOptionContainer-"+betRes);
			var betBgContainer = betOptionContainer.getChildByName("betBgContainer");
			var betOptionBg = betBgContainer.getChildByName("betOptionBg");
			animateBetOption(betOptionBg);
		}
	}
};

CanvasGame.prototype.createPlayersBetChips = function(payout, betsContainer, pos, defChips){
	var betContainer = CGenClass.createContainer(betsContainer, "betContainer-"+pos, true);
	betContainer.y = -230;
	var nearest = defChips.reverse().find(e => e <= payout);
	defChips.reverse();
	var coin =  defChips.findIndex(x => x === nearest);
	var betsBg = SpriteClass.createSprite(betContainer, SpriteClass.tableSpriteSheet, "nvcoin"+(coin+1), "betsBg", 0.743);
	return betContainer;
};

CanvasGame.prototype.burnCard = function(cardToBurn){
	var self = this;
	var burncount = CGenClass.getCardValue(cardToBurn);
	self.animateShowCard(cardToBurn);
	setTimeout(function(){
		self.animateBurnCards(burncount);
	}, 800);

};

CanvasGame.prototype.drawCard = function(drawCard){
	var self = this;
	var drawCardArray = [];
	for(var i in drawCard){
		drawCardArray.push({name : i, value : drawCard[i]});
	}
	var yellowCard = drawCardArray.findIndex(x => x.name === "skip");
	var dragonCard = drawCardArray.find(x => x.name === "dragon");
	var tigerCard = drawCardArray.find(x => x.name === "tiger");
	if(yellowCard === 0){
		createjs.Tween.get()
			.call(function(){
				self.animateYellowCard();
			})
			.wait(500)
			.call(function(){
				self.animateBurnCard(1);
			})
			.wait(500)
			.call(function(){
				self.animateDrawCard(dragonCard, 0);
			})
			.wait(1700)
			.call(function(){
				self.animateDrawCard(tigerCard, 1);
			});
	}else if(yellowCard === 1){
		createjs.Tween.get()
			.call(function(){
				self.animateBurnCard(1);
			})
			.wait(500)
			.call(function(){
				self.animateYellowCard();
			})
			.wait(500)
			.call(function(){
				self.animateDrawCard(dragonCard, 0);
			})
			.wait(1700)
			.call(function(){
				self.animateDrawCard(tigerCard, 1);
			});
	}else if(yellowCard === 2){
		createjs.Tween.get()
			.call(function(){
				self.animateBurnCard(1);
			})
			.wait(500)
			.call(function(){
				self.animateDrawCard(dragonCard, 0);
			})
			.wait(1700)
			.call(function(){
				self.animateYellowCard();
			})
			.wait(500)
			.call(function(){
				self.animateDrawCard(tigerCard, 1);
			});
	}else {
		createjs.Tween.get()
			.call(function(){
				self.animateBurnCard(1);
			})
			.wait(500)
			.call(function(){
				self.animateDrawCard(dragonCard, 0);
			})
			.wait(1700)
			.call(function(){
				self.animateDrawCard(tigerCard, 1);
			});
	}
};

CanvasGame.prototype.cleanCanvas = function(){
	var self = this;
	console.log("TIMEERRR cleanCanvas")
	this.haveBet = false;
	this.results = [];
	this.allBets = [];
	this.totalBetTemp = 0;

	CGameClass.statusLabel.text = "BETTING OPEN";
	CGameClass.statusLabel.color = "#0EE937";
	CGameClass.statusLabel.font = "200 24px Carter";
	CGameClass.gradientLineTop.graphics.clear();
	CGameClass.gradientLineTop.graphics
		.setStrokeStyle(3, "round").beginStroke("rgba(33, 249, 70, .6)")
		.moveTo(-34.5, 0)
		.lineTo(34.5, 0);
	CGameClass.gradientLineTop.shadow = new createjs.Shadow("#21F946", 0, 0, 4);
	CGameClass.gradientLineBot.graphics.clear();
	CGameClass.gradientLineBot.graphics
		.setStrokeStyle(3, "round").beginStroke("rgba(33, 249, 70, .6)")
		.moveTo(-34.5, 0)
		.lineTo(34.5, 0);
	CGameClass.gradientLineBot.shadow = new createjs.Shadow("#21F946", 0, 0, 4);

	var tableContainer = this.gameContainer.getChildByName("tableContainer");
	var cardSlotMainContainer = tableContainer.getChildByName("cardSlotMainContainer");
	var betOptionsContainer = tableContainer.getChildByName("betOptionsContainer");
	var totalBetsContainer = self.gameContainer.getChildByName("totalBetsContainer");
	self.cardValueTgr.text = null;
	self.cardValueDrg.text = null;
	for(var i in self.betOrigins){
		var totalBetContainer = totalBetsContainer.getChildByName("totalBetContainer-"+i);
		totalBetContainer.alpha = 0;
		var betValue = totalBetContainer.getChildByName("betValue");
		betValue.text = 0;
	}
	for(var i=0; i<2; i++){
		(function(){
			var index = i;
			var cardSlotContainer = cardSlotMainContainer.getChildByName("cardSlotContainer-"+index);
			cardSlotContainer.removeAllChildren();
		})();
	}

	CGenClass.betsContainer.removeAllChildren();
	CGenClass.betsContainer.uncache();
	CGenClass.betsContainer.cache(-640, -500, 1280, 1000);

	CGenClass.animateNumber(CanvasPanelClass.totalWin, 0, function(playerBalanceDisplay, balance){
		var display = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
		CanvasPanelClass.totalWinValue.text = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
	});

	CGenClass.animateNumber(CanvasPanelClass.totalBet, 0, function(playerBalanceDisplay, balance){
		var display = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
		CanvasPanelClass.totalBetValue.text = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
	});

	CanvasPanelClass.totalBet = 0;
	CanvasPanelClass.totalWin = 0;

	for(var ii=0; ii<PlayerClass.playerBetsResult.length; ii++){
		var player = PlayerClass.playerBetsResult[ii];
		player.totalAmount = 0;
		player.totalPayout = 0;
	}

	for(var i=0; i<PlayerClass.players.length; i++){
		PlayerClass.players[i].bets = [];
		PlayerClass.players[i].totalBets = { "DRG" : 0, "TGR" : 0};
	}

	var timerContainer = tableContainer.getChildByName("timerContainer");
	var crcl = timerContainer.getChildByName("mainCircle");
	crcl.rotation = 0;
	crcl.graphics.clear();
	crcl.graphics
		.beginFill("#03fe00")
		.drawCircle(0, -42, 4);
	TimerClass.isTickAdded = false;
	TimerClass.isRotating = false;
	TimerClass.isShaking = false;
	TimerClass.timerLabel.color = "#03fe00";
	TimerClass.timerLabel.shadow = new createjs.Shadow("#03fe00", 0, 0, 15);
};

CanvasGame.prototype.evaluateResult = function(betResult){
	var self = this;
	self.results = betResult.gameResult;
	for(var i=0; i<betResult.playerBets.length; i++){
		var bets = betResult.playerBets[i];
		PlayerClass.playerBetsResult[bets.pos+1].totalPayout = PlayerClass.playerBetsResult[bets.pos+1].totalPayout + bets.totalPayout;
		PlayerClass.playerBetsResult[bets.pos+1].totalAmount = PlayerClass.playerBetsResult[bets.pos+1].totalAmount + bets.totalAmount;
	}

	self.showResult();
	setTimeout(function(){
		self.animateCoinToDealer();
	}, 800)
};

CanvasGame.prototype.animateRebet = function(betDetails, index){
	setTimeout(function(){
		PlayerClass.storeBets(betDetails);
		CGameClass.animateBet(betDetails);
	}, (index > 1) ? 200 : 0);
};

CanvasGame.prototype.animateShuffle = function(){
	var self = this;
	var shuffleAnimationContainer = CGenClass.mainContainer.getChildByName("shuffleAnimationContainer");
	shuffleAnimationContainer.scale = 1.5;
	var tableContainer = this.gameContainer.getChildByName("tableContainer");
	var tableHeaderContainer = tableContainer.getChildByName("tableHeaderContainer");
	var shoeContainer = tableHeaderContainer.getChildByName("shoeContainer");
	var shoeSprite = shoeContainer.getChildByName("shoeSprite");
	var animation = shuffleAnimationContainer.getChildByName("animation");
	animation.paused = false;
	animation.y = -60;
	createjs.Tween.get()
		.wait(200)
		.call(function(){
			self.removeCardonBurnShoe();
			shuffleAnimationContainer.visible = true;
		})
		.wait(3400)
		.call(function(){
			createjs.Tween.get()
				.wait(300)
				.call(function(){
					shoeSprite.gotoAndStop("shoe");
				})
			createjs.Tween.get(animation)
				.to({x : 108, y: -200, scale: .65, rotation : -45}, 300)
				.to({alpha : 0}, 300)
		})
		.wait(1500)
		.call(function(){
			shuffleAnimationContainer.removeAllChildren();
			shuffleAnimationContainer.visible = false;
			var animationtemp = shuffleAnimationContainer.addChild(new createjs.Sprite(SpriteClass.cardShufflingSpriteSheet, "run"));
			animationtemp.name = "animation";
			animationtemp.paused = true;
		})
};

CanvasGame.prototype.removeCardonBurnShoe = function(){
	var tableContainer = this.gameContainer.getChildByName("tableContainer");
	var tableHeaderContainer = tableContainer.getChildByName("tableHeaderContainer");
	var shoeContainer = tableHeaderContainer.getChildByName("shoeContainer");
	var shoeSprite = shoeContainer.getChildByName("shoeSprite");
	var burnCardsContainer = tableHeaderContainer.getChildByName("burnCardsContainer");
	var burnSprite = burnCardsContainer.getChildByName("burnSprite");

	shoeSprite.gotoAndStop("emptyshoe");
	burnSprite.gotoAndStop("burnCardEmpty");
};

CanvasGame.prototype.storeRebet = function(betDetails){
	var self = this;
	if(CanvasPanelClass.enableRebet){
		self.rebetValues = {};
		self.totalRebetAmount = 0;
		CanvasPanelClass.enableRebet = false;
		CanvasPanelClass.updateRebetStatus(CanvasPanelClass.enableRebet);
	}
	console.log("storeRebet", betDetails, self.rebetValues);
	self.totalRebetAmount = betDetails.betAmount+self.totalRebetAmount;
	if(self.rebetValues[betDetails.betType]){
			self.rebetValues[betDetails.betType].stake = betDetails.betAmount+self.rebetValues[betDetails.betType].stake;
	}else{
		self.rebetValues[betDetails.betType] = {};
		self.rebetValues[betDetails.betType].code = betDetails.betType;
		self.rebetValues[betDetails.betType].stake = betDetails.betAmount;
		self.rebetValues[betDetails.betType].winloss = 0;
		self.rebetValues[betDetails.betType].win = false;
	}
};

CanvasGame.prototype.checkRebetValues = function(){
	var self = this;
	var isAllSideBet = true;
	if(self.roundCounter < 51) return false;
	var values = Object.values(CGameClass.rebetValues);
	for(var i=0; i<values.length; i++){
		if(values[0].code.length < 6){
			isAllSideBet = false;
		}
		if(i === values.length-1){
			console.log("checkRebetValues", isAllSideBet);
			return isAllSideBet;
		}
	}
};

CanvasGame.prototype.reconstructGame = function(bets){
	if(!bets) return false;
	var self = this;
	var chips = bets.chips;
	// console.log("chipDetails %%%%%%%%%%%%%%%%% reconstructGame", bets)
	for(var i=0; i<chips.length; i++){
		var chip = chips[i];
		var playerIndex = PlayerClass.players.findIndex(x => x.displayname === chip.player);
		var chipIndex = CChipsClass.defaultChips.findIndex(x => x === chip.amount);


		if(chipIndex < 0){
			CanvasPanelClass.getChipList(chip.amount, chip, function(list, chipDetails){
				for(var k=0; k<list.length; k++){
					var dest = chipDetails.destination;
					if(!dest){
						var destX = self.betOrigins[chipDetails.code].x;
						var destY = self.betOrigins[chipDetails.code].y;
						var distanceY = (chipDetails.code.length > 3) ? 22 : (chipDetails.code === "TIE") ? 50 : 75;
						var distanceX = (chipDetails.code.length > 3) ? 70 : (chipDetails.code === "TIE") ? 50 : 75;
						dest = {
							x: CGenClass.randomOrigin(distanceX) + destX,
							y : CGenClass.randomOrigin(distanceY) + destY,
						}
					}
					var betDetail = {
						betAmount : list[k],
						displayname : chipDetails.player,
						betType : chipDetails.code,
						destination : dest,
						pos : PlayerClass.players[playerIndex].pos,
						er : chipDetails.exchangeRate,
					}
					// console.log("chipDetails %%%%%%%%%%%%%%%%% if", chipDetails)
					PlayerClass.storeBets(betDetail);
					self.animateBet(betDetail);
					// if(i === chips.length-1){
					// 	CGenClass.subtractToBalance(betDetail.betAmount, true);
					// }else{
					// 	CGenClass.subtractToBalance(betDetail.betAmount, false);
					// }
				}
			});
		}else {
			var dest = chip.destination;
			if(!dest){
				var destX = self.betOrigins[chip.code].x;
				var destY = self.betOrigins[chip.code].y;
				var distanceY = (chip.code.length > 3) ? 22 : (chip.code === "TIE") ? 50 : 75;
				var distanceX = (chip.code.length > 3) ? 70 : (chip.code === "TIE") ? 50 : 75;
				dest = {
					x: CGenClass.randomOrigin(distanceX) + destX,
					y : CGenClass.randomOrigin(distanceY) + destY,
				}
			}
			var betDetail = {
				betAmount : chip.amount,
				displayname : chip.player,
				betType : chip.code,
				destination : dest,
				pos : PlayerClass.players[playerIndex].pos,
				er : chip.exchangeRate,
			}
			// console.log("chipDetails %%%%%%%%%%%%%%%%% else", chip)
			PlayerClass.storeBets(betDetail);
			self.animateBet(betDetail);
			// if(i === chips.length-1){
			// 	CGenClass.subtractToBalance(betDetail.betAmount, true);
			// }else{
			// 	CGenClass.subtractToBalance(betDetail.betAmount, false);
			// }
		}
	}
};

CanvasGame.prototype.updateGameRoundID = function(data){
	this.gameRoundLabel.text = "GAME ROUND "+data.roundId; 
};

CanvasGame.prototype.updateTableName = function(){
	var self = this;
	// this.tableNameLabel.text = self.tableInfo.tableName+"("+PlayerClass.players.length+"/"+self.tableInfo.maxPlayer+")";
	if(self.tableNameLabel){
		self.tableNameLabel.text = self.tableInfo.tableName;
		self.playerCountIcon.x = self.tableNameLabel.getBounds().width+18;
		self.playerCountLabel.text = "("+PlayerClass.players.length+"/"+self.tableInfo.maxPlayer+")";
		self.playerCountLabel.x = self.playerCountIcon.x+9;
		CGenClass.clearRoundRect(self.tableNameHitArea, "#FFF", 0, "#000", (self.tableNameLabel.getBounds().width+self.playerCountLabel.getBounds().width+20), 40, 0, false);
	}
	// self.tableNameHitArea =  CGenClass.createRoundRect(tableNameContainer, "tableNameHitArea", "#FFF", 0, "#000", 300, 50, 0, true);
};

CanvasGame.prototype.clearGame = function(){
	this.gameContainer = null;
	this.results = [];
	this.resourcesComplete = false;
	this.tableDetails = null;
	this.haveBet = false;
	this.allBets = [];
	this.totalBetTemp = 0;
	this.balanceTemp = 0;
	this.cardValueDrg = null;
	this.cardValueTgr = null;
	this.tableMinVal = null;
	this.tableMaxVal = null;
	this.rebetValues = {};
	this.totalRebetAmount = 0;
	this.standingplayerCount = null;
	this.gameRoundLabel = null;
	this.tableNameLabel = null;
	this.playerCountLabel = null;
	this.tableInfo = {tableName : "null", maxPlayer: 50};
	this.statusLabel = null;
	this.tableBitmap = null;
	this.gradientLineTop = null;
	this.gradientLineBot = null;
	this.isDrawingPhase = false;
	this.gameTicker = null;
	this.waitForNextRoundContainer = null;
	this.rebetValuesTemp = {};
	this.totalRebetTemp = null;
	this.sessionInterval = null;
	this.isSideBetDisabled = false;
	this.sideBetDisableContainer = null;
	this.roundCounter = 0;
	this.tableNameHitArea = null;
	this.playerCountIcon = null;
};

CanvasGame.prototype.animateBetHere = function(status){
	var self = this;
	if(status){
		if(!TimerClass.tickStarted) return false;
		if(CGameClass.haveBet) return false;
		self.betHereMainContainer.visible = true;
		console.log("self.betHereMainContainer.children", self.betHereMainContainer.children)
		for(var i=0; i<self.betHereMainContainer.children.length; i++){
			(function(){
				var index = i;
				var betHereContainer = self.betHereMainContainer.children[index];
				var betHereBorder = betHereContainer.getChildByName("betHereBorder");
				var betHereText = betHereContainer.getChildByName("betHereText");
				if(betHereBorder){
					betHereBorder.alpha = 0;
					if(self.isSideBetDisabled){
						betHereContainer.visible = false;
					}else{
						betHereContainer.visible = true;
						createjs.Tween.get(betHereBorder, {loop : true})
							.to({alpha : 1}, 300)
							.to({alpha : 0}, 400)
							.wait(600)
						if(betHereText){
							createjs.Tween.get(betHereText, {loop : true})
							.to({scale : .9}, 300)
							.to({scale : 1}, 400)
							.wait(600)
						}
					}
					
				}
			})();
		}
	}else {
		self.betHereMainContainer.visible = false;
		if(!self.betHereMainContainer.visible) return false;
		for(var i=0; i<self.betHereMainContainer.children.length; i++){
			(function(){
				var index = i;
				var betHereContainer = self.betHereMainContainer.children[index];
				var betHereBorder = betHereContainer.getChildByName("betHereBorder");
				createjs.Tween.get(betHereBorder, {override : true})
					.to({alpha : 0}, 300)
			})();
		}
	}
};

CanvasGame.prototype.setTotalRound = function(){
	if(!LoadingClass.loadComplete) return false;
	var self = this;
	self.numOfRounds = self.numOfRounds+1;
	if(self.numOfRounds > 1){
		self.isBetHereVisible = false;
	}
};

CanvasGame.prototype.removeTickers = function(){
	console.log("REMOVE TICKER");
	CGenClass.mainContainer.cache(-640, -360, 1280, 720);
	CGenClass.isSocketDisconnected = true;
	createjs.Ticker.off("tick", self.gameTicker);
	createjs.Ticker.off("tick", LoadingClass.loadingTicker);
	if(TimerClass.tickListener){
		createjs.Ticker.off("tick", TimerClass.tickListener);
	}
};

CanvasGame.prototype.restartGame = function(next){
	var self = this;
	CGenClass.mainContainer.removeAllChildren();
	CGenClass.alertMainContainer.removeAllChildren();

	LoadingClass.clearLoading();
	self.clearGame();
	AvatarClass.clearAvatar();
	CChipsClass.clearChips();
	CGenClass.clearCGen();
	CanvasPanelClass.clearPanel();
	CSeatClass.clearSeat();
	StandingClass.clearStanding();
	EmojiClass.clearEmoji();
	PlayerClass.clearPlayer();
	ResourcesClass.clearResources();
	RoadMapClass.clearRoadMap();
	SoundClass.clearSound();
	SpriteClass.clearSprites();
	TimerClass.clearTimer();
	EndTimerClass.clearTimer();

	LoadingClass.init();
	next();
};

var CGameClass = new CanvasGame();