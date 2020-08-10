// function catchEvent(eventObj: HTMLElement, event: string, eventHandler: EventListenerOrEventListenerObject){
//     eventObj.addEventListener(event, eventHandler, false);
// }
function storageAvailable(type: "localStorage" | "sessionStorage") {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
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

function cancelEvent(event: Event){
        event.preventDefault();
        event.stopPropagation();
}

var urls: string[] = [];

function addToMovies(token: string, movies: HTMLElement) {
    var embedURL = makeEmbedURL(token);
    var imgURL = makeImgURL(token);

    var one = makeOneElement(embedURL, imgURL, token);

    movies.insertBefore(one, movies.firstChild);
}

function getFromClipboard() {
    let text: string | null = null;
    navigator.clipboard.readText?.().then((clipText: string) => text = clipText);
    return text || null;
}

function writeURLsToStorage() {
    if (storageAvailable("localStorage"))
        localStorage.setItem("movies", JSON.stringify(urls));
}

function readURLsFromStorage(){
    return JSON.parse(localStorage.getItem("movies") || "null");
}

function validp(url: string){
    return url.match(/^https:\/\/youtu.be\//);
}

function makeEmbedURL(token: string) {
    return "https://www.youtube.com/embed/" + token + "?rel=0&playsinline=1";
}

function makeImgURL(token: string) {
    return "http://img.youtube.com/vi/" + token + "/hqdefault.jpg";
}

function oneDeleter (token: string) {
    if(window.confirm("Really delete?")) {
        urls = urls.filter(str => str != token);
        writeURLsToStorage();
        location.reload();
    }
}

function makeOneElement(embedURL: string, imgURL: string, token: string) {
    let one = document.createElement("div");
    one.setAttribute("class", "one");

    let link = document.createElement("a");
    link.setAttribute("href", embedURL);

    let img = document.createElement("img");
    img.setAttribute("src", imgURL);

    link.insertBefore(img, link.firstChild);
    one.insertBefore(link, img.firstChild);

    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click",
                                  function(){ oneDeleter(token); });

    one.insertBefore(deleteButton, one.firstChild);

    return one;
}

function embedHandler() {
    let movies = document.getElementById("movies");
    let input: string | null = (<HTMLInputElement> document.getElementById("url2")).value;

    if (!input || !validp(input)) input = getFromClipboard();
    else if (!input || !validp(input)) return;

    let token = input.substring(17);
    addToMovies(token, movies);

    urls.push(token);
    writeURLsToStorage();
    (<HTMLInputElement> document.getElementById("url2")).value = "";
}

function setupEvents(){
    let storages: string[] | null = readURLsFromStorage();
    if(storages){
        var movies = document.getElementById("movies");
        if (!movies) return;
        let flag = false;

        for (var i = 0; i < storages.length; i++) {
            var str = storages[i];
            if (str.match(/^https:\/\/www.youtube.com\/embed\//)) {
                str = str.substring(30, str.length - 20);
                flag = true;
            }
            urls.push(str);

            addToMovies(str, movies);
        }
        if (flag) writeURLsToStorage();
    }

    document?.getElementById("aaa")?.addEventListener("click",embedHandler);
    document.getElementById("clear")?.addEventListener("click",clearStorage);
}

function clearStorage(){
    urls = [];
    if(storageAvailable("localStorage")){
        localStorage.clear();
    }

    document.getElementById("movies").innerHTML="";
}


window.addEventListener("load", setupEvents);
