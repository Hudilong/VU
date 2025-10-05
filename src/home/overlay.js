(() => {
    const overlay = document.querySelector("#Q1957128348");
    console.log(overlay);
    if (sessionStorage.getItem("overlayDismissed") === "true") {
        overlay.style.display = "none";
        return;
    } else {
        overlay.addEventListener("click", () => {
            sessionStorage.setItem("overlayDismissed", "true");
            console.log('overlay was clicked');
        });
    }
})();