# Portfolio Studio: Hướng dẫn cài đặt & sử dụng

Một **team marketing gồm 9 "nhân sự" Claude** giúp bạn làm portfolio cho các brand giả định: từ brand board, social post, key visual, bao bì, billboard cho tới proposal, video, phân tích quảng cáo và báo cáo. Mọi thứ hiện trên một trang tổng quan là **HUB**.

> Bạn là **Creative Director**: bạn chọn hướng, duyệt và yêu cầu sửa. Claude làm phần còn lại.

---

## Cài đặt (một lần, khoảng 10 phút)

**Cần có:** tài khoản **Claude Pro** và app **Claude Desktop**. Tải app ở claude.com/download.

1. **Cập nhật:** mở Claude Desktop, cập nhật lên bản mới nhất và đăng nhập tài khoản Pro.
2. **Tạo thư mục làm việc:**
   - Ví dụ `C:\PortfolioStudio`.
   - Tên không dấu, không khoảng trắng, và **không nằm trong OneDrive**. Trên laptop Lenovo, thư mục Documents thường được OneDrive đồng bộ, nên tránh để ở đó.
3. **Cài plugin** (chọn 1 trong 2 cách):
   - **Cách A:** Claude Desktop → **Customize → Plugins → Add → Add marketplace** → dán `Duyanh090205/portfolio-studio` → bật **Sync automatically** → bấm **Install** ở mục **marketing-team**. Plugin tự đồng bộ sang tab Code.
   - **Cách B:** trong tab **Code** (bước 4), gõ lần lượt 2 lệnh:
     ```
     /plugin marketplace add Duyanh090205/portfolio-studio
     /plugin install marketing-team@portfolio-studio
     ```
     Cài bằng cách B thì plugin **không hiện** ở trang Customize → Plugins. Chuyện này bình thường, plugin vẫn chạy trong tab Code.
4. **Mở tab Code:** trong Claude Desktop chọn tab **Code** → chọn thư mục ở bước 2 (Open folder). Đây là cách chạy khuyên dùng, và là cách đã được test kỹ nhất.
5. **Setup:**
   - Chọn model **Sonnet** ở nút cạnh ô gửi.
   - Gõ **`Setup Portfolio Studio. Tên mình là <tên>`**.
   - Khi Claude xin quyền (copy file, tạo file), bấm **Allow / Cho phép**.
6. **Mở HUB:**
   - Vào thư mục làm việc, bấm đúp **HUB.html** (mở bằng **Edge** hoặc **Chrome**) và ghim tab lại.
   - Chia đôi màn hình: Claude bên trái (**Win + ←**), HUB bên phải (**Win + →**).
   - Nếu không thấy file `HUB.html`: tải `portfolio-studio-starter.zip` ở https://github.com/Duyanh090205/portfolio-studio/releases rồi giải nén vào thư mục đó.

> **Phương án khác:** cũng có thể dùng **Cowork** (Projects → + → Use an existing folder) hoặc Claude Code trong VS Code/Antigravity. Câu lệnh giống hệt nhau. Cowork chạy trong máy ảo nên trên một số máy Windows Home có thể lỗi. Gặp lỗi thì quay về tab Code.

---

## Dùng hằng ngày

1. **Lần đầu:** mở HUB, xem **brand mẫu CEMMY** để biết từng thành viên cho ra gì, rồi đọc **Hướng dẫn → Đội ngũ của bạn**.
2. **Bắt đầu một dự án.** Chọn 1 trong 2 câu lệnh:
   - **`Tạo brand mới`:** brand giả định cho portfolio, hoặc **brand thật** bạn sẽ vận hành (ví dụ brand matcha).
   - **`Nhập dự án có sẵn`:** dự án bạn đã làm, ví dụ brand concept (The Label), campaign cho brand thật (Share A Coke), campaign xã hội (Water Safety) hay kênh nội dung. Bỏ tư liệu (PDF, chữ trên trang, ảnh, logo) vào thư mục `brands/<tên>/input/`. Claude đọc và **chỉ làm phần còn thiếu**.
3. **Làm tiếp:** ở trang dự án trong HUB, ô **Việc tiếp theo** luôn có sẵn câu cần gõ. Bấm **Copy**, dán vào Claude. Bước nào không hợp với loại dự án sẽ hiện mờ, ghi "Không áp dụng".
4. **Tạo ảnh:** Claude không vẽ ảnh chụp. Vào tab **Ảnh cần tạo**:
   - Lần đầu, bấm **📂 Chọn thư mục** và chọn thư mục Portfolio Studio, để HUB được phép lưu ảnh.
   - Mỗi ảnh ghi sẵn **nên dùng công cụ nào**:
     - **Gemini:** phần lớn ảnh.
     - **ChatGPT:** ảnh chủ lực cần giống sản phẩm thật nhất.
     - **Canva:** ghép logo thật lên túi, hộp, thiệp bằng app Mockups, để logo chuẩn 100%.
   - Bấm **Copy prompt**. Nếu có **ảnh tham chiếu đánh số 1, 2…** thì đính kèm vào Gemini/ChatGPT **đúng thứ tự** trước khi dán prompt:
     - logo: bấm **PNG** để tải;
     - ảnh chụp: chuột phải → Sao chép hình ảnh → Ctrl+V.
   - Ảnh **gần đúng**: mở **Câu sửa nhanh** dưới ảnh, copy câu hợp lỗi (sai tỉ lệ, logo méo, có chữ lạ…), dán tiếp vào **cùng chat**. Đừng tạo lại từ đầu.
   - Làm các ảnh của một bước trong **cùng một chat Gemini** cho đồng bộ.
   - Ưng ảnh nào thì **tải về rồi kéo thả** vào ô của ảnh đó, hoặc chuột phải → Sao chép hình ảnh → bấm vào ô → **Ctrl+V**. Ảnh tự lưu đúng tên và tự vào mọi thiết kế.
   - Billboard và bao bì: AI tạo **cảnh để trống**, rồi bạn ghép thiết kế thật vào bằng Canva. HUB có hướng dẫn ngay ở ảnh đó.
   - Với brand thật: ảnh sản phẩm là **ảnh bạn tự chụp**. HUB ghi hướng dẫn chụp thay cho prompt.
