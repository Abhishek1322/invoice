// For Sticky Navbar
$(window).scroll(function(){
    var sticky = $('.sticky'),
    scroll = $(window).scrollTop();
    if (scroll >= 100) sticky.addClass('fixed');
    else sticky.removeClass('fixed');
});

$(document).on('click', '.expanded_tab', function(){
    if($("#vertical-tab").hasClass('expanded')){
      $("#vertical-tab").removeClass('expanded');
    }
    else {
      $("#vertical-tab").addClass('expanded');
    }
    
})

// For Fullscreen sidebar
function openNav() {
    $("#myNav").css({ "width": "40%"});
    var windowSize = window.matchMedia("(max-width: 600px)")
    if(windowSize.matches){
    $("#myNav").css({ "width": "100%"});
    }
// document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    $("#myNav").css({ "width": "0%" });
// document.getElementById("myNav").style.width = "0%";
}

// For Fullscreen sidebar
function openNav2() {
    $("#vertical-tab").css({ "width": "40%", "visibility": "visible" });
    var windowSize = window.matchMedia("(max-width: 600px)")
    if(windowSize.matches){
    $("#vertical-tab").css({ "width": "100%" });
}
$('.vertical_menu_items_').on('click', function()
{
  $('#vertical-tab').css({ "width": "0%", "visibility": "" });
})
// document.getElementById("myNav").style.width = "100%";
}
function closeNav2() {
    $("#vertical-tab").css({ "width": "0%", "visibility": "hidden" });
    // $(".vertical_menu_items_").removeClass('active');
// document.getElementById("myNav").style.width = "0%";
}

// Add Class in body after click on Menu-bar icon
$('.openbtn').on('click', function(){
    $('body').addClass('scroll-hide'); 
});

$('.closebtn').on('click', function(){
    $('body').removeClass('scroll-hide'); 
});

// Add active in header nav link
$('.nav-link').on('click', function(){
   $('.nav-link').removeClass('active');
   $(this).addClass('active');
});

// Start togglePassword icon change JS
var togglePassword = document.querySelector('.togglePassword');
console.log(togglePassword)
var  password = document.querySelector('.id_password');
if(togglePassword != null){
    togglePassword.addEventListener('click', function (e) {
        console.log(this);
        // toggle the type attribute
        var type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('hide-icon');
    });
};

// Start Add Remove_spc Class Right Content
$(document).on('click', '.expanded_tab', function(){
    if($('.content_areas').hasClass('remove_spc')){
      $('.content_areas').removeClass('remove_spc');  
    }
    else {
        $('.content_areas').addClass('remove_spc'); 
    }
     
})
// ENd Add Remove_spc Class Right Content
var playButton = document.getElementById("play_button");
// Event listener for the play/pause button
if(playButton){
    playButton.addEventListener("click", function() {
        if (video.paused == true) {
        // Play the video
        video.play();
        // Update the button text to 'Pause'
        playButton.innerHTML = "<i class='fas fa-pause'></i>";
        } else {
        // Pause the vide
        video.pause();
        // Update the button text to 'Play'
        playButton.innerHTML = "<i class='fas fa-play'></i>";
        }
    });
}

$(document).on('click', 'body', function(e)
{
    if($(".collapse").hasClass('show')){
        $(".collapse").removeClass('show', 2000, 3000);
    }   
});

// To logout the user on either close the window or the tab
// transfers sessionStorage from one tab to another
var sessionStorage_transfer = function(event) {
    if(!event) { event = window.event; } // ie suq
    if(!event.newValue) return;          // do nothing if no value to work with
    if (event.key == 'isSessionEnabled') {
      // another tab asked for the sessionStorage -> send it
      localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
      // the other tab should now have it, so we're done with it.
      localStorage.removeItem('sessionStorage'); // <- could do short timeout as well.
    } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
      // another tab sent data <- get it
      var data = JSON.parse(event.newValue);
      for (var key in data) {
        sessionStorage.setItem(key, data[key]);
      }
    }
  };
  
  // listen for changes to localStorage
  if(window.addEventListener) {
    window.addEventListener("storage", sessionStorage_transfer, false);
  } else {
    window.attachEvent("onstorage", sessionStorage_transfer);
  };
  
  
  // Ask other tabs for session storage (this is ONLY to trigger event)
  if (!sessionStorage.length) {
    localStorage.setItem('isSessionEnabled', true);
    localStorage.removeItem('isSessionEnabled', false);
  };
        