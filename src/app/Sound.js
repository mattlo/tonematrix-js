var Sound = (function () {
	
	/**
	 * @constructor
	 * @param {AudioContext} context
	 * @param {AudioBuffer} buffer
	 */
	function Sound (context, buffer) {
		this.context = context;
		this.buffer = buffer;
		
		this.setEnableSound(false);
	}
	
	Sound.prototype = {
		/**
		 * Plays sound
		 * @returns {undefined}
		 */
		play: function () {
			if (this.enableSound === true) {
				this.source = this.context.createBufferSource();
				this.source.buffer = this.buffer;
				this.source.connect(this.context.destination);
				this.source.start(0);
			}
		},
		/**
		 * @param {Boolean} value
		 * @returns {undefined}
		 */
		setEnableSound: function (value) {
			this.enableSound = value;
		}
	};
	
	return Sound;
}());