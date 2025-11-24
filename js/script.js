// Chuyển màn hình khi bấm Start
const startBtn = document.getElementById("start-btn");
if (startBtn) {
    startBtn.onclick = function () {
        document.getElementById("welcome-screen").style.display = "none";
        document.getElementById("lock-screen").style.display = "flex";
    };
}

// Xử lý nhập mật khẩu
const password = "2208"; // Đổi thành mã bạn muốn
let input = "";
const dots = document.getElementById("password-dots");
const numpadBtns = document.querySelectorAll(".numpad button");
const lockInput = document.querySelector(".lock-input");

// Tạo dots elements
function createDots() {
    dots.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        dots.appendChild(dot);
    }
}

// Cập nhật hiển thị dots
function updateDots() {
    const dotElements = dots.querySelectorAll(".dot");
    dotElements.forEach((dot, index) => {
        if (index < input.length) {
            dot.classList.add("filled");
        } else {
            dot.classList.remove("filled");
        }
    });
}

if (dots && numpadBtns && lockInput) {
    // Khởi tạo dots
    createDots();

    // Đặt màu viền mặc định
    lockInput.style.borderColor = "#ffb6c1";

    numpadBtns.forEach((btn) => {
        btn.onclick = function () {
            // Thêm hiệu ứng typing
            lockInput.classList.add("typing");
            setTimeout(() => {
                lockInput.classList.remove("typing");
            }, 200);

            if (btn.id === "backspace") {
                if (input.length > 0) {
                    input = input.slice(0, -1);
                    updateDots();
                }
            } else if (input.length < 4) {
                input += btn.textContent;
                updateDots();

                // Hiệu ứng khi nhập đủ 4 số
                if (input.length === 4) {
                    setTimeout(() => {
                        if (input === password) {
                            // Đúng password
                            lockInput.classList.add("correct");

                            setTimeout(() => {
                                // Chuyển sang trang menu.html
                                window.location.href = "menu.html";
                            }, 800);
                        } else {
                            // Sai password
                            lockInput.classList.add("wrong");
                            setTimeout(() => {
                                lockInput.classList.remove("wrong");
                                input = "";
                                updateDots();
                            }, 1000);
                        }
                    }, 300);
                }
            }
        };
    });
}
