@send = (id, data)->
  res = {}
  res.msgId = id
  res[id] = data
  self.postMessage(res)

