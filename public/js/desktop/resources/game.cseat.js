var CanvasSeat = function(){
	this.seatPos = [
		{id: 1, player: null, x: -489, y: 0},{id: 2, player: null, x: -396, y: 0},{id: 3, player: null, x: -303, y: 0},
		{id: 4, player: null, x: 303, y: 0},{id: 5, player: null, x: 396, y: 0},{id: 6, player: null, x: 489, y: 0},
	];
	this.seatsContainer = null;
	this.selectedSeat = null;
	this.isSeatDisable = null;
};

CanvasSeat.prototype.createSeats = function(next){
	var self = this;
	self.seatsContainer = CGenClass.createContainer(CGameClass.gameContainer, "seatsContainer", false);
	self.seatsContainer.y = 183;
	for(var i=0; i<self.seatPos.length; i++){
		(function () {
			var index = i;
			var seat = self.seatPos[index];
			var seatContainer = CGenClass.createContainer(self.seatsContainer, "seatContainer-"+index, true);
			seatContainer.x = seat.x;
			seatContainer.y = seat.y;
			var avatarButtonContainer = CGenClass.createContainer(seatContainer, "avatarButtonContainer", true);
			var avatarButtonBorder = CGenClass.createCircle(avatarButtonContainer, "avatarButtonBorder", "rgba(0, 0, 0, .8)", 2, "rgba(255,255,255,.5)", 39.5, true);
			avatarButtonBorder.shadow = new createjs.Shadow("rgba(0, 0, 0, .5)", 0, 6, 6);
			var avatarButtonAnimation = avatarButtonContainer.addChild(new createjs.Sprite(SpriteClass.seatBorderSpriteSheet, "run"));
			avatarButtonAnimation.name = "avatarButtonAnimation";
			avatarButtonAnimation.paused = true;
			avatarButtonAnimation.y = 1;
			var seatIcon = SpriteClass.createSprite(avatarButtonContainer, SpriteClass.panelSpriteSheet, "arrow", "seatIcon", 1);
			seatIcon.y = -15;
			var seatLabel = CGenClass.createText(avatarButtonContainer, "seatLabel", "center", "middle", "#FFF", "500 10px Roboto CondensedBold", TranslationClass.getTranslation("sitHere"));
			seatLabel.y = 18;

			createjs.Tween.get(seatIcon, {loop:true})
				.call(function(){
					avatarButtonAnimation.paused = false;
				})
				.to({y: 0}, 350)
				.call(function(){
					createjs.Tween.get(seatLabel)
						.to({scale: 1.1}, 100)
						.to({scale: 1}, 100)
				})
				.to({y: -15}, 350)
				.call(function(){
					avatarButtonAnimation.paused = true;
				});


			var topGradient = avatarButtonContainer.addChild(new createjs.Shape());
				topGradient.graphics
					.setStrokeStyle(0).beginStroke("rgba(0, 0, 0, 0)")
					.beginLinearGradientFill(["rgba(255,255,255,.8)","rgba(0,0,0,0)", "rgba(0,0,0,0)"], [0, 1, .3], 0, -22,  0, 50).drawCircle(0, 0, 25);
			topGradient.name = "topGradient";
			topGradient.y = -10;
			var avatarHitArea = CGenClass.createCircle(avatarButtonContainer, "avatarButtonBorder", "rgba(0, 0, 0, 1)", 2, "rgba(255,255,255,1)", 40, false);
			avatarButtonContainer.hitArea = avatarHitArea;
			CGenClass.addMouseOverandOut(avatarButtonContainer, 1.1, 1);
			avatarButtonContainer.on("click", function(){
				if(!EmojiClass.tauntDisable){
					CGenClass.checkSession(function(status){
						if(status){
							if(TimerClass.tickStarted){
								self.selectSeat(index);
							}
						}else{
							CGenClass.displayAlert("invalid session");
						}
					});
				}
			});

			var avatarContainer = CGenClass.createContainer(seatContainer, "avatarContainer", false);
			var avatarOuterButton = CGenClass.createCircle(avatarContainer, "avatarOuterButton", "rgba(0, 0, 0, 0)", 2, "rgba(255,255,255,.8)", 44, false);
			var seatBorder = avatarContainer.addChild(new createjs.Shape());
			seatBorder.graphics
				.setStrokeStyle(0).beginStroke("rgba(0, 0, 0, 0)")
				.beginLinearGradientFill(["#834612","#f1e597", "#f1e597"], [0, .5, 1], 0, -20,  0, 80).drawCircle(0, 0, 40);
			seatBorder.name = "seatBorder"
			seatBorder.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 3, 6);
			var seatBg = CGenClass.createCircle(avatarContainer, "seatBg", "rgba(0, 0, 0, .6)", 0, "rgba(0, 0, 0, 0)", 37, true);
			var playerAvatarImgCont = CGenClass.createContainer(avatarContainer, "playerAvatarImgCont", true);
			var borderGradient = avatarContainer.addChild(new createjs.Shape());
			borderGradient.graphics
				.setStrokeStyle(0).beginStroke("rgba(0, 0, 0, 0)")
				.beginRadialGradientFill(["rgba(0,0,0,.8)","rgba(0,0,0,0)","rgba(0,0,0,0)"], [.5, 0, .4], 0, 0, 0, 0, 0, 76).drawCircle(0, 0, 38);
			borderGradient.name = "borderGradient";

			var displayNameContainer = CGenClass.createContainer(seatContainer, "displayNameContainer", false);
			displayNameContainer.y = 54;
			var displayNameBorder = CGenClass.createRoundRectStrokeGradient(displayNameContainer, "displayNameBorder", "rgba(0, 0, 0, .8)", 1, ["#834612","#f1e597", "#f1e597"], 80, 24, 5, true, 
				[0, .5, 1], 0, 0,  0, 48);
			displayNameBorder.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 3, 6);
			var playerName = CGenClass.createText(displayNameContainer, "playerName", "center", "middle", "#FFF", "700 15px Roboto Condensed", "");

			var disableButton = CGenClass.createCircle(seatContainer, "disableButton", "rgba(0, 0, 0, .5)", 1, "rgba(0, 0, 0, .5)", 40, false);
		})();
	}
	console.log("##CANVAS seatsContainer", self.seatsContainer)


	// CanvasPanelClass.footerBgContainer = CGenClass.createContainer(CGameClass.gameContainer, "footerBgContainer", true);
	// var panelBg = CGenClass.createBitmap(CanvasPanelClass.footerBgContainer, "footer", "panelBg", 1);
	// CanvasPanelClass.footerBgContainer.y = 283;
	// console.log("footerBgContainer", CanvasPanelClass.footerBgContainer)
	next();
};

