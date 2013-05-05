
console.log 'inlineWorker loaded'

require([
  "require"
  "module"
  "./test-car"
  ], (require, module, Car) ->
    car = new Car('red')
    console.log car

)



@on "getSum", (max) ->
  console.group 'getSum'
  console.time('getSum')
  console.log 'getSum'
  console.log max
  sum = cnt = 0
  while(cnt<=max)
    sum += cnt++

  console.log sum
  self.send('gotSum', sum)
  console.log 'inlineWorker send message'
  console.timeEnd('getSum')
  console.groupEnd 'getSum'



