console.log 'inlineWorker loaded'

self.addEventListener "message", (e) ->
  console.log 'inlineWorker got message'
  sum = cnt = 0
  max = 1000000000
  while(cnt<=max)
    sum += cnt++
  self.send('getSum', sum)
  console.log 'inlineWorker send message'



