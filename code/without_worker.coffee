  countSum = (max)->
    loading()
    sum = cnt = 0
    while(cnt<=max)
      sum += cnt++
    sum

  $('#sum_without_worker').on('click', ->
    loading()
    sum = countSum(sumMax)
    log "getSum: #{sum}"
    loaded()
  )
