var RoadMap = function(){
	this.bead = [];
	this.big = [];
	this.bigeye = [];
	this.cockroach = [];
	this.small = [];
	this.roadmapContainer = null;
	this.roadmapsContainer = null;
	this.cellColors = [
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000", "#1a1a1a", "#1a1a1a", "#000", "#000",
		"#1a1a1a", "#1a1a1a", "#000", "#000",
	];
	this.beadStatus = {col : 0, cell : 0, max : 22};
	this.bigStatus = {col : 0, cell : 0, max : 22};
	this.bigeyeStatus = {col : 0, cell : 0, max : 22};
	this.cockroachStatus = {col : 0, cell : 0, max : 22};
	this.smallStatus = {col : 0, cell : 0, max : 22};
	// this.selectedRoadmap = (localStorage.getItem("activeRoadmap")) ? Number(localStorage.getItem("activeRoadmap")) : 1;
	this.selectedRoadmap = 1;
	this.roadmaps = [
			{label : "BEAD ROAD", name : "bead", x : 0, sufHidden : 22, preHidden : 0, id : "beadRoad"},
			{label : "BIG ROAD", name : "big", x : 0, sufHidden : 22, preHidden : 0, id : "bigRoad"},
			{label : "BIG EYE ROAD", name : "bigeye", x : 0, sufHidden : 22, preHidden : 0, id : "bigEyeRoad"},
			{label : "SMALL ROAD", name : "small", x : 0, sufHidden : 22, preHidden : 0, id : "smallRoad"},
			{label : "COCKROACH ROAD", name : "cockroach", x : 0, sufHidden : 22, preHidden : 0, id : "cockroachRoad"},
		];
	this.roadMapTypeText = null;
	this.sufHidden = 22;
	this.preHidden = 0;

	this.dragonCount = null;
	this.tigerCount = null;
	this.tieCount = null;

	this.roadmapScrollContainer = null;
	this.isChanged = false;
};

