document.addEventListener("DOMContentLoaded", () => {
    // === CHỈNH SỬA TIN NHẮN CỦA BẠN TẠI ĐÂY ===
    const messageSequence = [
        {
            text: "Nhi oiii Tớ và cậu đã yêu nhau được 100 ngày rùii á , dù không quá lâu nhưng cũng đủ để tớ và cậu hiểu nhiều về nhau . Dù nhiều lúc cả hai không hiểu nhau , tớ làm Nhi buồn ,  tổn thương và suy nghĩ về tớ rất nhiều , sau mỗi lần như thế tơd biết mình cần phải làm gì , cả hai thấu hiểu nhau hơn . Tớ cảm thấy may mắn khi cậu vẫn còn ở bên và đồng hành cùng tớ đến bây giờ . Năm nay cuối cấp roii tớ mong cho cả hai cùng cố gắng cho mục tiêu và ước mơ của mình , nhi hãy cứ tập chung cho bản thân mình nhé, tớ sẽ luôn ở bên cổ vũ nhii , sớm đạt 7.0 ielts nhe bé 😘 . Hứa với tớ sẽ đồng hành với tớ bây giờ và cả sau này nữa nha iu iuuu. Yêu emmm",
            time: "10:30",
        },
    ];
    // ===========================================

    const chatArea = document.getElementById("chatArea");
    const messageContainer = document.getElementById("messageContainer");

    // Tạo audio element cho tinnhan.mp3
    const notificationSound = new Audio("tinnhan.mp3");
    notificationSound.volume = 0.7;

    let currentMessageIndex = 0;
    let isSoundEnabled = true; // Biến để kiểm soát âm thanh

    function showNextMessage() {
        // Nếu đã hết tin nhắn thì tắt/bật âm thanh
        if (currentMessageIndex >= messageSequence.length) {
            toggleSound();
            return;
        }

        // Lấy thông tin tin nhắn hiện tại
        const messageData = messageSequence[currentMessageIndex];

        // Tạo các phần tử HTML cho tin nhắn
        const messageWrapper = document.createElement("div");
        messageWrapper.className = "message-wrapper sent";

        const timestamp = document.createElement("span");
        timestamp.className = "timestamp";
        timestamp.textContent = messageData.time;

        const messageBubble = document.createElement("div");
        messageBubble.className = "message-bubble";
        messageBubble.textContent = messageData.text;

        // Ghép các phần tử lại với nhau
        messageWrapper.appendChild(timestamp);
        messageWrapper.appendChild(messageBubble);

        // Thêm tin nhắn vào màn hình chat
        messageContainer.appendChild(messageWrapper);

        // Tự động cuộn xuống tin nhắn mới nhất
        chatArea.scrollTop = chatArea.scrollHeight;

        // Phát âm thanh thông báo (nếu đang bật)
        if (isSoundEnabled) {
            playNotificationSound();
        }

        // Tăng chỉ số để chuẩn bị cho tin nhắn tiếp theo
        currentMessageIndex++;
    }

    function playNotificationSound() {
        // Phát âm thanh thông báo
        notificationSound.currentTime = 0;
        notificationSound.play().catch((error) => {
            console.log("Không thể phát âm thanh:", error);
        });
    }

    function toggleSound() {
        isSoundEnabled = !isSoundEnabled;

        // Nếu đang phát âm thanh thì dừng lại
        if (!isSoundEnabled && !notificationSound.paused) {
            notificationSound.pause();
            notificationSound.currentTime = 0;
        }
    }

    // Gắn sự kiện click/tap vào khu vực chat
    chatArea.addEventListener("click", showNextMessage);

    // Thêm sự kiện chạm vào màn hình để phát âm thanh (chỉ khi âm thanh đang bật)
    document.body.addEventListener(
        "touchstart",
        (e) => {
            // Bỏ qua nếu chạm vào khu vực chat (để tránh xung đột)
            if (e.target.closest("#chatArea")) {
                return;
            }

            // Phát âm thanh khi chạm vào màn hình (chỉ khi đang bật)
            if (isSoundEnabled) {
                playNotificationSound();
            }
        },
        { passive: true }
    );

    document.body.addEventListener("click", (e) => {
        // Bỏ qua nếu click vào khu vực chat (để tránh xung đột)
        if (e.target.closest("#chatArea")) {
            return;
        }

        // Phát âm thanh khi click vào màn hình (chỉ khi đang bật)
        if (isSoundEnabled) {
            playNotificationSound();
        }
    });
});
