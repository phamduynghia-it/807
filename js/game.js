document.addEventListener("DOMContentLoaded", () => {
    const ROWS = 3,
        COLS = 3,
        PIECE_COUNT = ROWS * COLS;
    const IMAGE_SRC = "../images/puzzle.jpg";
    const puzzleBoard = document.getElementById("puzzleBoard");
    const piecesContainer = document.getElementById("pieces");
    const solutionImage = document.getElementById("solutionImage");
    const heartsContainer = document.querySelector(".falling-hearts");

    // Preload image để tránh lag
    const preloadImage = new Image();
    preloadImage.src = IMAGE_SRC;

    function renderBoard() {
        puzzleBoard.innerHTML = "";
        for (let i = 0; i < PIECE_COUNT; i++) {
            const cell = document.createElement("div");
            cell.className = "slot";
            cell.dataset.index = i;
            puzzleBoard.appendChild(cell);
        }
    }

    function renderPieces() {
        piecesContainer.innerHTML = "";
        let indexes = [...Array(PIECE_COUNT).keys()];
        shuffle(indexes);
        indexes.forEach((i) => {
            const piece = document.createElement("div");
            piece.className = "piece";
            piece.draggable = true;
            piece.dataset.index = i;
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            piece.style.backgroundImage = `url('${IMAGE_SRC}')`;
            piece.style.backgroundSize = `${COLS * 100}% ${ROWS * 100}%`;
            piece.style.backgroundPosition = `${(col * 100) / (COLS - 1)}% ${
                (row * 100) / (ROWS - 1)
            }%`;
            piecesContainer.appendChild(piece);
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Drag & Drop logic
    let draggedPiece = null;
    function addDnDEvents() {
        document.querySelectorAll(".piece").forEach((piece) => {
            piece.addEventListener("dragstart", (e) => {
                if (!piece.classList.contains("locked")) {
                    draggedPiece = piece;
                    e.dataTransfer.effectAllowed = "move";
                }
            });
            piece.addEventListener("dragend", (e) => {
                draggedPiece = null;
            });
            piece.addEventListener("touchstart", touchStart, {
                passive: false,
            });
            piece.addEventListener("touchmove", touchMove, { passive: false });
            piece.addEventListener("touchend", touchEnd, { passive: false });
        });
        document.querySelectorAll(".slot").forEach((slot) => {
            slot.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            });
            slot.addEventListener("dragenter", (e) => {
                e.preventDefault();
                if (!slot.hasChildNodes()) {
                    slot.classList.add("drag-over");
                }
            });
            slot.addEventListener("dragleave", (e) => {
                slot.classList.remove("drag-over");
            });
            slot.addEventListener("drop", (e) => {
                e.preventDefault();
                slot.classList.remove("drag-over");
                if (!draggedPiece || slot.hasChildNodes()) return;
                const pieceIndex = +draggedPiece.dataset.index;
                const slotIndex = +slot.dataset.index;
                if (pieceIndex === slotIndex) {
                    slot.appendChild(draggedPiece);
                    draggedPiece.classList.add("locked");
                    draggedPiece.draggable = false;
                    checkWin();
                } else {
                    piecesContainer.appendChild(draggedPiece);
                }
                draggedPiece = null;
            });
        });
    }

    // Touch logic for mobile
    let touchPiece = null,
        offsetX = 0,
        offsetY = 0,
        originalParent = null,
        lastTouchCell = null,
        isDragging = false;

    function touchStart(e) {
        if (e.target.classList.contains("locked")) return;
        e.preventDefault();
        e.stopPropagation();

        touchPiece = e.target;
        originalParent = touchPiece.parentNode;
        isDragging = true;

        const touch = e.touches[0];
        const rect = touchPiece.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        // Lưu vị trí ban đầu
        touchPiece.style.position = "fixed";
        touchPiece.style.zIndex = 1000;
        touchPiece.style.pointerEvents = "none";
        touchPiece.style.transition = "none";
        touchPiece.style.transform = "scale(1.05)";

        // Đặt vị trí ban đầu
        touchPiece.style.left = rect.left + "px";
        touchPiece.style.top = rect.top + "px";

        // Gọi touchMove để cập nhật vị trí
        setTimeout(() => touchMove(e), 10);
    }

    function touchMove(e) {
        if (!touchPiece || !isDragging) return;
        e.preventDefault();
        e.stopPropagation();

        const touch = e.touches[0];
        const newLeft = touch.clientX - offsetX;
        const newTop = touch.clientY - offsetY;

        touchPiece.style.left = newLeft + "px";
        touchPiece.style.top = newTop + "px";

        // Kiểm tra slot nào đang được hover
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        document
            .querySelectorAll(".slot")
            .forEach((cell) => cell.classList.remove("drag-over"));

        if (el && el.classList.contains("slot") && !el.hasChildNodes()) {
            el.classList.add("drag-over");
            lastTouchCell = el;
        } else {
            lastTouchCell = null;
        }
    }

    function touchEnd(e) {
        if (!touchPiece || !isDragging) return;
        e.preventDefault();
        e.stopPropagation();

        isDragging = false;

        if (lastTouchCell && !lastTouchCell.hasChildNodes()) {
            const pieceIndex = +touchPiece.dataset.index;
            const slotIndex = +lastTouchCell.dataset.index;
            if (pieceIndex === slotIndex) {
                // Đặt mảnh ghép vào đúng vị trí
                lastTouchCell.appendChild(touchPiece);
                touchPiece.classList.add("locked");
                touchPiece.draggable = false;
                checkWin();
            } else {
                // Trả về vị trí ban đầu
                originalParent.appendChild(touchPiece);
            }
        } else {
            // Trả về vị trí ban đầu
            originalParent.appendChild(touchPiece);
        }

        // Xóa các class và style
        document
            .querySelectorAll(".slot")
            .forEach((cell) => cell.classList.remove("drag-over"));

        touchPiece.style.position = "";
        touchPiece.style.left = "";
        touchPiece.style.top = "";
        touchPiece.style.zIndex = "";
        touchPiece.style.pointerEvents = "";
        touchPiece.style.transition = "";
        touchPiece.style.transform = "";

        touchPiece = null;
        lastTouchCell = null;
    }

    // Thêm event listener để ngăn chặn scroll khi đang kéo
    document.addEventListener(
        "touchmove",
        (e) => {
            if (isDragging) {
                e.preventDefault();
            }
        },
        { passive: false }
    );

    function checkWin() {
        const allLocked = Array.from(document.querySelectorAll(".slot")).every(
            (slot) =>
                slot.firstChild && slot.firstChild.classList.contains("locked")
        );
        if (allLocked) {
            // Thêm delay nhỏ để người chơi thấy mảnh cuối cùng được đặt
            setTimeout(showFullImageAndHearts, 300);
        }
    }

    function showFullImageAndHearts() {
        // Ẩn hoàn toàn bảng ghép hình và các mảnh ghép
        puzzleBoard.style.display = "none";
        piecesContainer.style.display = "none";

        // Hiển thị ảnh gốc hoàn chỉnh
        solutionImage.classList.add("show");

        // Thêm thông điệp tình yêu cute
        const loveMessage = document.createElement("div");
        loveMessage.innerHTML = `
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                padding: 25px;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(255, 154, 158, 0.4);
                z-index: 1001;
                text-align: center;
                animation: loveBounce 1s ease-out;
                border: 3px solid #ff6b9d;
                max-width: 280px;
                width: 90%;
            ">
                <div style="
                    font-size: 48px;
                    margin-bottom: 15px;
                    animation: heartBeat 1.5s ease-in-out infinite;
                ">💖</div>
                <h2 style="
                    color: #d63384;
                    margin: 0 0 8px 0;
                    font-size: 22px;
                    font-weight: bold;
                    text-shadow: 0 2px 4px rgba(214, 51, 132, 0.2);
                ">Tình yêu hoàn hảo! 💕</h2>
                <p style="
                    color: #8e44ad;
                    margin: 0 0 12px 0;
                    font-size: 16px;
                    line-height: 1.4;
                    font-weight: 500;
                ">Mỗi mảnh ghép là một kỷ niệm đẹp của chúng ta</p>
                <div style="
                    font-size: 20px;
                    margin-top: 10px;
                    animation: sparkle 2s ease-in-out infinite;
                ">✨ Forever Love ✨</div>
            </div>
        `;
        document.querySelector(".mobile-screen").appendChild(loveMessage);

        // Hiệu ứng trái tim rơi
        for (let i = 0; i < 30; i++) {
            const heart = document.createElement("div");
            heart.className = "heart";
            heart.style.left = Math.random() * 95 + "%";
            heart.style.animationDelay = Math.random() * 2 + "s";
            heart.style.transform += ` scale(${0.6 + Math.random() * 0.8})`;
            heartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 4000);
        }

        // Tự động ẩn thông điệp sau 4 giây
        setTimeout(() => {
            if (loveMessage.parentNode) {
                loveMessage.style.animation =
                    "loveFadeOut 0.8s ease-out forwards";
                setTimeout(() => loveMessage.remove(), 800);
            }
        }, 2000);
    }

    // Khởi tạo game
    renderBoard();
    renderPieces();
    addDnDEvents();

    // Thêm event listener để reset game khi click vào ảnh gốc
    solutionImage.addEventListener("click", () => {
        if (solutionImage.classList.contains("show")) {
            // Reset game
            solutionImage.classList.remove("show");
            puzzleBoard.style.display = "grid";
            piecesContainer.style.display = "grid";
            renderBoard();
            renderPieces();
            addDnDEvents();
        }
    });
});
