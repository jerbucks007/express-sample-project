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