@on "getSum", (max) ->
  sum = cnt = 0
  while(cnt<=max)
    sum += cnt++
  self.send('gotSum', sum)
