document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired');

  // Load and insert navbar
  fetch('nav.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('instance-nav').insertAdjacentHTML('afterbegin', html);
      initializeMenuEventListeners(); // Call a function to initialize event listeners after navbar is inserted
    });

  // Load and insert footer
  fetch('footer.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('instance-footer').insertAdjacentHTML('beforeend', html);
    });

  // Function to initialize event listeners for the menu
  function initializeMenuEventListeners() {
    const burgerIcon = document.querySelector('.burger-icon');
    const menu = document.querySelector('.menu');
    const menuItems = menu.querySelectorAll('a');

    // Toggle the menu and animate the burger icon
    burgerIcon.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default behavior
      console.log('Burger icon clicked');
      menu.classList.toggle('show'); // Toggle the 'show' class on the menu

      // Toggle the menu's height between 0 and its natural height
      if (menu.classList.contains('show')) {
        menu.style.height = menu.scrollHeight + 'px';
        // Gradually fade in each menu item
        menuItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = 1;
          }, index * 100); // Delay each menu item by 100ms
        });
      } else {
        menu.style.height = 0;
        // Reset opacity of menu items when hiding the menu
        menuItems.forEach(item => {
          item.style.opacity = 0;
        });
      }

      burgerIcon.classList.toggle('cross-icon');
    });

  }

});

















// Select all elements with the class "copyButton"
var copyButtons = document.querySelectorAll("#copyButton");
// Iterate over each button and attach the event listener
copyButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        // Get the current URL
        var url = window.location.href;
        // Create a temporary input element
        var input = document.createElement('input');
        input.setAttribute('value', url);
        document.body.appendChild(input);
        // Select the URL
        input.select();
        input.setSelectionRange(0, 99999); // For mobile devices
        // Copy the URL to the clipboard
        document.execCommand('copy');
        // Remove the temporary input
        document.body.removeChild(input);
        // Show the custom popup
        var popup = document.getElementById("popup");
        popup.style.display = "block";
        // Hide the popup after 2 seconds
        setTimeout(function() {
            popup.style.display = "none";
        }, 5000);
    });
});




window.addEventListener('scroll', function() {
  const bannerDiv = document.querySelector('.banner');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolledPercentage = (window.scrollY / scrollableHeight) * 100;

  // Check if bannerDiv exists before trying to manipulate it
  if (bannerDiv) {
      // Calculate the amount of scroll after which to show the banner (100vh)
      const scrollToShowBanner = window.innerHeight; // 100vh

      // Add or remove 'fixed' class based on scroll position
      if (window.scrollY >= scrollToShowBanner && window.scrollY <= scrollToShowBanner + window.innerHeight) {
          bannerDiv.classList.add('fixed');
      } else {
          bannerDiv.classList.remove('fixed');
      }

      // Show/hide the banner based on scroll position
      if (window.scrollY > scrollToShowBanner) {
          bannerDiv.style.top = '0';
      } else {
          bannerDiv.style.top = '-120px';
      }

      // Update width of scroll indicator
      scrollIndicator.style.width = scrolledPercentage + '%';

      // Show/hide the scroll indicator based on scroll position
      if (window.scrollY > scrollToShowBanner) {
          scrollIndicator.style.bottom = '30px';
      } else {
          scrollIndicator.style.bottom = '-50px';
      }
  }
});









  document.addEventListener("DOMContentLoaded", function() {
    var videos = document.querySelectorAll(".myVideo");
    videos.forEach(function(video) {
      var playButton = video.nextElementSibling;
      var videoContainer = video.parentElement;
      var firstPlay = true;
  
      playButton.addEventListener("click", function() {
        if (firstPlay) {
          fadeToWhite();
          firstPlay = false;
        } else {
          if (video.paused) {
            video.play();
            playButton.style.display = "none";
          } else {
            video.pause();
            playButton.style.display = "block";
          }
        }
      });
  
      video.addEventListener("click", function() {
        if (firstPlay) {
          fadeToWhite();
          firstPlay = false;
        } else {
          if (video.paused) {
            video.play();
            playButton.style.display = "none";
          } else {
            video.pause();
            playButton.style.display = "block";
          }
        }
      });
  
      function fadeToWhite() {
        var overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "white";
        overlay.style.opacity = 0;
        overlay.style.transition = "opacity 0.5s ease";
  
        videoContainer.appendChild(overlay);
  
        setTimeout(function() {
          overlay.style.opacity = 1;
          setTimeout(function() {
            video.play();
            playButton.style.display = "none";
            setTimeout(function() {
              overlay.style.opacity = 0;
              setTimeout(function() {
                videoContainer.removeChild(overlay);
              }, 500); // Adjust the duration of the white fadeout here
            }, 500); // Adjust the delay before the white fadeout starts here
          }, 500); // Adjust the duration of the white fadein here
        }, 100); // Adjust the delay before the white fadeout starts here
      }
    });
  });

  



// JavaScript for slideshow
var slides = document.querySelectorAll('.slide');
var currentSlide = 0;

// Function to fade in the next slide and fade out the current slide
function fadeSlides() {
    if (slides.length === 0) {
        return; // No slides to fade, exit the function
    }

    // Update current slide index
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Show next slide
    slides[currentSlide].style.opacity = 1;

    // Fade out the current slide after the new slide has fully faded in
    setTimeout(function() {
        slides[currentSlide === 0 ? slides.length - 1 : currentSlide - 1].style.opacity = 0;
    }, 1000); // Adjust timing based on the transition duration
}

// Automatically switch slides every 4 seconds
setInterval(fadeSlides, 4000);
















LottieInteractivity.create({
  mode:"scroll",
  player:'#lottie-management',
  actions: [
    {
        visibility: [0, 0.1],
        type: "stop",
        frames: [2]
    },
    {
        visibility: [0.1, 0.9],
        type: "seek",
        frames: [3, 160]
    },
    {
      visibility: [0.9, 2.0],
      type: "stop",
      frames: [160]
  }
  ]
});

LottieInteractivity.create({
  mode:"scroll",
  player:'#lottie-robotics',
  actions: [
    {
        visibility: [0, 0.1],
        type: "stop",
        frames: [2]
    },
    {
        visibility: [0.1, 1.0],
        type: "seek",
        frames: [3, 178]
    }
  ]
});





function handleInvalid(input) {
  input.classList.add('invalid-input');
  var errorMessageId = input.id + '-error';
  var errorMessageElement = document.getElementById(errorMessageId);
  errorMessageElement.textContent = 'Please fill in the above field.';
}

function handleInput(input) {
  input.classList.remove('invalid-input');
  var errorMessageId = input.id + '-error';
  var errorMessageElement = document.getElementById(errorMessageId);
  errorMessageElement.textContent = '';
}







function scrollToSection(sectionId) {
  var target = $(sectionId);
  if (target.length) {
    $('html, body').animate({
      scrollTop: target.offset().top
    }, 1500);
  }
}






