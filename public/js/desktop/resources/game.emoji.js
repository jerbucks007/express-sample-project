var Emoji = function(){
	this.tauntMainContainer = null;
	this.bubbleMainContainer = null;
	this.bubbleButtonContainer = null;
	this.tauntContainer = null;
	this.tauntDisable = false;
	this.tauntBgContainer = null;
	this.emojiCloseButtonContainer = null;
	this.messages = [
		{
			text : "Dragon Win!",
			type: 2,
			x : -133,
			y : -58,
			w : 124,
		},
		{
			text :"Tie!",
			type: 2,
			x : 0,
			y : -58,
			w : 103,
		},
		{
			text: "Tiger Win!",
			type: 2,
			x : 133,
			y : -58,
			w : 124,
		},
		{
			text: "Bet Dragon!",
			type: 2,
			x : -133,
			y : 0,
			w : 124,
		},
		{
			text: "Black!",
			type: 2,
			x : 0,
			y : 0,
			w : 103,
		},
		{
			text: "Bet Tiger!",
			type: 2,
			x : 133,
			y : 0,
			w : 124,
		},
		{
			text: "Odd Number!",
			type: 2,
			x : -133,
			y : 58,
			w : 124,
		},
		{
			text: "Red!",
			type: 2,
			x : 0,
			y : 58,
			w : 103,
		},
		{
			text: "Even Number!",
			type: 2,
			x : 133,
			y : 58,
			w : 124,
		}
	];
	this.tauntPos = [-489, -396, -302, 302, 396, 489];
	this.bubblePos = [-415, -320, -230, 230, 320, 415];
};

Emoji.prototype.createTauntContainer = function(next){
	var self = this;
	self.tauntMainContainer = CGenClass.createContainer(CGameClass.gameContainer, "tauntMainContainer", false);

	self.bubbleButtonContainer = CGenClass.createContainer(self.tauntMainContainer, "bubbleButtonContainer", true);
	var bubbleSprite = SpriteClass.createSprite(self.bubbleButtonContainer, SpriteClass.panelSpriteSheet, "bubble", "bubbleSprite", .75);
	bubbleSprite.scaleX = -.75;
	bubbleSprite.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 6);
	self.bubbleButtonContainer.y = 210;
	self.bubbleButtonContainer.x = -270;
	var bubbleHitArea = CGenClass.createCircle(self.bubbleButtonContainer, "bubbleHitArea", "rgba(255, 255, 255, 1)", 2, "rgba(255,255,255,1)", 15, false);
	self.bubbleButtonContainer.hitArea = bubbleHitArea;
	CGenClass.addMouseOverandOut(self.bubbleButtonContainer, 1.1, 1);
	self.bubbleButtonContainer.on("click", function(){
		StandingClass.displayStandingPlayerList(false);
		CGameClass.displayMinMaxContainer(false);
		if(!self.tauntDisable){
			self.openTauntList(true);
			console.log("openTauntList", 3)
		}
	});

	self.tauntContainer = CGenClass.createContainer(self.tauntMainContainer, "tauntContainer", false);
	self.tauntContainer.alpha = 0;
	self.tauntContainer.y = 183;

	var tauntHitAreaContainer = CGenClass.createContainer(self.tauntContainer, "tauntHitAreaContainer", true);
	tauntHitAreaContainer.x = -210;
	tauntHitAreaContainer.y = -120;
	var tauntHitArea = CGenClass.createRoundRect(tauntHitAreaContainer, "tauntHitArea", "rgba(0,0,0,1)", 0, "#FFF", 420, 240, 7, false);
	tauntHitAreaContainer.hitArea = tauntHitArea;
	tauntHitAreaContainer.on("click", function(){});

	var tauntListContainer = CGenClass.createContainer(self.tauntContainer, "tauntListContainer", true);
	tauntListContainer.x = 210;
	tauntListContainer.y = -120;
	var tauntListBg = CGenClass.createRoundRect(tauntListContainer, "tauntListBg", "rgba(0,0,0,.9)", 0, "#FFF", 420, 240, 7, true);
	// var hitArea =CGenClass.createRoundRect(tauntListContainer, "hitArea", "rgba(255, 255, 255, 1)", 1, "#B1B1B1", 410, 239, 6, false);
	// tauntListContainer.hitArea = hitArea;

	// var tauntLabel = CGenClass.createText(tauntListContainer, "tauntLabel", "left", "middle", "#FCA204", "900 14px LatoBlack", "TAUNTS");
	// tauntLabel.x = -175;
	// tauntLabel.y = -82;

	var messageListContainer = CGenClass.createContainer(tauntListContainer, "messageListContainer", true);
	// messageListContainer.y = 30;
	for(var j=0; j<self.messages.length; j++){
		(function(){
			var index = j;
			var message = self.messages[index];
			var messageContainer = CGenClass.createContainer(messageListContainer, "messageContainer-"+index, true);
			messageContainer.x = message.x;
			messageContainer.y = message.y;
			var messageBg = CGenClass.createRoundRect(messageContainer, "messageBg", "rgba(0,0,0,0)", 1, "#FFF", message.w, 38, 13, true);
			var messageText = CGenClass.createText(messageContainer, "messageText", "center", "middle", "#FFF", "900 16px Roboto CondensedBold", message.text);
			var hitArea = CGenClass.createRoundRect(messageContainer, "hitArea", "rgba(255, 255, 255, 1)", 1, "#B1B1B1", message.w, 38, 13, false);
			messageContainer.hitArea = hitArea;

			CGenClass.addMouseOverandOut(messageContainer, 1.15, 1);
			messageContainer.on("click", function(){
				socket.emit("player taunt", {index : index, type : message.type, pos : CSeatClass.selectedSeat, displayname: userData.displayname});
				self.disableTaunt();
			});
		})();
	}

	self.emojiCloseButtonContainer = CGenClass.createContainer(self.tauntMainContainer, "emojiCloseButtonContainer", false);
	self.emojiCloseButtonContainer.y = 183;
	var closeButtonBg = CGenClass.createCircle(self.emojiCloseButtonContainer, "closeButtonBg", "rgba(255,255,255,1)", 1, "rgba(255,255,255,1)", 40, true);
	var closeSprite = SpriteClass.createSprite(self.emojiCloseButtonContainer, SpriteClass.panelSpriteSheet, "close", "closeSprite", 1.2);
	var matrix = new createjs.ColorMatrix().adjustBrightness(-200);
	closeSprite.filters = [new createjs.ColorMatrixFilter(matrix)];
	closeSprite.cache(-18, -18, 36, 36);

	CGenClass.addMouseOverandOut(self.emojiCloseButtonContainer, 1.1, 1);
	self.emojiCloseButtonContainer.on("click", function(){
		self.openTauntList(false)
	});

	next();
};

