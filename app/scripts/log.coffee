define (require)->
  (log)->
    $('#log').prepend("<p>#{log}</p>")
