
// Generated by CoffeeScript 1.3.3
(function() {

  define('test-car',['require'],function(require) {
    var Car;
    return Car = (function() {

      function Car(color) {
        this.color = color;
      }

      Car.prototype.get = function(attr) {
        if (this[attr]) {
          return this[attr];
        }
      };

      return Car;

    })();
  });

}).call(this);

// Generated by CoffeeScript 1.3.3
(function() {

  console.log(location.href);

  require(["require", "module", "test-car"], function(require, module, Car) {
    var car;
    car = new Car('red');
    return console.log(car);
  });

  console.log('inlineWorker loaded');

  this.on("getSum", function(max) {
    var cnt, sum;
    sum = cnt = 0;
    while (cnt <= max) {
      sum += cnt++;
    }
    self.send('getSum', sum);
    return console.log('inlineWorker send message');
  });

}).call(this);

define("inlineWorker", function(){});
