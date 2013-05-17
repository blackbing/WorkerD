define (require) ->
  WorkerD = require("WorkerD/WorkerD")

  sandboxView = ->

    masterEditor = ace.edit('masterEditor')
    workerEditor = ace.edit('workerEditor')
    [masterEditor, workerEditor].forEach( (editor)->
      editor.setTheme('ace/theme/tomorrow_night')
      editor.setShowPrintMargin(false)
      editor.getSession().setMode("ace/mode/javascript")
    )

    #exports WorkerD
    window.WorkerD = WorkerD
    $('#run').click(->
      workerScript = workerEditor.getValue()
      #workerScriptBlob = new Blob([workerScript], {type:'text/plain'})
      #workerScriptUrl = URL.createObjectURL(workerScriptBlob)

      #console.log workerScriptUrl

      masterScript = '(function(){' + masterEditor.getValue() + '})()'
      window['WORKER_CONTENT'] = workerScript
      masterScriptBlob = new Blob([masterScript], {type:'application/javascript'})
      masterScriptUrl = URL.createObjectURL(masterScriptBlob)


      if $('#workerd').length
        URL.revokeObjectURL($('#workerd').attr('src'))
        $('#workerd').remove()

      s = document.createElement('script')
      s.src = masterScriptUrl
      s.id = 'workerd'

      head = document.getElementsByTagName('head')[0]
      head.insertBefore(s, head.firstChild)

    )

  exports = sandboxView