Emoji.prototype.createBubbleContainer = function(next){
	var self = this;
	self.bubbleMainContainer = CGenClass.createContainer(CGameClass.gameContainer, "bubbleMainContainer", true);
	self.bubbleMainContainer.y = 120;
	for(var i=0; i<CSeatClass.seatPos.length; i++){
		(function () {
			var index = i;
			var bubbleContainer = CGenClass.createContainer(self.bubbleMainContainer, "bubbleContainer-"+index, false);
			var pos = (index > 2) ? self.bubblePos[index]+20 : self.bubblePos[index]-20;
			bubbleContainer.x = pos;
			bubbleContainer.y = 25;
			bubbleContainer.alpha = 0;
			// var bubble = CGenClass.createBitmap(bubbleContainer, "bubble", "bubble", 1);
			var bubble = SpriteClass.createSprite(bubbleContainer, SpriteClass.tableSpriteSheet, "bubble", "bubble", 1);
			bubble.scaleX = (index > 2) ? -1 : 1;
			var tauntDisplayContainer = CGenClass.createContainer(bubbleContainer, "tauntDisplayContainer", true);
			console.log("bubbleContainer", bubbleContainer);
		})();
	}
	next();
};

Emoji.prototype.addTaunt = function(playerPos, isBettingOpen){
	var self = this;
	console.log("ADD TAUNT", self.tauntDisable, self.tauntContainer.visible)
	if(playerPos > -1){
		if(self.tauntDisable) return false;
		if(!isBettingOpen) return false;
		var tauntListContainer = self.tauntContainer.getChildByName("tauntListContainer");
		// var bubble = self.bubbleContainer.getChildByName("bubble");
		

		if(!self.tauntContainer.visible){
			tauntListContainer.x = (playerPos > 2) ? -205 : 205;
			self.tauntMainContainer.visible = true;
			var pos = (playerPos > 2) ? self.tauntPos[playerPos]+61 : self.tauntPos[playerPos]-61;
			self.tauntContainer.x = pos;
			self.tauntContainer.y = 250;
			self.emojiCloseButtonContainer.x = self.tauntPos[playerPos]
			self.bubbleButtonContainer.x = (self.tauntPos[playerPos] < 0) ? self.tauntPos[playerPos]+32 : self.tauntPos[playerPos]+32;
		}
	}
};

