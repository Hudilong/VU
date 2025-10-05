(() => {
    const overlay = document.querySelector("#Q1957128348");
    console.log(overlay);
    if (sessionStorage.getItem("overlayDismissed") === "true") {
        hideOverlay();
        return;
    } else {
        overlay.addEventListener("click", () => {
            sessionStorage.setItem("overlayDismissed", "true");
            console.log('overlay was clicked');
        });
    }

    function hideOverlay() {
        const closeOverlayLink = document.querySelector('[rel="close-overlay"]');
        if (closeOverlayLink) {
            closeOverlayLink.click();
        } else {
            overlay.style.display = "none";
        }
    }
})();