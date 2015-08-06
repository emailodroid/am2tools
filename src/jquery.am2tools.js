// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var am2tools = "am2tools",
				defaults = {
				activeTab: 0
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = am2tools;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
						var active;
						var isChildOff;
						var initPaneHeight;
						// Place initialization logic here
						// You already have access to the DOM element and
						// the options via the instance, e.g. this.element
						// and this.settings
						// you can add more functions like the one below and
						// call them like so: this.yourOtherFunction(this.element, this.settings).
						//make this am2 element
						$(this.element).attr('data-am2', 'true');
						//getting active tab by html attribute
						active = $(this.element).attr('data-active');
						if(!active)
							active = 1;
						//getting first pane height
						initPaneHeight = this.getPaneHeight(this.element, active);
						console.log(initPaneHeight);
						//check if has am2tools element parent
						isChildOff = $(this.element).parents('[data-am2="true"]');
						if(isChildOff){
							var updatedParentHeight = initPaneHeight;
							/*isChildOff.each(function(){
								updatedParentHeight + $(this).children('.am2panes').innerHeight();
								console.log($(this).children('.am2panes').innerHeight());
							});*/
							for (var i = isChildOff.length, l = 0; i > l; i-- ) {
							    updatedParentHeight + $(isChildOff[i]).children('.am2panes').innerHeight;
							    console.log(updatedParentHeight, $(isChildOff[i]));
							    //$(isChildOf[0]).children('.am2panes').css('height', updatedParentHeight);
							}
 							$('.am2tabs.1').children('.am2panes').css('height', updatedParentHeight+updatedParentHeight);
 							$('.am2tabs.2').children('.am2panes').css('height', updatedParentHeight+updatedParentHeight);
 							$('.am2tabs.3').children('.am2panes').css('height', updatedParentHeight+updatedParentHeight);
							//console.log(updatedParentHeight, isChildOff[0], $(this.element).attr('class'));
							//$(isChildOff[0]).children('.am2panes').css('height', updatedParentHeight);

						}
						//console.log(isChildOf[0], $(this.element).attr('class'), $(isChildOf[0]).innerHeight()+this.getPaneHeight(this.element, active));

						//$(isChildOf[0]).children('.am2panes').css('height', $(isChildOf[0]).innerHeight()+this.getPaneHeight(this.element, active));

						this.setTab(this.element, active, this.getPaneHeight(this.element, active));
				},
				setTab: function (element, tabID, paneHeight) {
						//console.log(element, tabID, paneHeight);
						//setting default parameter for .current tab
						if(!tabID)
							tabID = 1;
						//targeting heading and adding .current
						$(element).children('.am2headings').children('a[data-tab="'+tabID+'"]').addClass('active');
						//targeting pane and adding .current
						$(element).children('.am2panes').children('.am2pane[data-tab="'+tabID+'"]').addClass('active');
						//setting pane height
						$(element).children('.am2panes').css('height', paneHeight);
				},
				getPaneHeight: function (element, tabID) {
						return $(element).children('.am2panes').children('.am2pane[data-tab="'+tabID+'"]').innerHeight();
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ am2tools ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + am2tools ) ) {
								$.data( this, "plugin_" + am2tools, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