Emoji.prototype.disableTaunt = function(){
	var self = this;
	self.tauntContainer.visible = false;
	self.tauntDisable = true;
	self.emojiCloseButtonContainer.visible = false;
	self.tauntBgContainer.visible = false;
	var pos = (CSeatClass.selectedSeat > 2) ? self.tauntPos[CSeatClass.selectedSeat]+61 : self.tauntPos[CSeatClass.selectedSeat]-61;
	createjs.Tween.get(self.tauntContainer)
		.to({x: pos, y: 250, alpha: 0}, 150)

	var matrix = new createjs.ColorMatrix().adjustSaturation(-100);
	self.bubbleButtonContainer.filters = [new createjs.ColorMatrixFilter(matrix)];
	self.bubbleButtonContainer.cache(-15, -15, 30, 30);
	self.bubbleButtonContainer.visible = true;
};

Emoji.prototype.displayTaunt = function(data){
	var self = this;
	var bubbleContainer = self.bubbleMainContainer.getChildByName("bubbleContainer-"+data.pos);
	var tauntDisplayContainer = bubbleContainer.getChildByName("tauntDisplayContainer");

	var messageText = CGenClass.createText(tauntDisplayContainer, "messageText", "center", "middle", "#FFF", "900 18px Roboto CondensedBold", self.messages[data.index].text);
	messageText.y = 5;
	bubbleContainer.visible = true;
	createjs.Tween.get(bubbleContainer)
		.to({x : self.bubblePos[data.pos], y: 0, alpha: 1}, 150)
	self.setDisplayTimeout(data);
};

Emoji.prototype.setDisplayTimeout = function(data){
	var self = this;
	var bubbleContainer = self.bubbleMainContainer.getChildByName("bubbleContainer-"+data.pos);
	var tauntDisplayContainer = bubbleContainer.getChildByName("tauntDisplayContainer");
	setTimeout(function(){
		var pos = (data.pos > 2) ? self.bubblePos[data.pos]+20 : self.bubblePos[data.pos]-20;
		createjs.Tween.get(bubbleContainer)
			.to({alpha: 0, x: pos, y:25}, 150)
			.call(function(){
				self.tauntDisable = false;
				self.bubbleButtonContainer.uncache();
				bubbleContainer.visible = false;
				tauntDisplayContainer.removeAllChildren();
			});
	}, 2500);
};

Emoji.prototype.openTauntList = function(visible, num){
	var self = this;
	if(visible){
		if(!self.bubbleButtonContainer.visible) return false;
		self.bubbleButtonContainer.visible = false;
		self.tauntBgContainer.visible = true;
		self.tauntContainer.visible = true;

		createjs.Tween.get(self.tauntContainer)
			.to({x: self.tauntPos[CSeatClass.selectedSeat], y: 183, alpha: 1}, 150)
			.call(function(){
				self.emojiCloseButtonContainer.visible = true;
			});
	}else{
		if(self.bubbleButtonContainer.visible) return false;
		var pos = (CSeatClass.selectedSeat > 2) ? self.tauntPos[CSeatClass.selectedSeat]+61 : self.tauntPos[CSeatClass.selectedSeat]-61;
		createjs.Tween.get(self.tauntContainer, {override : true})
			.to({x: pos, y: 250, alpha: 0}, 150)
			.call(function(){
				self.bubbleButtonContainer.visible = true;
				self.tauntBgContainer.visible = false;
				self.tauntContainer.visible = false;
				self.emojiCloseButtonContainer.visible = false;
			});
	}

	console.log("openTauntList", visible, num)
};

Emoji.prototype.clearEmoji = function(){
	this.tauntMainContainer = null;
	this.bubbleMainContainer = null;
	this.bubbleButtonContainer = null;
	this.tauntContainer = null;
	this.tauntDisable = false;
	this.tauntBgContainer = null;
	this.emojiCloseButtonContainer = null;
};

var EmojiClass = new Emoji();