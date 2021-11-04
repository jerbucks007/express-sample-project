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