RoadMap.prototype.createRoadmapContainer = function(next){
	var self = this;
	// console.log("selectedRoadmap", localStorage.getItem("activeRoadmap"))
	CanvasPanelClass.footerBgContainer = CGenClass.createContainer(CGameClass.gameContainer, "footerBgContainer", true);
	var panelBg = CGenClass.createBitmap(CanvasPanelClass.footerBgContainer, "footer", "panelBg", 1);
	CanvasPanelClass.footerBgContainer.y = 285;
	console.log("footerBgContainer", CanvasPanelClass.footerBgContainer)


	self.roadmapContainer = CGenClass.createContainer(CGameClass.gameContainer, "roadmapContainer", false);
	self.roadmapContainer.y = 218;
	self.roadmapContainer.x = -5;

	self.roadmapScrollContainer = CGenClass.createContainer(self.roadmapContainer, "roadmapScrollContainer", true);
	self.roadmapScrollContainer.x = -20, self.roadmapScrollContainer.y = 65;
	var roadmapScrollBg = CGenClass.createRoundRect(self.roadmapScrollContainer, "roadmapScrollBg", "rgba(52,69,64,1)", 0, "rgba(0,0,0,0)", 440, 6, 3, true);
	console.log("self.roadmapScrollContainer", self.roadmapScrollContainer)

	self.createRoadmapBg();
	var topContainer = CGenClass.createContainer(self.roadmapContainer, "topContainer", true);
	topContainer.x = -20;
	topContainer.y = -75;


	var topBg = CGenClass.createRect(topContainer, "topBg", "#000", 1, "rgba(0, 0, 0, 0)", 440, 30, true);
	self.roadMapTypeText = CGenClass.createText(topContainer, "roadMapTypeText", "left", "middle", "rgba(255, 255, 0, 1)", "500 22px Roboto Condensed", TranslationClass.getTranslation(self.roadmaps[self.selectedRoadmap].id));
	self.roadMapTypeText.x = -211;
	self.roadMapTypeText.y = 2;

	self.dragonCount = CGenClass.createText(topContainer, "dragonCount", "left", "middle", "#b40100", "900 22px Roboto Condensed", "D : 0");
	self.dragonCount.x = 5;
	self.dragonCount.y = 2;
	self.tigerCount = CGenClass.createText(topContainer, "tigerCount", "left", "middle", "#435eff", "900 22px Roboto Condensed", "T : 0");
	self.tigerCount.x = 80;
	self.tigerCount.y = 2;
	self.tieCount = CGenClass.createText(topContainer, "tieCount", "left", "middle", "#04f201", "900 22px Roboto Condensed", "T : 0");
	self.tieCount.x = 150;
	self.tieCount.y = 2;

	console.log("topContainer", topContainer)
	var roadmapsMainContainer = CGenClass.createContainer(self.roadmapContainer, "roadmapsContainer", true);
	var rmHitArea = CGenClass.createRect(roadmapsMainContainer, "rmHitArea", "#FFF", 0, "#000", 440, 120, false);
	roadmapsMainContainer.hitArea = rmHitArea;
	rmHitArea.x = -20;
	self.roadmapsContainer = CGenClass.createContainer(roadmapsMainContainer, "roadmapsContainer", true);
	var touchStart = 0;
	roadmapsMainContainer.on("pressmove", function(e){
		self.roadmapsContainer.uncache();
		var roadmapScroll = self.roadmapScrollContainer.getChildByName("roadmap");
		var width = (self[self.roadmaps[self.selectedRoadmap].name].length+3)*20;
		var scrollW = (440/width)*440;
		var move = (20/width)*440;
		if(self[self.roadmaps[self.selectedRoadmap].name].length > 18){
			touchStart = (touchStart < 1) ? e.rawX : touchStart;
			if(e.rawX > touchStart){
				// >>>>>>>>>>>
				self.roadmapsContainer.x = (self.roadmapsContainer.x !== 0) ? self.roadmapsContainer.x+4 : 0;
				var excess = CGenClass.intToPos(self.roadmapsContainer.x%20);
				self.roadmapsContainer.x = self.roadmapsContainer.x + excess;
				self.sufHidden = 22 + CGenClass.intToPos(self.roadmapsContainer.x/20);
				self.hideCol(1);
				roadmapScroll.x = (Math.round(roadmapScroll.x) <= Math.round(((scrollW-440)/2))) ? roadmapScroll.x : roadmapScroll.x - move;
			}else {
				// <<<<<<<<<<<<<<
				var minX = (self[self.roadmaps[self.selectedRoadmap].name+"Status"].max - 22) * -20;
				self.roadmapsContainer.x = self.roadmapsContainer.x-4;
				var excess = 20 - CGenClass.intToPos(self.roadmapsContainer.x%20);
				self.roadmapsContainer.x = self.roadmapsContainer.x - excess;
				self.roadmapsContainer.x = (self.roadmapsContainer.x <= minX) ? minX : self.roadmapsContainer.x;
				self.preHidden = CGenClass.intToPos(self.roadmapsContainer.x/20) - 1;
				self.hideCol(0);

				roadmapScroll.x = (Math.round(roadmapScroll.x) >= Math.round(((scrollW-440)/2)*-1)) ? roadmapScroll.x: roadmapScroll.x + move;
			}
			self.updateRoadmapX(self.selectedRoadmap);
			self.roadmapsContainer.cache(-240, -60, 2640, 150);
		}
	});

	roadmapsMainContainer.on("pressup", function(e){
		touchStart = 0;
	});

	var beadContainer = CGenClass.createContainer(self.roadmapsContainer, "beadContainer", (self.selectedRoadmap === 0) ? true : false);
	var bigContainer = CGenClass.createContainer(self.roadmapsContainer, "bigContainer", (self.selectedRoadmap === 1) ? true : false);
	var bigeyeContainer = CGenClass.createContainer(self.roadmapsContainer, "bigeyeContainer", (self.selectedRoadmap === 2) ? true : false);
	var smallContainer = CGenClass.createContainer(self.roadmapsContainer, "smallContainer", (self.selectedRoadmap === 3) ? true : false);
	var cockroachContainer = CGenClass.createContainer(self.roadmapsContainer, "cockroachContainer", (self.selectedRoadmap === 4) ? true : false);
	self.createRoadmap(beadContainer);
	self.createRoadmap(bigContainer);
	self.createRoadmap(bigeyeContainer);
	self.createRoadmap(smallContainer);
	self.createRoadmap(cockroachContainer);
	self.createArrows();

	// localStorage.setItem("activeRoadmap", self.selectedRoadmap + " - " + tableID);

	var roadmapBg = CGenClass.createRoundRectStrokeGradient(self.roadmapContainer, "roadmapBg", "rgba(0, 0, 0, 0)", 1, ["#87410E","#F2E798","#F2E798"], 440, 149, 0, true, 
				[0, .5, 1], 0, 0,  0, 150);
	roadmapBg.x = -20;
	roadmapBg.y = -15;

	console.log("##CANVAS ############0 beadContainer", beadContainer.visible, typeof(self.selectedRoadmap))
	console.log("##CANVAS ############1 bigContainer", bigContainer.visible)
	console.log("##CANVAS ############2 bigeyeContainer", bigeyeContainer.visible)
	console.log("##CANVAS ############3 smallContainer", smallContainer.visible)
	console.log("##CANVAS ############4 cockroachContainer", cockroachContainer.visible)
	console.log("##CANVAS roadmapBg", roadmapBg)
	console.log("##CANVAS roadmapContainer", self.roadmapContainer)
	console.log("##CANVAS self.roadmapsContainer", self.roadmapsContainer)

	next();
};

