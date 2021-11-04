var CanvasChips = function(){
	this.playerChipsContainer = null;
	this.footerContainer = null;
	this.chipXOrig = -144;
	this.chips = [];
	this.defaultChips = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 2000000, 5000000];
	this.allChips = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 2000000, 5000000];
	this.chipBorderContainer = null;
	this.chipPos = [-144, -72, 0, 72, 144];
	// this.defaultChips = [1, 5, 10, 50, 100, 500, 10000, 100000, 500000, 1000000, 2000000, 5000000];
};

CanvasChips.prototype.init = function(){
	var self = this;
	var defaultChip = (CGameClass.tableDetails.defaultChip) ?  CGameClass.tableDetails.defaultChip : 1;
	var defaultCoinIndex = self.defaultChips.findIndex(x => x === defaultChip);
	for(var i=defaultCoinIndex; i<defaultCoinIndex+5; i++){
		self.chips.push(self.defaultChips[i]);
	}
	console.log("COINS", self.chips)
	self.createChips();
};

CanvasChips.prototype.createChips = function(){
	var self = this;
	var chipScale = 0.95;
	var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
	self.footerContainer = panelContainer.getChildByName("footerContainer");

	self.playerChipsContainer = CGenClass.createContainer(self.footerContainer, "playerChipsContainer", true);
	self.playerChipsContainer.x = 454;
	self.playerChipsContainer.y = -20;

	self.chipBorderContainer = CGenClass.createContainer(self.playerChipsContainer, "chipBorderContainer", true);
	self.chipBorderContainer.x = self.chipPos[CGenClass.selectedChip];
	var chipBorder = SpriteClass.createSprite(self.chipBorderContainer, SpriteClass.tableSpriteSheet, "selected_chip", "chipBorder", .5);
	var chipBorder1 = SpriteClass.createSprite(self.chipBorderContainer, SpriteClass.tableSpriteSheet, "selected_chip", "chipBorder1", .5);
	var chipBorder2 = SpriteClass.createSprite(self.chipBorderContainer, SpriteClass.tableSpriteSheet, "selected_chip", "chipBorder2", .5);
	createjs.Tween.get()
		.call(function() {
			createjs.Tween.get(chipBorder, {loop : true})
				.to({ scale : .888 }, 500)
				.to({ scale : 1.12, alpha : 0.2 },600)
				.wait(200)
				.to({ alpha : 0 }, 700)
				.wait(300)
		})
		.wait(800)
		.call(function() {
			createjs.Tween.get(chipBorder1, {loop : true})
				.to({ scale : .888 }, 500)
				.to({ scale : 1.12, alpha : 0.2 },600)
				.wait(200)
				.to({ alpha : 0 }, 700)
				.wait(300)
		})
		.wait(800)
		.call(function() {
			createjs.Tween.get(chipBorder2, {loop : true})
				.to({ scale : .888 }, 500)
				.to({ scale : 1.12, alpha : 0.2 },600)
				.wait(200)
				.to({ alpha : 0 }, 700)
				.wait(300)
		});

		console.log("self.chipBorderContainer", self.chipBorderContainer)

	for(var i=0; i<self.chips.length; i++){
		(function () {
			var index = i;
			var coinIndex = self.defaultChips.findIndex(x => x === self.chips[index]);
			var chipContainer = CGenClass.createContainer(self.playerChipsContainer, 'chipContainer-'+index, true);
			chipContainer.x = self.chipXOrig;
			var chipSprite = SpriteClass.createSprite(chipContainer, SpriteClass.tableSpriteSheet, "coin"+(coinIndex+1), "chipSprite", chipScale);
			chipSprite.x = chipSprite.y = 2;
			var chipDisable = CGenClass.createCircle(chipContainer, "chipBorder", "rgba(51, 51, 51, .8)", 0, "rgba(0, 0, 0, 0)", 33, false);
			self.chipXOrig = self.chipXOrig+72;
			CGenClass.addMouseOverandOut(chipContainer, 1.1, 1);
			chipContainer.cache(-70, -70, 140, 140);
			chipContainer.on("click", function(e){
				CGenClass.checkSession(function(status){
					if(status){
						if(TimerClass.tickStarted){
							self.selectChip(index);
						}
					}else{
						CGenClass.displayAlert("invalid session");
					}
				});
			});

			if(index === self.chips.length-1){
				self.disableChips();
			}
		})();
	}

	console.log("##CANVAS playerChipsContainer", this.playerChipsContainer)
};
CanvasChips.prototype.selectChip = function(index){
	var chipContainer = this.playerChipsContainer.getChildByName("chipContainer-"+CGenClass.selectedChip);
	chipContainer.uncache();
	CGenClass.selectedChip = index;
	this.chipBorderContainer.x = this.chipPos[CGenClass.selectedChip];
	chipContainer = this.playerChipsContainer.getChildByName("chipContainer-"+CGenClass.selectedChip);
	chipContainer.cache(-70, -70, 140, 140);
};

CanvasChips.prototype.disableChips = function(){
	var self = this;
	for(var i=0; i<self.chips.length; i++){
		var chipContainer = self.playerChipsContainer.getChildByName("chipContainer-"+i);
		chipContainer.uncache();
		chipContainer.children[1].visible = true;
		chipContainer.scale = 1;
		chipContainer.cache(-70, -70, 140, 140);
		self.chipBorderContainer.visible = false;
	}
};

CanvasChips.prototype.enableChips = function(){
	var self = this;
	for(var i=0; i<self.chips.length; i++){
		var chipContainer = self.playerChipsContainer.getChildByName("chipContainer-"+i);
		chipContainer.uncache();
		chipContainer.children[1].visible = false;
		chipContainer.cache(-70, -70, 140, 140);
		self.chipBorderContainer.visible = true;
	}
};

CanvasChips.prototype.clearChips = function(){
	this.playerChipsContainer = null;
	this.footerContainer = null;
	this.chipXOrig = -144;
	this.chips = [];
	this.defaultChips = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 2000000, 5000000];
	this.allChips = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 2000000, 5000000];
	this.chipBorderContainer = null;
	this.chipPos = [-144, -72, 0, 72, 144];
};

var CChipsClass = new CanvasChips();
