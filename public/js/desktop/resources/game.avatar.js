var Avatar = function(){
	this.list = [
		{ pos : 1, x : -580, y : -160, },
		{ pos : 2, x : -580, y : -30, },
		{ pos : 3, x : -580, y : 100, },
		{ pos : 4, x : -580, y : 230, },
		{ pos : 5, x : 580, y : -160, },
		{ pos : 6, x : 580, y : -30, },
		{ pos : 7, x : 580, y : 100, },
		{ pos : 8, x : 580, y : 230, },
	];
	this.avatarList = [
		{ index : 1, id : "avatar1", image : 1 },
		{ index : 2, id : "avatar2", image : 2 },
		{ index : 3, id : "avatar3", image : 3 },
		{ index : 4, id : "avatar4", image : 4 },
		{ index : 5, id : "avatar5", image : 5 },
		{ index : 6, id : "avatar6", image : 6 },
		{ index : 7, id : "avatar7", image : 7 },
		{ index : 8, id : "avatar8", image : 8 },
		{ index : 9, id : "avatar9", image : 9 },
		{ index : 10, id : "avatar10", image : 10 },
	];
	this.carousel = [
		{ x : 0, y : -40, scale : 1.27, saturation : 0, stroke : "rgba(255, 197, 0, 1)" },
		{ x : 235, y : -20, scale : 0.64, saturation : -30, stroke : "rgba(150, 150, 150, 1)" },
		{ x : 160, y : -80, scale : 0.495, saturation : -60, stroke : "rgba(150, 150, 150, 1)" },
		{ x : -160, y : -80, scale : 0.495, saturation : -60, stroke : "rgba(150, 150, 150, 1)" },
		{ x : -235, y : -20, scale : 0.64, saturation : -30, stroke : "rgba(150, 150, 150, 1)" },
	];
	this.avatarContainerList = null;
	this.indicatorContainerList = null;
	this.avatarContentContainer = null;
	this.arrowContainerList = null;

	this.isOpen = false;
	this.switchActive = false;
	this.switchEnabled = true;
	this.selectedAvatar = Number(userData.avatar);
	this.active = Number(userData.avatar);
	this.temp = [];

	this.currentAvatarText = null;
};

Avatar.prototype.createAvatarSelection = function(avatarContentContainer){
	var self = this;
	self.avatarContentContainer = avatarContentContainer;
	self.createList();
	self.createArrows();
	self.createIndicator();

	var playerDetailsContainer = CGenClass.createContainer(self.avatarContentContainer, "playerDetailsContainer", true);
	var displaynameText = CGenClass.createText(playerDetailsContainer, "displaynameText", "left", "middle", "#FFF", "900 18px Roboto Condensed", "DISPLAYNAME: "+userData.displayname.toUpperCase());
	self.currentAvatarText = CGenClass.createText(playerDetailsContainer, "currentAvatarText", "left", "middle", "#FFF", "900 18px Roboto Condensed", TranslationClass.getTranslation("currentAvatar"));
	playerDetailsContainer.x = -450;
	playerDetailsContainer.y = -157;
	self.currentAvatarText.y = 25;
	console.log("playerDetailsContainer", playerDetailsContainer)

	var confirmButtonContainer = CGenClass.createContainer(self.avatarContentContainer, "confirmButtonContainer", true);
	var confirmButtonBg = CGenClass.createRoundRect(confirmButtonContainer, "confirmButtonBg", "#FFF", 1, "#FFF", 74, 42, 4, true);
	var confirmLabel = CGenClass.createText(confirmButtonContainer, "confirmLabel", "center", "middle", "#2e2e2e ", "900 20px Roboto Condensed", TranslationClass.getTranslation("Confirm"));
	confirmButtonContainer.y = 204;
	CGenClass.addMouseOverandOut(confirmButtonContainer, 1.2, 1);

	confirmButtonContainer.on("click", function(){
		self.selectedAvatar = self.active;
		self.reloadImages();
		socket.emit("change avatar", self.active);
		CanvasPanelClass.hideMenu();
	});
};