RoadMap.prototype.setScroll = function(rm){
	var self = this;
	var width = (self[rm].length+3)*20;
	var scrollW = (440/width)*440;
	var scollRm = self.roadmapScrollContainer.getChildByName("roadmap");
	if(scollRm){
		self.roadmapScrollContainer.removeChildAt(1);
	}
	self.roadmapScrollContainer.visible = (width > 440) ? true : false;
	var roadmap = CGenClass.createRoundRect(self.roadmapScrollContainer, "roadmap", "rgba(140,140,140,1)", 0, "rgba(0,0,0,0)", scrollW, 6, 3, true);
	roadmap.x = ((scrollW-440)/2)*-1;
	CGenClass.addMouseOverandOut(roadmap, 1.05, 1);
	var move = (20/width)*440;
	var touchStart = 0;

	roadmap.on("pressmove", function(e){
		self.roadmapsContainer.uncache();
		if(self[self.roadmaps[self.selectedRoadmap].name].length > 18){
			touchStart = (touchStart < 1) ? e.rawX : touchStart;
			if(e.rawX > touchStart){
				// >>>>>>>>>>>
				var minX = (self[self.roadmaps[self.selectedRoadmap].name+"Status"].max - 22) * -20;
				self.roadmapsContainer.x = self.roadmapsContainer.x-4;
				var excess = 20 - CGenClass.intToPos(self.roadmapsContainer.x%20);
				self.roadmapsContainer.x = self.roadmapsContainer.x - excess;
				self.roadmapsContainer.x = (self.roadmapsContainer.x <= minX) ? minX : self.roadmapsContainer.x;
				self.preHidden = CGenClass.intToPos(self.roadmapsContainer.x/20) - 1;
				self.hideCol(0);

				roadmap.x = (Math.round(roadmap.x) >= Math.round(((scrollW-440)/2)*-1)) ? roadmap.x: roadmap.x + move;
			}else {
				roadmap.x = (Math.round(roadmap.x) <= Math.round(((scrollW-440)/2))) ? roadmap.x : roadmap.x - move;
				// <<<<<<<<<<<<<<
				self.roadmapsContainer.x = (self.roadmapsContainer.x !== 0) ? self.roadmapsContainer.x+4 : 0;
				var excess = CGenClass.intToPos(self.roadmapsContainer.x%20);
				self.roadmapsContainer.x = self.roadmapsContainer.x + excess;
				self.sufHidden = 22 + CGenClass.intToPos(self.roadmapsContainer.x/20);
				self.hideCol(1);

			}
			self.updateRoadmapX(self.selectedRoadmap);
			self.roadmapsContainer.cache(-240, -60, 2640, 150);
		}
	});

	roadmap.on("pressup", function(e){
		touchStart = 0;
	});
};

RoadMap.prototype.createRoadmapBg = function(){
	var self = this;
	var roadmapBgContainer = CGenClass.createContainer(self.roadmapContainer, "roadmapBgContainer", true);
	var origY = -50;
	var origX = -230;

	for(var j=0; j<22; j++){
		(function () {
			var jndex = j;
			var colContainer = CGenClass.createContainer(roadmapBgContainer, "colContainer-"+jndex, true);
			colContainer.x = origX;
			for(var i=0; i<6; i++){
				(function () {
					var index = i;
					var cellColor = self.cellColors[jndex];
					if(index === 2 || index === 3){
						cellColor = (cellColor === "#1a1a1a") ? "#000" : "#1a1a1a";
					}
					var cellBg = CGenClass.createRect(colContainer, "rmHitArea", cellColor, 1, "rgba(0, 0, 0, 0)", 20, 20, true);
					cellBg.y = origY;
					origY = origY+20;
				})();			
			}
			origY = -50;
			origX = origX+20;
		})();
		if(j === 23) {
			roadmapBgContainer.cache(-240, -60, 480, 120);
		}
	}
};

