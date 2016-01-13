// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ($, window, document, undefined) {

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
            //parameter: 0
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = am2tools;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var self = this;
            var active;
            var initPaneHeight;
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).

            //make this am2 element
            $(this.element).attr("data-am2", "true");
            //getting active tab by html attribute
            active = $(this.element).attr("data-active");
            if (!active) {
                active = 1;
            }

            //get tab toggles
            $(this.element).children(".am2headings").children("a").click({element: this.element}, changeTab);
            function changeTab(event) {
                var element = $(event.data.element);
                var dataTab = $(event.currentTarget).attr("data-tab");
                var oldHeight = element.children(".am2panes").innerHeight();
                self.setTab(element, dataTab, self.getPaneHeight(element, dataTab));
                var parents = $(element).parents(".am2tabs");
                if (parents.length) {
                    //getting first parent and checking if has active class
                    var childPane = self.getPaneHeight(element, dataTab);
                    var parentOldHeight = 0;
                    for (var i = 0; i < parents.length; i++) {
                        //get parent active tab
                        var parentActiveTab = $(parents[i]).children(".am2panes").children(".am2pane.active").attr("data-tab");
                        var parentHeight = self.getPaneHeight(parents[i], parentActiveTab);
                        self.setTab(parents[i], parentActiveTab, parentHeight + childPane - oldHeight - parentOldHeight);
                        childPane = childPane + self.getPaneHeight(parents[i], parentActiveTab);
                        parentOldHeight = parentOldHeight + oldHeight;
                        oldHeight = $(parents[i]).children(".am2panes").innerHeight();
                    }
                }
                return;
            }

            //getting first pane height
            initPaneHeight = this.getPaneHeight(this.element, active);
            this.setTab(this.element, active, initPaneHeight);

            //check if is child of another tab object. If it is updates parent heights
            var parents = $(this.element).parents(".am2tabs");
            if (parents.length) {
                //getting first parent and checking if has active class
                var parentPanes = $(this.element).parents(".am2pane");
                if ($(parentPanes[0]).hasClass("active")) {
                    var childPane = this.getPaneHeight(this.element, active);
                    for (var i = 0; i < parents.length; i++) {
                        if ($(parentPanes[i]).hasClass("active")) {
                            //get parent active tab
                            var parentActiveTab = $(parents[i]).children(".am2panes").children(".am2pane.active").attr("data-tab");
                            var parentHeight = this.getPaneHeight(parents[i], parentActiveTab);
                            this.setTab(parents[i], parentActiveTab, parentHeight + childPane);
                            childPane = childPane + this.getPaneHeight(parents[i], parentActiveTab);
                        }

                    }

                }
            }

        },
        setTab: function (element, tabID, paneHeight) {
            //setting default parameter for .active tab
            if (!tabID) {
                tabID = 1;
            }
            //targeting current active tab and clearing class
            $(element).children(".am2headings").children(".active").removeClass("active");
            //targeting current active pane and clearing class
            $(element).children(".am2panes").children(".active").removeClass("active");
            //targeting heading and adding .active
            $(element).children(".am2headings").children("a[data-tab='" + tabID + "']").addClass("active");
            //targeting pane and adding .active
            $(element).children(".am2panes").children(".am2pane[data-tab='" + tabID + "']").addClass("active");
            //setting pane height
            $(element).children(".am2panes").css("height", paneHeight);
            $(element).children(".am2panes").attr("data-height", paneHeight);

            return;
        },
        getPaneHeight: function (element, tabID) {
            //console.log($(element).children(".am2panes").children(".am2pane[data-tab='"+tabID+"']").innerHeight());
            return $(element).children(".am2panes").children(".am2pane[data-tab='" + tabID + "']").innerHeight();
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[am2tools] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + am2tools)) {
                $.data(this, "plugin_" + am2tools, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
