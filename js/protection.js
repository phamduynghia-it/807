// Anti-debug và bảo vệ source code
(function () {
    "use strict";

    // Kiểm tra xem có phải mobile không
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

    // Chống F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+U (chỉ trên desktop)
    if (!isMobile) {
        document.addEventListener("keydown", function (e) {
            // Chống F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }

            // Chống Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }

            // Chống Ctrl+U
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }

            // Chống Ctrl+Shift+U
            if (e.ctrlKey && e.shiftKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }

            // Chống Ctrl+S
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Chống chuột phải (chỉ trên desktop)
    if (!isMobile) {
        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            return false;
        });
    }

    // Chống drag để select text
    document.addEventListener("selectstart", function (e) {
        e.preventDefault();
        return false;
    });

    // Chống copy
    document.addEventListener("copy", function (e) {
        e.preventDefault();
        return false;
    });

    // Chống cut
    document.addEventListener("cut", function (e) {
        e.preventDefault();
        return false;
    });

    // Chống paste
    document.addEventListener("paste", function (e) {
        e.preventDefault();
        return false;
    });

    // Anti-debug techniques (chỉ trên desktop)
    if (!isMobile) {
        let devtools = {
            open: false,
            orientation: null,
        };

        setInterval(function () {
            const threshold = 160;
            const widthThreshold =
                window.outerWidth - window.innerWidth > threshold;
            const heightThreshold =
                window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    devtools.orientation = widthThreshold
                        ? "vertical"
                        : "horizontal";
                    // Không redirect nữa, chỉ log
                    console.log("DevTools detected");
                }
            } else {
                devtools.open = false;
                devtools.orientation = null;
            }
        }, 1000); // Tăng interval lên 1 giây
    }

    // Chống console.log (chỉ trên desktop)
    if (!isMobile) {
        console.log = function () {};
        console.info = function () {};
        console.warn = function () {};
        console.error = function () {};
        console.debug = function () {};
    }

    // Chống alert
    window.alert = function () {};

    // Chống confirm
    window.confirm = function () {
        return false;
    };

    // Chống prompt
    window.prompt = function () {
        return null;
    };

    // Ẩn source code
    document.addEventListener("DOMContentLoaded", function () {
        // Disable view source (chỉ trên desktop)
        if (!isMobile) {
            document.onkeydown = function (e) {
                if (
                    e.ctrlKey &&
                    (e.keyCode === 67 ||
                        e.keyCode === 86 ||
                        e.keyCode === 85 ||
                        e.keyCode === 117)
                ) {
                    return false;
                }
            };
        }

        // Disable text selection
        document.body.style.userSelect = "none";
        document.body.style.webkitUserSelect = "none";
        document.body.style.mozUserSelect = "none";
        document.body.style.msUserSelect = "none";
    });

    // Chống inspect element (chỉ trên desktop)
    if (!isMobile) {
        setInterval(function () {
            debugger;
        }, 1000); // Tăng interval lên 1 giây
    }
})();
