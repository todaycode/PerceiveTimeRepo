module.exports = (api) ->
  # Creates a new user with the email, password, and timezone.
  signup: (email, password, tz) ->
    return api.request 'post', 'signups',
        processData: false
        contentType: 'application/json'
        data: JSON.stringify(
          user:
            email: email
            password: password
            timezone: tz
            created_with: api.name
        )

    # Forgot a password functionality. Causes an email to be sent
    # to the user with reset instructions.
    forgot: (email) ->
      return api.request 'post', 'lost_passwords',
        processData: false
        contentType: 'application/json'
        data: JSON.stringify(
          email: email
        )

    # Initializes a google login
    initGoogleLogin: ->
      api
        .request 'get', 'oauth_url', dataType: undefined
        .then (result) ->
          document.location = result

    # Completes a google login
    completeGoogleLogin: (code, remember_me) ->
      api
        .setAuth code, 'oauth_code'
        .request 'post', 'sessions',
          contentType: 'application/json'
          data: JSON.stringify(
            remember_me: remember_me
            created_with: api.name
          )

    # Creates an user with Google OAuth. This will trigger a redirect to an
    # OAuth page, which redirect back to the app on success, and should be
    # handled with `completeGoogleSignup`.
    initGoogleSignup: ->
      api
        .request 'get', 'oauth_url?state=signup',
          dataType: undefined # The response isn't JSON; see SO question 6186770
            .then (result) ->
          document.location = result

    # Completes an OAuth Sign-up given a token (which should be available on
    # redirect).
    completeGoogleSignup: (code, tz) ->
      api
        .request 'post', 'signups',
          contentType: 'application/json'
          dataType: undefined
          data: JSON.stringify(
            code: code
            user:
              timezone: tz
              created_with: api.name
          )
