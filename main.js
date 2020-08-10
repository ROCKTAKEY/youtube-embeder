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
var urls = [];
function validateForm() {
    var _a;
    var result = "";
    var texts = (_a = document.getElementById("url")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("input");
    var text;
    text = null;
    if (!texts)
        navigator.clipboard.readText().then(function (clipText) { return text = clipText; });
    if (!text && !texts)
        return;
    if (text)
        result = text;
    else
        for (var i = 0; texts && i < texts.length; i++) {
            if (texts[i].type != "submit") {
                result = texts[i].value.substring(17);
                break;
            }
        }
    var url = "https://www.youtube.com/embed/" + result + "?rel=0&playsinline=1";
    urls.push(url);
    if (storageAvailable("localStorage")) {
        localStorage.setItem("movies", JSON.stringify(urls));
    }
    var ele = document.createElement("img");
    var urlimg = "http://img.youtube.com/vi/" + result + "/hqdefault.jpg";
    ele.setAttribute("src", urlimg);
    var movies = document.getElementById("movies");
    if (movies == undefined) {
        return;
    }
    movies.insertBefore(ele, movies.firstChild);
    var ele2 = document.createElement("a");
    ele2.setAttribute("href", url);
    ele2.innerText = url;
    movies.insertBefore(ele2, movies.firstChild);
    document.getElementById("url").reset();
    navigator.clipboard.writeText(url);
}
function setupEvents(_event) {
    var _a, _b;
    if (storageAvailable("localStorage")) {
        var newMovies = JSON.parse(localStorage.getItem("movies") || "null");
        ;
        var movies = document.getElementById("movies");
        if (newMovies != null) {
            for (var i = 0; i < newMovies.length; i++) {
                var url = newMovies[i];
                urls.push(url);
                var urlimg = "http://img.youtube.com/vi/" + url.substring(30, url.length - 20)
                    + "/hqdefault.jpg";
                var ele = document.createElement("img");
                ele.setAttribute("src", urlimg);
                movies === null || movies === void 0 ? void 0 : movies.insertBefore(ele, movies.firstChild);
                var ele2 = document.createElement("a");
                ele2.setAttribute("href", url);
                ele2.innerText = url;
                movies === null || movies === void 0 ? void 0 : movies.insertBefore(ele2, movies === null || movies === void 0 ? void 0 : movies.firstChild);
            }
        }
    }
    (_a = document === null || document === void 0 ? void 0 : document.getElementById("aaa")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", validateForm);
    (_b = document.getElementById("clear")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", clearStorage);
}
function clearStorage() {
    urls = [];
    if (storageAvailable("localStorage")) {
        localStorage.clear();
    }
    document.getElementById("movies").innerHTML = "";
}
window.addEventListener("load", setupEvents);