Avatar.prototype.createList = function() {
	var self = this;

	self.avatarContainerList = self.avatarContentContainer.addChild(new createjs.Container());
	self.avatarContainerList.name = "avatarContainerList";
	self.avatarContainerList.y = 42;

	if(CGenClass.isMobile){
		var touchStart = null, touchEnd = null;
		self.avatarContainerList.on("pressmove", function(e){
			touchStart = (touchStart === null) ? e.rawX : touchStart;
		});
		
		self.avatarContainerList.on("pressup", function(e){
			if(e.rawX >= touchStart){
				// <<<<
				self.switchAvatar(null, {type : 0, avatar : self});
				console.log("pressmove <<<<", touchStart, e.rawX, 0)
				touchStart = null;
			}else{
				self.switchAvatar(null, {type : 1, avatar : self});
				console.log("pressmove >>>>", touchStart, e.rawX, 1)
				touchStart = null;
				// >>>>
			}
			console.log("pressup >>>>", touchStart)
		});
	}	

	for(var i = 0, pointer = 0; i < self.avatarList.length; i++) {
		var item = self.avatarList[i];
		
		var childIndex = self.avatarContainerList.numChildren;
		var avatarContainer = self.avatarContainerList.addChildAt(new createjs.Container(), (childIndex == 2 || childIndex == self.avatarList.length-2 ? 1:childIndex));
		avatarContainer.name = "avatarContainer-"+(i+1);
		
		if((i >= 0 && i <= 2) || (i >= (self.avatarList.length-2) && i <= self.avatarList.length)) {
			avatarContainer.x = self.carousel[pointer].x;
			avatarContainer.y = self.carousel[pointer].y;
			avatarContainer.scale = self.carousel[pointer].scale;
			
			pointer++;
		} else {
			avatarContainer.visible = false;
		}
		
		var avatarBorder = avatarContainer.addChild(new createjs.Shape());
		avatarBorder.name = "avatarBorder";
		avatarBorder.graphics
			.beginStroke("rgba(255, 197, 0, 1)").setStrokeStyle(5)
			.beginFill("rgba(255, 0, 255, 1)").drawCircle(0, 0, 130)
		avatarBorder.shadow = new createjs.Shadow("#000",0,0,15)
		
		var avatarImage = avatarContainer.addChild(new createjs.Sprite(SpriteClass.avatarSpriteSheet));
		avatarImage.gotoAndStop("avatar"+item.image)
		avatarImage.name = "avatarImage";
		avatarImage.mask = avatarBorder;
		
	}
	
	var activeAvatar = self.avatarContainerList.getChildAt(0);
	self.avatarContainerList.setChildIndex(activeAvatar, self.avatarList.length-1)
	console.log("avatarContainerList", self.avatarContainerList)
};

Avatar.prototype.createIndicator = function() {
	var self = this;
	self.indicatorContainerList = self.avatarContentContainer.addChild(new createjs.Container());
	self.indicatorContainerList.name = "indicatorContainerList";
	self.indicatorContainerList.x = -((55 * self.avatarList.length)/2) + 15;
	self.indicatorContainerList.y = -190;
	
	for(var i = 0; i < self.avatarList.length; i++) {
		var item = self.avatarList[i];
		
		var indicatorContainer = self.indicatorContainerList.addChild(new createjs.Container());
		indicatorContainer.name = "indicatorContainer-"+(i+1);
		indicatorContainer.x = 55 * i;
		
		var indicatorOff = indicatorContainer.addChild(new createjs.Sprite(SpriteClass.bulbSpriteSheet));
		indicatorOff.name = "indicatorOff";
		indicatorOff.gotoAndStop("selected_off");
		
		var indicatorActive = indicatorContainer.addChild(new createjs.Sprite(SpriteClass.bulbSpriteSheet));
		indicatorActive.name = "indicatorActive";
		indicatorActive.gotoAndStop("selected_on");
		indicatorActive.visible = false;
	}
	console.log("indicatorContainerList", self.indicatorContainerList)
};

