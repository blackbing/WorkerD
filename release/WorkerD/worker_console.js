(function() {
  var attr, console_attr, _i, _len,
    _this = this;

  this.postDebugMessage = function(type, args) {
    return self.postMessage({
      debug: type,
      args: args
    });
  };

  console_attr = ['debug', 'error', 'info', 'log', 'warn', 'group', 'groupCollapsed', 'groupEnd', 'dir', 'trace', 'assert', 'count', 'markTimeline', 'profile', 'profileEnd', 'time', 'timeEnd', 'timeStamp'];

  self.console = {};

  for (_i = 0, _len = console_attr.length; _i < _len; _i++) {
    attr = console_attr[_i];
    self.console[attr] = (function(attr) {
      return function() {
        var args;

        args = Array.prototype.slice.call(arguments);
        return _this.postDebugMessage(attr, args);
      };
    })(attr);
  }

}).call(this);
