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

function validateForm(){
    var result = "";
    var texts = document.getElementById("url")?.getElementsByTagName("input");
    var text: string;
    if(!texts)
        navigator.clipboard.readText().then(clipText => text = clipText);

    if (!text && (texts == null || texts == undefined)) {
        return;
    }

    if(text) result = text;
    else
        for (var i = 0; i < texts.length; i++) {
            if (texts[i].type != "submit") {
                result = texts[i].value.substring(17);
                break;
            }
        }

    var ele = document.createElement("iframe");
    var url = "https://www.youtube.com/embed/" + result + "?rel=0&playsinline=1";
    urls.push(url);

    ele.setAttribute("src", url);
    var movies = document.getElementById("movies");
    if (movies == undefined) {
        return;
    }
    movies.insertBefore(ele, movies.firstChild);
    if(storageAvailable("localStorage")){
        localStorage.setItem("movies", JSON.stringify(urls));
    }

    var ele2 = document.createElement("a");
    ele2.setAttribute("href", url);
    ele2.innerText = url;
    movies.insertBefore(ele2, movies.firstChild);

    (<HTMLFormElement>document.getElementById("url")).reset();
    navigator.clipboard.writeText(url);
}

function setupEvents(_event: Event){
    if(storageAvailable("localStorage")){
        var newMovies = JSON.parse(localStorage.getItem("movies") || "null");;
        var movies = document.getElementById("movies");

        if (newMovies!=null) {
            for (var i = 0; i < newMovies.length; i++) {
                var url=newMovies[i];
                urls.push(url);
                var ele = document.createElement("iframe");
                ele.setAttribute("src", url);
                movies?.insertBefore(ele, movies.firstChild);
                var ele2 = document.createElement("a");
                ele2.setAttribute("href", url);
                ele2.innerText = url;
                movies.insertBefore(ele2, movies.firstChild);
            }
        }
    }

    document.getElementById("aaa")?.addEventListener("click",validateForm);
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
