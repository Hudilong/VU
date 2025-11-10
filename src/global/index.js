(() => {
  const OVERLAY_ID = "Z0762089527";
  const OVERLAY_SEEN_KEY = "introOverlaySeen";
  const INDICATOR_SEEN_KEY = "marqueeIndicatorSeen";

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

  /* ========= Overlay Gate ========= */
  const dismissOverlay = () => {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;
    const closer = overlay.querySelector?.('[rel="close-overlay"]');
    if (closer) {
      closer.click();
    } else {
      overlay.style.display = "none";
    }
  };

  const initOverlayGate = (onSeen) => {
    const markSeen = () => {
      if (sessionStorage.getItem(OVERLAY_SEEN_KEY) === "1") return;
      sessionStorage.setItem(OVERLAY_SEEN_KEY, "1");
      dismissOverlay();
      onSeen?.();
    };

    if (sessionStorage.getItem(OVERLAY_SEEN_KEY) === "1") {
      dismissOverlay();
      onSeen?.();
      return;
    }

    const armOverlay = (overlay) => {
      if (!overlay) return false;
      if (!overlay._overlayGateWired) {
        overlay._overlayGateWired = true;
        overlay.addEventListener("click", markSeen, { capture: true });
      }

      const host = overlay.parentElement || overlay;
      if (host && !host._overlayGateWired) {
        host._overlayGateWired = true;
        host.addEventListener("click", markSeen, { capture: true });
      }

      const closer = overlay.querySelector?.('[rel="close-overlay"]');
      if (closer && !closer._overlayGateWired) {
        closer._overlayGateWired = true;
        closer.addEventListener("click", markSeen, { capture: true });
      }

      const removalObserver = new MutationObserver(() => {
        if (!document.getElementById(OVERLAY_ID)) {
          removalObserver.disconnect();
          markSeen();
        }
      });
      removalObserver.observe(document.body, { childList: true, subtree: true });
      return true;
    };

    const wire = () => armOverlay(document.getElementById(OVERLAY_ID));
    if (wire()) return;

    const observer = new MutationObserver(() => {
      if (wire()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  /* ========= Marquee Indicator ========= */
  const initMarqueeIndicator = () => {
    const SELECTOR = "marquee-set";
    const INDICATOR_ID = "marquee-cursor-indicator";
    const HIDDEN_CLASS = "hidden";
    const LABEL = "Cliquez pour défiler";
    const overlaySeen = () => sessionStorage.getItem(OVERLAY_SEEN_KEY) === "1";
    const indicatorSeen = () => sessionStorage.getItem(INDICATOR_SEEN_KEY) === "1";

    let canShow = overlaySeen() && !indicatorSeen();
    let indicatorVisible = false;

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
      const indicator = ensureIndicator();
      if (!indicator) return;
      const allowFirstDisplay = canShow && overlaySeen();
      if (!allowFirstDisplay && !indicatorVisible) return;

      if (!indicatorVisible) {
        sessionStorage.setItem(INDICATOR_SEEN_KEY, "1");
        canShow = false;
        indicator.classList.remove(HIDDEN_CLASS);
        indicatorVisible = true;
      }

      const dx = Math.round(x - indicator.offsetWidth / 2);
      const dy = Math.round(y - indicator.offsetHeight - 10);
      indicator.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    function hideIndicator() {
      const indicator = ensureIndicator();
      if (!indicator) return;
      indicator.classList.add(HIDDEN_CLASS);
      indicatorVisible = false;
    }

    const recomputePermission = () => {
      canShow = overlaySeen() && !indicatorSeen();
      if (!canShow) hideIndicator();
    };

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
            recomputePermission();
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

    return { recomputePermission };
  };

  /* ========= Boot ========= */
  const boot = () => {
    initTopBar();
    const indicator = initMarqueeIndicator();
    initOverlayGate(() => indicator?.recomputePermission());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