Avatar.prototype.createArrows = function() {
	var self = this;
	self.arrowContainerList = self.avatarContentContainer.addChild(new createjs.Container());
	self.arrowContainerList.name = "arrowContainerList";
	
	for(var i = 0; i < 2; i++) {
		var buttonContainer = self.arrowContainerList.addChild(new createjs.Container());
		buttonContainer.name = "buttonContainer";
		buttonContainer.x = (i == 0) ? -476:476;
		buttonContainer.cursor = "pointer";
		if (CGenClass.isMobile) {
			var hitArea = new createjs.Shape();
			hitArea.graphics
				.f('white')
				.dr(0, 0, 60, 120);
			hitArea.regX = hitArea.graphics.command.w / 2;
			hitArea.regY = hitArea.graphics.command.h / 2;
			buttonContainer.hitArea = hitArea;
		}
		buttonContainer.on("click", self.switchAvatar, null, false, { type : i, avatar : self});
		buttonContainer.on("mouseover", mouseOver);
		buttonContainer.on("mouseout", mouseOut);

		var arrowImage = CGenClass.createBitmap(buttonContainer, "arrow", "arrowImage", .85);
		arrowImage.rotation = (i == 0) ? 90 : -90;
		
		var buttonHitArea = CGenClass.createRect(buttonContainer, "buttonHitArea", "#FFF", 0, "#000", 30, 40, false);
		buttonContainer.hitArea = buttonHitArea;

		console.log("buttonContainer", buttonContainer)
	}
	
	function mouseOver(evt) {
		evt.target.scale = 1.2;
	}
	
	function mouseOut(evt) {
		evt.target.scale = 1;
	}
};

Avatar.prototype.switchAvatar = function(evt, data) {
	var self = data.avatar;
	if(self.switchActive) return;
	self.switchActive = true;
	
	if(data.type == 0) { // Left
		self.active = (self.active == 1) ? self.avatarList.length:self.active-1;
		self.animateAvatar(self.active, data.type);
	} else { // Right
		self.active = (self.active == self.avatarList.length) ? 1:self.active+1;
		self.animateAvatar(self.active, data.type);
	}

	self.currentAvatarText.visible = (self.active === self.selectedAvatar) ? true : false; 
	
	if(evt){
		var target = evt.target;
		if(!createjs.Tween.hasActiveTweens(target)) {
			if(CGenClass.isMobile) {
				createjs.Tween.get(target)
					.to({ scale : 0.5 }, 50)
					.wait(100).to({ scale : 1 }, 50)
					.call(function() { self.switchActive = false; })
			} else {
				createjs.Tween.get(target)
					.to({ scale : 1 }, 50)
					.wait(100).to({ scale : 1.2 }, 50)
					.call(function() { self.switchActive = false; })
			}
		}
	}else {
		setTimeout(function(){
			self.switchActive = false;
		}, 220);
	}
};

Avatar.prototype.animateAvatar = function(active, dir) {
	var self = this;
	if(!self.switchEnabled) return;
	self.switchEnabled = false;
	for(var i = 0, pointer = 0, counter = 0; i < self.avatarList.length; i++) { // pointer: carousel index pointer, counter: animation counter
		(function() {
			var avatarContainer = self.avatarContainerList.getChildByName("avatarContainer-"+(i+1));
			if((i >= 0 && i <= 2) || (i >= (self.avatarList.length-2) && i <= self.avatarList.length)) {
				if(dir == 0) {
					switch(i) {
					case 0: pointer = 1; break;
					case 1: pointer = 2; break;
					case 2: pointer = 3; break;
					case (self.avatarList.length-2): pointer = self.carousel.length-1; break;
					case (self.avatarList.length-1): pointer = 0; break;
						break;
					}
				} else if(dir == 1) {
					switch(i) {
					case 0: pointer = self.carousel.length-1; break;
					case 1: pointer = 0; break;
					case 2: pointer = 1; break;
					case (self.avatarList.length-2): pointer = 2; break;
					case (self.avatarList.length-1): pointer = 3; break;
					}
				}

				createjs.Tween.get(avatarContainer, { override : true})
					.to({ x : self.carousel[pointer].x, y : self.carousel[pointer].y, scale : self.carousel[pointer].scale }, 250)
					.call(function() {
						counter++;
						if(counter == self.carousel.length) {
							self.rotateImages(active);
							self.reloadIndicator();
							self.reloadImages();
							self.reloadDisplay();
							
							self.switchEnabled = true;
						}
					})
			}
		}());
	}
};

