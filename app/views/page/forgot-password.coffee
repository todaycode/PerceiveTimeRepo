View     = require '../../view'
API      = require '../../lib/api'
formData = require '../../lib/form-data'
$        = require 'jquery'
jstz     = require('jstimezonedetect').jstz

class SignupView extends View
  template: 'page/forgot-password'
  title: 'Forgot password — Toggl, The Simplest Time Tracker'

  events:
    'submit': 'forgotPassword'

  showError: (msg) =>
    @errorMessage.html(msg).show()

  forgotSuccess: =>
    @showError 'An email containing instructions to reset your password has been sent.'

  forgotError: =>
    @showError switch err.responseText
      when 'E-mail address does not exist\n'
        'Unknown email, please check that it\'s entered correctly!'
      else
        if err.responseText
          err.responseText
        else
          'Failed to trigger a password reset.\n\
          Make sure you\'re connected to the internet'

  forgotPassword: (e) =>
    e.preventDefault()
    data = formData @$el.find 'form'
    return @showError 'Please enter an email bellow.' unless data.email

    new API('dev', null, null)
      .user.forgot data.email
      .then @forgotSuccess, @forgotError
      .catch @forgotError

  postRender: ->
    setTimeout => @$el.find("[name=email]").select()
    @errorMessage = $ '.signup-form__error', @$el

module.exports = SignupView