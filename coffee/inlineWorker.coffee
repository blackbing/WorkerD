
console.log location.href

require(
  ["require", "module", "test-car"], (require, module, Car) ->
    car = new Car('red')
    console.log car
)


console.log 'inlineWorker loaded'

@on "getSum", (max) ->
  sum = cnt = 0
  while(cnt<=max)
    sum += cnt++
  self.send('getSum', sum)
  console.log 'inlineWorker send message'



