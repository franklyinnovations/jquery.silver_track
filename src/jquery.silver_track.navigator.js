/*!
 * jQuery SilverTrack - Navigator Plugin
 * https://github.com/tulios/jquery.silver_track
 * version: 0.1.0
 */

(function ($, window, document) {

  $.silverTrackPlugin("Navigator", {
    defaults: {
      disabledClass: "disabled"
    },

    constructor: function() {
      this.track = null;
      this.prev = this.options.prev;
      this.next = this.options.next;

      var self = this;
      this.prev.addClass(this.options.disabledClass).click(function(e) {
        e.preventDefault();
        self.track.prev();
      });

      this.next.addClass(this.options.disabledClass).click(function(e) {
        e.preventDefault();
        self.track.next();
      });
    },

    onInstall: function(track) {
      this.track = track;
    },

    afterStart: function() {
      if (this.track.hasPrev()) {
        this._enable(this.prev);
      }

      if (this.track.hasNext()) {
        this._enable(this.next);
      }
    },

    afterAnimation: function() {
      this.track.hasPrev() ? this._enable(this.prev) : this._disable(this.prev);
      this.track.hasNext() ? this._enable(this.next) : this._disable(this.next);
    },

    afterRestart: function() {
      this.afterAnimation();
    },

    _enable: function(element) {
      element.removeClass(this.options.disabledClass);
    },

    _disable: function(element) {
      element.addClass(this.options.disabledClass);
    }
  });

})(jQuery, window, document);
