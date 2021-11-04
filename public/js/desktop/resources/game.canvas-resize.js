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
