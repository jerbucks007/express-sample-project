var Sound = function(){
	this.loadState = { count: 0, state: false};
	this.audio = {};
	// this.mute = false;
	this.mute = userData.isMuted;
	this.isIntroDone = false;
	this.isIntroStarted = false;
};

Sound.prototype.playAudio = function(name){
	if(!LoadingClass.loadComplete) return false;
	var self = this;
	if (self.audio[name] === undefined || self.audio[name] === null) return false;
	if (self.mute) {
		self.audio[name].volume = 0;
		self.audio[name].stop();
	} else {
		self.audio[name].volume = 1;
		self.audio[name].play();
		console.log("playaudio", name);
	}
};

Sound.prototype.toggleMute = function(){
	var self = this;
	self.mute = !self.mute;
	Howler.mute(self.mute);
	self.playIntro();
};

Sound.prototype.playIntro = function(){
	if(!LoadingClass.loadComplete) return false;
	var self = this;
	if(!self.isIntroDone && !self.isIntroStarted){
		if(!self.mute){
			console.log("intro", self.audio["intro"].playing())
			if (!self.audio["intro"].playing()) {
				self.audio["intro"].volume = 1;
				self.playAudio("intro");
			}
		} else {
			self.audio["intro"].volume = 0;
			self.audio["intro"].stop();
		}

		self.isIntroStarted = true;

		setTimeout(function(){
			self.isIntroDone = true;
			self.playBg();
			console.log("intro end", self.audio["bg"].playing())
		}, 65500);
	}
};

Sound.prototype.playBg = function(){
	if(!LoadingClass.loadComplete) return false;
	var self = this;
	if(!self.mute){
		console.log("bg", self.audio["bg"].playing())
		if (!self.audio["bg"].playing()) {
			self.audio["bg"].volume = 1;
			self.playAudio("bg");
		}
	} else {
		self.audio["bg"].volume = 0;
		self.audio["bg"].stop();
	}

	self.audio["bg"].on('end', function(){
		console.log("bg end")
	});
};

Sound.prototype.playSprite = function(name, sprite){
	if(!LoadingClass.loadComplete) return false;
	var self = this;
	if (self.audio[name] === undefined || self.audio[name] === null) return false;
	if (self.mute) {
		self.audio[name].volume = 0;
		self.audio[name].stop();
	} else {
		self.audio[name].volume = 1;
		self.audio[name].play(sprite);
		console.log("PLAYSPRITE", name, sprite, self.audio[name])
	}
};

Sound.prototype.clearSound = function(){
	this.loadState = { count: 0, state: false};
	this.audio = {};
	this.mute = false;
	this.isIntroDone = false;
	this.isIntroStarted = false;
};

var SoundClass = new Sound();