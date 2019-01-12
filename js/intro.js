// Listen for button click and do CSS transition when clicked
var button = document.getElementById('intro_button');
var intro_screen = document.getElementById('intro')

button.onclick = function() {
    intro_screen.classList.add('transition')
}
