var CanvasPanel = function(){
	this.balance = 0;
	this.totalWin = 0;
	this.totalBet = 0;
	this.balanceValue = null;
	this.totalWinValue = null;
	this.totalBetValue = null;

	this.isMenuOpen = false;
	this.isHomeEnabled = true;
	this.isMenuEnabled = true;

	this.panelAlertContainer = null;
	this.panelPopupContainer = null;
	this.infoActive = null;
	this.avatarActive = null;
	this.reportActive = null;

	this.enableRebet = false;
	this.rebetButton = null;
	this.isRebetHidden = true;

	this.currentGameRule = 1;

	this.splitUrl = window.location.host.split('.');

	this.fullScreenSprite = null;
	this.minimizeSprite = null;

	this.footerBgContainer = null;
	this.currentErrorCode = null;
	this.alertContainerDone = false;

	this.isAlertVisible = false;

	this.donotshowButton = null;
	this.donotshowCheck = null;
	this.isdonotShowChecked = false;
};

CanvasPanel.prototype.init = function(){
	var self = this;
	this.createCPanel(function(){
		self.isdonotShowChecked = (localStorage.getItem("donotshowPlaceBetInfo")) ? true : false;
		console.log("1121isdonotShowChecked", self.isdonotShowChecked)
		CGameClass.isPlaceBetInfoVisible = (self.isdonotShowChecked) ? false : true;
		console.log("1121isPlaceBetInfoVisible", CGameClass.isPlaceBetInfoVisible)
		CGameClass.placeBetInfoContainer = CGenClass.createContainer(CGenClass.mainContainer, "placeBetInfoContainer", CGameClass.isPlaceBetInfoVisible);
		var placeBetBg = CGenClass.createBitmap(CGameClass.placeBetInfoContainer, "placebetinfo_sbo", "placeBetBg", 1);
		self.donotshowButton = CGenClass.createRect(CGameClass.placeBetInfoContainer, "donotshowButton", "#FFF", 2, "#000", 41, 41, true);
		self.donotshowButton.x = -94;
		self.donotshowButton.y = 205;

		self.donotshowCheck = CGenClass.createBitmap(CGameClass.placeBetInfoContainer, "check", "donotshowCheck", 1);
		self.donotshowCheck.visible = false;
		self.donotshowCheck.x = -94;
		self.donotshowCheck.y = 205;
		console.log("donotshowButton", self.donotshowButton)
		self.donotshowButton.on("click", function(){
			self.donotshowCheck.visible = true;
			self.isdonotShowChecked = true;
			localStorage.setItem("donotshowPlaceBetInfo", true);
		});
		placeBetBg.on("click", function(){
			self.placeBetDisplay(false);
		});
	});
};

CanvasPanel.prototype.placeBetDisplay = function(status){
	CGameClass.isPlaceBetInfoVisible = status;
	CGameClass.placeBetInfoContainer.visible = CGameClass.isPlaceBetInfoVisible;
	// localStorage.setItem("isPlaceBetAlreadyShowed", true);
	if(!CGameClass.betHereMainContainer.visible){
		CGameClass.isBetHereVisible = true;
		CGameClass.animateBetHere(CGameClass.isBetHereVisible);
	}
};

CanvasPanel.prototype.createCPanel = function(next){
	var mainContainer = CGenClass.mainContainer;
	var gameStage = CGenClass.gameStage;
	var panelContainer = CGenClass.createContainer(mainContainer, "panelContainer", true);
	panelContainer.y = 330;
	this.panelPopupContainer = CGenClass.createContainer(mainContainer, "panelPopupContainer", true);
	// var menuBg = CGenClass.createRect(panelContainer, "menuBg", "rgba(0, 0, 0, .75)", 0, "rgba(0, 0, 0, 0)", 80, 60, true);
	// menuBg.x = -610;
	var footerContainer = CGenClass.createContainer(panelContainer, "footerContainer", true);

	this.createAlertContainer(mainContainer);

	console.log("##CANVAS panelContainer", panelContainer);
	this.createPlayerDetails(footerContainer);
	this.createMenuContainer(panelContainer, footerContainer);
	this.createHomeButtonContainer(panelContainer);
	this.createActionButtons(panelContainer);
	next();
};

CanvasPanel.prototype.createAlertContainer = function(mainContainer){
	var self = this;
	self.panelAlertContainer = CGenClass.createContainer(CGenClass.alertMainContainer, "panelAlertContainer", true);

	var alertContainer = CGenClass.createContainer(self.panelAlertContainer, "alertContainer", true);
	alertContainer.y = -520;
	var alertBg = CGenClass.createRoundRect(alertContainer, "alertBg", "rgba(0, 0, 0, .75)", 0, "#000", 500, 250, 4, true);

	var alertHeader = CGenClass.createText(alertContainer, "alertHeader", "center", "middle", "#FFF", "900 20px Roboto Condensed", "");
	alertHeader.y = -80;

	var alertBody = CGenClass.createText(alertContainer, "alertBody", "center", "middle", "#FFF", "100 18px Roboto CondensedLight", "");
	alertBody.y = -10;
	alertBody.lineWidth = 400;

	var okButtonContainer = CGenClass.createContainer(alertContainer, "okButtonContainer", true);
	okButtonContainer.x = -95;
	okButtonContainer.y = 59;
	var okButton = CGenClass.createRoundRect(okButtonContainer, "okButton", "rgba(0, 0, 0, 0)", 1, "#B1B1B1", 64, 45, 5, true);
	var okLabel = CGenClass.createText(okButtonContainer, "okLabel", "center", "middle", "#B1B1B1", "900 20px Roboto Condensed", TranslationClass.getTranslation("Okay"));
	var okHitArea =CGenClass.createRoundRect(okButtonContainer, "okButton", "rgba(255, 255, 255, 1)", 1, "#B1B1B1", 64, 45, 5, false);
	okButtonContainer.hitArea = okHitArea;

	var cancelButtonContainer = CGenClass.createContainer(alertContainer, "cancelButtonContainer", true);
	cancelButtonContainer.x = 95;
	cancelButtonContainer.y = 59;
	var cancelButton = CGenClass.createRoundRect(cancelButtonContainer, "cancelButton", "rgba(255, 255, 255, 1)", 1, "#FFF", 64, 45, 5, true);
	var cancelLabel = CGenClass.createText(cancelButtonContainer, "cancelLabel", "center", "middle", "#000", "900 20px Roboto Condensed", TranslationClass.getTranslation("Cancel"));
	
	var lowerBetButtonContainer = CGenClass.createContainer(alertContainer, "lowerBetButtonContainer", false);
	lowerBetButtonContainer.x = -68;
	lowerBetButtonContainer.y = 59;
	var lowerBetButton = CGenClass.createRoundRect(lowerBetButtonContainer, "lowerBetButton", "rgba(0, 0, 0, 0)", 1, "#B1B1B1", 250, 45, 5, true);
	var lowerBetLabel = CGenClass.createText(lowerBetButtonContainer, "lowerBetLabel", "center", "middle", "#B1B1B1", "900 20px Roboto Condensed", "Lower Bet to Maximum Bet");
	var lowerBetHitArea =CGenClass.createRoundRect(lowerBetButtonContainer, "lowerBetButton", "rgba(255, 255, 255, 1)", 1, "#B1B1B1", 250, 45, 5, false);
	lowerBetButtonContainer.hitArea = lowerBetHitArea;

	var topUpButtonContainer = CGenClass.createContainer(alertContainer, "topUpButtonContainer", false);
	topUpButtonContainer.x = -68;
	topUpButtonContainer.y = 59;
	var topUpButton = CGenClass.createRoundRect(topUpButtonContainer, "topUpButton", "rgba(0, 0, 0, 0)", 1, "#B1B1B1", 250, 45, 5, true);
	var topUpLabel = CGenClass.createText(topUpButtonContainer, "topUpLabel", "center", "middle", "#B1B1B1", "900 20px Roboto Condensed", "Top Up to Minimum Bet");
	var topUpHitArea =CGenClass.createRoundRect(topUpButtonContainer, "topUpButton", "rgba(255, 255, 255, 1)", 1, "#B1B1B1", 250, 45, 5, false);
	topUpButtonContainer.hitArea = topUpHitArea;

	CGenClass.addMouseOverandOut(okButtonContainer, 1.2, 1);
	CGenClass.addMouseOverandOut(cancelButtonContainer, 1.2, 1);
	CGenClass.addMouseOverandOut(lowerBetButtonContainer, 1.2, 1);
	CGenClass.addMouseOverandOut(topUpButtonContainer, 1.2, 1);
	self.alertContainerDone = true;
	console.log("##CANVAS panelAlertContainer", self.panelAlertContainer);
};

