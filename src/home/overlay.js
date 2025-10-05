(() => {
    const overlayElements = [document.querySelector("#Q1957128348"), document.querySelector("#R1668069488")];
    console.log(overlayElements);
    if (sessionStorage.getItem("overlayDismissed") === "true") {
        hideOverlay();
        return;
    } else {
        overlayElements.forEach(element => element.addEventListener("click", () => {
            sessionStorage.setItem("overlayDismissed", "true");
            console.log('overlay was clicked');
        }));
    }

    function hideOverlay() {
        const closeOverlayLink = document.querySelector('[rel="close-overlay"]');
        if (closeOverlayLink) {
            closeOverlayLink.click();
        }
    }
})();