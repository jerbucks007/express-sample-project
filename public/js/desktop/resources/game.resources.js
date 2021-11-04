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