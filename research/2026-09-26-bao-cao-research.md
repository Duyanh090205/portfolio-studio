# Báo cáo research: hệ thống "team marketing Claude" (2026-09-26)

Tổng hợp từ 6 subagent. Nguồn đã kiểm tra ngày 2026-09-26. Mục nào có ghi **(chưa kiểm chứng)** thì cần test thực tế.

## 1. Ràng buộc cứng: gói Pro dùng được ở đâu

| Cách dùng | Dùng gói Pro được không? |
|---|---|
| App Claude (chat và Cowork, đã gộp từ 16/9/2026), Claude Design, Claude Code desktop | ✅ Có, tất cả chung một hạn mức (5 giờ + hạn mức tuần) |
| Artifact trên claude.ai gọi Claude | ✅ Tính vào hạn mức của **người xem**, không cần API key. Artifact có dùng connector thì chỉ để private (Pro chỉ chia sẻ được bằng link public) |
| Connector: Canva, Google Drive, Claude in Chrome, MCP remote tự thêm (Recraft, Ideogram, fal...) | ✅ Có |
| `claude -p` chạy trên máy mình | ✅ Được phép hiện tại. Chính sách về Agent SDK đang tạm hoãn thay đổi, có thể đổi sau |
| n8n / Make / Zapier **gọi** Claude | ❌ Cần API key trả tiền riêng (chiều ngược lại, Claude gọi n8n qua MCP, thì được) |
| Web app tự host gọi Claude | ❌ Cần API key |
| GUI wrapper cho Claude Code CLI (opcode, claudecodeui, Open Design...) | ⚠️ Vùng xám. Bản chạy trên máy mình dùng CLI gốc thì tạm chấp nhận. Bản hosted hoặc bản lấy token login thì **không được dùng** |

Nguồn: code.claude.com/docs/en/legal-and-compliance · support.claude.com/en/articles/15036540 · support.claude.com/en/articles/17153992 · theregister.com 2026-02-20 và 2026-04-06

## 2. Nền tảng Claude

- **Cowork:** có trên Pro cho Windows và Mac (GA 9/4/2026), có thêm bản web và mobile từ 7/2026. Hỗ trợ plugin, skill, scheduled task và đọc/ghi thư mục local.
- **Cài plugin trong Cowork:** vào Customize → Plugins → Add marketplace, nhập `owner/repo` của GitHub, bật **Sync automatically**. Người dùng không cần git.
  - Repo private cần cài Claude GitHub App.
  - Không để thư mục `bin/` ở gốc plugin, vì chat và Cowork sẽ từ chối cài.
- **Khác biệt giữa các nền tảng:**
  - Chat chỉ nạp skills, commands và connector web. Agents, hooks và MCP local bị bỏ qua.
  - Cowork và Code nạp đủ.
  - → Viết 9 vai trò thành **skills** để chạy được ở mọi nơi.
- **Skills dùng cơ chế progressive disclosure:** lúc chưa gọi, mỗi skill chỉ tốn khoảng 100 token. Khi kích hoạt thì nạp SKILL.md (dưới 5k token), còn các file references chỉ nạp khi thật sự đọc tới.
- **Claude Design:** có trong Pro (beta). Tạo layout bằng HTML: brand system, slides, one-pager, social. Xuất ra PDF, PPTX, Canva. **Không tạo ảnh chụp.** Tốn usage nặng, chung hạn mức với phần còn lại.
- **Model trên Pro:** Opus 5.5, Sonnet 5, Haiku 4.5. Fable chỉ chạy bằng credit trả thêm, **không dùng**. Mức tốn: Haiku < Sonnet < Opus.
- **Cách tiết kiệm usage (theo Anthropic):**
  - Gộp yêu cầu vào một tin nhắn.
  - Dùng Projects, vì file trong Project được cache.
  - Giữ instructions và CLAUDE.md gọn.
  - Tắt connector không dùng.
  - Chọn model đúng việc, mở chat mới cho mỗi việc.
  - Trỏ tới file thay vì dán nội dung vào chat.
- **Windows Home và Cowork (laptop Intel Core Ultra 7):**
  - Không bị loại chính thức, nhưng có nhiều báo lỗi Hyper-V trên bản Home chưa được xử lý.
  - Cần bật Virtualization và Virtual Machine Platform, và cài bản cập nhật KB5129195.
  - Cowork giờ mặc định chạy trên cloud, nên máy ảo local có thể không còn quan trọng lắm **(chưa kiểm chứng trên máy thật)**.
  - Phương án dự phòng: tab Code trong Claude Desktop (không cần máy ảo), hoặc chat + Projects + Skills (phải tải file lên/xuống bằng tay).

## 3. Tạo ảnh

