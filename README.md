# Thư Ngỏ — Tin nhắn bí mật tự hủy

Ứng dụng web gửi lời nhắn bất ngờ qua link rút gọn hoặc mã QR. Nội dung được mã hóa trên trình duyệt; tin tự hủy sau khi đọc hoặc hết hạn.

## Tính năng (MVP)

- Tạo tin nhắn với chủ đề (sinh nhật, tình yêu, Giáng sinh…)
- Link chia sẻ + mã QR
- Mật khẩu bảo vệ, giới hạn lượt xem, tự hủy theo thời gian
- Lên lịch gửi (kích hoạt vào thời điểm đã chọn)
- Mã hóa AES-GCM phía client (khóa trong URL `#...` hoặc mật khẩu)
- Gửi nhanh không cần đăng ký

## Chạy dự án

**Terminal 1 — API:**

```bash
cd server
npm start
```

**Terminal 2 — Giao diện:**

```bash
cd client
npm run dev
```

Mở http://localhost:5173

## Kho lời chúc có sẵn

Chạy **chỉ client** cũng dùng được tính năng này (không cần server):

1. Bấm **「Kho lời chúc có sẵn」** dưới ô lời nhắn.
2. Chọn tab: Tình yêu, Sinh nhật, Bạn bè, Xin lỗi…
3. Bấm một câu → tự điền vào ô thư (có thể sửa thêm).
4. Bấm **Gửi tin nhắn** (lúc này cần server để tạo link).

Mẫu lời chúc nằm trong `client/src/constants/blessingTemplates.js`.

## Cấu trúc

- `client/` — React + Vite + Tailwind
- `server/` — Express + SQLite
- `tomtat.pdf` — Tài liệu phân tích & yêu cầu
