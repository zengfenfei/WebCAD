define(function () {

  function EventDispatcher () {
    this._listeners = {};
    this._clearTimers = {}; // Timers to clear null listener
  }

  EventDispatcher.prototype.addEventListener = function (type, listener) {
    var listeners = this._listeners;
    if (!listeners[type]) {
      listeners[type] = [];
    }

    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener);
    }
  };

  EventDispatcher.prototype.removeEventListener = function (type, listener) {
    var listenersArr = this._listeners[type];
    if (!listenersArr) {
      return;
    }

    var index = listenersArr.indexOf(listener);
    if (index !== -1) { // Cannot be deleted immediately, will disrupt dispatcherEvent.
      listenersArr[index] = null;
      if (!this._clearTimers[type]) {
        this._clearTimers[type] = setTimeout(clearNullListener, 0, this, type);
      }
    }
  };

  EventDispatcher.prototype.dispatchEvent = function(type, params) {
    var listenersArr = this._listeners[type];
    if (!listenersArr) {
      return;
    }
    for(var i = 0, len = listenersArr.length; i < len; i++) {
      listenersArr[i] && listenersArr[i].apply(this, arguments);
    }
  };

  function clearNullListener (self, type) {
    self._clearTimers[type] = null;
    var listenersArr = self._listeners[type];
    var clearedArr = self._listeners[type] = [];
    for (var i = listenersArr.length - 1; i >= 0; i--) {
      listenersArr[i] && clearedArr.push(listenersArr[i]);
    };
  }

  return EventDispatcher;
});
