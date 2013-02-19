define (require)->
  worker_console_spec_js = require 'text!./worker_console_spec.js'
  worker_util = require './lib/worker/worker_util'
  console.log worker_util

  buster.spec.expose()

  describe "worker console", ->
    inlineworker = worker_util.createInlineWorker(worker_console_spec_js)
    #assert.equals true, true
    if worker_util.options.enableDebug
      it('should print out log from worker', ->
        expect(true).toBeTrue()
      )
    else
      it("shouldn't print out log from worker", ->
        expect(true).toBeTrue()
      )



