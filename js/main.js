const extractBaseUrl = (rawUrl) => {
    return rawUrl.split("/").slice(0, -1).join("/")
}

class PresentationHandler {
    constructor(logging) {
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
        this.fullScreen = false;
        this.loadTime = 2000;
        this.addEventHandlers();
    }

    addEventHandlers() {
        this.startPresentationButton.addEventListener("click", () => this.startPresentation())
        this.closer.addEventListener("click", () => this.closePresentation())
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
        this.showLoader(this.loadTime);
        this.presentationFrame.src = fullUrl;
        if (this.fullScreen) {
            this.presentationContainer.requestFullscreen();
        }
        this.interval = setInterval(
            () => {
                this.log("Refreshing Presentation...");
                this.showLoader(this.loadTime);
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
    presentationHandler = new PresentationHandler();
});