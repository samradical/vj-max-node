// app dependencies
var App = require('../app');

// define module
App.module('Utils', function(Utils, App, Backbone, Marionette, $, _) {

	Utils.TOKEN_REGEX = /\{\{.*\}\}/;
	Utils.CAPITALISE_FIRST_LETTER = /^[a-z]/;

	Utils.urlParams = function(string) {
		if(_.isObject(string)){
			return string;
		}
		var authUrl = string.redirect || string;
		var pairs = authUrl.split('&');
		var result = {};
		pairs.forEach(function(pair) {
			pair = pair.split('=');
			result[pair[0]] = decodeURIComponent(pair[1] || '');
		});

		return JSON.parse(JSON.stringify(result));
	};

	Utils.replaceToken = function(string, withWhat) {
		return string.replace(this.TOKEN_REGEX, withWhat);
	};

	Utils.replaceTokens = function(string, tokens) {
		for (var key in tokens) {
			string = Utils.replaceAll(string, '{{' + key + '}}', tokens[key]);
		}
		return string;
	};

	Utils.escapeRegExp = function(string) {
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	};

	Utils.replaceAll = function(string, find, replace) {
		return string.replace(new RegExp(Utils.escapeRegExp(find), 'g'), replace);
	};
	//----------
	// URL PARSING
	//----------

	Utils.getParameterByName = function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	};

	/*
	To get the folder name from product name
	*/
	Utils.productNameToFolderName = function(productName) {
		if (!productName) return productName;
		productName = productName.toLowerCase();
		return replaceSpacesWith(productName, "_");
	};

	Utils.productNameToSlug = function(productName) {
		if (!productName) return productName;
		productName = productName.toLowerCase();
		return replaceSpacesWith(productName, "-");
	};

	function replaceSpacesWith(string, withWhat) {
		return string.replace(/\040/, withWhat);
	};

	Utils.getProductSlug = function() {
		var frag = Backbone.history.fragment.split("/");
		if (frag.length < 4) {
			return null;
		}
		y
		return frag[3];
	};

	Utils.getSerieImageSrc = function(serieId, imageIndex, addOrigin) {
		if (!imageIndex) {
			imageIndex = 0;
		}
		var serieModel = App.SeriesEntity.instance.get(serieId);
		if (serieModel) {
			var imgSrc = BASE_PATH + 'assets/img/series/' + serieModel.get('images')[imageIndex];
			if (addOrigin) {
				imgSrc = Backbone.history.location.origin + imgSrc;
			}
			return imgSrc;
		} else {
			return null;
		}
	}

	Utils.getProductImageSrc = function(productId, imageIndex, addOrigin) {
		if (!imageIndex) {
			imageIndex = 0;
		}
		var productModel = App.ProductsEntity.instance.get(productId);
		if (productModel) {
			var imgSrc = BASE_PATH + 'assets/img/products/' + productModel.get('gender') + '/' + productModel.get('images')[imageIndex];
			if (addOrigin) {
				imgSrc = Backbone.history.location.origin + imgSrc;
			}
			return imgSrc;
		} else {
			return null;
		}
	};

	Utils.getRouteToProductPage = function(productModel) {
		var pageModel = App.PagesEntity.instance.get('product');
		var genderModel = App.GendersEntity.instance.get(productModel.gender);
		if (pageModel && genderModel) {
			var pageSlug = pageModel.get('slug');
			var genderSlug = genderModel.get('slug');
			var productSlug = App.Utils.productNameToSlug(productModel.name);
			var route = App.Utils.replaceTokens(pageSlug, {
				'gender': genderSlug,
				'product': productSlug
			});
			console.log(route);
			return route;
		}
		return null;
	};

	Utils.getProductIdFromImageSrc = function(imgSrc) {
		return imgSrc.replace(/^(.*[\\\/])/, "").replace(/_[^_]*$/, "");
	};

	Utils.getRouteFromProductModel = function(productModel) {
		return '/collection/' + productModel.get('gender') + '/' + productModel.get('slug') + '/';
	};

	//----------
	//----------

	Utils.getAspectRatio = function(width, height) {
		return height / width * 100;
	};

	Utils.getFullPaddingBottom = function() {
		var coverWidth = Math.min(App.Config.windowWidth, App.Config.maxChromeWidth);
		var coverHeight = App.Config.windowHeight - App.Config.headerHeight;
		return App.Utils.getAspectRatio(coverWidth, coverHeight);
	};

	Utils.getPaddingBottomByRatio = function(ratio) {
		// calculate padding bottom
		var paddingBottom;
		switch (ratio) {
			case App.Constants.COVER_RATIO_FULL:
				paddingBottom = App.Utils.getFullPaddingBottom();
				break;
			case App.Constants.COVER_RATIO_NONE:
				paddingBottom = 0;
				break;
			case App.Constants.COVER_RATIO_DEFAULT:
				paddingBottom = App.ViewportsEntity.getCurrentPaddingBottom();
				// make sure cover ratio is not bigger than screen ratio
				var fullHeightPadding = App.Utils.getFullPaddingBottom();
				if (paddingBottom > fullHeightPadding) {
					paddingBottom = fullHeightPadding;
				}
				break;
		}
		return paddingBottom;
	};

	Utils.getScrollTop = function() {
		var docEl = document.documentElement;
		return (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);
	};

	Utils.getRandomColor = function() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

	Utils.renderViewAsRootEl = function(view) {
		if (!view || !view['template']) {
			return view;
		}
		var modelAttributes = {};
		if (view.model) {
			modelAttributes = view.model.attributes || {};
		}
		var data = view.hasOwnProperty('serializeData') ? view.serializeData() : modelAttributes;
		if (view.templateHelpers) {
			_.extend(data, view.templateHelpers);
		}
		var newEl = view.template(data);
		view.setElement(newEl);
		return view;
	};

	Utils.updateHrefAndTarget = function(templateHelpers, options) {
		// define href and target properties in given object based on options
		var href = undefined;
		var target = undefined;

		if (options.url) {
			// external link
			target = '_blank';
			href = options.url;
		} else if (options.pageId) {
			// check locale
			var localeId = App.Config.locale;
			var localeModel = App.LocalesEntity.instance.get(localeId);
			if (localeModel) {
				var localeSlug = localeModel.get('slug');
				// check page
				var pageModel = App.PagesEntity.instance.get(options.pageId);
				if (pageModel) {
					var pageSlug = pageModel.get('slug');
					href = BASE_PATH + localeSlug + '/';
					if (pageSlug.length > 0) {
						href += pageSlug + '/';
					}
					// check gender
					if (options.genderId) {
						var genderModel = App.GendersEntity.instance.get(options.genderId);
						if (genderModel) {
							var genderSlug = genderModel.get('slug');
							href = App.Utils.replaceTokens(href, {
								'gender': genderSlug
							});
							// check product
							if (options.productId) {
								var productModel = App.ProductsEntity.instance.get(options.productId);
								if (productModel) {
									var productSlug = productModel.get('slug');
									href = App.Utils.replaceTokens(href, {
										'product': productSlug
									});
								}
							}
						}
					}
				}
			}
			// internal link
			if (href) {
				target = '_self';
			}
		}

		if (!templateHelpers) {
			templateHelpers = {};
		}
		templateHelpers.href = href;
		templateHelpers.target = target;
	};

	Utils.getURLFromId = function(pageId, genderId, productId) {

		var temp = {},
			options = {};

		if (!pageId) return '';

		options.pageId = pageId;

		if (genderId) options.genderId = genderId;
		if (productId) options.productId = productId;

		Utils.updateHrefAndTarget(temp, options);

		return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + BASE_PATH + temp.href.substring(1);
	};

	Utils.getDigitIndex = function(index, numDigit) {
		return (Math.floor(index) + Math.pow(10, numDigit)).toString(10).substr(1);
	};

	Utils.whereAt = (function() {
		if (window.pageXOffset != undefined) {
			return function(ev) {
				return [ev.clientX + window.pageXOffset,
					ev.clientY + window.pageYOffset
				];
			}
		} else return function() {
			var ev = window.event,
				d = document.documentElement,
				b = document.body;
			return [ev.clientX + d.scrollLeft + b.scrollLeft,
				ev.clientY + d.scrollTop + b.scrollTop
			];
		}
	})();

	Utils.setTranform = function(el, tranform) {
		if (!el) {
			return;
		}
		el.style.webkitTransform = tranform;
		el.style.MozTransform = tranform;
		el.style.msTransform = tranform;
		el.style.OTransform = tranform;
		el.style.transform = tranform;
	};

	Utils.resizeEl = function($el, type, containerWidth, containerHeight, elWidth, elHeight) {
		var containerRatio = containerWidth / containerHeight;
		var elRatio = elWidth / elHeight;
		var scale, x, y;

		// define scale
		switch (type) {
			case App.Constants.RESIZE_TYPE_COVER:
				if (containerRatio > elRatio) {
					scale = containerWidth / elWidth;
				} else {
					scale = containerHeight / elHeight;
				}
				break;
			case App.Constants.RESIZE_TYPE_CONTAIN:
				if (containerRatio < elRatio) {
					scale = containerWidth / elWidth;
				} else {
					scale = containerHeight / elHeight;
				}
				break;
			case App.Constants.RESIZE_TYPE_WIDTH:
				scale = containerWidth / elWidth;
				break;
			case App.Constants.RESIZE_TYPE_HEIGHT:
				scale = containerHeight / elHeight;
				break;
		}

		// define position
		if (containerRatio === elRatio) {
			x = y = 0;
		} else {
			x = (containerWidth - elWidth * scale) * 0.5 / scale;
			y = (containerHeight - elHeight * scale) * 0.5 / scale;
		}

		// fixed
		x = Number(x.toFixed(1));
		y = Number(y.toFixed(1));

		// set el css
		if (Modernizr.csstransforms) {
			// modern browsers
			if (Modernizr.csstransforms3d) {
				$el.css('transform', 'scale3d(' + scale + ', ' + scale + ', 1) translate3d(' + x + 'px,' + y + 'px,0)');
				$el.css('transform-origin', '0% 0% 0px');
			} else {
				$el.css('transform', 'scale(' + scale + ', ' + scale + ') translate(' + x + 'px,' + y + 'px)');
				$el.css('transform-origin', '0% 0%');
			}
			$el.css('max-width', elWidth + 'px');
			$el.css('width', elWidth + 'px');
			$el.css('height', elHeight + 'px');
		} else {
			// IE8 fallback
			$el.css('max-width', (elWidth * scale) + 'px');
			$el.css('width', (elWidth * scale) + 'px');
			$el.css('height', (elHeight * scale) + 'px');
			$el.css('left', x + 'px');
			$el.css('top', y + 'px');
		}
	};

	Utils.setElPosition = function($el, x, y) {
		if (Modernizr.csstransforms) {
			// modern browsers
			if (Modernizr.csstransforms3d) {
				$el.css('transform', 'translate3d(' + x + 'px,' + y + 'px,0)');
			} else {
				$el.css('transform', 'translate(' + x + 'px,' + y + 'px)');
			}
		} else {
			// IE8 fallback
			$el.css('left', x + 'px');
			$el.css('top', y + 'px');
		}
	};

	Utils.aTagClick = function(e) {
		var href = $(e.currentTarget).attr('href');
		var target = $(e.currentTarget).attr('target');

		if (!href || href === "") {
			return;
		}

		// ignore if external link
		if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0 || target === '_blank') {
			return true;
		}

		var route = href.replace(BASE_PATH, '');
		App.trigger(App.Constants.EVENT_NAVIGATE, route);

		e.preventDefault();
		return false;
	};

	Utils.linkTo = function(pageId, genderId, productId) {
		if (pageId) {
			var pageModel = App.PagesEntity.instance.get(pageId);
			var pageSlug = pageModel.get('slug');
			if (genderId) {
				var genderModel = App.GendersEntity.instance.get(genderId);
				var genderSlug = genderModel.get('slug');
				pageSlug = App.Utils.replaceTokens(pageSlug, {
					'gender': genderSlug
				});
				if (productId) {
					var productModel = App.ProductsEntity.instance.get(productId);
					var productSlug = productModel.get('slug');
					if (productModel) {
						pageSlug = App.Utils.replaceTokens(pageSlug, {
							'product': productSlug
						});
					}
				}
			}
			App.trigger(App.Constants.EVENT_NAVIGATE_TO_PAGE, pageSlug);
		}
	};

	Utils.parseVideoSrc = function(name) {
		var size = App.Constants.VIDEO_WIDTH + 'x' + App.Constants.VIDEO_HEIGHT;
		var src = App.SrcsEntity.instance.get('video').get('src');
		return App.Utils.replaceTokens(src, {
			'size': size,
			'name': name,
			'locale': App.Config.locale,
			'extention': App.Config.videoExtension
		});
	};

	Utils.parseVoAudioSrc = function(name) {
		var src = App.SrcsEntity.instance.get('voAudio').get('src');
		return App.Utils.replaceTokens(src, {
			'name': name,
			'locale': App.Config.locale,
			'extention': App.Config.audioExtension
		});
	};

	Utils.parseFxAudioSrc = function(name) {
		var src = App.SrcsEntity.instance.get('fxAudio').get('src');
		return App.Utils.replaceTokens(src, {
			'name': name,
			'extention': App.Config.audioExtension
		});
	};

	Utils.breakLines = function(copy, numLines) {
		var text = '';
		var textWords = copy.split(' ');
		var prevLineIndex = 0;
		for (var i = 0, l = textWords.length; i < l; i++) {
			var lineIndex = Math.floor(i / (l / numLines));
			if (prevLineIndex !== lineIndex) {
				prevLineIndex = lineIndex;
				text += '<br>';
			} else if (i < l) {
				text += ' ';
			}
			text += textWords[i];
		}
		return text;
	};

	//------------
	// ENTITIES
	//------------

	Utils.requestEntities = function(entityIdList) {
		// create promise
		var defer = $.Deferred();

		// when all entities are loaded, resolve promise
		var numLoaded = 0;
		var numTotal = entityIdList.length;
		var onItemPreloaded = function() {
			numLoaded++;
			if (numLoaded === numTotal) {
				defer.resolve();
			} else {
				preloadNext();
			}
		};
		var preloadNext = function() {
			setTimeout(function() {
				App.request(entityIdList[numLoaded]).done(onItemPreloaded);
			});
		};

		// preload all entities
		preloadNext();

		return defer.promise();
	};

	/*Utils.matchCopyKeys = function(entityModel) {
		//if (!entityModel.has('copyKey')) return;
		var copyKey = entityModel.get('copyKey');
		var copy = _.clone(entityModel.get('copy') || {});
		var copyHelper = _.clone(entityModel.get('copyHelper') || {});
		var copyCollection = App.CopyEntity.instance;
		for (var key in copyKey) {
			var copyId = copyKey[key];
			var copyModel = App.CopyEntity.instance.get(copyId);
			if (copyModel) {
				// update with copy value
				copy[key] = copyModel.get('value');
			} else {
				// update with fallback
				copy[key] = '[' + copyId + ']';
			}
		}

		copyCollection.each(function(child) {
			var values = child.values();
			copyHelper[values[0]] = values[1];
		});

		// clone and set object in order to force model to dispatch 'change' event
		//console.log("match ", entityModel.cid, copy);
		entityModel.set('copyHelper', copyHelper);
		entityModel.set('copy', copy);
	};*/

	Utils.createCopyObject = function(copyInstance) {
		var copy = {};
		var copyCollection = copyInstance || App.CopyEntity.instance;
		copyCollection.each(function(child) {
			var values = child.values();
			copy[values[0]] = values[1];
		});
		return copy;
	};
	/*
	Utils.matchProductKeys = function(entityModel) {
		if (!entityModel.has('productIds')) return;

		var productIds = entityModel.get('productIds');
		_.each(productIds, function(id, index) {
			var productModel = App.ProductsEntity.instance.get(id);
			if (productModel) {
				// TODO don't override, instead create a new property
				productIds[index] = productModel.attributes;
			}
		});
	};
*/


	//------------
	// POLYFILLS
	//------------

	if (!('indexOf' in Array.prototype)) {
		Array.prototype.indexOf = function(find, i /*opt*/ ) {
			if (i === undefined) i = 0;
			if (i < 0) i += this.length;
			if (i < 0) i = 0;
			for (var n = this.length; i < n; i++)
				if (i in this && this[i] === find)
					return i;
			return -1;
		};
	}

	//------------
	// MATH
	//------------

	/**
	 *  Range maps one range of numbers to another
	 *
	 *  @function rangeFunc
	 *  @author Alex Coady
	 *  @param {Number} inputFrom Start number of range
	 *  @param {Number} inputTo End number of range
	 *  @param {Number} inputFrom Start number of domain
	 *  @param {Number} inputTo End number of domain
	 *  @return {Function} Range function
	 */
	Utils.rangeFunc = function(inputFrom, inputTo, outputFrom, outputTo) {

		var range, domain, multiplier;

		range = {
			"difference": inputTo - inputFrom,
			"modifier": inputFrom * -1
		};

		domain = {
			"difference": outputTo - outputFrom,
			"modifier": outputFrom
		};

		multiplier = (domain.difference / range.difference);

		return function(value) {

			value += range.modifier;
			value = value * multiplier;
			value += domain.modifier;

			return value;
		}
	};

	Utils.map = function(v, a, b, x, y) {
		return (v === a) ? x : (v - a) * (y - x) / (b - a) + x;
	};

	Utils.lerp = function(from, to, percent) {
		return from + (to - from) * percent;
	};

	Utils.clamp = function(value, min, max) {
		if (min > max) {
			var a = min;
			min = max;
			max = a;
		}
		if (value < min) {
			return min;
		}
		if (value > max) {
			return max;
		}
		return value;
	};

	Utils.random = function(min, max) {
		if (isNaN(max)) {
			max = min;
			min = 0;
		}
		return min + Math.random() * (max - min);
	};

	Utils.difference = function(a, b) {
		return Math.abs(a - b);
	};

	Utils.distance = function(x1, y1, x2, y2) {
		var dx = x1 - x2;
		var dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	};

	Utils.coinToss = function() {
		return Math.random() > 0.5;
	};

	Utils.angle = function(x1, y1, x2, y2) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		return Math.atan2(dy, dx);
	};

	Utils.degrees = function(radians) {
		return radians * DEG;
	};

	Utils.radians = function(degrees) {
		return degrees * RAD;
	};

	Utils.roundToNearest = function(value, amount) {
		return Math.round(value / amount) * amount;
	};

	Utils.getIntersectionArea = function(aX, aY, aW, aH, bX, bY, bW, bH) {
		var overlapX = Math.max(0, Math.min(aX + aW, bX + bW) - Math.max(aX, bX));
		var overlapY = Math.max(0, Math.min(aY + aH, bY + bH) - Math.max(aY, bY));
		return overlapX * overlapY;
	};

	Utils.rotateTo = function(start, end) {
		var diff = (end - start) % 360;
		if (diff !== diff % 180) {
			diff = (diff < 0) ? diff + 360 : diff - 360;
		}
		return start + diff;
	};
});

// export
module.exports = App.Utils;