| Việc | Công cụ đề xuất | Chi phí |
|---|---|---|
| Ảnh sản phẩm, social, mockup cảnh | **Gemini app, Nano Banana 2** (nhận tới 14 ảnh tham chiếu) | Miễn phí. Có ưu đãi sinh viên 1 năm tới 31/12/2026, cần kiểm tra quốc gia |
| 2-3 ảnh hero quan trọng nhất | ChatGPT Free/Go (GPT Image 2.5, đang #1 bảng xếp hạng) | $0–8 |
| Logo | Claude viết SVG (miễn phí, đúng mã màu), Recraft vector qua MCP chính thức `mcp.recraft.ai/mcp` | Miễn phí (credit free của Recraft) |
| Đặt logo thật lên mockup, chữ, layout | **Canva Pro** (Brand Kit, Mockups, connector chính thức) | Đã có sẵn |
| Tự động hoá theo lô (tuỳ chọn) | fal.ai remote MCP (FLUX.2 khoảng $0.014–0.07/ảnh), Gemini API ($0.034–0.134/ảnh) | Trả theo ảnh |

- Một brand board (khoảng 20 ảnh cuối, 50 lần tạo) nếu làm hoàn toàn bằng API tốn **khoảng $3–8**. Nếu làm thủ công qua Gemini free thì **$0**.
- **Chạy local:** không đáng.
  - RTX 3060 6GB chỉ đủ SDXL hoặc FLUX nén, chữ trong ảnh hỏng.
  - Laptop Intel Core Ultra với Arc iGPU (Intel AI Playground) mất 15 giây đến 3 phút mỗi ảnh, logo và chữ không dùng được.
- **Giữ ảnh đồng bộ brand:**
  - Khoá một đoạn "brand bible" trong prompt (mã màu, ánh sáng, góc máy, những thứ cấm) và dùng lại y nguyên ở mọi prompt.
  - Luôn đính kèm ảnh tham chiếu: logo, bảng màu, ảnh hero đã duyệt.
  - Logo thật thì ghép bằng Canva Mockups, không để AI tự vẽ logo.
- **Chưa kiểm chứng:**
  - Hạn mức AI của Canva Pro.
  - Tính năng Brand Kit và autofill qua connector có bị giới hạn ở gói Enterprise không.
  - Credit free của Recraft và quyền xuất SVG ở gói free.

## 4. Repo có sẵn (đã kiểm tra qua GitHub API)

| Repo | Dùng vào việc gì |
|---|---|
| `anthropics/knowledge-work-plugins` (Apache-2.0, 25.7k★) | Khung plugin và cách phân phối. Plugin `small-business` có sẵn: `brand-style` (thu thập brand bằng lời thường), `smb-router`, bước duyệt giữa các vai trò. Plugin `marketing` có: `campaign-plan`, `competitive-brief`, `performance-report` |
| `google-labs-code/design.md` (Apache-2.0, 28k★) | Chuẩn file brand kit: YAML tokens + phần giải thích. Có lệnh lint kiểm tra tương phản màu theo chuẩn WCAG |
| `coreyhaines31/marketingskills` (MIT, 51.6k★) | Prompt cho social, ad-creative, competitors. Quy ước mọi skill đọc file context chung trước |
| `heygen-com/hyperframes` (Apache-2.0, 53k★) | Video Editor: chuyển HTML + GSAP thành MP4 |
| `anthropics/skills` | Mẫu tham khảo: `brand-guidelines`, `theme-factory`, `canvas-design` |
| `canva-sdks/canva-skills` (Apache-2.0) | brand-check, bulk-create, resize cho social |
| Tham khảo thêm | `arnabbagxd/Brand-building-skills` (brand-identity, brand-packaging), `nexu-io/open-design` (bản mã nguồn mở của Claude Design), google adk "on-brand-genmedia" (vòng tạo ảnh → chấm điểm theo luật brand → tạo lại), n8n template #18965 (schema brief phân tích quảng cáo đối thủ) |

**Phần phải tự build:**
- Công cụ biến brand kit thành trang brand board HTML.
- Router và quy ước thư mục bàn giao giữa 9 vai trò.
- Template riêng cho packaging, billboard, key visual và proposal.
- Hub HTML trực quan.

## 5. n8n, giao diện và AI local

- **n8n:** bản Community tự host miễn phí, nhưng node Claude bắt buộc có API key. Nếu gọi API thì mỗi lượt chạy đủ 9 vai trò tốn khoảng $0.13 (Haiku), $0.25 (Sonnet), $0.50 (Opus).
  - n8n không hợp làm giao diện cho người không rành kỹ thuật.
  - → **Không đưa vào lõi hệ thống.** Nếu cần thì chỉ dùng làm "máy chủ công cụ" qua MCP (tạo ảnh theo lô, autofill Canva).
- **Dify:** giao diện web app cho người dùng cuối đẹp nhất trong nhóm mã nguồn mở, nhưng cũng cần API key.
- **LLM local trên 6GB (Qwen3, Gemma):** copy chung chung, sáo rỗng. Gói Pro vốn trả phí cố định nên chạy local không tiết kiệm được gì → không dùng.
- **Giao diện (so theo công sức bỏ ra và trải nghiệm):**

| Phương án | Công sức | Nhận xét |
|---|---|---|
| Hub HTML tĩnh do skill tự sinh | ~0.5 ngày | Không cần cài gì |
| Obsidian | ~0.5–1 ngày | Tốt nhưng thêm một app phải học |
| Artifact private | ~1 ngày | Gọi được Claude và connector, nhưng không đọc được ổ đĩa |
| Streamlit | 1–2 ngày | Phải cài Python |
| Tauri | 1–3 tuần | Công sức lớn |

## 6. Meta Ads Library

- API chỉ trả về quảng cáo chính trị/xã hội và quảng cáo chạy ở EU/UK. **Không có quảng cáo thương mại ở Việt Nam.**
- → Ads Manager phải dùng screenshot thủ công, hoặc Claude in Chrome duyệt web ở khối lượng nhỏ, có người giám sát. Điều khoản Meta cấm thu thập tự động, nên đây là vùng xám nếu dùng nhiều.
