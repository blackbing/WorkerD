###
if typeof require is "function" and typeof module is "object"
  buster = require("buster")
  require "./strftime"
###
require([

], ()->
  assert = buster.assert

  buster.testCase "Date strftime tests",
    setUp: ->
      #create PhotoPicker

    "photoPicker":

      "thumbnailData": ->
        assert.equals true, true

    ###

    "%Y":
      setUp: ->
        @year = @date.strftime("%Y")

      "should return full year": ->
        assert.equals @year, "2009"

      "should return a string": ->
        assert.equals typeof @year, "string"

    "%y should return two digit year": ->
      assert.equals @date.strftime("%y"), "09"

    "%m should return month": ->
      assert.equals @date.strftime("%m"), "12"

    "%d should return date": ->
      assert.equals @date.strftime("%d"), "05"

    "//%j should return the day of the year": ->
      date = new Date(2011, 0, 1)
      assert.equals date.strftime("%j"), 1
    ###

)
