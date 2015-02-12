/*!
 * jQuery SilverTrack
 * https://github.com/tulios/jquery.silver_track
 * version: 0.4.0
 *
 * Circular Navigator
 * version: 0.1.0
 *
 */

(function($, window, document) {

  $.silverTrackPlugin("CircularNavigator", {
    defaults: {
      autoPlay: true,
      duration: 5000,
      clonedClass: "cloned"
    },

    initialize: function(options) {
      this.options = options
    },

    onInstall: function(track) {
      this.track = track;
      this.navigatorPlugin = this.track.findPluginByName("Navigator");
      
      this.trackElements = [
        this.track.container,
        this.navigatorPlugin.prev,
        this.navigatorPlugin.next
      ]
      this.prevButton = this.trackElements[1];
      this.nextButton = this.trackElements[2];

      var items = this.track._getItems().length
    },

    afterStart: function() {
      this.totalDefaultPages = this.track.totalPages;
      this._setupTrack();
      this._bindClick();
      if (this.options.autoPlay === true) this._turnOnAutoPlay(this.trackElements);
    },

    afterRestart: function() {
      this._enableButtons()
    },

    beforePagination: function() {
      this._enableButtons()
    },

    _enableButtons: function() {
      if (this._hasManyPages()) {
        this.prevButton.removeClass(this.navigatorPlugin.options.disabledClass);
        this.nextButton.removeClass(this.navigatorPlugin.options.disabledClass);
      }
    },

    afterAnimation: function() {
      this._setupTrack();
      this._tryToDeleteCloned();
      if (this.track.hasNext() === false && this.fowardPage === 1 ) {
        this.track.restart({page: 1, animate: false});
        return
      }

      if (this.track.currentPage === this.clonedPage && this.fowardPage === this.clonedPage) {
        this.track.goToPage(this.clonedPage - 1);
        this._changeFowardPage();
        return
      }

      this._changeFowardPage();

      if (this.track.currentPage === this._lastCompletedPage() &&
          this.track.totalPages === this.totalDefaultPages) {
        this._appendItems();
        this.track.restart({keepCurrentPage: true, animate: false});
        return
      }

      if (this.track.currentPage === this.clonedPage && this.fowardPage === 1) {
        this.track.restart({page: 1, animate: false});
      }
    },

    _setupTrack: function() {
      this.itemsCount = this.track._getItems().length;
      this.clonedPage = this.totalDefaultPages + 1;
      this.lastCompletedPage = this._lastCompletedPage();
      this._enableButtons();
      if (this.track.currentPage !== this.clonedPage) this._changeFowardPage();
    },

    _bindClick: function() {
      this._teleportWhenClick();
    },

    _changeFowardPage: function() {
      var currentPage = this.track.currentPage;
      
      if (currentPage === 1) {
        this.fowardPage = this.clonedPage;
      } else if (currentPage === this.clonedPage) {
        this.fowardPage = 1; 
      } else {
        this.fowardPage = 0;
      }
    },

    _teleportWhenClick: function() {
      var self = this;

      this.prevButton.click(function() {
        if (self.track.hasPrev() === false && self.fowardPage === self.clonedPage) {
          self._backTeleport();
        }
      });
    },

    _backTeleport: function() {
      this._appendItems();
      this.track.restart({page: this.clonedPage, animate: false});
    },

    _appendItems: function() {
      if (this._ifCloned() === true) return;
      var items = this.track._getItems().
        slice(0, this.track.options.perPage).
        clone().
        addClass(this.options.clonedClass);

      this.track.container.append(items);
      this.track.reloadItems();
    },

    _tryToDeleteCloned: function() {
      var currentPage = this.track.currentPage;
      if (this._ifCloned() === true &&
          currentPage !== this.totalDefaultPages && 
          currentPage !== this.clonedPage &&
          currentPage !== this.lastCompletedPage) {
        this._deleteClonedItems();
      }
    },

    _deleteClonedItems: function() {
      var items = this.track._getItems().length;

      for (var el = 0; el <= items - 1; el ++) {
        var item = this.track._getItems().eq(el);
        if (item.hasClass(this.options.clonedClass)) {
          item.remove();
        }
      }
      this.track.reloadItems();
      this.track.restart({ keepCurrentPage: true, animate: false });
    },

    _hasManyPages: function() {
      if (this.track.totalPages !== 1) {
        return true;
      }
      return false;
    },

    _ifCloned: function() {
      if (this.track._getItems().last().hasClass(this.options.clonedClass)) {
        return true;
      }
      return false;
    },

    _lastCompletedPage: function() {
      return Math.trunc(this._originalItemsCount() / this.track.options.perPage);
    },

    _originalItemsCount: function() {
      var items = this.itemsCount;
      if (this._ifCloned() === true) {
        return items - this.track.options.perPage;
      }
      return items;
    },

    _turnOnAutoPlay: function(elements) {
      this._mouseOverTrack(elements);
      this._mouseOutTrack(elements);
      this._turnOnListener();
    },

    _turnOnListener: function() {
      var self = this;

      if(this.options.autoPlay === true) {
        this.timeout = setInterval(function() {
          self.track.next();
        }, self.options.duration);
      }
    },

    _mouseOverTrack: function(elements) {
      var self = this;

      elements.forEach(function(el) {
        el.mouseenter(function() {
          self._breakListener();
        });
      });
    },

    _mouseOutTrack: function(elements) {
      var self = this;

      elements.forEach(function(el) {
        el.mouseleave(function() {
          self._wakeUpListener();
        });
      });
    },

    _breakListener: function() {
      clearTimeout(this.timeout);
      this.options.autoPlay = false;
    },

    _wakeUpListener: function() {
      clearTimeout(this.timeout);
      this.options.autoPlay = true;
      this._turnOnListener();
    }
  })

})(jQuery, window, document);
