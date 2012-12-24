describe("SilverTrack.Plugins.Navigator", function() {
  var track = null;
  var plugin = null;

  beforeEach(function() {
    jasmine.Clock.useMock();
    loadFixtures("basic.html");

    $.fx.off = true;

    track = helpers.basic();
    plugin = new SilverTrack.Plugins.Navigator({
      prev: $("a.prev", track.container.parent().parent()),
      next: $("a.next", track.container.parent().parent())
    });

    track.install(plugin);
    track.start();
  });

  describe("defaults", function() {
    it("should have a default 'disabledClass'", function() {
      expect(plugin.options.disabledClass).toBe("disabled");
    });
  });

  describe("when configuring the items", function() {
    it("should bind track.prev() to prev item", function() {
      spyOn(track, "prev");
      plugin.prev.click();
      expect(track.prev).toHaveBeenCalled();
    });

    it("should bind track.next() to next item", function() {
      spyOn(track, "next");
      plugin.next.click();
      expect(track.next).toHaveBeenCalled();
    });
  });

  describe("when applying the disabledClass", function() {
    it("should apply to prev item if the track does not have previous items", function() {
      spyOn(track, "hasPrev").andReturn(false);
      plugin.prev.click();
      expect(plugin.prev.hasClass(plugin.options.disabledClass)).toBe(true);
    });

    it("should apply to next item if the track does not have next items", function() {
      spyOn(track, "hasNext").andReturn(false);
      plugin.next.click();
      expect(plugin.next.hasClass(plugin.options.disabledClass)).toBe(true);
    });

    it("should update the status of the items after the restart", function() {
      var disabled = plugin.options.disabledClass;
      plugin.next.click();
      expect(plugin.prev.hasClass(disabled)).toBe(false);
      track.restart();
      expect(plugin.prev.hasClass(disabled)).toBe(true);
    });

    it("should update the status of the items after the update of totalPages", function() {
      var disabled = plugin.options.disabledClass;
      expect(plugin.next.hasClass(disabled)).toBe(false);
      track.updateTotalPages(0);
      expect(plugin.next.hasClass(disabled)).toBe(true);
    });
  });

});
