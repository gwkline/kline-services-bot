function showCard(selector, element) {
    Array.from(document.querySelectorAll('.yummy-cards')).forEach(el => {
        el.style.display = "none"
    })

    document.querySelector(selector).style.display = "block";
}


window.onload = () => {
    showCard('.yummy-nike');

}