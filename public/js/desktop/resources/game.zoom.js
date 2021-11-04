/* Prevent HTML Zoom */
	var isCtrlHold = false;
	document.addEventListener('keydown', function(event){
		var event = event || window.event;
		var keycode = event.which || event.keyCode;
		if (keycode == 17) {
			isCtrlHold = true;
		}

		/* ctrl + decrement */
		if (isCtrlHold && event.which == 109 || isCtrlHold && event.which == 189) {
			event.preventDefault(); //prevent browser from the default behavior
			event.stopPropagation();
		}
		/* ctrl + increment */
		if (isCtrlHold && event.which == 107 || isCtrlHold && event.which == 187) {
			event.preventDefault(); //prevent browser from the default behavior
			event.stopPropagation();
		}
	});

	document.addEventListener('keyup', function(event){
		console.log("KEYUP", event)
		if(event.keyCode === 17){
			isCtrlHold = false;
		}
	});

	document.addEventListener('wheel', function(event) {
		if(isCtrlHold){
			event.preventDefault();
			event.stopPropagation();
		}
	}, {
		passive: false // Add this
	});


	/* prevention zoom in/out but have bug in scrool + pinch */
	document.addEventListener('gesturestart', function(event) {
		if(isCtrlHold){
			event.preventDefault();
			event.stopPropagation();
		}
	}, {
		passive: false // Add this
	});
	////zooom end