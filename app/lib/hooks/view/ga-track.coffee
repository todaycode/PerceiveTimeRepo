$ = require 'jquery'
_ = require 'underscore'

# Lets you track events on click by adding a ga-track tag to the element.
# Should have a comma-delimited list of arguments, e.g.:
#
#   This:  <a href="/signup" ga-track="signup, home_click">
#   Makes: ga('send', 'event', 'signup', 'home_click')
module.exports = ($el) ->
  tag = 'ga-track'
  $('[' + tag + ']', $el).on 'click', ->
    return unless ga?
    props = _.invoke $(this).attr(tag).split(','), 'trim'
    ga 'send', 'event', props...
    return