RoadMap.prototype.updateRoadmapX = function(rm){
	var self = this;
	self.roadmaps[rm].x = self.roadmapsContainer.x;
};

RoadMap.prototype.createArrows = function(){
	var self = this;
	var arrowsContainer = CGenClass.createContainer(self.roadmapContainer, "arrowsContainer", true);
	arrowsContainer.x = 225;
	arrowsContainer.y = -15;

	var arrowButton =  SpriteClass.createSprite(arrowsContainer, SpriteClass.tableSpriteSheet, "roadmapButton", "arrowButton", 1);
	var arrowButtonHitArea = CGenClass.createRoundRectComplex(arrowsContainer, "arrowButtonHitArea", "rgba(255, 255, 255, 1)", 1, "#000", 50, 150, [0, 9, 9, 0], false);
	arrowsContainer.hitArea = arrowButtonHitArea;
	console.log("arrowButtonHitArea", arrowButtonHitArea)
	CGenClass.addMouseOverandOutBrightness(arrowsContainer, -34, -84, 68, 168);


	arrowsContainer.on("click", function(){
		CGenClass.checkSession(function(status){
			if(status){
				self.roadmapsContainer.uncache();
				self.selectedRoadmap = (self.selectedRoadmap > 3) ? 0 : self.selectedRoadmap+1;
				// localStorage.setItem("activeRoadmap", self.selectedRoadmap + " - " + tableID);
				self.roadMapTypeText.text = self.roadmaps[self.selectedRoadmap].label;
				self.displayRoadmap();
				self.roadmapsContainer.x = 0;
				self.roadmapsContainer.x = self.roadmaps[self.selectedRoadmap].x;
				self.scrollRoadMap(self.selectedRoadmap);
				self.roadmapsContainer.cache(-240, -60, 2640, 150);
			}else{
				CGenClass.displayAlert("invalid session");
			}
		});
	});

	console.log("arrowsContainer", arrowsContainer)
};

RoadMap.prototype.scrollRoadMap = function(srm){
	var self = this;
	var rmtype = self.roadmaps[srm].name;
	var rmContainer = self.roadmapsContainer.getChildByName(rmtype+"Container");
	if(self[rmtype].length > 18){
		for(var i=18; i<self[rmtype].length; i++){
			if(i > 18){
				var minX = (self[rmtype+"Status"].max - 22) * -20;
				self.roadmapsContainer.x = minX;
				var visibleCol = rmContainer.children[i+3];
				visibleCol.visible = true;
				visibleCol.alpha = 1;
				var hideCol = rmContainer.children[(i+3)-22];
				hideCol.visible = false;
				hideCol.alpha = 0;
			}
		}
	}

	self.setScroll(rmtype);
};

RoadMap.prototype.displayRoadmap = function(){
	var self = this;
	var beadContainer = self.roadmapsContainer.getChildByName("beadContainer");
	var bigContainer = self.roadmapsContainer.getChildByName("bigContainer");
	var bigeyeContainer = self.roadmapsContainer.getChildByName("bigeyeContainer");
	var cockroachContainer = self.roadmapsContainer.getChildByName("cockroachContainer");
	var smallContainer = self.roadmapsContainer.getChildByName("smallContainer");

	beadContainer.visible = (self.selectedRoadmap === 0) ? true : false;
	bigContainer.visible = (self.selectedRoadmap === 1) ? true : false;
	bigeyeContainer.visible = (self.selectedRoadmap === 2) ? true : false;
	smallContainer.visible = (self.selectedRoadmap === 3) ? true : false;
	cockroachContainer.visible = (self.selectedRoadmap === 4) ? true : false;
};

RoadMap.prototype.createRoadmap = function(rmContainer){
	var self = this;
	var origY = -50;
	var origX = -230;
	var startColor = "#1a1a1a";

	for(var j=0; j<132; j++){
		(function () {
			var jndex = j;
			var colContainer = CGenClass.createContainer(rmContainer, "colContainer-"+jndex, true);
			colContainer.x = origX;
			colContainer.visible = (jndex < 22) ? true : false;
			colContainer.alpha = (jndex < 22) ? 1 : 0;
			for(var i=0; i<6; i++){
				(function () {
					var index = i;
					var cellContainer = CGenClass.createContainer(colContainer, "cellContainer-"+jndex+"-"+index, true);
					cellContainer.y = origY;
					var cellColor = self.cellColors[jndex];
					if(index === 2 || index === 3){
						cellColor = (cellColor === "#1a1a1a") ? "#000" : "#1a1a1a";
					}
					origY = origY+20;
				})();			
			}
			origY = -50;
			origX = origX+20;
			if(jndex === (132-1)){
				self.roadmapsContainer.cache(-240, -60, 2640, 150);
			}
		})();
	}
};

