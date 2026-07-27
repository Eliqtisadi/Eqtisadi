/* ==========================================================================
   Market branch site — app logic
   - loads content/site.json + content/offers.json (edited from /admin)
   - bilingual AR/EN with RTL/LTR switching
   - offer status (active / upcoming / expired) + countdown
   - PDF viewer modal
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------- i18n strings ----------------------------- */
  var I18N = {
    ar: {
      "skip": "تخطي إلى العروض",
      "nav.home": "الرئيسية", "nav.offers": "العروض", "nav.social": "تابعنا", "nav.branch": "زورنا", "nav.contact": "تواصل معنا",
      "hero.badge": "كل ما تحتاجه في مكان واحد",
      "hero.title": "أحدث العروض والخصومات في متناول يدك",
      "hero.card.offers": "العروض والخصومات", "hero.card.offersSub": "تصفّح عروض الأسبوع وحمّل ملفات الـ PDF",
      "hero.card.branch": "الموقع والتواصل", "hero.card.branchSub": "العنوان، مواعيد العمل، والاتجاهات",
      "hero.offersCount": "{n} ساري",
      "offers.title": "العروض", "offers.sub": "اضغط على أي عرض لعرض ملف الـ PDF أو تحميله.",
      "offers.empty": "لا توجد عروض في هذا القسم حاليًا.",
      "filter.active": "السارية", "filter.upcoming": "القادمة", "filter.expired": "المنتهية", "filter.all": "الكل",
      "social.title": "تابعنا على مواقع التواصل", "social.sub": "أول من يعرف بالعروض والخصومات الجديدة.",
      "branch.title": "الموقع والتواصل", "branch.sub": "العنوان ومواعيد العمل ووسائل التواصل.",
      "branch.hours": "مواعيد العمل", "branch.whatsapp": "واتساب", "branch.directions": "الاتجاهات", "branch.share": "مشاركة الصفحة",
      "modal.download": "تحميل", "modal.newtab": "فتح في تبويب",
      "modal.loading": "جاري تحميل العرض…", "modal.failed": "تعذّر عرض الملف. يمكنك تحميله:",
      "offer.view": "عرض العرض", "offer.download": "تحميل",
      "badge.active": "ساري", "badge.upcoming": "قريبًا", "badge.expired": "منتهي",
      "date.from": "من", "date.to": "إلى", "date.until": "حتى",
      "cd.lastDay": "آخر يوم اليوم", "cd.daysLeft": "باقي {d}", "cd.startsIn": "يبدأ بعد {d}", "cd.startsToday": "يبدأ اليوم",
      "hours.closed": "مغلق", "hours.openNow": "مفتوح الآن", "hours.closedNow": "مغلق الآن",
      "info.address": "العنوان", "info.phone": "الهاتف", "info.email": "البريد الإلكتروني", "info.branch": "الفرع",
      "share.copied": "تم نسخ رابط الصفحة",
      "load.error": "تعذّر تحميل البيانات. حدّث الصفحة أو حاول لاحقًا."
    },
    en: {
      "skip": "Skip to offers",
      "nav.home": "Home", "nav.offers": "Offers", "nav.social": "Follow us", "nav.branch": "Visit us", "nav.contact": "Contact us",
      "hero.badge": "Everything you need in one place",
      "hero.title": "The latest offers and deals within your reach",
      "hero.card.offers": "Offers & deals", "hero.card.offersSub": "Browse this week's offers and download the PDFs",
      "hero.card.branch": "Location & contact", "hero.card.branchSub": "Address, opening hours and directions",
      "hero.offersCount": "{n} active",
      "offers.title": "Offers", "offers.sub": "Tap any offer to view or download its PDF.",
      "offers.empty": "No offers in this section right now.",
      "filter.active": "Active", "filter.upcoming": "Upcoming", "filter.expired": "Past", "filter.all": "All",
      "social.title": "Follow us on social media", "social.sub": "Be the first to hear about new deals.",
      "branch.title": "Location & contact", "branch.sub": "Address, opening hours and contact details.",
      "branch.hours": "Opening hours", "branch.whatsapp": "WhatsApp", "branch.directions": "Directions", "branch.share": "Share page",
      "modal.download": "Download", "modal.newtab": "Open in new tab",
      "modal.loading": "Loading offer…", "modal.failed": "Couldn't display the file. You can download it:",
      "offer.view": "View offer", "offer.download": "Download",
      "badge.active": "Active", "badge.upcoming": "Soon", "badge.expired": "Ended",
      "date.from": "From", "date.to": "to", "date.until": "Until",
      "cd.lastDay": "Last day is today", "cd.daysLeft": "{d} left", "cd.startsIn": "Starts in {d}", "cd.startsToday": "Starts today",
      "hours.closed": "Closed", "hours.openNow": "Open now", "hours.closedNow": "Closed now",
      "info.address": "Address", "info.phone": "Phone", "info.email": "Email", "info.branch": "Branch",
      "share.copied": "Page link copied",
      "load.error": "Could not load data. Please refresh and try again."
    }
  };

  /* --------------------------- social platforms --------------------------- */
  var SOCIAL = {
    facebook:  { name: { ar: "فيسبوك", en: "Facebook" }, color: "#1877F2",
      svg: '<path d="M15 3h-2.2A3.8 3.8 0 0 0 9 6.8V10H6.5v3.2H9V21h3.2v-7.8H15l.5-3.2h-3.3V7.2c0-.6.4-1 1-1H15V3z"/>' },
    instagram: { name: { ar: "إنستجرام", en: "Instagram" }, color: "#E1306C",
      svg: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".8" fill="currentColor"/>' },
    whatsapp:  { name: { ar: "واتساب", en: "WhatsApp" }, color: "#25D366",
      svg: '<path d="M20.5 12a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12z"/><path d="M9 9.4c0 3.1 2.5 5.6 5.6 5.6l1-1.7-2-1-.9 1.1a5.2 5.2 0 0 1-2.1-2.1l1.1-.9-1-2z"/>' },
    tiktok:    { name: { ar: "تيك توك", en: "TikTok" }, color: "#111827",
      svg: '<path d="M14 3.5v10.7a3.7 3.7 0 1 1-3.7-3.7c.4 0 .8.1 1.2.2"/><path d="M14 3.5c.4 2.5 2 4 4.5 4.3"/>' },
    youtube:   { name: { ar: "يوتيوب", en: "YouTube" }, color: "#FF0000",
      svg: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5l4.5 2.5-4.5 2.5z"/>' },
    x:         { name: { ar: "إكس (تويتر)", en: "X (Twitter)" }, color: "#111827",
      svg: '<path d="M5 5l14 14M19 5L5 19"/>' },
    twitter:   { name: { ar: "إكس (تويتر)", en: "X (Twitter)" }, color: "#111827",
      svg: '<path d="M5 5l14 14M19 5L5 19"/>' },
    telegram:  { name: { ar: "تليجرام", en: "Telegram" }, color: "#229ED9",
      svg: '<path d="M21 4.5L3.5 11.2l5.2 1.8L19 6.8l-8.2 8v4.7l3-3.3 5 3.6z"/>' },
    snapchat:  { name: { ar: "سناب شات", en: "Snapchat" }, color: "#FFC800", fg: "#111827",
      svg: '<path d="M12 3.5c2.8 0 4.4 2 4.4 4.6 0 1.4-.2 2.4.3 3 .5.5 1.3.4 1.8.7.4.3.1 1-.9 1.5-.7.4-1.4.5-1.3 1 .2.9 2 2.6 3.4 3 .3.1.3.5 0 .7-.8.5-2 .5-2.4.9-.2.3-.1.9-.6 1-.7.2-1.9-.4-3.1-.4s-2.4.6-3.1.4c-.5-.1-.4-.7-.6-1-.4-.4-1.6-.4-2.4-.9-.3-.2-.3-.6 0-.7 1.4-.4 3.2-2.1 3.4-3 .1-.5-.6-.6-1.3-1-1-.5-1.3-1.2-.9-1.5.5-.3 1.3-.2 1.8-.7.5-.6.3-1.6.3-3C7.6 5.5 9.2 3.5 12 3.5z"/>' },
    linkedin:  { name: { ar: "لينكد إن", en: "LinkedIn" }, color: "#0A66C2",
      svg: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8 10.5V17M8 7.6v.01M12 17v-3.6a2 2 0 0 1 4 0V17"/>' },
    website:   { name: { ar: "الموقع الإلكتروني", en: "Website" }, color: "",
      svg: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"/>' },
    maps:      { name: { ar: "الموقع على الخريطة", en: "Location" }, color: "#34A853",
      svg: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>' },
    phone:     { name: { ar: "اتصل بنا", en: "Call us" }, color: "",
      svg: '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z"/>' }
  };

  var ICONS = {
    address: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
    branch: '<path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>',
    file: '<path d="M6 3h9l5 5v13H6z"/><path d="M15 3v5h5"/><path d="M9 13h6M9 17h4"/>'
  };

  /* ------------------------------- helpers -------------------------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var lang = "ar";
  var site = {};
  var offers = [];
  var filter = "active";
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function t(key, vars) {
    var s = (I18N[lang] && I18N[lang][key]) || I18N.ar[key] || key;
    if (vars) { Object.keys(vars).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); }); }
    return s;
  }
  function pick(obj, base) {
    if (!obj) return "";
    return (obj[base + "_" + lang] || obj[base + "_ar"] || obj[base + "_en"] || obj[base] || "").toString().trim();
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function svg(paths, cls) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") + ">" + paths + "</svg>";
  }
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function parseDate(v) {
    if (!v) return null;
    var d = new Date(v);
    if (isNaN(d.getTime())) {
      var m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!m) return null;
      d = new Date(+m[1], +m[2] - 1, +m[3]);
    }
    return d;
  }
  function fmtDate(d) {
    if (!d) return "";
    try {
      return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG-u-nu-latn" : "en-GB",
        { day: "numeric", month: "long", year: "numeric" }).format(d);
    } catch (e) { return d.toISOString().slice(0, 10); }
  }
  function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg; el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.hidden = true; }, 2600);
  }
  // ترميز مسارات الملفات ذات الأسماء العربية (بدون ترميز مزدوج)
  function encUrl(u) {
    u = String(u || "");
    try { return /%[0-9a-fA-F]{2}/.test(u) ? u : encodeURI(u); } catch (e) { return u; }
  }
  function telHref(v) { return "tel:" + String(v || "").replace(/[^\d+]/g, ""); }
  function waHref(v, text) {
    var n = String(v || "").replace(/[^\d]/g, "");
    return "https://wa.me/" + n + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  /* ------------------------------ offer status ---------------------------- */
  function statusOf(o) {
    var now = new Date();
    var s = parseDate(o.start), e = parseDate(o.end);
    if (s && startOfDay(s) > startOfDay(now)) return "upcoming";
    if (e) { var end = startOfDay(e); end.setHours(23, 59, 59, 999); if (now > end) return "expired"; }
    return "active";
  }
  // Arabic needs dual/plural agreement — "يوم واحد / يومان / ٣ أيام / ١١ يومًا"
  function daysWord(n) {
    if (lang !== "ar") return n === 1 ? "1 day" : n + " days";
    if (n === 1) return "يوم واحد";
    if (n === 2) return "يومان";
    if (n <= 10) return n + " أيام";
    return n + " يومًا";
  }
  function countdownOf(o, status) {
    var now = new Date(), s = parseDate(o.start), e = parseDate(o.end);
    if (status === "upcoming" && s) {
      var d = daysBetween(now, s);
      return d <= 0 ? t("cd.startsToday") : t("cd.startsIn", { d: daysWord(d) });
    }
    if (status === "active" && e) {
      var r = daysBetween(now, e);   // 0 = يوم النهاية نفسه (ساري حتى آخر اليوم)
      return r <= 0 ? t("cd.lastDay") : t("cd.daysLeft", { d: daysWord(r + 1) });
    }
    return "";
  }
  function dateRangeText(o) {
    var s = parseDate(o.start), e = parseDate(o.end);
    if (s && e) return t("date.from") + " " + fmtDate(s) + " " + t("date.to") + " " + fmtDate(e);
    if (e) return t("date.until") + " " + fmtDate(e);
    if (s) return t("date.from") + " " + fmtDate(s);
    return "";
  }

  /* ------ نصوص الصفحة القابلة للتعديل من لوحة التحكم (site.texts) ------ */
  // مفتاح i18n -> اسم الحقل في site.texts؛ لو الحقل فاضي يُستخدم النص الافتراضي
  var TEXT_MAP = {
    "hero.badge": "hero_badge",
    "hero.title": "hero_title",
    "hero.card.offers": "hero_offers_title", "hero.card.offersSub": "hero_offers_sub",
    "hero.card.branch": "hero_branch_title", "hero.card.branchSub": "hero_branch_sub",
    "offers.title": "sec_offers_title", "offers.sub": "sec_offers_sub",
    "social.title": "sec_social_title", "social.sub": "sec_social_sub",
    "branch.title": "sec_branch_title", "branch.sub": "sec_branch_sub",
    "branch.hours": "sec_hours_title"
  };
  function mergeSiteTexts() {
    var tx = site.texts || {};
    Object.keys(TEXT_MAP).forEach(function (key) {
      var f = TEXT_MAP[key];
      var ar = (tx[f + "_ar"] || "").toString().trim();
      var en = (tx[f + "_en"] || "").toString().trim();
      if (ar) I18N.ar[key] = ar;
      if (en) I18N.en[key] = en;
    });
  }

  /* ------------------------------- rendering ------------------------------ */
  function applyStaticText() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    $("#langLabel").textContent = lang === "ar" ? "EN" : "عربي";
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $("#footerYear").textContent = "© " + new Date().getFullYear();
  }

  function applySite() {
    var name = pick(site, "name") || "—";
    var branch = pick(site, "branch");
    var tagline = pick(site, "tagline");

    document.title = name + (branch ? " — " + branch : "");
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && tagline) metaDesc.setAttribute("content", tagline);

    $$('[data-bind="siteName"]').forEach(function (el) { el.textContent = name; });
    $$('[data-bind="branchName"]').forEach(function (el) { el.textContent = branch; });
    $$('[data-bind="tagline"]').forEach(function (el) { el.textContent = tagline; });

    // لونا اللوجو: --brand أزرق و --accent برتقالي
    if (site.brand_color) {
      document.documentElement.style.setProperty("--brand", site.brand_color);
      document.documentElement.style.setProperty("--brand-700", shade(site.brand_color, -25));
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute("content", site.brand_color);
    }
    if (site.accent_color) {
      document.documentElement.style.setProperty("--accent", site.accent_color);
      document.documentElement.style.setProperty("--accent-700", shade(site.accent_color, -22));
    }
    if (site.logo) { $("#brandLogo").src = site.logo; }
    $("#brandLogo").alt = name;

    // "تواصل معنا" في الناڤ: واتساب لو موجود، وإلا اتصال، وإلا يمرّر لقسم الفرع
    var contact = $("#navContact");
    if (site.whatsapp) { contact.href = waHref(site.whatsapp); contact.target = "_blank"; contact.rel = "noopener"; }
    else if (site.phone) { contact.href = telHref(site.phone); contact.removeAttribute("target"); }
    else { contact.href = "#branch"; contact.removeAttribute("target"); }

    renderInfo();
    renderHours();
    renderSocial();
    renderMap();
  }

  function shade(hex, pct) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex).trim());
    if (!m) return hex;
    var f = function (h) {
      var v = Math.round(parseInt(h, 16) * (100 + pct) / 100);
      return Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0");
    };
    return "#" + f(m[1]) + f(m[2]) + f(m[3]);
  }

  function renderInfo() {
    var rows = [];
    var address = pick(site, "address");
    if (address) rows.push({ ico: ICONS.address, label: t("info.address"), value: esc(address) });
    if (site.phone) rows.push({ ico: ICONS.phone, label: t("info.phone"), value: '<a href="' + telHref(site.phone) + '" dir="ltr">' + esc(site.phone) + "</a>" });
    if (site.email) rows.push({ ico: ICONS.email, label: t("info.email"), value: '<a href="mailto:' + esc(site.email) + '" dir="ltr">' + esc(site.email) + "</a>" });

    $("#infoList").innerHTML = rows.map(function (r) {
      return '<li><span class="ico">' + svg(r.ico) + "</span><span><b>" + esc(r.label) + "</b>" + r.value + "</span></li>";
    }).join("");

    var wa = $("#infoWhatsapp");
    if (site.whatsapp) { wa.href = waHref(site.whatsapp); wa.hidden = false; } else { wa.hidden = true; }

    var dir = $("#infoDirections");
    var dirUrl = site.directions_url || (site.map_query ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(site.map_query) : "");
    if (dirUrl) { dir.href = dirUrl; dir.hidden = false; } else { dir.hidden = true; }
  }

  function renderHours() {
    var hours = Array.isArray(site.hours) ? site.hours : [];
    if (!hours.length) { $(".hours-card").hidden = true; return; }
    $(".hours-card").hidden = false;

    var todayIdx = new Date().getDay(); // 0=Sunday
    $("#hoursList").innerHTML = hours.map(function (h) {
      var isToday = typeof h.weekday === "number" ? h.weekday === todayIdx : false;
      var time = h.closed ? t("hours.closed") : (h.open || "") + " – " + (h.close || "");
      return '<li class="' + (isToday ? "is-today" : "") + '"><span>' + esc(pick(h, "day")) +
        '</span><span class="h-time">' + esc(time) + "</span></li>";
    }).join("");

    var state = openNow(hours);
    var el = $("#openState");
    if (state === null) { el.hidden = true; return; }
    el.hidden = false;
    el.className = "open-state " + (state ? "is-open" : "is-closed");
    el.innerHTML = svg(ICONS.clock) + "<span>" + t(state ? "hours.openNow" : "hours.closedNow") + "</span>";
  }

  function openNow(hours) {
    var now = new Date(), day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    var toMin = function (s) {
      var m = /^(\d{1,2}):(\d{2})/.exec(String(s || ""));
      return m ? (+m[1]) * 60 + (+m[2]) : null;
    };
    var found = null;
    hours.forEach(function (h) {
      if (typeof h.weekday !== "number") return;
      var o = toMin(h.open), c = toMin(h.close);
      if (h.weekday === day) {
        found = found || false;
        if (!h.closed && o !== null && c !== null) {
          if (c > o ? (mins >= o && mins < c) : (mins >= o || mins < c)) found = true;
        }
      }
      // shift that started yesterday and runs past midnight
      if (!h.closed && o !== null && c !== null && c <= o && h.weekday === (day + 6) % 7 && mins < c) found = true;
    });
    return found;
  }

  function renderSocial() {
    var list = (Array.isArray(site.socials) ? site.socials : []).filter(function (s) { return s && s.url; });
    var grid = $("#socialGrid");
    if (!list.length) { $("#social").hidden = true; return; }
    $("#social").hidden = false;

    grid.innerHTML = list.map(function (s) {
      var key = String(s.platform || "website").toLowerCase();
      var meta = SOCIAL[key] || SOCIAL.website;
      var label = pick(s, "label") || meta.name[lang] || meta.name.ar;
      var handle = s.handle || prettyUrl(s.url);
      var color = s.color || meta.color || "var(--brand)";
      var fg = meta.fg ? ' style="color:' + meta.fg + '"' : "";
      return '<a class="social-card" href="' + esc(s.url) + '" target="_blank" rel="noopener" style="--sc:' + esc(color) + '">' +
        '<span class="social-glyph"' + fg + ">" + svg(meta.svg) + "</span>" +
        '<span class="social-text"><b>' + esc(label) + "</b><span dir='ltr'>" + esc(handle) + "</span></span>" +
        '<span class="social-arrow" aria-hidden="true">' + svg('<path d="M7 17L17 7"/><path d="M8 7h9v9"/>') + "</span></a>";
    }).join("");
    setupReveals();
  }

  function prettyUrl(u) {
    try { return decodeURIComponent(new URL(u).pathname).replace(/^\/+|\/+$/g, "") || new URL(u).hostname; }
    catch (e) { return u; }
  }

  var mapInited = false;
  function ensureLeaflet(cb) {
    if (window.L) { cb(); return; }
    if (ensureLeaflet.q) { ensureLeaflet.q.push(cb); return; }
    ensureLeaflet.q = [cb];
    var s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = function () { var q = ensureLeaflet.q; ensureLeaflet.q = null; q.forEach(function (f) { f(); }); };
    s.onerror = function () { ensureLeaflet.q = null; };
    document.head.appendChild(s);
  }

  function renderMap() {
    var lat = parseFloat(site.map_lat), lng = parseFloat(site.map_lng);
    if (isNaN(lat) || isNaN(lng)) { $("#mapCard").hidden = true; return; }
    $("#mapCard").hidden = false;

    // خريطة OpenStreetMap (Leaflet) بعلامة اللوجو ولافتة باسم المتجر — بأسلوب مشابه للمرجع
    ensureLeaflet(function () {
      if (!window.L || mapInited) { if (mapInited) return; $("#mapCard").hidden = true; return; }
      mapInited = true;
      var host = $("#mapFrame"); host.innerHTML = "";
      var map = L.map(host, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([lat, lng], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // اللوجو الكامل عائم على الخريطة (بدون كتابة)
      var icon = L.divIcon({
        html: '<img src="' + esc(site.logo || "assets/img/logo.svg") + '" alt="">',
        className: "map-logo-marker", iconSize: [150, 50], iconAnchor: [75, 25]
      });
      var dir = site.directions_url || ("https://www.google.com/maps/dir/?api=1&destination=" + lat + "," + lng);
      L.marker([lat, lng], { icon: icon })
        .addTo(map)
        .on("click", function () { window.open(dir, "_blank", "noopener"); });

      setTimeout(function () { map.invalidateSize(); }, 250);
    });
  }

  /* ------------------- أنيميشن الظهور عند التمرير ------------------- */
  var _revObs = null;
  function revObserver() {
    if (_revObs || reduceMotion || !("IntersectionObserver" in window)) return _revObs;
    _revObs = new IntersectionObserver(function (ents, obs) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    return _revObs;
  }
  function revealGroup(sel, stagger) {
    var io = revObserver();
    $$(sel).forEach(function (el, i) {
      if (el.dataset.rev) return;
      el.dataset.rev = "1";
      el.classList.add("reveal");
      if (stagger) el.style.transitionDelay = (i * stagger) + "ms";
      if (io) io.observe(el); else el.classList.add("in");
    });
  }
  function setupReveals() {
    if (reduceMotion) return;
    revealGroup(".section-head", 0);
    revealGroup("#offersGrid .offer", 70);
    revealGroup("#socialGrid .social-card", 60);
    revealGroup(".branch-grid .card", 80);
  }

  function countUpBadge(el, target) {
    var dur = 650, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      el.textContent = t("hero.offersCount", { n: Math.round(target * p) });
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderOffers() {
    var grid = $("#offersGrid");
    var decorated = offers.map(function (o) { return { o: o, st: statusOf(o) }; });

    var order = { active: 0, upcoming: 1, expired: 2 };
    decorated.sort(function (a, b) {
      if (a.o.pinned !== b.o.pinned) return a.o.pinned ? -1 : 1;
      if (order[a.st] !== order[b.st]) return order[a.st] - order[b.st];
      var ae = parseDate(a.o.end) || parseDate(a.o.start) || new Date(8640000000000000);
      var be = parseDate(b.o.end) || parseDate(b.o.start) || new Date(8640000000000000);
      return a.st === "expired" ? be - ae : ae - be;
    });

    // إخفاء زر «المنتهية» لو مفيش عروض منتهية، والتحويل للسارية لو كان مختارًا
    var expiredCount = decorated.filter(function (d) { return d.st === "expired"; }).length;
    var expiredChip = $('.chip[data-filter="expired"]');
    if (expiredChip) expiredChip.hidden = expiredCount === 0;
    if (expiredCount === 0 && filter === "expired") {
      filter = "active";
      $$(".chip").forEach(function (x) { x.classList.toggle("is-active", x.dataset.filter === "active"); });
    }

    var shown = decorated.filter(function (d) { return filter === "all" || d.st === filter; });

    // شارة عدد العروض السارية على كارت الهيرو
    var activeCount = decorated.filter(function (d) { return d.st === "active"; }).length;
    var badge = $("#heroOffersCount");
    if (badge) {
      badge.hidden = activeCount === 0;
      if (activeCount > 0) {
        badge.textContent = t("hero.offersCount", { n: activeCount });   // القيمة النهائية دائمًا
        if (!reduceMotion && !badge._counted) { badge._counted = true; countUpBadge(badge, activeCount); }
      }
    }

    $("#offersEmpty").hidden = shown.length > 0;
    grid.innerHTML = shown.map(function (d) { return offerCard(d.o, d.st); }).join("");

    $$(".js-view", grid).forEach(function (btn) {
      btn.addEventListener("click", function () { openPdf(btn.dataset.pdf, btn.dataset.title); });
    });

    generateThumbs(grid);
    setupReveals();
  }

  /* ---------------------- PDF first-page thumbnails ------------------------ */
  // ذاكرة الجلسة + تخزين دائم في المتصفح => تظهر المعاينة فورًا في الزيارات التالية
  var THUMBS = {};
  var PDFJS_VER = "3.11.174";
  var LS_PREFIX = "thumb:v2:";
  var MAX_AUTO_THUMB = 40 * 1024 * 1024;  // حد أمان أعلى فقط؛ الغلاف = أول صفحة دائمًا (كسول + مخزّن)

  function lsGet(url) {
    try { return localStorage.getItem(LS_PREFIX + url) || ""; } catch (e) { return ""; }
  }
  function lsSet(url, data) {
    try { localStorage.setItem(LS_PREFIX + url, data); }
    catch (e) {
      // الحصّة ممتلئة: نظّف معاينات قديمة وأعد المحاولة مرة واحدة
      try {
        Object.keys(localStorage).forEach(function (k) { if (k.indexOf(LS_PREFIX) === 0) localStorage.removeItem(k); });
        localStorage.setItem(LS_PREFIX + url, data);
      } catch (e2) {}
    }
  }

  function ensurePdfJs(cb) {
    if (window.pdfjsLib) { cb(); return; }
    if (ensurePdfJs.q) { ensurePdfJs.q.push(cb); return; }
    ensurePdfJs.q = [cb];
    var base = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + PDFJS_VER;
    var s = document.createElement("script");
    s.src = base + "/pdf.min.js";
    s.onload = function () {
      try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + "/pdf.worker.min.js"; } catch (e) {}
      var q = ensurePdfJs.q; ensurePdfJs.q = null;
      q.forEach(function (f) { f(); });
    };
    s.onerror = function () { ensurePdfJs.q = null; };   // فشل التحميل: يظل الشكل الافتراضي
    document.head.appendChild(s);
  }

  function generateThumbs(grid) {
    var covers = $$(".offer-cover[data-thumb]", grid);
    if (!covers.length) return;

    // ارسم فقط ما يقترب من الشاشة لتخفيف الحِمل
    var start = function (cover) {
      var url = cover.getAttribute("data-thumb");
      cover.removeAttribute("data-thumb");
      cover.classList.add("is-loading");     // مؤشر تحميل أثناء التوليد
      renderThumb(cover, url);
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { obs.unobserve(en.target); start(en.target); }
        });
      }, { rootMargin: "300px" });
      covers.forEach(function (c) { io.observe(c); });
    } else {
      covers.forEach(start);
    }
  }

  function renderThumb(cover, url) {
    // تجنّب تحميل ملف ضخم لمجرّد صورة مصغّرة (كتالوجات كبيرة) — عندها يظل الشكل الافتراضي
    fetch(encUrl(url), { method: "HEAD" }).then(function (r) {
      var len = parseInt(r.headers.get("content-length") || "0", 10);
      if (len && len > MAX_AUTO_THUMB) { cover.classList.remove("is-loading"); return; }
      drawThumb(cover, url);
    }).catch(function () { drawThumb(cover, url); });
  }

  function applyThumb(cover, url, data) {
    THUMBS[url] = data;
    var svgEl = cover.querySelector("svg");
    if (svgEl) svgEl.remove();
    cover.classList.remove("is-placeholder", "is-loading");
    var img = new Image();
    img.src = data; img.alt = ""; img.loading = "lazy";
    cover.insertBefore(img, cover.firstChild);           // الشارة تظل فوق الصورة
  }

  function drawThumb(cover, url) {
    ensurePdfJs(function () {
      if (!window.pdfjsLib) { cover.classList.remove("is-loading"); return; }
      var task = pdfjsLib.getDocument({ url: encUrl(url) });
      task.promise.then(function (pdf) {
        return pdf.getPage(1);
      }).then(function (page) {
        var base = page.getViewport({ scale: 1 });
        var scale = Math.min(1.6, 460 / base.width);      // عرض هدف ~460px (أسرع)
        var vp = page.getViewport({ scale: scale });
        var canvas = document.createElement("canvas");
        canvas.width = Math.ceil(vp.width);
        canvas.height = Math.ceil(vp.height);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        return page.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
          var data = canvas.toDataURL("image/jpeg", 0.8);
          lsSet(url, data);                                // تخزين دائم
          applyThumb(cover, url, data);
        });
      }).catch(function () { cover.classList.remove("is-loading"); });   // يظل الشكل الافتراضي
    });
  }

  function offerCard(o, st) {
    var title = pick(o, "title") || "—";
    var desc = pick(o, "desc");
    var pdf = o.pdf || "";
    var cover = o.cover || "";              // صورة غلاف يدوية لها الأولوية
    var cd = countdownOf(o, st);

    // ترتيب الغلاف: صورة يدوية ← معاينة مخزّنة (جلسة/متصفح، فورية) ← تُرسم لاحقًا ← شكل افتراضي
    var cached = pdf ? (THUMBS[pdf] || lsGet(pdf)) : "";
    var coverHtml;
    if (cover) {
      coverHtml = '<div class="offer-cover"><img src="' + esc(cover) + '" alt="" loading="lazy"></div>';
    } else if (cached) {
      if (!THUMBS[pdf]) THUMBS[pdf] = cached;
      coverHtml = '<div class="offer-cover"><img src="' + esc(cached) + '" alt="" loading="lazy"></div>';
    } else if (pdf) {
      coverHtml = '<div class="offer-cover is-placeholder" data-thumb="' + esc(pdf) + '">' + svg(ICONS.file) + "</div>";
    } else {
      coverHtml = '<div class="offer-cover is-placeholder">' + svg(ICONS.file) + "</div>";
    }

    var meta = "";
    var range = dateRangeText(o);
    if (range) meta += "<span>" + svg(ICONS.calendar) + esc(range) + "</span>";
    if (cd) meta += '<span class="offer-countdown">' + svg(ICONS.clock) + esc(cd) + "</span>";

    var actions = "";
    if (pdf) {
      actions =
        '<button class="btn btn-primary btn-sm js-view" type="button" data-pdf="' + esc(pdf) + '" data-title="' + esc(title) + '">' +
        svg(ICONS.file) + "<span>" + esc(t("offer.view")) + "</span></button>" +
        '<a class="btn btn-ghost btn-sm" href="' + esc(encUrl(pdf)) + '" download target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"/><path d="M8 11l4 4 4-4"/><path d="M5 19h14"/></svg>' +
        "<span>" + esc(t("offer.download")) + "</span></a>";
    }

    return '<article class="offer ' + (st === "expired" ? "is-expired" : "") + '">' +
      coverHtml.replace("</div>", '<span class="badge is-' + st + '">' + esc(t("badge." + st)) + "</span></div>") +
      '<div class="offer-body"><h3 class="offer-title">' + esc(title) + "</h3>" +
      (desc ? '<p class="offer-desc">' + esc(desc) + "</p>" : "") +
      (meta ? '<div class="offer-meta">' + meta + "</div>" : "") +
      "</div>" +
      (actions ? '<div class="offer-actions">' + actions + "</div>" : "") +
      "</article>";
  }

  /* -------------------------------- PDF modal ------------------------------ */
  var modal = null, pdfDoc = null, pageObserver = null;

  function openPdf(url, title) {
    url = encUrl(url);
    modal = $("#pdfModal");
    $("#pdfModalTitle").textContent = title || "";
    $("#pdfDownload").href = url;
    $("#pdfOpenNew").href = url;

    var host = $("#pdfPages");
    host.innerHTML = '<div class="pdf-loading"><div class="pdf-page-spin"></div><span>' + esc(t("modal.loading")) + "</span></div>";
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    // يعرض صفحات الـ PDF كصور بالتدريج (صفحة صفحة) بدل تحميل الملف كله دفعة واحدة
    ensurePdfJs(function () {
      if (!window.pdfjsLib) { host.innerHTML = pdfFallback(url); return; }
      pdfjsLib.getDocument({ url: url }).promise.then(function (pdf) {
        if (modal.hidden) { try { pdf.destroy(); } catch (e) {} return; }   // أُغلق قبل الجاهزية
        pdfDoc = pdf;
        return pdf.getPage(1).then(function (p1) {
          var base = p1.getViewport({ scale: 1 });
          host.innerHTML = "";
          for (var i = 1; i <= pdf.numPages; i++) {
            var d = document.createElement("div");
            d.className = "pdf-page";
            d.style.aspectRatio = base.width + " / " + base.height;
            d.dataset.page = String(i);
            d.innerHTML = '<div class="pdf-page-spin"></div>';
            host.appendChild(d);
          }
          pageObserver = new IntersectionObserver(function (ents, obs) {
            ents.forEach(function (en) { if (en.isIntersecting) { obs.unobserve(en.target); renderPdfPage(en.target); } });
          }, { root: $(".modal-body"), rootMargin: "800px" });
          $$(".pdf-page", host).forEach(function (p) { pageObserver.observe(p); });
        });
      }).catch(function () { host.innerHTML = pdfFallback(url); });
    });
  }

  function renderPdfPage(el) {
    if (!pdfDoc) return;
    var i = parseInt(el.dataset.page, 10);
    pdfDoc.getPage(i).then(function (page) {
      var base = page.getViewport({ scale: 1 });
      var cssW = el.clientWidth || 900;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var scale = Math.min(2.2, (cssW * dpr) / base.width);
      var vp = page.getViewport({ scale: scale });
      var canvas = document.createElement("canvas");
      canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
      var ctx = canvas.getContext("2d");
      return page.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
        el.innerHTML = ""; el.appendChild(canvas);
      });
    }).catch(function () { el.innerHTML = ""; });
  }

  function pdfFallback(url) {
    return '<div class="pdf-loading"><span>' + esc(t("modal.failed")) + '</span>' +
      '<a class="btn btn-primary btn-sm" href="' + esc(url) + '" download target="_blank" rel="noopener">' +
      esc(t("modal.download")) + "</a></div>";
  }

  function closePdf() {
    if (!modal) return;
    modal.hidden = true;
    if (pageObserver) { pageObserver.disconnect(); pageObserver = null; }
    if (pdfDoc) { try { pdfDoc.destroy(); } catch (e) {} pdfDoc = null; }
    $("#pdfPages").innerHTML = "";
    document.body.style.overflow = "";
  }

  // مؤشر التنقل يتبع القسم الظاهر أثناء التمرير (بدلاً من الثبات على «الرئيسية»)
  var SPY_IDS = ["top", "offers", "social", "branch"];
  function updateActiveNav() {
    var y = window.scrollY + 140;                 // خط القراءة أسفل الهيدر
    var current = "top";
    // نتخطّى "top" ونستخدم الموضع المطلق مع حارس (>200) حتى لا تُحسب الأقسام قبل تحميل المحتوى
    for (var i = 1; i < SPY_IDS.length; i++) {
      var el = document.getElementById(SPY_IDS[i]);
      if (!el) continue;
      var absTop = el.getBoundingClientRect().top + window.scrollY;
      if (absTop > 200 && absTop <= y) current = SPY_IDS[i];
    }
    // فعّل آخر قسم فقط عند بلوغ نهاية صفحة قابلة للتمرير فعلًا
    var doc = document.documentElement;
    if (doc.scrollHeight > window.innerHeight + 8 &&
        (window.innerHeight + window.scrollY) >= doc.scrollHeight - 4) {
      current = SPY_IDS[SPY_IDS.length - 1];
    }
    $$(".header-nav a").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
    });
  }

  /* --------------------------------- events -------------------------------- */
  function bind() {
    $("#langToggle").addEventListener("click", function () {
      setLang(lang === "ar" ? "en" : "ar");
    });

    // الهيدر + مؤشر القسم الحالي + زر الأعلى + بارالاكس العربة — كلها على حدث تمرير واحد
    var header = $("#header");
    var toTop = $("#toTop");
    var heroEmblem = $(".hero-emblem");
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle("scrolled", y > 24);
      if (toTop) toTop.classList.toggle("is-visible", y > 420);
      if (heroEmblem && !reduceMotion && y < 1000) heroEmblem.style.transform = "translateY(" + (y * 0.06).toFixed(1) + "px)";
      updateActiveNav();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveNav, { passive: true });
    window.addEventListener("load", updateActiveNav);
    onScroll();
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

    $$(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        $$(".chip").forEach(function (x) { x.classList.remove("is-active"); });
        c.classList.add("is-active");
        filter = c.dataset.filter;
        renderOffers();
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closePdf();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePdf(); });

  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
    applyStaticText();
    applySite();
    renderOffers();
  }

  /* ---------------------------------- boot --------------------------------- */
  function load(url) {
    return fetch(url + "?v=" + Date.now(), { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error(url + " " + r.status);
      return r.json();
    });
  }

  function init() {
    try {
      var q = (location.search.match(/[?&]lang=(ar|en)/) || [])[1];   // ?lang=en للمشاركة بلغة محددة
      var saved = q || localStorage.getItem("lang");                   // العربية هي الافتراضية
      if (saved === "ar" || saved === "en") lang = saved;
    } catch (e) {}

    applyStaticText();
    bind();

    // تشغيل دخول الهيرو بالتتابع (setTimeout مضمون التنفيذ عكس rAF في التبويبات المخفية)
    var revealHero = function () { var hc = $(".hero-card"); if (hc) hc.classList.add("ready"); };
    if (reduceMotion) revealHero(); else setTimeout(revealHero, 70);

    Promise.all([load("content/site.json"), load("content/offers.json")])
      .then(function (res) {
        site = res[0] || {};
        offers = (res[1] && res[1].offers) || [];
        mergeSiteTexts();      // نصوص لوحة التحكم تتغلّب على الافتراضي
        applyStaticText();     // إعادة تطبيق النصوص بعد الدمج
        applySite();
        renderOffers();
        updateActiveNav();     // إعادة الحساب بعد تحميل المحتوى (يمنع ثبات التحديد خطأً)
        setTimeout(updateActiveNav, 400);
      })
      .catch(function (err) {
        console.error(err);
        $("#offersGrid").innerHTML = "";
        $("#offersEmpty").hidden = false;
        $("#offersEmpty").querySelector("p").textContent = t("load.error");
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
