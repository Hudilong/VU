(() => {
    const overlay = document.querySelector("#Q1957128348");
    console.log(overlay);
    if (sessionStorage.getItem("overlayDismissed") === "true") {
        const closeOverlayLink = document.querySelector('[rel="close-overlay"]');
        if (closeOverlayLink) {
            closeOverlayLink.click();
            console.log('Close overlay link does exist and was clicked');
        } else {
            overlay.style.display = "none";
            console.log('Overlay display set to none');
        }
        return;
    } else {
        overlay.addEventListener("click", () => {
            sessionStorage.setItem("overlayDismissed", "true");
            console.log('overlay was clicked');
        });
    }
})();