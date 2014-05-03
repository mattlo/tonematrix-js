var SoundMatrixUi = (function () {
	// resolve audio API
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
	} catch (e) {
		alert('Web Audio API is not supported in this browser');
	}
	
	return {
		/**
		 * @type {Number}
		 */
		duration: 2000,
		/**
		 * @type {HTMLElement}
		 */
		container: document.querySelector('.matrix'),
		/**
		 * @type {Number}
		 */
		columns: 16,
		/**
		 * @type {Array}
		 */
		sounds: [],
		/**
		 * @type {AudioContext}
		 */
		audioContext: new AudioContext(),
		/**
		 * Initializer
		 * @returns {undefined}
		 */
		init: function () {
			this.loadSounds();
		},
		/**
		 * Loads sounds
		 * @returns {undefined}
		 */
		loadSounds: function () {
			var _this = this,
				bufferLoader = new BufferLoader (
					this.audioContext,
					[
						'src/assets/sounds/232002__danmitch3ll__xylophone-c.wav',
						'src/assets/sounds/232008__danmitch3ll__xylophone-d1.wav',
						'src/assets/sounds/232007__danmitch3ll__xylophone-e1.wav',
						'src/assets/sounds/232006__danmitch3ll__xylophone-f.wav',
						'src/assets/sounds/232005__danmitch3ll__xylophone-g.wav',
						'src/assets/sounds/232004__danmitch3ll__xylophone-a.wav',
						'src/assets/sounds/232003__danmitch3ll__xylophone-b.wav',
						'src/assets/sounds/232001__danmitch3ll__xylophone-c2.wav',
					],
					// success callback
					function (bufferList) {
						// iterate over buffer list
						bufferList.forEach(function (audioBuffer) {
							// push new sound row and create columns
							_this.sounds.push(function () {
								var columns = [],
									i;
								
								for (i = 0; i < _this.columns; ++i) {
									columns.push(new Sound(_this.audioContext, audioBuffer));
								}
								
								return columns;
							}());
						});
						
						_this.loadApp();
					}
				);

			bufferLoader.load();
		},
		/**
		 * Initilizes after assets are loaded
		 * @returns {undefined}
		 */
		loadApp: function () {
			var _this = this;
			
			this.sounds.forEach(function (row, rowIndex) {
				var div = _this.renderRow();
				
				row.forEach(function (sound, colIndex) {
					
					div.appendChild(_this.renderColumn(sound));
					
				});
			});
			
			// begin beat
			this.beat(0);
		},
		/**
		 * @returns {HTMLElement}
		 */
		renderRow: function () {
			var div = document.createElement('div');
			
			div.className = 'row';
			
			this.container.appendChild(div);
			
			return div;
		},
		/**
		 * @param {Sound} sound
		 * @returns {HTMLElement}
		 */
		renderColumn: function (sound) {
			var div = document.createElement('div');
			
			div.className = 'col';
			
			div.addEventListener('click', function () {
				if (sound.enableSound === true) {
					div.className = div.className.replace(' active', '');
					sound.setEnableSound(false);
				} else {
					div.className = div.className + ' active';
					sound.setEnableSound(true);
				}
			}, false);
			
			return div;
		},
		/**
		 * Recursive timer
		 * @param {index} index
		 * @returns {undefined}
		 */
		beat: function (index) {
			var _this = this;
			
			setTimeout(function () {
				// iterate each row
				_this.sounds.forEach(function (soundList) {
					// find correct column
					soundList[index].play();
				});
				
				_this.beat(index >= _this.columns - 1 ? 0 : ++index);
			}, (this.duration / (_this.columns - 1)) + (index === 0 ? 1000 : 0));
		}
	};
}());