CanvasPanel.prototype.setAlert = function(code, option, betSuccessRefNo){
	var self = this;
	var alertCanvasTimer = setInterval(function () {
		if(CGenClass.alertCanvas){
			CGenClass.alertCanvas.style.display = "block";
			var errCode = (ErrorClass.list[code]) ? code : "default error";
			var refNo = (betSuccessRefNo) ? betSuccessRefNo.data.transactionId : "";
			var header = ErrorClass.list[errCode].title;
			var body = ErrorClass.list[errCode].message+refNo;
			var buttons = ErrorClass.list[errCode].button;
			var pos = ErrorClass.list[errCode].pos;
			// if(code === self.currentErrorCode) return false;
			self.isAlertVisible = true;

			var timer = setInterval(function () {
			  	if (self.alertContainerDone) {
			  		clearInterval(timer);
				    var alertContainer = self.panelAlertContainer.getChildByName("alertContainer");
				    if(alertContainer.y === 0){
					    if(self.currentErrorCode !== "stand player" && self.currentErrorCode !== "invalid session" && self.currentErrorCode !== "kick player"){
					    	errCode = self.currentErrorCode;
					    	header = ErrorClass.list[errCode].title;
					    	body = ErrorClass.list[errCode].message+refNo;
					    	buttons = ErrorClass.list[errCode].button;
					    	pos = ErrorClass.list[errCode].pos;
					    }
				    }
				    console.log("SET ALERT", errCode);
				    alertContainer.alpha = (errCode === self.currentErrorCode && alertContainer.y === 0) ? 1 : 0;
				    var alertHeader = alertContainer.getChildByName("alertHeader");
				    var alertBody = alertContainer.getChildByName("alertBody");
				    var okButtonContainer = alertContainer.getChildByName("okButtonContainer");
				    var cancelButtonContainer = alertContainer.getChildByName("cancelButtonContainer");
				    var lowerBetButtonContainer = alertContainer.getChildByName("lowerBetButtonContainer");
				    var topUpButtonContainer = alertContainer.getChildByName("topUpButtonContainer");

				    var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
				    var actionContainer = panelContainer.getChildByName("actionContainer");
				    var homeButtonContainer = panelContainer.getChildByName("homeButtonContainer");
				    var footerContainer = panelContainer.getChildByName("footerContainer");

				    alertHeader.text = header;
				    alertHeader.y = (betSuccessRefNo) ? -30 : -80;
				    alertHeader.color = ErrorClass.list[errCode].titleColor;
				    alertBody.text = body;
				    alertBody.y = pos;
				    if(errCode === "side bet alert"){
				    	alertBody.color = ErrorClass.list[errCode].titleColor;
				    	alertHeader.y = 0;
				    }else{
				    	alertBody.color = "#FFF";
				    }

				    createjs.Tween.get(alertContainer)
				    	.to({y : 0, alpha : 1}, 300);
			    	// self.isRebetHidden = true;
			    	// self.enableRebet = false;
				    createjs.Tween.get(actionContainer, {override : true})
				    	.to({x : 685}, 300);

				    self.closeMenu();
				    
				    okButtonContainer.visible = (buttons === 2 || buttons === 4 || buttons === 5) ? false : true;
				    okButtonContainer.x = (buttons < 2) ? 0 : -95;

				    cancelButtonContainer.visible = (buttons === 1) ? false : true;
				    cancelButtonContainer.x = (buttons === 2) ? 0 : 95;
				    cancelButtonContainer.x = (buttons === 4 || buttons === 5) ? 161 : cancelButtonContainer.x;

				    lowerBetButtonContainer.visible = (buttons === 4) ? true : false;

					topUpButtonContainer.visible = (buttons === 5) ? true : false;

				    if(buttons < 1){
				    	okButtonContainer.visible = false;
				    	cancelButtonContainer.visible = false;
				    }

				    okButtonContainer.on("click", function(){
				    	option(true);
				    });

				    cancelButtonContainer.on("click", function(){
				    	option(false);
				    });

				    lowerBetButtonContainer.on("click", function(){
				    	option(true);
				    });

					topUpButtonContainer.on("click", function(){
						option(true);
					});

					console.log("min max lowerBetButtonContainer", lowerBetButtonContainer)

				    var infoContentContainer = self.panelPopupContainer.getChildByName("infoContentContainer");
				    var infoContentBgCont = self.panelPopupContainer.getChildByName("infoContentBgCont");
				    var avatarContentContainer = self.panelPopupContainer.getChildByName("avatarContentContainer");
				    var reportContentContainer = self.panelPopupContainer.getChildByName("reportContentContainer");
				    self.infoActive.visible = true;
				    self.avatarActive.visible = false;

				    createjs.Tween.get(infoContentContainer)
				    	.to({x : -350, alpha : 0}, 300)
				    	.call(function(){
				    		infoContentContainer.visible = false;
				    		infoContentBgCont.visible = false;
				    	});
				    createjs.Tween.get(avatarContentContainer)
				    	.to({x : -350, alpha : 0}, 300)
				    	.call(function(){
				    		avatarContentContainer.visible = false;
				    	});
				    createjs.Tween.get(reportContentContainer)
				    	.to({x : -350, alpha : 0}, 300)
				    	.call(function(){
				    		reportContentContainer.visible = false;
				    	});
				    createjs.Tween.get(footerContainer)
				    	.to({y : 0}, 300);
				    createjs.Tween.get(self.footerBgContainer)
				    	.to({y : 285}, 300)
				    createjs.Tween.get(homeButtonContainer)
				    	.to({x : 610}, 300);

					self.currentErrorCode = errCode;
				    StandingClass.displayStandingPlayerList(false);
				    CGameClass.displayMinMaxContainer(false);
				    EmojiClass.openTauntList(false, 5);

				    if(errCode === "stand player"){
				    	setTimeout(function(){
				    		CSeatClass.removeFromSeat();
				    		self.hideAlert();
				    	}, 2000);
				    }else if(errCode === "invalid session"){
				    	clearInterval(CGameClass.sessionInterval);
				    }
				    
			  	}
			}, 200);

			clearInterval(alertCanvasTimer);
		}
	}, 200);
	

	console.log("SET ALERT", code)
};

