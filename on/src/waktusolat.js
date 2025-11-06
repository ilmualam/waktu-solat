/* ILMUALAM Waktu Solat (Shadow DOM, Vanilla JS)
   Data: JAKIM e-Solat API (period=month), Nearby Mosques: OSM Overpass
   Domain lock + local cache + azan reminder + month table + share + GPS map
*/
(() => {
  "use strict";

  const API = 'https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat';
  const OVERPASS = ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];

  const okHost = (allowCsv) => {
    const h = (location.hostname||"").replace(/^www\./,'');
    return allowCsv.split(',').map(s=>s.trim()).some(d => h.endsWith(d));
  };

  class ILSWaktuSolat extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode:'open'});
      this.brand = this.getAttribute('data-brand') || '#249749';
      this.allowed = this.getAttribute('data-domain') || 'ilmualam.com';
      if (!okHost(this.allowed)){
        this.shadowRoot.innerHTML = `<div style="font-family:system-ui;padding:12px;border:1px solid #eee;border-radius:12px">
        <b>Widget terkunci pada domain penerbit</b><br><small>Set data-domain atau hos JS dari repo anda.</small></div>`;
        return;
      }
      this.shadowRoot.innerHTML = `<style>${this.css()}</style>${this.html()}`;
    }
    connectedCallback(){
      this.init();
    }

    css(){
      return `
      :host{--brand:${this.brand};--txt:#111;--sub:#666;--bg:#fff;--brd:#eaeaea;display:block}
      *{box-sizing:border-box}
      .wrap{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--txt);background:var(--bg);border:1px solid var(--brd);border-radius:16px;overflow:hidden}
      .head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px 14px 0}
      .title{font-weight:800} .badge{margin-left:auto;background:var(--brand);color:#fff;border-radius:999px;padding:4px 10px;font-size:.78rem}
      .tabs{display:flex;gap:6px;padding:10px 14px;border-bottom:1px solid var(--brd);flex-wrap:wrap}
      .tab{padding:8px 12px;border:1px solid var(--brd);border-radius:999px;background:#fff;cursor:pointer;font-size:.92rem}
      .tab.active{background:var(--brand);color:#fff;border-color:var(--brand)}
      .body{padding:14px}
      .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px}
      select,input,button{font-size:.95rem;border:1px solid var(--brd);border-radius:10px;padding:9px 12px;background:#fff}
      .btn{cursor:pointer} .btn--pri{background:var(--brand);border-color:var(--brand);color:#fff}
      .chips{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 10px}
      .chip{font-size:.8rem;background:#f6f6f6;padding:6px 10px;border-radius:999px;color:var(--sub)}
      .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      @media(min-width:640px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(min-width:900px){.grid{grid-template-columns:repeat(6,minmax(0,1fr))}}
      .card{border:1px solid var(--brd);border-radius:14px;padding:12px;text-align:center;background:#fff}
      .card h4{margin:0 0 6px;font-size:.93rem;font-weight:700}
      .time{font-weight:700;font-size:1.08rem}
      .next{border-left:4px solid var(--brand);padding-left:10px;background:linear-gradient(90deg, var(--brand)11, transparent)}
      .sub{font-size:.85rem;color:var(--sub)}
      .two{display:grid;grid-template-columns:1fr;gap:14px}
      @media(min-width:820px){.two{grid-template-columns:1fr 1fr}}
      .tile{border:1px solid var(--brd);border-radius:14px;padding:12px;background:#fff}
      ul{list-style:none;margin:0;padding:0} li{border-bottom:1px solid #f1f1f1;padding:8px 0}
      li:last-child{border-bottom:0}
      .link{color:var(--brand);text-decoration:none}
      .foot{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:0 14px 14px}
      .note{font-size:.8rem;color:var(--sub)}
      .embed{border:1px dashed var(--brd);border-radius:12px;padding:10px;background:#fafafa}`;
    }
    html(){
      return `
      <div class="wrap">
        <div class="head">
          <div class="title">Waktu Solat Malaysia</div>
          <div class="badge">Rasmi JAKIM</div>
        </div>
        <div class="tabs" role="tablist">
          <button class="tab active" data-tab="today" role="tab">Hari Ini</button>
          <button class="tab" data-tab="month" role="tab">Bulanan</button>
          <button class="tab" data-tab="nearby" role="tab">Masjid Berdekatan</button>
          <button class="tab" data-tab="settings" role="tab">Tetapan</button>
        </div>
        <div class="body" id="body"></div>
        <div class="foot">
          <a class="link" href="https://www.e-solat.gov.my/" target="_blank" rel="nofollow noopener">Sumber: e-Solat JAKIM</a>
          <div class="note">Cepat, ringan & tepat • v2</div>
        </div>
      </div>`;
    }

    // Utilities
    todayISO(){ const d=new Date(); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }
    fmt(s){ return s?.slice(0,5) || '--:--'; }
    cache = {
      get(k,max=3*3600e3){ try{const v=JSON.parse(localStorage.getItem(k)||'null'); if(!v||Date.now()-v.t>max) return null; return v.d;}catch{return null;} },
      set(k,d){ try{localStorage.setItem(k, JSON.stringify({t:Date.now(), d}))}catch{} }
    };

    async init(){
      // tabs
      this.body = this.shadowRoot.querySelector('#body');
      this.shadowRoot.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',e=>this.switchTab(e.currentTarget.dataset.tab)));
      // zones
      await this.loadZones();
      // default UI
      this.renderToday();
      // silent GPS
      if ('geolocation' in navigator) requestIdleCallback?.(()=>this.detectGPS().catch(()=>{}));
    }

    async loadZones(){
      try{
        const r = await fetch('https://cdn.jsdelivr.net/gh/ilmualam/waktu-solat/data/zones.my.json',{cache:'force-cache'});
        this.ZONES = await r.json();
      }catch{
        this.ZONES = {"Selangor":[{"code":"SGR01","label":"Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, Shah Alam","districts":["Gombak","Petaling","Sepang","Hulu Langat","Hulu Selangor","Shah Alam"]}]}; // minimal fallback
      }
    }
    stateList(){ return Object.keys(this.ZONES).filter(k => this.ZONES[k]?.length); }

    switchTab(id){
      this.shadowRoot.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===id));
      if (id==='today') this.renderToday();
      if (id==='month') this.renderMonth();
      if (id==='nearby') this.renderNearby();
      if (id==='settings') this.renderSettings();
    }
    el(tag,cls,html){ const n=document.createElement(tag); if(cls) n.className=cls; if(html!=null) n.innerHTML=html; return n; }

    /* TODAY */
    renderToday(){
      const wrap=this.el('div');
      const row=this.el('div','row');
      this.selState=this.el('select'); this.selState.innerHTML=`<option value="">Pilih Negeri</option>`+this.stateList().map(s=>`<option>${s}</option>`).join('');
      this.selZone=this.el('select'); this.selZone.innerHTML=`<option value="">Pilih Daerah/Zon</option>`;
      this.monthInput=this.el('input'); this.monthInput.type='month'; this.monthInput.value=new Date().toISOString().slice(0,7);
      this.btnGPS=this.el('button','btn btn--pri'); this.btnGPS.textContent='Guna Lokasi';
      this.btnShare=this.el('button','btn'); this.btnShare.textContent='Kongsi';
      row.append(this.selState,this.selZone,this.monthInput,this.btnGPS,this.btnShare);

      const chips=this.el('div','chips',`<span class="chip" id="c-zone">Zon: -</span><span class="chip" id="c-date">Tarikh: ${this.todayISO()}</span><span class="chip" id="c-hijri">Hijri: -</span><span class="chip" id="c-qibla">Arah Kiblat: -</span>`);
      const grid=this.el('div','grid'); const names=['Imsak','Subuh','Syuruk','Dhuhr','Asar','Maghrib','Isyak']; this.timeCells={};
      names.forEach(n=>{ const c=this.el('div','card'); c.innerHTML=`<h4>${n}</h4><div class="time" id="t-${n.toLowerCase()}">--:--</div>`; grid.append(c); this.timeCells[n]=c; });

      const tools=this.el('div','two');
      const t1=this.el('div','tile',`<strong>Peringatan Azan</strong><div class="sub">Benarkan notifikasi untuk peringatan sebelum azan.</div><div class="row"><input id="n-min" type="number" min="0" max="30" value="5" style="width:90px"> min sebelum azan <button class="btn btn--pri" id="n-enable">Aktifkan</button></div><div class="sub" id="n-status">Status: -</div>`);
      const t2=this.el('div','tile',`<strong>Kod Tertanam (Embed)</strong><div class="embed"><textarea id="embed-code" style="width:100%;height:90px;font-family:monospace">&lt;div id="ilswaktusolat" data-domain="ilmualam.com" data-brand="#249749"&gt;&lt;/div&gt;
&lt;script defer src="https://cdn.jsdelivr.net/gh/ilmualam/waktu-solat/dist/waktusolat.min.js"&gt;&lt;/script&gt;</textarea><div class="row"><button class="btn" id="copy-embed">Salin Kod</button><a class="link" target="_blank" href="https://www.ilmualam.com/tools/waktu-solat-malaysia-jakim">Halaman sumber</a></div></div>`);
      tools.append(t1,t2);

      wrap.append(row,chips,grid,tools);
      this.body.innerHTML=''; this.body.append(wrap);

      this.selState.onchange=()=>{ const s=this.selState.value; const list=(this.ZONES[s]||[]); this.selZone.innerHTML=`<option value="">Pilih Daerah/Zon</option>`+list.map(z=>`<option value="${z.code}">${z.label} (${z.code})</option>`).join(''); };
      this.selZone.onchange=()=>this.loadZone(this.selZone.value);
      this.monthInput.onchange=()=>this.loadZone(this.selZone.value);
      this.btnGPS.onclick=()=>this.detectGPS();
      this.btnShare.onclick=()=>this.share();
      this.body.querySelector('#copy-embed').onclick=()=>{ const ta=this.body.querySelector('#embed-code'); ta.select(); document.execCommand('copy'); };
      this.body.querySelector('#n-enable').onclick=()=>this.enableAzan();
    }

    async fetchMonth(zone){
      const ym=new Date().toISOString().slice(0,7);
      const k=`ils2-${zone}-${ym}`; const c=this.cache.get(k); if(c) return c;
      const r=await fetch(`${API}&zone=${encodeURIComponent(zone)}&period=month`,{headers:{'Accept':'application/json'}});
      const j=await r.json(); this.cache.set(k,j); return j;
    }

    async loadZone(zone){
      if(!zone) return;
      const data=await this.fetchMonth(zone);
      const today=this.todayISO();
      const days=data?.prayerTime||[];
      const match=days.find(p=>/^\d{4}-\d{2}-\d{2}$/.test(p.date)?p.date===today:false) || days[new Date().getDate()-1] || {};
      const map={Imsak:match?.imsak,Subuh:match?.fajr,Syuruk:match?.syuruk,Dhuhr:match?.dhuhr,Asar:match?.asr,Maghrib:match?.maghrib,Isyak:match?.isha};
      this.shadowRoot.querySelector('#c-zone').textContent=`Zon: ${zone}`;
      this.shadowRoot.querySelector('#c-date').textContent=`Tarikh: ${today}`;
      this.shadowRoot.querySelector('#c-hijri').textContent=`Hijri: ${match?.hijri||'-'}`;
      this.shadowRoot.querySelector('#c-qibla').textContent=`Arah Kiblat: ${data?.bearing||'-'}`;
      Object.keys(this.timeCells).forEach(n=> this.timeCells[n].querySelector('.time').textContent=this.fmt(map[n]));
      Object.keys(this.timeCells).forEach(n=> this.timeCells[n].classList.remove('next'));
      // next prayer
      let next=null,nx=Infinity,now=Date.now();
      for(const [name,t] of Object.entries(map)){ if(!t) continue; const ms=new Date(`${today}T${this.fmt(t)}:00+08:00`).getTime(); if(ms>now && ms<nx){nx=ms; next=name;} }
      if(next) this.timeCells[next].classList.add('next');
      this._zone=zone;
    }

    async detectGPS(){
      const pos=await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej,{enableHighAccuracy:true,timeout:12000}));
      const {latitude:lat,longitude:lon}=pos.coords; this._lastLat=lat; this._lastLon=lon;
      // reverse geocode
      let addr=null; try{ const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ms`); addr=await r.json(); }catch{}
      const st=(addr?.address?.state||addr?.address?.region||'').toLowerCase();
      const district=(addr?.address?.county||addr?.address?.city_district||addr?.address?.city||addr?.address?.town||addr?.address?.municipality||'').toLowerCase();
      const state=this.stateList().find(x=>st.includes(x.toLowerCase()))||'Selangor';
      const zlist=this.ZONES[state]||[];
      const zone=(zlist.find(z=>(z.districts||[]).some(d=>district.includes(d.toLowerCase())))||zlist[0]||{}).code;
      if(this.selState){ this.selState.value=state; this.selState.onchange(); }
      if(this.selZone){ this.selZone.value=zone; }
      await this.loadZone(zone);
    }

    async loadNearby(){
      const ul=this.shadowRoot.querySelector('#mosq');
      if(!this._lastLat || !this._lastLon) await this.detectGPS().catch(()=>{});
      const lat=this._lastLat, lon=this._lastLon;
      if(!lat){ ul.innerHTML=`<li class="sub">Lokasi tidak dibenarkan.</li>`; return; }
      ul.innerHTML=`<li class="sub">Memuatkan…</li>`;
      const q=`[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="muslim"](around:8000,${lat},${lon});way["amenity"="place_of_worship"]["religion"="muslim"](around:8000,${lat},${lon});rel["amenity"="place_of_worship"]["religion"="muslim"](around:8000,${lat},${lon}););out center 20;`;
      let data=null;
      for(const ep of OVERPASS){ try{ const r=await fetch(ep,{method:'POST',body:q}); if(r.ok){ data=await r.json(); break; } }catch{} }
      if(!data?.elements?.length){ ul.innerHTML=`<li class="sub">Tiada data ditemui sekarang.</li>`; return; }
      const items=data.elements.map(e=>({name:e.tags?.name||'Masjid',lat:e.lat||e.center?.lat,lon:e.lon||e.center?.lon})).filter(x=>x.lat&&x.lon).slice(0,12);
      ul.innerHTML=items.map(i=>`<li><strong>${i.name}</strong><br><a class="link" target="_blank" rel="noopener" href="https://www.google.com/maps?q=${i.lat},${i.lon}">Buka dalam Peta</a></li>`).join('');
    }

    renderMonth(){
      const wrap=this.el('div');
      wrap.append(this.el('div','row', `<select id="m-zone"></select> <input id="m-month" type="month" value="${new Date().toISOString().slice(0,7)}"> <button class="btn btn--pri" id="m-load">Muatkan</button>`));
      wrap.append(this.el('div','sub',`Pilih zon & bulan untuk paparan jadual penuh.`));
      const table=this.el('div','tile'); table.innerHTML=`<div id="m-out" class="sub">Tiada data.</div>`;
      wrap.append(table);
      this.body.innerHTML=''; this.body.append(wrap);
      const zsel=this.body.querySelector('#m-zone');
      zsel.innerHTML = `<option value="">Pilih Zon</option>` + this.stateList().map(s=> (this.ZONES[s]||[]).map(z=>`<option value="${z.code}">${s} — ${z.label} (${z.code})</option>`).join('')).join('');
      this.body.querySelector('#m-load').onclick=async()=>{
        const zone=zsel.value; if(!zone) return;
        const data=await this.fetchMonth(zone);
        const days=data?.prayerTime||[];
        const rows=days.map(d=>`<tr><td>${d.date}</td><td>${d.imsak}</td><td>${d.fajr}</td><td>${d.syuruk}</td><td>${d.dhuhr}</td><td>${d.asr}</td><td>${d.maghrib}</td><td>${d.isha}</td></tr>`).join('');
        const html=`<div class="sub">Hijri: ${days[0]?.hijri||'-'} • Kiblat: ${data?.bearing||'-'}</div>
        <div style="overflow:auto"><table style="border-collapse:collapse;width:100%"><thead><tr>
        <th style="text-align:left;border-bottom:1px solid #eee;padding:6px">Tarikh</th>
        <th style="text-align:left;border-bottom:1px solid #eee;padding:6px">Imsak</th>
        <th style="text-align:left;border-bottom:1px solid #eee;padding:6px">Subuh</th>
        <th style="text-align:left;border-bottom:1px solid #eee;padding:6px">Syuruk</th>
        <th style="text-align:left;border-bottom:1px solid #eee;padding:6px">Dhuhr</th>
        <th style="text-align:left;border-bottom:1px solid #eee;padding:6px">Asar</th>
        <th style="text-align:left;border-bottom:1px solid #eee;padding:6px">Maghrib</th>
        <th style="text-align:left;border-bottom:1px solid #eee;padding:6px">Isyak</th>
        </tr></thead><tbody>${rows}</tbody></table></div>`;
        this.body.querySelector('#m-out').innerHTML=html;
      };
    }

    renderNearby(){
      const wrap=this.el('div');
      wrap.append(this.el('div','sub','Benarkan lokasi untuk lihat masjid dalam radius 8–10 km.'));
      const list=this.el('div','tile'); list.innerHTML=`<ul id="mosq"><li class="sub">Memuatkan…</li></ul>`;
      wrap.append(list);
      this.body.innerHTML=''; this.body.append(wrap);
      this.loadNearby().catch(()=> this.body.querySelector('#mosq').innerHTML=`<li class="sub">Tidak dapat memuatkan data.</li>`);
    }

    renderSettings(){
      const wrap=this.el('div','two');
      const a=this.el('div','tile',`<strong>Penampilan</strong><div class="row">Warna jenama <input id="cfg-brand" type="color" value="${this.brand}"> <button class="btn btn--pri" id="cfg-apply">Guna</button></div>`);
      const b=this.el('div','tile',`<strong>PWA (Opsyenal)</strong><div class="sub">Aktifkan dengan menambah manifest & service worker dari repo.</div><div class="row"><a class="link" target="_blank" href="https://github.com/ilmualam/waktu-solat">Lihat panduan</a></div>`);
      wrap.append(a,b);
      this.body.innerHTML=''; this.body.append(wrap);
      this.body.querySelector('#cfg-apply').onclick=()=>{ const val=this.body.querySelector('#cfg-brand').value||'#249749'; this.brand=val; this.style.setProperty('--brand', val); };
    }

    async share(){
      const url=location.href, title='Waktu Solat Malaysia';
      try{ if(navigator.share){ await navigator.share({title,url}); return; } }catch{}
      await navigator.clipboard?.writeText(url); alert('Pautan disalin.');
    }

    async enableAzan(){
      const status=this.shadowRoot.querySelector('#n-status');
      if(Notification && Notification.permission!=='granted'){ await Notification.requestPermission(); }
      if(Notification && Notification.permission!=='granted'){ status.textContent='Status: Notifikasi ditolak.'; return; }
      if(!this._zone){ status.textContent='Status: Pilih zon dahulu.'; return; }
      const data=await this.fetchMonth(this._zone); const today=this.todayISO();
      const d=(data?.prayerTime||[]).find(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date)?x.date===today:false)||{};
      const map={Subuh:d?.fajr,Dhuhr:d?.dhuhr,Asar:d?.asr,Maghrib:d?.maghrib,Isyak:d?.isha};
      let nextName=null,nextMs=Infinity,now=Date.now();
      for(const [name,t] of Object.entries(map)){ if(!t) continue; const ms=new Date(`${today}T${this.fmt(t)}:00+08:00`).getTime(); if(ms>now && ms<nextMs){ nextMs=ms; nextName=name; } }
      const mins=parseInt(this.shadowRoot.querySelector('#n-min').value||'5',10);
      const when=nextMs - mins*60000;
      if(when<=now){ status.textContent='Status: Solat seterusnya terlalu hampir.'; return; }
      setTimeout(()=>{ try{
        new Notification(`Peringatan ${nextName}`,{ body:`${mins} min sebelum azan ${nextName}.` });
        const ctx=new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(), g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination); o.type='sine'; o.frequency.value=880; g.gain.value=.001; o.start();
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime+.01); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+.6); o.stop(ctx.currentTime+.65);
      }catch{} }, when-now);
      status.textContent=`Status: Peringatan untuk ${nextName} (${mins} min sebelum) ditetapkan.`;
    }
  }

  customElements.define('ils-waktu-solat', ILSWaktuSolat);

  // Auto-mount: replace placeholder DIV with custom element
  const boot = () => {
    const host = document.getElementById('ilswaktusolat'); if(!host) return;
    const el = document.createElement('ils-waktu-solat');
    Array.from(host.attributes).forEach(a => el.setAttribute(a.name, a.value));
    host.replaceWith(el);
  };
  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();
