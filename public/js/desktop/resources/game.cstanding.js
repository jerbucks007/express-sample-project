var StandingPlayers = function(){
	this.standingContentListContainer = null;
	this.standingScrollContainer = null;
	this.scrollBar = null;
	this.standplayerIcon = null;
	this.currentY = 0;
	this.scrollStart = null;
	this.marker = true;
	this.isCloseEnable = false;
};

StandingPlayers.prototype.createStandingContainer = function(next){
	var self = this;

	var standingPlayerContainer = CGenClass.createContainer(CGameClass.gameContainer, "standingPlayerContainer", true);
	standingPlayerContainer.x = -589;
	standingPlayerContainer.y = 192;

	self.standplayerIcon = SpriteClass.createSprite(standingPlayerContainer, SpriteClass.tableSpriteSheet, "standingPlayerButton", "standplayerIcon", 1);
	CGameClass.standingplayerCount = CGenClass.createText(standingPlayerContainer, "standingplayerCount", "center", "middle", "#FFF", "900 22px Roboto CondensedBold", PlayerClass.standingPlayers.length);
	CGameClass.standingplayerCount.y = 30;
	CGenClass.addMouseOverandOut(standingPlayerContainer, 1.1, 1);

	var sHitarea = CGenClass.createCircle(standingPlayerContainer, "sHitarea", "rgba(0, 0, 0, 1)", 2, "rgba(255,255,255,1)", 40, false);
	standingPlayerContainer.hitArea = sHitarea;

	var standingPlayersListMainContainer = CGenClass.createContainer(CGameClass.gameContainer, "standingPlayersListMainContainer", false);
	standingPlayersListMainContainer.x = -502; //-455
	standingPlayersListMainContainer.y = 35; //-43
	standingPlayersListMainContainer.alpha = 0;
	var standingPlayersListContainer = CGenClass.createContainer(standingPlayersListMainContainer, "standingPlayersListContainer", true);
	var standingPlayerListBg = CGenClass.createRoundRect(standingPlayersListContainer, "standingPlayerListBg", "rgba(0, 0, 0, .9)", 1, "#FFF", 267, 470, 5, true);
	var standingPlayerListHitArea = CGenClass.createRoundRect(standingPlayersListContainer, "standingPlayerListHitArea", "rgba(0, 0, 0, 1)", 1, "#FFF", 267, 470, 5, false);
	standingPlayersListContainer.hitArea = standingPlayerListHitArea;

	var standingPlayerHeaderContainer = CGenClass.createContainer(standingPlayersListContainer, "standingPlayerHeaderContainer", true);
	standingPlayerHeaderContainer.y = -198;
	var standingPlayerLabel = CGenClass.createText(standingPlayerHeaderContainer, "standingPlayerLabel", "left", "middle", "#FCA204", "900 14px LatoBlack", TranslationClass.getTranslation("standingPlayer"));
	standingPlayerLabel.x = -106;
	var standingLine = CGenClass.createRect(standingPlayerHeaderContainer, "standingLine", "#FFF", 0, "rgba(0,0,0,0)", 209, 1, true);
	standingLine.y = 25;
	var standingPlayerContentContainer = CGenClass.createContainer(standingPlayersListMainContainer, "standingPlayerContentContainer", true);
	standingPlayerContentContainer.y = 14;


	self.standingScrollContainer = CGenClass.createContainer(standingPlayerContentContainer, "standingScrollContainer", false);
	self.standingScrollContainer.x = 107;
	var standingScrollBg = CGenClass.createRoundRect(self.standingScrollContainer, "standingContentBG", "#1A1A1A", 0, "rgba(0,0,0,0)", 10, 363, 5, true);

	console.log("standingScrollContainer", self.standingScrollContainer)

	var standingContentBG = CGenClass.createRect(standingPlayerContentContainer, "standingContentBG", "rgba(0, 0, 0, 0)", 0, "rgba(0,0,0,0)", 210, 372, true);
	self.standingContentListContainer = CGenClass.createContainer(standingPlayerContentContainer, "standingContentListContainer", true);
	var standingContentListBG = CGenClass.createRect(self.standingContentListContainer, "standingContentListBG", "gray", 0, "rgba(0,0,0,0)", 210, 372, false);
	self.standingContentListContainer.hitArea = standingContentListBG;
	var standingAvatarsContainer = CGenClass.createContainer(self.standingContentListContainer, "standingAvatarsContainer", true);
	// var sHitarea = CGenClass.createCircle(self.standingContentListContainer, "sHitarea", "rgba(0, 0, 0, 1)", 2, "rgba(255,255,255,1)", 20, true);
	self.standingContentListContainer.mask = standingContentBG;

	var standingPlayerCloseContainer = CGenClass.createContainer(CGameClass.gameContainer, "standingPlayerCloseContainer", false);
	standingPlayerCloseContainer.x = -590;
	standingPlayerCloseContainer.y = 190;
	var standingPlayerCloseBg = CGenClass.createCircle(standingPlayerCloseContainer, "standingPlayerCloseBg", "rgba(255,255,255,1)", 1, "rgba(255,255,255,1)", 40, true);
	var closeSprite = SpriteClass.createSprite(standingPlayerCloseContainer, SpriteClass.panelSpriteSheet, "close", "closeSprite", 1.2);
	var matrix = new createjs.ColorMatrix().adjustBrightness(-200);
	closeSprite.filters = [new createjs.ColorMatrixFilter(matrix)];
	closeSprite.cache(-18, -18, 36, 36);
	CGenClass.addMouseOverandOut(standingPlayerCloseContainer, 1.1, 1);

	var standingPlayerOuterBG = CGameClass.gameContainer.getChildByName("standingPlayerOuterBG");

	standingPlayerContainer.on("click", function(){
		CGenClass.checkSession(function(status){
			if(status){
				// standingPlayersListMainContainer.visible = true;
				// standingPlayerOuterBG.visible = true;
				CGameClass.displayMinMaxContainer(false);
				EmojiClass.openTauntList(false, 10);
				// createjs.Tween.get(standingPlayersListMainContainer)
				// 	.to({x : -455, y : -43, alpha : 1}, 150)
				// 	.call(function(){
				// 		self.standplayerIcon.visible = false;
				// 		standingPlayerCloseContainer.visible = true;
				// 		self.isCloseEnable = true;
				// 		self.currentY = (!standingPlayersListMainContainer.visible) ? null : self.currentY;
				// 	});
				self.displayStandingPlayerList(true);
				console.log("visible open", standingPlayersListMainContainer.visible);
			}else{
				CGenClass.displayAlert("invalid session");
			}
		});
	});

	standingPlayerCloseContainer.on("click", function(){
		CGenClass.checkSession(function(status){
			if(status){
				if(self.isCloseEnable){
					// self.standplayerIcon.visible = true;
					// createjs.Tween.get(standingPlayersListMainContainer)
					// 	.to({x : -502, y: 35, alpha : 0}, 150)
					// 	.call(function(){
					// 		standingPlayerCloseContainer.visible = false;
					// 		standingPlayersListMainContainer.visible = false;
					// 		self.isCloseEnable = false;
					// 		console.log("visible close", standingPlayersListMainContainer.visible);
					// 		self.currentY = (!standingPlayersListMainContainer.visible) ? null : self.currentY;
					// 	});
					// 	standingPlayerOuterBG.visible = false;
					self.displayStandingPlayerList(false);
				}
			}else{
				CGenClass.displayAlert("invalid session");
			}
		});
	});

	standingPlayersListContainer.on("click", function(){
	});

	var touchStart = null;
	self.standingContentListContainer.on("pressmove", function(e){
		touchStart = (touchStart === null) ? e.rawY : touchStart;
		var diff = (CGenClass.isMobile) ? 25 : 20;
		var contH = standingContentListBG.graphics.command.h;
		if(touchStart > e.rawY){
			var min = ((contH-372)/2)* -1;
			self.standingContentListContainer.y = (min < self.standingContentListContainer.y) ? self.standingContentListContainer.y-diff : self.standingContentListContainer.y;
			if(self.scrollBar){
				var scrollH = (363/contH)*363;
				var smax = ((scrollH-363)/2)*-1;
				var move = (diff/contH)*363;
				self.scrollBar.y = (smax > self.scrollBar.y) ? self.scrollBar.y+move: self.scrollBar.y;
			}
		}else {
			var max = ((contH-372)/2) * 1;
			self.standingContentListContainer.y = (max > self.standingContentListContainer.y) ? self.standingContentListContainer.y+diff : self.standingContentListContainer.y;
			if(self.scrollBar){
				var scrollH = (363/contH)*363;
				var smin = ((scrollH-363)/2);
				var move = (diff/contH)*363;
				self.scrollBar.y = (smin < self.scrollBar.y) ? self.scrollBar.y-move : self.scrollBar.y;
			}
		}
	});

	self.standingContentListContainer.on("pressup", function(e){
		touchStart = null;
	});

	next();
};