CanvasPanel.prototype.hideAlert = function(){
	var self = this;
	console.log("SET ALERT hide")
	var alertContainer = self.panelAlertContainer.getChildByName("alertContainer");
	var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
	var okButtonContainer = alertContainer.getChildByName("okButtonContainer");
	var cancelButtonContainer = alertContainer.getChildByName("cancelButtonContainer");
	var lowerBetButtonContainer = alertContainer.getChildByName("lowerBetButtonContainer");
	var topUpButtonContainer = alertContainer.getChildByName("topUpButtonContainer");

	self.isAlertVisible = false;
	createjs.Tween.get(alertContainer)
		.to({y : -520, alpha : 0}, 300)
		.call(function(){
			CGenClass.alertCanvas.style.display = "none";
		});
	setTimeout(function(){
		CGenClass.alertCanvas.style.display = "none";
	}, 300);
	okButtonContainer.removeAllEventListeners("click");
	cancelButtonContainer.removeAllEventListeners("click");
	lowerBetButtonContainer.removeAllEventListeners("click");
	topUpButtonContainer.removeAllEventListeners("click");
	self.displayAction();

};

CanvasPanel.prototype.createPlayerDetails = function(footerContainer){
	var self = this;
	var balanceContainer = CGenClass.createContainer(footerContainer, "balanceContainer", true);
	balanceContainer.x = -150;
	var balanceLabel = CGenClass.createText(balanceContainer, "balanceLabel", "center", "middle", "#FFF", "200 18px Roboto Condensed", TranslationClass.getTranslation("balance"));
	balanceLabel.y = -27;
	this.balanceValue = CGenClass.createText(balanceContainer, "balanceLabel", "center", "middle", "#FFF", "200 22px Roboto Condensed", self.balance.toLocaleString());
	this.balanceValue.y = -7;

	var totalWinContainer = CGenClass.createContainer(footerContainer, "totalWinContainer", true);
	var totalWinLabel = CGenClass.createText(totalWinContainer, "totalWinLabel", "center", "middle", "#FFF", "200 18px Roboto Condensed", TranslationClass.getTranslation("totalWin"));
	totalWinLabel.y = -27;
	this.totalWinValue = CGenClass.createText(totalWinContainer, "totalWinLabel", "center", "middle", "#FFF", "200 22px Roboto Condensed", self.totalWin.toLocaleString());
	this.totalWinValue.y = -7;

	var totalBetContainer = CGenClass.createContainer(footerContainer, "totalBetContainer", true);
	totalBetContainer.x = 150;
	var totalBetLabel = CGenClass.createText(totalBetContainer, "totalBetLabel", "center", "middle", "#FFF", "200 18px Roboto Condensed", TranslationClass.getTranslation("totalBet"));
	totalBetLabel.y = -27;
	this.totalBetValue = CGenClass.createText(totalBetContainer, "totalBetLabel", "center", "middle", "#FFF", "200 22px Roboto Condensed", self.totalBet.toLocaleString());
	this.totalBetValue.y = -7;
	console.log("this.balanceValue", this.balanceValue)
	console.log("totalWinLabel", totalWinLabel)
	console.log("totalBetLabel", totalBetLabel)
};

CanvasPanel.prototype.setTotalWin = function(data){
	this.totalWin = data.totalPayout;
	CGenClass.animateNumber(0, data.totalPayout, function(playerBalanceDisplay, balance){
		var display = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
		CanvasPanelClass.totalWinValue.text = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
	});
};

