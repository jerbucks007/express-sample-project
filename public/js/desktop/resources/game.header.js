
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