// function catchEvent(eventObj: HTMLElement, event: string, eventHandler: EventListenerOrEventListenerObject){
//     eventObj.addEventListener(event, eventHandler, false);
// }
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
function cancelEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}
function validateForm() {
    var _a;
    var result = "";
    var texts = (_a = document.getElementById("url")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("input");
    if (texts == null || texts == undefined) {
        return;
    }
    for (var i = 0; i < texts.length; i++) {
        if (texts[i].type != "submit") {
            result = texts[i].value.substring(17);
            break;
        }
    }
    var ele = document.createElement("iframe");
    ele.setAttribute("src", "https://www.youtube.com/embed/" + result + "?rel=0");
    var movies = document.getElementById("movies");
    if (movies == undefined) {
        return;
    }
    movies.insertBefore(ele, movies.firstChild);
    if (storageAvailable("localStorage")) {
        localStorage.setItem("movies", JSON.stringify(movies));
    }
}
function setupEvents(_event) {
    var _a;
    if (storageAvailable("localStorage")) {
        var newMovies = JSON.parse(localStorage.getItem("movies") || "null");
        ;
        var movies = document.getElementById("movies");
        if (newMovies) {
            for (var i = 0; i < newMovies.getElementsByTagName("iframe").length; i++) {
                movies === null || movies === void 0 ? void 0 : movies.appendChild(newMovies.getElementsByTagName("iframe")[i]);
            }
        }
    }
    (_a = document.getElementById("aaa")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", validateForm);
}
window.addEventListener("load", setupEvents);
