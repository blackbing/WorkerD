(function() {
  var Callbacks,
    _this = this;

  Callbacks = {};

  this.send = function(id, data) {
    var res;

    res = {};
    res.msgId = id;
    res[id] = data;
    return self.postMessage(res);
  };

  this.on = function(id, callback) {
    return Callbacks[id] = callback;
  };

  this.off = function(id) {
    return delete Callbacks[id];
  };

  this.addEventListener("message", function(event) {
    var data, id, msgData;

    data = event.data;
    if ((data.msgId != null) && (data.msgData != null)) {
      id = data.msgId;
      msgData = data.msgData;
      if (Callbacks[id]) {
        return Callbacks[id](msgData);
      }
    }
  });

}).call(this);
