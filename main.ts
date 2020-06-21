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

function validateForm(){
    var result = "";
    var texts = document.getElementById("url")?.getElementsByTagName("input");
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
    if(storageAvailable("localStorage")){
        localStorage.setItem("movies", JSON.stringify(movies));
    }
}

function setupEvents(_event: Event){
    if(storageAvailable("localStorage")){
        var newMovies = JSON.parse(localStorage.getItem("movies") || "null");;
        var movies = document.getElementById("movies");

        if (newMovies) {
            for (var i = 0; i < newMovies.getElementsByTagName("iframe").length; i++) {
                movies?.appendChild(newMovies.getElementsByTagName("iframe")[i]);

            }
        }
    }

    document.getElementById("aaa")?.addEventListener("click",validateForm);
}

window.addEventListener("load", setupEvents);