CanvasPanel.prototype.createMenuContainer = function(panelContainer, footerContainer){
	var self = this;
	var menuIconsContainer = CGenClass.createContainer(panelContainer, "menuIconsContainer", true);
	menuIconsContainer.x = -680; //-610
	menuIconsContainer.y = -360;
	var panelBg = CGenClass.createRect(menuIconsContainer, "panelBg", "rgba(0,0,0,.75)", 1, "rgba(0,0,0,0)", 1280, 720, true);
	panelBg.y = 30;
	panelBg.x = -620;
	console.log("panelBg", panelBg)
	var menuIconsBg = CGenClass.createRect(menuIconsContainer, "menuIconsBg", "rgba(0, 0, 0, .75)", 0, "rgba(0, 0, 0, 0)", 80, 660, true);

	var menuContainer = CGenClass.createContainer(panelContainer, "menuContainer", true);
	menuContainer.x = -605, menuContainer.y = -24;
	var menuSprite = SpriteClass.createSprite(menuContainer, SpriteClass.panelSpriteSheet, "menu", "menuSprite", 1);
	var closeSprite = SpriteClass.createSprite(menuContainer, SpriteClass.panelSpriteSheet, "close", "closeSprite", 1);
	closeSprite.scaleY = 0;
	var menuHitArea = CGenClass.createRect(menuContainer, "menuHitArea", "rgba(255, 255, 255, 1)", .5, "#000", 80, 80, false);
	menuContainer.hitArea = menuHitArea;


	var infoContentBgCont = CGenClass.createContainer(self.panelPopupContainer, "infoContentBgCont", false);
	var infoContentHitArea = CGenClass.createRect(infoContentBgCont, "infoContentHitArea", "rgba(255, 255, 255, 1)", .5, "#000", 1280, 720, false);
	infoContentBgCont.hitArea = infoContentHitArea;
	infoContentBgCont.x = 70;
	infoContentBgCont.on("click", function(){
		self.hideMenu();
	});

	var infoContentContainer = CGenClass.createContainer(self.panelPopupContainer, "infoContentContainer", false);
	var avatarContentContainer = CGenClass.createContainer(self.panelPopupContainer, "avatarContentContainer", false);
	var reportContentContainer = CGenClass.createContainer(self.panelPopupContainer, "reportContentContainer", false);
	self.createFullScreenContainer(menuIconsContainer);
	self.createMuteContainer(menuIconsContainer);
	self.createReportContainer(menuIconsContainer, infoContentContainer, avatarContentContainer, reportContentContainer);
	self.createUserContainer(menuIconsContainer, infoContentContainer, avatarContentContainer, reportContentContainer);
	self.createInfoContainer(menuIconsContainer, infoContentContainer, avatarContentContainer, reportContentContainer);

	CGenClass.addMouseOverandOut(menuContainer, 1.2, 1);
	menuContainer.on("click", function(e){
		if(self.isMenuEnabled){
			CGenClass.checkSession(function(status){
				if(status){
						var actionContainer = panelContainer.getChildByName("actionContainer");
						var homeButtonContainer = panelContainer.getChildByName("homeButtonContainer");
						if(self.isMenuOpen){
							self.closeMenu();
							createjs.Tween.get(infoContentContainer)
								.to({x : -350, alpha : 0}, 300)
								.call(function(){
									infoContentContainer.visible = false;
									infoContentBgCont.visible = false;
								});
							createjs.Tween.get(avatarContentContainer)
								.to({x : -350, alpha : 0}, 300)
								.call(function(){
									avatarContentContainer.visible = false;
								});
							createjs.Tween.get(reportContentContainer)
								.to({x : -350, alpha : 0}, 300)
								.call(function(){
									reportContentContainer.visible = false;
								});
							// self.enableRebet = (Object.values(CGameClass.rebetValues).length > 0) ? true : false;
							// self.isRebetHidden = (Object.values(CGameClass.rebetValues).length > 0) ? false : self.isRebetHidden;
							// self.updateRebetStatus(self.enableRebet);
							createjs.Tween.get(actionContainer)
								.to({x : (self.isRebetHidden) ? 685 : 585}, 300);
							createjs.Tween.get(footerContainer)
								.to({y : 0}, 300)
							createjs.Tween.get(self.footerBgContainer)
								.to({y : 285}, 300)
							createjs.Tween.get(homeButtonContainer)
								.to({x : 610}, 300)
								.call(function(){
									self.avatarActive.visible = false;
									self.reportActive.visible = false;
									self.infoActive.visible = true;
								});
						}else {
							self.openMenu();
							infoContentContainer.visible = true;
							infoContentBgCont.visible = true;
							createjs.Tween.get(infoContentContainer)
								.to({x : 0, alpha : 1}, 300)
								.call(function(){
									infoContentContainer.visible = true;
									console.log("open menu infoContentContainer", infoContentContainer);
								})
							// self.enableRebet = false;
							// self.isRebetHidden = true;
							createjs.Tween.get(actionContainer)
								.to({x : 685}, 300);
							createjs.Tween.get(footerContainer)
								.to({y : 100}, 300)
							createjs.Tween.get(self.footerBgContainer)
								.to({y : 350}, 300)
							createjs.Tween.get(homeButtonContainer)
								.to({x : 670}, 300)

							StandingClass.displayStandingPlayerList(false);
							CGameClass.displayMinMaxContainer(false);
							EmojiClass.openTauntList(false, 6);
						}	
				}else{
					CGenClass.displayAlert("invalid session");
				}
			});
		}
	});
	console.log("##CANVAS menuContainer ", menuContainer);
	console.log("##CANVAS menuIconsContainer ", menuIconsContainer);
};

CanvasPanel.prototype.hideMenu = function(){
	var self = this;
	var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
	var actionContainer = panelContainer.getChildByName("actionContainer");
	var homeButtonContainer = panelContainer.getChildByName("homeButtonContainer");
	var infoContentContainer = self.panelPopupContainer.getChildByName("infoContentContainer");
	var infoContentBgCont = self.panelPopupContainer.getChildByName("infoContentBgCont");
	var avatarContentContainer = self.panelPopupContainer.getChildByName("avatarContentContainer");
	var reportContentContainer = self.panelPopupContainer.getChildByName("reportContentContainer");
	var footerContainer = panelContainer.getChildByName("footerContainer");
	self.closeMenu();
	createjs.Tween.get(infoContentContainer)
		.to({x : -350, alpha : 0}, 300)
		.call(function(){
			infoContentContainer.visible = false;
			infoContentBgCont.visible = false;
		});
	createjs.Tween.get(avatarContentContainer)
		.to({x : -350, alpha : 0}, 300)
		.call(function(){
			avatarContentContainer.visible = false;
		});
	createjs.Tween.get(reportContentContainer)
		.to({x : -350, alpha : 0}, 300)
		.call(function(){
			reportContentContainer.visible = false;
		});
	self.displayAction();
	createjs.Tween.get(footerContainer)
		.to({y : 0}, 300)
	createjs.Tween.get(self.footerBgContainer)
		.to({y : 285}, 300)
	createjs.Tween.get(homeButtonContainer)
		.to({x : 610}, 300)
		.call(function(){
			self.avatarActive.visible = false;
			self.reportActive.visible = false;
			self.infoActive.visible = true;
		});
};

CanvasPanel.prototype.createFullScreenContainer = function(menuIconsContainer){
	var self = this;
	var fullScreenContainer = CGenClass.createContainer(menuIconsContainer, "fullScreenContainer", (CGenClass.isMobile && !CGenClass.isIOS) ? true : false);
	// var fullScreenContainer = CGenClass.createContainer(menuIconsContainer, "fullScreenContainer", true);
	fullScreenContainer.y = 227;
	fullScreenContainer.x = 5;
	self.fullScreenSprite = SpriteClass.createSprite(fullScreenContainer, SpriteClass.panelSpriteSheet, "fullscreen", "fullScreenSprite", 1);
	self.minimizeSprite = SpriteClass.createSprite(fullScreenContainer, SpriteClass.panelSpriteSheet, "minimize", "minimizeSprite", 1);
	self.minimizeSprite.visible = false;
	var hitArea = CGenClass.createRect(fullScreenContainer, "hitArea", "rgba(255, 255, 255, 1)", .5, "#000", 65, 108, false);
	fullScreenContainer.hitArea = hitArea;
	CGenClass.addMouseOverandOut(fullScreenContainer, 1.2, 1);
	fullScreenContainer.on("click", function(){
		CGenClass.applyFullScreen();
		self.minimizeSprite.visible = (CGenClass.isFullScreen) ? true : false;
		self.fullScreenSprite.visible = (!CGenClass.isFullScreen) ? true : false;
	});
	console.log("fullScreenContainer", fullScreenContainer)
};

