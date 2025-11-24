// Ngăn chặn double-tap zoom và pinch zoom trên mobile
(function () {
    "use strict";

    let lastTouchEnd = 0;
    let preventZoom = true;

    // Ngăn chặn double-tap zoom
    document.addEventListener(
        "touchend",
        function (event) {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        },
        false
    );

    // Ngăn chặn pinch zoom
    document.addEventListener("gesturestart", function (event) {
        event.preventDefault();
    });

    document.addEventListener("gesturechange", function (event) {
        event.preventDefault();
    });

    document.addEventListener("gestureend", function (event) {
        event.preventDefault();
    });

    // Ngăn chặn zoom bằng keyboard
    document.addEventListener("keydown", function (event) {
        if (
            event.ctrlKey &&
            (event.key === "+" || event.key === "-" || event.key === "0")
        ) {
            event.preventDefault();
        }
    });

    // Ngăn chặn zoom bằng mouse wheel
    document.addEventListener(
        "wheel",
        function (event) {
            if (event.ctrlKey) {
                event.preventDefault();
            }
        },
        { passive: false }
    );

    // Ngăn chặn zoom bằng touch events
    document.addEventListener(
        "touchstart",
        function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        },
        { passive: false }
    );

    // Ngăn chặn zoom bằng meta viewport
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.head.appendChild(meta);

    // Thêm CSS để ngăn chặn zoom
    const style = document.createElement("style");
    style.textContent = `
        * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        html, body {
            touch-action: manipulation;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            text-size-adjust: 100%;
        }
        
        img, video, canvas {
            touch-action: none;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
        }
    `;
    document.head.appendChild(style);

    console.log("Double-tap zoom prevention enabled");
})();
