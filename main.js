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
function addToMovies(token, movies) {
    var embedURL = makeEmbedURL(token);
    var imgURL = makeImgURL(token);
    var one = makeOneElement(embedURL, imgURL, token);
    movies.insertBefore(one, movies.firstChild);
}
function getFromClipboard() {
    var _a, _b;
    var text = null;
    (_b = (_a = navigator.clipboard).readText) === null || _b === void 0 ? void 0 : _b.call(_a).then(function (clipText) { return text = clipText; });
    return text || null;
}
function writeURLsToStorage() {
    if (storageAvailable("localStorage"))
        localStorage.setItem("movies", JSON.stringify(urls));
}
function readURLsFromStorage() {
    return JSON.parse(localStorage.getItem("movies") || "null");
}
function validp(url) {
    return url.match(/^https:\/\/youtu.be\//);
}
function makeEmbedURL(token) {
    return "https://www.youtube.com/embed/" + token + "?rel=0&playsinline=1";
}
function makeImgURL(token) {
    return "http://img.youtube.com/vi/" + token + "/hqdefault.jpg";
}
function oneDeleter(token) {
    if (window.confirm("Really delete?")) {
        urls = urls.filter(function (str) { return str != token; });
        writeURLsToStorage();
        location.reload();
    }
}
function makeOneElement(embedURL, imgURL, token) {
    var one = document.createElement("div");
    one.setAttribute("class", "one");
    var link = document.createElement("a");
    link.setAttribute("href", embedURL);
    var img = document.createElement("img");
    img.setAttribute("src", imgURL);
    link.insertBefore(img, link.firstChild);
    one.insertBefore(link, img.firstChild);
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", function () { oneDeleter(token); });
    one.insertBefore(deleteButton, one.firstChild);
    return one;
}
function embedHandler() {
    var movies = document.getElementById("movies");
    var input = document.getElementById("url2").value;
    if (!input || !validp(input))
        input = getFromClipboard();
    else if (!input || !validp(input))
        return;
    var token = input.substring(17);
    addToMovies(token, movies);
    urls.push(token);
    writeURLsToStorage();
    document.getElementById("url").reset();
}
function setupEvents() {
    var _a, _b;
    var storages = readURLsFromStorage();
    if (storages) {
        var movies = document.getElementById("movies");
        if (!movies)
            return;
        var flag = false;
        for (var i = 0; i < storages.length; i++) {
            var str = storages[i];
            if (str.match(/^https:\/\/www.youtube.com\/embed\//)) {
                str = str.substring(30, str.length - 20);
                flag = true;
            }
            urls.push(str);
            addToMovies(str, movies);
        }
        if (flag)
            writeURLsToStorage();
    }
    (_a = document === null || document === void 0 ? void 0 : document.getElementById("aaa")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", embedHandler);
    (_b = document.getElementById("clear")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", clearStorage);
}
function clearStorage() {
    if (window.confirm("Really clear all?")) {
        urls = [];
        if (storageAvailable("localStorage")) {
            localStorage.clear();
        }
        document.getElementById("movies").innerHTML = "";
    }
}
window.addEventListener("load", setupEvents);
