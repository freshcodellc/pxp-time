;(function ($){
  $(function() {
    // Initialize foundation menu
    $(document).foundation();
  	$(".right-off-canvas-toggle, .exit-off-canvas").click(function() {
    	$(".top-bar").toggleClass("top-bar-close");
  		$(".middle-bar").toggleClass("middle-bar-close");
  		$(".bottom-bar").toggleClass("bottom-bar-close");
  	});

    // Initialize foundation datepicker
    $('#start-date').fdatepicker({})
    $('#end-date').fdatepicker({})

    // Timer Logics
    var timer = false;

    function evaluateTime() {
      var currentTime = $('#timer').val();

      if (typeof currentTime === 'undefined') {
        stopTimer();
      } else if (currentTime === '') {
        var newTime = '00:00:00';
      } else {
        var timeArray = currentTime.split(':');
        if (timeArray.length === 3) {
          var hours = parseInt(timeArray[0])*60*60;
          var minutes = parseInt(timeArray[1])*60;
          var seconds = parseInt(timeArray[2]);

          var totalSeconds = (hours + minutes + seconds);

          var newTotal = (totalSeconds+1)*1000

          var newTime = moment.utc(newTotal).format("HH:mm:ss");
        } else {
          var newTime = '00:00:00';
        }
      }
      $('#timer').val(newTime)
    }

    function startTimer() {
      timer = setInterval(evaluateTime, 1000);
      $('#toggle-timer').removeClass('success');
      $('#toggle-timer').addClass('alert');
      $('#toggle-timer').html('Stop Timer');
    }

    function stopTimer() {
      if (typeof timer !== 'undefined' && timer) {
        timer = clearInterval(timer);
        $('#toggle-timer').removeClass('alert');
        $('#toggle-timer').addClass('success');
        $('#toggle-timer').html('Start Timer');
      }
    }

    $('#timer').click(function(e) {
      if (timer) {
        stopTimer();
      }
    })

    $('#toggle-timer').click(function(e) {
      if (timer) {
        stopTimer();
      } else {
        startTimer();
      }
    })

  });
})(jQuery);
