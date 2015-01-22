var $ = require('jquery');

/**
 * Video playback for the homepage video.
 */
module.exports = function($page, view) {
  var video = $('.hero__background video').get(0),
      firstTimerHeading = $('.hero-timer-heading').get(0),
      secondTimerHeading = $('.hero-timer-heading').get(1),
      timerSeconds = $('.hero-timer .seconds').get(0),
      timerMilliseconds = $('.hero-timer .milliseconds').get(0),
      breakpoints = [
        {
          time: 0
        },
        {
          time: 5.12,
          firstHeadingText: 'Toggl',
          secondHeadingText: 'great effort'
        },
        {
          time: 14.28,
          secondHeadingText: 'board meetings'
        },
        {
          time: 19.12,
          secondHeadingText: 'textile manufacturing'
        },
        {
          time: 23.4,
          secondHeadingText: 'wobbling matter'
        },
        {
          time: 27.72,
          secondHeadingText: 'patience'
        },
        {
          time: 31.48,
          secondHeadingText: 'time in the doghouse'
        },
        {
          time: 37.92,
          secondHeadingText: 'your holiday'
        },
        {
          time: 41.36,
          secondHeadingText: 'lunch'
        },
        {
          time: 44.84,
          secondHeadingText: 'running late'
        },
        {
          time: 49.48,
          firstHeadingText: '',
          secondHeadingText: 'Toggl anything'
        },
        {
          time: 51.08
        },
        {
          time: 58.32,
          firstHeadingText: '',
          secondHeadingText: ''
        }
      ],
      lastBreakpoint = 0,
      referenceTime,
      running = true;

  function hideTimer() {
    $('.hero-timer').css('opacity', 0);
  }

  function showTimer() {
    $('.hero-timer').css('opacity', 1);
  }

  function updateTimer() {
    var refTime = referenceTime || new Date().getTime(),
        currentTime = new Date().getTime(),
        timeDifference = Math.floor((currentTime-refTime)/10),
        minutes,
        seconds,
        milliseconds;

    minutes = Math.floor(timeDifference/(60*100));
    seconds = Math.floor(timeDifference/100)-minutes*60;
    milliseconds = timeDifference - seconds*100 - minutes*60*100;

    if (milliseconds < 10) {
      milliseconds = '0'+milliseconds;
    }

    timerSeconds.textContent = seconds;
    timerMilliseconds.textContent = milliseconds;
  }

  function loop() {
    if (!running) {
      return;
    }

    updateTimerHeadings();
    updateTimer();
    window.requestAnimationFrame(loop);
  }

  function updateTimerHeadings() {
    var firstHeadingText,
        secondHeadingText,
        currentBreakpoint = lastBreakpoint,
        twoFramesBeforeNextBreakpoint = false;

    if (breakpoints.length > currentBreakpoint+1 && video.currentTime > breakpoints[currentBreakpoint+1].time) {
      // next breakpoint
      currentBreakpoint = currentBreakpoint + 1;

      firstHeadingText = breakpoints[currentBreakpoint].firstHeadingText;
      secondHeadingText = breakpoints[currentBreakpoint].secondHeadingText;
    } else if (breakpoints.length > currentBreakpoint+1 && video.currentTime > breakpoints[currentBreakpoint+1].time-0.08) {
      // two seconds before next breakpoint
      twoFramesBeforeNextBreakpoint = true;
    } else if (breakpoints.length == currentBreakpoint+1 && video.currentTime < breakpoints[currentBreakpoint].time) {
      // video restarted
      currentBreakpoint = 0;
    }

    if (currentBreakpoint != lastBreakpoint) {
      switch (currentBreakpoint) {
        case 1:
          showTimer();
          referenceTime = new Date().getTime();
        break;
        case 8:
          referenceTime = new Date().getTime()-31080;
        break;
        case 10:
          referenceTime = undefined;
        break;
        case 11:
          referenceTime = new Date().getTime();
        break;
        case 12:
          hideTimer();
          referenceTime = undefined;
        break;
        default:
          referenceTime = new Date().getTime();
      }

      lastBreakpoint = currentBreakpoint;
    }

    if (typeof firstHeadingText != 'undefined') {
      firstTimerHeading.textContent = firstHeadingText;
    }

    if (twoFramesBeforeNextBreakpoint && currentBreakpoint != 10) {
      secondTimerHeading.textContent = '';
      hideTimer();
    } else {
      if (typeof secondHeadingText != 'undefined') {
        secondTimerHeading.textContent = secondHeadingText;
      }
      if (lastBreakpoint && currentBreakpoint != 12) {
        showTimer();
      }
    }
  }

  function handleMuteButtonClick(event) {
    var mute = this.classList.contains('active');

    this.classList.toggle('active');
    video.muted = mute;
  }

  function detect_autoplay(){
    if('ontouchstart' in document.body){
      document.body.classList.add('video-suspended');

      var heading = document.querySelector('.hero-timer-heading'),
          headingText;

      if (heading.dataset) {
        headingText = heading.dataset.defaultText;
      } else {
        headingText = heading.getAttribute('data-default-text');
      }

      heading.textContent = headingText;
    } else {
      window.requestAnimationFrame(loop);
    }
  }

  view.on('destroy', function () {
    running = false;
  });

  $('.video-mute-button').on('click', handleMuteButtonClick);
  detect_autoplay();
};