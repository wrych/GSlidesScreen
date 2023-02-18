const extractBaseUrl = (rawUrl) => {
    return rawUrl.split("/").slice(0, -1).join("/")
}

class PresentationHandler {
    DEFAULT_AUTOPLAY = false;
    DEFAULT_DELAY = 12*1000; //milliseconds
    DEFAULT_REFRESH_TIME = 30*60*1000; //milliseconds
    DEFAULT_FUllSCREEN = false;
    LOADTIME = 1200; //milliseconds 

    constructor(autoplay, url, delay, refreshTime, fullScreen, logging) {
        this.autoplay = autoplay != undefined ? autoplay : this.DEFAULT_AUTOPLAY;
        this.url = url != undefined ? url : "";
        this.delay = delay != undefined ? delay : this.DEFAULT_DELAY;
        this.refreshTime = refreshTime != undefined ? refreshTime : this.DEFAULT_REFRESH_TIME;
        this.fullScreen = fullScreen != undefined ? fullScreen : this.DEFAULT_FUllSCREEN;
        this.logging = logging != undefined ? logging : true;
        this.presentationContainer = document.getElementById("presentation-container");
        this.presentationFrame = document.getElementById("presentation-frame");
        this.overlay = document.getElementById("loader-overlay");
        this.startMenu = document.getElementById("start-menu");
        this.closer = document.getElementById("closer");
        this.urlInput = document.getElementById("url");
        this.delayInput = document.getElementById("delay");
        this.refreshTimeInput = document.getElementById("refresh-time");
        this.fullScreenInput = document.getElementById("full-screen");
        this.startPresentationButton = document.getElementById("start-presentation")
        this.interval = null;
        this.addEventHandlers();
        this.setValues(url)
        this.log(`autoplay:      ${this.autoplay}`)
        if (this.autoplay) {
            this.startPresentation()
        }
    }

    addEventHandlers() {
        this.startPresentationButton.addEventListener("click", () => this.startPresentation())
        this.closer.addEventListener("click", () => this.closePresentation())
    }

    setValues() {
        this.log(`url:           ${this.url}`)
        this.log(`delay:         ${this.delay}`)
        this.log(`refreshTime:   ${this.refreshTime}`)
        this.log(`fullScren:     ${this.fullScreen}`)
        this.urlInput.value = this.url;
        this.delayInput.value = this.delay / 1000; //seconds
        this.refreshTimeInput.value = this.refreshTime / 60 / 1000; //minutes
        this.fullScreenInput.checked = this.fullScreen;
    }

    startPresentation() {
        this.startMenu.classList.add("hidden");
        this.presentationContainer.classList.remove("hidden");
        const presentationUrl = extractBaseUrl(this.urlInput.value);
        this.fullScreen = this.fullScreenInput.checked;
        const delay = this.delayInput.value * 1000;
        const fullUrl = `${presentationUrl}/embed?rm=minimal&start=true&loop=true&delayms=${delay}`;
        const refreshTime = this.refreshTimeInput.value * 60 * 1000;
        this.log(`Starting Presentation...`);
        this.log(`Fullscreen:   ${this.fullScreen}`);
        this.log(`Delay:        ${delay} ms`);
        this.log(`Refresh Time: ${refreshTime} ms`);
        this.log(`URL:          ${presentationUrl}`);
        this.log(`Full URL:     ${fullUrl}`);
        this.showLoader(this.LOADTIME);
        this.presentationFrame.src = fullUrl;
        if (this.fullScreen) {
            this.presentationContainer.requestFullscreen();
        }
        this.interval = setInterval(
            () => {
                this.log("Refreshing Presentation...");
                this.showLoader(this.LOADTIME);
                this.presentationContainer.src = this.presentationContainer.src;
            },
            refreshTime
        );
    }

    showLoader(delay) {
        this.overlay.classList.remove("hidden");
        setTimeout(() => this.overlay.classList.add("hidden"), delay)
    }

    closePresentation() {
        this.log("Exiting full screen...")
        clearInterval(this.interval)
        if (this.fullScreen) {
            this.fullScreen = false;
            document.exitFullscreen()
        }
        this.presentationContainer.classList.add("hidden");
        this.startMenu.classList.remove("hidden");
    }

    log(message) {
        if (this.logging) {
            console.log(message)
        }
    }
}


window.addEventListener("load", (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    presentationHandler = new PresentationHandler(
        parseUrlParam(urlParams.get("autoplay"), Boolean),
        parseUrlParam(urlParams.get("url"), String),
        parseUrlParam(urlParams.get("delay"), Number),
        parseUrlParam(urlParams.get("refreshtime"), Number),
        parseUrlParam(urlParams.get("fullscreen"), Boolean),
    );
});

const parseUrlParam = (value, expectedType) => {
    if (value == undefined) {
        return undefined;
    }
    switch (expectedType) {
        case Boolean:
            return value === "" || value === true || value === "true"
            break;
        case Number:
            return parseInt(value)
            break;
        case String:
            return String(value);
            break;
    }
}