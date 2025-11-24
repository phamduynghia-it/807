// Simple Music Controller
class MusicController {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.5;
        this.init();
    }

    init() {
        // Tạo audio element
        this.audio = new Audio("music.mp3");
        this.audio.loop = true;
        this.audio.volume = this.volume;

        // Xử lý sự kiện khi audio kết thúc
        this.audio.addEventListener("ended", () => {
            this.isPlaying = false;
            this.updateButton();
        });

        // Tạo nút điều khiển
        this.createMusicButton();

        // Thêm sự kiện chạm vào màn hình để phát nhạc
        this.addTouchToPlay();
    }

    createMusicButton() {
        // Tạo nút điều khiển âm nhạc
        const musicBtn = document.createElement("div");
        musicBtn.className = "music-control-btn";
        musicBtn.id = "musicControlBtn";

        // Icon âm nhạc
        const musicIcon = document.createElement("div");
        musicIcon.className = "music-icon";
        musicIcon.innerHTML = "🎵";

        musicBtn.appendChild(musicIcon);
        document.body.appendChild(musicBtn);

        // Thêm sự kiện click
        musicBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Ngăn sự kiện bubble lên body
            this.toggle();
        });

        this.musicBtn = musicBtn;
        this.updateButton();
    }

    addTouchToPlay() {
        // Thêm sự kiện chạm vào màn hình để phát nhạc
        let touchCount = 0;
        let lastTouchTime = 0;

        const handleTouch = (e) => {
            // Bỏ qua nếu chạm vào nút âm nhạc
            if (e.target.closest(".music-control-btn")) {
                return;
            }

            const currentTime = Date.now();

            // Nếu chạm 2 lần liên tiếp trong 500ms thì phát nhạc
            if (currentTime - lastTouchTime < 500) {
                touchCount++;
                if (touchCount >= 2) {
                    this.play();
                    touchCount = 0;
                }
            } else {
                touchCount = 1;
            }

            lastTouchTime = currentTime;
        };

        // Thêm sự kiện cho cả touch và click
        document.body.addEventListener("touchstart", handleTouch, {
            passive: true,
        });
        document.body.addEventListener("click", handleTouch);

        // Thêm sự kiện chạm đơn giản (chỉ cần chạm 1 lần)
        document.body.addEventListener(
            "touchend",
            (e) => {
                // Bỏ qua nếu chạm vào nút âm nhạc
                if (e.target.closest(".music-control-btn")) {
                    return;
                }

                // Phát nhạc khi chạm vào màn hình (nếu chưa phát)
                if (!this.isPlaying) {
                    this.play();
                }
            },
            { passive: true }
        );
    }

    play() {
        if (this.audio) {
            this.audio
                .play()
                .then(() => {
                    this.isPlaying = true;
                    this.updateButton();
                })
                .catch((error) => {
                    console.log("Không thể phát nhạc:", error);
                });
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updateButton();
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    updateButton() {
        if (this.musicBtn) {
            if (this.isPlaying) {
                this.musicBtn.classList.add("playing");
            } else {
                this.musicBtn.classList.remove("playing");
            }
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }
}

// Khởi tạo music controller khi trang load
document.addEventListener("DOMContentLoaded", () => {
    window.musicController = new MusicController();
});