Avatar.prototype.rotateImages = function(pos) {
	var self = this;
	self.temp = [];
	self.temp = self.temp.concat(self.avatarList);
	
	for(var i = 1; i < pos; i++) {
		self.temp.push(self.temp.shift());
	}
};

Avatar.prototype.reloadImages = function() {
	// Load all images
	var self = this;
	for(var i = 0, pointer = 0; i < self.temp.length; i++) {
		var item = self.temp[i];

		var avatarContainer = self.avatarContainerList.getChildByName("avatarContainer-"+(i+1));
		var avatarBorder = avatarContainer.getChildByName("avatarBorder");
		var avatarImage = avatarContainer.getChildByName("avatarImage");
		avatarImage.gotoAndStop(item.id)
		avatarImage.scaleX = 300 / avatarImage.spriteSheet._frameWidth; 
		avatarImage.scaleY = 300 / avatarImage.spriteSheet._frameHeight; 
		
		if((i >= 0 && i <= 2) || (i >= (self.temp.length-2) && i <= self.temp.length)) {
			avatarBorder.graphics._stroke.style = (self.selectedAvatar == item.image) ? "rgba(255, 197, 0, 1)":"rgba(150, 150, 150, 1)";
		
			var matrix = new createjs.ColorMatrix().adjustSaturation(self.carousel[pointer].saturation);
			avatarImage.filters = [new createjs.ColorMatrixFilter(matrix)];
			avatarImage.cache(-200, -200, 400, 400);
			pointer++;
		} else {
			avatarImage.uncache()
		}
	}
	self.currentAvatarText.visible = (self.active === self.selectedAvatar) ? true : false; 
};

Avatar.prototype.reloadDisplay = function() {
	var self = this;
	for(var i = 0, pointer = 0; i < self.avatarList.length; i++) {
		var avatarContainer = self.avatarContainerList.getChildByName("avatarContainer-"+(i+1));
		if((i >= 0 && i <= 2) || (i >= (self.avatarList.length-2) && i <= self.avatarList.length)) {
			avatarContainer.x = self.carousel[pointer].x;
			avatarContainer.y = self.carousel[pointer].y;
			avatarContainer.scale = self.carousel[pointer].scale;
			
			pointer++;
		}
	}
};

Avatar.prototype.reloadIndicator = function() {
	var self = this;
	for(var i = 0; i < self.avatarList.length; i++) {
		var pointer = i+1;
		var indicatorContainer = self.indicatorContainerList.getChildByName("indicatorContainer-"+pointer);
		var indicatorActive = indicatorContainer.getChildByName("indicatorActive");
		
		indicatorActive.visible = (pointer == self.active) ? true:false;
	}
};

Avatar.prototype.reload = function() {
	var self = this;
	self.active = self.avatarList.findIndex(x => x.image === self.selectedAvatar);
	self.active = self.active+1;

	self.rotateImages(self.active);
	self.reloadIndicator();
	self.reloadImages();
	self.reloadDisplay();
};

Avatar.prototype.clearAvatar = function(){
	this.avatarContainerList = null;
	this.indicatorContainerList = null;
	this.avatarContentContainer = null;
	this.arrowContainerList = null;

	this.isOpen = false;
	this.switchActive = false;
	this.switchEnabled = true;
	this.selectedAvatar = Number(userData.avatar);
	this.active = Number(userData.avatar);
	this.temp = [];

	this.currentAvatarText = null;
};

var AvatarClass = new Avatar();