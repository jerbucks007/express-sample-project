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
