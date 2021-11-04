(function(){
/* Prevent HTML Zoom */
	var isCtrlHold = false;
	document.addEventListener('keydown', function(event){
		var event = event || window.event;
		var keycode = event.which || event.keyCode;
		if (keycode == 17) {
			isCtrlHold = true;
		}

		/* ctrl + decrement */
		if (isCtrlHold && event.which == 109 || isCtrlHold && event.which == 189) {
			event.preventDefault(); //prevent browser from the default behavior
			event.stopPropagation();
		}
		/* ctrl + increment */
		if (isCtrlHold && event.which == 107 || isCtrlHold && event.which == 187) {
			event.preventDefault(); //prevent browser from the default behavior
			event.stopPropagation();
		}
	});

	document.addEventListener('keyup', function(event){
		console.log("KEYUP", event)
		if(event.keyCode === 17){
			isCtrlHold = false;
		}
	});

	document.addEventListener('wheel', function(event) {
		if(isCtrlHold){
			event.preventDefault();
			event.stopPropagation();
		}
	}, {
		passive: false // Add this
	});


	/* prevention zoom in/out but have bug in scrool + pinch */
	document.addEventListener('gesturestart', function(event) {
		if(isCtrlHold){
			event.preventDefault();
			event.stopPropagation();
		}
	}, {
		passive: false // Add this
	});
	////zooom end
class Socket {
  constructor() {
    this.config = {
      'reconnection': true,
      'reconnectionDelay': 5000,
      'reconnectionDelayMax ': Infinity,
      'secure': true,
      'autoConnect': true,
      'path': wsPath + '/socket.io',
      'transports': ['websocket'],
      'query': {}
    }
    this.host = location.host;
    console.log("wsPath >>>>>>>>>", wsPath);
    this.socket = io(this.host, this.config);
    this.socketHandler('table');
  }

  on(eventName, next) {
    this.socket.on(eventName, function() {
      var args = arguments;
      next.apply(this.socket, args);
    });
  }
  emit(eventName, data) {
    this.socket.emit(eventName, data);
  }
  setHost(host) {
    this.host = host;
  }

  socketHandler(name) {
    const maxAttempts = 2;
    var self = this;
    this.socket.on('connect', (gameResults) => {
      console.log(`### [${name}_socket] #### connect`);
    });

    this.socket.on('reconnect', () => {
      console.log(`### [${name}_socket] #### reconnect`);
      CGameClass.restartGame(function(){
        // socket.emit("join room");
        
      });
      // socket.emit('window visibility', true);
    });

    this.socket.on('connecting', () => {
      console.log(`### [${name}_socket] #### connecting`);
    });

    this.socket.on('reconnecting', (numberAttemps) => {
      console.log(`### [${name}_socket] #### reconnecting`);
      if (numberAttemps >= maxAttempts) {
        // console.log('Reached maximum number of attempts');
      }
    });

    // on reconnection, reset the transports option, as the Websocket
    // connection may have failed (caused by proxy, firewall, browser, ...)
    this.socket.on('reconnect_attempt', () => {
      console.log(`### [${name}_socket] #### reconnect attempt`);
      socket.socket.io.opts.transports = ['websocket'];
    });

    this.socket.on('connect_failed', () => {
      console.log(`### [${name}_socket] #### connect_failed`);
    });

    this.socket.on('connect_error', () => {
      console.log(`### [${name}_socket] #### connect_error`);
    });

    this.socket.on('error', (data) => {
      console.log(`### [${name}_socket] #### error`, data);
      // self.socket.reconnect();
      self.socketHandler('table');
    });

    this.socket.on('reconnect_failed', () => {
      console.log(`### [${name}_socket] #### reconnect_failed`);
    });

    this.socket.on('close', () => {
      console.log(`### [${name}_socket] #### close`);
    });

    this.socket.on('accessDenied', () => {
      console.log(`### [${name}_socket] #### accessDenied`);
    });

    this.socket.on('disconnected', () => {
      console.log(`### [${name}_socket] #### disconnected`);
      CGameClass.removeTickers();
    });

    this.socket.on('disconnect', () => {
      console.log(`### [${name}_socket] #### disconnect`);
      CGameClass.removeTickers();
    });
  }
}



var socket = new Socket();

socket.on("shuffle cards", function(){
	CGameClass.cleanCanvas();
	RoadMapClass.cleanRoadMap();
	CGameClass.animateShuffle();
  CanvasPanelClass.disableHome(true);
  CGameClass.disableSideBetContainer({counter : 0});
});

socket.on("first card", function (card) {
  CGameClass.burnCard(card);
});

socket.on("bet tick", function (tick) {
  if(!LoadingClass.isBettingOpen) return false;
  // LoadingClass.checkBetTick(tick);
  TimerClass.setTimer(tick);
});

socket.on("animate bet chips", function (betDetails) {
  if(!LoadingClass.isBettingOpen) return false;
  // PlayerClass.storeBets(betDetails);
  CGameClass.animateBet(betDetails);
});

socket.on("draw card", function (drawCard) {
  if(!LoadingClass.isBettingOpen) return false;
  CGameClass.drawCard(drawCard);
});

socket.on("start new round", function () {
  CGameClass.hideWaitForNextRoundContainer();
  CGameClass.cleanCanvas();
  LoadingClass.isBettingOpen = true;
  socket.emit("rebet status");
  CanvasPanelClass.disableHome(true);
  CanvasPanelClass.disableMenu(true);
  CanvasPanelClass.enableRebet = (Object.values(CGameClass.rebetValues).length > 0) ? true : false;
  CanvasPanelClass.isRebetHidden = (Object.values(CGameClass.rebetValues).length > 0) ? false : CanvasPanelClass.isRebetHidden;
  console.log("self.rebetValues enable", CanvasPanelClass.enableRebet);
  // LoadingClass.checkNewRound();
  // CGameClass.animateShuffle();
});

socket.on("round result", function (result) {
  if(!LoadingClass.isBettingOpen) return false;
  CGameClass.evaluateResult(result);
  socket.emit("get my result");
  CGameClass.setTotalRound();
});

socket.on("get my balance", function(bal){
  console.log("BAAAAAAL GET MY BALANCE SOCKET", bal)
  CGenClass.balanceFromSocket = bal;
  LoadingClass.loadItems("get my balance");
  var betCredit = document.getElementById("bet_credit");
  bal = bal.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  if(betCredit) betCredit.innerHTML = (Number(bal)> 0) ? Number(bal).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : Number(bal);
  if (LoadingClass.loadComplete) CGenClass.delayBalanceUpdate = false;
  
	setTimeout(function(){
		var newBalance = bal;
    CGameClass.balanceTemp = bal;
		CGenClass.animateBalance(CanvasPanelClass.balance, newBalance, function(playerBalanceDisplay, balance){
			CanvasPanelClass.balance = newBalance;
			var display = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
			CanvasPanelClass.balanceValue.text = (playerBalanceDisplay) ? playerBalanceDisplay : 0;
		});
	}, (CanvasPanelClass.balance < 1) ? 0 : 100);
});

socket.on("player sit", function (details) {
  CSeatClass.playerSit(details);
});

socket.on("table limit", function (details) {
  LoadingClass.loadItems("table limit");
  CGameClass.setTableDetails(details);
  CChipsClass.init();
  SoundClass.playIntro();
});

socket.on("get my result", function (details) {
  if(!LoadingClass.isBettingOpen) return false;
  if (details) CanvasPanelClass.setTotalWin(details);
});

socket.on("my position", function (pos) {
  if (pos > -1) {
    CSeatClass.selectedSeat = pos;
    // CSeatClass.playerSit({pos: pos});
  }
});

socket.on("player list", function (players) {
  if(!CSeatClass.isSeatDisable){
    CSeatClass.supplySeats(players);
  }else CSeatClass.supplySeatsAfterTimer(players);
  PlayerClass.updatePlayers(players);
  PlayerClass.updateStandingPlayers(players);
  CGameClass.updateTableName();
});

socket.on("road map", function(roadmaps){
	RoadMapClass.loadRoadMaps(roadmaps.roadmap);
	RoadMapClass.updateRoadmapCount(roadmaps.roadmapResult);
});

socket.on('table close', function () {
  CanvasPanelClass.setAlert("table close", function(option){
	  if(option){
      var func = ErrorClass[ErrorClass.list["table close"].action];
      func();
    }
	CanvasPanelClass.hideAlert();
  });
});

socket.on("rebet", function(rebetDetails){
	CanvasPanelClass.rebet(rebetDetails);
});

socket.on("rebet chips", function (betDetails) {
	var index = 0;
	if (betDetails.length > 0) {
		for (var i = 0, len = betDetails.length; i < len; i++) {
			index = i;
			CGameClass.animateRebet(betDetails[index], index);
		}
	}

});

socket.on("rebet status", function(status){
  var timer = setInterval(function () {
    if(TimerClass.tickStarted){
      if(status){
        if(Object.values(CGameClass.rebetValues).length > 0){
          CGameClass.rebetValuesTemp = {};
          CGameClass.totalRebetTemp = null;
          var stat = (CGameClass.checkRebetValues()) ? false : status;
          CanvasPanelClass.updateRebetStatus(stat);
        }else{
          if(Object.values(CGameClass.rebetValuesTemp).length > 0){
            CGameClass.rebetValues = CGameClass.rebetValuesTemp;
            CGameClass.totalRebetAmount = CGameClass.totalRebetTemp;
            CGameClass.rebetValuesTemp = {};
            CGameClass.totalRebetTemp = null;
            var stat = (CGameClass.checkRebetValues()) ? false : status;
            CanvasPanelClass.updateRebetStatus(stat);
          }
        }
      }else{
        CanvasPanelClass.updateRebetStatus(status);
      }

      clearInterval(timer);
    }
  }, 100);
});

socket.on("my bets", function(bets){
	if(bets){
		CGameClass.haveBet = true;
		CanvasPanelClass.disableHome(false);
    // CanvasPanelClass.disableMenu(false);
    CanvasPanelClass.isRebetHidden = false;
    CanvasPanelClass.updateRebetStatus(false);
	}
});

socket.on("table chips", function(bets){
  CGameClass.reconstructGame(bets);
});

socket.on("server error", function(code){
  var errcode = code.toString();
  var error = ErrorClass.list[errcode];
  errcode = (!errcode) ? "default error" : errcode;
    CanvasPanelClass.setAlert(errcode, function(option){
      if(option){
        var action = ErrorClass.list[errcode].action;
        if(CGenClass.isSBO && action === "windowClose" && CGenClass.isMobile){
          action = "gotoLogin";
        }
        var func = ErrorClass[action];
        func();
      }
    CanvasPanelClass.hideAlert();
    });
});

socket.on("game error", function(code){
  var errcode = code.toString();
  var error = ErrorClass.list[errcode];
  errcode = (!errcode) ? "default error" : errcode;
  CanvasPanelClass.setAlert(errcode, function(option){
    if(option){
      var action = ErrorClass.list[errcode].action;
      if(CGenClass.isSBO && action === "windowClose" && CGenClass.isMobile){
        action = "gotoLogin";
      }
      var func = ErrorClass[action];
      func();
    }
  CanvasPanelClass.hideAlert();
  });
});

socket.on("game error notif", function(code){
  if(!code){
    CGameClass.canBet = true;
  }else if(code === "max limit"){
    console.log("MIN MAX CODE", code)
    var max = CGameClass.tableDetails[CGameClass.currentBetType.tableLimit+"Max"];
    var totalBetsContainer = CGameClass.gameContainer.getChildByName("totalBetsContainer");
    var totalBetContainer = totalBetsContainer.getChildByName("totalBetContainer-"+CGameClass.currentBetType.betType);
    var betValue = totalBetContainer.getChildByName("betValue");
    var removedComma = (typeof(betValue.text) === 'number') ? betValue.text : betValue.text.replace(/\,/g,'');
    var totalBet = Number(removedComma);
    var diff = max - totalBet;
    if(diff > 0){
      CanvasPanelClass.setAlert(code, function(option){
        CGameClass.canBet = true;
        console.log("MIN MAX CODE", code, option, ErrorClass.list[code].action)
        if(option){
          var action = ErrorClass.list[code].action;
          var func = ErrorClass[action];
          func();
        }
        CanvasPanelClass.hideAlert();
      });
    }else {
      CGameClass.setNotif(ErrorClass.notifs[code]);
      CGameClass.canBet = true;
    }
  }else if(code === "min limit"){
    console.log("MIN MAX CODE", code)
      CanvasPanelClass.setAlert(code, function(option){
        CGameClass.canBet = true;
        console.log("MIN MAX CODE", code, option, ErrorClass.list[code].action)
        if(option){
          var action = ErrorClass.list[code].action;
          var func = ErrorClass[action];
          func();
        }
        CanvasPanelClass.hideAlert();
      });
  }else {
    CGameClass.setNotif(ErrorClass.notifs[code]);
    CGameClass.canBet = true;
    CGameClass.rebetValues = CGameClass.rebetValuesTemp;
    CGameClass.totalRebetAmount = CGameClass.totalRebetTemp;
    CGameClass.rebetValuesTemp = {};
    CGameClass.totalRebetTemp = null;
  }
});

socket.on("new game round", function(data){
  CGameClass.updateGameRoundID(data);
  CGameClass.disableSideBetContainer(data);
  socket.emit('check state');
  CGameClass.isBetHereVisible = (CGameClass.haveBet || CGameClass.numOfRounds>1) ? false : true;
  CGameClass.canBet = true;
  console.log("isBetHereVisible", CGameClass.isBetHereVisible, CGameClass.numOfRounds)
});

socket.on("player taunt", function(data){
  if(!LoadingClass.isBettingOpen) return false;
  EmojiClass.displayTaunt(data);
});

socket.on("bet success", function(data){
  if(!LoadingClass.isBettingOpen) return false;
    CanvasPanelClass.setAlert("bet success", function(option){
      if(option){
        var func = ErrorClass[ErrorClass.list["bet success"].action];
        func();
      }
      CanvasPanelClass.hideAlert();
    }, data);

    setTimeout(function(){
      if(CanvasPanelClass.currentErrorCode === "bet success"){
        CanvasPanelClass.hideAlert();
      }
    }, 2000);
});

socket.on('playerbet history', function(data){
  PlayerReportClass.reports = data;
  PlayerReportClass.createReportList();
});

socket.on('table state', function(data){
  if(CGenClass.tableState === null){
    CGenClass.tableState = data;
    LoadingClass.checkState(data);
  }else if(CGenClass.tableState.state === 0){
     CGameClass.hideWaitForNextRoundContainer();
  }
  
  CGameClass.tableInfo = data;
  CGameClass.updateTableName();
});

socket.on('table limit closed', function(data){
  CGenClass.tableLimitClosed(data);
});

socket.on('update table limit', function(){
  socket.emit('table limit');
});
var Translation = function(){
	this.lang = userData.lang;
	this.constantLanguages = [
		{
			id: "en",
			alias: ["en"],
			name: "English",
		},
		{
			id: "zh-cn",
			alias: ["zh", "zh-cn"],
			name: "Simplified Chinese",
		},
		{
			id: "zh-tw",
			alias: ["zh-tw"],
			name: "Traditional Chinese",
		},
		{
			id: "id",
			alias: ["id", "id-id"],
			name: "Bahasa Indonesia",
		},
		{
			id: "vi",
			alias: ["vi", "vi-vn"],
			name: "Vietnamese",
		},
		{
			id: "th",
			alias: ["th", "th-th"],
			name: "Thai",
		},
	];
	this.translationList = {
		currentAvatar : {"en" : "CURRENT AVATAR", "zh-cn" : "CURRENT AVATAR", "zh-tw" : "CURRENT AVATAR", "id" : "CURRENT AVATAR", "vi" : "CURRENT AVATAR", "th" : "CURRENT AVATAR"},
		Confirm : {"en" : "Confirm", "zh-cn" : "Confirm", "zh-tw" : "Confirm", "id" : "Confirm", "vi" : "Confirm", "th" : "Confirm"},
		Okay : {"en" : "Okay", "zh-cn" : "Okay", "zh-tw" : "Okay", "id" : "Okay", "vi" : "Okay", "th" : "Okay"},
		Cancel : {"en" : "Cancel", "zh-cn" : "Cancel", "zh-tw" : "Cancel", "id" : "Cancel", "vi" : "Cancel", "th" : "Cancel"},
		allSideBets : {"en" : "All side bets lose on 7", "zh-cn" : "All side bets lose on 7", "zh-tw" : "All side bets lose on 7", "id" : "All side bets lose on 7", "vi" : "All side bets lose on 7", "th" : "All side bets lose on 7"},
		Dragon : {"en" : "D R A G O N", "zh-cn" : "D R A G O N", "zh-tw" : "D R A G O N", "id" : "D R A G O N", "vi" : "D R A G O N", "th" : "D R A G O N"},
		Tiger : {"en" : "T I G E R", "zh-cn" : "T I G E R", "zh-tw" : "T I G E R", "id" : "T I G E R", "vi" : "T I G E R", "th" : "T I G E R"},
		Tie : {"en" : "T I E", "zh-cn" : "T I E", "zh-tw" : "T I E", "id" : "T I E", "vi" : "T I E", "th" : "T I E"},
		Big : {"en" : "Big", "zh-cn" : "Big", "zh-tw" : "Big", "id" : "Big", "vi" : "Big", "th" : "Big"},
		Small : {"en" : "Small", "zh-cn" : "Small", "zh-tw" : "Small", "id" : "Small", "vi" : "Small", "th" : "Small"},
		Red : {"en" : "Red", "zh-cn" : "Red", "zh-tw" : "Red", "id" : "Red", "vi" : "Red", "th" : "Red"},
		Black : {"en" : "Black", "zh-cn" : "Black", "zh-tw" : "Black", "id" : "Black", "vi" : "Black", "th" : "Black"},
		tapToPlaceBet : {"en" : "Tap to place bet", "zh-cn" : "Tap to place bet", "zh-tw" : "Tap to place bet", "id" : "Tap to place bet", "vi" : "Tap to place bet", "th" : "Tap to place bet"},
		gameRound : {"en" : "GAME ROUND", "zh-cn" : "GAME ROUND", "zh-tw" : "GAME ROUND", "id" : "GAME ROUND", "vi" : "GAME ROUND", "th" : "GAME ROUND"},
		bettingOpen : {"en" : "BETTING OPEN", "zh-cn" : "BETTING OPEN", "zh-tw" : "BETTING OPEN", "id" : "BETTING OPEN", "vi" : "BETTING OPEN", "th" : "BETTING OPEN"},
		balance : {"en" : "BALANCE", "zh-cn" : "BALANCE", "zh-tw" : "BALANCE", "id" : "BALANCE", "vi" : "BALANCE", "th" : "BALANCE"},
		totalWin : {"en" : "TOTAL WIN", "zh-cn" : "TOTAL WIN", "zh-tw" : "TOTAL WIN", "id" : "TOTAL WIN", "vi" : "TOTAL WIN", "th" : "TOTAL WIN"},
		totalBet : {"en" : "TOTAL BET", "zh-cn" : "TOTAL BET", "zh-tw" : "TOTAL BET", "id" : "TOTAL BET", "vi" : "TOTAL BET", "th" : "TOTAL BET"},
		avatarSelection : {"en" : "AVATAR SELECTION", "zh-cn" : "AVATAR SELECTION", "zh-tw" : "AVATAR SELECTION", "id" : "AVATAR SELECTION", "vi" : "AVATAR SELECTION", "th" : "AVATAR SELECTION"},
		sitHere : {"en" : "S I T  H E R E", "zh-cn" : "S I T  H E R E", "zh-tw" : "S I T  H E R E", "id" : "S I T  H E R E", "vi" : "S I T  H E R E", "th" : "S I T  H E R E"},
		standingPlayer : {"en" : "STANDING PLAYER", "zh-cn" : "STANDING PLAYER", "zh-tw" : "STANDING PLAYER", "id" : "STANDING PLAYER", "vi" : "STANDING PLAYER", "th" : "STANDING PLAYER"},
		taunts : {"en" : "TAUNTS", "zh-cn" : "TAUNTS", "zh-tw" : "TAUNTS", "id" : "TAUNTS", "vi" : "TAUNTS", "th" : "TAUNTS"},
		loading : {"en" : "L O A D I N G", "zh-cn" : "L O A D I N G", "zh-tw" : "L O A D I N G", "id" : "L O A D I N G", "vi" : "L O A D I N G", "th" : "L O A D I N G"},
		beadRoad : {"en" : "BEAD ROAD", "zh-cn" : "BEAD ROAD", "zh-tw" : "BEAD ROAD", "id" : "BEAD ROAD", "vi" : "BEAD ROAD", "th" : "BEAD ROAD"},
		bigRoad : {"en" : "BIG ROAD", "zh-cn" : "BIG ROAD", "zh-tw" : "BIG ROAD", "id" : "BIG ROAD", "vi" : "BIG ROAD", "th" : "BIG ROAD"},
		bigEyeRoad : {"en" : "BIG EYE ROAD", "zh-cn" : "BIG EYE ROAD", "zh-tw" : "BIG EYE ROAD", "id" : "BIG EYE ROAD", "vi" : "BIG EYE ROAD", "th" : "BIG EYE ROAD"},
		smallRoad : {"en" : "SMALL ROAD", "zh-cn" : "SMALL ROAD", "zh-tw" : "SMALL ROAD", "id" : "SMALL ROAD", "vi" : "SMALL ROAD", "th" : "SMALL ROAD"},
		cockroachRoad : {"en" : "COCKROACH ROAD", "zh-cn" : "COCKROACH ROAD", "zh-tw" : "COCKROACH ROAD", "id" : "COCKROACH ROAD", "vi" : "COCKROACH ROAD", "th" : "COCKROACH ROAD"},
	};
	this.langId = this.getLangID(userData.lang);
};

Translation.prototype.getLangID = function(lang){
	var self = this;
	var id = "en";

	for(var i=0; i<self.constantLanguages.length; i++){
		// self.betOption.findIndex(x => x.code === betType);
		var language = self.constantLanguages[i];
		var index = language.alias.findIndex(x => x === lang);
		if(index > -1){
			id = language.id;
		}
	}
	console.log("LANGUAGE ID", id);
	return id;
};

Translation.prototype.getTranslation = function(trans){
	var self = this;
	var translated = null;
	translated = self.translationList[trans][self.langId];
	return translated;
};

var TranslationClass = new Translation();

var Error = function(){
	this.acceptLowerBet = true;
	this.goto404 = function(){
		// window.location = wsPath+"/404";
		window.location.replace(window.location.origin+wsPath+"/404");
	};
	this.goto405 = function(){
		// window.location = wsPath+"/405";
		window.location.replace(window.location.origin+wsPath+"/405");
	};
	this.gotoLobby = function(){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function () {
		  	console.log("RESPONSE", xmlHttp)
		  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
		    let response = JSON.parse(xmlHttp.response)
		    if (!response.error) {
		    	socket.emit("gotolobby", tableID);
		    	// window.location = response.url;
		    	window.location.replace(response.url);
		    }
		  }
		};
		xmlHttp.open("POST", wsPath+"/gotoLobby", true); // true for asynchronous 
		xmlHttp.send(null);
	};
	this.windowClose = function(){
		window.close();
	};
	this.standPlayer = function(){
		CSeatClass.removeFromSeat();
		CanvasPanelClass.hideAlert();
	};
	this.popupClose = function(){
		CanvasPanelClass.hideAlert();
	};
	this.gotoLogin = function(){
		// window.location = userData.loginUrl;
		window.location.replace(userData.loginUrl);	
	};
	this.gotoBlankPage = function(){

	};
	this.lowerBet = function(){
		console.log("MIN MAX ALERT lowerBet")
		var max = CGameClass.tableDetails[CGameClass.currentBetType.tableLimit+"Max"];
		var totalBetsContainer = CGameClass.gameContainer.getChildByName("totalBetsContainer");
		var totalBetContainer = totalBetsContainer.getChildByName("totalBetContainer-"+CGameClass.currentBetType.betType);
		var betValue = totalBetContainer.getChildByName("betValue");
		var removedComma = (typeof(betValue.text) === 'number') ? betValue.text : betValue.text.replace(/\,/g,'');
		var totalBet = Number(removedComma);
		var diff = max - totalBet;
		var betList = [];
		console.log("MIN MAX ALERT lowerBet ---", max, totalBet, diff, CGameClass.currentBetType.betType)
		if(diff > 0){
			CanvasPanelClass.getChipList(diff, CGameClass.currentBetType.betType, function(list, code){
				var count = 0;
				for(var j=0; j<list.length; j++){
					count = count + 1;
					var betType = code[0] + code[1] + code[2];
					var sideBet = (code.length > 3) ? code[3] + code[4] + code[5] : null;
					CGameClass.sendBet(betType, sideBet, false, CGameClass.currentBetType.tableLimit, list[j]);
				}
			});
		}
	};
	this.topUp = function(){
		console.log("MIN MAX ALERT topUp")
		var min = CGameClass.tableDetails[CGameClass.currentBetType.tableLimit+"Min"];
		var code = CGameClass.currentBetType.betType;
		var betType = code[0] + code[1] + code[2];
		var sideBet = (code.length > 3) ? code[3] + code[4] + code[5] : null;
		CGameClass.sendBet(betType, sideBet, false, CGameClass.currentBetType.tableLimit, min);
	};
	this.list = {
		"invalid session" : {
			message : "Your session has been expired. Please re-login to play again.",
			title : "Session Expired",
			titleColor : "#FFF",
			button : 1, //1 for ok and 2 for cancel, 3 for both button and 0 for no button
			action : "windowClose",
			pos : -10,
		},
		"leave game" : {
			message : "Do you want to exit the game?",
			title : "Leaving the game",
			titleColor : "#FFF",
			button : 3,
			action : "gotoLobby",
			pos : -10,
		},
		"stand player" : {
			message : "You've been removed from your seat for idling 3 consecutive rounds.",
			title : "Stand",
			titleColor : "#FFF",
			button : 0,
			action : "standPlayer",
			pos : 10,
		},
		"kick player" : {
			message : "You've been kicked from the game for idling 5 consecutive rounds.",
			title : "Player Kicked",
			titleColor : "#FFF",
			button : 1,
			action : "gotoLobby",
			pos : -10,
		},
		"table close" : {
			message : "This table was closed. Please enter another table.",
			title : "Table Closed",
			titleColor : "#FFF",
			button : 1,
			action : "gotoLobby",
			pos : -10,
		},
		"multiple window" : {
			message : "Multi window detected.",
			title : "Problem Occured",
			titleColor : "#FFF",
			button : 1,
			action : "goto405",
			pos : -10,
		},
		"table limit close" : {
			message : "The table limit was closed. Please choose another table limit.",
			title : "Table Limit Closed",
			titleColor : "#FFF",
			button : 1,
			action : "gotoLobby",
			pos : -10,
		},
		"all table limit close" : {
			message : "All table limits were closed. Game will now close.",
			title : "Table Limit Closed",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"player booted" : {
			message : "Your account has been booted by the system. Please try again later or contact our customer support.",
			title : "Session Expired",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"account suspended" : {
			message : "Your account has a problem. Please contact our customer support.",
			title : "",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"account closed" : {
			message : "Your account has a problem. Please contact our customer support.",
			title : "",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"bet failed" : {
			message : "Sorry there is an error. Please try again.",
			title : "TRANSACTION FAILED",
			titleColor : "#D60000",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"bet success" : {
			message : "Ref no.: ",
			title : "BET ACCEPTED",
			titleColor : "#51FD42",
			button : 0,
			action : "popupClose",
			pos : 50,
		},
		"no internet" : {
			message : "No Internet Connection",
			title : " ",
			titleColor : "#51FD42",
			button : 0,
			action : "gotoBlankPage",
			pos : 0,
		},
		"400" : {
			message : "Sorry there is an error. Please try again.", //invalid input
			title : "Problem Occured",
			titleColor : "#FFF",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"401" : {
			message : "Player is not logged in.", //player is not logged in
			title : "Problem Occured",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"402" : {
			message : "Not enough balance.",
			title : "Insufficient Balance",
			titleColor : "#FFF",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"403" : {
			message : "Bet already exist. Please try again.",
			title : "Problem Occured",
			titleColor : "#FFF",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"404" : {
			message : "Bet was not found. Please try again.",
			title : "Problem Occured",
			titleColor : "#FFF",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"405" : {
			message : "API suspended. Please try again.",
			title : "Problem Occured", //api suspended
			titleColor : "#FFF",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"406" : {
			message : "Over the max winning. Please try again.",
			title : "Problem Occured", //over the max winning
			titleColor : "#FFF",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"407" : {
			message : "Over the max loss. Please try again.", //over the max loss
			title : "Problem Occured", 
			titleColor : "#FFF",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"409" : {
			message : "Sorry there is an error. Please try again.", //bet was already settled
			title : "Problem Occured",
			titleColor : "#FFF",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"410" : {
			message : "Sorry there is an error. Please try again.", //bet was already cancelled
			title : "Problem Occured",
			titleColor : "#FFF",
			button : 1,
			action : "popupClose",
			pos : -10,
		},
		"411" : {
			message : "Your account has been suspended. Please contact our customer support.",
			title : "Account Suspended",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"412" : {
			message : "Your account has been closed. Please contact our customer support.",
			title : "Account Closed",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"413" : {
			message : "There is a problem with your bet. Please contact our customer support.", //bet was already cancelled
			title : "Betting Budget Exceeded",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"1" : {
			message : "Sorry there is an error. Please try again.",
			title : "Internal Error",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"side bet alert" : {
			message : "Side Bets are only available for the first 50 rounds.",
			title : "",
			titleColor : "#51FD42",
			button : 0,
			action : "popupClose",
			pos : 0,
		},
		"default error" : {
			message : "Sorry there is an error. Please try again.", //default
			title : "Problem Occured",
			titleColor : "#FFF",
			button : 1,
			action : "windowClose",
			pos : -10,
		},
		"max limit" : {
			message : "Your bet is higher than the maximum bet.", //default
			title : "",
			titleColor : "#FFF",
			button : 4,
			action : "lowerBet",
			pos : -10,
		},
		"min limit" : {
			message : "Your bet is lower than the minimum bet.", //default
			title : "",
			titleColor : "#FFF",
			button : 5,
			action : "topUp",
			pos : -10,
		}
	};
	this.notifs = {
		"max limit" : {
			label : "Your bet has reached the maximum limit"
		},
		"min limit" : {
			label : "Your bet is lower than the minimum limit"
		},
		"bet failed" : {
			label : "Betting failed"
		},
		"insufficient balance" : {
			label : "Insufficient Balance"
		},
	};
};


var ErrorClass = new Error();
var Timer = function(){
	this.time = 0;
	this.timerLabel = null;
	this.tickStarted = false;

	this.isShaking = false;
	this.isRotating = false;
	this.timerval = {};

	this.isTickAdded = false;
	this.tickListener = null;
	this.isStartedWithMax = null;

	this.rebetStatusChanged = false;

	this.waitTimer = null;
};

Timer.prototype.createTimerContainer = function(next){
	var self = this;
	var tableContainer = CGameClass.gameContainer.getChildByName("tableContainer");
	var timerContainer = CGenClass.createContainer(tableContainer, "timerContainer", true);
	timerContainer.y = -118;
	timerContainer.scale = 1;
	timerContainer.alpha = 0;

	var outSideinnerCircle = timerContainer.addChild(new createjs.Shape());
	outSideinnerCircle.graphics
		.setStrokeStyle(2)
		.beginLinearGradientStroke(["#FFF","#8F8F8F"], [0, 1], 0, 20, 0, 60)
		.beginFill("#000")
		.drawCircle(0, 0, 56)
	outSideinnerCircle.name = "outSideinnerCircle";
	outSideinnerCircle.shadow = new createjs.Shadow("rgba(0, 0, 0, .6)", 0, 6, 9);

	// var timerBg = CGenClass.createBitmap(timerContainer, "timerbg", "timerBg", 1);
	var timerBg = SpriteClass.createSprite(timerContainer, SpriteClass.tableSpriteSheet, "timerbg", "timerBg", 1);
	timerBg.mask = outSideinnerCircle;
	timerBg.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 12);

	var innerSideCircle = timerContainer.addChild(new createjs.Shape());
	innerSideCircle.graphics
		.beginRadialGradientFill(["#111111", "#111111"], [0, 1], 0, 0, 10, 0, 0, 55)
		.moveTo(0, 0)
		.arc(0, 0, 55, 0, 0)
	innerSideCircle.name = "innerSideCircle";

	var innerTimerCircle = timerContainer.addChild(new createjs.Shape());
	innerTimerCircle.graphics
		.setStrokeStyle(2)
		.beginStroke("rgba(105, 110, 105, .2)")
		.beginFill("#000")
		.drawCircle(0, 0, 48)
	innerTimerCircle.name = "innerTimerCircle";

	var gradient = timerContainer.addChild(new createjs.Shape());
		gradient.graphics
			.setStrokeStyle(0).beginStroke("rgba(0,0,0,0)")
			.beginLinearGradientFill(["rgba(0,0,0,0)","rgba(196,196,196,.4)","rgba(0,0,0,0)"], [0, 1, 1], 0, 0, 0, 45)
			.drawCircle(0, 0, 45)
	gradient.name = "gradient";
	gradient.scaleY = -1;

	var crcl = timerContainer.addChild(new createjs.Shape());
	crcl.graphics
		.beginFill("#03fe00")
		.drawCircle(0, -52, 4);
	crcl.name = "mainCircle";

	this.timerLabel = CGenClass.createText(timerContainer, "timerLabel", "center", "middle", "#03fe00", "900 50px Lato", null);
	this.timerLabel.shadow = new createjs.Shadow("#03fe00", 0, 0, 15);

	console.log("timerContainer", timerContainer);
	next();
};

Timer.prototype.setWaitTimer = function(tick){
	console.log("WAIT TIMER", tick)
	this.timerval = tick;
	this.timerLabel.text = tick.curr;
	this.tickStarted = (tick.curr === 0) ? false : true;
	var tableContainer = CGameClass.gameContainer.getChildByName("tableContainer");
	var timerContainer = tableContainer.getChildByName("timerContainer");
	createjs.Tween.get(timerContainer)
		.to({alpha : (tick.curr === 0) ? 0 : 1}, (tick.curr === 0) ? 0 : 300);
	this.startTimer(tick);
	if(tick.curr === 0){
		clearInterval(TimerClass.waitTimer);
		createjs.Tween.get(TimerClass.timerLabel, {loop : false, override:true})
			.to({rotation : 0}, 80);
		TimerClass.clearTicker();
	}

};

Timer.prototype.setTimer = function(tick){
	var self = this;
	this.timerval = tick;
	this.timerLabel.text = tick.curr;
	if(tick.curr === tick.max) SoundClass.playAudio("place_your_bets");
	this.tickStarted = (tick.curr === 0) ? false : true;
	this.startTimer(tick);
	var tableContainer = CGameClass.gameContainer.getChildByName("tableContainer");
	var timerContainer = tableContainer.getChildByName("timerContainer");
	if(self.isStartedWithMax === null){
		self.isStartedWithMax = (tick.curr === tick.max) ? true : false;
		CGameClass.animateBetHere((CGameClass.isPlaceBetInfoVisible) ? false : CGameClass.isBetHereVisible);
	}
	if(tick.curr === 0){
		CChipsClass.disableChips();
		CanvasPanelClass.hideMenu();
		CanvasPanelClass.updateRebetStatus(false);
		if(CGameClass.haveBet){
			CanvasPanelClass.disableHome(false);
		}
		CanvasPanelClass.disableMenu(false);
		setTimeout(function(){
			createjs.Ticker.off("tick", self.tickListener);
			self.isStartedWithMax = null;
			CanvasPanelClass.hideMenu();
			CanvasPanelClass.disableMenu(false);
		}, 1000);
		setTimeout(function(){
			createjs.Tween.get(timerContainer)
			.to({alpha : 0}, 300);
			CanvasPanelClass.hideMenu();
			CanvasPanelClass.disableMenu(false);
		}, 200);
		setTimeout(function() {
			CanvasPanelClass.hideMenu();
			CanvasPanelClass.disableMenu(false);
		}, 500);
		CGameClass.bettingStatDisplay(false);
		CGameClass.displayMinMaxContainer(false);
		EmojiClass.openTauntList(false, 9);
		StandingClass.displayStandingPlayerList(false);

		if(CGenClass.alertCanvas.style.display === "block"){
			if(CanvasPanelClass.currentErrorCode === "max limit" || CanvasPanelClass.currentErrorCode === "min limit"){
				CanvasPanelClass.hideAlert();
				CGameClass.canBet = true;
			}
		}
		
		self.rebetStatusChanged = false;
	}else {
		if(tick.curr === 1){
			setTimeout(function(){
				CSeatClass.disableSeat(true);
			}, 920);
		}
		createjs.Tween.get(timerContainer)
			.to({alpha : 1}, 300);
		CChipsClass.enableChips();
		if(!self.rebetStatusChanged) {
			CanvasPanelClass.updateRebetStatus(CanvasPanelClass.enableRebet);
		}
		self.rebetStatusChanged = true;
		CGameClass.bettingStatDisplay(true);
		CSeatClass.disableSeat(false);


		// 
		var tableContainer = CGameClass.gameContainer.getChildByName("tableContainer");
		var cardSlotMainContainer = tableContainer.getChildByName("cardSlotMainContainer");
		CGameClass.cardValueTgr.text = null;
		CGameClass.cardValueDrg.text = null;
		for(var i=0; i<2; i++){
			(function(){
				var index = i;
				var cardSlotContainer = cardSlotMainContainer.getChildByName("cardSlotContainer-"+index);
				if(cardSlotContainer.children.length > 0){
					cardSlotContainer.removeAllChildren();
				}
			})();
		}
	}
};

Timer.prototype.rotateCircle = function(degree){
	var tableContainer = CGameClass.gameContainer.getChildByName("tableContainer");
	var timerContainer = tableContainer.getChildByName("timerContainer");
	var crcl = timerContainer.getChildByName("mainCircle");
	var self = this;
	var multiplier = (self.isStartedWithMax) ? 1000 : 1000;
	// console.log("MULTIPLEIER", multiplier, self.timerval.curr);
	if(!self.isRotating){
		self.isRotating = true;
		crcl.rotation = degree;
		createjs.Tween.get(crcl)
			.to({rotation : 360}, (self.timerval.curr)*multiplier);
	}
};

Timer.prototype.shakeTimer = function(){
	var self = this;
	console.log("------shakeTimer", self.isShaking)
	if(!self.isShaking){
		self.isShaking = true;
		createjs.Tween.get(self.timerLabel, {loop : true, reversed : true})
			.to({rotation : 10}, 80)
			.to({rotation : -10}, 80);
	}
};

Timer.prototype.startTimer = function(timer){
	var self = this;
	var tableContainer = CGameClass.gameContainer.getChildByName("tableContainer");
	var timerContainer = tableContainer.getChildByName("timerContainer");
	var crcl = timerContainer.getChildByName("mainCircle");
	var innerSideCircle = timerContainer.getChildByName("innerSideCircle");

	var bettingStatusContainer = CGameClass.gameContainer.getChildByName("bettingStatusContainer");
	var bettingOpenStatusContainer = bettingStatusContainer.getChildByName("bettingOpenStatusContainer");
	var gradientLineContainer = bettingOpenStatusContainer.getChildByName("gradientLineContainer");

	self.timerLabel.text = timer.curr;
	createjs.Tween.get(self.timerLabel)
		.to({scale: 1.2}, 100)
		.to({scale: 1}, 100);


	var innerTimer = innerSideCircle;
	var max = timer.max;
	var time = timer.curr;
	var currDeg = (360 / max) * (max - time);
	var angle = -90;
	var degree = currDeg;
	var startAngle = angle * Math.PI / 180;
	var endAngle = Math.min(360, angle + degree) * Math.PI / 180;
	var color = (time === max / 2);
	

	innerTimer.graphics.clear();
	innerTimer.graphics
		.beginRadialGradientFill(["#111111", "#111111"], [0, 1], 0, 0, 10, 0, 0, 55)
		.moveTo(0, 0)
		.arc(0, 0, 55, startAngle, endAngle);
	self.rotateCircle(degree);

	// createjs.Ticker.removeEventListener("tick", animateTimer);

	function animateTimer(event) {
		time -= event.delta / 1000;
		currDeg = (360 / max) * (max - time);
		angle = -90;
		degree = currDeg;
		startAngle = angle * Math.PI / 180;
		endAngle = Math.min(360, angle + degree) * Math.PI / 180;
		innerTimer.graphics.clear();
		innerTimer.graphics
			.beginRadialGradientFill(["#111111", "#111111"], [0, 1], 0, 0, 10, 0, 0, 55)
			.moveTo(0, 0)
			.arc(0, 0, 55, startAngle, endAngle);

		// console.log("degree", degree)
		if(degree >= 90 && degree <= 100){
			self.timerLabel.color = "#cdff01"; //yellow green
			self.timerLabel.shadow = new createjs.Shadow("#cdff01", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#cdff01")
				.drawCircle(0, -52, 4);
		}else if(degree >= 100 && degree <= 170){
			self.timerLabel.color = "#fbff01"; //yellow
			self.timerLabel.shadow = new createjs.Shadow("#fbff01", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#fbff01")
				.drawCircle(0, -52, 4);
		}else if(degree >= 170 && degree <= 185){
			self.timerLabel.color = "#fcbd00"; //yellow orange
			self.timerLabel.shadow = new createjs.Shadow("#fcbd00", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#fcbd00")
				.drawCircle(0, -52, 4);
		}else if(degree >= 185 && degree <= 260){
			self.timerLabel.color = "#fe7b02"; //orange
			self.timerLabel.shadow = new createjs.Shadow("#fe7b02", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#fe7b02")
				.drawCircle(0, -52, 4);
		}else if(degree >= 260 && degree <= 280){
			self.timerLabel.color = "#ff5901"; //red orange
			self.timerLabel.shadow = new createjs.Shadow("#ff5901", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#ff5901")
				.drawCircle(0, -52, 4);
		}else if(degree >= 280 && degree <=360){  
			self.timerLabel.color = "#ff0100"; //red
			self.timerLabel.shadow = new createjs.Shadow("#ff0100", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#ff0100")
				.drawCircle(0, -52, 4);
			self.shakeTimer();
			if(CGameClass.statusLabel.text !== "TIME IS RUNNING OUT"){
				CGameClass.statusLabel.text = "TIME IS RUNNING OUT";
				CGameClass.statusLabel.color = "#fae100";
				CGameClass.statusLabel.font = "200 20px Carter";
				CGameClass.gradientLineTop.graphics.clear();
				CGameClass.gradientLineTop.graphics
					.setStrokeStyle(3, "round").beginStroke("rgba(225, 221, 0, .6)")
					.moveTo(-34.5, 0)
					.lineTo(34.5, 0);
				CGameClass.gradientLineTop.shadow = new createjs.Shadow("#fae100", 0, 0, 4);
				CGameClass.gradientLineBot.graphics.clear();
				CGameClass.gradientLineBot.graphics
					.setStrokeStyle(3, "round").beginStroke("rgba(225, 221, 0, .6)")
					.moveTo(-34.5, 0)
					.lineTo(34.5, 0);
				CGameClass.gradientLineBot.shadow = new createjs.Shadow("#fae100", 0, 0, 4);
			}

		}else if(degree > 360){
			createjs.Tween.get(self.timerLabel, {loop : false, override:true})
				.to({rotation : 0}, 80);
		}else{
			self.timerLabel.color = "#03fe00"; //orange
			self.timerLabel.shadow = new createjs.Shadow("#03fe00", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#03fe00")
				.drawCircle(0, -52, 4);
		}
	}
	console.log("TIMER", self.isTickAdded, self.tickListener)
	if(!self.isTickAdded) {
		self.isTickAdded = true;
		self.tickListener = createjs.Ticker.on("tick", animateTimer);
	}
};

Timer.prototype.clearTimer = function(){
	this.time = 0;
	this.timerLabel = null;
	this.tickStarted = false;

	this.isShaking = false;
	this.isRotating = false;
	this.timerval = {};

	this.isTickAdded = false;
	this.tickListener = null;
	this.isStartedWithMax = null;

	this.rebetStatusChanged = false;
};

Timer.prototype.clearTicker = function(){
	var self = this;
	console.log("TIMER CLEAR TICKER", self.isTickAdded);
	createjs.Ticker.off("tick", self.tickListener);
	this.time = 0;
	this.tickStarted = false;

	this.isShaking = false;
	this.isRotating = false;
	this.timerval = {};

	this.isTickAdded = false;
	this.tickListener = null;
	this.isStartedWithMax = null;

	this.rebetStatusChanged = false;
};

var TimerClass = new Timer();
var endTimer = function(){
	this.time = 0;
	this.timerLabel = null;
	this.tickStarted = false;

	this.isShaking = false;
	this.isRotating = false;
	this.timerval = {};

	this.isTickAdded = false;
	this.tickListener = null;
	this.isStartedWithMax = null;

	this.rebetStatusChanged = false;

	this.endTimer = null;
	this.endTimerContainer = null;
};

endTimer.prototype.createTimerContainer = function(){
	var self = this;
	self.endTimerContainer = CGenClass.createContainer(CGameClass.waitForNextRoundContainer, "endTimerContainer", true);
	self.endTimerContainer.y = -85;
	self.endTimerContainer.scaleY = self.endTimerContainer.scaleX = 1.51;
	self.endTimerContainer.alpha = 0;

	var outSideinnerCircle = self.endTimerContainer.addChild(new createjs.Shape());
	outSideinnerCircle.graphics
		.setStrokeStyle(2)
		.beginLinearGradientStroke(["#FFF","#8F8F8F"], [0, 1], 0, 20, 0, 60)
		.beginFill("#000")
		.drawCircle(0, 0, 56)
	outSideinnerCircle.name = "outSideinnerCircle";
	outSideinnerCircle.shadow = new createjs.Shadow("rgba(0, 0, 0, .6)", 0, 6, 9);

	// var timerBg = CGenClass.createBitmap(self.endTimerContainer, "timerbg", "timerBg", 1);
	var timerBg = SpriteClass.createSprite(self.endTimerContainer, SpriteClass.tableSpriteSheet, "timerbg", "timerBg", 1);
	timerBg.mask = outSideinnerCircle;
	timerBg.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 12);

	var innerSideCircle = self.endTimerContainer.addChild(new createjs.Shape());
	innerSideCircle.graphics
		.beginRadialGradientFill(["#111111", "#111111"], [0, 1], 0, 0, 10, 0, 0, 55)
		.moveTo(0, 0)
		.arc(0, 0, 55, 0, 0)
	innerSideCircle.name = "innerSideCircle";

	var innerTimerCircle = self.endTimerContainer.addChild(new createjs.Shape());
	innerTimerCircle.graphics
		.setStrokeStyle(2)
		.beginStroke("rgba(105, 110, 105, .2)")
		.beginFill("#000")
		.drawCircle(0, 0, 48)
	innerTimerCircle.name = "innerTimerCircle";

	var gradient = self.endTimerContainer.addChild(new createjs.Shape());
		gradient.graphics
			.setStrokeStyle(0).beginStroke("rgba(0,0,0,0)")
			.beginLinearGradientFill(["rgba(0,0,0,0)","rgba(196,196,196,.4)","rgba(0,0,0,0)"], [0, 1, 1], 0, 0, 0, 45)
			.drawCircle(0, 0, 45)
	gradient.name = "gradient";
	gradient.scaleY = -1;

	var crcl = self.endTimerContainer.addChild(new createjs.Shape());
	crcl.graphics
		.beginFill("#03fe00")
		.drawCircle(0, -52, 4);
	crcl.name = "mainCircle";

	this.timerLabel = CGenClass.createText(self.endTimerContainer, "timerLabel", "center", "middle", "#03fe00", "900 50px Lato", null);
	this.timerLabel.shadow = new createjs.Shadow("#03fe00", 0, 0, 15);

	console.log("self.endTimerContainer", self.endTimerContainer);
};

endTimer.prototype.setEndTimer = function(tick){
	console.log("WAIT TIMER", tick)
	if(!this.timerLabel) return false;
	this.timerval = tick;
	this.timerLabel.text = tick.curr;
	this.tickStarted = (tick.curr === 0) ? false : true;
	createjs.Tween.get(EndTimerClass.endTimerContainer)
		.to({alpha : (tick.curr === 0) ? 0 : 1}, (tick.curr === 0) ? 0 : 300);
	this.startTimer(tick);
	if(tick.curr === 0){
		clearInterval(EndTimerClass.endTimer);
		createjs.Tween.get(EndTimerClass.timerLabel, {loop : false, override:true})
			.to({rotation : 0}, 80);
		EndTimerClass.clearTicker();
		setTimeout(function(){
			EndTimerClass.clearTimer();
		}, 1000);
	}

};

endTimer.prototype.rotateCircle = function(degree){
	var crcl = EndTimerClass.endTimerContainer.getChildByName("mainCircle");
	var self = this;
	var multiplier = 1000;
	// console.log("MULTIPLEIER", multiplier, self.timerval.curr);
	if(!self.isRotating){
		self.isRotating = true;
		crcl.rotation = degree;
		createjs.Tween.get(crcl)
			.to({rotation : 360}, (self.timerval.curr)*multiplier);
	}
};

endTimer.prototype.shakeTimer = function(){
	var self = this;
	console.log("------shakeTimer", self.isShaking)
	if(!self.isShaking){
		self.isShaking = true;
		createjs.Tween.get(self.timerLabel, {loop : true, reversed : true})
			.to({rotation : 10}, 80)
			.to({rotation : -10}, 80);
	}
};

endTimer.prototype.startTimer = function(timer){
	var self = this;
	var crcl = self.endTimerContainer.getChildByName("mainCircle");
	var innerSideCircle = self.endTimerContainer.getChildByName("innerSideCircle");

	var bettingStatusContainer = CGameClass.gameContainer.getChildByName("bettingStatusContainer");
	var bettingOpenStatusContainer = bettingStatusContainer.getChildByName("bettingOpenStatusContainer");
	var gradientLineContainer = bettingOpenStatusContainer.getChildByName("gradientLineContainer");

	self.timerLabel.text = timer.curr;
	createjs.Tween.get(self.timerLabel)
		.to({scale: 1.2}, 100)
		.to({scale: 1}, 100);


	var innerTimer = innerSideCircle;
	var max = timer.max;
	var time = timer.curr;
	var currDeg = (360 / max) * (max - time);
	var angle = -90;
	var degree = currDeg;
	var startAngle = angle * Math.PI / 180;
	var endAngle = Math.min(360, angle + degree) * Math.PI / 180;
	var color = (time === max / 2);
	

	innerTimer.graphics.clear();
	innerTimer.graphics
		.beginRadialGradientFill(["#111111", "#111111"], [0, 1], 0, 0, 10, 0, 0, 55)
		.moveTo(0, 0)
		.arc(0, 0, 55, startAngle, endAngle);
	self.rotateCircle(degree);

	// createjs.Ticker.removeEventListener("tick", animateTimer);

	function animateTimer(event) {
		time -= event.delta / 1000;
		currDeg = (360 / max) * (max - time);
		angle = -90;
		degree = currDeg;
		startAngle = angle * Math.PI / 180;
		endAngle = Math.min(360, angle + degree) * Math.PI / 180;
		innerTimer.graphics.clear();
		innerTimer.graphics
			.beginRadialGradientFill(["#111111", "#111111"], [0, 1], 0, 0, 10, 0, 0, 55)
			.moveTo(0, 0)
			.arc(0, 0, 55, startAngle, endAngle);

		// console.log("degree", degree)
		if(degree >= 90 && degree <= 100){
			self.timerLabel.color = "#cdff01"; //yellow green
			self.timerLabel.shadow = new createjs.Shadow("#cdff01", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#cdff01")
				.drawCircle(0, -52, 4);
		}else if(degree >= 100 && degree <= 170){
			self.timerLabel.color = "#fbff01"; //yellow
			self.timerLabel.shadow = new createjs.Shadow("#fbff01", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#fbff01")
				.drawCircle(0, -52, 4);
		}else if(degree >= 170 && degree <= 185){
			self.timerLabel.color = "#fcbd00"; //yellow orange
			self.timerLabel.shadow = new createjs.Shadow("#fcbd00", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#fcbd00")
				.drawCircle(0, -52, 4);
		}else if(degree >= 185 && degree <= 260){
			self.timerLabel.color = "#fe7b02"; //orange
			self.timerLabel.shadow = new createjs.Shadow("#fe7b02", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#fe7b02")
				.drawCircle(0, -52, 4);
		}else if(degree >= 260 && degree <= 280){
			self.timerLabel.color = "#ff5901"; //red orange
			self.timerLabel.shadow = new createjs.Shadow("#ff5901", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#ff5901")
				.drawCircle(0, -52, 4);
		}else if(degree >= 280 && degree <=360){  
			self.timerLabel.color = "#ff0100"; //red
			self.timerLabel.shadow = new createjs.Shadow("#ff0100", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#ff0100")
				.drawCircle(0, -52, 4);
			self.shakeTimer();
		}else if(degree > 360){
			createjs.Tween.get(self.timerLabel, {loop : false, override:true})
				.to({rotation : 0}, 80);
		}else{
			self.timerLabel.color = "#03fe00"; //orange
			self.timerLabel.shadow = new createjs.Shadow("#03fe00", 0, 0, 15);
			crcl.graphics.clear();
			crcl.graphics
				.beginFill("#03fe00")
				.drawCircle(0, -52, 4);
		}
	}
	console.log("TIMER", self.isTickAdded, self.tickListener)
	if(!self.isTickAdded) {
		self.isTickAdded = true;
		self.tickListener = createjs.Ticker.on("tick", animateTimer);
	}
};

endTimer.prototype.clearTimer = function(){
	this.time = 0;
	this.timerLabel = null;
	this.tickStarted = false;

	this.isShaking = false;
	this.isRotating = false;
	this.timerval = {};

	this.isTickAdded = false;
	this.tickListener = null;
};

endTimer.prototype.clearTicker = function(){
	var self = this;
	createjs.Ticker.off("tick", self.tickListener);
	this.time = 0;
	this.tickStarted = false;

	this.isShaking = false;
	this.isRotating = false;
	this.timerval = {};

	this.isTickAdded = false;
	this.tickListener = null;
};

var EndTimerClass = new endTimer();
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
var Player = function(){
	this.playerInfo = userData;
	this.playerBetsResult = [
		{pos : -1, totalAmount : 0, totalPayout : 0,},
		{pos : 0, totalAmount : 0, totalPayout : 0,},
		{pos : 1, totalAmount : 0, totalPayout : 0,},
		{pos : 2, totalAmount : 0, totalPayout : 0,},
		{pos : 3, totalAmount : 0, totalPayout : 0,},
		{pos : 4, totalAmount : 0, totalPayout : 0,},
		{pos : 5, totalAmount : 0, totalPayout : 0,}
	];
	this.players = [];
	this.standingPlayers = [];
	this.playerIndex = null;
	this.tempStanding = [
		{ pos: -1, avatar: "1", displayname: "DIAMOND000001" },
		{ pos: -1, avatar: "2", displayname: "DIAMOND000002" },
		{ pos: -1, avatar: "3", displayname: "DIAMOND000003" },
		{ pos: -1, avatar: "4", displayname: "DIAMOND000004" },
		{ pos: -1, avatar: "5", displayname: "DIAMOND000005" },
		{ pos: -1, avatar: "6", displayname: "DIAMOND000006" },
		{ pos: -1, avatar: "7", displayname: "DIAMOND000007" },
		{ pos: -1, avatar: "8", displayname: "DIAMOND000008" },
		{ pos: -1, avatar: "9", displayname: "DIAMOND000009" },
		{ pos: -1, avatar: "10", displayname: "SPADE0000010" },
		{ pos: -1, avatar: "1", displayname: "SPADE000001" },
		{ pos: -1, avatar: "2", displayname: "SPADE000002" },
		{ pos: -1, avatar: "3", displayname: "SPADE000003" },
		{ pos: -1, avatar: "4", displayname: "SPADE000004" },
		{ pos: -1, avatar: "5", displayname: "SPADE000005" },
		{ pos: -1, avatar: "6", displayname: "SPADE000006" },
		{ pos: -1, avatar: "7", displayname: "SPADE000007" },
		{ pos: -1, avatar: "8", displayname: "SPADE000008" },
		{ pos: -1, avatar: "9", displayname: "SPADE000009" },
		{ pos: -1, avatar: "10", displayname: "SPADE0000010" },
		{ pos: -1, avatar: "1", displayname: "HEART000001" },
		{ pos: -1, avatar: "2", displayname: "HEART000002" },
		{ pos: -1, avatar: "3", displayname: "HEART000003" },
		{ pos: -1, avatar: "4", displayname: "HEART000004" },
		{ pos: -1, avatar: "5", displayname: "HEART000005" },
		{ pos: -1, avatar: "6", displayname: "HEART000006" },
		{ pos: -1, avatar: "7", displayname: "HEART000007" },
		{ pos: -1, avatar: "8", displayname: "HEART000008" },
		{ pos: -1, avatar: "9", displayname: "HEART000009" },
		{ pos: -1, avatar: "10", displayname: "HEART0000010" },
	];
};

Player.prototype.updatePlayers = function(players){
	var self = this;

	if(TimerClass.timerval.curr < 1){
		self.players = [];
	}
	self.standingPlayers = [];
	if(self.players.length < 1){
		self.players = players;
		self.updateStandingPlayers(players);
	}else {
		for(var i=0; i<players.length; i++){
			var player = players[i];
			self.playerIndex = (player.displayname === self.playerInfo.displayname) ? i : null;
			var displayname = self.players.findIndex(x => x.displayname === player.displayname);
			if(player.pos < 0) self.standingPlayers.push(player);
			if(displayname > -1){
				var index = displayname;
				self.players[index].pos = player.pos;
				self.players[index].avatar = player.avatar;
			}else {
				self.players.push(player);
			}

			CGameClass.standingplayerCount.text = (i === players.length-1) ? self.standingPlayers.length : CGameClass.standingplayerCount.text;
		}
	}
	StandingClass.updateStanding();
	console.log("self.players", self.players, self.standingPlayers)
};

Player.prototype.updateStandingPlayers = function(players){
	var self = this;
	self.standingPlayers = [];
	for(var i=0; i<players.length; i++){
		var player = players[i];
		self.playerIndex = (player.displayname === self.playerInfo.displayname) ? i : null;
		if(player.pos < 0) self.standingPlayers.push(player);
		CGameClass.standingplayerCount.text = (i === players.length-1) ? self.standingPlayers.length : CGameClass.standingplayerCount.text;
	}
};

Player.prototype.storeBets = function(betDetails){
	var self = this;
	var displayname = self.players.findIndex(x => x.displayname === betDetails.displayname);
	var index = displayname;
	if(!self.players[index]) return false;
	var betAmount = betDetails.betAmount * (betDetails.er / userData.exchangeRate.value);
	if(self.players[index].bets){
		if(betDetails.betType === "DRG" || betDetails.betType === "TGR"){
			self.players[index].totalBets[betDetails.betType] += betAmount;
		}
		self.players[index].bets.push(
			{
				betAmount: betAmount,
				betType: betDetails.betType,
				destination: betDetails.destination,
				er: betDetails.er,
			}
		);
	}else {
		self.players[index].bets = [];
		self.players[index].totalBets = { "DRG" : 0, "TGR" : 0};
		self.players[index].bets.push(
			{
				betAmount: betAmount,
				betType: betDetails.betType,
				destination: betDetails.destination,
				er: betDetails.er,
			}
		);
		if(betDetails.betType === "DRG" || betDetails.betType === "TGR"){
			self.players[index].totalBets[betDetails.betType] += betAmount;
		}
	}

};

Player.prototype.clearPlayer = function(){
	this.playerInfo = userData;
	this.playerBetsResult = [
		{pos : -1, totalAmount : 0, totalPayout : 0,},
		{pos : 0, totalAmount : 0, totalPayout : 0,},
		{pos : 1, totalAmount : 0, totalPayout : 0,},
		{pos : 2, totalAmount : 0, totalPayout : 0,},
		{pos : 3, totalAmount : 0, totalPayout : 0,},
		{pos : 4, totalAmount : 0, totalPayout : 0,},
		{pos : 5, totalAmount : 0, totalPayout : 0,}
	];
	this.players = [];
	this.standingPlayers = [];
	this.playerIndex = null;
};

var PlayerClass = new Player();
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

var Resources = function(){
	this.loadComplete = false;
	this.loadQueue = null;
	this.resources = [
		{ id : "table", src : rsPath+'/images/main table.png'},
		{ id : "arrow", src : rsPath+'/images/arrow.png'},
		{ id : "footer", src : rsPath+'/images/footer.png'},
		{ id : "bethere_main", src : rsPath+'/images/bethere-main.png'},
		{ id : "bethere_sub", src : rsPath+'/images/bethere-sub.png'},
		{ id : "bethere_subspec", src : rsPath+'/images/bethere-subspec.png'},
		{ id : "bethere_tie", src : rsPath+'/images/bethere-tie.png'},
		{ id : "placebetinfo", src : rsPath+'/images/place bet info.png'},
		{ id : "placebetinfo_sbo", src : rsPath+'/images/place bet info sbo.png'},
		{ id : "check", src : rsPath+'/images/check.png'},

		{ id : "cards", src : rsPath+'/images/sprites/card.png'},
		{ id : "panel_icons", src : rsPath+'/images/sprites/icons.png'},
		{ id : "card_shuffling", src : rsPath+'/images/sprites/card shuffling.png'},
		{ id : "avatar", src : rsPath+'/images/sprites/avatar.png'},
		{ id : "selection", src : rsPath+'/images/sprites/selection.png'},
		{ id : "shining", src : rsPath+'/images/sprites/result shining.png'},
		{ id : "seat_border", src : rsPath+'/images/sprites/seat border.png'},
		{ id : "rebet_border", src : rsPath+'/images/sprites/rebet border.png'},
		{ id : "table_sprites", src : rsPath+'/images/sprites/table sprites.png'},
		{ id : "result_icons", src : rsPath+'/images/sprites/result icons.png'},
		{ id : "game_guide", src : rsPath+'/images/sprites/game guide sprites.png'},
		{ id : "decimal_chip", src : rsPath+'/images/sprites/decimal chip.png'},
		
		{ id : "report_table", src : rsPath+'/images/report table.png'},
	];
	this.loadingResources = [
		{ id : "logo", src : rsPath+'/images/logo.png'},
		{ id : "loading_bar", src : rsPath+'/images/loading bar.png'},
		{ id : "loading_bg", src : rsPath+'/images/loadingbg.png'},
	];
	this.audio = [
		{ id : "intro", src : rsPath+'/sounds/introfinal.mp3', autoplay : true}, //done
		{ id : "bg", src : rsPath+'/sounds/loopingfinal.ogg', loop : true}, //done
		// { id : "bg", src : rsPath+'/sounds/loopingfinal.mp3', loop : true}, //done
		{ id : "chip", src : rsPath+'/sounds/Coin - for chip.mp3'}, //done
		{ id : "hand_values", src : rsPath+'/sounds/Dragon Tiger Hand Values.mp3', sprite : 
			{
				"DRG1" : [450, 1000], "DRG2" : [2050, 930], "DRG3" : [3670, 850], "DRG4" : [5300, 930], "DRG5" : [7050, 1090], "DRG6" : [8960, 1070],
				"DRG7" : [10620, 975], "DRG8" : [12330, 950], "DRG9" : [14040, 1030], "DRG10" : [15765, 1010], "DRG11" : [17470, 1100], "DRG12" : [19210, 1030],
				"DRG13" : [20960, 1170],

				"TGR1" : [23020, 940], "TGR2" : [24670, 920], "TGR3" : [26370, 880], "TGR4" : [28145, 895], "TGR5" : [29930, 940], "TGR6" : [31690, 1110],
				"TGR7" : [33550, 1000], "TGR8" : [35283, 969], "TGR9" : [36882, 948], "TGR10" : [38525, 925], "TGR11" : [40400, 1050], "TGR12" : [42190, 1000],
				"TGR13" : [43816, 1161],
			}
		, volume: 0.8}, //done
		{ id : "flip", src : rsPath+'/sounds/flip1.mp3'}, //done
		{ id : "no_more_bets", src : rsPath+'/sounds/No more bets.mp3', volume: 0.8}, //done
		{ id : "place_your_bets", src : rsPath+'/sounds/Place your Bet.mp3', volume: 0.8}, //done
		{ id : "TIEwin", src : rsPath+'/sounds/Tie Game.mp3', volume: 0.8}, //done
		{ id : "DRGwin", src : rsPath+'/sounds/Dragon Wins.mp3', volume: 0.8}, //done
		{ id : "TGRwin", src : rsPath+'/sounds/Tiger Wins.mp3', volume: 0.8}, //done
	];
};

Resources.prototype.clearResources = function(){
	this.loadComplete = false;
	this.loadQueue = null;
};

var ResourcesClass = new Resources();
var Sprites = function(){
	this.tableSpriteSheet = null;
	this.cardSpriteSheet = null;
	this.panelSpriteSheet = null;
	this.cardShufflingSpriteSheet = null;
	this.avatarSpriteSheet = null;
	this.bulbSpriteSheet = null;
	this.shiningSpriteSheet = null;
	this.seatBorderSpriteSheet = null;
	this.rebetBorderSpriteSheet = null;
	this.resultSpriteSheet = null;
	this.gameGuideSpriteSheet = null;
};

Sprites.prototype.init = function(callback){
	var self = this;
	self.createTableSpriteSheet(function(tableSpriteSheet){
		self.tableSpriteSheet = tableSpriteSheet;
		self.createCardSpriteSheet(function(cardSpriteSheet){
			self.cardSpriteSheet = cardSpriteSheet;
			self.createPanelSpriteSheet(function(panelSpriteSheet){
				self.panelSpriteSheet = panelSpriteSheet;
				self.createCardShufflingSpriteSheet(function(cardShufflingSpriteSheet){
					self.cardShufflingSpriteSheet = cardShufflingSpriteSheet;
					self.createAvatarSpriteSheet(function(avatarSpriteSheet){
						self.avatarSpriteSheet = avatarSpriteSheet;
						self.createBulbSpriteSheet(function(bulbSpriteSheet){
							self.bulbSpriteSheet = bulbSpriteSheet;
							self.createShiningSpriteSheet(function(shiningSpriteSheet){
								self.shiningSpriteSheet = shiningSpriteSheet;
								self.createSeatBorderSpriteSheet(function(seatBorderSpriteSheet){
									self.seatBorderSpriteSheet = seatBorderSpriteSheet;
									self.createRebetBorderSpriteSheet(function(rebetBorderSpriteSheet){
										self.rebetBorderSpriteSheet = rebetBorderSpriteSheet;
										self.createResultSpriteSheet(function(resultSpriteSheet){
											self.resultSpriteSheet = resultSpriteSheet;
											self.createGameGuideSpriteSheet(function(gameGuideSpriteSheet){
												self.gameGuideSpriteSheet = gameGuideSpriteSheet;
												callback();
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

Sprites.prototype.createSprite = function(cont, spriteSheet, goto, name, scale){
	var newSprite = cont.addChild(new createjs.Sprite(spriteSheet));
	newSprite.gotoAndStop(goto);
	newSprite.name = name;
	newSprite.scaleX = newSprite.scaleY = scale;
	return newSprite;
};

Sprites.prototype.createCardSpriteSheet = function(next){
	var spriteWidth = 215.125, spriteHeight = 300.57;
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("cards")],
		frames : {
			width : spriteWidth,
			height : spriteHeight,
			regX: spriteWidth / 2,
			regY: spriteHeight / 2
		},
		animations : {
			"AH" : [0, 0, "AH"], "AD" : [1, 1, "AD"], "AS" : [2, 2, "AS"], "AC" : [3, 3, "AC"], "8H" : [4, 4, "8H"], "8D" : [5, 5, "8D"], "8S" : [6, 6, "8S"], "8C" : [7, 7, "8C"],
			"2H" : [8, 8, "2H"], "2D" : [9, 9, "2D"], "2S" : [10, 10, "2S"], "2C" : [11, 11, "2C"], "9H" : [12, 12, "9H"], "9D" : [13, 13, "9D"], "9S" : [14, 14, "9S"], "9C" : [15, 15, "9C"],
			"3H" : [16, 16, "3H"], "3D" : [17, 17, "3D"], "3S" : [18, 18, "3S"], "3C" : [19, 19, "3C"], "10H" : [20, 20, "10H"], "10D" : [21, 21, "10D"], "10S" : [22, 22, "10S"], "10C" : [23, 23, "10C"],
			"4H" : [24, 24, "4H"], "4D" : [25, 25, "4D"], "4S" : [26, 26, "4S"], "4C" : [27, 27, "4C"], "JH" : [28, 28, "JH"], "JD" : [29, 29, "JD"], "JS" : [30, 30, "JS"], "JC" : [31, 31, "JC"],
			"5H" : [32, 32, "5H"], "5D" : [33, 33, "5D"], "5S" : [34, 34, "5S"], "5C" : [35, 35, "5C"], "QH" : [36, 36, "QH"], "QD" : [37, 37, "QD"], "QS" : [38, 38, "QS"], "QC" : [39, 39, "QC"],
			"6H" : [40, 40, "6H"], "6D" : [41, 41, "6D"], "6S" : [42, 42, "6S"], "6C" : [43, 43, "6C"], "KH" : [44, 44, "KH"], "KD" : [45, 45, "KD"], "KS" : [46, 46, "KS"], "KC" : [47, 47, "KC"],
			"7H" : [48, 48, "7H"], "7D" : [49, 49, "7D"], "7S" : [50, 50, "7S"], "7C" : [51, 51, "7C"], "YLW" : [52, 52, "YLW"], "BCK" : [53, 53, "BCK"],
		}
	});
	next(spriteSheet);
};

Sprites.prototype.createPanelSpriteSheet = function(next){
	var spriteWidth = 60, spriteHeight = 60;
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("panel_icons")],
		frames : {
			width : spriteWidth,
			height : spriteHeight,
			regX: spriteWidth / 2,
			regY: spriteHeight / 2
		},
		animations : {
			user : [0, 0, "user"],
			minimize : [1, 1, "minimize"],
			statement : [2, 2, "statement"],
			roadmap : [3, 3, "roadmap"],
			decrement : [4, 4, "decrement"],
			history : [5, 5, "history"],
			play : [6, 6, "play"],
			arrow : [7, 7, "arrow"],
			touchoff : [8, 8, "touchoff"],
			unmute : [9, 9, "unmute"],
			touch : [10, 10, "touch"],
			increment : [11, 11, "increment"],
			close : [12, 12, "close"],
			fastforward : [13, 13, "fastforward"],
			stop : [14, 14, "stop"],
			seat : [15, 15, "seat"],
			menu : [16, 16, "menu"],
			mute : [17, 17, "mute"],
			home : [18, 18, "home"],
			rebet : [19, 19, "rebet"],
			doc : [20, 20, "doc"],
			fullscreen : [21, 21, "fullscreen"],
			info : [22, 22, "info"],
			bubble : [23, 23, "bubble"],
			player : [24, 24, "player"],
		}
	});
	next(spriteSheet);
};

Sprites.prototype.createCardShufflingSpriteSheet = function(next){
	var spriteWidth = 640, spriteHeight = 360.1;
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("card_shuffling")],
		frames : {
			width : spriteWidth,
			height : spriteHeight,
			regX: spriteWidth / 2,
			regY: spriteHeight / 2
		},
		animations : {
			run : [0, 89, false, (CGenClass.isMobile) ? 1.3 : .5],
		}
	});
	next(spriteSheet);
};

Sprites.prototype.createAvatarSpriteSheet = function(next){
	var spriteWidth = 449.2, spriteHeight = 450;
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("avatar")],
		frames : {
			width : spriteWidth,
			height : spriteHeight,
			regX: spriteWidth / 2,
			regY: spriteHeight / 2
		},
		animations : {
			avatar1 : [0, 0, "avatar1"],
			avatar2 : [1, 1, "avatar2"],
			avatar3 : [2, 2, "avatar3"],
			avatar4 : [3, 3, "avatar4"],
			avatar5 : [4, 4, "avatar5"],
			avatar6 : [5, 5, "avatar6"],
			avatar7 : [6, 6, "avatar7"],
			avatar8 : [7, 7, "avatar8"],
			avatar9 : [8, 8, "avatar9"],
			avatar10 : [9, 9, "avatar10"],
			// avatar11 : [10, 10, "avatar11"],
			// avatar12 : [11, 11, "avatar12"],
			// avatar13 : [12, 12, "avatar13"],
			// avatar14 : [13, 13, "avatar14"],
			// avatar15 : [14, 14, "avatar15"],
			// avatar16 : [15, 15, "avatar16"],
		}
	});
	next(spriteSheet);
};

Sprites.prototype.createBulbSpriteSheet = function(next){
	var spriteSheet = new createjs.SpriteSheet({		
		images : [ResourcesClass.loadQueue.getResult("selection")],
		frames: { width: 54.5, height: 2, regX : 54.5/2, regY : 2/2, },
		animations:{ "selected_on" : [ 0, 0 ], "selected_off" : [ 1, 1 ] }
	});
	next(spriteSheet);
};

Sprites.prototype.createShiningSpriteSheet = function(next){
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("shining")],
		frames : {width : 524, height : 195, regX: 524/2, regY: 195/2},
		animations : {
			run : [0, 33, "run", (CGenClass.isMobile) ? 1.1 : 0.5],
		}
	});
	next(spriteSheet);
};

Sprites.prototype.createSeatBorderSpriteSheet = function(next){
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("seat_border")],
		frames : {width : 87, height : 87, regX: 87/2, regY: 87/2},
		animations : {
			run : [0, 15, "run", (CGenClass.isMobile) ? .6 : .4],
		}
	});
	next(spriteSheet);
};

Sprites.prototype.createRebetBorderSpriteSheet = function(next){
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("rebet_border")],
		frames : {width : 110, height : 122, regX: 110/2, regY: 122/2},
		animations : {
			run : [0, 41, "run", (CGenClass.isMobile) ? 1 : .4],
		}
	});
	next(spriteSheet);
};

Sprites.prototype.createTableSpriteSheet = function(next){
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("table_sprites")],
		frames : [
			[0, 0, 78, 77, 0, 39, 38.5],
			[78, 0, 78, 77, 0, 39, 38.5],
			[156, 0, 78, 77, 0, 39, 38.5],
			[234, 0, 78, 77, 0, 39, 38.5],
			[312, 0, 78, 77, 0, 39, 38.5],
			[390, 0, 78, 77, 0, 39, 38.5],
			[468, 0, 78, 77, 0, 39, 38.5],
			[546, 0, 78, 77, 0, 39, 38.5],
			[624, 0, 78, 77, 0, 39, 38.5],
			[702, 0, 78, 77, 0, 39, 38.5],
			[780, 0, 78, 77, 0, 39, 38.5],
			[858, 0, 78, 77, 0, 39, 38.5],
			[936, 0, 78, 77, 0, 39, 38.5],
			[1014, 0, 78, 77, 0, 39, 38.5],
			[1092, 0, 78, 77, 0, 39, 38.5],
			///
			[0, 77, 78, 77, 0, 39, 38.5],
			[78, 77, 78, 77, 0, 39, 38.5],
			[156, 77, 78, 77, 0, 39, 38.5],
			[234, 77, 78, 77, 0, 39, 38.5],
			[312, 77, 78, 77, 0, 39, 38.5],
			[390, 77, 78, 77, 0, 39, 38.5],
			[468, 77, 78, 77, 0, 39, 38.5],
			[546, 77, 78, 77, 0, 39, 38.5],
			[624, 77, 78, 77, 0, 39, 38.5],
			[702, 77, 78, 77, 0, 39, 38.5],
			[780, 77, 78, 77, 0, 39, 38.5],
			[858, 77, 78, 77, 0, 39, 38.5],
			[936, 77, 78, 77, 0, 39, 38.5],
			[1014, 77, 78, 77, 0, 39, 38.5],
			[1092, 77, 78, 77, 0, 39, 38.5],
			///
			[0, 154, 78, 77, 0, 39, 38.5],
			[78, 154, 78, 77, 0, 39, 38.5],
			[156, 154, 78, 77, 0, 39, 38.5],
			[234, 154, 78, 77, 0, 39, 38.5],
			[312, 154, 78, 77, 0, 39, 38.5],
			[390, 154, 78, 77, 0, 39, 38.5],
			[468, 154, 78, 77, 0, 39, 38.5],
			[546, 154, 78, 77, 0, 39, 38.5],
			[624, 154, 78, 77, 0, 39, 38.5],
			[702, 154, 78, 77, 0, 39, 38.5],
			[780, 154, 78, 77, 0, 39, 38.5],
			[858, 154, 78, 77, 0, 39, 38.5],
			[936, 154, 78, 77, 0, 39, 38.5],
			[1014, 154, 78, 77, 0, 39, 38.5],
			[1092, 154, 78, 77, 0, 39, 38.5],
			// [1170, 154, 78, 77, 0, 39, 38.5],

			//
			[0, 231, 260, 59, 0, 130, 29.5],
			[260, 231, 98, 98, 0, 49, 49],
			[358, 231, 98, 98, 0, 49, 49],
			[456, 231, 68, 168, 0, 34, 84],
			[524, 231, 155, 101, 0, 77.5, 50.5],
			[679, 231, 155, 101, 0, 77.5, 50.5],
			[834, 231, 155, 101, 0, 77.5, 50.5],
			[989, 231, 75, 76, 0, 37.5, 38],
			[1064, 231, 75, 110, 0, 37.5, 55],
			[1139, 231, 75, 110, 0, 37.5, 55],
			[1214, 231, 133, 61, 0, 66.5, 30.5],

			//
			[0, 399, 1279, 80, 0, 639.5, 40], //notif bg
			[0, 479, 1279, 202, 0, 639.5, 101], //betting close
			[1170, 0, 119, 119, 0, 59.5, 59.5], //chips blue
			[1170, 119, 83, 83, 0, 41.5, 41.5], //rotate
			[1289, 0, 120, 94, 0, 60, 47], //bubble
			[1409, 0, 195, 40, 0, 97.5, 20], //bet amount bg
			[1604, 0, 108, 108, 0, 54, 54], //timer bg

		],
		animations : {
			dcoin1 : [0, 0, "dcoin1"],
			dcoin2 : [1, 1, "dcoin2"],
			dcoin3 : [2, 2, "dcoin3"],
			dcoin4 : [3, 3, "dcoin4"],
			dcoin5 : [4, 4, "dcoin5"], 
			dcoin6 : [5, 5, "dcoin6"],
			dcoin7 : [6, 6, "dcoin7"],
			dcoin8 : [7, 7, "dcoin8"],
			dcoin9 : [8, 8, "dcoin9"],
			dcoin10 : [9, 9, "dcoin10"], 
			dcoin11 : [10, 10, "dcoin11"],
			dcoin12 : [11, 11, "dcoin12"],
			dcoin13 : [12, 12, "dcoin13"],
			dcoin14 : [13, 13, "dcoin14"],
			dcoin15 : [14, 14, "dcoin15"], 

			coin1 : [15, 15, "coin1"],
			coin2 : [16, 16, "coin2"],
			coin3 : [17, 17, "coin3"],
			coin4 : [18, 18, "coin4"],
			coin5 : [19, 19, "coin5"], 
			coin6 : [20, 20, "coin6"],
			coin7 : [21, 21, "coin7"],
			coin8 : [22, 22, "coin8"],
			coin9 : [23, 23, "coin9"],
			coin10 : [24, 24, "coin10"], 
			coin11 : [25, 25, "coin11"],
			coin12 : [26, 26, "coin12"],
			coin13 : [27, 27, "coin13"],
			coin14 : [28, 28, "coin14"],
			coin15 : [29, 29, "coin15"], 

			nvcoin1 : [30, 30, "nvcoin1"],
			nvcoin2 : [31, 31, "nvcoin2"],
			nvcoin3 : [32, 32, "nvcoin3"],
			nvcoin4 : [33, 33, "nvcoin4"],
			nvcoin5 : [34, 34, "nvcoin5"], 
			nvcoin6 : [35, 35, "nvcoin6"],
			nvcoin7 : [36, 36, "nvcoin7"],
			nvcoin8 : [37, 37, "nvcoin8"],
			nvcoin9 : [38, 38, "nvcoin9"],
			nvcoin10 : [39, 39, "nvcoin10"], 
			nvcoin11 : [40, 40, "nvcoin11"],
			nvcoin12 : [41, 41, "nvcoin12"],
			nvcoin13 : [42, 42, "nvcoin13"],
			nvcoin14 : [43, 43, "nvcoin14"],
			nvcoin15 : [44, 44, "nvcoin15"], 

			cointray : [45, 45, "cointray"],
			rebet : [46, 46, "rebet"],
			standingPlayerButton : [47, 47, "standingPlayerButton"],
			roadmapButton : [48, 48, "roadmapButton"],
			shoe : [49, 49, "shoe"],
			emptyshoe : [50, 50, "emptyshoe"],
			shoeBase : [51, 51, "shoeBase"],
			shoeCover : [52, 52, "shoeCover"],
			burnCard : [53, 53, "burnCard"],
			burnCardEmpty : [54, 54, "burnCardEmpty"],
			minmaxCont : [55, 55, "minmaxCont"],

			notifbg : [56, 56, "notifbg"],
			bettingclose : [57, 57, "bettingclose"],
			selected_chip : [58, 58, "selected_chip"],
			rotate : [59, 59, "rotate"],
			bubble : [60, 60, "bubble"],
			betamountbg : [61, 61, "betamountbg"],
			timerbg : [62, 62, "timerbg"],
		}
	});
	next(spriteSheet);
};

// Sprites.prototype.createEmojiSpriteSheets = function(next){
// 	for(var i=0; i<EmojiClass.emojis.length; i++){
// 		var emoji = EmojiClass.emojis[i];
// 		var spriteSheet = new createjs.SpriteSheet({
// 			images : [ResourcesClass.loadQueue.getResult(emoji.name)],
// 			frames : {width : emoji.width, height : emoji.height, regX: emoji.width/2, regY: emoji.height/2},
// 			animations : {
// 				start : [0, emoji.frames-1, "start", (CGenClass.isMobile) ? .35 : .15],
// 				emojiDisplay : [emoji.display-1, emoji.display-1, "emojiDisplay"]
// 			}
// 		});
// 		emoji.spriteSheet = spriteSheet;
// 	}
// 	next();
// };

Sprites.prototype.createResultSpriteSheet = function(next){
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("result_icons")],
		frames : [
			[0, 0, 564, 361, 0, 282, 180.5],
			[564, 0, 564, 361, 0, 282, 180.5],

			[0, 361, 593, 72, 0, 296.5, 36],
			[593, 361, 490, 72, 0, 245, 36],
			[593, 433, 156, 71, 0, 78, 35.5],

			[0, 433, 589, 210, 0, 216.5, 105.5],
		],
		animations : {
			dragon : [0, 0, "dragon"],
			tiger : [1, 1, "tiger"],
			dragonwins : [2, 2, "dragonwins"],
			tigerwins : [3, 3, "tigerwins"],
			tie : [4, 4, "tie"],
			win_glow : [5, 5, "win_glow"],
		}
	});
	next(spriteSheet);
};

Sprites.prototype.createGameGuideSpriteSheet = function(next){
	var spriteWidth = 1000, spriteHeight = 500;
	var spriteSheet = new createjs.SpriteSheet({
		images : [ResourcesClass.loadQueue.getResult("game_guide")],
		frames : {
			width : spriteWidth,
			height : spriteHeight,
			regX: spriteWidth / 2,
			regY: spriteHeight / 2
		},
		animations : {
			game_rule_1 : [0, 0, "game_rule_1"],
			game_rule_2 : [1, 1, "game_rule_2"],
			game_rule_3 : [2, 2, "game_rule_3"],
			game_rule_4 : [3, 3, "game_rule_4"],
		}
	});
	next(spriteSheet);
};

Sprites.prototype.clearSprites = function(){
	this.tableSpriteSheet = null;
	this.cardSpriteSheet = null;
	this.panelSpriteSheet = null;
	this.cardShufflingSpriteSheet = null;
	this.avatarSpriteSheet = null;
	this.bulbSpriteSheet = null;
	this.shiningSpriteSheet = null;
	this.seatBorderSpriteSheet = null;
	this.rebetBorderSpriteSheet = null;
	this.resultSpriteSheet = null;
	this.gameGuideSpriteSheet = null;
};

var SpriteClass = new Sprites();
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
var Sound = function(){
	this.loadState = { count: 0, state: false};
	this.audio = {};
	// this.mute = false;
	this.mute = userData.isMuted;
	this.isIntroDone = false;
	this.isIntroStarted = false;
};

Sound.prototype.playAudio = function(name){
	if(!LoadingClass.loadComplete) return false;
	var self = this;
	if (self.audio[name] === undefined || self.audio[name] === null) return false;
	if (self.mute) {
		self.audio[name].volume = 0;
		self.audio[name].stop();
	} else {
		self.audio[name].volume = 1;
		self.audio[name].play();
		console.log("playaudio", name);
	}
};

Sound.prototype.toggleMute = function(){
	var self = this;
	self.mute = !self.mute;
	Howler.mute(self.mute);
	self.playIntro();
};

Sound.prototype.playIntro = function(){
	if(!LoadingClass.loadComplete) return false;
	var self = this;
	if(!self.isIntroDone && !self.isIntroStarted){
		if(!self.mute){
			console.log("intro", self.audio["intro"].playing())
			if (!self.audio["intro"].playing()) {
				self.audio["intro"].volume = 1;
				self.playAudio("intro");
			}
		} else {
			self.audio["intro"].volume = 0;
			self.audio["intro"].stop();
		}

		self.isIntroStarted = true;

		setTimeout(function(){
			self.isIntroDone = true;
			self.playBg();
			console.log("intro end", self.audio["bg"].playing())
		}, 65500);
	}
};

Sound.prototype.playBg = function(){
	if(!LoadingClass.loadComplete) return false;
	var self = this;
	if(!self.mute){
		console.log("bg", self.audio["bg"].playing())
		if (!self.audio["bg"].playing()) {
			self.audio["bg"].volume = 1;
			self.playAudio("bg");
		}
	} else {
		self.audio["bg"].volume = 0;
		self.audio["bg"].stop();
	}

	self.audio["bg"].on('end', function(){
		console.log("bg end")
	});
};

Sound.prototype.playSprite = function(name, sprite){
	if(!LoadingClass.loadComplete) return false;
	var self = this;
	if (self.audio[name] === undefined || self.audio[name] === null) return false;
	if (self.mute) {
		self.audio[name].volume = 0;
		self.audio[name].stop();
	} else {
		self.audio[name].volume = 1;
		self.audio[name].play(sprite);
		console.log("PLAYSPRITE", name, sprite, self.audio[name])
	}
};

Sound.prototype.clearSound = function(){
	this.loadState = { count: 0, state: false};
	this.audio = {};
	this.mute = false;
	this.isIntroDone = false;
	this.isIntroStarted = false;
};

var SoundClass = new Sound();
var PlayerReport = function(){
	this.reports = [];
	this.sampleReports = [
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 1,
		    "__v" : 0
		},
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 2,
		    "__v" : 0
		},
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 3,
		    "__v" : 0
		},
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 4,
		    "__v" : 0
		},
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 5,
		    "__v" : 0
		},
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 6,
		    "__v" : 0
		},
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 7,
		    "__v" : 0
		},
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 8,
		    "__v" : 0
		},
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 9,
		    "__v" : 0
		},
		{
		    "totalPayout" : 20,
		    "totalAmount" : 10,
		    "gameEnd" : "2020-02-05T07:07:17.783Z",
		    "transId" : 10,
		    "__v" : 0
		},
	];
	this.reportListContainer = null;
	// this.reportHeader = ["DATE / TIME", "TRANSACTION ID", "STAKE", "WIN / LOSS"];
	this.reportHeader = [
		{label : "DATE / TIME", x : -350},
		{label : "TRANSACTION ID", x : -150},
		{label : "STAKE", x : 48},
		{label : "WIN / LOSS", x : 248}
	];
};

PlayerReport.prototype.createReportListContainer = function(reportContentContainer){
	var self = this;

	self.reportListContainer = CGenClass.createContainer(reportContentContainer, "reportListContainer", true);
	self.createReportList();
};

PlayerReport.prototype.createReportList = function(){
	var self = this;
	var splitUrl = window.location.host.split('.');
	
	if(splitUrl[0] === '192' || splitUrl[1] === '338alab'){
		self.reports = self.sampleReports;
	}

	function mouseOver(evt) {
		evt.target.scale = 1.2;
	}
	
	function mouseOut(evt) {
		evt.target.scale = 1;
	}

	self.reportListContainer.removeAllChildren();
	var reportHeaderContainer = CGenClass.createContainer(self.reportListContainer, "reportHeaderContainer", true);
	reportHeaderContainer.y = -160;
	for(var i=0; i<self.reportHeader.length; i++){
		var index = i;
		(function(){
			var report = self.reportHeader[index];
			var reportHeaderLabel = CGenClass.createText(reportHeaderContainer, "reportHeaderLabel-"+index, "center", "middle", "#FFF", "200 18px Roboto CondensedLight", report.label);
			reportHeaderLabel.x = report.x;
			console.log("reportHeaderLabel", report, reportHeaderLabel)
		})();
	}
	var origY = -122;
	for(var i=0; i<self.reports.length; i++){
		var index = i;
		(function(){
			var report = self.reports[index];
			var reportRowContainer = CGenClass.createContainer(self.reportListContainer, "reportRowContainer-"+index, true);
			reportRowContainer.y = origY;
			var d = new Date(report["gameEnd"]);
			var dateMonth = d.getMonth()+1;
			dateMonth = (dateMonth.toLocaleString().length > 1) ? dateMonth : 0+dateMonth.toLocaleString();
			var dateDay = (d.getDate().toLocaleString().length > 1) ? d.getDate() : 0+d.getDate().toLocaleString();
			var dateVal = dateDay + "/" + dateMonth + "/" + d.getFullYear();
			var dateHour = (d.getHours() > 12) ? d.getHours() - 12 : d.getHours();
			var meridiem = (d.getHours() > 12) ? "PM" : "AM";
			var dateMin = (d.getMinutes().toLocaleString().length > 1) ? d.getMinutes() : 0+d.getMinutes().toLocaleString();
			var dateSec = (d.getSeconds().toLocaleString().length > 1) ? d.getSeconds() : 0+d.getSeconds().toLocaleString();
			dateVal = dateVal + " " + dateHour + ":" + dateMin + ":" + dateSec + " " + meridiem;
			var date = CGenClass.createText(reportRowContainer, "date", "center", "middle", "#FFF", "200 18px Roboto CondensedLight", dateVal);
			date.x = -350;
			var transId = CGenClass.createText(reportRowContainer, "date", "center", "middle", "#FFF", "200 18px Roboto CondensedLight", report["transId"]);
			transId.x = -150;
			var stake = CGenClass.createText(reportRowContainer, "date", "center", "middle", "#FFF", "200 18px Roboto CondensedLight", report["totalAmount"]);
			stake.x = 48;
			var winloss = CGenClass.createText(reportRowContainer, "date", "center", "middle", "#FFF", "200 18px Roboto CondensedLight", report["totalPayout"]);
			winloss.x = 248;
			origY = origY + 36;

			var arrowContainer = CGenClass.createContainer(reportRowContainer, "arrowContainer", true);
			arrowContainer.x = 398;
			arrowContainer.y = -2
			var arrow = CGenClass.createBitmap(arrowContainer, "arrow", "arrow", .6);
			arrow.rotation = -90;
			var buttonHitArea = CGenClass.createRect(arrowContainer, "buttonHitArea", "#FFF", 0, "#000", 90, 30, false);
			arrowContainer.hitArea = buttonHitArea;

			arrowContainer.on("mouseover", mouseOver);
		    arrowContainer.on("mouseout", mouseOut);

		    var getLobbyUrl = function(next){
		    	var lobbySplitUrl = window.location.origin;
		    	lobbySplitUrl = lobbySplitUrl+"/svy/"
		    	next(lobbySplitUrl);
		    };

		    arrowContainer.on("click", function(){
		    	window.open(location.origin+"/svy/dtm/statement?transId="+report["transId"], "same_window",'width=1024, height=736');
		    });

		})();
	}
};

var PlayerReportClass = new PlayerReport();
function onResize(isMobile){
	var gameContainer = document.getElementById('game-container');
	var canvasContainer = document.getElementById('canvas-container');
  var loadingContainer = document.getElementById('loading-container');
  var popupContainer = (CGenClass.isSBO) ? null : document.getElementsByClassName('svy-announcement-popup-cont')[0];
	var iOS = false;
	var navEnabled = false;
  isMobile = (isMobile && !CGenClass.isIOS) ? false : isMobile;

  console.log('####### onResize', isMobile, CGenClass.isIOS);
  if (isMobile) {
    if (window.innerWidth > window.innerHeight) {
      console.log('Type : Landscape', canvasContainer);

      var w = gameContainer.offsetWidth;
      var h = gameContainer.offsetHeight;
      var scaleResult = Math.min(w, h) * 1.8;
      var interval = 1000;
      var newW = window.innerWidth;
      var newH = window.innerHeight;
      var topSpace = 0;

      console.log("IS IOS", window.innerHeight);
      console.log('scaleResult', scaleResult);

      if (CGenClass.isIOS && newW <= 580) {
        interval = 2000;
        var x = document.getElementsByTagName("BODY")[0];
          x.style.height = "calc(100% + 10%)";
          window.scrollTo(0, 1000);
          setTimeout(function(){
            x.style.height = "100%";
          }, 1000);
        }
      setTimeout(function() {
        newH = window.innerHeight;
        if (CGenClass.isIOS) {
          h = h - 83;
          interval = 2000;
          var diff = window.innerHeight/720;
          newW = diff*1280;
          console.log("NEWW", newW, window.innerHeight);
          if(newW <= 405){
            newH = (window.innerHeight/2)+19;
            canvasContainer.style.position = 'absolute';
            canvasContainer.style.margin = 'auto';
            canvasContainer.style.top = 0;
            canvasContainer.style.bottom = 0;
            canvasContainer.style.left = 0;
            canvasContainer.style.right = 0;
            canvasContainer.style.display = 'block';

            if(!CGenClass.isSBO) {
              popupContainer.style.position = 'fixed';
              popupContainer.style.margin = 'auto';
            }
            topSpace = (92) + 'px';
            if(loadingContainer){
              loadingContainer.style.height = 171.4 + "%";
            }
          }else if(newW === 577.7777777777778){
            canvasContainer.style.position = 'absolute';
            canvasContainer.style.margin = 'auto';
            // canvasContainer.style.bottom = 0;
            canvasContainer.style.top = 0;
            canvasContainer.style.left = 0;
            canvasContainer.style.right = 0;
            canvasContainer.style.display = 'block';
          }else {
            if(loadingContainer){
              loadingContainer.style.height = 100 + "%";
            }
            if(!CGenClass.isSBO) {
              popupContainer.style.position = 'fixed';
              popupContainer.style['margin-left'] = 'auto';
              popupContainer.style['margin-right'] = 'auto';
            }
            }
        }
        canvasContainer.style.width = newW + 'px';
        canvasContainer.style.height = newH + 'px';
        if(!CGenClass.isSBO) {
          popupContainer.style.height = window.innerHeight + 'px';
          popupContainer.style.width = newW + 'px';
          popupContainer.style.top = topSpace;
        }
        if(!CGenClass.mainContainer && !CGenClass.alertMainContainer){
          var timer = setInterval(function () {
            if (CGenClass.mainContainer) {
              updateCanvasSize(newW);
              clearInterval(timer);
            }
          }, 200);
        }else updateCanvasSize(newW);
      }, interval);
    } else {
      console.log('Type : Portrait');
    }
  } else {
    var onyxHeader = document.getElementsByClassName('popup-header')[0];
    var gameStage = document.getElementById('gameStage');

    // Change canvas container css
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.margin = 'auto';
    canvasContainer.style.top = 0;
    canvasContainer.style.bottom = 0;
    canvasContainer.style.left = 0;
    canvasContainer.style.right = 0;

    if(CGenClass.isMobile){
      if(!CGenClass.isSBO) {
        popupContainer.style.position = 'fixed';
        popupContainer.style.margin = 'auto';
        popupContainer.style.bottom = 0;
        popupContainer.style.left = 0;
        popupContainer.style.right = 0;
      }

      var isFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
      if(CanvasPanelClass.minimizeSprite && CanvasPanelClass.fullScreenSprite){
        CanvasPanelClass.minimizeSprite.visible = (isFullScreen) ? true : false;
        CanvasPanelClass.fullScreenSprite.visible = (!isFullScreen) ? true : false;
      }
    }

    // Resize canvas container
    var widthToHeight = gameStage.width / gameStage.height;
    var newWidth = window.innerWidth;
    var newHeight = gameContainer.clientHeight; // use container because we have onyx header
    var newWidthToHeight = newWidth / newHeight;
    if (newWidthToHeight > widthToHeight) {
      // window width is too wide relative to desired game width
      newWidth = newHeight * widthToHeight;
      canvasContainer.style.height = newHeight + 'px';
      canvasContainer.style.width = newWidth + 'px';
      if(!CGenClass.isSBO) {
        popupContainer.style.height = newHeight + 'px';
        popupContainer.style.width = newWidth + 'px';
      }
      if(!CGenClass.isMobile){
        if(!CGenClass.isSBO) {
          popupContainer.style.top = (111) + 'px';
        }
      }
      if(!CGenClass.mainContainer && !CGenClass.alertMainContainer){
        var timer = setInterval(function () {
          if (CGenClass.mainContainer) {
            updateCanvasSize(newWidth);
            clearInterval(timer);
          }
        }, 200);
      }else updateCanvasSize(newWidth);
    } else { // window height is too high relative to desired game height
      newHeight = newWidth / widthToHeight;
      canvasContainer.style.width = newWidth + 'px';
      canvasContainer.style.height = newHeight + 'px';
      if(!CGenClass.isSBO) {
        popupContainer.style.height = newHeight + 'px';
        popupContainer.style.width = newWidth + 'px';
      }
      if(!CGenClass.isMobile){
        if(!CGenClass.isSBO) {
          popupContainer.style.top = (111) + 'px';
        }
      }
      if(!CGenClass.mainContainer && !CGenClass.alertMainContainer){
        var timer = setInterval(function () {
          if (CGenClass.mainContainer) {
            updateCanvasSize(newWidth);
            clearInterval(timer);
          }
        }, 200);
      }else updateCanvasSize(newWidth);
    }
  }
}

function updateCanvasSize(newWidth){
  console.log("resize")
  var cdiff = 720/1280;
  newWidth = newWidth+400;
  var w = (newWidth >= 1280) ? 1280 : newWidth;
  var h = cdiff * w;
  document.getElementById("gameStage").width = (w >= 1280) ? 1280 : w;
  document.getElementById("gameStage").height = (h >= 720) ? 720 : h;

  CGenClass.mainContainer.scaleX = (w >= 1280) ? 1 : w/1280;
  CGenClass.mainContainer.scaleY = (h >= 720) ? 1 : h/720;
  CGenClass.mainContainer.x = w/2;
  CGenClass.mainContainer.y = h/2;

  document.getElementById("alertStage").width = (w >= 1280) ? 1280 : w;
  document.getElementById("alertStage").height = (h >= 720) ? 720 : h;
  CGenClass.alertMainContainer.scaleX = (w >= 1280) ? 1 : w/1280;
  CGenClass.alertMainContainer.scaleY = (h >= 720) ? 1 : h/720;
  CGenClass.alertMainContainer.x = w/2;
  CGenClass.alertMainContainer.y = h/2;
}
window.addEventListener('resize', function() {
  onResize(CGenClass.isMobile);
});

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

(function() {
	"use strict"
	// var socket = svy.Socket;
	var houseType = (CGenClass.isSBO) ? 1 : 0;
	var splitUrl = window.location.host.split('.');
	var path = splitUrl[1] + '.' + splitUrl[2];
	path = (splitUrl[0] == "192" && splitUrl[1] == "168") ? "338alab.com":path;
	var _RSO_ = "https://" + ((CGenClass.isMobile) ? "m.":"www.") + path;
	var maxPayout = document.getElementsByClassName("maxpayout")[0];
	// var CGenClass.delayBalanceUpdate = false;

	if (!CGenClass.isMobile) {
		// Clock
		setInterval(function() {
			var clock_time = new Date();
			var clock_day = clock_time.getDate();
			var clock_month = clock_time.getMonth();
			var clock_year = clock_time.getFullYear();
			var clock_hours = clock_time.getHours();
			var clock_minutes = clock_time.getMinutes();
			var clock_seconds = clock_time.getSeconds();
			var clock_GMT = clock_time.getTimezoneOffset();
			var clock_suffix = "";

			if (clock_hours < 10) {
				clock_hours = '0' + clock_hours;
			}

			if (clock_minutes < 10) {
				clock_minutes = '0' + clock_minutes;
			}

			if (clock_seconds < 10) {
				clock_seconds = '0' + clock_seconds;
			}

			if (clock_GMT < 0) {
				var sign = '+';
				var gmt = -(clock_GMT / 60);
			} else {
				var sign = '-';
				var gmt = (clock_GMT / 60);
			}

			var datetime = document.getElementById("datetime");
			if (datetime) datetime.innerHTML = clock_month + 1 + "/" + clock_day + "/" + clock_year + " " + clock_hours + ":" + clock_minutes + ' GMT ' + sign + gmt;
		}, 1000);

		var currency = document.getElementsByClassName("currency")[0];
		if (currency) currency.innerHTML = userData.exchangeRate.currencyCode + " ";
		if (houseType == 0) {
			var hideOnMin = document.getElementsByClassName("hide-on-min")[0];
			if (hideOnMin) hideOnMin.innerHTML = "Available Balance ";
			// External Buttons
			var links = [
				_RSO_ + "/statement",
				_RSO_ + "/balance",
				_RSO_ + "/gaming_rules/21",
				_RSO_ + "/help/1",
			]
			// Menu Translation
			var translation = {
				en: [
					'statement',
					'balance',
					'game guide',
					'help'
				],
				id: [
					'laporan',
					'saldo',
					'panduan permainan',
					'bantuan'
				],
				zh: [
					'å£°æ˜Ž',
					'å¹³è¡¡',
					'æ¸¸æˆæŒ‡å—',
					'æ•‘å‘½'
				]
			};

			var ul = document.getElementById("link");
			var menus = translation[userData.lang.toLowerCase()];
			menus.map(function(menu, index) {
				var list = document.createElement("li");
				var anchor = document.createElement("a");
				anchor.setAttribute("href", "javascript:createWindow('" + links[index] + "')");
				anchor.innerText = menu;
				list.appendChild(anchor);
				ul.appendChild(list);
			})

			var navButton = document.getElementsByClassName("mobile-nav")[0];
			navButton.onclick = function() {

				navEnabled = !navEnabled;
				if (navEnabled) {
					navigation.style.display = "block";
				} else {
					navigation.style.display = "none";
				}
			}

			var updateBalance = document.getElementById("update_balance");
			updateBalance.style.transition = "0.5s";
			var degree = 0;
			updateBalance.onclick = function() {
				if (LoadingClass.loadComplete) {
					if (!CGenClass.delayBalanceUpdate) {
						if(!CGameClass.isDrawingPhase) {
							CGenClass.delayBalanceUpdate = true;
							degree += 180;
							updateBalance.style.transform = `rotate(${degree}deg)`;
							socket.emit('get my balance');
						}
					}
				}
			};

			maxPayout.innerHTML = "Max Payout Per Bet: "+userData.exchangeRate.currencyCode+" "+computedMaxPayout.toLocaleString();
		} else if (houseType == 1) {
			// var uri = "";
			// document.getElementById("linkedBettingRules").addEventListener("click", () => {
			// 	createWindow(`http://${window.location.host}${uri}/headerDomain?param=bettingrules`, 955, 629);
			// });
			// document.getElementById("linkedHelp").addEventListener("click", () => {
			// 	createWindow(`http://${window.location.host}${uri}/headerDomain?param=help`, 955, 629);
			// });
			// document.getElementById("linkedStatement").addEventListener("click", () => {
			// 	createWindow(`http://${window.location.host}${uri}/headerDomain?param=statement`, 940, 619);
			// });
			// document.getElementById("linkedBalance").addEventListener("click", () => {
			// 	createWindow(`http://${window.location.host}${uri}/headerDomain?param=balance`, 640, 879);
			// });
			// maxPayout.innerHTML = "Max Payout Per Bet: "+userData.exchangeRate.currencyCode+" "+computedMaxPayout.toLocaleString();
			// var updateBalance = document.getElementById("update_balance");
			// updateBalance.onclick = function() {
			// 	if (LoadingClass.loadComplete) {
			// 		if (!CGenClass.delayBalanceUpdate) {
			// 			CGenClass.delayBalanceUpdate = true;
			// 			socket.emit('get my balance');
			// 		}
			// 	}
			// };
		}
	}


}());
var houseType = (CGenClass.isSBO) ? 1 : 0;
if (houseType == 0) {
	this.svy_announcement = this.svy_announcement || {};

	//##################################################
	// settings.js
	//##################################################
	var _hideRunningContainer = true; // Allow change display of container to none|block
	var _runningId = "rtext"; // Running text container id
	var _popupId = (CGenClass.isMobile) ? "savvy_ann_container" : "savvy_ann_container-popup"; // Popup container id

	if (_hideRunningContainer) {
		document.getElementById(_runningId).style.display = "none";
	}

	//##################################################
	// config.js
	//##################################################
	(function() {
		"use strict"

		function _CONFIG() {
			var host = window.location.host;
			var splitUrl = window.location.host.split('.');
			var path = splitUrl[1] + '.' + splitUrl[2];
			path = (splitUrl[0] == "192" && splitUrl[1] == "168") ? "338alab.com" : path;

			var rso = "announcement." + path;

			if ((splitUrl[1].substr(splitUrl[1].length - 3) === 'lab') || (splitUrl[0] == "192" && splitUrl[1] == "168")) {
				rso += ':3100';
			}

			return {
				connection: "https://" + rso,
			}
		}

		svy_announcement.Config = new _CONFIG;
	}());
	console.log("svy_announcement.Config", svy_announcement.Config);

	//##################################################
	// socket.js
	//##################################################
	(function() {
		"use strict"

		// function _SOCKET() {

		// 	var Config = svy_announcement.Config;
		// 	var socket = io(Config.connection, {
		// 		'reconnect': true,
		// 		'reconnection delay': 1000,
		// 		'max reconnection attempts': 30,
		// 		'secure': true,
		// 		'transports': ['websocket']
		// 	});


		// 	return {
		// 		on: function(eventName, callback) {
		// 			socket.on(eventName, callback);
		// 		},
		// 		emit: function(eventName, data, callback) {
		// 			socket.emit(eventName, data);
		// 		},
		// 	}

		// }

		// svy_announcement.Socket = new _SOCKET;
	}());
	// console.log("svy_announcement.Socket", svy_announcement.Socket);

	//##################################################
	// run.js
	//##################################################
	(function() {
		"use strict"

		function _RUN() {
			var self = this;
			self = {
				current: {
					onQueue: [], // Next on queue
					list: [], // Currently running
					index: 0,
					pos: 0,
					dur: 30, // Interval duration
					enabled: false, // Show or Hide announcement
					started: false, // If the announcement has already started

					display: null,
					domWrapper: null,
					domText: null,
					handler: null,

					close_table: false,
				},
				isMouseEnable: false,

				/*
				 * @Function: close
				 * @Description: close the running text
				 */
				close: function() {
					console.log("# Function: Announcements -> close");
					self.current.started = false;
					self.current.enabled = false;
					clearInterval(self.current.handler);

					self.onUpdate();
				},

				/*
				 * @Function: setAnnouncement
				 * @Description: create a new list of announcements
				 * @Param: [{Object}] list of announcements
				 */
				setAnnouncement: function(data) { // Set next list of announcements
					console.log("# Function: Announcements -> setAnnouncement =>", data);
					if (data.length < 1) {
						self.current.onQueue = [];
						self.refreshList();
					} else {
						if (!self.current.close_table) {
							self.current.onQueue = self.arrangeAnnouncements(data);
						}
					}
					self.createAnnouncement();
				},

				/*
				 * @Function: addAnnouncement
				 * @Description: add announcement to the current list
				 * @Param: [{Object}] new announcement
				 */
				addAnnouncement: function(data) { // Add announcement
					console.log("# Function: Announcements -> addAnnouncement =>", data);
					self.current.onQueue = self.current.onQueue.concat(data); // Add
					self.current.onQueue = self.arrangeAnnouncements(self.current.onQueue); // Re-arrange
					self.createAnnouncement();
				},

				/*
				 * @Function: removeOtherAnnouncements
				 * @Description: replace the list of announcements with a new one
				 * @Param: [{Object}] new set of announcements
				 */
				removeOtherAnnouncements: function(data) {
					console.log("# Function: Announcements -> removeOtherAnnouncements =>", data);
					self.current.close_table = true;
					self.current.list = [];
					self.current.onQueue = [];
					self.current.index = 0;

					self.current.enabled = true;
					self.current.onQueue.push(data);
					self.refreshList();
					self.startAnnouncement();

					// self.onUpdate();
				},

				/*
				 * @Function: arrangeAnnouncements
				 * @Description: sort the announcements based on priority
				 * @Param: [{Object}] list of announcements
				 */
				arrangeAnnouncements: function(data) {
					console.log("# Function: Announcements -> arrangeAnnouncements =>", data);
					data.sort(function(a, b) {
						return sortByPriority(a.priority) == sortByPriority(b.priority) ? b.time - a.time : sortByPriority(a.priority) - sortByPriority(b.priority);
					});
					return data;
				},

				/*
				 * @Function: refreshList
				 * @Description: replace the current list with the queue list
				 */
				refreshList: function() {
					console.log("# Function: Announcements -> refreshList");
					self.current.started = true;
					self.current.list = self.current.onQueue;
					self.current.onQueue = [];
				},

				/*
				 * @Function: createAnnouncement
				 * @Description: display the running text announcement
				 */
				createAnnouncement: function() {
					console.log("# Function: Announcements -> createAnnouncement");
					if (!self.current.started) { // Will run if the announcement is not yet running
						if (self.current.onQueue.length > 0) {
							self.refreshList();
						}
						self.current.index = 0; // Array index pointer
						self.current.pos = 0; // CSS x coordinate

						self.current.enabled = true;
						self.startAnnouncement();
					}
				},

				/*
				 * @Function: startAnnouncement
				 * @Description: animate the position of announcement
				 */
				startAnnouncement: function() {
					console.log("# Function: Announcements -> startAnnouncement");
					setTimeout(function() {
						if (self.current.list.length > 0) {
							self.current.display = self.current.list[self.current.index];
							self.onUpdate();

							self.current.domWrapper = document.getElementById("svy-announcement-wrapper");
							if (self.current.domWrapper) {
								self.current.domWrapper.style.transform = "translateX(" + self.current.pos + "px)";
								self.current.domText = document.getElementById("svy-announcement-text");
								if (self.current.close_table) {
									self.current.pos = -3;
								}

								clearInterval(self.current.handler);
								self.current.handler = setInterval(function() {
									if (Math.abs(self.current.pos) >= (self.current.domText.scrollWidth + self.current.domWrapper.clientWidth)) { // Text width + Visible container width
										self.resetAnnouncement();
										self.startAnnouncement();
									} else self.moveAnnouncement();
								}, self.current.dur);
							}
						} else {
							self.current.started = false;
							self.current.enabled = false;
							clearInterval(self.current.handler)

							self.onUpdate();
						}
					});
				},

				/*
				 * @Function: resetAnnouncement
				 * @Description: reset the position of announcement to default
				 */
				resetAnnouncement: function() {
					console.log("# Function: Announcements -> resetAnnouncement");
					clearInterval(self.current.handler);
					self.current.pos = 0;

					if ((self.current.index + 1) >= self.current.list.length) {
						self.current.index = 0;
						self.getNewAnnouncements();
					} else self.current.index += 1;
				},

				/*
				 * @Function: moveAnnouncement
				 * @Description: move the position of announcement
				 */
				moveAnnouncement: function() { // Move announcement
					// console.log("# Function: Announcements -> moveAnnouncement");
					self.current.pos -= ((self.isMouseEnable) ? 1.5 : ((self.current.close_table) ? 1.5 : 3));
					self.current.domWrapper.style.transform = "translateX(" + self.current.pos + "px)";
					self.updateAnnouncementTime();
				},

				/*
				 * @Function: isMouseOver
				 * @Description: change the status of mouse over flag
				 * @Param: {Number} status
				 */
				isMouseOver: function(status) {
					console.log("# Function: Announcements -> isMouseOver");
					self.isMouseEnable = status == 1 ? true : false;
				},

				/*
				 * @Function: updateAnnouncementTime
				 * @Description: update the remaining time of announcement
				 */
				updateAnnouncementTime: function() { // Update all announcements time
					// console.log("# Function: Announcements -> updateAnnouncementTime");
					for (var i = 0; i < self.current.list.length; i++) {
						var announcement = self.current.list[i];
						announcement.time -= self.current.dur;
					}
				},

				/*
				 * @Function: getNewAnnouncements
				 * @Description: get the new list of announcements
				 */
				getNewAnnouncements: function() { // Get new list of announcements
					console.log("# Function: Announcements -> getNewAnnouncements");
					var newList = [];
					if (self.current.onQueue.length > 0) {
						self.refreshList();
					} else {
						for (var i = 0; i < self.current.list.length; i++) {
							var announcement = self.current.list[i];
							if (announcement.time > 0) {
								newList.push(announcement);
							}
						}
						self.current.list = newList;
					}
				},

				/*
				 * @Function: onUpdate
				 * @Description: change the display of container to none|block, updates the text display
				 */
				onUpdate: function() {
					if (_hideRunningContainer) {
						var rContainer = document.getElementById(_runningId);
						rContainer.style.display = (self.current.enabled) ? "block" : "none";
					}

					var run = document.getElementsByClassName("svy-announcement-cont")[0];
					run.style.display = (self.current.enabled) ? "block" : "none";

					var txt = document.getElementById("svy-announcement-text");
					txt.innerHTML = self.current.display.txt;
				},
			}
			return self;
		}

		svy_announcement.Run = new _RUN;
	}());

	//##################################################
	// Template : Running Text
	//##################################################
	var elemRunningText = document.createElement("elemRunningText");
	elemRunningText.innerHTML =
		"<div id='annDiv' class='svy-announcement-cont' style='display: none;'>" +
		"	<div class='svy-announcement-wrapper'>" +
		"		<div class='svy-announcement-label-cont'>" +
		"			<div class='svy-announcement-label-wrapper'>" +
		"				<div class='svy-announcement-label'>ANNOUNCEMENT</div>" +
		"			</div>" +
		"		</div>" +
		"		<div class='svy-announcement-message-cont' onmouseover='svy_announcement.Run.isMouseOver(1)' onmouseleave='svy_announcement.Run.isMouseOver(0)'>" +
		"			<div id ='svy-announcement-wrapper' class='svy-announcement-message-wrapper'>" +
		"				<div class='svy-announcement-message'>" +
		"					<div id='svy-announcement-text'></div>" +
		"				</div>" +
		"			</div>" +
		"		</div>" +
		"		<div class='svy-announcement-close-cont' onclick='svy_announcement.Run.close()'>" +
		"			<div class='svy-announcement-close-wrapper'>" +
		"				<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>" +
		"					<path d='M19.3332 2.54663L17.4532 0.666626L9.99984 8.11996L2.5465 0.666626L0.666504 2.54663L8.11984 9.99996L0.666504 17.4533L2.5465 19.3333L9.99984 11.88L17.4532 19.3333L19.3332 17.4533L11.8798 9.99996L19.3332 2.54663Z' fill='#FFC500'/>" +
		"				</svg>" +
		"			</div>" +
		"		</div>" +
		"	</div>" +
		"</div>";

	document.getElementById(_runningId).appendChild(elemRunningText);


	//##################################################
	// popup.js
	//##################################################
	(function() {
		"use strict"

		function _POPUP() {
			var _POP, _LOCAL = localStorage;
			var Config = svy_announcement.Config;

			var self = this;
			self = {
				current: {
					pointer: 0,
					onQueue: [], // Next on queue
					list: [], // Currently running
					enabled: false, // Show or Hide announcement
					localStorageName: null,
					activePopup: null, // Active pop up
				},

				/*
				 * @Function: setPopup
				 * @Description: create new list of pop ups
				 * @Param: [{Object}] pop ups
				 */
				setPopup: function(data) { // Set next list of announcements
					console.log("# Function: Popup -> setPopup =>", data);
					self.current.onQueue = self.arrangeAnnouncements(data);

					self.current.localStorageName = userData.clientID ? calcMD5(userData.clientID) : 'guan';

					self.checkExpiration();
				},

				/*
				 * @Function: addPopup
				 * @Description: add pop up to the list
				 * @Param: {Object} new pop up
				 */
				addPopup: function(pop) {
					console.log("# Function: Popup -> addPopup =>", pop);
					pop.sort(function(a, b) {
						return sortByPriority(a.priority) == sortByPriority(b.priority) ? b.close_seconds - a.close_seconds : sortByPriority(a.priority) - sortByPriority(b.priority);
					}).map(function(d) {
						self.current.list.push(d);
					});

					var a = self.current.list.filter(function(g) {
						return g.close_seconds > 0;
					})

					if (!a.length) {
						this.setPopup(self.current.list);
					}
				},

				/*
				 * @Function: arrangeAnnouncements
				 * @Description: sort the pop up announcement
				 * @Param: [{Object}] list of announcements
				 */
				arrangeAnnouncements: function(data) {
					console.log("# Function: Popup -> arrangeAnnouncements =>", data);
					data.sort(function(a, b) {
						return sortByPriority(a.priority) == sortByPriority(b.priority) ? b.close_seconds - a.close_seconds : sortByPriority(a.priority) - sortByPriority(b.priority);
					});
					return data;
				},

				/*
				 * @Function: checkExpiration
				 * @Description: check the expiration date of announcement if still valid, remove if not
				 */
				checkExpiration: function() {
					console.log("# Function: Popup -> checkExpiration");
					self.current.onQueue.map(function(g) {
						var h = _LOCAL.getItem("ann_" + g.id); // Find announcement if exist
						if (!h) {
							return;
						} else {
							h = JSON.parse(h);
							console.log(new Date());
							var x = h.filter(function(t) {
								if (new Date(t.pDv) - new Date() >= 0) {
									return t
								} else {
									// expired
								}
							});
							if (!x.length) _LOCAL.removeItem("ann_" + g.id);
							else _LOCAL.setItem("ann_" + g.id, JSON.stringify(x));
						}
					});
					self.createPopup();
				},

				/*
				 * @Function: createPopup
				 * @Description: create display of pop up
				 */
				createPopup: function() {
					console.log("# Function: Popup -> createPopup");
					self.current.enabled = true;
					self.onUpdate(1);

					self.current.activePopup = self.current.onQueue.filter(function(g) {
						return g.close_seconds > 0;
					}).find(function(g) {
						var e = JSON.parse(_LOCAL.getItem("ann_" + g.id));

						if (e) {
							var found = e.find(function(d) {
								return d.pNm == self.current.localStorageName;
							});
							// g.imgSrc = $sce.trustAsResourceUrl(Config.connection+"/upload_popup/"+g.languageFolderUpload+"/"+g.path);
							// console.log("# Create Image (e):",g.imgSrc);

							// g.hide = false;
							// _POP = $timeout(self.getNextPopup,g.close_seconds);
							g.imgSrc = Config.connection + "/upload_popup/" + g.languageFolderUpload + "/" + g.path;
							// g.imgSrc = rsPath + "/images/ann.png"
							document.getElementsByClassName("svy-popup-image")[0].setAttribute('src', g.imgSrc);
							g.hide = false;
							_POP = setTimeout(self.getNextPopup, g.close_seconds);

							return g.close_seconds && !found;
						} else {
							// g.imgSrc = $sce.trustAsResourceUrl(Config.connection+"/upload_popup/"+g.languageFolderUpload+"/"+g.path);
							// console.log("# Create Image (!e):",g.imgSrc);

							// g.hide = false;

							// _POP = $timeout(self.getNextPopup,g.close_seconds);
							g.imgSrc = Config.connection + "/upload_popup/" + g.languageFolderUpload + "/" + g.path;
							// g.imgSrc = rsPath + "/images/ann.png"
							document.getElementsByClassName("svy-popup-image")[0].setAttribute('src', g.imgSrc);
							g.hide = false;
							_POP = setTimeout(self.getNextPopup, g.close_seconds);

							return g.close_seconds;
						}
					});
					console.log("# CURRENT.ACTIVEPOPUP:", self.current.activePopup);
					console.log("AKTIB", self.current.activePopup);
					self.onUpdate(2);
					if (!self.current.activePopup) self.current.enabled = false;
					else return self.current.enabled = true;

				},

				/*
				 * @Function: getNextPopup
				 * @Description: get the next pop up on list
				 */
				getNextPopup: function() {
					console.log("# Function: Popup -> getNextPopup");
					// $timeout.cancel(_POP);
					clearTimeout(_POP);
					if (!self.current.activePopup) return;
					self.closePopup(false);
					self.current.activePopup.close_seconds = 0;

					var ff = setTimeout(function() {
						if (!self.createPopup()) {
							if (self.current.list.length) {

								self.closePopup(true);
								return self.setPopup(_ann.current.list);
							} else {
								return self.closePopup(true);
							}
						}
					}, 100);
				},

				/*
				 * @Function: closePopup
				 * @Description: close pop up if status is true
				 * @Param: {Boolean} true or false
				 */
				closePopup: function(status) {
					console.log("# Function: Popup -> closePopup");
					if (status) self.hidePopupAnnouncement();
				},

				/*
				 * @Function: hidePopupAnnouncement
				 * @Description: hide the current pop up, add to local storage if 'Do not show it again' is checked
				 */
				hidePopupAnnouncement: function() { // Add to local storage if 'Do not show it again' is clicked
					console.log("# Function: Popup -> hidePopupAnnouncement");
					self.onUpdate(3);
					var g = self.current.onQueue.filter(function(a) {
						return a.hide;
					}).map(function(b) {
						var temp = [];
						var localStor = _LOCAL.getItem('ann_' + b.id);
						if (!localStor) {
							temp.push({
								pNm: self.current.locStorName,
								pDv: self.createExpiration()
							});
							_LOCAL.setItem('ann_' + b.id, JSON.stringify(temp));
						} else {
							var x = JSON.parse(localStor).find(function(p) {
								if (p.pNm == self.current.localStorageName) return p;
							});
							if (!x) {
								var y = JSON.parse(localStor);
								y.push({
									pNm: self.current.localStorageName,
									pDv: self.createExpiration()
								});
								_LOCAL.setItem('ann_' + b.id, JSON.stringify(y));
							}
						}
						return b;
					});
				},

				/*
				 * @Function: createExpiration
				 * @Description: create expiration date
				 */
				createExpiration: function() {
					var a = new Date();
					var b = a.getDate() + 1;
					a.setDate(b);
					return a;
				},

				/*
				 * @Function: onCheck
				 * @Description: toggle hide/show state of active pop up
				 */
				onCheck: function() {
					self.current.activePopup.hide = !self.current.activePopup.hide;
				},

				/*
				 * @Function: onUpdate
				 * @Description: change the display of container to none|block, updates the image display
				 */
				onUpdate: function(d) {
					var popup = document.getElementsByClassName("svy-announcement-popup-cont")[0];
					popup.style.display = (self.current.enabled) ? "block" : "none";

					var popupImage = document.getElementsByClassName("svy-popup-image")[0];
					var popupDisableLabel = document.getElementsByClassName("svy-announcement-popup-disable-label")[0];
					console.log("onUpdate", self.current.activePopup, d)
					if (self.current.activePopup) {
						popupImage.src = self.current.activePopup.imgSrc;
						popupDisableLabel.innerHTML = self.current.activePopup.msgLanguage;
					}
				},
			}
			return self;
		}

		svy_announcement.Popup = new _POPUP;
	}());

	//##################################################
	// Template : Pop Up
	//##################################################
	var elemPopUp = document.createElement("elemPopUp");
	elemPopUp.innerHTML =
		"<div class='svy-announcement-popup-cont' style='display: none;'>" +
		"	<div class='svy-announcement-popup-bg'></div>" +
		"	<div class='svy-announcement-popup-wrapper'>" +
		"		<div class='svy-announcement-popup-header-cont'>" +
		"			<div class='svy-announcement-popup-disable-cont'>" +
		"				<div class='svy-announcement-popup-check'>" +
		"					<input type='checkbox' onclick='svy_announcement.Popup.onCheck()'>" +
		"				</div>" +
		"				<div class='svy-announcement-popup-disable-label'></div>" +
		"			</div>" +
		"			<div class='svy-announcement-popup-label '>ANNOUNCEMENT</div>" +
		"			<div class='svy-announcement-popup-close-cont' onclick='svy_announcement.Popup.getNextPopup()'>" +
		"				<div class='svy-announcement-popup-close-wrapper'>" +
		"					<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>" +
		"						<path d='M19.3332 2.54663L17.4532 0.666626L9.99984 8.11996L2.5465 0.666626L0.666504 2.54663L8.11984 9.99996L0.666504 17.4533L2.5465 19.3333L9.99984 11.88L17.4532 19.3333L19.3332 17.4533L11.8798 9.99996L19.3332 2.54663Z' fill='#FFC500'/>" +
		"					</svg>" +
		"				</div>" +
		"			</div>" +
		"		</div>" +
		"		<div class='svy-announcement-popup-body-cont'>" +
		"			<img class='svy-popup-image'>" +
		"		</div>" +
		"	</div>" +
		"</div>";

	document.getElementById(_popupId).appendChild(elemPopUp);

	//##################################################
	// listener
	//##################################################
	(function() {
		"use strict"

		// var socket = svy_announcement.Socket;
		// var Run = svy_announcement.Run;
		// var Popup = svy_announcement.Popup;

		// var param = {
		// 	'clientID': userData.clientID || null,
		// 	'tableName': null,
		// 	'statusLoad': true,
		// 	'language': userData.lang || en,
		// 	'pageName': 'Dragon Tiger Multiplayer'
		// };

		// socket.emit('findAnnByPage', param);

		// socket.on('runResult', function(data) {
		// 	Run.setAnnouncement(data);
		// });
		// socket.on('broadcastAnnouncement', function(data) {
		// 	var announcement = data.txt;
		// 	var match = announcement.toLowerCase().match(/table will be closed/g);
		// 	data.priority = 'High';
		// 	if (match) {
		// 		data.time = 604800000;
		// 		Run.removeOtherAnnouncements(data);
		// 	} else {
		// 		Run.addAnnouncement([data]);
		// 	}
		// });
		// socket.on('changeRun', function() {
		// 	param.statusLoad = false;
		// 	socket.emit('findAnnByPage', param);
		// });
		// socket.on('popupResult', function(data) {
		// 	if(data.length < 1) return false;
		// 	var timer = setInterval(function () {
		// 	  if (LoadingClass.loadComplete) {
		// 		Popup.setPopup(data);
		// 	    clearInterval(timer);
		// 	  }
		// 	}, 200);
		// });
		// socket.on('addPopup', function(engRes, indRes) {
		// 	if (userData.lang == 'id') {
		// 		Popup.addPopup(indRes);
		// 	} else {
		// 		Popup.addPopup(engRes);
		// 	}
		// });

		/*****
		//  * TESTING PURPOSES
		//  *****/
		// setTimeout(function(){
		// console.log("##### ANNOUNCEMENT : TEST MODE ENABLED #####");
		// var data = [
		// // {priority: "Low", txt: "Splash!", time: 20000},
		// {priority: "High",txt:"1 ) Kami hendak menginformasikan bahwa saat ini casino sedang melakukan maintenance. Silahkan mencoba log-in kembali pada pukul 2:30 PM  (GMT+8). Terima kasih atas pengertiannya.Silahkan mencoba log-in kembali pada pukul 2:30 PM  (GMT+8).", time: 100000000},
		// // {priority: "Medium", txt:"##########", time: 3000},
		// // {priority: "High", txt: "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@SSS", time: 50000},
		// // {priority: "Medium", txt: "xxxxxxxxxxxx!", time: 10000},
		// // {priority: "High",txt:"1 ) Kami hendak menginformasikan bahwa saat ini casino sedang melakukan maintenance. Silahkan mencoba log-in kembali pada pukul 2:30 PM  (GMT+8). Terima kasih atas pengertiannya.Silahkan mencoba log-in kembali pada pukul 2:30 PM  (GMT+8).", time: 40000},
		// // {priority: "High",txt:"2 ) Terima kasih atas pengertiannya. menjisap bola saya . kontol goyang !!", time: 30000},
		// // {priority: "High", txt:" 3) *********************************************", time : 50000 },
		// // {priority: "Low", txt : "Kilomet, Kilometro layooooooooo", time: 10000000}
		// ];
		// Run.setAnnouncement(data);
		// // setTimeout(function(){
		// // var data = {};
		// // data.txt = "WOOOOOOOOOOOOOO"
		// // data.priority = 'High';
		// // data.time = 604800000;
		// // Run.removeOtherAnnouncements(data);
		// }, 5000)

		// setTimeout(function(){
		// console.log("##### ANNOUNCEMENT : TEST MODE ENABLED #####");
		// var data = [
		// {priority: "Low", txt: "Splash!", time: 20000},
		// {priority: "High",txt:"1 ) Kami hendak menginformasikan bahwa saat ini casino sedang melakukan maintenance. Silahkan mencoba log-in kembali pada pukul 2:30 PM  (GMT+8). Terima kasih atas pengertiannya.Silahkan mencoba log-in kembali pada pukul 2:30 PM  (GMT+8).", time: 40000},
		// // {priority: "Medium", txt:"##########", time: 3000},
		// // {priority: "High", txt: "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@SSS", time: 50000},
		// // {priority: "Medium", txt: "xxxxxxxxxxxx!", time: 10000},
		// // {priority: "High",txt:"1 ) Kami hendak menginformasikan bahwa saat ini casino sedang melakukan maintenance. Silahkan mencoba log-in kembali pada pukul 2:30 PM  (GMT+8). Terima kasih atas pengertiannya.Silahkan mencoba log-in kembali pada pukul 2:30 PM  (GMT+8).", time: 40000},
		// // {priority: "High",txt:"2 ) Terima kasih atas pengertiannya. menjisap bola saya . kontol goyang !!", time: 30000},
		// // {priority: "High", txt:" 3) *********************************************", time : 50000 },
		// // {priority: "Low", txt : "Kilomet, Kilometro layooooooooo", time: 10000000}
		// ];
		// Run.setAnnouncement(data);
		// setTimeout(function(){
		// Run.removeOtherAnnouncements({priority: "Low", txt: "STAPH!", time: 10000});
		// setTimeout(function(){
		// Run.addAnnouncement([{priority: "Low", txt: "AAAAAAAAAA!", time: 10000}]);
		// }, 30000);
		// }, 10000);
		// }, 5000);
		// }, 5000);

		// setTimeout(function(){
		// var data = [
		// {
		// "id" : "2",
		// "languageFolderUpload" : "indonesian",
		// "msgLanguage" : "Jangan tampilkan lagi",
		// "path" : "1574383364000_3.jpg",
		// "close_seconds" : 10000000,
		// "priority" : "Low"
		// },
		// // {
		// // "id" : "3",
		// // "languageFolderUpload" : "english",
		// // "msgLanguage" : "Do Not Show Again",
		// // "path" : "6.jpg",
		// // "close_seconds" : 5000,
		// // "priority" : "Low"
		// // },
		// // {
		// // "id" : "4",
		// // "languageFolderUpload" : "indonesian",
		// // "msgLanguage" : "Jangan tampilkan lagi",
		// // "path" : "2.png",
		// // "close_seconds" : 5000,
		// // "priority" : "Low"
		// // },
		// // {
		// // "id" : "1",
		// // "languageFolderUpload" : "english",
		// // "msgLanguage" : "Do Not Show Again",
		// // "path" : "5.jpg",
		// // "close_seconds" : 5000,
		// // "priority" : "High"
		// // },
		// ];
		// Popup.setPopup(data);
		// },5000);
	}());

	//##################################################
	// functions.js
	//##################################################
	var hex_chr = "0123456789abcdef";

	function rhex(num) {
		var str = "";
		for (var j = 0; j <= 3; j++)
			str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
			hex_chr.charAt((num >> (j * 8)) & 0x0F);
		return str;
	}

	/*
	 * Convert a string to a sequence of 16-word blocks, stored as an array. Append
	 * padding bits and the length, as described in the MD5 standard.
	 */
	function str2blks_MD5(str) {
		var nblk = ((str.length + 8) >> 6) + 1;
		var blks = new Array(nblk * 16);
		for (var i = 0; i < nblk * 16; i++)
			blks[i] = 0;
		for (var i = 0; i < str.length; i++)
			blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
		blks[i >> 2] |= 0x80 << ((i % 4) * 8);
		blks[nblk * 16 - 2] = str.length * 8;
		return blks;
	}

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally to
	 * work around bugs in some JS interpreters.
	 */
	function add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left
	 */
	function rol(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
	 * These functions implement the basic operation for each round of the
	 * algorithm.
	 */
	function cmn(q, a, b, x, s, t) {
		return add(rol(add(add(a, q), add(x, t)), s), b);
	}

	function ff(a, b, c, d, x, s, t) {
		return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}

	function gg(a, b, c, d, x, s, t) {
		return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function hh(a, b, c, d, x, s, t) {
		return cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function ii(a, b, c, d, x, s, t) {
		return cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	 * Take a string and return the hex representation of its MD5.
	 */
	function calcMD5(str) {
		var x = str2blks_MD5(str);
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;

		for (var i = 0; i < x.length; i += 16) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;

			a = ff(a, b, c, d, x[i + 0], 7, -680876936);
			d = ff(d, a, b, c, x[i + 1], 12, -389564586);
			c = ff(c, d, a, b, x[i + 2], 17, 606105819);
			b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
			a = ff(a, b, c, d, x[i + 4], 7, -176418897);
			d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
			c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
			b = ff(b, c, d, a, x[i + 7], 22, -45705983);
			a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
			d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
			c = ff(c, d, a, b, x[i + 10], 17, -42063);
			b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
			d = ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

			a = gg(a, b, c, d, x[i + 1], 5, -165796510);
			d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
			c = gg(c, d, a, b, x[i + 11], 14, 643717713);
			b = gg(b, c, d, a, x[i + 0], 20, -373897302);
			a = gg(a, b, c, d, x[i + 5], 5, -701558691);
			d = gg(d, a, b, c, x[i + 10], 9, 38016083);
			c = gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = gg(b, c, d, a, x[i + 4], 20, -405537848);
			a = gg(a, b, c, d, x[i + 9], 5, 568446438);
			d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
			c = gg(c, d, a, b, x[i + 3], 14, -187363961);
			b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
			a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
			d = gg(d, a, b, c, x[i + 2], 9, -51403784);
			c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
			b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = hh(a, b, c, d, x[i + 5], 4, -378558);
			d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
			c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
			b = hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
			d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
			c = hh(c, d, a, b, x[i + 7], 16, -155497632);
			b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = hh(a, b, c, d, x[i + 13], 4, 681279174);
			d = hh(d, a, b, c, x[i + 0], 11, -358537222);
			c = hh(c, d, a, b, x[i + 3], 16, -722521979);
			b = hh(b, c, d, a, x[i + 6], 23, 76029189);
			a = hh(a, b, c, d, x[i + 9], 4, -640364487);
			d = hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = hh(c, d, a, b, x[i + 15], 16, 530742520);
			b = hh(b, c, d, a, x[i + 2], 23, -995338651);

			a = ii(a, b, c, d, x[i + 0], 6, -198630844);
			d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
			c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = ii(b, c, d, a, x[i + 5], 21, -57434055);
			a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
			d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
			c = ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
			a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
			d = ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
			b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
			a = ii(a, b, c, d, x[i + 4], 6, -145523070);
			d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = ii(c, d, a, b, x[i + 2], 15, 718787259);
			b = ii(b, c, d, a, x[i + 9], 21, -343485551);

			a = add(a, olda);
			b = add(b, oldb);
			c = add(c, oldc);
			d = add(d, oldd);
		}
		return rhex(a) + rhex(b) + rhex(c) + rhex(d);
	};

	function sortByPriority(d) {
		switch (d.toLowerCase()) {
			case 'high':
				return 1;
			case 'low':
				return 3;
			default:
				return 2;
		}
	}

}
})();