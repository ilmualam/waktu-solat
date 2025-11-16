/* IlmuAlam Waktu Solat v3 PRO
 * - Vanilla JS, lightweight
 * - JAKIM e-Solat + fallback Aladhan
 * - Auto-lokasi, Qiblat, Masjid terdekat
 * - PDF Hari Ini + Bulanan (dengan link clickable)
 * - LocalStorage cache (kurang hit API)
 */

(function(){
  'use strict';

  // =======================
  // 1. KONFIG & STATE
  // =======================
  const CONFIG = {
    STORAGE_KEY: 'ws_v3_last_zone',
    CACHE_KEY_PREFIX: 'ws_v3_cache_',        // ws_v3_cache_SGR01_2025_11
    CACHE_TTL: 6 * 60 * 60 * 1000,           // 6 jam
    JAKIM_API_BASE:
      'https://www.e-solat.gov.my/index.php?r=esolatApi/TakwimSolat&period=month&zone=',
    ALADHAN_API_BASE: 'https://api.aladhan.com/v1',
    OVERPASS_API: 'https://overpass-api.de/api/interpreter',
    MOSQUE_RADIUS: 5000,
    APP_URL: 'https://www.ilmualam.com/p/waktu-solat-malaysia.html'
  };

  // 👉 Sila paste balik array bulan Hijri jika kau guna (optional ringan)
  const HIJRI_MONTHS = [
    'Muharram','Safar','Rabi\'ul Awal','Rabi\'ul Akhir',
    'Jamadil Awal','Jamadil Akhir','Rejab','Syaaban',
    'Ramadan','Syawal','Zulkaedah','Zulhijjah'
  ];

  // 👉 PASTE mapping JAKIM ZONES & STATE_NAMES dari file lama di sini:
  // ==========================================================
  // TODO: PASTE JAKIM_ZONES & STATE_NAMES DI SINI (COPY FROM ws.source.js lama)
  // ==========================================================

  // Fallback simple kalau lupa paste (supaya tak crash)
  if(typeof JAKIM_ZONES === 'undefined'){
    window.JAKIM_ZONES = {
      selangor: [
        {code:'SGR01',name:'Gombak, H.Selangor, Rawang',coords:{lat:3.2190,lng:101.7258}}
      ]
    };
  }
  if(typeof STATE_NAMES === 'undefined'){
    window.STATE_NAMES = { selangor:'Selangor' };
  }

  // State runtime
  const state = {
    currentStateKey: 'selangor',
    currentZoneCode: 'SGR01',
    currentZoneName: 'Gombak, H.Selangor, Rawang',
    todayHijri: '',
    todayMonthlyData: null,   // month data utk bulan semasa (today tab + bulanan default)
    cache: {}                 // cache in-memory (selain localStorage)
  };

  // =======================
  // 2. HELPER KECIL
  // =======================
  function $(sel){ return document.querySelector(sel); }
  function $all(sel){ return document.querySelectorAll(sel); }

  function timeToMinutes(str){
    const parts = str.split(':');
    const h = parseInt(parts[0],10) || 0;
    const m = parseInt(parts[1],10) || 0;
    return h*60+m;
  }

  function pad2(n){ return n<10 ? '0'+n : ''+n; }

  function todayYMD(){
    const d = new Date();
    return {
      y: d.getFullYear(),
      m: d.getMonth()+1,
      d: d.getDate(),
      weekday: d.getDay()
    };
  }

  function cacheKey(zone, year, month){
    return CONFIG.CACHE_KEY_PREFIX + zone + '_' + year + '_' + pad2(month);
  }

  function readCache(zone, year, month){
    const key = cacheKey(zone, year, month);
    try{
      const raw = localStorage.getItem(key);
      if(!raw) return null;
      const obj = JSON.parse(raw);
      if(!obj || !obj.ts || !obj.data) return null;
      if(Date.now() - obj.ts > CONFIG.CACHE_TTL){
        localStorage.removeItem(key);
        return null;
      }
      return obj.data;
    }catch(e){
      return null;
    }
  }

  function writeCache(zone, year, month, data){
    const key = cacheKey(zone, year, month);
    try{
      localStorage.setItem(key, JSON.stringify({
        ts: Date.now(),
        data: data
      }));
    }catch(e){}
  }

  function saveLastZone(){
    try{
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
        state: state.currentStateKey,
        code: state.currentZoneCode,
        name: state.currentZoneName
      }));
    }catch(e){}
  }

  function loadLastZone(){
    try{
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if(!raw) return;
      const obj = JSON.parse(raw);
      if(!obj) return;
      if(obj.state && JAKIM_ZONES[obj.state]){
        state.currentStateKey = obj.state;
      }
      if(obj.code){ state.currentZoneCode = obj.code; }
      if(obj.name){ state.currentZoneName = obj.name; }
    }catch(e){}
  }

  // =======================
  // 3. API CALLS
  // =======================

  async function fetchJakimMonth(zoneCode, year, month){
    const url = CONFIG.JAKIM_API_BASE + encodeURIComponent(zoneCode) +
                '&month=' + pad2(month) + '&year=' + year;
    const res = await fetch(url);
    if(!res.ok) throw new Error('JAKIM HTTP ' + res.status);
    const data = await res.json();
    if(!data || !Array.isArray(data.prayerTime) || !data.prayerTime.length){
      throw new Error('JAKIM kosong');
    }
    return data.prayerTime;
  }

  async function fetchAladhanMonth(coords, year, month){
    const url = CONFIG.ALADHAN_API_BASE +
      '/calendar/' + year + '/' + month +
      '?latitude=' + coords.lat +
      '&longitude=' + coords.lng +
      '&method=3';
    const res = await fetch(url);
    const json = await res.json();
    if(json.code !== 200 || !Array.isArray(json.data)){
      throw new Error('Aladhan error');
    }
    // Convert ke format mirip JAKIM
    return json.data.map(function(d){
      return {
        date: d.date.gregorian.day + '-' +
              d.date.gregorian.month.en + '-' +
              d.date.gregorian.year,
        imsak: d.timings.Imsak.split(' ')[0],
        fajr: d.timings.Fajr.split(' ')[0],
        syuruk: d.timings.Sunrise.split(' ')[0],
        dhuhr: d.timings.Dhuhr.split(' ')[0],
        asr: d.timings.Asr.split(' ')[0],
        maghrib: d.timings.Maghrib.split(' ')[0],
        isha: d.timings.Isha.split(' ')[0],
        _hijri: d.date.hijri   // simpan sekali
      };
    });
  }

  async function getMonthlyData(zoneCode, year, month){
    // 1) cuba cache
    const cached = readCache(zoneCode, year, month);
    if(cached) return cached;

    // 2) cuba JAKIM dulu
    let data = null;
    try{
      data = await fetchJakimMonth(zoneCode, year, month);
    }catch(e){
      console.warn('JAKIM gagal, fallback Aladhan:', e);
    }

    // 3) fallback Aladhan jika perlu
    if(!data){
      const zone = findZoneByCode(zoneCode);
      const coords = (zone && zone.coords) ?
                       zone.coords :
                       {lat:3.1390,lng:101.6869}; // KL
      data = await fetchAladhanMonth(coords, year, month);
    }

    writeCache(zoneCode, year, month, data);
    return data;
  }

  async function updateHijriTodayFromAladhan(){
    try{
      const t = todayYMD();
      const dateStr = t.d + '-' + t.m + '-' + t.y;
      const url = CONFIG.ALADHAN_API_BASE + '/gToH/' + dateStr;
      const res = await fetch(url);
      const json = await res.json();
      if(json.code === 200 && json.data && json.data.hijri){
        const h = json.data.hijri;
        const mIndex = parseInt(h.month.number,10)-1;
        const monthName = HIJRI_MONTHS[mIndex] || h.month.en;
        state.todayHijri = h.day + ' ' + monthName + ' ' + h.year + ' H';
      }
    }catch(e){
      state.todayHijri = '';
    }
  }

  // =======================
  // 4. ZON & GEO
  // =======================

  function findZoneByCode(code){
    for(const s in JAKIM_ZONES){
      const arr = JAKIM_ZONES[s];
      const found = arr.find(z=>z.code===code);
      if(found){
        return { stateKey:s, code:found.code, name:found.name, coords:found.coords };
      }
    }
    return null;
  }

  function populateStateSelect(){
    const stateSel = $('#ws-state-select');
    if(!stateSel) return;
    stateSel.innerHTML = '<option value="">Pilih Negeri...</option>';
    Object.keys(JAKIM_ZONES).sort().forEach(function(key){
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = STATE_NAMES[key] || key;
      stateSel.appendChild(opt);
    });
    stateSel.value = state.currentStateKey;
  }

  function populateZoneSelect(stateKey){
    const zoneSel = $('#ws-zone-select');
    if(!zoneSel) return;
    zoneSel.innerHTML = '<option value="">Pilih Zon...</option>';
    const zones = JAKIM_ZONES[stateKey] || [];
    zones.forEach(function(z){
      const opt = document.createElement('option');
      opt.value = z.code;
      opt.textContent = z.name;
      zoneSel.appendChild(opt);
    });
    // set value current jika wujud
    if(zones.find(z=>z.code===state.currentZoneCode)){
      zoneSel.value = state.currentZoneCode;
    }
  }

  function detectLocation(){
    const btn = $('#ws-detect-btn');
    if(!navigator.geolocation){
      alert('Geolocation tidak disokong pelayar anda.');
      return;
    }
    if(btn){
      btn.disabled = true;
      btn.textContent = '🔄 Mengesan...';
    }
    navigator.geolocation.getCurrentPosition(
      function(pos){
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // cari zon terdekat
        let nearest = null;
        let minDist = Infinity;
        for(const sk in JAKIM_ZONES){
          JAKIM_ZONES[sk].forEach(function(z){
            if(!z.coords) return;
            const d = haversine(lat,lng,z.coords.lat,z.coords.lng);
            if(d < minDist){
              minDist = d;
              nearest = { stateKey:sk, code:z.code, name:z.name };
            }
          });
        }
        if(nearest){
          state.currentStateKey = nearest.stateKey;
          state.currentZoneCode = nearest.code;
          state.currentZoneName = nearest.name;
          saveLastZone();
          populateStateSelect();
          populateZoneSelect(state.currentStateKey);
          $('#ws-state-select').value = state.currentStateKey;
          $('#ws-zone-select').value = state.currentZoneCode;
          loadTodayAndMonthly();
          if(btn){
            btn.textContent = '✅ Lokasi Dikesan';
            setTimeout(function(){
              btn.textContent = '📍 Auto-Detect Lokasi';
              btn.disabled = false;
            },1500);
          }
        }
      },
      function(err){
        console.error('Geo error', err);
        alert('Gagal mengesan lokasi. Sila aktifkan GPS atau pilih zon manual.');
        if(btn){
          btn.disabled = false;
          btn.textContent = '📍 Auto-Detect Lokasi';
        }
      }
    );
  }

  function haversine(lat1,lon1,lat2,lon2){
    const R = 6371;
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLon = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
      Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
      Math.sin(dLon/2)*Math.sin(dLon/2);
    const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c;
  }

  // =======================
  // 5. DISPLAY HARI INI
  // =======================

  let countdownInterval = null;

  function displayToday(){
    const container = $('#ws-main-content');
    if(!container || !state.todayMonthlyData) return;

    const tinfo = todayYMD();
    // cuba cari row hari ini
    let todayRow = null;
    state.todayMonthlyData.forEach(function(d){
      // JAKIM biasanya 01-Nov-2025 -> parseInt = 1
      const dayNum = parseInt(d.date,10);
      if(dayNum === tinfo.d && !todayRow){
        todayRow = d;
      }
    });
    if(!todayRow){
      todayRow = state.todayMonthlyData[0];
    }

    const times = [
      {name:'Imsak',   time:todayRow.imsak},
      {name:'Subuh',   time:todayRow.fajr},
      {name:'Syuruk',  time:todayRow.syuruk},
      {name:'Zohor',   time:todayRow.dhuhr},
      {name:'Asar',    time:todayRow.asr},
      {name:'Maghrib', time:todayRow.maghrib},
      {name:'Isyak',   time:todayRow.isha}
    ];

    const nowMinutes = timeToMinutes(pad2(new Date().getHours())+':'+pad2(new Date().getMinutes()));
    let nextIndex = 0;
    for(let i=0;i<times.length;i++){
      if(nowMinutes < timeToMinutes(times[i].time)){
        nextIndex = i;
        break;
      }
      if(i===times.length-1){ nextIndex = 0; }
    }

    const weekdays = ['Ahad','Isnin','Selasa','Rabu','Khamis','Jumaat','Sabtu'];
    const months = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember'];
    const gDateStr = weekdays[tinfo.weekday]+', '+tinfo.d+' '+months[tinfo.m-1]+' '+tinfo.y;
    const hijriStr = state.todayHijri || 'Tarikh Hijrah dimuatkan...';

    let html = '';
    html += '<div class="ws-tool__date">';
    html +=   '<div class="ws-tool__date-hijri">'+hijriStr+'</div>';
    html +=   '<div class="ws-tool__date-gregorian">'+gDateStr+'</div>';
    html += '</div>';
    html += '<div class="ws-tool__location">📌 '+state.currentZoneName+' ('+state.currentZoneCode+')</div>';
    html += '<div class="ws-tool__times">';
    times.forEach(function(p,idx){
      html += '<div class="ws-tool__time-card'+(idx===nextIndex?' ws-tool__time-card--next':'')+'">';
      html +=   '<div class="ws-tool__time-label">'+p.name+'</div>';
      html +=   '<div class="ws-tool__time-value">'+p.time+'</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="ws-tool__countdown">';
    html +=   '<div class="ws-tool__countdown-label">Waktu Solat Seterusnya: '+times[nextIndex].name+'</div>';
    html +=   '<div class="ws-tool__countdown-time" id="ws-countdown-display">Mengira...</div>';
    html += '</div>';

    container.innerHTML = html;

    startCountdown(times[nextIndex].time);
  }

  function startCountdown(nextTime){
    if(countdownInterval){ clearInterval(countdownInterval); }
    const el = $('#ws-countdown-display');
    if(!el) return;

    function tick(){
      const now = new Date();
      const parts = nextTime.split(':');
      const h = parseInt(parts[0],10);
      const m = parseInt(parts[1],10);
      let target = new Date();
      target.setHours(h,m,0,0);
      if(target < now){ target.setDate(target.getDate()+1); }
      const diff = target - now;
      if(diff <= 0){
        el.textContent = '00:00:00';
        return;
      }
      const hh = Math.floor(diff/3.6e6);
      const mm = Math.floor((diff%3.6e6)/6e4);
      const ss = Math.floor((diff%6e4)/1e3);
      el.textContent = pad2(hh)+':'+pad2(mm)+':'+pad2(ss);
    }

    tick();
    countdownInterval = setInterval(tick,1000);
  }

  // =======================
  // 6. DISPLAY BULANAN
  // =======================

  function displayMonthly(){
    const wrap = $('#ws-monthly-content');
    if(!wrap){
      return;
    }
    if(!state.todayMonthlyData || !state.todayMonthlyData.length){
      wrap.innerHTML = '<p style="text-align:center;color:#666;">Data bulanan tidak tersedia.</p>';
      return;
    }
    let html = '';
    html += '<table class="ws-tool__table">';
    html += '<thead><tr>';
    html += '<th>Tarikh</th>';
    html += '<th>Imsak</th>';
    html += '<th>Subuh</th>';
    html += '<th>Syuruk</th>';
    html += '<th>Zohor</th>';
    html += '<th>Asar</th>';
    html += '<th>Maghrib</th>';
    html += '<th>Isyak</th>';
    html += '</tr></thead>';
    html += '<tbody>';
    state.todayMonthlyData.forEach(function(d){
      html += '<tr>';
      html += '<td>'+d.date+'</td>';
      html += '<td>'+d.imsak+'</td>';
      html += '<td>'+d.fajr+'</td>';
      html += '<td>'+d.syuruk+'</td>';
      html += '<td>'+d.dhuhr+'</td>';
      html += '<td>'+d.asr+'</td>';
      html += '<td>'+d.maghrib+'</td>';
      html += '<td>'+d.isha+'</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html;
  }

  // =======================
  // 7. QIBLAT & MASJID
  // =======================

  function handleQibla(){
    if(!navigator.geolocation){
      alert('Geolocation tidak disokong.');
      return;
    }
    const btn = $('#ws-qibla-btn');
    if(btn){ btn.disabled=true; btn.textContent='🔄 Mengira...'; }
    navigator.geolocation.getCurrentPosition(function(pos){
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const kaaLat = 21.4225;
      const kaaLng = 39.8262;

      const dLng = (kaaLng-lng)*Math.PI/180;
      const lat1 = lat*Math.PI/180;
      const lat2 = kaaLat*Math.PI/180;
      const y = Math.sin(dLng)*Math.cos(lat2);
      const x = Math.cos(lat1)*Math.sin(lat2) -
                Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLng);
      const bearing = Math.atan2(y,x)*180/Math.PI;
      const qibla = (bearing+360)%360;

      alert(
        '🧭 Arah Kiblat dari lokasi anda:\n\n' +
        qibla.toFixed(1)+'° dari Utara.\n\n' +
        'Tips: Buka kompas telefon, pusing sehingga bacaan hampir '+qibla.toFixed(1)+'°.'
      );

      if(btn){
        btn.disabled=false;
        btn.textContent='🧭 Arah Kiblat';
      }
    },function(err){
      alert('Gagal mendapatkan lokasi. Sila aktifkan GPS.');
      if(btn){
        btn.disabled=false;
        btn.textContent='🧭 Arah Kiblat';
      }
    });
  }

  function handleFindMosques(){
    if(!navigator.geolocation){
      alert('Geolocation tidak disokong. Sila aktifkan lokasi.');
      return;
    }
    const btn = $('#ws-find-mosques-btn');
    const wrap = $('#ws-mosque-results');
    if(btn){
      btn.disabled=true;
      btn.textContent='🔄 Mencari...';
    }
    if(wrap){
      wrap.innerHTML =
        '<div class="ws-tool__loading">'+
          '<div class="ws-tool__spinner"></div>'+
          '<p>Mencari masjid dan surau terdekat...</p>'+
        '</div>';
    }
    navigator.geolocation.getCurrentPosition(async function(pos){
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      try{
        const query =
          '[out:json][timeout:25];('+
          'node["amenity"="place_of_worship"]["religion"="muslim"](around:'+CONFIG.MOSQUE_RADIUS+','+lat+','+lng+');'+
          'way["amenity"="place_of_worship"]["religion"="muslim"](around:'+CONFIG.MOSQUE_RADIUS+','+lat+','+lng+');'+
          ');out center;';
        const res = await fetch(CONFIG.OVERPASS_API+'?data='+encodeURIComponent(query));
        const data = await res.json();
        renderMosques(data.elements || [], lat, lng);
      }catch(e){
        console.error('Mosque error', e);
        if(wrap){
          wrap.innerHTML =
            '<div class="ws-tool__error">'+
              '<p><strong>⚠️ Ralat Carian</strong></p>'+
              '<p>Gagal mencari masjid. Cuba gunakan Google Maps:</p>'+
              '<p style="margin-top:15px;">'+
                '<a class="ws-tool__mosque-btn" target="_blank" rel="noopener" '+
                  'href="https://www.google.com/maps/search/masjid/@'+lat+','+lng+',15z">🗺️ Buka Google Maps</a>'+
              '</p>'+
            '</div>';
        }
      }
      if(btn){
        btn.disabled=false;
        btn.textContent='🔎 Cari Masjid Terdekat (Radius 5km)';
      }
    },function(err){
      console.error('Geo error', err);
      if(wrap){
        wrap.innerHTML =
          '<div class="ws-tool__error">'+
            '<p><strong>⚠️ Lokasi Tidak Dijumpai</strong></p>'+
            '<p>Gagal mendapatkan lokasi anda. Sila aktifkan GPS dan cuba lagi.</p>'+
          '</div>';
      }
      if(btn){
        btn.disabled=false;
        btn.textContent='🔎 Cari Masjid Terdekat (Radius 5km)';
      }
    });
  }

  function renderMosques(items, userLat, userLng){
    const wrap = $('#ws-mosque-results');
    if(!wrap) return;
    if(!items.length){
      wrap.innerHTML =
        '<div class="ws-tool__error">'+
          '<p><strong>🕌 Tiada masjid/surau dijumpai</strong></p>'+
          '<p>Tiada masjid atau surau dijumpai dalam radius 5km.</p>'+
        '</div>';
      return;
    }
    const list = items.map(function(m){
      const lat = m.lat || (m.center && m.center.lat);
      const lng = m.lon || (m.center && m.center.lon);
      if(!lat || !lng) return null;
      const dist = haversine(userLat,userLng,lat,lng);
      return {
        name: (m.tags && (m.tags['name:ms'] || m.tags['name'] || m.tags['name:en'])) || 'Masjid/Surau',
        lat: lat, lng: lng,
        distance: dist,
        addr: (m.tags && (m.tags['addr:full'] || m.tags['addr:street'])) || ''
      };
    }).filter(Boolean).sort((a,b)=>a.distance-b.distance).slice(0,10);

    let html = '';
    html += '<div class="ws-tool__success">';
    html += '<p><strong>✅ Dijumpai '+list.length+' masjid/surau terdekat</strong></p>';
    html += '</div>';
    html += '<div class="ws-tool__mosque-list">';
    list.forEach(function(m,i){
      html += '<div class="ws-tool__mosque-item">';
      html +=   '<div class="ws-tool__mosque-info">';
      html +=     '<div class="ws-tool__mosque-name">'+(i+1)+'. '+m.name+'</div>';
      html +=     '<div class="ws-tool__mosque-distance">📍 '+m.distance.toFixed(2)+' km dari anda</div>';
      if(m.addr){
        html +=   '<div class="ws-tool__mosque-address">'+m.addr+'</div>';
      }
      html +=   '</div>';
      html +=   '<a class="ws-tool__mosque-btn" target="_blank" rel="noopener" '+
                  'href="https://www.google.com/maps/dir/?api=1&origin='+userLat+','+userLng+
                  '&destination='+m.lat+','+m.lng+'">🗺️ Arah</a>';
      html += '</div>';
    });
    html += '</div>';
    wrap.innerHTML = html;
  }

  // =======================
  // 8. SHARE & PDF
  // =======================

  function getZoneText(){
    const loc = $('.ws-tool__location');
    return loc ? loc.textContent.replace(/^📌\s*/,'').trim() : '';
  }

  function getDateTexts(){
    return {
      h: ( $('.ws-tool__date-hijri') || {} ).textContent || '',
      g: ( $('.ws-tool__date-gregorian') || {} ).textContent || ''
    };
  }

  function handleShare(){
    if(!state.todayMonthlyData){ return; }
    const zone = getZoneText() || state.currentZoneName+' ('+state.currentZoneCode+')';

    const todayRow = state.todayMonthlyData[0]; // cukup simple
    const text =
      '🕌 Waktu Solat Hari Ini - '+zone+'\n\n'+
      'Imsak: '+todayRow.imsak+'\n'+
      'Subuh: '+todayRow.fajr+'\n'+
      'Syuruk: '+todayRow.syuruk+'\n'+
      'Zohor: '+todayRow.dhuhr+'\n'+
      'Asar: '+todayRow.asr+'\n'+
      'Maghrib: '+todayRow.maghrib+'\n'+
      'Isyak: '+todayRow.isha+'\n\n'+
      'Rujuk penuh & jadual bulanan di: '+CONFIG.APP_URL;

    if(navigator.share){
      navigator.share({
        title: 'Waktu Solat Malaysia - IlmuAlam',
        text: text,
        url: CONFIG.APP_URL
      }).catch(function(){});
    }else if(navigator.clipboard){
      navigator.clipboard.writeText(text).then(function(){
        alert('✅ Waktu solat disalin ke clipboard. Boleh paste di WhatsApp / Telegram.');
      }).catch(function(){
        alert('❌ Gagal menyalin teks.');
      });
    }else{
      alert(text);
    }
  }

  function pdfToday(){
    const cards = $all('#ws-main-content .ws-tool__time-card');
    if(!cards.length){
      alert('Data belum dimuat. Tunggu sekejap di tab "Waktu Solat Hari Ini".');
      return;
    }
    const rows = [];
    cards.forEach(function(c){
      const l = c.querySelector('.ws-tool__time-label');
      const v = c.querySelector('.ws-tool__time-value');
      if(l && v){
        rows.push({name:l.textContent.trim(), time:v.textContent.trim()});
      }
    });
    if(!rows.length){
      alert('Gagal baca jadual. Cuba reload page.');
      return;
    }
    const zoneText = getZoneText() || state.currentZoneName+' ('+state.currentZoneCode+')';
    const dt = getDateTexts();

    let rowsHtml = '';
    rows.forEach(function(r){
      rowsHtml += '<tr><td>'+r.name+'</td><td>'+r.time+'</td></tr>';
    });

    const title = 'Jadual Waktu Solat Hari Ini - '+zoneText;
    const html =
      '<!DOCTYPE html><html lang="ms"><head>'+
      '<meta charset="utf-8">'+
      '<title>'+title+'</title>'+
      '<style>'+
      'body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;margin:20px;color:#111;}'+
      'h1{font-size:20px;margin-bottom:4px;}'+
      '.meta{margin-bottom:14px;font-size:13px;}'+
      'table{width:100%;border-collapse:collapse;font-size:14px;}'+
      'th,td{border:1px solid #ddd;padding:6px 8px;text-align:center;}'+
      'th{background:#249749;color:#fff;}'+
      'a{color:#1565c0;text-decoration:none;}'+
      'a:hover{text-decoration:underline;}'+
      '.footer{margin-top:16px;font-size:11px;color:#555;}'+
      '@media print{body{margin:10mm;}}'+
      '</style></head><body>'+
      '<h1>'+title+'</h1>'+
      '<div class="meta">'+
        (dt.g ? '<div><strong>Tarikh (Masihi):</strong> '+dt.g+'</div>' : '')+
        (dt.h ? '<div><strong>Tarikh (Hijri):</strong> '+dt.h+'</div>' : '')+
        '<div><strong>Zon:</strong> '+zoneText+'</div>'+
      '</div>'+
      '<table><thead><tr><th>Waktu</th><th>Jam</th></tr></thead>'+
      '<tbody>'+rowsHtml+'</tbody></table>'+
      '<div class="footer">'+
        'Sumber: data rasmi JAKIM / fallback Aladhan.'+
        '<br>Jana oleh <a href="'+CONFIG.APP_URL+'" target="_blank">IlmuAlam.com · Waktu Solat Malaysia</a>.'+
      '</div>'+
      '<script>window.onload=function(){window.focus();window.print();};</'+'script>'+
      '</body></html>';

    const w = window.open('', '_blank');
    if(!w){ alert('Pop-up disekat. Sila benarkan pop-up untuk cetak.'); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  function pdfMonthly(){
    const table = $('#ws-monthly-content table.ws-tool__table');
    if(!table){
      alert('Sila buka tab "Jadual Bulanan" dulu supaya data dimuat.');
      return;
    }
    const zoneText = getZoneText() || state.currentZoneName+' ('+state.currentZoneCode+')';
    const thead = table.tHead ? table.tHead.innerHTML : '';
    const tbody = (table.tBodies[0] && table.tBodies[0].innerHTML) || '';

    const title = 'Jadual Waktu Solat Bulanan - '+zoneText;
    const html =
      '<!DOCTYPE html><html lang="ms"><head>'+
      '<meta charset="utf-8">'+
      '<title>'+title+'</title>'+
      '<style>'+
      'body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;margin:20px;color:#111;}'+
      'h1{font-size:20px;margin-bottom:6px;}'+
      '.meta{margin-bottom:12px;font-size:13px;}'+
      'table{width:100%;border-collapse:collapse;font-size:10.5px;}'+
      'th,td{border:1px solid #ddd;padding:3px 4px;text-align:center;}'+
      'th{background:#249749;color:#fff;}'+
      'a{color:#1565c0;text-decoration:none;}'+
      'a:hover{text-decoration:underline;}'+
      '.footer{margin-top:14px;font-size:11px;color:#555;}'+
      '@page{size:A4 portrait;}'+
      '@media print{body{margin:8mm;}}'+
      '</style></head><body>'+
      '<h1>'+title+'</h1>'+
      '<div class="meta"><div><strong>Zon:</strong> '+zoneText+
      '</div></div>'+
      '<table><thead>'+thead+'</thead><tbody>'+tbody+'</tbody></table>'+
      '<div class="footer">'+
        'Sumber: data rasmi JAKIM / fallback Aladhan.'+
        '<br>Jana oleh <a href="'+CONFIG.APP_URL+'" target="_blank">IlmuAlam.com · Waktu Solat Malaysia</a>.'+
      '</div>'+
      '<script>window.onload=function(){window.focus();window.print();};</'+'script>'+
      '</body></html>';

    const w = window.open('', '_blank');
    if(!w){ alert('Pop-up disekat. Sila benarkan pop-up untuk cetak.'); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  // =======================
  // 9. INIT & EVENT
  // =======================

  async function loadTodayAndMonthly(){
    const loading = $('#ws-main-content');
    if(loading){
      loading.innerHTML =
        '<div class="ws-tool__loading"><div class="ws-tool__spinner"></div>'+
        '<p>Memuatkan waktu solat...</p></div>';
    }
    const t = todayYMD();
    try{
      const data = await getMonthlyData(state.currentZoneCode, t.y, t.m);
      state.todayMonthlyData = data;
      if(!state.todayHijri){
        await updateHijriTodayFromAladhan();
      }
      displayToday();
      displayMonthly();
    }catch(e){
      console.error(e);
      if(loading){
        loading.innerHTML =
          '<div class="ws-tool__error"><p><strong>⚠️ Ralat</strong></p>'+
          '<p>Gagal memuat data waktu solat. Sila cuba lagi.</p></div>';
      }
    }
  }

  function setupTabs(){
    const tabs = $all('.ws-tool__tab');
    const contents = $all('.ws-tool__tab-content');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        const target = this.getAttribute('data-tab');
        tabs.forEach(t=>t.classList.remove('ws-tool__tab--active'));
        contents.forEach(c=>c.classList.remove('ws-tool__tab-content--active'));
        this.classList.add('ws-tool__tab--active');
        $('#tab-'+target).classList.add('ws-tool__tab-content--active');
        if(target === 'monthly'){
          displayMonthly();
        }
      });
    });
  }

  function setupEvents(){
    const stateSel = $('#ws-state-select');
    const zoneSel = $('#ws-zone-select');

    if(stateSel){
      stateSel.addEventListener('change', function(){
        const key = this.value;
        if(!key) return;
        state.currentStateKey = key;
        populateZoneSelect(key);
        const zones = JAKIM_ZONES[key] || [];
        if(zones.length){
          state.currentZoneCode = zones[0].code;
          state.currentZoneName = zones[0].name;
          $('#ws-zone-select').value = state.currentZoneCode;
          saveLastZone();
          loadTodayAndMonthly();
        }
      });
    }

    if(zoneSel){
      zoneSel.addEventListener('change', function(){
        const code = this.value;
        if(!code) return;
        const z = findZoneByCode(code);
        if(z){
          state.currentZoneCode = z.code;
          state.currentZoneName = z.name;
          state.currentStateKey = z.stateKey || state.currentStateKey;
          saveLastZone();
          loadTodayAndMonthly();
        }
      });
    }

    const detectBtn = $('#ws-detect-btn');
    if(detectBtn){
      detectBtn.addEventListener('click', function(e){
        e.preventDefault();
        detectLocation();
      });
    }

    const qiblaBtn = $('#ws-qibla-btn');
    if(qiblaBtn){
      qiblaBtn.addEventListener('click', function(e){
        e.preventDefault();
        handleQibla();
      });
    }

    const shareBtn = $('#ws-share-btn');
    if(shareBtn){
      shareBtn.addEventListener('click', function(e){
        e.preventDefault();
        handleShare();
      });
    }

    const pdfTodayBtn = $('#ws-pdf-today-btn') || $('#ws-pdf-btn');
    if(pdfTodayBtn){
      pdfTodayBtn.addEventListener('click', function(e){
        e.preventDefault();
        pdfToday();
      });
    }

    const pdfMonthlyBtn = $('#ws-pdf-monthly-btn');
    if(pdfMonthlyBtn){
      pdfMonthlyBtn.addEventListener('click', function(e){
        e.preventDefault();
        pdfMonthly();
      });
    }

    const mosqBtn = $('#ws-find-mosques-btn');
    if(mosqBtn){
      mosqBtn.addEventListener('click', function(e){
        e.preventDefault();
        handleFindMosques();
      });
    }
  }

  function init(){
    const root = $('#ws-tool-app');
    if(!root) return;
    loadLastZone();
    populateStateSelect();
    populateZoneSelect(state.currentStateKey);
    setupTabs();
    setupEvents();
    loadTodayAndMonthly();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }

})();
