/* Portfolio Studio compose helper v0.3, included by every visual/doc HTML inside brands/<slug>/<step>/.
   - <div data-logo="logo-primary"></div>  → injects that logo's SVG from ../logos.js (aligned to the side it sits on)
   - <img data-img="sm-launch-bg">          → loads ../images/<id>.png|jpg|jpeg|webp, or a branded placeholder showing the slot size
   - <img data-img="input/back.png">       → a path (has a '/') loads the user's own file from the brand folder as is
   - fits headlines that overflow or collide with the logo/badge, then reports remaining layout problems to the HUB
   - opened on its own: scales the design to fit the window, and Ctrl+P prints one page at the exact design size
   - fires document event 'compose:ready' when logos, images and fitting are done (start animations on it) */
(function () {
  'use strict';
  var EXT = ['png', 'jpg', 'jpeg', 'webp'];
  var GENERIC = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|inherit)$/;
  var inFrame = window.self !== window.top;
  function quote(list) {
    return list.split(',').map(function (x) {
      x = x.trim().replace(/^['"]|['"]$/g, ''); return GENERIC.test(x) ? x : "'" + x + "'";
    }).join(', ');
  }
  function fixSvg(svg) { return String(svg).replace(/font-family="([^"]+)"/g, function (m, f) { return 'font-family="' + quote(f) + '"'; }); }
  function cssVar(n, fb) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || fb; }

  var logos = null;
  window.HUB = window.HUB || {};
  window.HUB.logos = function (slug, items) { logos = items || []; };

  function injectLogos() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-logo]'), function (el) {
      var id = el.getAttribute('data-logo');
      var l = (logos || []).filter(function (x) { return x.id === id; })[0];
      if (!l) { el.textContent = '[' + id + ']'; return; }
      if (l.src && !l.svg) { // an official logo file the user supplied (real brands): never redrawn
        el.innerHTML = '<img src="../' + l.src + '" alt="" style="width:100%;height:100%;object-fit:contain;object-position:' +
          (/ (tr|br) /.test(' ' + el.className + ' ') ? 'right' : / (tl|bl|inline) /.test(' ' + el.className + ' ') ? 'left' : 'center') + ' center">';
        return;
      }
      el.innerHTML = fixSvg(l.svg);
      var svg = el.querySelector('svg'); if (!svg) return;
      var c = ' ' + el.className + ' ';
      svg.setAttribute('preserveAspectRatio', / (tr|br) /.test(c) ? 'xMaxYMid meet' : / (tl|bl|inline) /.test(c) ? 'xMinYMid meet' : 'xMidYMid meet');
      if (/ inline /.test(c) && getComputedStyle(el.parentNode).textAlign === 'center') svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.style.width = '100%'; svg.style.height = '100%'; svg.style.display = 'block';
    });
  }
  function ratioLabel(w, h) {
    var r = w / h, named = [[1, '1:1'], [0.8, '4:5'], [1.25, '5:4'], [1.5, '3:2'], [0.667, '2:3'], [1.778, '16:9'], [0.5625, '9:16'], [1.333, '4:3'], [0.75, '3:4'], [2, '2:1'], [1.6, '16:10'], [3, '3:1']];
    for (var i = 0; i < named.length; i++) if (Math.abs(r - named[i][0]) / named[i][0] < 0.04) return named[i][1];
    return r.toFixed(2) + ':1';
  }
  function placeholder(img, id) { // keep the same element so layout, classes and animations still apply
    var r = img.getBoundingClientRect(), w = Math.round(r.width) || 800, h = Math.round(r.height) || 1000;
    var a = cssVar('--secondary', '#d8d2c8'), b = cssVar('--accent', '#bdb6ac');
    var fs = Math.max(14, Math.round(Math.min(w, h) * 0.045)), label = '📷 ' + id + ' · ' + w + '×' + h + ' (' + ratioLabel(w, h) + ')';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>' +
      '<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="40" fill="rgba(255,255,255,.12)"/></pattern></defs>' +
      '<rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#p)"/>' +
      '<rect x="' + (w / 2 - label.length * fs * 0.29) + '" y="' + (h / 2 - fs) + '" width="' + (label.length * fs * 0.58) + '" height="' + (fs * 2) + '" rx="' + fs + '" fill="rgba(0,0,0,.35)"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-weight="600" font-size="' + fs + '" fill="#fff">' +
      label.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text></svg>';
    img.setAttribute('data-placeholder', id);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function loadImages() {
    var imgs = document.querySelectorAll('img[data-img]');
    return Promise.all(Array.prototype.map.call(imgs, function (img) {
      return new Promise(function (done) {
        var id = img.getAttribute('data-img'), i = 0;
        img.onload = function () { img.onload = img.onerror = null; done(); };
        if (id.indexOf('/') >= 0) { img.onerror = function () { img.onerror = img.onload = null; placeholder(img, id); done(); }; img.src = '../' + id; return; }
        img.onerror = function () {
          if (i < EXT.length) { img.src = '../images/' + id + '.' + EXT[i++]; return; }
          img.onerror = null; img.onload = null; placeholder(img, id); done();
        };
        img.onerror();
      });
    }));
  }

  // ---------- fit + QA ----------
  function overlap(a, b) { return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom); }
  function textRects(el) { // line boxes of the actual text, not the element's full-width box
    var r = document.createRange(); r.selectNodeContents(el);
    return Array.prototype.filter.call(r.getClientRects(), function (x) { return x.width > 1 && x.height > 1; });
  }
  function bgLum(el) { // luminance of the nearest solid background behind el (null if a photo or gradient)
    for (var n = el.parentElement; n; n = n.parentElement) {
      if (n.classList && n.classList.contains('photo-layer')) return null;
      var cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(cs.backgroundColor);
      if (m && (m[4] === undefined || +m[4] > 0.5)) {
        var c = [m[1], m[2], m[3]].map(function (v) { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      }
    }
    return null;
  }
  function fixLogoContrast() { // a light-background logo on a dark field disappears: swap to the reversed version (and back)
    var have = {}; (logos || []).forEach(function (l) { have[l.id] = 1; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-logo]'), function (el) {
      var id = el.getAttribute('data-logo'), lum = bgLum(el); if (lum === null) return;
      if (lum < 0.3 && !/reversed/.test(id) && have['logo-reversed']) el.setAttribute('data-logo', 'logo-reversed');
      else if (lum > 0.6 && /reversed/.test(id) && have['logo-primary']) el.setAttribute('data-logo', 'logo-primary');
    });
  }
  // A CTA or badge whose text barely differs from its fill is unreadable: recolour it with the brand's light/dark pair.
  function rgb(s) { var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/.exec(s || ''); return m ? [+m[1], +m[2], +m[3]] : null; }
  function lum(c) { c = c.map(function (v) { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function fixButtonContrast() {
    Array.prototype.forEach.call(document.querySelectorAll('.cta, .badge'), function (el) {
      var cs = getComputedStyle(el), fg = rgb(cs.color), bg = rgb(cs.backgroundColor);
      if (!fg || !bg || /rgba\([^)]*,\s*0\)/.test(cs.backgroundColor) || ratio(fg, bg) >= 3) return;
      var around = bgLum(el), dark = around !== null && around > 0.4; // light surroundings get a dark button, dark or photo ones a light button
      el.style.background = dark ? 'var(--dark)' : 'var(--light)'; el.style.color = dark ? 'var(--light)' : 'var(--dark)';
    });
  }
  function problems(frame) {
    var out = [], fr = frame.getBoundingClientRect();
    Array.prototype.forEach.call(frame.querySelectorAll('.panel, .copy'), function (z) { // any real text line clipped by its zone?
      var zr = z.getBoundingClientRect();
      // a clipping zone whose content is taller than the zone hides whatever sits at its end (a CTA, a nested logo)
      if (getComputedStyle(z).overflowY !== 'visible' && z.scrollHeight > z.clientHeight + 4) out.push('nội dung bị cắt');
      Array.prototype.forEach.call(z.querySelectorAll('.headline, .sub, .kicker, .cta'), function (t) {
        var cta = t.classList.contains('cta'), tol = cta ? 2 : parseFloat(getComputedStyle(t).fontSize) * 0.3; // text boxes are taller than the ink; a CTA pill is not
        (cta ? [t.getBoundingClientRect()] : textRects(t)).forEach(function (r) {
          if (r.bottom > zr.bottom + tol || r.top < zr.top - tol || r.right > zr.right + 2 || r.left < zr.left - 2) out.push('chữ tràn khỏi khung');
        });
      });
    });
    var blockers = Array.prototype.filter.call(frame.querySelectorAll('.logo, .badge'), function (o) {
      return getComputedStyle(o).position === 'absolute';
    });
    Array.prototype.forEach.call(frame.querySelectorAll('.headline, .sub, .kicker, .cta'), function (h) {
      var rects = h.classList.contains('cta') ? [h.getBoundingClientRect()] : textRects(h);
      var tol = parseFloat(getComputedStyle(h).fontSize) * 0.3;
      rects.forEach(function (r) {
        if (r.bottom > fr.bottom + 1 || r.top < fr.top - 1 || r.right > fr.right + 1 || r.left < fr.left - 1) out.push('chữ ra ngoài thiết kế');
        var ink = { left: r.left, right: r.right, top: r.top + tol * 0.5, bottom: r.bottom - tol * 0.5 };
        blockers.forEach(function (o) { if (!o.contains(h) && !h.contains(o) && overlap(ink, o.getBoundingClientRect())) out.push('chữ bị logo/badge đè'); });
      });
    });
    return out.filter(function (x, i) { return out.indexOf(x) === i; });
  }
  function fit(frame) {
    var heads = frame.querySelectorAll('.headline');
    for (var i = 0; i < 10 && problems(frame).length && heads.length; i++) {
      Array.prototype.forEach.call(heads, function (h) { h.style.fontSize = (parseFloat(getComputedStyle(h).fontSize) * 0.93) + 'px'; });
    }
    var issues = problems(frame);
    if (!frame.querySelector('[data-logo]')) issues.push('thiếu logo');
    return issues;
  }
  function report(issues) {
    var file = decodeURIComponent(location.pathname).replace(/\\/g, '/');
    if (issues.length) console.warn('[Portfolio Studio] layout:', issues.join(', '));
    if (inFrame) { try { window.parent.postMessage({ type: 'ps-qa', file: file, issues: issues }, '*'); } catch (e) {} }
    return issues;
  }

  // ---------- standalone view: fit to window, exact-size printing ----------
  function standalone(frame, issues) {
    var W = frame.offsetWidth, H = frame.offsetHeight;
    var st = document.createElement('style');
    st.textContent = 'html{-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      'html,body{background:#3a3a3a}body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:14px 0;box-sizing:border-box}' +
      '.ps-bar{font:500 13px/1.4 system-ui,Segoe UI,sans-serif;color:#eee;display:flex;gap:14px;align-items:center;flex-wrap:wrap;justify-content:center}' +
      '.ps-bar button{font:inherit;border:1px solid #777;background:#555;color:#fff;border-radius:999px;padding:3px 12px;cursor:pointer}' +
      '.ps-qa{background:#b3261e;color:#fff;border-radius:8px;padding:3px 10px}' +
      '@page{size:' + W + 'px ' + H + 'px;margin:0}' +
      '@media print{html,body{background:none!important;display:block!important;padding:0!important;min-height:0!important}.ps-bar{display:none!important}.frame{zoom:1!important}}';
    document.head.appendChild(st);
    var bar = document.createElement('div'); bar.className = 'ps-bar';
    bar.innerHTML = '<span>' + W + '×' + H + ' px</span><span>📸 Win+Shift+S → kéo khung quanh thiết kế</span><span>🖨 Ctrl+P → PDF đúng kích thước</span><button type="button"></button>' +
      (issues.length ? '<span class="ps-qa">⚠ ' + issues.join(' · ') + '</span>' : '');
    document.body.insertBefore(bar, document.body.firstChild);
    var full = false, btn = bar.querySelector('button');
    function size() { var s = full ? 1 : Math.min(1, (innerWidth - 32) / W, (innerHeight - 80) / H); frame.style.zoom = s; btn.textContent = full ? 'Vừa màn hình' : 'Xem 100%'; }
    btn.onclick = function () { full = !full; size(); };
    addEventListener('resize', size); size();
  }

  // Typographic apostrophes and quotes in on-image text ("It's" → "It’s"), which models often forget.
  function smartQuotes() {
    Array.prototype.forEach.call(document.querySelectorAll('.headline, .sub, .kicker, .cta, .badge, .copy p, .panel p'), function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        var t = w.currentNode;
        t.nodeValue = t.nodeValue.replace(/(\w)'(\w)/g, '$1’$2').replace(/(^|[\s(\[—–-])'/g, '$1‘').replace(/'/g, '’')
          .replace(/(^|[\s(\[—–-])"/g, '$1“').replace(/"/g, '”');
      }
    });
  }
  // Headlines never break inside a hyphenated word ("check-/ins"): keep each such word on one line.
  function keepHyphenatedWords() {
    Array.prototype.forEach.call(document.querySelectorAll('.headline'), function (h) {
      var w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), nodes = [];
      while (w.nextNode()) if (/\S-\S/.test(w.currentNode.nodeValue)) nodes.push(w.currentNode);
      nodes.forEach(function (t) {
        var span = document.createElement('span');
        span.innerHTML = t.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/(\S+-\S+)/g, '<span style="white-space:nowrap">$1</span>');
        while (span.firstChild) t.parentNode.insertBefore(span.firstChild, t);
        t.parentNode.removeChild(t);
      });
    });
  }

  function run() {
    smartQuotes(); keepHyphenatedWords();
    var logoReady = new Promise(function (done) {
      var s = document.createElement('script');
      s.src = '../logos.js?v=' + Date.now();
      s.onload = s.onerror = function () { fixLogoContrast(); fixButtonContrast(); injectLogos(); done(); };
      document.head.appendChild(s);
    });
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.all([logoReady, loadImages(), fontsReady]).then(function () {
      var frame = document.querySelector('.frame'), issues = [];
      if (frame) { issues = report(fit(frame)); if (!inFrame) standalone(frame, issues); }
      else if (!inFrame) {
        var st = document.createElement('style'); st.textContent = 'html{-webkit-print-color-adjust:exact;print-color-adjust:exact}'; document.head.appendChild(st);
      }
      document.dispatchEvent(new Event('compose:ready'));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