CanvasPanel.prototype.createMuteContainer = function(menuIconsContainer){
	var muteContainer = CGenClass.createContainer(menuIconsContainer, "muteContainer", true);
	muteContainer.y = (CGenClass.isMobile && !CGenClass.isIOS) ? 119 : 227;
	muteContainer.x = 5;
	var muteSprite = SpriteClass.createSprite(muteContainer, SpriteClass.panelSpriteSheet, "mute", "muteSprite", 1);
	muteSprite.visible = SoundClass.mute;
	var unMuteSprite = SpriteClass.createSprite(muteContainer, SpriteClass.panelSpriteSheet, "unmute", "unMuteSprite", 1);
	unMuteSprite.visible = !SoundClass.mute;
	var hitArea = CGenClass.createRect(muteContainer, "hitArea", "rgba(255, 255, 255, 1)", .5, "#000", 65, 108, false);
	muteContainer.hitArea = hitArea;
	CGenClass.addMouseOverandOut(muteContainer, 1.2, 1);
	muteContainer.on("click", function(){
		SoundClass.toggleMute();
		unMuteSprite.visible = (SoundClass.mute) ? false : true;
		muteSprite.visible = (!SoundClass.mute) ? false : true;
		socket.emit('update settings', { type: 'sounds', isMute: SoundClass.mute});
	});
	console.log("muteContainer", muteContainer)
};

CanvasPanel.prototype.createReportContainer = function(menuIconsContainer, infoContentContainer, avatarContentContainer, reportContentContainer){
	var self = this;
	var reportContainer = CGenClass.createContainer(menuIconsContainer, "reportContainer", true);
	reportContainer.y = (CGenClass.isMobile && !CGenClass.isIOS) ? 11 : 119;
	reportContainer.x = 5;
	var reportSprite = SpriteClass.createSprite(reportContainer, SpriteClass.panelSpriteSheet, "doc", "reportSprite", 1);
	var hitArea = CGenClass.createRect(reportContainer, "hitArea", "rgba(255, 255, 255, 1)", .5, "#000", 65, 108, false);
	reportContainer.hitArea = hitArea;
	self.reportActive = CGenClass.createRect(reportContainer, "reportActive", "rgba(255, 255, 255, 1)", 0, "rgba(0, 0, 0, 0)", 4, 95, true);
	self.reportActive.x = -33;
	self.reportActive.visible = false;
	CGenClass.addMouseOverandOut(reportContainer, 1.2, 1);

	reportContentContainer.x = -350;
	reportContentContainer.alpha = 0;
	var reportContentBg = CGenClass.createBitmap(reportContentContainer, "report_table", "reportContentBg", 1);
	// var reportContentBg = CGenClass.createRoundRect(reportContentContainer, "reportContentBg", "rgba(0, 0, 0, .75)", 0, "#000", 1000, 500, 4, true);
	var reportLabel = CGenClass.createText(reportContentContainer, "reportLabel", "center", "middle", "#FFF", "900 30px Roboto CondensedBold", "LATEST ROUND(S)");
	reportLabel.y = -217;
	var reportContentBgHitAreaCont = CGenClass.createContainer(reportContentContainer, "reportContentBgHitAreaCont", true);
	var reportContentBgHitArea = CGenClass.createRoundRect(reportContentBgHitAreaCont, "reportContentBgHitArea", "rgba(0, 0, 0, 1)", 0, "#000", 1000, 500, 4, false);
	reportContentBgHitAreaCont.hitArea = reportContentBgHitArea;
	reportContentBgHitAreaCont.on("click", function(){});

	PlayerReportClass.createReportListContainer(reportContentContainer);

	var infoContentBgCont = self.panelPopupContainer.getChildByName("infoContentBgCont");

	reportContainer.on("click", function(){
		createjs.Tween.get(avatarContentContainer)
			.to({x : -350, alpha : 0}, 300)
			.call(function(){
				avatarContentContainer.visible = false;
			});
		createjs.Tween.get(infoContentContainer)
			.to({x : -350, alpha : 0}, 300)
			.call(function(){
				infoContentContainer.visible = false;
				infoContentBgCont.visible = true;
			});
		reportContentContainer.visible = true;
		createjs.Tween.get(reportContentContainer)
			.wait(300)
			.to({x : 0, alpha : 1}, 300);
		self.avatarActive.visible = false;
		self.infoActive.visible = false;
		self.reportActive.visible = true;
	});
	console.log("reportContainer", reportContainer);
};

CanvasPanel.prototype.createUserContainer = function(menuIconsContainer, infoContentContainer, avatarContentContainer, reportContentContainer){
	var self = this;
	var userContainer = CGenClass.createContainer(menuIconsContainer, "userContainer", true);
	userContainer.y = (CGenClass.isMobile && !CGenClass.isIOS) ? -96 : 11;
	userContainer.x = 5;
	var userSprite = SpriteClass.createSprite(userContainer, SpriteClass.panelSpriteSheet, "user", "userSprite", 1);
	var hitArea = CGenClass.createRect(userContainer, "hitArea", "rgba(255, 255, 255, 1)", .5, "#000", 65, 108, false);
	userContainer.hitArea = hitArea;
	self.avatarActive = CGenClass.createRect(userContainer, "avatarActive", "rgba(255, 255, 255, 1)", 0, "rgba(0, 0, 0, 0)", 4, 95, true);
	self.avatarActive.x = -33;
	self.avatarActive.visible = false;
	CGenClass.addMouseOverandOut(userContainer, 1.2, 1);

	avatarContentContainer.x = -350;
	avatarContentContainer.alpha = 0;
	var avatarContentBg = CGenClass.createRoundRect(avatarContentContainer, "avatarContentBg", "rgba(0, 0, 0, .75)", 0, "#000", 1000, 500, 4, true);
	var avatarLabel = CGenClass.createText(avatarContentContainer, "avatarLabel", "center", "middle", "#FFF", "900 30px Roboto CondensedBold", TranslationClass.getTranslation("avatarSelection"));
	avatarLabel.y = -217;
	var avatarContentBgHitAreaCont = CGenClass.createContainer(avatarContentContainer, "avatarContentBgHitAreaCont", true);
	var avatarContentBgHitArea = CGenClass.createRoundRect(avatarContentBgHitAreaCont, "avatarContentBgHitArea", "rgba(0, 0, 0, 1)", 0, "#000", 1000, 500, 4, false);
	avatarContentBgHitAreaCont.hitArea = avatarContentBgHitArea;
	avatarContentBgHitAreaCont.on("click", function(){});

	AvatarClass.createAvatarSelection(avatarContentContainer);
	var infoContentBgCont = self.panelPopupContainer.getChildByName("infoContentBgCont");
	userContainer.on("click", function(){
		AvatarClass.reload();
		createjs.Tween.get(infoContentContainer)
			.to({x : -350, alpha : 0}, 300)
			.call(function(){
				infoContentContainer.visible = false;
				infoContentBgCont.visible = true;
			});
		createjs.Tween.get(reportContentContainer)
			.to({x : -350, alpha : 0}, 300)
			.call(function(){
				reportContentContainer.visible = false;
			});
		avatarContentContainer.visible = true;
		createjs.Tween.get(avatarContentContainer)
			.wait(300)
			.to({x : 0, alpha : 1}, 300);
		self.avatarActive.visible = true;
		self.infoActive.visible = false;
		self.reportActive.visible = false;
	});
	console.log("userContainer", userContainer, self.avatarActive);
};

