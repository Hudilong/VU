(() => {
  const bar = document.createElement("div");
  bar.id = "top-bar";
  document.body.appendChild(bar);

  let isVisible = false;

  document.addEventListener("mousemove", (e) => {
    if (e.clientY < 200) { // near the top
      if (!isVisible) {
        bar.style.top = "0";
        isVisible = true;
      }
    } else {
      if (isVisible) {
        bar.style.top = "-50px";
        isVisible = false;
      }
    }
  });
})();