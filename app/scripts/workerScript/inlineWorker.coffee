
console.log 'inlineWorker loaded'

###
require(
  ["require", "module", "test-car"], (require, module, Car) ->
    car = new Car('red')
    console.log car
)
###


@on "getSum", (max) ->
  console.time('getSum')
  console.log 'getSum', max
  sum = cnt = 0
  while(cnt<=max)
    sum += cnt++

  console.log 'sum=', sum
  self.send('getSum', sum)
  console.log 'inlineWorker send message'
  console.timeEnd('getSum')