StandingPlayers.prototype.updateStanding = function(){
	var self = this;
	var standingContentListBG = self.standingContentListContainer.getChildByName("standingContentListBG");
	var standingAvatarsContainer = self.standingContentListContainer.getChildByName("standingAvatarsContainer");

	var excess = (PlayerClass.standingPlayers.length > 8) ? Math.round((PlayerClass.standingPlayers.length-8)/2) : 0;
	var contH = (PlayerClass.standingPlayers.length > 6) ? (PlayerClass.standingPlayers.length < 8) ? 372 + 66.5 : 372+66.5+(excess*110): 372;
	var bgY = ((contH-372)/2);
	standingContentListBG.graphics.clear();
	standingContentListBG.graphics
		.setStrokeStyle(0).beginStroke("rgba(0,0,0,0)")
		.beginFill("gray").drawRect(0, 0, 210, contH);
	standingContentListBG.regX = standingContentListBG.graphics.command.w / 2;
	standingContentListBG.regY = standingContentListBG.graphics.command.h / 2;

	self.standingContentListContainer.y = bgY;
	if(self.scrollBar) self.standingScrollContainer.removeChildAt(1);
	if(contH > 372){
		self.standingScrollContainer.visible = true;
		var scrollH = (363/contH)*363;
		self.scrollBar = CGenClass.createRoundRect(self.standingScrollContainer, "scrollBar", "#8E8C8D", 0, "rgba(255,255,255,0)", 10, scrollH, 5, true);
		self.scrollBar.y = ((scrollH-363)/2);
		CGenClass.addMouseOverandOut(self.scrollBar, 1.05, 1);
		var touchStart = null;
		var diff = (CGenClass.isMobile) ? 25 : 20;
		self.scrollBar.on("pressmove", function(e){
			touchStart = (touchStart === null) ? e.rawY : touchStart;
			var contH = standingContentListBG.graphics.command.h;
			if(touchStart > e.rawY){
				var smin = ((scrollH-363)/2);
				var move = (diff/contH)*363;
				self.scrollBar.y = (smin < self.scrollBar.y) ? self.scrollBar.y-move : self.scrollBar.y;
				var max = ((contH-372)/2) * 1;
				self.standingContentListContainer.y = (max > self.standingContentListContainer.y) ? self.standingContentListContainer.y+diff : self.standingContentListContainer.y;
			}else {
				var smax = ((scrollH-363)/2)*-1;
				var move = (diff/contH)*363;
				self.scrollBar.y = (smax > self.scrollBar.y) ? self.scrollBar.y+move: self.scrollBar.y;
				var min = ((contH-372)/2)* -1;
				self.standingContentListContainer.y = (min < self.standingContentListContainer.y) ? self.standingContentListContainer.y-diff : self.standingContentListContainer.y;
			}
		});

		self.scrollBar.on("pressup", function(e){
			touchStart = null;
		});
	}else {
		self.standingScrollContainer.visible = false;
	}

	var origY = ((contH/2)-(105/2))*-1;
	var leftX = -52.5;
	var rightX = 52.5;
	standingAvatarsContainer.removeAllChildren();
	for(var i=0; i<PlayerClass.standingPlayers.length; i++){
		var standing = PlayerClass.standingPlayers[i];
		var index = i;

		var seatContainer = CGenClass.createContainer(standingAvatarsContainer, "seatContainer-"+index, true);
		seatContainer.y = origY;
		seatContainer.x = ((index%2) > 0) ? rightX : leftX;

		var avatarButtonContainer = CGenClass.createContainer(seatContainer, "avatarButtonContainer", true);
		var seatBorder = avatarButtonContainer.addChild(new createjs.Shape());
		seatBorder.graphics
			.setStrokeStyle(0).beginStroke("rgba(0, 0, 0, 0)")
			.beginLinearGradientFill(["#834612","#f1e597", "#f1e597"], [0, .5, 1], 0, -20,  0, 80).drawCircle(0, 0, 38.5);
		seatBorder.name = "seatBorder"
		var seatBg = CGenClass.createCircle(avatarButtonContainer, "seatBg", "rgba(0, 0, 0, .6)", 0, "rgba(0, 0, 0, 0)", 36.5, true);
		
		var topGradient = avatarButtonContainer.addChild(new createjs.Shape());
			topGradient.graphics
				.setStrokeStyle(0).beginStroke("rgba(0, 0, 0, 0)")
				.beginLinearGradientFill(["rgba(255,255,255,.8)","rgba(0,0,0,0)", "rgba(0,0,0,0)"], [0, 1, .3], 0, -22,  0, 50).drawCircle(0, 0, 25);
		topGradient.name = "topGradient";
		topGradient.y = -10;

		var playerAvatarSprite = SpriteClass.createSprite(avatarButtonContainer, SpriteClass.avatarSpriteSheet, "avatar"+standing.avatar, "playerAvatarSprite", .178);
		playerAvatarSprite.mask = seatBg;

		var displayNameContainer = CGenClass.createContainer(seatContainer, "displayNameContainer", true);
		displayNameContainer.y = 30;
		var displayNameBorder = CGenClass.createRoundRectStrokeGradient(displayNameContainer, "displayNameBorder", "rgba(0, 0, 0, .8)", 1, ["#834612","#f1e597", "#f1e597"], 78, 22, 5, true, 
			[0, .5, 1], 0, 0,  0, 48);
		var playerName = CGenClass.createText(displayNameContainer, "playerName", "center", "middle", "#FFF", "700 13px Roboto Condensed", CSeatClass.formatName(standing.displayname));

		origY = (index > 0 && index%2 > 0) ? origY + 109 : origY;
	}
};

