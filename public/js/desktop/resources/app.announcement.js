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