CanvasPanel.prototype.createRoadMapContainer = function(menuIconsContainer){
	var roadMapContainer = CGenClass.createContainer(menuIconsContainer, "roadMapContainer", true);
	roadMapContainer.y = -90;
	var roadmapSprite = SpriteClass.createSprite(roadMapContainer, SpriteClass.panelSpriteSheet, "roadmap", "roadmapSprite", 1);
	var hitArea = CGenClass.createRect(roadMapContainer, "hitArea", "rgba(255, 255, 255, 1)", .5, "#000", 65, 108, false);
	roadMapContainer.hitArea = hitArea;
	CGenClass.addMouseOverandOut(roadMapContainer, 1.2, 1);
};

CanvasPanel.prototype.createInfoContainer = function(menuIconsContainer, infoContentContainer, avatarContentContainer, reportContentContainer){
	var self = this;
	var infoContainer = CGenClass.createContainer(menuIconsContainer, "infoContainer", true);
	infoContainer.y = (CGenClass.isMobile && !CGenClass.isIOS) ? -203 : -96;
	infoContainer.x = 5;
	var infoSprite = SpriteClass.createSprite(infoContainer, SpriteClass.panelSpriteSheet, "info", "infoSprite", 1);
	var hitArea = CGenClass.createRect(infoContainer, "hitArea", "rgba(255, 255, 255, 1)", .5, "#000", 65, 108, false);
	infoContainer.hitArea = hitArea;
	self.infoActive = CGenClass.createRect(infoContainer, "infoActive", "rgba(255, 255, 255, 1)", 0, "rgba(0, 0, 0, 0)", 4, 95, true);
	self.infoActive.x = -33;
	CGenClass.addMouseOverandOut(infoContainer, 1.2, 1);
	console.log("infoContainer", infoContainer);
	infoContentContainer.x = -350;
	infoContentContainer.alpha = 0;
	var infoContentBg = CGenClass.createRoundRect(infoContentContainer, "infoContentBg", "rgba(0, 0, 0, 0)", 0, "#000", 1000, 500, 4, true);
	var gameRule = SpriteClass.createSprite(infoContentContainer, SpriteClass.gameGuideSpriteSheet, "game_rule_"+self.currentGameRule, "gameRule", 1);
	gameRule.on("click", function(){});

	var gameRuleLeftArrowCont = CGenClass.createContainer(infoContentContainer, "gameRuleLeftArrowCont", true);
	var gameRuleLeftArrow = CGenClass.createBitmap(gameRuleLeftArrowCont, "arrow", "gameRuleLeftArrow", .85);
	var gameRuleLeftArrowHitArea = CGenClass.createRect(gameRuleLeftArrowCont, "gameRuleLeftArrowHitArea", "rgba(255, 255, 255, 1)", 1, "#000", 40, 30, false);
	gameRuleLeftArrowCont.hitArea = gameRuleLeftArrowHitArea;

	gameRuleLeftArrowCont.rotation = 90;
	gameRuleLeftArrowCont.x = -476;
	CGenClass.addMouseOverandOut(gameRuleLeftArrowCont, 1.2, 1);


	var gameRuleRightArrowCont = CGenClass.createContainer(infoContentContainer, "gameRuleRightArrowCont", true);
	var gameRuleRightArrow = CGenClass.createBitmap(gameRuleRightArrowCont, "arrow", "gameRuleRightArrow", .85);
	var gameRuleRightArrowHitArea = CGenClass.createRect(gameRuleRightArrowCont, "gameRuleRightArrowHitArea", "rgba(255, 255, 255, 1)", 1, "#000", 40, 30, false);
	gameRuleRightArrowCont.hitArea = gameRuleRightArrowHitArea;

	gameRuleRightArrowCont.rotation = -90;
	gameRuleRightArrowCont.x = 476;
	CGenClass.addMouseOverandOut(gameRuleRightArrowCont, 1.2, 1);

	gameRuleLeftArrowCont.on("click", function(){
		self.currentGameRule = (self.currentGameRule === 1) ? 4 : self.currentGameRule-1; 
		gameRule.gotoAndStop("game_rule_"+self.currentGameRule);
		console.log("left", self.currentGameRule, gameRule)
	});
	gameRuleRightArrowCont.on("click", function(){
		self.currentGameRule = (self.currentGameRule === 4) ? 1 : self.currentGameRule+1;
		gameRule.gotoAndStop("game_rule_"+self.currentGameRule);
		console.log("right", self.currentGameRule, gameRule)
	});

	console.log("infoContentContainer", infoContentContainer)
	infoContainer.on("click", function(){
		infoContentContainer.visible = true;
		createjs.Tween.get(avatarContentContainer)
			.to({x : -350, alpha : 0}, 300)
			.call(function(){
				avatarContentContainer.visible = false;
			});
		createjs.Tween.get(reportContentContainer)
			.to({x : -350, alpha : 0}, 300)
			.call(function(){
				reportContentContainer.visible = false;
			});
		createjs.Tween.get(infoContentContainer)
			.wait((avatarContentContainer.visible) ? 300 : 0)
			.to({x : 0, alpha : 1}, 300);
		self.avatarActive.visible = false;
		self.reportActive.visible = false;
		self.infoActive.visible = true;
	});

};

