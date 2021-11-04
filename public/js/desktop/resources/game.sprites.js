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