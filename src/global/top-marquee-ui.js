(() => {
  /* ========= Top Bar ========= */
  const initTopBar = () => {
    const bar = document.createElement("div");
    bar.id = "top-bar";
    document.body.appendChild(bar);

    let isVisible = false;

    document.addEventListener("mousemove", (e) => {
      if (e.clientY < 100) {
        if (!isVisible) {
          bar.style.top = "0";
          isVisible = true;
        }
      } else if (isVisible) {
        bar.style.top = "-15px";
        isVisible = false;
      }
    });
  };

  /* ========= Marquee Indicator ========= */
  const initMarqueeIndicator = () => {
    const SELECTOR = "marquee-set";
    const INDICATOR_ID = "marquee-cursor-indicator";
    const HIDDEN_CLASS = "hidden";
    const LABEL = "Cliquez pour défiler";

    let canShow = true;

    function ensureIndicator() {
      let el = document.getElementById(INDICATOR_ID);
      const marquee = document.querySelector(SELECTOR);
      if (el) return el;
      if (!marquee) return null;

      el = document.createElement("div");
      el.id = INDICATOR_ID;
      el.className = HIDDEN_CLASS;
      el.textContent = LABEL;
      marquee.style.position = marquee.style.position || "relative";
      document.body.appendChild(el);
      return el;
    }

    function showIndicator(x, y) {
      if (!canShow) return;
      const indicator = ensureIndicator();
      if (!indicator) return;
      indicator.classList.remove(HIDDEN_CLASS);
      const dx = Math.round(x - indicator.offsetWidth / 2);
      const dy = Math.round(y - indicator.offsetHeight - 10);
      indicator.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    function hideIndicator() {
      const indicator = ensureIndicator();
      if (!indicator) return;
      indicator.classList.add(HIDDEN_CLASS);
    }

    function wire(node) {
      try {
        if (!node || node._wired) return;
        node._wired = true;
        let hovering = false;

        const onMove = (e) => {
          if (!hovering) return;
          showIndicator(e.clientX, e.clientY);
        };
        const onEnter = (e) => {
          hovering = true;
          showIndicator(e.clientX, e.clientY);
          node.addEventListener("mousemove", onMove);
        };
        const onLeave = () => {
          hovering = false;
          hideIndicator();
          node.removeEventListener("mousemove", onMove);
        };
        const onDown = () => {
          canShow = false;
          hideIndicator();
        };
        const onUp = (e) => hovering && showIndicator(e.clientX, e.clientY);

        node.addEventListener("mouseenter", onEnter);
        node.addEventListener("mouseleave", onLeave);
        node.addEventListener("pointerdown", onDown, { passive: true });
        node.addEventListener("pointerup", onUp, { passive: true });
        node.addEventListener("pointercancel", hideIndicator, { passive: true });
      } catch (err) {
        logWarn("Failed to wire a marquee-contents node.", err);
      }
    }

    function waitForContent(callback, delay = 100) {
      const tryInit = () => {
        const contentNode = document.querySelector(".content");
        if (contentNode) {
          callback(contentNode);
        } else {
          setTimeout(tryInit, delay);
        }
      };
      tryInit();
    }

    const marqueeCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const marqueeEl = document.querySelector(SELECTOR);
          if (marqueeEl) {
            canShow = true;
            marqueeEl.style.position = "relative";
            marqueeEl.style.zIndex = "200";
            wire(marqueeEl);
          } else {
            canShow = false;
          }
        }
      }
    };

    waitForContent((contentNode) => {
      const marqueeObserver = new MutationObserver(marqueeCallback);
      marqueeObserver.observe(contentNode, { childList: true, subtree: true });
    });
  };

  /* ========= Boot ========= */
  const boot = () => {
    initTopBar();
    initMarqueeIndicator();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