CanvasPanel.prototype.createHomeButtonContainer = function(panelContainer){
	var self = this;
	var homeButtonContainer = CGenClass.createContainer(panelContainer, "homeButtonContainer", true);
	homeButtonContainer.y = -660;
	homeButtonContainer.x = 610;
	var homebg = CGenClass.createRect(homeButtonContainer, "homebg", "rgba(0, 0, 0, .75)", 0, "rgba(0, 0, 0, 0)", 60, 60, true);
	var homeContainer = CGenClass.createContainer(homeButtonContainer, "homeContainer", true);
	var hitArea = CGenClass.createRect(homeContainer, "hitArea", "rgba(0, 255, 255, 1)", .5, "rgba(0, 0, 0, 1)", 100, 100, false);
	homeContainer.hitArea = hitArea;
	var homeSprite = SpriteClass.createSprite(homeContainer, SpriteClass.panelSpriteSheet, "home", "homeSprite", 1);
	// CGenClass.addMouseOverandOut(homeContainer, 1.2, 1);

	homeContainer.on("mouseover", function(e){
		if(!self.isHomeEnabled) return false;
		homeContainer.cursor = "pointer";
		createjs.Tween.get(homeContainer)
			.to({ scaleX: 1.2, scaleY: 1.2 }, 100);
	});

	homeContainer.on("mouseout", function(e){
		homeContainer.cursor = "default";
		createjs.Tween.get(homeContainer)
			.to({ scaleX: 1, scaleY: 1 }, 100);
	});

	homeContainer.on("mousedown", function(e){
		createjs.Tween.get(homeContainer)
			.to({ scaleX: 1, scaleY: 1 }, 100);
	});

	homeButtonContainer.on("click", function(){
		if(self.isHomeEnabled){
			CGenClass.pushStateHistory();
			CGenClass.checkSession(function(status){
				if(status){
					StandingClass.displayStandingPlayerList(false);
					CGameClass.displayMinMaxContainer(false);
					EmojiClass.openTauntList(false, 7);
						self.setAlert("leave game", function(option){
							if(option){
								var xmlHttp = new XMLHttpRequest();
								xmlHttp.onreadystatechange = function () {
								  	console.log("RESPONSE", xmlHttp)
								  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
								    let response = JSON.parse(xmlHttp.response)
								    if (!response.error) {
								    	socket.emit("gotolobby", tableID);
								    	window.location.replace(response.url);
								    }
								  }
								};
								xmlHttp.open("POST", wsPath+"/gotoLobby", true); // true for asynchronous 
								xmlHttp.send(null);
							}else {
								self.hideAlert();
							}
						});
				}else{
					CGenClass.displayAlert("invalid session");
				}
			});
		}
	});
	console.log("homeButtonContainer", homeButtonContainer)
};

CanvasPanel.prototype.createActionButtons = function(panelContainer){
	var self = this;
	var actionContainer = CGenClass.createContainer(panelContainer, "actionContainer", true);
	actionContainer.x = 685;
	actionContainer.y = -141;
	var rebetContainer = CGenClass.createContainer(actionContainer, "rebetContainer", true);
	self.rebetButton = SpriteClass.createSprite(rebetContainer, SpriteClass.tableSpriteSheet, "rebet", "rebetButton", 1);
	var rebetButtonAnimation = rebetContainer.addChild(new createjs.Sprite(SpriteClass.rebetBorderSpriteSheet, "run"));
	rebetButtonAnimation.name = "rebetButtonAnimation";
	rebetButtonAnimation.paused = false;
	console.log("rebetButtonAnimation", rebetButtonAnimation);
	rebetButtonAnimation.x = -4;

	rebetContainer.on("click", function(){
		if(self.enableRebet && TimerClass.tickStarted){
			CGenClass.checkSession(function(status){
				if(status){
					StandingClass.displayStandingPlayerList(false);
					CGameClass.displayMinMaxContainer(false);
					EmojiClass.openTauntList(false, 8);
					var rebetValues = null, totalRebetAmount = 0;
					if(CGameClass.isSideBetDisabled){
						var values = CGenClass.getRebetValues();
						rebetValues = values.bets;
						totalRebetAmount = values.totalRebetAmount;
					}else {
						rebetValues = CGameClass.rebetValues;
						totalRebetAmount = CGameClass.totalRebetAmount;
					}
					if(Object.values(rebetValues).length > 0){
						var rebet = {
							bets : Object.values(rebetValues),
							totalAmount : totalRebetAmount,
							pos : (CSeatClass.selectedSeat === null) ? -1 : CSeatClass.selectedSeat,
							displayname: userData.displayname,
							er : userData.exchangeRate.value,
						};
						socket.emit("rebet", rebet);
						self.updateRebetStatus(false);
						CGameClass.rebetValuesTemp = rebetValues;
						CGameClass.totalRebetTemp = totalRebetAmount;
						CGameClass.rebetValues = {};
						CGameClass.totalRebetAmount = 0;
					}
				}else{
					CGenClass.displayAlert("invalid session");
				}
			});
		}
	});

	rebetContainer.on("mouseover", function(e){
		if(!self.enableRebet) return false;
		rebetContainer.cursor = "pointer";
		createjs.Tween.get(rebetContainer)
			.to({ scaleX: 1.2, scaleY: 1.2 }, 100);
	});

	rebetContainer.on("mouseout", function(e){
		rebetContainer.cursor = "default";
		createjs.Tween.get(rebetContainer)
			.to({ scaleX: 1, scaleY: 1 }, 100);
	});

	rebetContainer.on("mousedown", function(e){
		createjs.Tween.get(rebetContainer)
			.to({ scaleX: 1, scaleY: 1 }, 100);
	});
	// CGenClass.addMouseOverandOut(rebetContainer, 1.2, 1);
	console.log("actionContainer", actionContainer);
};

CanvasPanel.prototype.closeMenu = function(){
	var self = this;
	var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
	var menuIconsContainer = panelContainer.getChildByName("menuIconsContainer");
	var menuContainer = panelContainer.getChildByName("menuContainer");
	var menuSprite = menuContainer.getChildByName("menuSprite");
	var closeSprite = menuContainer.getChildByName("closeSprite");
	self.isMenuOpen = false;
	createjs.Tween.get(menuIconsContainer)
		.to({alpha : 0, x : -670}, 200);

	createjs.Tween.get(closeSprite)
		.to({scaleY : (self.isMenuOpen) ? 1 : 0}, 100)
		.wait(20)
		.call(function(){
			createjs.Tween.get(menuSprite)
				.to({scaleY : (self.isMenuOpen) ? 0 : 1}, 100);
		});
};