RoadMap.prototype.createBMTie = function(type, tie){
	var self = this;
	var tieCont = new createjs.Container();
	tieCont.name = "tieCont";

	if(tie !== undefined && tie > 0){
		var maskline = tieCont.addChild(new createjs.Shape());
		maskline.name = "maskline";
		maskline.graphics
			.setStrokeStyle(.2).beginStroke("rgba(0, 0, 0, 0)")
			.beginFill("rgba(0, 0, 0, 0)").drawCircle(0, 0, 10);
		var polygon = new createjs.Shape();
		polygon.x = 2.5;
		polygon.y = 2.5;
		polygon.graphics.beginFill("#04f201");
		polygon.graphics.setStrokeStyle(2).beginStroke("#04f201");
		polygon.graphics.moveTo(-8, 8).lineTo(8, -8);
		tieCont.addChild(polygon);

		if(tie > 1){
			var tieValue = CGenClass.createText(tieCont, "tieValue", "center", "middle", "#FFF", "500 20px Roboto Condensed", tie);
			tieValue.y = .5;
		}
	}
	return tieCont;
};

RoadMap.prototype.createDrg = function(type, tie){
	var self = this;
	var stroke = (type < 1 || type === 3) ? 0 : 2;
	var strokeF = (type < 1 || type === 3) ? "rgba(0, 0, 0, 0)" : "#b40100";
	var fill = (type < 1 || type === 3) ? "#b40100" : "rgba(0, 0, 0, 0)";
	var drgCont = new createjs.Container();
	drgCont.name = "drgCont";
	var DRG = drgCont.addChild(new createjs.Shape());
	DRG.name = "DRG";
	if(type > 3){
		DRG.graphics.beginFill("#b40100");
		DRG.graphics.setStrokeStyle(4).beginStroke("#b40100");
		DRG.graphics.moveTo(8,-8).lineTo(-8, 8);
	}else {
		DRG.graphics
			.setStrokeStyle(stroke).beginStroke(strokeF)
			.beginFill(fill).drawCircle(0, 0, (stroke > 0) ? 7.3 : 8);
	}
	if(tie !== undefined && tie > 0){
		var maskline = drgCont.addChild(new createjs.Shape());
		maskline.name = "maskline";
		maskline.graphics
			.setStrokeStyle(.2).beginStroke("rgba(0, 0, 0, 0)")
			.beginFill("rgba(0, 0, 0, 0)").drawCircle(0, 0, 10);
		var polygon = new createjs.Shape();
		polygon.x = 2;
		polygon.y = 2;
		polygon.graphics.beginFill("#04f201");
		polygon.graphics.setStrokeStyle(3, "round", "round").beginStroke("#04f201");
		polygon.graphics.moveTo(-6, 6).lineTo(6, -6);
		drgCont.addChild(polygon);

		if(tie > 1){
			var tieValue = CGenClass.createText(drgCont, "tieValue", "center", "middle", "#FFF", "500 18px Roboto Condensed", tie);
			tieValue.y = 1;
		}
	}
	var drgText = CGenClass.createText(drgCont, "drgText", "center", "middle", "#FFF", "500 17px Roboto Condensed", "D");
	drgText.y = (CGenClass.isMobile && CGenClass.isIOS) ? 0 : 2;
	drgText.shadow = new createjs.Shadow("#000", 0, 2, 3);
	drgText.visible = (type < 1) ? true : false;
	return drgCont;
};

