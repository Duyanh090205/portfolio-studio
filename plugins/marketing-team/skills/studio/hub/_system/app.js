/* Portfolio Studio HUB — reads portfolio.js + brands/<slug>/{brand,logos}.js and renders a local dashboard.
   Runs straight from file:// (no server). Claude edits the data files; this app never writes to disk. */
(function () {
  'use strict';

  var VERSION = '0.4.2';
  var S = { portfolio: null, brands: {}, logos: {}, steps: {}, errors: [], img: {}, sel: null, cd: false, qa: {}, dir: null, dirOk: false };

  window.HUB = {
    version: VERSION,
    portfolio: function (p) { S.portfolio = p || {}; },
    brand: function (b) { if (b && b.slug) S.brands[b.slug] = b; },
    logos: function (slug, items) {
      S.logos[slug] = (items || []).map(function (l) {
        if (l && l.svg) l.svg = fixSvg(l.svg);
        if (l && l.src && !l.svg) l.svg = '<img src="brands/' + slug + '/' + l.src + '" alt="" style="width:100%;height:100%;object-fit:contain">';
        return l;
      });
    },
    step: function (slug, id, data) { (S.steps[slug] = S.steps[slug] || {})[id] = data || {}; },
    exportLogo: function (slug, id, kind) { exportLogo(slug, id, kind); },
    _testDir: function (h) { S.dir = h; S.dirOk = true; }, _save: function (slug, id, f) { return saveImage(slug, id, f); } // test hooks
  };

  var STEPS = [
    { id: 'brief', n: '0', name: 'Brief', vi: 'Ý tưởng & brief', model: 'Sonnet', weight: 'Nhẹ', ready: true,
      desc: 'Kể ý tưởng brand bằng tiếng Việt. Claude hỏi thêm vài câu rồi viết brief chiến lược (tiếng Anh).',
      say: 'Tạo brand mới', gets: 'Brief: sản phẩm, khách hàng, vấn đề/cơ hội, tính cách brand, đối thủ.',
      where: 'Tab Brief', exp: 'Là mục 01 The Problem trong case study.' },
    { id: 'brand-strategist', n: '1', name: 'Brand Strategist', vi: 'Nền móng thương hiệu', model: 'Opus', modelNote: 'Opus (brand mới) · Sonnet (dự án nhập có sẵn)', weight: 'Nặng', ready: true,
      desc: 'Đề xuất 3 hướng sáng tạo. Bạn chọn một, Claude dựng brand board: logo, màu, font, phong cách hình ảnh.',
      say: 'Làm Brand Strategist cho {name}', approve: 'Duyệt brand board {name}',
      gets: '3 hướng để chọn → 5 logo (SVG), bảng màu có tên, 3 font, positioning & giọng văn, hướng ảnh / mascot / bao bì, 8 prompt ảnh.',
      where: 'Tab Brand board + Ảnh cần tạo', exp: 'Logo: nút PNG/SVG. Brand board: nút “Xuất PDF brand board”. Dùng cho mục Brand Direction.',
      tip: 'Bước nặng nhất: làm đầu phiên. Gộp các ý sửa vào một tin nhắn.' },
    { id: 'social-media', n: '2', name: 'Social Media Creative', vi: 'Nội dung mạng xã hội', model: 'Sonnet', weight: 'Vừa', ready: true, tab: 'Social',
      desc: 'Biến brand thành content: post ra mắt, promo, tăng nhận diện, theo mùa.',
      say: 'Làm Social Media cho {name}', approve: 'Duyệt Social Media {name}',
      gets: '3 trụ nội dung, 4 post + 1 story, caption & hashtag, 5 prompt ảnh nền.',
      where: 'Tab Social', exp: 'Lưu PNG từng post, xếp lưới như feed Instagram; caption làm chú thích.',
      tip: 'Muốn campaign có insight đối thủ: làm Ads research trước Campaign.' },
    { id: 'campaign', n: '3', name: 'Campaign Designer', vi: 'Key visual quảng cáo', model: 'Sonnet', weight: 'Vừa', ready: true, tab: 'Campaign',
      desc: 'Biến một ý tưởng campaign thành key visual hoàn chỉnh: headline, hình chính, bố cục, thông điệp, CTA.',
      say: 'Làm Campaign cho {name}', approve: 'Duyệt Campaign {name}',
      gets: '3 concept → chọn 1 → mục tiêu, insight, big idea, key message, headline, CTA + key visual dọc & banner ngang.',
      where: 'Tab Campaign', exp: 'Key visual làm ảnh bìa case study; big idea cho mục The Idea.' },
    { id: 'packaging', n: '4', name: 'Packaging Designer', vi: 'Bao bì & ấn phẩm', model: 'Sonnet', weight: 'Vừa', ready: true, tab: 'Packaging',
      desc: 'Bao bì và ấn phẩm đi kèm: hộp/ly, tem, túi, sticker, thẻ cảm ơn.',
      say: 'Làm Packaging cho {name}', approve: 'Duyệt Packaging {name}',
      gets: 'Mặt trước bao bì, tem/nắp, thẻ cảm ơn, pack copy, 3 prompt ảnh mockup.',
      where: 'Tab Packaging', exp: 'Ảnh mockup (tạo bằng Gemini) là chính, artwork phẳng là phụ.', tip: 'Nhớ đính kèm logo PNG khi tạo mockup.' },
    { id: 'ooh', n: '5', name: 'OOH Designer', vi: 'Billboard & poster', model: 'Sonnet', weight: 'Nhẹ', ready: true, tab: 'OOH',
      desc: 'Đưa campaign ra ngoài đời: billboard, poster khổ lớn, chữ ít, nhìn xa vẫn rõ.',
      say: 'Làm OOH cho {name}', approve: 'Duyệt OOH {name}',
      gets: 'Billboard + poster trạm xe buýt (≤ 7 chữ), gợi ý vị trí đặt, 2 prompt mockup.',
      where: 'Tab OOH', exp: 'Lưu PNG thiết kế → đính kèm vào Gemini để ghép lên bảng quảng cáo ngoài phố.' },
    { id: 'proposal', n: '6', name: 'Proposal Designer', vi: 'Gom thành proposal', model: 'Sonnet', weight: 'Vừa', ready: true, tab: 'Proposal',
      desc: 'Gom toàn bộ thành một proposal / case study để làm portfolio hoặc gửi khách.',
      say: 'Làm Proposal cho {name}', approve: 'Duyệt Proposal {name}',
      gets: 'Deck ~10 slide theo mạch case study + chữ sẵn cho trang portfolio.',
      where: 'Tab Proposal', exp: 'Ctrl+P → PDF (tích Đồ họa nền). Dán “Portfolio page copy” lên Squarespace.', tip: 'Làm sau cùng, khi đã có đủ ảnh.' },
    { id: 'content', n: '+', name: 'Content Planner', vi: 'Lịch nội dung tháng', model: 'Sonnet', weight: 'Vừa', extra: true, ready: true, tab: 'Lịch',
      desc: 'Cho brand thật: lịch đăng cả tháng, kịch bản Reels & shot list để bạn tự quay mỗi tuần, caption sẵn.',
      say: 'Lên lịch nội dung tháng này cho {name}', approve: 'Duyệt lịch nội dung {name}',
      gets: 'Lịch tháng (trụ nội dung × định dạng × ngày), kịch bản Reels + shot list theo tuần, caption EN (+VI).',
      where: 'Tab Lịch', exp: 'Dùng để quay & đăng thật; cuối tháng nhập số liệu cho Report.', tip: 'Mỗi tuần gõ “Làm shoot pack tuần này cho <brand>”.' },
    { id: 'video', n: '+', name: 'Video Editor', vi: 'Video chuyển động', model: 'Sonnet', weight: 'Vừa', extra: true, ready: true, tab: 'Video',
      desc: 'Video chuyển động 15 giây khổ dọc (Reels/TikTok) từ kịch bản, xem ngay trên trình duyệt.',
      say: 'Làm Video cho {name}', approve: 'Duyệt Video {name}',
      gets: 'Storyboard 6 cảnh + video motion 1080×1920.', where: 'Tab Video',
      exp: 'Mở riêng → F11 → Win+Shift+R quay 1 vòng → MP4.', tip: 'Muốn kịch bản riêng: tả cảnh & CTA ngay trong câu lệnh.' },
    { id: 'ads', n: '+', name: 'Ads Manager', vi: 'Nghiên cứu quảng cáo', model: 'Sonnet', weight: 'Vừa', extra: true, ready: true, tab: 'Ads',
      desc: 'Đọc quảng cáo đối thủ, tìm khoảng trống, đề xuất ads mới cho brand.',
      say: 'Làm Ads research cho {name}', approve: 'Duyệt Ads {name}',
      gets: 'Báo cáo phân tích quảng cáo đối thủ (hook, CTA, visual, copy), 3 khoảng trống, 3 mẫu ads + copy Meta.',
      where: 'Tab Ads', exp: 'PDF cho mục Competitive audit.',
      need: { text: 'Tuỳ chọn: chụp 5–10 quảng cáo đối thủ trên facebook.com/ads/library rồi lưu vào thư mục này. Không có thì Claude làm desk research (có ghi chú rõ).', dir: 'ads/competitors' } },
    { id: 'report', n: '+', name: 'Report Analyst', vi: 'Báo cáo số liệu', model: 'Sonnet', weight: 'Vừa', extra: true, ready: true, tab: 'Report',
      desc: 'Gom số liệu và làm báo cáo tháng gửi khách/sếp.',
      say: 'Làm Report cho {name}', approve: 'Duyệt Report {name}',
      gets: 'Báo cáo tháng: KPI, biểu đồ, top post, khán giả, insight + email tóm tắt.',
      where: 'Tab Report', exp: 'PDF; ghi rõ “simulated data” nếu là số liệu mô phỏng.',
      need: { text: 'Tuỳ chọn: bỏ file CSV/XLSX xuất từ Meta Business Suite / TikTok vào thư mục này, hoặc nói “dữ liệu ở Google Drive”. Không có thì Claude dùng số liệu mô phỏng.', dir: 'report/input' } }
  ];
  var MAIN = STEPS.filter(function (s) { return !s.extra && s.id !== 'brief'; });
  var UTIL = [{ id: 'check', tab: 'Kiểm tra', name: 'Kiểm tra dự án', util: true }]; // tabs without a pipeline step
  var STATUS = { todo: 'Chưa làm', doing: 'Đang làm', choose: 'Chờ bạn chọn', review: 'Chờ bạn duyệt', done: 'Xong', skip: 'Không áp dụng' };
  var TYPES = { fictional: 'Brand giả định', concept: 'Brand concept của bạn', 'real-brand': 'Campaign cho brand thật',
    cause: 'Campaign xã hội / PSA', content: 'Chuỗi nội dung', live: 'Brand thật đang vận hành' };
  var EXT = ['png', 'jpg', 'jpeg', 'webp'];

  // ---------- helpers ----------
  // Unquoted multi-word or digit-bearing family names (e.g. Baloo 2) are invalid CSS, so quote them.
  var GENERIC = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|inherit)$/;
  function quoteFamilies(list) {
    return list.split(',').map(function (x) {
      x = x.trim().replace(/^['"]|['"]$/g, ''); return GENERIC.test(x) ? x : "'" + x + "'";
    }).join(', ');
  }
  function fixSvg(svg) {
    return String(svg)
      .replace(/font-family="([^"]+)"/g, function (m, f) { return 'font-family="' + quoteFamilies(f) + '"'; })
      .replace(/font-family:\s*([^;"]+)/g, function (m, f) { return 'font-family: ' + quoteFamilies(f); });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function stepOf(b, id) { return (b.steps && b.steps[id]) || { status: 'todo' }; }
  function statusOf(b, id) {
    var st = b.steps && b.steps[id];
    if (st && st.status) return st.status;
    if (id === 'content' && ['live', 'content'].indexOf(b.projectType) < 0) return 'skip'; // Content Planner is for real brands and channels
    return 'todo';
  }
  function fill(t, b) { return String(t || '').replace('{name}', b ? b.name : ''); }
  function color(b, role) {
    var cs = (b.kit && b.kit.colors) || [];
    for (var i = 0; i < cs.length; i++) if ((cs[i].role || '').toLowerCase() === role.toLowerCase()) return cs[i].hex;
    return null;
  }
  function primary(b) { return color(b, 'Primary') || ((b.kit && b.kit.colors && b.kit.colors[0]) || {}).hex || '#2b2a28'; }
  function lum(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 1;
    var n = parseInt(m[1], 16), rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }
  function onColor(hex) { return lum(hex) > 0.4 ? '#1f1b16' : '#ffffff'; }
  function font(b, role) {
    var t = (b.kit && b.kit.typography && b.kit.typography[role]) || null;
    return t && t.family ? "'" + t.family + "', " : '';
  }
  function toast(msg) {
    var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
  function copy(text, label) {
    function ok() { toast(label || 'Đã copy!'); }
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { toast('Không copy được, hãy bôi đen để copy'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
  }
  var CLIP = [];
  function clip(text) { CLIP.push(text); return CLIP.length - 1; }
  function copyBtn(text, label, cls) {
    return '<button class="btn ' + (cls || '') + '" data-copy="' + clip(text) + '">' + esc(label) + '</button>';
  }
  function baseDir() {
    var p = decodeURIComponent(location.pathname).replace(/\/[^/]*$/, '');
    if (/^\/[A-Za-z]:/.test(p)) p = p.slice(1).replace(/\//g, '\\');
    return p;
  }
  function savePath(slug, id) {
    var d = baseDir(), sep = d.indexOf('\\') >= 0 ? '\\' : '/';
    return [d, 'brands', slug, 'images', id + '.png'].join(sep);
  }

  // ---------- loading ----------
  window.addEventListener('error', function (e) {
    if (e && e.filename && /(brand|logos|portfolio|step)\.js/.test(e.filename)) {
      var f = decodeURIComponent(e.filename.split('?')[0]).split('/'); f = f.slice(f.lastIndexOf('brands') >= 0 ? f.lastIndexOf('brands') : -1).join('/');
      S.errors.push({ file: f, msg: e.message });
    }
  });
  function loadScript(src) {
    return new Promise(function (res) {
      var s = document.createElement('script');
      s.src = src + '?v=' + Date.now();
      s.onload = function () { res(true); };
      s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }
  function probe(url) {
    return new Promise(function (res) {
      var i = new Image(); i.onload = function () { res(true); }; i.onerror = function () { res(false); }; i.src = url;
    });
  }
  function findImage(slug, id, bust) {
    var i = 0;
    function next() {
      if (i >= EXT.length) return Promise.resolve(null);
      var u = 'brands/' + slug + '/images/' + id + '.' + EXT[i++];
      return probe(u + (bust ? '?t=' + Date.now() : '')).then(function (ok) { return ok ? u + (bust ? '?t=' + Date.now() : '') : next(); });
    }
    return next();
  }
  function allImages(b) {
    var out = (b.images || []).slice(), st = S.steps[b.slug] || {};
    STEPS.forEach(function (x) { if (st[x.id] && st[x.id].images) out = out.concat(st[x.id].images); });
    return out;
  }
  function probeBrand(slug, onlyMissing) {
    var b = S.brands[slug]; if (!b) return Promise.resolve(false);
    var changed = false;
    return Promise.all(allImages(b).map(function (im) {
      var k = slug + '/' + im.id;
      if (onlyMissing && S.img[k]) return null;
      return findImage(slug, im.id, onlyMissing).then(function (u) {
        if ((S.img[k] || null) !== u) { if (!(onlyMissing && !u)) changed = true; S.img[k] = u; }
      });
    })).then(function () { return changed; });
  }
  function load() {
    return loadScript('portfolio.js').then(function (ok) {
      if (!ok || !S.portfolio) { S.portfolio = null; return; }
      var slugs = S.portfolio.brands || [];
      return Promise.all(slugs.map(function (slug) {
        var files = ['brands/' + slug + '/brand.js', 'brands/' + slug + '/logos.js'].concat(STEPS.concat(UTIL).filter(function (x) { return x.tab || x.id === 'brand-strategist'; }).map(function (x) { return 'brands/' + slug + '/' + x.id + '/step.js'; }));
        return Promise.all(files.map(function (f) { return loadScript(f); }))
          .then(function (r) { if (!r[0]) S.errors.push({ file: 'brands/' + slug + '/brand.js', msg: 'Không tìm thấy file' }); });
      })).then(function () {
        return Promise.all(Object.keys(S.brands).map(function (s) { ensureFonts(S.brands[s]); return probeBrand(s, false); }));
      });
    });
  }
  var fontsDone = {};
  function ensureFonts(b) {
    var t = {};
    bsDirs(b).list.forEach(function (d, i) {
      var f = d.fonts || {};
      if (f.headline) t['dh' + i] = { family: f.headline, weight: f.headlineWeight || 700 };
      if (f.body) t['db' + i] = { family: f.body, weight: 400 };
    });
    var kt = (b.kit && b.kit.typography) || {};
    ['headline', 'body', 'accent'].forEach(function (r) { if (kt[r]) t[r] = kt[r]; });
    (S.logos[b.slug] || []).forEach(function (l, i) {
      var re = /<text\b[^>]*>/g, m;
      while ((m = re.exec(l.svg || ''))) {
        var fam = (/font-family="([^"]+)"/.exec(m[0]) || [])[1];
        if (!fam) continue;
        t['lg' + i + '_' + m.index] = { family: fam.split(',')[0].replace(/'/g, '').trim(), weight: (/font-weight="(\d+)"/.exec(m[0]) || [])[1] || 400,
          style: /font-style="italic"/.test(m[0]) ? 'italic' : 'normal' };
      }
    });
    Object.keys(t).forEach(function (role) {
      var f = t[role]; if (!f || !f.family) return;
      var italic = /italic/i.test(f.style || '');
      var w = parseInt(f.weight, 10) || 400;
      var spec = italic ? ':ital,wght@1,' + w : ':wght@' + (w === 400 ? '400;700' : '400;' + w);
      var key = f.family + spec; if (fontsDone[key]) return; fontsDone[key] = 1;
      var l = document.createElement('link'); l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(f.family).replace(/%20/g, '+') + spec + '&display=swap';
      document.head.appendChild(l);
    });
  }

  // ---------- logo export (PNG/SVG with embedded Google Fonts) ----------
  function blobToDataURL(blob) {
    return new Promise(function (res) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.readAsDataURL(blob); });
  }
  function embedFonts(svg) {
    var doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    var jobs = [];
    var seen = {};
    Array.prototype.forEach.call(doc.querySelectorAll('text, tspan'), function (el) {
      var cs = el.getAttribute('style') || '';
      var fam = el.getAttribute('font-family') || (/font-family:\s*([^;]+)/.exec(cs) || [])[1] || (el.parentNode && el.parentNode.getAttribute && el.parentNode.getAttribute('font-family'));
      if (!fam) return;
      fam = fam.split(',')[0].replace(/['"]/g, '').trim();
      var w = el.getAttribute('font-weight') || (/font-weight:\s*(\d+)/.exec(cs) || [])[1] || (el.parentNode && el.parentNode.getAttribute && el.parentNode.getAttribute('font-weight')) || '400';
      var it = /italic/.test(el.getAttribute('font-style') || cs);
      var key = fam + '|' + w + '|' + it;
      seen[key] = seen[key] || { fam: fam, w: w, it: it, text: '' };
      seen[key].text += el.textContent;
    });
    Object.keys(seen).forEach(function (k) {
      var f = seen[k];
      var url = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(f.fam).replace(/%20/g, '+') +
        (f.it ? ':ital,wght@1,' + f.w : ':wght@' + f.w) + '&text=' + encodeURIComponent(f.text.replace(/\s+/g, '') || 'A');
      jobs.push(fetch(url).then(function (r) { return r.ok ? r.text() : ''; }).then(function (css) {
        var urls = css.match(/url\((https:[^)]+)\)/g) || [];
        return Promise.all(urls.map(function (u) {
          var src = u.slice(4, -1);
          return fetch(src).then(function (r) { return r.blob(); }).then(blobToDataURL).then(function (d) { css = css.split(src).join(d); });
        })).then(function () { return css; });
      }).catch(function () { return ''; }));
    });
    return Promise.all(jobs).then(function (cssList) {
      var css = cssList.join('\n');
      if (!css) return svg;
      return svg.replace(/<svg\b([^>]*)>/, function (m) { return m + '<defs><style>' + css + '</style></defs>'; });
    });
  }
  function download(href, name) {
    if (typeof window.HUB.onDownload === 'function') return window.HUB.onDownload(name, href); // test hook
    var a = document.createElement('a'); a.href = href; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
  function withXmlns(svg) { return /xmlns=/.test(svg) ? svg : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'); }
  function exportLogo(slug, id, kind) {
    var item = (S.logos[slug] || []).filter(function (l) { return l.id === id; })[0]; if (!item) return;
    if (item.src) { download('brands/' + slug + '/' + item.src, item.src.split('/').pop()); return; }
    toast('Đang chuẩn bị file…');
    if (kind === 'svg') {
      embedFonts(withXmlns(item.svg)).then(function (svg) {
        download('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), id + '.svg'); toast('Đã tải ' + id + '.svg');
      });
      return;
    }
    renderPng(withXmlns(item.svg), 2000).then(function (url) {
      download(url, id + '.png'); toast('Đã tải ' + id + '.png');
    }, function () { toast('Không xuất được PNG. Hãy thử "SVG" hoặc chụp màn hình logo'); });
  }
  // Browsers ignore web fonts inside an SVG drawn to <canvas>, so the shapes are drawn as an image
  // and each <text> is painted on top with canvas fillText, using the fonts this page already loaded.
  function renderPng(svg, size) {
    return new Promise(function (resolve, reject) {
      var holder = document.createElement('div');
      holder.style.cssText = 'position:absolute;left:-10000px;top:0;';
      holder.innerHTML = svg; document.body.appendChild(holder);
      var root = holder.querySelector('svg');
      var vb = root.viewBox && root.viewBox.baseVal && root.viewBox.baseVal.width ? root.viewBox.baseVal : { width: 1000, height: 1000 };
      var scale = size / Math.max(vb.width, vb.height);
      var W = Math.round(vb.width * scale), H = Math.round(vb.height * scale);
      root.setAttribute('width', W); root.setAttribute('height', H);
      var texts = Array.prototype.slice.call(root.querySelectorAll('text'));
      var canText = !root.querySelector('textPath');
      var loads = texts.map(function (t) {
        var cs = getComputedStyle(t);
        return document.fonts && document.fonts.load ? document.fonts.load(cs.fontStyle + ' ' + cs.fontWeight + ' 40px ' + cs.fontFamily, t.textContent || 'A').catch(function () {}) : null;
      });
      Promise.all(loads).then(function () {
        var rr = root.getBoundingClientRect();
        var jobs = canText ? texts.map(function (t) {
          var cs = getComputedStyle(t), m = t.getScreenCTM();
          var x = t.x.baseVal.numberOfItems ? t.x.baseVal.getItem(0).value : 0;
          var y = t.y.baseVal.numberOfItems ? t.y.baseVal.getItem(0).value : 0;
          return { t: t, m: m, x: x, y: y, cs: cs, text: t.textContent, anchor: cs.textAnchor,
            font: cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily,
            ls: parseFloat(cs.letterSpacing) || 0, fill: cs.fill, stroke: cs.stroke, sw: parseFloat(cs.strokeWidth) || 0,
            order: (cs.paintOrder || '').indexOf('stroke') === 0 };
        }) : [];
        var clone = root.cloneNode(true);
        if (canText) Array.prototype.forEach.call(clone.querySelectorAll('text'), function (n) { n.parentNode.removeChild(n); });
        var img = new Image();
        img.onload = function () {
          var c = document.createElement('canvas'); c.width = W; c.height = H;
          var ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0, W, H);
          jobs.forEach(function (j) {
            if (!j.text || !j.m) return;
            ctx.save();
            ctx.setTransform(j.m.a, j.m.b, j.m.c, j.m.d, j.m.e - rr.left, j.m.f - rr.top);
            ctx.font = j.font;
            if ('letterSpacing' in ctx) ctx.letterSpacing = j.ls + 'px';
            ctx.textAlign = j.anchor === 'middle' ? 'center' : j.anchor === 'end' ? 'right' : 'left';
            ctx.textBaseline = 'alphabetic';
            var x = j.x + (j.anchor === 'middle' ? j.ls / 2 : 0);
            function stroke() { if (j.stroke && j.stroke !== 'none' && j.sw) { ctx.lineWidth = j.sw; ctx.strokeStyle = j.stroke; ctx.lineJoin = 'round'; ctx.strokeText(j.text, x, j.y); } }
            if (j.order) stroke();
            if (j.fill && j.fill !== 'none') { ctx.fillStyle = j.fill; ctx.fillText(j.text, x, j.y); }
            if (!j.order) stroke();
            ctx.restore();
          });
          document.body.removeChild(holder);
          try { resolve(c.toDataURL('image/png')); } catch (e) { reject(e); }
        };
        img.onerror = function () { document.body.removeChild(holder); reject(); };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
      });
    });
  }


  // ---------- Claude Design hand-off ----------
  var CRC_TABLE = (function () {
    var t = [], c; for (var n = 0; n < 256; n++) { c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t;
  })();
  function crc32(bytes) { var c = 0xFFFFFFFF; for (var i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function makeZip(files) { // minimal "stored" zip: [{ name, data: Uint8Array }]
    var enc = new TextEncoder(), parts = [], central = [], offset = 0;
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = f.data, crc = crc32(data);
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(12, 0x21, true);
      lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, name.length, true);
      parts.push(new Uint8Array(lh.buffer), name, data);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(14, 0x21, true);
      ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, name.length, true); ch.setUint32(42, offset, true);
      central.push(new Uint8Array(ch.buffer), name);
      offset += 30 + name.length + data.length;
    });
    var csize = central.reduce(function (a, x) { return a + x.length; }, 0), end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, csize, true); end.setUint32(16, offset, true);
    return new Blob(parts.concat(central, [new Uint8Array(end.buffer)]), { type: 'application/zip' });
  }
  function dataUrlBytes(u) { var b = atob(u.split(',')[1]), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
  function kebab(x) { return String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function designMd(b) {
    var k = b.kit || {}, t = k.typography || {}, e = k.essence || {}, ph = k.photography || {}, L = [];
    L.push('---', 'name: "' + b.name + '"', 'description: "' + (b.oneLiner || '').replace(/"/g, "'") + '"', 'colors:');
    (k.colors || []).forEach(function (c) { L.push('  ' + kebab(c.name) + ': "' + c.hex + '"   # ' + (c.role || '') + (c.use ? ': ' + c.use : '')); });
    L.push('typography:');
    ['headline', 'body', 'accent'].forEach(function (r) { var f = t[r]; if (!f) return; L.push('  ' + r + ':', '    fontFamily: "' + f.family + '"', '    fontWeight: ' + (f.weight || 400) + (f.style === 'italic' ? '\n    fontStyle: italic' : '')); });
    L.push('---', '', '# ' + b.name + ' design system', '');
    if (b.tagline) L.push('**Tagline:** ' + b.tagline, '');
    L.push(b.category ? '**Category:** ' + b.category + (b.oneLiner ? ': ' + b.oneLiner : '') : '', '');
    L.push('## Brand essence', '- Positioning: ' + (e.positioning || ''), '- Personality: ' + (e.personality || []).join(', '), '- Voice: ' + (e.voice || ''), '- Keywords: ' + (e.keywords || []).join(', '), '');
    L.push('## Logo', k.logo || '', '', 'Files in `logos/`:');
    (S.logos[b.slug] || []).forEach(function (l) { L.push('- `' + l.id + '.png` / `.svg`: ' + l.name + (l.kind === 'element' ? ' (graphic element)' : '') + (l.bg === 'dark' ? ' (use on dark backgrounds)' : '')); });
    L.push('', 'Never redraw, recolour or distort the logo. Use the reversed logo on dark or photo backgrounds.', '');
    L.push('## Colour palette', '| Name | Hex | Role | Use |', '|---|---|---|---|');
    (k.colors || []).forEach(function (c) { L.push('| ' + c.name + ' | ' + c.hex + ' | ' + (c.role || '') + ' | ' + (c.use || '') + ' |'); });
    L.push('', '## Typography (Google Fonts)');
    ['headline', 'body', 'accent'].forEach(function (r) { var f = t[r]; if (f) L.push('- **' + r + '**: ' + f.family + ' ' + (f.weight || '') + (f.style === 'italic' ? ' italic' : '') + (f.why ? ': ' + f.why : '')); });
    L.push('', '## Photography', ph.direction || '', '', '- Lighting: ' + (ph.lighting || ''), '- Do: ' + (ph['do'] || []).join('; '), '- Don’t: ' + (ph.dont || []).join('; '), '');
    [['Illustration & mascot', k.illustration], ['Graphic elements', k.graphicElements], ['Social media style', k.social], ['Packaging', k.packaging], ['Brand applications', k.applications]]
      .forEach(function (x) { if (x[1]) L.push('## ' + x[0], x[1], ''); });
    if (k.promptBlock) L.push('## Image style (for AI image prompts)', k.promptBlock, '');
    return L.join('\n');
  }
  function cdSystemPrompt(b) {
    var k = b.kit || {}, t = k.typography || {}, e = k.essence || {};
    return 'Create a design system for the fictional brand ' + b.name + (b.category ? ' (' + b.category + ')' : '') + '.\n' +
      'Use the attached DESIGN.md and logo files as the single source of truth. Do not invent new colours or fonts.\n\n' +
      'Colours: ' + (k.colors || []).map(function (c) { return c.name + ' ' + c.hex + ' (' + (c.role || '') + ')'; }).join(', ') + '.\n' +
      'Fonts: ' + ['headline', 'body', 'accent'].filter(function (r) { return t[r]; }).map(function (r) { return r + ' = ' + t[r].family + ' ' + (t[r].weight || ''); }).join(', ') + '.\n' +
      'Personality: ' + (e.personality || []).join(', ') + '. Voice: ' + (e.voice || '') + '\n' +
      (b.tagline ? 'Tagline: "' + b.tagline + '".\n' : '') +
      '\nInclude reusable templates for: Instagram post 1080x1350, story 1080x1920, key visual, 1920x1080 banner, billboard, poster, and 16:9 presentation slides. All copy in English.';
  }
  function cdVisualPrompt(b, o, stepName) {
    var c = o.copy || {}, lines = [];
    ['kicker', 'headline', 'sub', 'cta', 'badge'].forEach(function (x) { if (c[x]) lines.push(x[0].toUpperCase() + x.slice(1) + ': "' + c[x] + '"'); });
    return 'Using the ' + b.name + ' design system, design this ' + stepName + ' piece: "' + (o.title || o.id) + '"' + (o.size ? ', exactly ' + o.size.replace('x', ' x ') + ' px' : '') + '.\n' +
      (o.note ? 'Purpose: ' + o.note + '\n' : '') + (lines.length ? '\nCopy (keep exactly):\n' + lines.join('\n') + '\n' : '') +
      '\nIf I attach a photo, use it as the main image; otherwise leave a clearly marked photo area. Keep the logo from the design system, follow the brand voice, keep text readable, and never place text over busy parts of the photo.' +
      (o.type === 'doc' ? '\nThis is a multi-page document: keep the same section structure and numbering, one idea per slide.' : '');
  }
  function buildKitZip(slug) {
    var b = S.brands[slug]; if (!b) return;
    toast('Đang đóng gói brand kit…');
    var enc = new TextEncoder(), files = [], logos = S.logos[slug] || [];
    files.push({ name: 'DESIGN.md', data: enc.encode(designMd(b)) });
    files.push({ name: 'prompt-design-system.txt', data: enc.encode(cdSystemPrompt(b)) });
    files.push({ name: 'HUONG-DAN.txt', data: enc.encode(
      'Mang ' + b.name + ' sang Claude Design\r\n\r\n1. Mở https://claude.ai/design\r\n2. Tạo design system mới, tải lên: DESIGN.md + toàn bộ file trong thư mục logos/ (và brand board PDF nếu đã xuất bằng Ctrl+P).\r\n' +
      '3. Dán nội dung file prompt-design-system.txt vào ô chat.\r\n4. Khi design system xong: trong HUB, ở mỗi thiết kế bấm nút 🎨 để copy prompt, dán vào Claude Design (kèm ảnh chụp nếu có).\r\n\r\nMẹo: Claude Design tốn nhiều lượt dùng. Chỉ dùng cho 2–3 tác phẩm chủ lực của portfolio.\r\n') });
    var chain = Promise.resolve();
    logos.forEach(function (l) {
      chain = chain.then(function () { return renderPng(withXmlns(l.svg), 1600).then(function (u) { files.push({ name: 'logos/' + l.id + '.png', data: dataUrlBytes(u) }); }, function () {}); })
        .then(function () { return embedFonts(withXmlns(l.svg)).then(function (svg) { files.push({ name: 'logos/' + l.id + '.svg', data: enc.encode(svg) }); }); });
    });
    chain.then(function () {
      var url = URL.createObjectURL(makeZip(files));
      download(url, slug + '-brand-kit-for-claude-design.zip');
      toast('Đã tải ' + slug + '-brand-kit-for-claude-design.zip');
    });
  }
  function cdPanel(b) {
    if (!S.cd) return '';
    return '<div class="cdpanel"><div class="cdhead"><h3>🎨 Mang ' + esc(b.name) + ' sang Claude Design</h3><button class="btn tiny ghost" data-cdtoggle>Đóng</button></div>' +
      '<p class="muted small">Claude Design là công cụ thiết kế của Claude (claude.ai/design): sửa trực tiếp bằng chuột, xuất PDF/PPTX/Canva. <b>Nó không tạo ảnh chụp</b>, ảnh vẫn tạo bằng Gemini/ChatGPT. Nó tốn nhiều lượt dùng, nên chỉ dùng cho 2–3 tác phẩm chủ lực.</p>' +
      '<ol class="cdsteps">' +
      '<li><b>Tải bộ brand kit</b> (logo PNG/SVG + DESIGN.md + prompt).<br><button class="btn primary" data-cdzip="' + esc(b.slug) + '">⬇ Tải brand kit (.zip)</button> <button class="btn" data-print>🖨 Xuất brand board PDF (tuỳ chọn)</button></li>' +
      '<li><b>Mở <a href="https://claude.ai/design" target="_blank" rel="noopener">claude.ai/design</a></b> → tạo <b>design system</b> mới → tải lên các file vừa giải nén (và PDF nếu có).</li>' +
      '<li><b>Dán prompt dựng design system:</b> ' + copyBtn(cdSystemPrompt(b), 'Copy prompt design system', 'primary') + '</li>' +
      '<li><b>Làm từng thiết kế:</b> vào tab Social / Campaign / OOH / Proposal…, bấm <b>🎨</b> dưới thiết kế muốn đánh bóng để copy prompt, rồi dán vào Claude Design (kèm ảnh chụp đã tạo).</li></ol></div>';
  }


  // ---------- put images into the workspace (drag & drop, file picker, Ctrl+V) ----------
  var FS_OK = typeof window.showDirectoryPicker === 'function';
  function idb() { // IndexedDB may be unavailable (or hang) on file:// pages: give up after 1.5 s
    return new Promise(function (res, rej) {
      var timer = setTimeout(function () { rej(new Error('idb timeout')); }, 1500);
      try {
        var r = indexedDB.open('portfolio-studio', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('kv'); };
        r.onsuccess = function () { clearTimeout(timer); res(r.result); };
        r.onerror = function () { clearTimeout(timer); rej(r.error); };
      } catch (e) { clearTimeout(timer); rej(e); }
    });
  }
  function idbGet(k) {
    return idb().then(function (db) { return new Promise(function (res) {
      var q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = function () { res(q.result || null); }; q.onerror = function () { res(null); };
    }); }).catch(function () { return null; });
  }
  function idbSet(k, v) {
    return idb().then(function (db) { return new Promise(function (res) {
      var tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = function () { res(true); }; tx.onerror = function () { res(false); };
    }); }).catch(function () { return false; });
  }
  function dirKey() { return 'root:' + baseDir(); }
  function restoreDir() { // silently reuse the folder chosen last time (permission may still need one click)
    if (!FS_OK) return Promise.resolve();
    return idbGet(dirKey()).then(function (h) {
      if (!h || !h.queryPermission) return;
      S.dir = h;
      return h.queryPermission({ mode: 'readwrite' }).then(function (p) { S.dirOk = p === 'granted'; });
    }).catch(function () {});
  }
  function ensureDir() { // must run inside a click
    if (!FS_OK) { toast('Trình duyệt này chưa hỗ trợ. Hãy mở HUB bằng Chrome hoặc Edge.'); return Promise.reject(); }
    if (S.dir && S.dirOk) return Promise.resolve(S.dir);
    if (S.dir) return S.dir.requestPermission({ mode: 'readwrite' }).then(function (p) {
      if (p === 'granted') { S.dirOk = true; return S.dir; } throw new Error('denied');
    });
    return window.showDirectoryPicker({ id: 'portfolio-studio', mode: 'readwrite' }).then(function (h) {
      return h.getFileHandle('HUB.html').then(function () {
        S.dir = h; S.dirOk = true; idbSet(dirKey(), h); return h;
      }, function () {
        toast('Hãy chọn đúng thư mục Portfolio Studio (thư mục có file HUB.html).'); throw new Error('wrong folder');
      });
    });
  }
  function extFor(file) { var t = (file.type || '').toLowerCase(); return t === 'image/jpeg' ? 'jpg' : t === 'image/webp' ? 'webp' : t === 'image/png' ? 'png' : null; }
  function asPng(file) { // other formats (heic/avif/gif…) are converted to PNG
    return createImageBitmap(file).then(function (bmp) {
      var c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height; c.getContext('2d').drawImage(bmp, 0, 0);
      return new Promise(function (res) { c.toBlob(res, 'image/png'); });
    });
  }
  function saveImage(slug, id, file) {
    if (!file || !/^image\//.test(file.type || '')) { toast('Đây không phải file ảnh.'); return; }
    var ext = extFor(file);
    var ready = ext ? Promise.resolve(file) : asPng(file).then(function (b) { ext = 'png'; return b; });
    return Promise.all([ensureDir(), ready]).then(function (r) {
      var root = r[0], blob = r[1];
      return root.getDirectoryHandle('brands').then(function (d) { return d.getDirectoryHandle(slug); })
        .then(function (d) { return d.getDirectoryHandle('images', { create: true }); })
        .then(function (dir) {
          return dir.getFileHandle(id + '.' + ext, { create: true }).then(function (fh) { return fh.createWritable(); })
            .then(function (w) { return w.write(blob).then(function () { return w.close(); }); })
            .then(function () { // remove the same image saved earlier with another extension
              return Promise.all(EXT.filter(function (e) { return e !== ext && !(ext === 'jpg' && e === 'jpeg'); })
                .map(function (e) { return dir.removeEntry(id + '.' + e).catch(function () {}); }));
            });
        });
    }).then(function () {
      S.img[slug + '/' + id] = 'brands/' + slug + '/images/' + id + '.' + ext + '?t=' + Date.now();
      render(); toast('Đã lưu ' + id + '.' + ext + ' ✨');
    }).catch(function (e) { if (e && e.name !== 'AbortError' && e.message !== 'wrong folder') toast('Chưa lưu được ảnh: ' + (e.message || e)); });
  }
  function pickFile(slug, id) {
    ensureDir().then(function () {
      var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = function () { if (inp.files[0]) saveImage(slug, id, inp.files[0]); };
      inp.click();
    }).catch(function () {});
  }
  function dirBanner() {
    if (!FS_OK) return '<p class="muted small">⚠ Trình duyệt này không lưu ảnh trực tiếp được. Dùng Chrome hoặc Edge để kéo thả ảnh, hoặc dùng nút "Copy đường dẫn lưu".</p>';
    if (S.dir && S.dirOk) return '<p class="dirok">✅ HUB đã được phép lưu ảnh vào thư mục này.</p>';
    return '<div class="dirask"><b>' + (S.dir ? 'Bấm để tiếp tục cho HUB lưu ảnh' : 'Lần đầu: cho phép HUB lưu ảnh') + '</b>' +
      '<span class="muted small">' + (S.dir ? 'Trình duyệt cần bạn xác nhận lại sau khi mở lại trang.' : 'Chọn thư mục <b>Portfolio Studio</b> (thư mục có file HUB.html) → <b>Cho phép sửa</b>. Chỉ cần làm 1 lần.') + '</span>' +
      '<button class="btn primary" data-connect>📂 ' + (S.dir ? 'Tiếp tục' : 'Chọn thư mục') + '</button></div>';
  }

  // ---------- views ----------
  function nav(active) {
    var owner = S.portfolio && S.portfolio.owner;
    return '<header class="nav"><a class="brandmark" href="#/">Portfolio <em>Studio</em></a>' +
      '<nav><a href="#/" class="' + (active === 'home' ? 'on' : '') + '">Brands</a>' +
      '<a href="#/guide" class="' + (active === 'guide' ? 'on' : '') + '">Hướng dẫn</a>' +
      '<button class="btn ghost" data-reload>↻ Làm mới</button></nav>' +
      (owner ? '<span class="hello">Xin chào, ' + esc(owner) + '</span>' : '') + '</header>';
  }
  function errorsBanner() {
    if (!S.errors.length) return '';
    return '<div class="alert"><strong>Có file bị lỗi.</strong> ' + S.errors.map(function (e) {
      var slug = (/brands\/([^/]+)\//.exec(e.file) || [])[1] || '';
      var say = 'Sửa lỗi file ' + e.file.split('/').pop() + (slug ? ' của brand ' + slug : '');
      return '<div>' + esc(e.file) + ': ' + esc(e.msg) + ' → gõ cho Claude: <code>' + esc(say) + '</code> ' + copyBtn(say, 'Copy') + '</div>';
    }).join('') + '</div>';
  }
  function mainSteps(b) { return MAIN.filter(function (s) { return statusOf(b, s.id) !== 'skip'; }); }
  function typeLabel(b) { return TYPES[b.projectType || 'fictional'] || b.projectType; }
  function currentStep(b) {
    var order = ['brief'].concat(mainSteps(b).map(function (s) { return s.id; }));
    for (var i = 0; i < order.length; i++) if (statusOf(b, order[i]) !== 'done') return STEPS.filter(function (s) { return s.id === order[i]; })[0];
    return null;
  }
  function imgCounts(b) {
    var ims = allImages(b), have = 0;
    ims.forEach(function (im) { if (S.img[b.slug + '/' + im.id]) have++; });
    return { have: have, total: ims.length };
  }
  function pill(status) { return '<span class="pill s-' + status + '">' + (STATUS[status] || status) + '</span>'; }
  function effStatus(b, id) {
    var st = statusOf(b, id), d = (S.steps[b.slug] || {})[id];
    if (st === 'doing' && ((id === 'brand-strategist' && bsDirs(b).list.length && !b.kit) || (d && d.choices && d.choices.length && !d.chosen))) return 'choose';
    return st;
  }
  function isDemo(b) { return !!(b && b.demo); }
  function bsDirs(b) { var d = (S.steps[b.slug] || {})['brand-strategist'] || {}; return { list: d.directions || b.directions || [], chosen: d.chosen || b.chosen }; }
  function folderPath(slug, dir) {
    var d = baseDir(), sep = d.indexOf('\\') >= 0 ? '\\' : '/';
    return [d, 'brands', slug].concat(dir.split('/')).join(sep);
  }
  function needBox(b, s) {
    if (!s.need) return '';
    var path = folderPath(b.slug, s.need.dir);
    return '<div class="needbox"><b>📂 Dữ liệu đầu vào</b><p>' + esc(s.need.text) + '</p><code>' + esc(path) + '</code> ' + copyBtn(path, 'Copy đường dẫn thư mục', 'tiny') + '</div>';
  }

  function cover(b) {
    var u = b.cover && S.img[b.slug + '/' + b.cover];
    var all = allImages(b);
    for (var i = 0; i < all.length && !u; i++) u = S.img[b.slug + '/' + all[i].id];
    if (u) return '<div class="cover" style="background-image:url(\'' + u + '\')"></div>';
    var p = primary(b), cs = (b.kit && b.kit.colors) || [];
    return '<div class="cover gen" style="background:' + p + ';color:' + onColor(p) + '">' +
      '<span style="font-family:' + font(b, 'headline') + 'sans-serif">' + esc(b.name) + '</span>' +
      (cs.length ? '<div class="stripe">' + cs.map(function (c) { return '<i style="background:' + c.hex + '"></i>'; }).join('') + '</div>' : '') + '</div>';
  }

  function viewHome() {
    if (!S.portfolio) {
      return nav('home') + '<main class="wrap"><div class="empty"><h1>Chưa setup Portfolio Studio</h1>' +
        '<p>Mở Claude (Cowork) ở thư mục này và gõ:</p><p class="say">Setup Portfolio Studio ' + copyBtn('Setup Portfolio Studio', 'Copy') + '</p></div></main>';
    }
    var slugs = (S.portfolio.brands || []).filter(function (s) { return S.brands[s]; });
    var missing = 0, review = 0;
    slugs.forEach(function (s) {
      var b = S.brands[s], c = imgCounts(b); missing += c.total - c.have;
      if (isDemo(b)) { missing -= c.total - c.have; return; }
      STEPS.forEach(function (st) { if (statusOf(b, st.id) === 'review') review++; });
    });
    var own = slugs.filter(function (s) { return !isDemo(S.brands[s]); });
    var demo = slugs.filter(function (s) { return isDemo(S.brands[s]); })[0];
    var first = own.length ? '' : '<div class="firstrun"><h3>👋 Lần đầu dùng Portfolio Studio?</h3><ol>' +
      (demo ? '<li><a href="#/b/' + esc(demo) + '">Xem brand mẫu ' + esc(S.brands[demo].name) + '</a>: một brand đã đi hết 9 thành viên, để biết mỗi bước cho ra gì.</li>' : '') +
      '<li>Đọc <a href="#/guide">Hướng dẫn → Đội ngũ của bạn</a> (2 phút).</li>' +
      '<li>Mở Claude (Cowork) ở thư mục này và gõ <span class="say">Tạo brand mới</span> ' + copyBtn('Tạo brand mới', 'Copy') + '</li></ol></div>';
    var cards = slugs.map(function (s) {
      var b = S.brands[s], cur = currentStep(b), c = imgCounts(b);
      var ms = mainSteps(b), done = ms.filter(function (st) { return statusOf(b, st.id) === 'done'; }).length;
      return '<a class="card' + (isDemo(b) ? ' demo' : '') + '" href="#/b/' + esc(s) + '">' + cover(b) +
        '<div class="card-body"><div class="card-top"><h3>' + esc(b.name) + (isDemo(b) ? ' <span class="pill s-todo">Brand mẫu</span>' : '') + '</h3>' + (cur ? pill(effStatus(b, cur.id)) : '<span class="pill s-done">Hoàn thành</span>') + '</div>' +
        '<p class="muted">' + esc(b.category || '') + '</p>' +
        '<p class="small typechip">' + esc(typeLabel(b)) + '</p>' +
        '<div class="bar"><i style="width:' + Math.round(done / Math.max(1, ms.length) * 100) + '%"></i></div>' +
        '<p class="small">' + done + '/' + ms.length + ' bước chính' + (c.total ? ' · ảnh ' + c.have + '/' + c.total : '') + '</p>' +
        (cur ? '<p class="small strong">Đang ở: ' + esc(cur.n) + '. ' + esc(cur.name) + '</p>' : '') + '</div></a>';
    }).join('');
    cards += '<div class="card new"><div class="plus">+</div><h3>Brand mới</h3><p class="muted">Mở Claude và gõ:</p>' +
      '<p class="say">Tạo brand mới</p>' + copyBtn('Tạo brand mới', 'Copy câu lệnh') + '</div>';
    return nav('home') + '<main class="wrap">' + errorsBanner() + first +
      '<section class="hero"><h1>Brands</h1><div class="stats">' +
      '<div><b>' + own.length + '</b><span>brand</span></div>' +
      '<div><b>' + review + '</b><span>bước chờ duyệt</span></div>' +
      '<div><b>' + missing + '</b><span>ảnh cần tạo</span></div></div></section>' +
      '<section class="grid">' + cards + '</section></main>';
  }

  // Brand Strategist needs Opus only when it invents an identity; imports just organise what exists.
  function modelFor(s, b) {
    return s.id === 'brand-strategist' && b && (b.projectType === 'concept' || b.projectType === 'content') ? 'Sonnet' : (s.model || 'Sonnet');
  }

  function stepper(b) {
    function node(s) {
      var st = effStatus(b, s.id);
      return '<button class="step s-' + st + (S.sel === s.id ? ' sel' : '') + '" data-step="' + s.id + '"' + (st === 'skip' ? ' title="Không áp dụng cho loại dự án này"' : '') + '>' +
        '<span class="num">' + (st === 'done' ? '✓' : st === 'skip' ? '–' : esc(s.n)) + '</span><span class="lbl"><b>' + esc(s.name) + '</b><small>' + esc(s.vi) + '</small></span></button>';
    }
    var main = STEPS.filter(function (s) { return !s.extra; }), extra = STEPS.filter(function (s) { return s.extra; });
    var out = '<p class="muted small hint">👆 Bấm vào từng thành viên để xem họ làm gì và câu lệnh gọi họ.</p>' +
      '<div class="stepper">' + main.map(node).join('') + '</div>' +
      '<div class="extras"><span class="muted small">Thành viên thêm (tuỳ chọn):</span>' + extra.map(node).join('') + '</div>';
    if (S.sel) {
      var s = STEPS.filter(function (x) { return x.id === S.sel; })[0], d = stepOf(b, s.id), st = effStatus(b, s.id), say = fill(s.say, b);
      var cmds = '<p class="small">Gõ cho Claude (model <b>' + esc(modelFor(s, b)) + '</b>):</p><p class="say">' + esc(say) + '</p>' + copyBtn(say, 'Copy câu lệnh');
      if (st === 'skip') { var on = 'Bật lại ' + s.name + ' cho ' + b.name; cmds = '<p class="small">Bước này không dùng cho <b>' + esc(typeLabel(b)) + '</b>. Muốn dùng thì gõ:</p><p class="say">' + esc(on) + '</p>' + copyBtn(on, 'Copy câu lệnh'); }
      if (st === 'review' && s.approve) cmds = '<p class="small">Ưng rồi thì duyệt:</p><p class="say">' + esc(fill(s.approve, b)) + '</p>' + copyBtn(fill(s.approve, b), 'Copy câu lệnh', 'primary') +
        '<p class="small" style="margin-top:10px">Hoặc làm lại / sửa: nói rõ muốn đổi gì.</p>';
      out += '<div class="stepcard"><div><h4>' + esc(s.n !== '+' ? s.n + '. ' : '') + esc(s.name) + ' ' + pill(st) + ' <span class="weight w-' + esc(s.weight || '') + '">' + esc(s.weight || '') + '</span></h4>' +
        '<p>' + esc(s.desc) + '</p>' +
        '<dl class="sinfo"><dt>Bạn nhận được</dt><dd>' + esc(s.gets || '') + '</dd><dt>Xem ở</dt><dd>' + esc(s.where || '') + '</dd>' +
        '<dt>Xuất & portfolio</dt><dd>' + esc(s.exp || '') + '</dd>' + (s.tip ? '<dt>Mẹo</dt><dd>' + esc(s.tip) + '</dd>' : '') + '</dl>' +
        needBox(b, s) +
        (d.note ? '<p class="muted small">📝 ' + esc(d.note) + (d.updated ? ' · ' + esc(d.updated) : '') + '</p>' : '') +
        ((S.steps[b.slug] || {})[s.id] ? '<p><a class="btn" href="#/b/' + b.slug + '/' + s.id + '">Xem kết quả →</a></p>' : '') + '</div>' +
        '<div class="stepact">' + cmds + '</div></div>';
    }
    return out;
  }

  function viewBrand(slug, tab) {
    var b = S.brands[slug];
    if (!b) return nav('home') + '<main class="wrap"><div class="empty"><h1>Không tìm thấy brand “' + esc(slug) + '”</h1><a href="#/">← Về danh sách</a></div></main>';
    tab = tab || 'board';
    var p = primary(b), c = imgCounts(b);
    var head = '<section class="bhead" style="--p:' + p + '"><a href="#/" class="back">← Brands</a>' +
      '<h1 style="font-family:' + font(b, 'headline') + 'sans-serif;color:' + p + '">' + esc(b.name) + '</h1>' +
      (b.tagline ? '<p class="tagline' + (font(b, 'accent') ? ' accent' : '') + '" style="font-family:' + (font(b, 'accent') || font(b, 'headline')) + 'sans-serif">' + esc(b.tagline) + '</p>' : '') +
      '<p class="muted"><span class="typechip">' + esc(typeLabel(b)) + '</span> ' + esc(b.category || '') + (b.oneLiner ? ' · ' + esc(b.oneLiner) : '') + '</p>' +
      (b.disclaimer ? '<p class="disclaimer">⚖ ' + esc(b.disclaimer) + '</p>' : '') + '</section>';
    var next = b.next && (b.next.text || b.next.say) ? '<div class="next"><span class="lbl">Việc tiếp theo</span><p>' + esc(b.next.text || '') + '</p>' +
      (b.next.say ? '<div class="sayrow"><span class="say">' + esc(b.next.say) + '</span>' + copyBtn(b.next.say, 'Copy câu lệnh', 'primary') + '</div>' : '') + '</div>' : '';
    var pend = STEPS.filter(function (x) { return x.approve && statusOf(b, x.id) === 'review'; })
      .map(function (x) { return fill(x.approve, b); }).filter(function (ph) { return !b.next || ph !== b.next.say; });
    if (pend.length) next += '<div class="pending"><span class="small strong">Còn chờ bạn duyệt:</span>' + pend.map(function (ph) {
      return '<span class="chip">' + esc(ph) + ' ' + copyBtn(ph, 'Copy', 'tiny') + '</span>'; }).join('') +
      '<span class="muted small">Mẹo: gõ thẳng lệnh của bước tiếp theo thì bước trước tự được duyệt.</span></div>';
    var st = S.steps[slug] || {};
    var stepTabs = STEPS.concat(UTIL).filter(function (x) { return x.tab && st[x.id]; }).map(function (x) {
      return '<a href="#/b/' + slug + '/' + x.id + '" class="' + (tab === x.id ? 'on' : '') + '">' + esc(x.tab) +
        (statusOf(b, x.id) === 'review' ? ' <i class="dot" title="Chờ duyệt"></i>' : effStatus(b, x.id) === 'choose' ? ' <i class="dot choose" title="Chờ bạn chọn"></i>' : '') + '</a>';
    }).join('');
    var tabs = '<div class="tabs">' +
      '<a href="#/b/' + slug + '/board" class="' + (tab === 'board' ? 'on' : '') + '">Brand board</a>' + stepTabs +
      '<a href="#/b/' + slug + '/images" class="' + (tab === 'images' ? 'on' : '') + '">Ảnh cần tạo <span class="count">' + c.have + '/' + c.total + '</span></a>' +
      '<a href="#/b/' + slug + '/brief" class="' + (tab === 'brief' ? 'on' : '') + '">Brief</a></div>';
    var body = tab === 'images' ? viewImages(b) : tab === 'brief' ? viewBrief(b) : st[tab] ? viewStep(b, tab) : viewBoard(b);
    return nav('home') + '<main class="wrap">' + errorsBanner() + head + stepper(b) + next + tabs + body + '</main>';
  }

  function logoCard(b, l, big) {
    var bg = l.bg === 'dark' ? (color(b, 'Dark') || primary(b)) : (color(b, 'Light') || '#ffffff');
    return '<figure class="logo' + (big ? ' big' : '') + '"><div class="logo-box" style="background:' + bg + '">' + l.svg + '</div>' +
      '<figcaption><span>' + esc(l.name) + '</span><span class="dl">' + (l.src ? '<a class="btn tiny" href="brands/' + esc(b.slug) + '/' + esc(l.src) + '" download>Tải file</a>' :
      '<button class="btn tiny" data-png="' + esc(b.slug) + '|' + esc(l.id) + '">PNG</button><button class="btn tiny ghost" data-svg="' + esc(b.slug) + '|' + esc(l.id) + '">SVG</button>') + '</span></figcaption></figure>';
  }
  function slot(b, im) {
    var u = S.img[b.slug + '/' + im.id];
    var ratio = (im.ratio || '1:1').split(':'), ar = (parseFloat(ratio[0]) || 1) + '/' + (parseFloat(ratio[1]) || 1);
    if (u) return '<figure class="slot"><img src="' + u + '" alt="' + esc(im.title) + '" style="aspect-ratio:' + ar + '"><figcaption>' + esc(im.title) + '</figcaption></figure>';
    return '<a class="slot missing" href="#/b/' + b.slug + '/images" style="aspect-ratio:' + ar + '"><span>' + esc(im.title) + '</span><small>Chưa có ảnh · bấm để tạo</small></a>';
  }
  function section(title, inner, cls) { return inner ? '<section class="bsec ' + (cls || '') + '"><h2>' + title + '</h2>' + inner + '</section>' : ''; }
  function para(label, text) { return text ? '<div class="dir"><h5>' + label + '</h5><p>' + esc(text) + '</p></div>' : ''; }

  function viewDirections(b) {
    var bd = bsDirs(b), dirs = bd.list;
    var cards = dirs.map(function (d) {
      var cs = d.colors || [], f = d.fonts || {}, c0 = (cs[0] || {}).hex || '#2b2a28';
      var hf = f.headline ? "font-family:'" + f.headline + "',sans-serif;font-weight:" + (f.headlineWeight || 700) : '';
      var bf = f.body ? "font-family:'" + f.body + "',sans-serif" : '';
      var picked = bd.chosen && String(bd.chosen).indexOf(d.id) >= 0;
      var say = 'Chọn hướng ' + d.id + ' cho ' + b.name;
      return '<article class="dcard' + (picked ? ' picked' : '') + '">' +
        '<div class="dhead" style="background:' + c0 + ';color:' + onColor(c0) + '"><span style="' + hf + '">' + esc(b.name) + '</span>' +
        (cs.length ? '<div class="stripe">' + cs.map(function (c) { return '<i style="background:' + c.hex + '"></i>'; }).join('') + '</div>' : '') + '</div>' +
        '<div class="dbody"><h3><span class="dletter">' + esc(d.id) + '</span>' + esc(d.name) + (picked ? ' <span class="pill s-done">Đã chọn</span>' : '') + '</h3>' +
        '<p>' + esc(d.idea || '') + '</p>' +
        '<div class="dsw">' + cs.map(function (c) {
          return '<button class="dchip" data-copy="' + clip(c.hex) + '" title="Copy mã màu"><i style="background:' + c.hex + '"></i>' + esc(c.name) + ' <small>' + esc(c.hex) + '</small></button>';
        }).join('') + '</div>' +
        '<div class="dfont"><span class="aa" style="' + hf + '">Aa</span><div><b style="' + hf + '">' + esc(f.headline || '') + '</b>' +
        '<p style="' + bf + '">' + esc(f.body || '') + ': Sweet moments, made to share.</p></div></div>' +
        (d.logo ? '<p class="small"><b>Logo:</b> ' + esc(d.logo) + '</p>' : '') +
        (d.mood ? '<div class="chips">' + d.mood.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div>' : '') +
        (b.kit ? '' : copyBtn(say, 'Chọn hướng ' + d.id, 'primary')) + '</div></article>';
    }).join('');
    var mix = 'Chọn màu của A + font của B cho ' + b.name, auto = 'Chọn giúp mình hướng tốt nhất cho ' + b.name;
    return '<div class="dirs">' + cards + '</div>' + (b.kit ? '' :
      '<div class="how"><h3>Chưa ưng hẳn hướng nào?</h3><p>Cứ mix: <span class="say">' + esc(mix) + '</span> ' + copyBtn(mix, 'Copy') +
      '<br>Hoặc để Claude quyết: <span class="say">' + esc(auto) + '</span> ' + copyBtn(auto, 'Copy') + '</p></div>');
  }

  function viewBoard(b) {
    var k = b.kit;
    if (!k && bsDirs(b).list.length) {
      return '<h2 class="grouph">3 hướng sáng tạo: chọn một hướng để Brand Strategist dựng brand board</h2>' + viewDirections(b);
    }
    if (!k) {
      var say = fill(STEPS[1].say, b);
      return '<div class="empty small"><h3>Chưa có brand board</h3><p>Brand Strategist sẽ tạo logo, bảng màu, font và hướng hình ảnh.</p>' +
        '<p class="say">' + esc(say) + '</p>' + copyBtn(say, 'Copy câu lệnh', 'primary') + '</div>';
    }
    var logos = (S.logos[b.slug] || []).filter(function (l) { return (l.kind || 'logo') === 'logo'; });
    var els = (S.logos[b.slug] || []).filter(function (l) { return l.kind === 'element'; });
    var out = '<div class="board-actions"><button class="btn" data-cdtoggle>🎨 Mang sang Claude Design</button><button class="btn" data-print>🖨 Xuất PDF brand board</button></div>' + cdPanel(b) + '<div class="board">';
    if (logos.length) {
      out += section('Main logo', logoCard(b, logos[0], true) + (k.logo ? '<p class="muted">' + esc(k.logo) + '</p>' : ''), 'span2');
      if (logos.length > 1) out += section('Logo variations', '<div class="logos">' + logos.slice(1).map(function (l) { return logoCard(b, l); }).join('') + '</div>');
    }
    if (k.colors && k.colors.length) {
      var isVar = function (c) { return (c.role || '').toLowerCase() === 'variant'; };
      var sws = function (cs) {
        return '<div class="palette">' + cs.map(function (c) {
          return '<button class="sw" data-copy="' + clip(c.hex) + '" style="background:' + c.hex + ';color:' + onColor(c.hex) + '" title="Bấm để copy mã màu">' +
            '<b>' + esc(c.name) + '</b><span>' + esc(c.hex) + '</span><small>' + esc(c.role || '') + '</small></button>';
        }).join('') + '</div>';
      };
      var vars = k.colors.filter(isVar);
      out += section('Color palette', sws(k.colors.filter(function (c) { return !isVar(c); })) +
        (vars.length ? '<h5 class="subh">Product-line colours</h5>' + sws(vars) : '') + '<div class="uses">' + k.colors.map(function (c) { return c.use ? '<p><i style="background:' + c.hex + '"></i><b>' + esc(c.name) + ':</b> ' + esc(c.use) + '</p>' : ''; }).join('') + '</div>', 'span2');
    }
    if (k.typography) {
      out += section('Typography system', ['headline', 'body', 'accent'].map(function (role) {
        var t = k.typography[role]; if (!t) return '';
        var st = "font-family:'" + t.family + "',serif;font-weight:" + (t.weight || 400) + ';font-style:' + (t.style || 'normal');
        return '<div class="type"><div class="aa" style="' + st + '">Aa</div><div><h5>' + (role[0].toUpperCase() + role.slice(1)) + ' · ' + esc(t.family) + ' ' + esc(t.weight || '') + '</h5>' +
          '<p class="spec" style="' + st + '">' + esc(role === 'body' ? (b.oneLiner || 'The quick brown fox jumps over the lazy dog.') : (b.tagline || b.name)) + '</p>' +
          (t.why ? '<p class="muted small">' + esc(t.why) + '</p>' : '') + '</div></div>';
      }).join(''));
    }
    if (k.essence) {
      var e = k.essence;
      out += section('Brand essence', para('Positioning', e.positioning) +
        (e.personality ? '<div class="chips">' + e.personality.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' : '') +
        para('Voice', e.voice) + (e.keywords ? '<p class="muted small">Keywords: ' + e.keywords.map(esc).join(' · ') + '</p>' : ''));
    }
    var groups = {}, order = [];
    allImages(b).filter(function (im) { return im.step === 'brand-strategist'; }).forEach(function (im) {
      var g = im.group || 'Visual direction'; if (!groups[g]) { groups[g] = []; order.push(g); } groups[g].push(im);
    });
    var ph = k.photography || {};
    var dirs = {
      'Photography direction': para('Direction', ph.direction) + para('Lighting', ph.lighting) +
        (ph['do'] ? '<div class="dodont"><div><h5>Do</h5><ul>' + ph['do'].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
          '<div><h5>Don’t</h5><ul>' + (ph.dont || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>' : ''),
      'Mascot / illustration style': para('Style', k.illustration),
      'Social media visual style': para('Style', k.social),
      'Packaging direction': para('Direction', k.packaging),
      'Brand applications': para('Direction', k.applications)
    };
    Object.keys(dirs).forEach(function (g) { if (!groups[g] && dirs[g]) { groups[g] = []; order.push(g); } });
    order.forEach(function (g) {
      out += section(esc(g), (dirs[g] || '') + (groups[g].length ? '<div class="slots">' + groups[g].map(function (im) { return slot(b, im); }).join('') + '</div>' : ''), groups[g].length > 2 ? 'span2' : '');
    });
    if (els.length || k.graphicElements) {
      out += section('Graphic elements', para('Direction', k.graphicElements) + (els.length ? '<div class="logos">' + els.map(function (l) { return logoCard(b, l); }).join('') + '</div>' : ''));
    }
    out += '</div>';
    if (bsDirs(b).list.length) {
      out += '<details class="history"><summary>Xem lại 3 hướng đã đề xuất' + (bsDirs(b).chosen ? ' (đã chọn ' + esc(bsDirs(b).chosen) + ')' : '') + '</summary>' + viewDirections(b) + '</details>';
    }
    return out;
  }

  // A ref is a logo id, another image task's id, or the user's own photo (path relative to the brand folder).
  // `role` tells the image model what the attached picture is for; the user attaches refs in this order (Image 1, 2…).
  function refOf(b, id, n) {
    var num = n ? '<span class="rnum">' + n + '</span>' : '';
    var l = (S.logos[b.slug] || []).filter(function (x) { return x.id === id; })[0];
    if (l) {
      var words = [], m, re = /<text[^>]*>([^<]*)<\/text>/g;
      while ((m = re.exec(l.svg || ''))) if (m[1].trim()) words.push(m[1].trim());
      var word = words.join(' ') || (l.src ? b.name : '');
      var spelled = word.replace(/[^A-Za-z0-9 ]/g, '').toUpperCase().split(/\s+/).filter(Boolean).map(function (w) { return w.split('').join('-'); }).join(' ');
      return { kind: 'logo', n: n, name: l.name,
        role: 'the brand logo' + (word ? ' "' + word + '" (spelled ' + spelled + ')' : '') + ': copy it exactly, with the same letterforms, spelling, proportions and colour, and print it large, flat and facing the camera',
        html: '<span class="ref">' + num + '<span class="mini" style="background:' + (l.bg === 'dark' ? (color(b, 'Dark') || primary(b)) : '#fff') + '">' + l.svg + '</span>' + esc(l.name) +
          ' <button class="btn tiny" data-png="' + esc(b.slug) + '|' + esc(l.id) + '">PNG</button></span>' };
    }
    var im = allImages(b).filter(function (x) { return x.id === id; })[0];
    if (im) {
      var u = S.img[b.slug + '/' + id];
      return { kind: 'image', n: n, name: im.title,
        role: 'the approved "' + im.title + '" image: match its lighting, colour grade and surfaces',
        html: '<span class="ref" title="Chuột phải ảnh → Sao chép hình ảnh → Ctrl+V vào Gemini">' + num + (u ? '<img class="mini" src="' + u + '" alt="">' + esc(im.title) : esc(im.title) + ' <small class="muted">(tạo ảnh này trước)</small>') + '</span>' };
    }
    if (/[\/.]/.test(id)) {
      var f = id.split('/').pop(), path = 'brands/' + b.slug + '/' + id;
      return { kind: 'product', n: n, name: 'the product photo ' + f,
        role: 'the exact product: keep its shape, proportions, materials, colours, cap and printed type as photographed, except where the description below says otherwise, and do not redesign it',
        html: '<a class="ref" href="' + esc(path) + '" target="_blank" rel="noopener" title="Chuột phải ảnh → Sao chép hình ảnh → Ctrl+V vào Gemini">' + num + '<img class="mini" src="' + esc(path) + '" alt="">' + esc(f) + '</a>' };
    }
    return { kind: 'none', n: n, name: id, role: '', html: '' };
  }
  function refsOf(b, im) {
    return (im.refs || []).map(function (id, i) { return refOf(b, id, i + 1); }).filter(function (r) { return r.kind !== 'none'; });
  }
  // Gemini only makes these ratios; ask for the nearest one and let the slot crop the small difference.
  var GEN_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];
  function genRatio(ratio) {
    var p = String(ratio || '1:1').split(':'), v = Math.log((+p[0] || 1) / (+p[1] || 1));
    return GEN_RATIOS.reduce(function (best, r) { var q = r.split(':'); return Math.abs(Math.log(q[0] / q[1]) - v) < Math.abs(Math.log(best.split(':')[0] / best.split(':')[1]) - v) ? r : best; }, '1:1');
  }
  function orient(ratio) { var p = String(ratio || '1:1').split(':'), w = +p[0], h = +p[1]; return w > h ? 'horizontal' : w < h ? 'vertical' : 'square'; }
  // The brand style block, cleaned for image models: colour names only (hex codes add little) and no negatives (the closing line covers them).
  function styleText(b) {
    return String((b.kit && b.kit.promptBlock) || '')
      .replace(/\s*\(\s*#[0-9a-f]{3,8}\s*\)|\s*#[0-9a-f]{6}\b/gi, '')
      .replace(/[,;]?\s*\bno (?:extra |other |added )?(?:text|lettering|watermarks?|logos?)\b/gi, '')
      .replace(/\s+([,.])/g, '$1').trim();
  }
  // Prompt order follows Google's and OpenAI's guides: intent + format, reference roles, scene, style, what may carry branding, ratio.
  function promptText(b, im) {
    if (im.composite && im.tool === 'Canva') im = Object.assign({}, im, { tool: 'Gemini' });
    var r = genRatio(im.ratio), o = orient(r);
    if (im.tool === 'Camera') return im.prompt + '\n\nAspect ratio: ' + r + ' (' + o + ').';
    // Canva tasks: the description doubles as a fallback AI scene, with the logo printed on the item.
    if (im.tool === 'Canva') im = Object.assign({}, im, { tool: 'Gemini', prompt: im.prompt.charAt(0).toUpperCase() + im.prompt.slice(1) + '. ' + ((im.refs || []).length ? 'Print the attached logo large, flat and facing the camera on the front of it. ' : '') + 'Simple, uncluttered setting.' });
    var rs = refsOf(b, im), logo = rs.filter(function (x) { return x.kind === 'logo'; })[0], prod = rs.filter(function (x) { return x.kind === 'product'; })[0];
    var photo = im.style !== 'none', L = [];
    L.push('Create a ' + (photo ? 'photorealistic ' : '') + o + ' ' + r + ' ' + (photo ? 'photograph' : 'image') + ' for a brand portfolio (' + (im.title || im.group || '') + ').');
    rs.forEach(function (x) { L.push('Image ' + x.n + ' is ' + x.role + '.'); });
    L.push('', im.prompt);
    var st = photo ? styleText(b) : '';
    if (st) L.push('', st);
    L.push('', im.composite ? 'Every surface, including the blank area, is plain and unmarked, with no text, letters, logos or watermark.' :
      logo ? 'The only branding visible is the logo from Image ' + logo.n + '; every other surface is plain and unmarked, with no added text or watermark.' :
      prod ? 'The only branding visible is the product\'s own printed type from Image ' + prod.n + '; every other surface is plain and unmarked, with no added text or watermark.' :
      'Every surface is plain and unmarked, with no text, letters, logos or watermark.');
    L.push('Aspect ratio: ' + r + ' (' + o + ').');
    return L.join('\n');
  }
  // Follow-up edits for an image that is almost right: fix one thing in the same chat instead of starting over.
  function fixList(b, im) {
    var rs = refsOf(b, im), logo = rs.filter(function (x) { return x.kind === 'logo'; })[0], prod = rs.filter(function (x) { return x.kind === 'product'; })[0];
    var r = genRatio(im.ratio), o = orient(r);
    var pal = ((b.kit && b.kit.colors) || []).filter(function (c) { return (c.role || '').toLowerCase() !== 'variant'; }).slice(0, 3).map(function (c) { return c.name.toLowerCase(); }).join(', ');
    return [
      ['Sai tỉ lệ khung', 'Keep everything exactly the same, but make the image ' + o + ' ' + r + ': extend the background, do not crop or stretch the subject.', true],
      prod && ['Sản phẩm bị vẽ khác', 'Same scene and lighting; make the product match Image ' + prod.n + ' exactly: shape, proportions, material and colour, cap and printed type. Change nothing else.'],
      logo && ['Logo méo, sai chữ', 'Make the logo exactly like Image ' + logo.n + ': same letterforms and spelling, larger, flat and facing the camera. Change nothing else.'],
      ['Có chữ lạ', (logo || prod ? 'Remove every letter or word that is not on the product or the logo.' : 'Remove every letter, word and logo from the image.') + ' Change nothing else.'],
      ['Rối mắt', 'Remove the extra props and simplify the background. Do not move the main subject. Keep everything else the same.'],
      ['Cần chỗ trống bên dưới', 'Keep the composition, but move the subject up so the bottom 45% of the frame is calm, empty background. Keep everything else the same.'],
      ['Ánh sáng gắt', 'Keep everything; make the light softer and warmer, like early-morning window light.'],
      pal && ['Màu lệch brand', 'Keep everything; shift the colours toward ' + pal + ', slightly less saturated.'],
      im.style !== 'none' && ['Trông giả, như 3D', 'Make it look like a real photograph: natural shadows, real material texture, slight imperfections, not CGI. Change nothing else.']
    ].filter(Boolean);
  }
  function blankCanvas(ratio) {
    var p = String(ratio || '1:1').split(':'), w = +p[0] || 1, h = +p[1] || 1, c = document.createElement('canvas');
    c.width = w >= h ? 1440 : Math.round(1440 * w / h); c.height = w >= h ? Math.round(1440 * h / w) : 1440;
    var x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height);
    download(c.toDataURL('image/png'), 'khung-trong-' + w + 'x' + h + '.png');
  }
  function viewImages(b) {
    var ims = allImages(b);
    if (!ims.length) return '<div class="empty small"><h3>Chưa có ảnh nào cần tạo</h3><p>Các thành viên sẽ thêm việc tạo ảnh vào đây khi làm xong bước của mình.</p></div>';
    var c = imgCounts(b);
    var how = '<div class="how"><h3>Cách tạo ảnh (' + c.have + '/' + c.total + ' đã có)</h3>' + dirBanner() + '<ol>' +
      '<li>Bấm <b>Copy prompt</b> ở ảnh cần tạo.</li>' +
      '<li>Mở <a href="https://gemini.google.com/app" target="_blank" rel="noopener">Gemini</a> hoặc <a href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT</a> (xem dòng “Nên tạo bằng”). Nếu có <b>ảnh tham chiếu</b>, đính kèm <b>đúng thứ tự số 1, 2…</b>: logo thì bấm PNG để tải; ảnh chụp thì <b>chuột phải → Sao chép hình ảnh → Ctrl+V</b> vào ô chat. Rồi dán prompt và gửi.</li>' +
      '<li>Ảnh <b>gần đúng</b> thì đừng tạo lại từ đầu: mở <b>Câu sửa nhanh</b> ở ảnh đó, copy câu hợp lỗi, dán tiếp vào cùng chat. Sửa 2 lần chưa được thì mở chat mới và đính kèm ảnh tốt nhất.</li>' +
      '<li>Ưng rồi thì đưa ảnh vào ô của nó: <b>tải ảnh về</b> (bản nét nhất) rồi <b>kéo thả</b> vào ô, hoặc chuột phải ảnh → Sao chép hình ảnh → <b>bấm vào ô → Ctrl+V</b>, hoặc bấm đúp vào ô để chọn file. Ảnh tự đổi đúng tên, lưu đúng chỗ và tự vào mọi thiết kế ✨</li></ol>' +
      '<details class="tips"><summary>Mẹo để ít phải tạo lại</summary><ul>' +
      '<li><b>Gemini:</b> làm cả bộ ảnh của một bước trong <b>cùng một chat</b> cho đồng bộ. Đừng chọn model bản “Lite”. Có gói trả phí thì ảnh lỗi logo/nhãn dùng <b>⋮ → Redo with Pro</b>.</li>' +
      '<li><b>ChatGPT:</b> chọn tỉ lệ ở nút <b>Aspect ratio</b> trước khi gửi. Có Plus thì chọn model Thinking cho ảnh nhiều sản phẩm.</li>' +
      '<li><b>Canva:</b> ảnh có ghi “Làm trong Canva” là để ghép <b>logo thật</b> lên túi, hộp, thiệp. Logo chuẩn 100%, không bị AI vẽ méo.</li>' +
      '<li>Gemini gắn dấu ✦ ở góc ảnh; nếu Cài đặt có mục <b>Media Watermark</b> thì tắt được. Khi đăng portfolio vẫn ghi rõ ảnh làm bằng AI.</li></ul></details></div>';
    var byStep = {};
    ims.forEach(function (im) { (byStep[im.step] = byStep[im.step] || []).push(im); });
    var out = how;
    STEPS.forEach(function (s) {
      var list = byStep[s.id]; if (!list) return;
      out += '<h2 class="grouph">' + esc(s.name) + '</h2><div class="tasks">' + list.map(function (im) {
        var u = S.img[b.slug + '/' + im.id];
        var refs = refsOf(b, im).map(function (x) { return x.html; }).join('');
        if (im.composite && im.tool === 'Canva') im = Object.assign({}, im, { tool: 'Gemini' });
        var canva = im.tool === 'Canva', cam = im.tool === 'Camera';
        var tool = cam ? '<span>📱 Tự chụp</span>' : canva ? '<span>Làm trong Canva (ghép logo thật)</span>' :
          '<span>Nên tạo bằng: ' + esc(im.tool || 'Gemini') + (im.composite ? ' → ghép thiết kế trong Canva' : '') + (im.ai ? ' · nhớ gắn nhãn AI khi đăng' : '') + '</span>';
        var guide = canva ? '<details open><summary>Cách làm trong Canva</summary><ol class="small">' +
            '<li>Bấm <b>PNG</b> ở logo bên trên để tải logo.</li>' +
            '<li>Mở Canva, vào mục <b>Apps</b>, tìm <b>Mockups</b>.</li>' +
            '<li>Chọn mẫu giống mô tả: <i>' + esc(im.prompt) + '</i></li>' +
            '<li>Kéo logo PNG vào vùng in, chỉnh cỡ cho cân → <b>Tải xuống PNG</b> → thả vào ô bên trái.</li></ol></details>' +
          '<details><summary>Không tìm được mẫu ưng ý? Tạo bằng Gemini</summary><p class="small muted">Nhanh hơn nhưng logo có thể hơi méo; dùng Câu sửa nhanh nếu cần.</p><pre>' + esc(promptText(b, im)) + '</pre>' + copyBtn(promptText(b, im), 'Copy prompt Gemini') + '</details>' :
          '<details><summary>' + (cam ? 'Xem hướng dẫn chụp' : 'Xem prompt') + '</summary><pre>' + esc(promptText(b, im)) + '</pre></details>' +
          (im.composite ? '<details><summary>Ghép thiết kế trong Canva</summary><ol class="small">' +
            '<li>Tạo ảnh cảnh bằng prompt này: vùng bảng/nhãn sẽ để trống.</li>' +
            '<li>Chụp thiết kế: <b>Mở riêng</b> thiết kế → <b>Win+Shift+S</b>, lưu PNG.</li>' +
            '<li>Canva → Apps → <b>Mockups</b> → <b>Create mockup</b> từ ảnh cảnh vừa tạo → kéo PNG thiết kế vào vùng trống → Tải xuống PNG → thả vào ô bên trái.</li></ol></details>' : '');
        var fx = cam ? '' : '<details class="fixes"><summary>Ảnh gần đúng? Câu sửa nhanh</summary><ul>' + fixList(b, im).map(function (f) {
            return '<li><span>' + esc(f[0]) + '</span>' + copyBtn(f[1], 'Copy') + (f[2] ? '<button class="btn tiny ghost" data-blank="' + esc(genRatio(im.ratio)) + '" title="Vẫn sai tỉ lệ: đính kèm khung trống này cuối cùng rồi gửi lại câu sửa">Khung trống ' + esc(genRatio(im.ratio)) + '</button>' : '') + '</li>';
          }).join('') + '</ul></details>';
        return '<article class="task' + (u ? ' ok' : '') + '">' +
          '<div class="thumb drop" tabindex="0" title="Kéo thả ảnh vào đây · bấm rồi Ctrl+V · bấm đúp để chọn file" data-drop="' + esc(b.slug) + '|' + esc(im.id) + '" style="aspect-ratio:' + String(im.ratio || '1:1').replace(':', '/') + '">' +
          (u ? '<img src="' + u + '" alt="">' : '<span class="dz">⬇<br>Thả ảnh vào đây<br><small>hoặc bấm rồi Ctrl+V</small></span>') + '</div>' +
          '<div class="tbody"><div class="ttop"><h4>' + esc(im.title) + '</h4>' + (u ? '<span class="pill s-done">Đã có</span>' : '<span class="pill s-doing">Cần tạo</span>') + '</div>' +
          '<p class="meta"><span>' + esc(im.group || '') + '</span><span>Tỉ lệ ' + esc(im.ratio || '1:1') + '</span>' + tool + '</p>' +
          (refs ? '<div class="refs"><small>' + (canva ? 'Cần dùng:' : 'Đính kèm theo đúng thứ tự:') + '</small>' + refs + '</div>' : '') + guide +
          '<div class="tact">' + (canva ? '' : copyBtn(promptText(b, im), cam ? 'Copy hướng dẫn chụp' : 'Copy prompt', 'primary')) + copyBtn(savePath(b.slug, im.id), 'Copy đường dẫn lưu') +
          '<code class="fname">' + esc(im.id) + '.png</code></div>' + fx + '</div></article>';
      }).join('') + '</div>';
    });
    return out;
  }

  function viewStep(b, id) {
    var d = (S.steps[b.slug] || {})[id] || {}, meta = STEPS.concat(UTIL).filter(function (x) { return x.id === id; })[0] || {};
    var out = '<div class="stephead"><h2>' + esc(meta.name || id) + ' ' + (meta.util ? '' : pill(effStatus(b, id))) + '</h2>' +
      (d.summary ? '<p class="lead">' + esc(d.summary) + '</p>' : '') + '</div>' + needBox(b, meta);
    if (d.choices && d.choices.length) {
      var picking = !d.chosen;
      out += (picking ? '<h3 class="grouph">Chọn một concept để làm tiếp</h3>' : '<details class="history"><summary>Các concept đã đề xuất (đã chọn ' + esc(d.chosen) + ')</summary>') +
        '<div class="dirs">' + d.choices.map(function (c) {
          var say = 'Chọn concept ' + c.id + ' cho ' + (meta.tab || id).toLowerCase() + ' ' + b.name;
          var picked = d.chosen && String(d.chosen).indexOf(c.id) >= 0;
          return '<article class="dcard' + (picked ? ' picked' : '') + '"><div class="dbody"><h3><span class="dletter">' + esc(c.id) + '</span>' + esc(c.name) +
            (picked ? ' <span class="pill s-done">Đã chọn</span>' : '') + '</h3><p>' + esc(c.summary || '') + '</p>' +
            (c.details ? '<ul class="clist">' + c.details.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
            (picking ? copyBtn(say, 'Chọn ' + c.id, 'primary') : '') + '</div></article>';
        }).join('') + '</div>' + (picking ? '' : '</details>');
    }
    var outs = d.outputs || [];
    var visuals = outs.filter(function (o) { return o.type === 'visual'; });
    if (visuals.length) out += '<h3 class="grouph">Thiết kế</h3><div class="visuals">' + visuals.map(function (o) { return visualCard(b, o); }).join('') + '</div>' +
      '<p class="muted small">💡 <b>Lưu PNG:</b> bấm <b>Mở riêng</b> → thiết kế tự co vừa màn hình → <b>Win+Shift+S</b> → kéo khung quanh thiết kế → bấm thông báo để lưu. ' +
      'Cần file đúng kích thước để sửa trong Canva: Mở riêng → <b>Ctrl+P</b> → Lưu dưới dạng PDF. Khung sọc 📷 là ảnh chưa tạo: tạo ở tab <a href="#/b/' + b.slug + '/images">Ảnh cần tạo</a>.</p>' +
      (visuals.some(function (o) { return o.motion; }) ? '<p class="muted small">🎬 <b>Xuất MP4:</b> Mở riêng → <b>F11</b> (toàn màn hình) → <b>Win+Shift+R</b> → kéo khung quanh video → quay đủ 1 vòng (~15 giây) → Dừng → Lưu.</p>' : '');
    outs.filter(function (o) { return o.type === 'doc'; }).forEach(function (o) {
      var src = 'brands/' + b.slug + '/' + o.file;
      out += '<h3 class="grouph">' + esc(o.title) + '</h3><div class="docbox"><div class="docbar"><span>' + esc(o.note || '') + '</span>' +
        '<span class="vact">' + copyBtn(cdVisualPrompt(b, o, meta.name || id), '🎨 Claude Design', 'cdbtn') + '<a class="btn" href="' + src + '" target="_blank" rel="noopener">Mở riêng ↗</a></span></div><div class="docview"><iframe data-docw="' + (parseInt(o.width, 10) || 1280) + '" src="' + src + '?v=' + Date.now() + '" loading="lazy"></iframe></div></div>' +
        '<p class="muted small">💡 <b>Xuất PDF:</b> Mở riêng → <b>Ctrl+P</b> → Máy in: <b>Lưu dưới dạng PDF</b> → Cài đặt khác → tích <b>Đồ họa nền</b> → Lưu.</p>';
    });
    outs.filter(function (o) { return o.type === 'copy'; }).forEach(function (o) {
      var all = (o.items || []).map(function (it) { return it.label + ':\n' + it.text; }).join('\n\n');
      out += '<h3 class="grouph">' + esc(o.title) + ' ' + copyBtn(all, 'Copy tất cả', 'tiny') + '</h3><div class="copies">' + (o.items || []).map(function (it) {
        return '<div class="copyitem"><div class="ctop"><b>' + esc(it.label) + '</b>' + copyBtn(it.text, 'Copy', 'tiny') + '</div><p>' + esc(it.text).replace(/\n/g, '<br>') + '</p></div>';
      }).join('') + '</div>';
    });
    if (!outs.length && !(d.choices && d.choices.length)) out += '<div class="empty small"><p>Bước này chưa có kết quả.</p></div>';
    if (id === 'proposal') out += portfolioChecklist(b);
    return out;
  }
  function portfolioChecklist(b) {
    var rows = [['01 The Problem', 'Tab Brief (Problem / Audience)'], ['02 The Insight', 'Brand board → Positioning; Campaign → Insight'],
      ['03 The Idea', 'Campaign → Big idea + key visual'], ['04 Execution', 'Social grid, packaging mockup, OOH mockup, video'],
      ['05 Results', 'Report (ghi “simulated”) hoặc mục tiêu KPI ở slide Closing'], ['Tải về', 'PDF proposal (link tải trên trang)']];
    return '<h3 class="grouph">Đưa lên portfolio (Squarespace)</h3><div class="checklist"><p class="small">Trang project theo kiểu insight-first, mỗi mục lấy từ:</p><table>' +
      rows.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td></tr>'; }).join('') + '</table>' +
      '<p class="muted small">Chữ cho từng mục có sẵn ở “Portfolio page copy” phía trên: bấm Copy tất cả rồi dán vào text block.</p></div>';
  }
  function qaTag(brandName, title, issues) {
    var say = 'Sửa bố cục ' + title + ' của ' + brandName + ': ' + issues.join(', ');
    return '<div class="qatag">⚠ Bố cục cần sửa: ' + esc(issues.join(', ')) + ' ' + copyBtn(say, 'Copy lệnh sửa', 'tiny') + '</div>';
  }
  function visualCard(b, o) {
    var src = 'brands/' + b.slug + '/' + o.file, wh = String(o.size || '1080x1080').split('x').map(Number);
    var W = wh[0] || 1080, H = wh[1] || 1080, wide = W >= H * 1.4, box = wide ? 520 : W > H ? 420 : 300, sc = box / W;
    var key = 'brands/' + b.slug + '/' + o.file, qa = S.qa[key] || [];
    return '<figure class="vcard' + (wide ? ' wide' : '') + '" data-file="' + esc(key) + '" data-title="' + esc(o.title || o.id) + '" data-brand="' + esc(b.name) + '" style="width:' + (box + 26) + 'px">' +
      (qa.length ? qaTag(b.name, o.title || o.id, qa) : '') + '<div class="vbox" style="width:' + box + 'px;height:' + Math.round(H * sc) + 'px">' +
      '<iframe src="' + src + '?v=' + Date.now() + '" style="width:' + W + 'px;height:' + H + 'px;transform:scale(' + sc + ')" loading="lazy" scrolling="no"></iframe></div>' +
      '<figcaption><div><b>' + esc(o.title || o.name || o.label || o.id) + '</b>' + (o.motion ? ' <span class="pill s-review">Motion</span>' : '') + '<small>' + esc(o.size || '') + (o.note ? ' · ' + esc(o.note) : '') + '</small></div>' +
      '<span class="vact">' + copyBtn(cdVisualPrompt(b, o, (STEPS.filter(function (x) { return o.file && o.file.indexOf(x.id + '/') === 0; })[0] || {}).name || 'brand'), '🎨', 'tiny cdbtn') +
      '<a class="btn tiny" href="' + src + '" target="_blank" rel="noopener">Mở riêng ↗</a></span></figcaption></figure>';
  }

  function viewBrief(b) {
    var r = b.brief || {};
    var rows = [['Project type', typeLabel(b)], ['Product', r.product], ['Audience', r.audience], ['Market', r.market], ['Problem / opportunity', r.problem],
      ['Personality', (r.personality || []).join(' · ')], ['Competitors', (r.competitors || []).join(', ')],
      ['Must-have', r.mustHave], ['Claude’s assumptions', r.assumptions]];
    function list(title, arr) { return arr && arr.length ? '<h3>' + title + '</h3><ul class="log">' + arr.map(function (x) { return '<li>' + esc(typeof x === 'string' ? x : (x.title || '') + (x.url ? ' — ' + x.url : '') + (x.note ? ' — ' + x.note : '')) + '</li>'; }).join('') + '</ul>' : ''; }
    var extra = list('Đã có sẵn (Claude không làm lại)', b.existing) + list('Còn thiếu (nên làm)', b.gaps) + list('Giữ nguyên (không được đổi)', b.locked) +
      list('Nguồn', b.sources) + list('Checklist trước khi launch', (b.checklist || []).map(function (c) { return (c.done ? '✅ ' : '⬜ ') + (c.text || c) + (c.url ? ' — ' + c.url : ''); })) + (b.role ? '<h3>Vai trò</h3><dl><dt>Phần của bạn</dt><dd>' + esc(b.role.mine || '') + '</dd>' + (b.role.team ? '<dt>Phần của nhóm</dt><dd>' + esc(b.role.team) + '</dd>' : '') + '</dl>' : '');
    var log = STEPS.filter(function (s) { return stepOf(b, s.id).note; }).map(function (s) {
      var d = stepOf(b, s.id); return '<li>' + pill(d.status) + ' <b>' + esc(s.name) + '</b> — ' + esc(d.note) + (d.updated ? ' <span class="muted">(' + esc(d.updated) + ')</span>' : '') + '</li>';
    }).join('');
    return '<div class="brief"><dl>' + rows.filter(function (x) { return x[1]; }).map(function (x) { return '<dt>' + x[0] + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('') + '</dl>' +
      extra + (log ? '<h3>Nhật ký các bước</h3><ul class="log">' + log + '</ul>' : '') + '</div>';
  }

  function viewGuide() {
    function say(t) { return '<span class="say">' + esc(t) + '</span> ' + copyBtn(t, 'Copy'); }
    var own = (S.portfolio && S.portfolio.brands || []).filter(function (x) { return S.brands[x] && !isDemo(S.brands[x]); });
    var bn = own.length ? S.brands[own[0]].name : '<tên brand>';
    var team = STEPS.map(function (s) {
      var b0 = { name: bn };
      return '<article class="member"><div class="mhead"><span class="mnum">' + esc(s.n) + '</span><div><h3>' + esc(s.name) + '</h3><small>' + esc(s.vi) + '</small></div>' +
        '<span class="weight w-' + esc(s.weight || '') + '">' + esc(s.weight || '') + '</span></div>' +
        '<p>' + esc(s.desc) + '</p><dl class="sinfo"><dt>Bạn nhận được</dt><dd>' + esc(s.gets || '') + '</dd>' +
        '<dt>Câu lệnh</dt><dd>' + say(fill(s.say, b0)) + (s.approve ? '<br>' + say(fill(s.approve, b0)) : '') + '</dd>' +
        '<dt>Model</dt><dd>' + esc(s.modelNote || s.model || 'Sonnet') + '</dd><dt>Xem ở</dt><dd>' + esc(s.where || '') + '</dd>' +
        '<dt>Xuất & portfolio</dt><dd>' + esc(s.exp || '') + '</dd>' + (s.tip ? '<dt>Mẹo</dt><dd>' + esc(s.tip) + '</dd>' : '') +
        (s.need ? '<dt>Đầu vào</dt><dd>' + esc(s.need.text) + ' (thư mục <code>brands/&lt;brand&gt;/' + esc(s.need.dir) + '</code>)</dd>' : '') + '</dl></article>';
    }).join('');
    return nav('guide') + '<main class="wrap guide"><h1>Cách dùng Portfolio Studio</h1>' +
      '<p class="lead">Bạn là <b>Creative Director</b>. Claude là team của bạn: mỗi thành viên làm đúng một việc, bước sau luôn đọc kết quả bước trước.</p>' +
      '<div class="gsteps">' +
      '<div><span class="gn">1</span><h3>Tạo brand</h3><p>Trong Claude (Cowork), gõ ' + say('Tạo brand mới') + ' rồi kể ý tưởng bằng tiếng Việt.</p></div>' +
      '<div><span class="gn">2</span><h3>Làm từng bước</h3><p>Mở trang brand ở đây. Ô <b>Việc tiếp theo</b> luôn có sẵn câu cần gõ, bạn chỉ cần bấm Copy rồi dán vào Claude.</p></div>' +
      '<div><span class="gn">3</span><h3>Tạo ảnh</h3><p>Claude không vẽ ảnh chụp. Tab <b>Ảnh cần tạo</b>: copy prompt sang Gemini/ChatGPT, lưu ảnh đúng tên, trang này tự nhận.</p></div>' +
      '<div><span class="gn">4</span><h3>Duyệt hoặc sửa</h3><p>Ưng thì gõ ví dụ ' + say('Duyệt Social Media ' + bn) + '. Muốn sửa thì nói thẳng: “đổi màu hồng đậm hơn”.</p></div></div>' +
      '<h2>Các kiểu dự án</h2><table class="cmds">' +
      '<tr><td>' + say('Tạo brand mới') + '</td><td><b>Brand giả định</b> làm từ đầu cho portfolio (như CEMMY), hoặc <b>brand thật</b> bạn sẽ vận hành (ví dụ brand matcha)</td></tr>' +
      '<tr><td>' + say('Nhập dự án có sẵn') + '</td><td>Dự án bạn đã làm: <b>brand concept</b> (The Label), <b>campaign cho brand thật</b> (Share A Coke), <b>campaign xã hội</b> (Water Safety), <b>chuỗi nội dung</b> (kênh TikTok). Bỏ tư liệu vào thư mục <code>input</code> của dự án, Claude đọc và chỉ làm phần còn thiếu</td></tr>' +
      '<tr><td>' + say('Kiểm tra dự án ' + bn) + '</td><td>Soát lỗi chính tả, đánh số mục, disclaimer, claim, alt text trước khi đăng portfolio</td></tr></table>' +
      '<h2 id="team">Đội ngũ của bạn</h2><p class="muted">Bấm Copy, dán vào Claude. Mỗi thành viên nên mở một chat mới. <b>Nặng/Vừa/Nhẹ</b> là mức tốn lượt dùng Claude.</p>' +
      '<div class="team">' + team + '</div>' +
      '<h2>Lượt dùng Claude Pro</h2><ul class="tips">' +
      '<li><b>Một brand trọn bộ ≈ 20 lượt nhắn</b>. Nên chia 2–3 buổi: ① Brief + Brand Strategist (Opus) · ② Social, Campaign, Packaging · ③ OOH, Proposal, rồi Video/Ads/Report.</li>' +
      '<li><b>Làm Brand Strategist đầu phiên</b> (bước nặng nhất). Các bước khác chọn model Sonnet.</li>' +
      '<li><b>Duyệt nhanh:</b> gõ thẳng lệnh bước tiếp theo, bước trước tự được duyệt.</li>' +
      '<li><b>Mỗi bước một chat mới</b>, gộp các ý sửa vào một tin nhắn.</li>' +
      '<li>Xem mức dùng: Claude → <b>Settings → Usage</b>. Bị ngắt giữa chừng: gõ ' + say('Làm tiếp Social Media cho ' + bn) + '</li></ul>' +
      '<h2>Câu lệnh chung</h2><table class="cmds">' +
      '<tr><td>' + say('Setup Portfolio Studio') + '</td><td>Tạo hoặc cập nhật HUB trong thư mục này</td></tr>' +
      '<tr><td>' + say('Tiến độ thế nào rồi?') + '</td><td>Claude tóm tắt các brand và việc tiếp theo</td></tr>' +
      '<tr><td>' + say('Đổi headline post promo ngắn hơn') + '</td><td>Sửa trực tiếp: nói rõ muốn đổi gì, ở đâu</td></tr>' +
      '<tr><td>' + say('Sửa lỗi file brand.js của ' + bn) + '</td><td>Khi HUB báo file bị lỗi</td></tr></table>' +
      '<h2>Xuất file để đưa vào portfolio</h2><ul class="tips">' +
      '<li><b>PNG (post, key visual, billboard):</b> bấm <b>Mở riêng</b> → thiết kế tự co vừa màn hình → <b>Win+Shift+S</b> → kéo khung quanh thiết kế → bấm thông báo để lưu.</li>' +
      '<li><b>PDF (proposal, report, brand board):</b> Mở riêng → <b>Ctrl+P</b> → <b>Lưu dưới dạng PDF</b> → Cài đặt khác → tích <b>Đồ họa nền</b>.</li>' +
      '<li><b>MP4 (video):</b> Mở riêng → <b>F11</b> → <b>Win+Shift+R</b> → kéo khung quanh video → quay 1 vòng → Lưu.</li>' +
      '<li><b>Logo PNG/SVG:</b> tab Brand board → nút dưới mỗi logo. Cả bộ brand kit: nút <b>🎨 Mang sang Claude Design</b>.</li></ul>' +
      '<h2>Đưa lên portfolio (Squarespace)</h2><p>Trang project theo kiểu insight-first: <b>01 Problem</b> (Brief) → <b>02 Insight</b> (Positioning, Campaign insight) → <b>03 Idea</b> (Campaign) → <b>04 Execution</b> (các thiết kế + mockup) → <b>05 Results</b> (Report hoặc KPI mục tiêu). Chữ cho từng mục có sẵn trong tab Proposal → <b>Portfolio page copy</b>.</p>' +
      '<p class="muted small">Portfolio Studio v' + VERSION + '</p></main>';
  }

  // ---------- router & events ----------
  function render() {
    CLIP = [];
    var h = location.hash.replace(/^#\/?/, '').split('/');
    var html;
    if (h[0] === 'b' && h[1]) html = viewBrand(decodeURIComponent(h[1]), h[2]);
    else if (h[0] === 'guide') html = viewGuide();
    else html = viewHome();
    var y = window.scrollY;
    document.getElementById('app').innerHTML = html;
    fitDocs();
    window.scrollTo(0, y);
  }
  // Documents are designed at a fixed width (e.g. 1600px slides); scale them to fit the preview box.
  function fitDocs() {
    Array.prototype.forEach.call(document.querySelectorAll('.docview iframe[data-docw]'), function (f) {
      var W = +f.getAttribute('data-docw'), box = f.parentNode.clientWidth || W, sc = Math.min(1, box / W);
      f.style.width = W + 'px'; f.style.height = Math.round(820 / sc) + 'px'; f.style.transform = 'scale(' + sc + ')';
    });
  }
  window.addEventListener('resize', fitDocs);
  window.addEventListener('hashchange', function () { S.sel = null; render(); window.scrollTo(0, 0); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-copy],[data-png],[data-svg],[data-step],[data-print],[data-reload],[data-cdzip],[data-cdtoggle],[data-connect],[data-blank]');
    if (!t) return;
    if (t.hasAttribute('data-copy')) { e.preventDefault(); copy(CLIP[+t.getAttribute('data-copy')], t.classList.contains('cdbtn') ? 'Đã copy prompt cho Claude Design 🎨' : null); }
    else if (t.hasAttribute('data-png') || t.hasAttribute('data-svg')) {
      e.preventDefault();
      var v = (t.getAttribute('data-png') || t.getAttribute('data-svg')).split('|');
      exportLogo(v[0], v[1], t.hasAttribute('data-svg') ? 'svg' : 'png');
    }
    else if (t.hasAttribute('data-step')) { var id = t.getAttribute('data-step'); S.sel = S.sel === id ? null : id; render(); }
    else if (t.hasAttribute('data-print')) window.print();
    else if (t.hasAttribute('data-cdtoggle')) { S.cd = !S.cd; render(); }
    else if (t.hasAttribute('data-connect')) ensureDir().then(function () { render(); toast('Đã cho phép lưu ảnh ✅'); }).catch(function () {});
    else if (t.hasAttribute('data-cdzip')) buildKitZip(t.getAttribute('data-cdzip'));
    else if (t.hasAttribute('data-reload')) location.reload();
    else if (t.hasAttribute('data-blank')) blankCanvas(t.getAttribute('data-blank'));
  });
  window.addEventListener('message', function (e) {
    var d = e.data; if (!d || d.type !== 'ps-qa') return;
    var m = /brands\/.+$/.exec(String(d.file || '').split('\\').join('/')); if (!m) return;
    S.qa[m[0]] = d.issues || [];
    var fig = document.querySelector('[data-file="' + m[0].replace(/"/g, '') + '"]'); if (!fig) return;
    var old = fig.querySelector('.qatag'); if (old) old.parentNode.removeChild(old);
    if (d.issues && d.issues.length) fig.insertAdjacentHTML('afterbegin', qaTag(fig.getAttribute('data-brand'), fig.getAttribute('data-title'), d.issues));
  });
  function dropTarget(e) { var d = e.target.closest && e.target.closest('.drop'); return d ? d.getAttribute('data-drop').split('|') : null; }
  document.addEventListener('dblclick', function (e) { var t = dropTarget(e); if (t) pickFile(t[0], t[1]); });
  document.addEventListener('dragover', function (e) {
    var d = e.target.closest && e.target.closest('.drop'); if (!d) return;
    e.preventDefault(); d.classList.add('over');
  });
  document.addEventListener('dragleave', function (e) { var d = e.target.closest && e.target.closest('.drop'); if (d) d.classList.remove('over'); });
  document.addEventListener('drop', function (e) {
    var t = dropTarget(e); if (!t) return;
    e.preventDefault(); e.target.closest('.drop').classList.remove('over');
    if (!S.dirOk) { toast('Bấm nút "📂 Chọn thư mục" ở đầu trang trước (chỉ 1 lần), rồi thả ảnh lại.'); return; }
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) return saveImage(t[0], t[1], f);
    var url = e.dataTransfer && (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain'));
    if (url && /^https?:/.test(url)) {
      fetch(url).then(function (r) { return r.blob(); }).then(function (b) { saveImage(t[0], t[1], b); })
        .catch(function () { toast('Không lấy được ảnh trực tiếp từ trang đó. Hãy chuột phải → Sao chép hình ảnh rồi Ctrl+V, hoặc tải về rồi kéo file vào.'); });
    }
  });
  document.addEventListener('paste', function (e) {
    var d = document.activeElement && document.activeElement.closest && document.activeElement.closest('.drop'); if (!d) return;
    var items = (e.clipboardData && e.clipboardData.items) || [], f = null;
    for (var i = 0; i < items.length && !f; i++) if (items[i].kind === 'file' && /^image\//.test(items[i].type)) f = items[i].getAsFile();
    if (!f) { toast('Trong bộ nhớ tạm chưa có ảnh. Trên Gemini: chuột phải ảnh → Sao chép hình ảnh.'); return; }
    e.preventDefault(); var t = d.getAttribute('data-drop').split('|'); saveImage(t[0], t[1], f);
  });
  // Watch for newly saved images every few seconds.
  setInterval(function () {
    if (document.visibilityState !== 'visible') return;
    var h = location.hash.replace(/^#\/?/, '').split('/');
    var slugs = h[0] === 'b' && h[1] ? [decodeURIComponent(h[1])] : Object.keys(S.brands);
    Promise.all(slugs.map(function (s) { return probeBrand(s, true); })).then(function (r) {
      if (r.some(Boolean)) { render(); toast('Đã nhận ảnh mới ✨'); }
    });
  }, 4000);

  load().then(render, function () { render(); });
  restoreDir().then(function () { if (S.dirOk) render(); });
})();