CanvasSeat.prototype.selectSeat = function(index){
	var self = this;
	var bettingStatusContainer = CGameClass.gameContainer.getChildByName("bettingStatusContainer");
	var bettingCloseStatusContainer = bettingStatusContainer.getChildByName("bettingCloseStatusContainer");
	if(self.isSeatDisable === status) return false;
	if(!bettingCloseStatusContainer.alpha && !EmojiClass.tauntContainer.visible){
		if(index > -1){
			this.selectedSeat = index;
			socket.emit("player sit", {pos: index});
		}else this.selectedSeat = index;
	}
};

CanvasSeat.prototype.playerSit = function(details, index){
	var self = this;
	var seatContainer = this.seatsContainer.getChildByName("seatContainer-"+details.pos);
	var avatarButtonContainer = seatContainer.getChildByName("avatarButtonContainer");
	var avatarContainer = seatContainer.getChildByName("avatarContainer");
	var displayNameContainer = seatContainer.getChildByName("displayNameContainer");
	var playerAvatarImgCont = avatarContainer.getChildByName("playerAvatarImgCont");
	var seatBg = avatarContainer.getChildByName("seatBg");
	var playerName = displayNameContainer.getChildByName("playerName");
	var playerAvatar = playerAvatarImgCont.getChildByName("playerAvatarSprite");
	var avatarOuterButton = avatarContainer.getChildByName("avatarOuterButton");
	var topGradient = avatarButtonContainer.getChildByName("topGradient");
	if(!playerAvatar){
		avatarButtonContainer.visible = false;
		topGradient.visible = false;
		console.log("topGradient 3", topGradient.visible)
		displayNameContainer.visible = true;
		avatarContainer.visible = true;
		var playerAvatarSprite = SpriteClass.createSprite(playerAvatarImgCont, SpriteClass.avatarSpriteSheet, "avatar"+details.avatar, "playerAvatarSprite", .178);
		playerAvatarSprite.mask = seatBg;
		playerName.text = (details.displayname === userData.displayname) ? "YOU" : this.formatName(details.displayname);
		avatarOuterButton.visible = (details.displayname === userData.displayname) ? true : false;
		if(details.displayname === userData.displayname){
			console.log("playerAvatarImgCont ====", playerAvatarImgCont)
			self.selectedSeat = details.pos;
			EmojiClass.openTauntList(false, 11);
			EmojiClass.tauntContainer.visible = false;
			EmojiClass.addTaunt(details.pos, LoadingClass.isBettingOpen);
			CGenClass.addMouseOverandOut(playerAvatarImgCont, 1, 1);
			playerAvatarImgCont.on("click", function(){
				StandingClass.displayStandingPlayerList(false);
				CGameClass.displayMinMaxContainer(false);
				if(!EmojiClass.tauntDisable){
					console.log("openTauntList", 1)
					EmojiClass.openTauntList(true);
				}
			});
		}
	}else {
		if(playerAvatar.currentAnimation !== "avatar"+details.avatar){
			console.log("playerAvatarSprite", playerAvatarSprite)
			playerAvatarImgCont.removeAllChildren();
			var playerAvatarSprite = SpriteClass.createSprite(playerAvatarImgCont, SpriteClass.avatarSpriteSheet, "avatar"+details.avatar, "playerAvatarSprite", .178);
			playerAvatarSprite.mask = seatBg;
		}
		if(details.displayname === userData.displayname){
			self.selectedSeat = details.pos;
			EmojiClass.openTauntList(false, 12);
			EmojiClass.tauntContainer.visible = false;
			EmojiClass.addTaunt(details.pos, LoadingClass.isBettingOpen);
			playerAvatarImgCont.on("click", function(){
				StandingClass.displayStandingPlayerList(false);
				CGameClass.displayMinMaxContainer(false);
				if(!EmojiClass.tauntDisable){
					console.log("openTauntList", 2)
					EmojiClass.openTauntList(true);
				}
			});
		}
	}
};

