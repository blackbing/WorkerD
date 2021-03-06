require.config
  paths:
    jquery: "../components/jquery/jquery"
    bootstrap: "vendor/bootstrap"
    text: "../components/text/text"

  shim:
    jquery:
      exports: "$"
    bootstrap:
      deps: [ "jquery" ]
      exports: "jquery"

require [ "app", "jquery", "bootstrap" ], (app, $) ->
  "use strict"
