console.log 'inlineWorker loaded'

@on "getSum", (max) ->
  sum = cnt = 0
  while(cnt<=max)
    sum += cnt++
  self.send('getSum', sum)
  console.log 'inlineWorker send message'