5. **Kiểm tra rồi mới duyệt** (mỗi bước):
   - Tạo và dán ảnh xong, bấm **🔍 Copy lệnh kiểm tra** (bấm vào thẻ thành viên, hoặc hộp ở đầu tab của bước đó) và dán vào Claude, ví dụ `Kiểm tra Social Media The Label`.
   - Claude soát riêng bước đó: đọc chữ trong ảnh, nhìn thử thiết kế, đối chiếu nghiên cứu, chấm 5 tiêu chí. Kết quả hiện ở đầu tab, kèm nút **🛠 Copy lệnh sửa**.
   - Ưng thì gõ lệnh **Duyệt …**, hoặc gõ thẳng lệnh bước tiếp theo (bước trước tự được duyệt).
   - Muốn sửa thì nói rõ, ví dụ "đổi headline post promo ngắn hơn".
6. **Trước khi đăng portfolio:** gõ **`Kiểm tra dự án <tên>`**. Claude soát chính tả, số thứ tự mục, disclaimer, claim và alt text.

### Đội ngũ

| # | Thành viên | Câu lệnh | Model |
|---|---|---|---|
| 0 | Brief | `Tạo brand mới` | Sonnet |
| 1 | Brand Strategist | `Làm Brand Strategist cho <brand>` | **Opus** với brand mới · Sonnet với dự án nhập có sẵn |
| 2 | Social Media Creative | `Làm Social Media cho <brand>` | Sonnet |
| 3 | Campaign Designer | `Làm Campaign cho <brand>` | Sonnet |
| 4 | Packaging Designer | `Làm Packaging cho <brand>` | Sonnet |
| 5 | OOH Designer | `Làm OOH cho <brand>` | Sonnet |
| 6 | Proposal Designer | `Làm Proposal cho <brand>` | Sonnet |
| + | Video Editor | `Làm Video cho <brand>` | Sonnet |
| + | Ads Manager | `Làm Ads research cho <brand>` | Sonnet |
| + | Report Analyst | `Làm Report cho <brand>` | Sonnet |
| + | Content Planner (brand thật) | `Lên lịch nội dung tháng này cho <brand>` · `Làm shoot pack tuần này cho <brand>` | Sonnet |
| ✓ | Kiểm tra dự án | `Kiểm tra dự án <tên>` | Sonnet |

### Tiết kiệm lượt dùng Claude Pro
- **Một brand trọn bộ khoảng 20 lượt nhắn.** Nên chia làm 2–3 buổi:
  - Buổi 1: Brief + Brand Strategist.
  - Buổi 2: Social, Campaign, Packaging.
  - Buổi 3: OOH, Proposal, rồi Video, Ads, Report.
- **Mỗi thành viên nên mở một chat mới.** Gộp các ý sửa vào một tin nhắn.
- **Xem mức dùng:** Claude → Settings → Usage.

### Xuất file cho portfolio
| Loại | Cách làm |
|---|---|
| **PNG** | Bấm **Mở riêng** ở thiết kế → **Win+Shift+S** → kéo khung quanh thiết kế |
| **PDF** (proposal, report, brand board) | **Ctrl+P** → Lưu dưới dạng PDF → tích **Đồ họa nền** |
| **MP4** (video) | Mở riêng → **F11** → **Win+Shift+R** → quay 1 vòng |
| **Claude Design** (tuỳ chọn) | Nút **🎨 Mang sang Claude Design** ở tab Brand board, để đánh bóng 2–3 tác phẩm chủ lực |

---

## Cập nhật phiên bản mới
- **Cài bằng cách A** (Customize → Plugins, có bật Sync automatically): plugin tự cập nhật.
- **Cài bằng cách B:** trong tab Code, gõ lần lượt:
  ```
  /plugin marketplace update portfolio-studio
  /plugin update marketing-team@portfolio-studio
  ```
- Muốn **tự động**: gõ `/plugin` → **Marketplaces** → **portfolio-studio** → bật **auto-update** (nếu bản Claude có mục này).
- Sau đó mở **phiên mới** và gõ `Setup Portfolio Studio`. Claude chỉ thay HUB (`HUB.html`, `_system/`), **không đụng** vào các brand của bạn. Nếu quên, thành viên nào thấy HUB cũ sẽ tự nhắc.

---

## Gặp sự cố
| Hiện tượng | Cách xử lý |
|---|---|
| HUB báo "Có file bị lỗi" | Copy câu lệnh sửa HUB gợi ý, dán vào Claude |
| Thiết kế có nhãn đỏ "⚠ Bố cục cần sửa" | Bấm **Copy lệnh sửa**, dán vào Claude |
| Ảnh đã lưu mà không hiện | Dùng cách dán Ctrl+V vào ô trong HUB. Nếu lưu tay, kiểm tra tên file đúng mã (vd `sm-launch.png`) rồi bấm **↻ Làm mới** |
| Không thấy nút Chọn thư mục / không dán được ảnh | Mở HUB bằng **Chrome hoặc Edge** (Firefox chưa hỗ trợ lưu thẳng vào thư mục) |
| Claude báo lưu file thất bại | Giữ Claude Desktop mở, thử lại trong một task mới |
| Hết lượt dùng giữa chừng | Cứ dừng. Lần sau gõ "Làm tiếp <bước> cho <brand>" |