RoadMap.prototype.createTgr = function(type, tie){
	var self = this;
	var stroke = (type < 1 || type === 3) ? 0 : 2;
	var strokeF = (type < 1 || type === 3) ? "rgba(0, 0, 0, 0)" : "#435eff";
	var fill = (type < 1 || type === 3) ? "#435eff" : "rgba(0, 0, 0, 0)";
	var tgrCont = new createjs.Container();
		tgrCont.name = "tgrCont";
	var TGR = tgrCont.addChild(new createjs.Shape());
	TGR.name = "TGR";
	if(type > 3){
		TGR.graphics.beginFill("#435eff");
		TGR.graphics.setStrokeStyle(4).beginStroke("#435eff");
		TGR.graphics.moveTo(8,-8).lineTo(-8, 8);
	}else {
		TGR.graphics
			.setStrokeStyle(stroke).beginStroke(strokeF)
			.beginFill(fill).drawCircle(0, 0, (stroke > 0) ? 7.3 : 8);
	}
	if(tie !== undefined && tie > 0){
		var maskline = tgrCont.addChild(new createjs.Shape());
		maskline.name = "maskline";
		maskline.graphics
			.setStrokeStyle(.2).beginStroke("rgba(0, 0, 0, 0)")
			.beginFill("rgba(0, 0, 0, 0)").drawCircle(0, 0, 10);
		var polygon = new createjs.Shape();
		polygon.x = 2;
		polygon.y = 2;
		polygon.graphics.beginFill("#04f201");
		polygon.graphics.setStrokeStyle(3, "round", "round").beginStroke("#04f201");
		polygon.graphics.moveTo(-6, 6).lineTo(6, -6);
		tgrCont.addChild(polygon);

		if(tie > 1){
			var tieValue = CGenClass.createText(tgrCont, "tieValue", "center", "middle", "#FFF", "500 18px Roboto Condensed", tie);
			tieValue.y = 1;
		}
	}
	var tgrText = CGenClass.createText(tgrCont, "drgText", "center", "middle", "#FFF", "500 17px Roboto Condensed", "T");
	tgrText.y = (CGenClass.isMobile && CGenClass.isIOS) ? 0 : 2;
	tgrText.shadow = new createjs.Shadow("#000", 0, 2, 3);
	tgrText.visible = (type < 1) ? true : false;
	return tgrCont;
};

RoadMap.prototype.createTie = function(){
	var tieCont = new createjs.Container();
	tieCont.name = "tieCont";
	var TIE = tieCont.addChild(new createjs.Shape());
	TIE.name = "TIE";
	TIE.graphics
		.setStrokeStyle(0).beginStroke("rgba(0, 0, 0, 0)")
		.beginFill("#04f201").drawCircle(0, 0, 8);
	var tieText = CGenClass.createText(tieCont, "drgText", "center", "middle", "#FFF", "500 17px Roboto Condensed", "T");
	tieText.y = (CGenClass.isMobile && CGenClass.isIOS) ? 0 : 2;
	tieText.shadow = new createjs.Shadow("#000", 0, 2, 3);
	return tieCont;
};

RoadMap.prototype.loadRoadMaps = function(roadmaps){
	var self = this;
	var count = 0;
	for(var rm in roadmaps){
		self.setRoadMap(roadmaps[rm], rm, count);
		count++;
	}
	self.setScroll(self.roadmaps[self.selectedRoadmap].name);
};

RoadMap.prototype.setRoadMap = function(roadmapNew, rmtype, index){
	var self = this;
	self.roadmapsContainer.uncache();
	var rmContainer = self.roadmapsContainer.getChildByName(rmtype+"Container");
	if(self[rmtype].length < 1){
		self[rmtype] = roadmapNew;
		for(var i=0; i<roadmapNew.length; i++){
			var col = roadmapNew[i];
			for(var j=0; j<col.length; j++){
				var colContainer = rmContainer.children[i];
				var cellContainer = colContainer.children[j];
				if(i > 18) {
					var newCol = rmContainer.children[i+3];
					newCol.visible = true;
					newCol.alpha = 1;
					self[rmtype+"Status"].max = i+4;
					if(self.roadmaps[self.selectedRoadmap].name === rmtype){
						var minX = (self[rmtype+"Status"].max - 22) * -20;
						self.roadmapsContainer.x = minX;
						var hideCol = rmContainer.children[(i+3)-22];
						hideCol.visible = false;
						hideCol.alpha = 0;
					}
				}
				var cell;
				self[rmtype+"Status"].col = i;
				self[rmtype+"Status"].cell = j;
				if(col[j].win){
					switch(col[j].win){
						case "DRG":
							cell = self.createDrg(index, col[j].tie);
						break;
						case "TIE":
							cell = self.createTie();
						break;
						case "TGR":
							cell = self.createTgr(index, col[j].tie);
						break;
					}
					cellContainer.addChild(cell);
				}else if(col[j].win === "" || col[j].win === null){
					cell = self.createBMTie(index, col[j].tie); 
					cellContainer.addChild(cell);
				}
			}
			if(index === 4 && i === roadmapNew.length-1){
				self.roadmapsContainer.cache(-240, -60, 2640, 150);
			}
		}
	}else {
		if(rmtype === "bead"){
			self.addResToRoadmap(roadmapNew, rmtype, index);
		}else {
			self.reWriteNewCol(roadmapNew, rmtype, index);
		}
	}
};

