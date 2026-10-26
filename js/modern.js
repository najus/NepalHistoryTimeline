/* Nepal History Timeline — modern renderer (vanilla JS, no dependencies).
   Data still comes from content/*.js (window._content), unchanged format. */
(function () {
  'use strict';

  var MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var MONTHS_NP = ['जनवरी','फेब्रुअरी','मार्च','अप्रिल','मे','जुन','जुलाइ','अगस्ट','सेप्टेम्बर','अक्टोबर','नोभेम्बर','डिसेम्बर'];
  var BS_EN = ['Baisakh','Jestha','Ashadh','Shrawan','Bhadra','Ashwin','Kartik','Mangsir','Poush','Magh','Falgun','Chaitra'];
  var BS_NP = ['वैशाख','जेष्ठ','आषाढ','श्रावण','भदौ','आश्विन','कार्तिक','मंसिर','पौष','माघ','फाल्गुण','चैत्र'];
  var NP_DIGITS = '०१२३४५६७८९';

  function npNum(s) { return String(s).replace(/[0-9]/g, function (d) { return NP_DIGITS[+d]; }); }
  function text(v) { return Array.isArray(v) ? v.join('') : (v || ''); }

  var ERAS = [
    { id: 'unification', color: '#003893', years: '1743 – 1814', yearsNp: '१७४३ – १८१४',
      name: { en: 'Unification & Expansion', np: 'एकीकरण र विस्तार' },
      intro: { en: 'Prithvi Narayan Shah unifies the Himalayan kingdoms, and the new state pushes out to its greatest extent.',
               np: 'पृथ्वीनारायण शाहले हिमाली राज्यहरूलाई एकीकृत गरे, र नयाँ राज्य आफ्नो सबैभन्दा ठूलो विस्तारसम्म पुग्यो।' } },
    { id: 'rana', color: '#8c6a1f', years: '1846 – 1951', yearsNp: '१८४६ – १९५१',
      name: { en: 'The Rana Century', np: 'राणा काल' },
      intro: { en: 'A palace massacre puts one family in power for 104 years of hereditary rule.',
               np: 'दरबारको हत्याकाण्डले एउटै परिवारलाई १०४ वर्षे वंशानुगत शासनमा पुर्‍यायो।' } },
    { id: 'democracy', color: '#6d4c9f', years: '1951 – 2006', yearsNp: '१९५१ – २००६',
      name: { en: 'Democracy & Its Interruptions', np: 'लोकतन्त्र र यसका अवरोधहरू' },
      intro: { en: 'Democracy arrives, is taken away, and is fought back — while a civil war reshapes the country.',
               np: 'लोकतन्त्र आयो, खोसियो, र फेरि लडेर ल्याइयो — भने गृहयुद्धले देशलाई नै बदलिदियो।' } },
    { id: 'republic', color: '#c8102e', years: '2008 – Today', yearsNp: '२००८ – आजसम्म',
      name: { en: 'The Federal Republic', np: 'संघीय गणतन्त्र' },
      intro: { en: 'The monarchy ends, Nepal reinvents itself as a federal republic — and a new generation demands more.',
               np: 'राजतन्त्र सकियो, नेपालले संघीय गणतन्त्रका रूपमा आफूलाई पुनः आविष्कार गर्‍यो — र नयाँ पुस्ताले अझ बढी माग गर्‍यो।' } }
  ];
  function eraOf(year) {
    if (year <= 1814) return ERAS[0];
    if (year <= 1923) return ERAS[1];
    if (year <= 2006) return ERAS[2];
    return ERAS[3];
  }

  var UI = {
    en: { brand: 'Nepal History Timeline', overline: '1743 — Today · AD & Bikram Sambat',
      heroTitle: 'History of <em>Nepal</em>',
      lede: 'How a patchwork of Himalayan kingdoms became a federal republic — in 22 moments, from Prithvi Narayan Shah to the Gen Z protests.',
      statEvents: 'events', statYears: 'years', statEras: 'eras', searchLabel: 'Search events',
      searchPh: 'Search events…', all: 'All eras', readMore: 'Read more', readLess: 'Show less',
      refs: 'References', noResults: 'No events match your search.',
      footerText: 'A constantly evolving timeline of the history of Nepal. Photos: Wikimedia Commons (public domain / Creative Commons, credited on each image).',
      lbHint: '← → to browse · swipe on mobile · ▶ plays the whole story',
      toggleLabel: 'नेपाली' },
    np: { brand: 'नेपाल इतिहास टाइमलाइन', overline: 'सन् १७४३ — आजसम्म · ई.सं. र वि.सं.',
      heroTitle: 'नेपालको <em>इतिहास</em>',
      lede: 'हिमाली राज्यहरूको समूह कसरी संघीय गणतन्त्र बन्यो — पृथ्वीनारायण शाहदेखि जेन जी आन्दोलनसम्म, २२ पलमा।',
      statEvents: 'घटना', statYears: 'वर्ष', statEras: 'कालखण्ड', searchLabel: 'घटना खोज्नुहोस्',
      searchPh: 'घटना खोज्नुहोस्…', all: 'सबै कालखण्ड', readMore: 'थप पढ्नुहोस्', readLess: 'कम देखाउनुहोस्',
      refs: 'सन्दर्भ', noResults: 'तपाईंको खोजसँग कुनै घटना मिलेन।',
      footerText: 'नेपालको इतिहासको निरन्तर विकसित टाइमलाइन। तस्विरहरू: विकिमिडिया कमन्स (सार्वजनिक डोमेन / क्रिएटिभ कमन्स, प्रत्येक तस्विरमा श्रेय दिइएको)।',
      lbHint: '← → ले हेर्नुहोस् · मोबाइलमा स्वाइप गर्नुहोस् · ▶ ले पूरै कथा चलाउँछ',
      toggleLabel: 'English' }
  };

  function parseDate(e) {
    var m = /(\d{2})-(\d{2})-(\d{4})/.exec(e.date || '');
    if (!m) return { y: +e.year, mo: 1, d: 1 };
    return { mo: +m[1], d: +m[2], y: +m[3] };
  }
  function fmtAD(e, lang) {
    var p = parseDate(e), prec = e.date_precision || 'day';
    if (lang === 'np') {
      if (prec === 'year') return npNum(p.y);
      if (prec === 'month') return MONTHS_NP[p.mo - 1] + ' ' + npNum(p.y);
      return npNum(p.d) + ' ' + MONTHS_NP[p.mo - 1] + ' ' + npNum(p.y);
    }
    if (prec === 'year') return String(p.y);
    if (prec === 'month') return MONTHS_EN[p.mo - 1] + ' ' + p.y;
    return p.d + ' ' + MONTHS_EN[p.mo - 1] + ' ' + p.y;
  }
  function fmtBS(e, lang) {
    if (e.bs) {
      var parts = e.bs.split('-'), y = +parts[0], mo = +parts[1], d = +parts[2];
      if (lang === 'np') return 'वि.सं. ' + npNum(y) + ' ' + BS_NP[mo - 1] + ' ' + npNum(d);
      return d + ' ' + BS_EN[mo - 1] + ' ' + y + ' BS';
    }
    if (lang === 'np') return 'वि.सं. ' + npNum(e.bs_year || '');
    return (e.bs_year || '') + ' BS';
  }
  function listPhotos() {
    return allEvents().filter(function (e) { return !!imgPath(e); })
      .map(function (e) { return { event: e, src: imgPath(e), caption: caption(e) }; });
  }
  function stepIndex(i, dir, n) { return ((i + dir) % n + n) % n; }
  function imgPath(e) {
    if (!e.main_img) return '';
    var dir = e.image_dir || e.name.replace(/ /g, '').toLowerCase();
    return 'images/' + e.type + '/' + e.year + '/' + dir + '/' + e.main_img.name;
  }
  function caption(e) { return e.main_img ? (e.main_img.caption || e.name) : ''; }

  function allEvents() {
    var out = [];
    ['nepal_1700', 'nepal_1800', 'nepal_1900', 'nepal_2000'].forEach(function (k) {
      var block = (typeof _content !== 'undefined') && _content[k];
      if (block && block.games) out = out.concat(block.games);
    });
    out.sort(function (a, b) {
      var pa = parseDate(a), pb = parseDate(b);
      return (pa.y - pb.y) || (pa.mo - pb.mo) || (pa.d - pb.d);
    });
    return out;
  }
  function matches(e, q) {
    if (!q) return true;
    q = q.toLowerCase();
    return [e.name, e.headline, text(e.resume), e.name_np, e.headline_np, e.resume_np, String(e.year)]
      .join(' ').toLowerCase().indexOf(q) >= 0;
  }

  function buildEvent(e, lang, alt) {
    var era = eraOf(+e.year);
    var name = lang === 'np' && e.name_np ? e.name_np : e.name;
    var headline = lang === 'np' && e.headline_np ? e.headline_np : e.headline;
    var resume = lang === 'np' && e.resume_np ? e.resume_np : text(e.resume);
    var src = imgPath(e);
    var html = '<article class="event' + (alt ? ' alt' : '') + '" style="--era:' + era.color + '">';
    html += '<span class="dot" aria-hidden="true"></span><div class="card reveal">';
    html += '<span class="ghost" aria-hidden="true">' + (lang === 'np' ? npNum(e.year) : e.year) + '</span>';
    if (src) {
      html += '<figure class="photo"><img loading="lazy" src="' + src + '" alt="' + caption(e).replace(/"/g, '&quot;') + '" data-caption="' + caption(e).replace(/"/g, '&quot;') + '">';
      html += '<span class="expand" aria-hidden="true">⤢</span>';
      html += '<figcaption>' + caption(e) + '</figcaption></figure>';
    }
    html += '<div class="card-body">';
    html += '<p class="dates">' + fmtAD(e, lang) + ' <span class="bs">· ' + fmtBS(e, lang) + '</span></p>';
    html += '<h3>' + name + '</h3>';
    html += '<p class="headline">' + headline + '</p>';
    html += '<p class="resume clamped">' + resume + '</p>';
    html += '<button type="button" class="more">' + UI[lang].readMore + '</button>';
    if (e.references && e.references.length) {
      html += '<p class="refs">' + UI[lang].refs + ': ' + e.references.map(function (r) {
        return '<a href="' + r.url + '" target="_blank" rel="noopener">' + text(r.caption) + '</a>';
      }).join(' · ') + '</p>';
    }
    html += '</div></div></article>';
    return html;
  }

  function buildApp(lang, eraFilter, query) {
    var events = allEvents().filter(function (e) {
      return (eraFilter === 'all' || eraOf(+e.year).id === eraFilter) && matches(e, query || '');
    });
    var html = '', counts = {};
    ERAS.forEach(function (era) {
      var list = events.filter(function (e) { return eraOf(+e.year).id === era.id; });
      counts[era.id] = list.length;
      if (!list.length) return;
      html += '<section class="era" data-era="' + era.id + '"><div class="era-head">';
      html += '<span class="era-kicker" style="color:' + era.color + '">' + (lang === 'np' ? era.yearsNp : era.years) + '</span>';
      html += '<h2>' + era.name[lang] + '</h2><p>' + era.intro[lang] + '</p></div><div class="timeline">';
      list.forEach(function (e, i) { html += buildEvent(e, lang, i % 2 === 1); });
      html += '</div></section>';
    });
    return { html: html, shown: events.length, counts: counts };
  }

  function buildChips(lang, activeEra) {
    var html = '<button type="button" class="chip' + (activeEra === 'all' ? ' active' : '') + '" data-era="all">' + UI[lang].all + '</button>';
    ERAS.forEach(function (era) {
      html += '<button type="button" class="chip' + (activeEra === era.id ? ' active' : '') + '" data-era="' + era.id + '">' +
        '<span class="cdot" style="background:' + era.color + '"></span>' + era.name[lang] + '</button>';
    });
    return html;
  }

  var TL = { buildApp: buildApp, buildEvent: buildEvent, buildChips: buildChips, fmtAD: fmtAD, fmtBS: fmtBS, allEvents: allEvents, listPhotos: listPhotos, stepIndex: stepIndex, ERAS: ERAS, UI: UI, npNum: npNum };
  if (typeof window !== 'undefined') window.TL = TL;

  /* ------- Browser wiring (skipped under test harnesses) ------- */
  if (typeof document === 'undefined' || !document.getElementById) return;

  var state = { lang: 'en', era: 'all', query: '' };
  try { state.lang = localStorage.getItem('nht-lang') || 'en'; } catch (err) {}
  if (state.lang !== 'np') state.lang = 'en';

  var app = document.getElementById('app');
  var chipsEl = document.getElementById('eraChips');
  var searchEl = document.getElementById('searchBox');
  var noRes = document.getElementById('noResults');
  var observer = null;

  function observeCards() {
    var cards = document.querySelectorAll('.card.reveal');
    if (typeof IntersectionObserver === 'undefined') {
      cards.forEach(function (c) { c.classList.add('in'); });
      return;
    }
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); observer.unobserve(en.target); } });
    }, { threshold: 0.08 });
    cards.forEach(function (c) { observer.observe(c); });
  }

  function applyStatic() {
    var dict = UI[state.lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    document.getElementById('heroTitle').innerHTML = dict.heroTitle;
    searchEl.setAttribute('placeholder', dict.searchPh);
    document.getElementById('langToggle').textContent = dict.toggleLabel;
    noRes.textContent = dict.noResults;
    document.body.classList.toggle('np', state.lang === 'np');
    document.documentElement.lang = state.lang === 'np' ? 'ne' : 'en';
  }

  function render() {
    var out = buildApp(state.lang, state.era, state.query);
    app.innerHTML = out.html;
    noRes.hidden = out.shown > 0;
    chipsEl.innerHTML = buildChips(state.lang, state.era);
    applyStatic();
    document.querySelectorAll('.resume.clamped').forEach(function (r) {
      if (r.scrollHeight <= r.clientHeight + 2) {
        r.classList.remove('clamped');
        var b = r.parentElement.querySelector('.more');
        if (b) b.style.display = 'none';
      }
    });
    observeCards();
    if (typeof lbEl !== 'undefined' && lbEl && !lbEl.hidden) { buildStrip(); showSlide(); }
  }

  document.getElementById('langToggle').addEventListener('click', function () {
    state.lang = state.lang === 'np' ? 'en' : 'np';
    try { localStorage.setItem('nht-lang', state.lang); } catch (err) {}
    render();
  });
  chipsEl.addEventListener('click', function (ev) {
    var btn = ev.target.closest('.chip');
    if (!btn) return;
    state.era = btn.getAttribute('data-era');
    render();
  });
  searchEl.addEventListener('input', function () { state.query = searchEl.value.trim(); render(); });

  document.addEventListener('click', function (ev) {
    var more = ev.target.closest('.more');
    if (more) {
      var r = more.parentElement.querySelector('.resume');
      var open = r.classList.toggle('clamped');
      more.textContent = open ? UI[state.lang].readMore : UI[state.lang].readLess;
      return;
    }
    var img = ev.target.closest('.photo img');
    if (img) openLb(PHOTOS.findIndex(function (p) { return img.getAttribute('src') === p.src; }));
  });

  /* ------- Cinematic photo viewer (story mode) ------- */
  var PHOTOS = listPhotos();
  var lb = { i: 0, playing: false, timer: null, built: false };
  var lbEl = document.getElementById('lightbox');
  var SLIDE_MS = 6500;

  function excerpt(e, lang) {
    var head = lang === 'np' && e.headline_np ? e.headline_np : e.headline;
    var body = lang === 'np' && e.resume_np ? e.resume_np : text(e.resume);
    var s = head + ' — ' + body;
    return s.length > 220 ? s.slice(0, 217).trim() + '…' : s;
  }
  function buildStrip() {
    var strip = document.getElementById('lbStrip');
    strip.innerHTML = PHOTOS.map(function (p, i) {
      return '<button type="button" class="thumb" data-i="' + i + '" aria-label="' + p.event.year + '"><img loading="lazy" src="' + p.src + '" alt=""></button>';
    }).join('');
    document.getElementById('lbProgress').innerHTML = PHOTOS.map(function () {
      return '<span class="seg"><span class="fill"></span></span>';
    }).join('');
    lb.built = true;
  }
  function showSlide() {
    var p = PHOTOS[lb.i], e = p.event, era = eraOf(+e.year);
    var img = document.getElementById('lbImg');
    img.src = p.src;
    img.alt = p.caption;
    img.classList.remove('kb'); void img.offsetWidth; img.classList.add('kb');
    var eraEl = document.getElementById('lbEra');
    eraEl.textContent = era.name[state.lang] + ' · ' + (state.lang === 'np' ? era.yearsNp : era.years);
    eraEl.style.background = era.color;
    document.getElementById('lbTitle').textContent = (state.lang === 'np' && e.name_np ? e.name_np : e.name);
    document.getElementById('lbDates').textContent = fmtAD(e, state.lang) + ' · ' + fmtBS(e, state.lang);
    document.getElementById('lbText').textContent = excerpt(e, state.lang);
    document.getElementById('lbCap').textContent = p.caption;
    document.getElementById('lbCounter').textContent =
      (state.lang === 'np' ? npNum(lb.i + 1) + ' / ' + npNum(PHOTOS.length) : (lb.i + 1) + ' / ' + PHOTOS.length);
    document.querySelectorAll('#lbStrip .thumb').forEach(function (t, i) {
      t.classList.toggle('active', i === lb.i);
      if (i === lb.i && t.scrollIntoView) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
    document.querySelectorAll('#lbProgress .seg').forEach(function (seg, i) {
      var fill = seg.firstElementChild;
      fill.className = 'fill' + (i < lb.i ? ' done' : '');
      if (i === lb.i && lb.playing) { fill.classList.remove('run'); void fill.offsetWidth; fill.classList.add('run'); }
    });
    document.getElementById('lbPlay').textContent = lb.playing ? '❚❚' : '▶';
  }
  function scheduleNext() {
    clearTimeout(lb.timer);
    if (!lb.playing) return;
    lb.timer = setTimeout(function () { lb.i = stepIndex(lb.i, 1, PHOTOS.length); showSlide(); scheduleNext(); }, SLIDE_MS);
  }
  function setPlaying(on) {
    lb.playing = on;
    lbEl.classList.toggle('playing', on);
    showSlide();
    scheduleNext();
  }
  function go(dir) { lb.i = stepIndex(lb.i, dir, PHOTOS.length); showSlide(); if (lb.playing) scheduleNext(); }
  function openLb(i) {
    if (i < 0) i = 0;
    lb.i = i;
    if (!lb.built) buildStrip();
    lbEl.hidden = false;
    document.body.style.overflow = 'hidden';
    showSlide();
  }
  function closeLb() {
    lbEl.hidden = true;
    document.body.style.overflow = '';
    setPlaying(false);
  }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function () { go(-1); });
  document.getElementById('lbNext').addEventListener('click', function () { go(1); });
  document.getElementById('lbPlay').addEventListener('click', function () { setPlaying(!lb.playing); });
  document.getElementById('lbStrip').addEventListener('click', function (ev) {
    var t = ev.target.closest('.thumb');
    if (!t) return;
    lb.i = +t.getAttribute('data-i');
    showSlide();
    if (lb.playing) scheduleNext();
  });
  lbEl.addEventListener('click', function (ev) { if (ev.target === lbEl) closeLb(); });
  document.addEventListener('keydown', function (ev) {
    if (lbEl.hidden) return;
    if (ev.key === 'Escape') closeLb();
    if (ev.key === 'ArrowRight') go(1);
    if (ev.key === 'ArrowLeft') go(-1);
    if (ev.key === ' ') { ev.preventDefault(); setPlaying(!lb.playing); }
  });
  var touchX = null;
  lbEl.addEventListener('touchstart', function (ev) { touchX = ev.changedTouches[0].clientX; }, { passive: true });
  lbEl.addEventListener('touchend', function (ev) {
    if (touchX === null) return;
    var dx = ev.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 42) go(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });
  // Hold to pause while playing
  lbEl.addEventListener('pointerdown', function (ev) {
    if (ev.target.closest('button') || !lb.playing) return;
    clearTimeout(lb.timer);
  });
  lbEl.addEventListener('pointerup', function () { if (lb.playing) scheduleNext(); });

  var progress = document.getElementById('progress'), toTop = document.getElementById('toTop');
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    toTop.classList.toggle('show', h.scrollTop > 700);
  }, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  render();
})();