CanvasSeat.prototype.supplySeats = function(players){
	for(var i=0; i<players.length; i++){
		if(players[i].pos > -1){
			this.playerSit(players[i], i);
		}
	}
	this.checkSeatedPlayer(players);
};

CanvasSeat.prototype.supplySeatsAfterTimer = function(players){
	var self = this;
	self.disableSeat(false);
	for(var i=0; i<players.length; i++){
		if(players[i].pos > -1){
			this.playerSit(players[i], i);
		}
	}
	this.checkSeatedPlayer(players);
	self.disableSeat(true);
};

CanvasSeat.prototype.checkSeatedPlayer = function(players){
	var self = this;
	for(var i=0; i<self.seatsContainer.children.length; i++){
		(function(){
			var index = i;
			var seatContainer = self.seatsContainer.getChildByName("seatContainer-"+index);
			var avatarContainer = seatContainer.getChildByName("avatarContainer");
			var avatarButtonContainer = seatContainer.getChildByName("avatarButtonContainer");
			var displayNameContainer = seatContainer.getChildByName("displayNameContainer");
			var playerAvatarImgCont = avatarContainer.getChildByName("playerAvatarImgCont");
			var playerName = displayNameContainer.getChildByName("playerName");
			var avatarOuterButton = avatarContainer.getChildByName("avatarOuterButton");
			var playerAvatar = playerAvatarImgCont.getChildByName("playerAvatarSprite");
			var topGradient = avatarButtonContainer.getChildByName("topGradient");
			if(playerAvatar){
				var pos = players.findIndex(x => x.pos === index);
				if(pos < 0){
					console.log("check seated players", pos, index, seatContainer.name)
					playerAvatarImgCont.removeAllChildren();
					playerName.text = "";
					topGradient.visible = true;
					console.log("topGradient 1", topGradient.visible)
					avatarButtonContainer.visible = true;
					displayNameContainer.visible = false;
					avatarContainer.visible = false;
					avatarOuterButton.visible = false;
					if(self.selectedSeat === index){
						EmojiClass.tauntMainContainer.visible = false;
					}
				}
			}
		})();
	}
};