RoadMap.prototype.reWriteNewCol = function(roadmapNew, rmtype, index){
	var self = this;
	var rmContainer = self.roadmapsContainer.getChildByName(rmtype+"Container");
	for(var i=0; i<roadmapNew.length; i++){
		var col = roadmapNew[i];
		for(var j=0; j<col.length; j++){
			var colContainer = rmContainer.children[i];
			var cellContainer = colContainer.children[j];
			var cell;
			currentCol = i;
			currentCell = j;
			if(i > 18) {
				var newCol = rmContainer.children[i+3];
				newCol.visible = true;
				newCol.alpha = 1;
				self[rmtype+"Status"].max = i+4;
				if(self.roadmaps[self.selectedRoadmap].name === rmtype){
					var minX = (self[rmtype+"Status"].max - 22) * -20;
					self.roadmapsContainer.x = minX;
					var hideCol = rmContainer.children[(i+3)-22];
					hideCol.visible = false;
					hideCol.alpha = 0;
				}
			}
			if(col[j].tie > 0){
				cellContainer.removeChildAt(0);
			}

			if(!cellContainer.children[0]){
				if(col[j].win){
					switch(col[j].win){
						case "DRG":
							cell = self.createDrg(index, col[j].tie);
						break;
						case "TIE":
							cell = self.createTie();
						break;
						case "TGR":
							cell = self.createTgr(index, col[j].tie);
						break;
						case "" || null:
							cell = self.createBMTie(index, col[j].tie); 
						break;
					}
					cellContainer.addChild(cell);
				}else if(col[j].win === "" || col[j].win === null){
					cell = self.createBMTie(index, col[j].tie); 
					cellContainer.addChild(cell);
				}
			}
		}
		if(i === roadmapNew.length-1){
			self.roadmapsContainer.cache(-240, -60, 2640, 150);
		}
	}
	self[rmtype] = roadmapNew;
};

RoadMap.prototype.addResToRoadmap = function(roadmapNew, rmtype, index){
	var self = this;
	var rmContainer = self.roadmapsContainer.getChildByName(rmtype+"Container");
	var newCell = (self[rmtype+"Status"].cell > 4) ? 0 : self[rmtype+"Status"].cell+1;
	var newCol = (self[rmtype+"Status"].cell > 4)  ? self[rmtype+"Status"].col+1 : self[rmtype+"Status"].col;
	var colContainer = rmContainer.children[newCol];
	var cellContainer = colContainer.children[newCell];
	var cell;
	if(roadmapNew[newCol]){
		if(roadmapNew[newCol][newCell]){
			if(roadmapNew[newCol][newCell].win) {
				switch(roadmapNew[newCol][newCell].win){
					case "DRG":
						cell = self.createDrg(index);
					break;
					case "TIE":
						cell = self.createTie();
					break;
					case "TGR":
						cell = self.createTgr(index);
					break;
				}
			}
		}
	}
	cellContainer.addChild(cell);
	self[rmtype+"Status"].col = newCol;
	self[rmtype+"Status"].cell = newCell;
	self.roadmapsContainer.cache(-240, -60, 2640, 150);
};

RoadMap.prototype.hideCol = function(type){
	var self = this;
	var rmContainer = self.roadmapsContainer.getChildByName(self.roadmaps[self.selectedRoadmap].name+"Container");
	for(var i=0; i<rmContainer.children.length; i++){
		(function(){
			var index = i;         
			var colContainer = rmContainer.children[index];
			if(type > 0){
				var starting = self.sufHidden - 22;
				colContainer.visible = (index >= starting && index < self.sufHidden) ? true : false; 
				colContainer.alpha = (index >= starting && index < self.sufHidden) ? 1 : 0; 
			}else {
				var ending = self.preHidden + 23;
				colContainer.visible = (index <= self.preHidden || ending <= index) ? false : true;
				colContainer.alpha = (index <= self.preHidden || ending <= index) ? 0 : 1;
			}
		})();
	}
};

