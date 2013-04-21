{
  baseUrl: "../javascripts",
  exclude: ['text'],
  //optimizeAllPluginResources: true,
  //optimize: "uglify",
  paths:{
    "WorkerD": "lib/WorkerD/WorkerD",
    'text' : 'vender/text'
  },
  optimize: "none",
  name: "WorkerD",
  out: "../dist/WorkerD.js"
}
