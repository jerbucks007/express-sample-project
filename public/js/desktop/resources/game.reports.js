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