CanvasPanel.prototype.openMenu = function(){
	var self = this;
	var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
	var menuIconsContainer = panelContainer.getChildByName("menuIconsContainer");
	var menuContainer = panelContainer.getChildByName("menuContainer");
	var menuSprite = menuContainer.getChildByName("menuSprite");
	var closeSprite = menuContainer.getChildByName("closeSprite");
	var panelBg = menuIconsContainer.getChildByName("panelBg");
	self.isMenuOpen = true;
	menuIconsContainer.alpha = 0;
	createjs.Tween.get(menuIconsContainer)
		.to({alpha : 1, x : -610}, 200);
	createjs.Tween.get()
		.call(function(){
			createjs.Tween.get(panelBg)
				.to({x : 610}, 200);
			createjs.Tween.get(panelBg)
				.to({alpha : 1}, 200);
		});
	createjs.Tween.get(menuSprite)
		.to({scaleY : (self.isMenuOpen) ? 0 : 1}, 100)
		.wait(20)
		.call(function(){
			createjs.Tween.get(closeSprite)
				.to({scaleY : (self.isMenuOpen) ? 1 : 0}, 100)
		});
};

CanvasPanel.prototype.updateRebetStatus = function(status){
	var self = this;
	var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
	var actionContainer = panelContainer.getChildByName("actionContainer");
	var rebetContainer = actionContainer.getChildByName("rebetContainer");
	var rebetButtonAnimation = rebetContainer.getChildByName("rebetButtonAnimation");

	self.enableRebet = status;
	self.rebetButton.color = (status) ? "#FFF" : "#1A1A1A";
	var matrix = new createjs.ColorMatrix().adjustSaturation(-100);
	if(!status){
		self.rebetButton.filters = [new createjs.ColorMatrixFilter(matrix)];
		self.rebetButton.cache(-45, -45, 90, 90);
		rebetButtonAnimation.paused = true;
		rebetButtonAnimation.visible = false;
		rebetContainer.scale = 1;
	}else {
		self.rebetButton.uncache();
		self.displayAction();
		rebetButtonAnimation.paused = false;
		rebetButtonAnimation.visible = true;
	}
	if(!self.isRebetHidden){
		self.displayAction();
	}
};

CanvasPanel.prototype.getChipList = function(stake, code, next){
	var list = [];
	var chipAmount = stake;
	do {
		var nearest = CChipsClass.allChips.reverse().find(e => e <= chipAmount);
		list.push(nearest);
		chipAmount = chipAmount - nearest;
		CChipsClass.allChips.reverse();
		if(chipAmount < 1){
			next(list, code);
		}
	} while(chipAmount > 0)
};


CanvasPanel.prototype.rebet = function(rebetDetails){
	var self = this;
	var rebetList = [];
	var count = 0;
	for(var i=0; i<rebetDetails.bets.length; i++){
		var bet = rebetDetails.bets[i];
		var index = i;
		self.getChipList(bet.stake, bet.code, function(list, code){
			count++;
			for(var j=0; j<list.length; j++){
				var jndex = j;
				var distanceY = (code.length > 3) ? 29 : (code === "TIE") ? 50 : 75;
				var distanceX = (code.length > 3) ? 70 : (code === "TIE") ? 50 : 75;
				(function(){
					rebetList.push({
						betAmount : list[jndex], 
						pos : rebetDetails.pos,
						betType : code,
						destination : {
							x : CGenClass.randomOrigin(distanceX) + CGameClass.betOrigins[code].x, 
							y: CGenClass.randomOrigin(distanceY) + CGameClass.betOrigins[code].y},
						displayname : userData.displayname,
						er : userData.exchangeRate.value,
					});
				})();
			}
			if(count === rebetDetails.bets.length){
				socket.emit("rebet chips", rebetList);
			}
		});
	}
};

CanvasPanel.prototype.disableHome = function(status){
	var self = this;
	self.isHomeEnabled = status;
	var mainContainer = CGenClass.mainContainer;
	var panelContainer = mainContainer.getChildByName("panelContainer");
	var homeButtonContainer = panelContainer.getChildByName("homeButtonContainer");
	var homeContainer = homeButtonContainer.getChildByName("homeContainer");
	var homeSprite = homeContainer.getChildByName("homeSprite");
	var matrix = new createjs.ColorMatrix().adjustBrightness(-200);
	if(!status){
		homeSprite.filters = [new createjs.ColorMatrixFilter(matrix)];
		homeSprite.cache(-30, -30, 60, 60);
	}else {
		if(homeSprite.cacheCanvas){
			homeSprite.uncache();
		}
	}
};

CanvasPanel.prototype.disableMenu = function(status){
	var self = this;
	self.isMenuEnabled = status;
	var mainContainer = CGenClass.mainContainer;
	var panelContainer = mainContainer.getChildByName("panelContainer");
	var menuContainer = panelContainer.getChildByName("menuContainer");
	var menuSprite = menuContainer.getChildByName("menuSprite");
	var matrix = new createjs.ColorMatrix().adjustBrightness(-200);
	if(!status){
		menuSprite.filters = [new createjs.ColorMatrixFilter(matrix)];
		menuContainer.scale = 1;
		menuSprite.cache(-30, -30, 60, 60);
	}else {
		if(menuSprite.cacheCanvas){
			menuSprite.uncache();
		}
	}
};

CanvasPanel.prototype.displayAction = function(){
	var self = this;
	var alertContainer = self.panelAlertContainer.getChildByName("alertContainer");
	var panelContainer = CGenClass.mainContainer.getChildByName("panelContainer");
	var actionContainer = panelContainer.getChildByName("actionContainer");
	var actionX = (self.isRebetHidden && !self.enableRebet) ? 685 : 585;
	actionX = (self.isMenuOpen) ? 685 : actionX;
	actionX = (self.isAlertVisible) ? 685 : actionX;

	createjs.Tween.get(actionContainer)
		.to({x : actionX}, 300);
};

CanvasPanel.prototype.clearPanel = function(){
	this.balance = 0;
	this.totalWin = 0;
	this.totalBet = 0;
	this.balanceValue = null;
	this.totalWinValue = null;
	this.totalBetValue = null;
	this.isMenuOpen = false;
	this.isHomeEnabled = true;
	this.isMenuEnabled = true;
	this.panelAlertContainer = null;
	this.panelPopupContainer = null;
	this.infoActive = null;
	this.avatarActive = null;
	this.enableRebet = false;
	this.rebetButton = null;
	this.isRebetHidden = true;
	this.currentGameRule = 1;
	this.splitUrl = window.location.host.split('.');
	this.fullScreenSprite = null;
	this.minimizeSprite = null;
	this.footerBgContainer = null;
};
var CanvasPanelClass = new CanvasPanel();
