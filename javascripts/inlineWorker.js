// Generated by CoffeeScript 1.6.2
(function() {
  console.log('inlineWorker loaded');

  require(["require", "module", "test-car"], function(require, module, Car) {
    var car;

    car = new Car('red');
    return console.log(car);
  });

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