StandingPlayers.prototype.displayStandingPlayerList = function(visible){
	console.log("displayStandingPlayerList", visible);
	var self = this;
	var standingPlayersListMainContainer = CGameClass.gameContainer.getChildByName("standingPlayersListMainContainer");
	var standingPlayerCloseContainer = CGameClass.gameContainer.getChildByName("standingPlayerCloseContainer");
	var standingPlayerOuterBG = CGameClass.gameContainer.getChildByName("standingPlayerOuterBG");
	var bettingStatusContainer = CGameClass.gameContainer.getChildByName("bettingStatusContainer");
	var bettingCloseStatusContainer = bettingStatusContainer.getChildByName("bettingCloseStatusContainer");
	var resultContainer = CGameClass.gameContainer.getChildByName("resultContainer");
	if(visible && !bettingCloseStatusContainer.alpha){
		if(resultContainer.visible) return false;
		standingPlayersListMainContainer.visible = true;
		standingPlayerOuterBG.visible = true;
		createjs.Tween.get(standingPlayersListMainContainer)
			.to({x : -455, y : -43, alpha : 1}, 150)
			.call(function(){
				self.standplayerIcon.visible = false;
				standingPlayerCloseContainer.visible = true;
				self.isCloseEnable = true;
				self.currentY = (!standingPlayersListMainContainer.visible) ? null : self.currentY;
			});
	}else{
		self.standplayerIcon.visible = true;
		createjs.Tween.get(standingPlayersListMainContainer, {override : true})
			.to({x : -502, y: 35, alpha : 0}, 150)
			.call(function(){
				standingPlayerCloseContainer.visible = false;
				standingPlayersListMainContainer.visible = false;
				self.isCloseEnable = false;
				self.currentY = (!standingPlayersListMainContainer.visible) ? null : self.currentY;
			});
		standingPlayerOuterBG.visible = false;
	}
};

StandingPlayers.prototype.scrollList = function(origin){
	var self = this;
	self.scrollStart = (self.scrollStart === null) ? origin : self.scrollStart;
	var standingContentListBG = self.standingContentListContainer.getChildByName("standingContentListBG");
	var contH = standingContentListBG.graphics.command.h;
	if(self.scrollStart > origin){
		var min = ((contH-372)/2)* -1;
		self.standingContentListContainer.y = (min < self.standingContentListContainer.y) ? self.standingContentListContainer.y-5 : self.standingContentListContainer.y;
	}else {
		var max = ((contH-372)/2) * 1;
		self.standingContentListContainer.y = (max > self.standingContentListContainer.y) ? self.standingContentListContainer.y+5 : self.standingContentListContainer.y;
	}
};

StandingPlayers.prototype.clearStanding = function(){
	this.standingContentListContainer = null;
	this.standingScrollContainer = null;
	this.scrollBar = null;
	this.standplayerIcon = null;
	this.currentY = 0;
	this.scrollStart = null;
	this.marker = true;
	this.isCloseEnable = false;
};

var StandingClass = new StandingPlayers();