CanvasSeat.prototype.removeFromSeat = function(){
	var self = this;
	var seatContainer = self.seatsContainer.getChildByName("seatContainer-"+self.selectedSeat);
	if(seatContainer){
		var avatarContainer = seatContainer.getChildByName("avatarContainer");
		var avatarButtonContainer = seatContainer.getChildByName("avatarButtonContainer");
		var displayNameContainer = seatContainer.getChildByName("displayNameContainer");
		var playerAvatarImgCont = avatarContainer.getChildByName("playerAvatarImgCont");
		var playerName = displayNameContainer.getChildByName("playerName");
		var avatarOuterButton = avatarContainer.getChildByName("avatarOuterButton");
		var topGradient = avatarButtonContainer.getChildByName("topGradient");
		var disableButton = seatContainer.getChildByName("disableButton");
		playerName.text = "";
		playerAvatarImgCont.removeAllChildren();
		EmojiClass.tauntMainContainer.visible = false;
		topGradient.visible = true;
		console.log("topGradient 2", topGradient.visible)
		avatarButtonContainer.visible = true;
		displayNameContainer.visible = false;
		avatarContainer.visible = false;
		avatarOuterButton.visible = false;
		self.selectedSeat = null;
	}
};

CanvasSeat.prototype.formatName = function(name){
	var displayname = name;
	var finalName;
	if(displayname.length > 8){
		var maxlength = displayname.length;
		finalName = displayname.substring(0, 4)+"..."+displayname.substring(displayname.length-4, displayname.length);
	}else finalName = displayname;

	return finalName;
};

CanvasSeat.prototype.disableSeat = function(status){
	var self = this;
	if(self.isSeatDisable === status) return false;
	self.isSeatDisable = status;
	for(var i=0; i<self.seatPos.length; i++){
		(function () {
			var index = i;
			var seatContainer = self.seatsContainer.getChildByName("seatContainer-"+index);
			var avatarContainer = seatContainer.getChildByName("avatarContainer");
			var playerAvatarImgCont = avatarContainer.getChildByName("playerAvatarImgCont");
			var playerAvatar = playerAvatarImgCont.getChildByName("playerAvatarSprite");
			var disableButton = seatContainer.getChildByName("disableButton");
			var avatarButtonContainer = seatContainer.getChildByName("avatarButtonContainer");
			var seatIcon = avatarButtonContainer.getChildByName("seatIcon");
			var seatLabel = avatarButtonContainer.getChildByName("seatLabel");
			if(!playerAvatar){
				disableButton.visible = status;
				if(status){
					seatLabel.scale = 1;
					avatarButtonContainer.scale = 1;
					seatIcon.y = -5;
					seatContainer.cache(-45, -45, 90, 90);
				}else{
					seatContainer.uncache();
				}
			}
		})();
	}
};

CanvasSeat.prototype.clearSeat = function(){
	this.seatPos = [
		{id: 1, player: null, x: -489, y: 0},{id: 2, player: null, x: -396, y: 0},{id: 3, player: null, x: -303, y: 0},
		{id: 4, player: null, x: 303, y: 0},{id: 5, player: null, x: 396, y: 0},{id: 6, player: null, x: 489, y: 0},
	];
	this.seatsContainer = null;
	this.selectedSeat = null;
	this.isSeatDisable = null;
};

var CSeatClass = new CanvasSeat();