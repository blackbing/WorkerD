define (require)->
  class Car
    constructor: (@color)->

    get: (attr)->
      @[attr] if @[attr]


