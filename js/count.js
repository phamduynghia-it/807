document.addEventListener('DOMContentLoaded', () => {

    // ================================================================
    // === CHỈNH SỬA NGÀY BẮT ĐẦU YÊU NHAU CỦA BẠN TẠI ĐÂY ===
    // Định dạng: YYYY, MM, DD (Năm, Tháng, Ngày)
    // Lưu ý: Tháng trong JavaScript bắt đầu từ 0 (Tháng 1 là 0, Tháng 2 là 1,...)
    // Ví dụ: Ngày 15 tháng 10 năm 2022 sẽ là (2022, 9, 15)
    const startDate = new Date(2025, 7, 22); 
    // ================================================================


    // Lấy các phần tử DOM để cập nhật
    const yearsEl = document.getElementById('years');
    const monthsEl = document.getElementById('months');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function formatTime(time) {
        // Thêm số 0 vào trước nếu số nhỏ hơn 10 (ví dụ: 7 -> "07")
        return time < 10 ? `0${time}` : time;
    }

    function calculateTimeDifference() {
        const now = new Date();
        
        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();
        let hours = now.getHours() - startDate.getHours();
        let minutes = now.getMinutes() - startDate.getMinutes();
        let seconds = now.getSeconds() - startDate.getSeconds();

        // Xử lý các giá trị âm (vay mượn từ đơn vị lớn hơn)
        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            days--;
        }
        if (days < 0) {
            // Lấy số ngày của tháng trước để "vay mượn"
            const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += daysInLastMonth;
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }
        
        // Cập nhật lên giao diện
        yearsEl.innerText = formatTime(years);
        monthsEl.innerText = formatTime(months);
        daysEl.innerText = formatTime(days);
        hoursEl.innerText = formatTime(hours);
        minutesEl.innerText = formatTime(minutes);
        secondsEl.innerText = formatTime(seconds);
    }
    
    // Chạy hàm lần đầu tiên để không phải chờ 1 giây
    calculateTimeDifference();

    // Cập nhật bộ đếm mỗi giây
    setInterval(calculateTimeDifference, 1000);
});