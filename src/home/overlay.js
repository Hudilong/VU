(() => {
    const overlay = document.querySelector("#Q1957128348");
    if (sessionStorage.getItem("overlayDismissed") === "true") {
        overlay.style.display = "none";
        return;
    }
    
    overlay.addEventListener("click", () => {
        sessionStorage.setItem("overlayDismissed", "true");
    });
})();