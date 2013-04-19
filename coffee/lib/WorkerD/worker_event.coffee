Callbacks = {}

@send = (id, data)->
  res = {}
  res.msgId = id
  res[id] = data
  self.postMessage(res)

@on = (id, callback)=>
  Callbacks[id] = callback

@off = (id)=>
  delete Callbacks[id]


@addEventListener "message", (event) =>
  data = event.data
  if data.msgId? and data.msgData?
    id = data.msgId
    msgData = data.msgData
    Callbacks[id](msgData) if Callbacks[id]


