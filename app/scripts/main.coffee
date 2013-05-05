require.config
  paths:
    jquery: "../components/jquery/jquery"
    bootstrap: "vendor/bootstrap"
    text: "../components/text/text"

  shim:
    bootstrap:
      deps: [ "jquery" ]
      exports: "jquery"

require [ "app", "jquery", "bootstrap" ], (app, $) ->
  "use strict"
  $('iframe').each( ->
    $(@).height(@.contentWindow.document.body.scrollHeight)
  )
  console.log "Running jQuery %s", $().jquery