RoadMap.prototype.resetRoadMap = function(cont) {
	var self = this;
	var rmContainer = cont;
	self.roadmapsContainer.uncache();
	for(var j=0; j<rmContainer.children.length; j++){
		(function(){
			var jndex = j;
			var colContainer = rmContainer.children[jndex];
			colContainer.visible = (jndex < 22) ? true : false;
			colContainer.alpha = (jndex < 22) ? 1 : 0;
			for(var k=0; k<colContainer.children.length; k++){
				var cellContainer = colContainer.children[k];
				cellContainer.removeChildAt(0);
			}
		})();
	}
	self.roadmapsContainer.x = 0;
	self.bead = [];
	self.big = [];
	self.bigeye = [];
	self.cockroach = [];
	self.small = [];
	self.beadStatus = {col : 0, cell : 0, max : 22};
	self.bigStatus = {col : 0, cell : 0, max : 22};
	self.bigeyeStatus = {col : 0, cell : 0, max : 22};
	self.cockroachStatus = {col : 0, cell : 0, max : 22};
	self.smallStatus = {col : 0, cell : 0, max : 22};
	self.roadmaps = [
			{label : "BEAD ROAD", name : "bead", x : 0, sufHidden : 22, preHidden : 0},
			{label : "BIG ROAD", name : "big", x : 0, sufHidden : 22, preHidden : 0},
			{label : "BIG EYE ROAD", name : "bigeye", x : 0, sufHidden : 22, preHidden : 0},
			{label : "SMALL ROAD", name : "small", x : 0, sufHidden : 22, preHidden : 0},
			{label : "COCKROACH ROAD", name : "cockroach", x : 0, sufHidden : 22, preHidden : 0},
		];
	self.sufHidden = 22;
	self.preHidden = 0;
	self.roadmapsContainer.cache(-240, -60, 2640, 150);
};

RoadMap.prototype.cleanRoadMap = function() {
	var self = this;
	var beadContainer = self.roadmapsContainer.getChildByName("beadContainer");
	var bigContainer = self.roadmapsContainer.getChildByName("bigContainer");
	var bigeyeContainer = self.roadmapsContainer.getChildByName("bigeyeContainer");
	var cockroachContainer = self.roadmapsContainer.getChildByName("cockroachContainer");
	var smallContainer = self.roadmapsContainer.getChildByName("smallContainer");

	self.resetRoadMap(beadContainer);
	self.resetRoadMap(bigContainer);
	self.resetRoadMap(bigeyeContainer);
	self.resetRoadMap(cockroachContainer);
	self.resetRoadMap(smallContainer);
	this.dragonCount.text = "D : 0";
	this.tigerCount.text = "T : 0";
	this.tieCount.text = "T : 0";
};

RoadMap.prototype.updateRoadmapCount = function(result){
	this.dragonCount.text = "D : "+result.DRG;
	this.tigerCount.text = "T : "+result.TGR;
	this.tieCount.text = "T : "+result.TIE;
};

RoadMap.prototype.addFormatRoadmapCount = function(res){
	var result;
	if(res < 10){
		result = "00"+res;
	}else if(res > 9 && res < 100){
		result = "0"+res;
	}else if(res > 99){
		result = res;
	}
	return result;
};

RoadMap.prototype.clearRoadMap = function(){
	this.bead = [];
	this.big = [];
	this.bigeye = [];
	this.cockroach = [];
	this.small = [];
	this.roadmapContainer = null;
	this.roadmapsContainer = null;
	this.beadStatus = {col : 0, cell : 0, max : 22};
	this.bigStatus = {col : 0, cell : 0, max : 22};
	this.bigeyeStatus = {col : 0, cell : 0, max : 22};
	this.cockroachStatus = {col : 0, cell : 0, max : 22};
	this.smallStatus = {col : 0, cell : 0, max : 22};
	this.selectedRoadmap = 1;
	this.roadmaps = [
			{label : "BEAD ROAD", name : "bead", x : 0, sufHidden : 22, preHidden : 0},
			{label : "BIG ROAD", name : "big", x : 0, sufHidden : 22, preHidden : 0},
			{label : "BIG EYE ROAD", name : "bigeye", x : 0, sufHidden : 22, preHidden : 0},
			{label : "SMALL ROAD", name : "small", x : 0, sufHidden : 22, preHidden : 0},
			{label : "COCKROACH ROAD", name : "cockroach", x : 0, sufHidden : 22, preHidden : 0},
		];
	this.roadMapTypeText = null;
	this.sufHidden = 22;
	this.preHidden = 0;

	this.dragonCount = null;
	this.tigerCount = null;
	this.tieCount = null;

	this.roadmapScrollContainer = null;
	this.isChanged = false;
};

var RoadMapClass = new RoadMap();