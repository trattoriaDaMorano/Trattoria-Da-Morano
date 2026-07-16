const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName ('navbar-links')[0]
const icons = document.querySelectorAll('.toggle-button');
icons.forEach (icon => {
  icon.addEventListener('click', () => {
    icon.classList.toggle("open");
  });
  toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
  })
});
function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}
function openModal() {
  document.getElementById("myModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
  document.body.style.overflow = "";
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

// Keyboard navigation (desktop): arrow keys to move, Esc to close
document.addEventListener("keydown", function(e) {
  var modal = document.getElementById("myModal");
  if (!modal || modal.style.display !== "block") return;
  if (e.key === "ArrowLeft") { plusSlides(-1); }
  else if (e.key === "ArrowRight") { plusSlides(1); }
  else if (e.key === "Escape") { closeModal(); }
});

// Touch swipe navigation (mobile): swipe left/right to change slide
(function() {
  var modalContent = document.querySelector("#myModal .modal-content");
  if (!modalContent) return;
  var touchStartX = 0;
  var touchStartY = 0;

  modalContent.addEventListener("touchstart", function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  modalContent.addEventListener("touchend", function(e) {
    var touchEndX = e.changedTouches[0].screenX;
    var touchEndY = e.changedTouches[0].screenY;
    var deltaX = touchEndX - touchStartX;
    var deltaY = touchEndY - touchStartY;
    var minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX < 0) { plusSlides(1); }
      else { plusSlides(-1); }
    }
  }, { passive: true });
})();