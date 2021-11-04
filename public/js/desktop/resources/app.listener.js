
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