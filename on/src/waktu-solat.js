/**
 * Universal CDN Loader + Waktu Solat Malaysia Enhanced v2.0
 * Author: IlmuAlam.com | License: MIT
 */

(function () {
  'use strict';
  const isCDN = /cdn\.jsdelivr\.net|raw\.githubusercontent\.com/.test(location.href);

  if (isCDN) {
    console.log('[IlmuAlam Loader] Running from CDN:', location.href);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScript);
    } else {
      initScript();
    }
  } else {
    initScript();
  }

  // === Load Enhanced Script ===
  function initScript() {
    console.log('[IlmuAlam Loader] Initializing Enhanced Waktu Solat Tool...');

    /**
     * Waktu Solat Malaysia - Enhanced v2.0
     * Professional Prayer Times Tool with Notifications, Dark Mode & Multi-language
     * Author: IlmuAlam.com
     * License: MIT
     */
    (function() {
      'use strict';

  // Configuration
  const CONFIG = {
    API_BASE: 'https://api.aladhan.com/v1',
    OVERPASS_API: 'https://overpass-api.de/api/interpreter',
    STORAGE_KEY: 'waktuSolat',
    JAKIM_ZONES: {
      'JHR01': { state: 'Johor', lat: 2.0167, lon: 104.5333 },
      'JHR02': { state: 'Johor', lat: 1.4655, lon: 103.7578 },
      'JHR03': { state: 'Johor', lat: 2.0333, lon: 103.3167 },
      'JHR04': { state: 'Johor', lat: 1.8542, lon: 103.0594 },
      'KDH01': { state: 'Kedah', lat: 6.1248, lon: 100.3678 },
      'KDH02': { state: 'Kedah', lat: 5.7759, lon: 100.4928 },
      'KDH03': { state: 'Kedah', lat: 6.4414, lon: 100.8014 },
      'KDH04': { state: 'Kedah', lat: 5.6837, lon: 100.9186 },
      'KDH05': { state: 'Kedah', lat: 5.3648, lon: 100.5692 },
      'KDH06': { state: 'Kedah', lat: 6.3500, lon: 99.8000 },
      'KDH07': { state: 'Kedah', lat: 5.8000, lon: 100.4167 },
      'KTN01': { state: 'Kelantan', lat: 6.1379, lon: 102.2381 },
      'KTN03': { state: 'Kelantan', lat: 5.1667, lon: 101.9667 },
      'MLK01': { state: 'Melaka', lat: 2.1896, lon: 102.2501 },
      'NGS01': { state: 'Negeri Sembilan', lat: 2.7308, lon: 102.4267 },
      'NGS02': { state: 'Negeri Sembilan', lat: 2.7258, lon: 101.9424 },
      'PHG01': { state: 'Pahang', lat: 2.8167, lon: 104.1667 },
      'PHG02': { state: 'Pahang', lat: 3.8077, lon: 103.3260 },
      'PHG03': { state: 'Pahang', lat: 3.4667, lon: 102.4167 },
      'PHG04': { state: 'Pahang', lat: 3.4000, lon: 101.9000 },
      'PHG05': { state: 'Pahang', lat: 3.4167, lon: 101.6833 },
      'PHG06': { state: 'Pahang', lat: 3.7167, lon: 101.7333 },
      'PLS01': { state: 'Perlis', lat: 6.4449, lon: 100.2048 },
      'PNG01': { state: 'Pulau Pinang', lat: 5.4141, lon: 100.3288 },
      'PRK01': { state: 'Perak', lat: 4.0833, lon: 101.3833 },
      'PRK02': { state: 'Perak', lat: 4.5921, lon: 101.0901 },
      'PRK03': { state: 'Perak', lat: 5.1000, lon: 100.9833 },
      'PRK04': { state: 'Perak', lat: 5.4833, lon: 101.3833 },
      'PRK05': { state: 'Perak', lat: 4.0167, lon: 101.0167 },
      'PRK06': { state: 'Perak', lat: 5.0000, lon: 100.7333 },
      'PRK07': { state: 'Perak', lat: 4.8500, lon: 100.7833 },
      'SBH01': { state: 'Sabah', lat: 5.8333, lon: 118.0833 },
      'SBH02': { state: 'Sabah', lat: 6.9167, lon: 116.8167 },
      'SBH03': { state: 'Sabah', lat: 5.9788, lon: 116.0753 },
      'SBH04': { state: 'Sabah', lat: 6.0833, lon: 116.5583 },
      'SBH05': { state: 'Sabah', lat: 5.3500, lon: 115.7500 },
      'SBH06': { state: 'Sabah', lat: 5.3333, lon: 116.1667 },
      'SBH07': { state: 'Sabah', lat: 6.3833, lon: 116.6667 },
      'SBH08': { state: 'Sabah', lat: 5.4667, lon: 116.2667 },
      'SBH09': { state: 'Sabah', lat: 4.2500, lon: 117.8833 },
      'SGR01': { state: 'Selangor', lat: 3.0738, lon: 101.5183 },
      'SGR02': { state: 'Selangor', lat: 3.6667, lon: 101.0833 },
      'SGR03': { state: 'Selangor', lat: 3.0333, lon: 101.4500 },
      'SWK01': { state: 'Sarawak', lat: 1.5500, lon: 110.3333 },
      'SWK02': { state: 'Sarawak', lat: 2.2945, lon: 111.8270 },
      'SWK03': { state: 'Sarawak', lat: 2.1896, lon: 111.8270 },
      'SWK04': { state: 'Sarawak', lat: 4.3895, lon: 113.9917 },
      'SWK05': { state: 'Sarawak', lat: 4.8333, lon: 115.0000 },
      'SWK06': { state: 'Sarawak', lat: 3.1667, lon: 113.0333 },
      'SWK07': { state: 'Sarawak', lat: 1.6667, lon: 109.8333 },
      'SWK08': { state: 'Sarawak', lat: 1.4000, lon: 110.4167 },
      'SWK09': { state: 'Sarawak', lat: 2.8333, lon: 113.8333 },
      'TRG01': { state: 'Terengganu', lat: 5.3302, lon: 103.1408 },
      'TRG02': { state: 'Terengganu', lat: 5.8167, lon: 102.5667 },
      'TRG03': { state: 'Terengganu', lat: 5.1667, lon: 102.8667 },
      'TRG04': { state: 'Terengganu', lat: 4.7667, lon: 103.4333 },
      'WLY01': { state: 'W.P. Kuala Lumpur', lat: 3.1390, lon: 101.6869 },
      'WLY02': { state: 'W.P. Labuan', lat: 5.2831, lon: 115.2308 }
    }
  };

  // State Management
  const State = {
    currentLocation: null,
    currentZone: null,
    prayerTimes: null,
    nextPrayer: null,
    countdownInterval: null,
    compassInterval: null,
    userLat: null,
    userLon: null,
    language: 'ms',
    theme: 'light',
    notificationsEnabled: false,
    prayerTracking: {},
    monthlyData: {}
  };

  // DOM Elements Cache
  const El = {};

  // Initialize
  function init() {
    cacheElements();
    loadSettings();
    attachEventListeners();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    checkNotificationPermission();
    getUserLocation();
    initMonthSelector();
    checkPrayerNotifications();
    setInterval(checkPrayerNotifications, 60000); // Check every minute
  }

  // Cache DOM Elements
  function cacheElements() {
    El.app = document.getElementById('waktu-solat-app');
    El.locationName = document.getElementById('wsaLocationName');
    El.locationZone = document.getElementById('wsaLocationZone');
    El.dateGregorian = document.getElementById('wsaDateGregorian');
    El.dateHijri = document.getElementById('wsaDateHijri');
    El.stateSelect = document.getElementById('wsaStateSelect');
    El.prayerTimes = document.getElementById('wsaPrayerTimes');
    El.nextName = document.getElementById('wsaNextName');
    El.countdown = document.getElementById('wsaCountdown');
    El.mosqueSection = document.getElementById('wsaMosqueSection');
    El.mosqueList = document.getElementById('wsaMosqueList');
    El.qiblaSection = document.getElementById('wsaQiblaSection');
    El.compass = document.getElementById('wsaCompass');
    El.qiblaAngle = document.getElementById('wsaQiblaAngle');
    El.overlay = document.getElementById('wsaOverlay');
    El.themeToggle = document.getElementById('wsaThemeToggle');
    El.langToggle = document.getElementById('wsaLangToggle');
    El.notifBanner = document.getElementById('wsaNotifBanner');
    El.calendarGrid = document.getElementById('wsaCalendarGrid');
    El.monthSelect = document.getElementById('wsaMonthSelect');
  }

  // Load Settings from LocalStorage
  function loadSettings() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        State.language = data.language || 'ms';
        State.theme = data.theme || 'light';
        State.notificationsEnabled = data.notificationsEnabled || false;
        State.prayerTracking = data.prayerTracking || {};
        
        applyTheme();
        applyLanguage();
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  }

  // Save Settings
  function saveSettings() {
    try {
      const data = {
        language: State.language,
        theme: State.theme,
        notificationsEnabled: State.notificationsEnabled,
        prayerTracking: State.prayerTracking,
        lastZone: State.currentZone
      };
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  // Attach Event Listeners
  function attachEventListeners() {
    document.getElementById('wsaGetLocation')?.addEventListener('click', getUserLocation);
    El.stateSelect?.addEventListener('change', handleZoneChange);
    document.getElementById('wsaFindMosque')?.addEventListener('click', findNearbyMosques);
    document.getElementById('wsaQibla')?.addEventListener('click', toggleQibla);
    document.getElementById('wsaDownloadPDF')?.addEventListener('click', downloadPDF);
    document.getElementById('wsaShare')?.addEventListener('click', shareTimes);
    El.themeToggle?.addEventListener('click', toggleTheme);
    El.langToggle?.addEventListener('click', toggleLanguage);
    document.getElementById('wsaEnableNotif')?.addEventListener('click', enableNotifications);
    document.getElementById('wsaDismissNotif')?.addEventListener('click', dismissNotificationBanner);
    document.getElementById('wsaCopyWidget')?.addEventListener('click', copyWidgetCode);
    El.monthSelect?.addEventListener('change', loadMonthlyCalendar);

    // Tab switching
    document.querySelectorAll('.wsa-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Prayer tracking (click on prayer cards)
    document.querySelectorAll('.wsa-prayer-card').forEach(card => {
      if (card.dataset.prayer !== 'syuruk') {
        card.addEventListener('click', () => togglePrayerTracking(card.dataset.prayer));
      }
    });
  }

  // Toggle Theme
  function toggleTheme() {
    State.theme = State.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveSettings();
  }

  // Apply Theme
  function applyTheme() {
    if (State.theme === 'dark') {
      El.app.classList.add('wsa-dark-mode');
      document.getElementById('wsaThemeIcon').textContent = '☀️';
      updateLangText(document.getElementById('wsaThemeText'), { ms: 'Light Mode', en: 'Light Mode' });
    } else {
      El.app.classList.remove('wsa-dark-mode');
      document.getElementById('wsaThemeIcon').textContent = '🌙';
      updateLangText(document.getElementById('wsaThemeText'), { ms: 'Dark Mode', en: 'Dark Mode' });
    }
  }

  // Toggle Language
  function toggleLanguage() {
    State.language = State.language === 'ms' ? 'en' : 'ms';
    applyLanguage();
    saveSettings();
  }

  // Apply Language
  function applyLanguage() {
    document.querySelectorAll('[data-ms][data-en]').forEach(el => {
      const text = State.language === 'ms' ? el.dataset.ms : el.dataset.en;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    // Update language toggle button
    document.getElementById('wsaLangText').textContent = State.language === 'ms' ? 'English' : 'Bahasa';
  }

  // Helper to update bilingual text
  function updateLangText(el, texts) {
    if (el) {
      el.dataset.ms = texts.ms;
      el.dataset.en = texts.en;
      el.textContent = State.language === 'ms' ? texts.ms : texts.en;
    }
  }

  // Check Notification Permission
  function checkNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      El.notifBanner.classList.remove('wsa-hidden');
    }
  }

  // Enable Notifications
  async function enableNotifications() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        State.notificationsEnabled = true;
        saveSettings();
        showToast(
          State.language === 'ms' ? 'Notifikasi diaktifkan!' : 'Notifications enabled!',
          'success'
        );
        dismissNotificationBanner();
      }
    }
  }

  // Dismiss Notification Banner
  function dismissNotificationBanner() {
    El.notifBanner.classList.add('wsa-hidden');
  }

  // Check and Send Prayer Notifications
  function checkPrayerNotifications() {
    if (!State.notificationsEnabled || !State.prayerTimes) return;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const prayers = ['subuh', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const prayerNames = {
      ms: { subuh: 'Subuh', dhuhr: 'Zohor', asr: 'Asar', maghrib: 'Maghrib', isha: 'Isyak' },
      en: { subuh: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' }
    };

    prayers.forEach(prayer => {
      const prayerTime = State.prayerTimes[prayer];
      if (prayerTime && prayerTime.substring(0, 5) === currentTime) {
        const name = prayerNames[State.language][prayer];
        sendNotification(
          State.language === 'ms' ? `Waktu ${name}` : `${name} Prayer Time`,
          State.language === 'ms' 
            ? `Sudah masuk waktu solat ${name}` 
            : `It's time for ${name} prayer`,
          '🕌'
        );
      }
    });
  }

  // Send Browser Notification
  function sendNotification(title, body, icon = '🕌') {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: icon,
        badge: icon,
        vibrate: [200, 100, 200],
        tag: 'prayer-time'
      });
    }
  }

  // Toggle Prayer Tracking
  function togglePrayerTracking(prayer) {
    const today = new Date().toDateString();
    const key = `${today}-${prayer}`;
    
    if (!State.prayerTracking[today]) {
      State.prayerTracking[today] = {};
    }

    State.prayerTracking[today][prayer] = !State.prayerTracking[today][prayer];
    
    const card = document.querySelector(`[data-prayer="${prayer}"]`);
    if (card) {
      if (State.prayerTracking[today][prayer]) {
        card.classList.add('wsa-completed');
      } else {
        card.classList.remove('wsa-completed');
      }
    }

    saveSettings();
  }

  // Switch Tabs
  function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.wsa-tab').forEach(tab => {
      tab.classList.remove('wsa-active');
      if (tab.dataset.tab === tabName) {
        tab.classList.add('wsa-active');
      }
    });

    // Update tab content
    document.querySelectorAll('.wsa-tab-content').forEach(content => {
      content.classList.remove('wsa-active');
      if (content.dataset.tabContent === tabName) {
        content.classList.add('wsa-active');
      }
    });

    // Load monthly calendar if needed
    if (tabName === 'monthly' && !State.monthlyData[State.currentZone]) {
      loadMonthlyCalendar();
    }
  }

  // Initialize Month Selector
  function initMonthSelector() {
    const months = {
      ms: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let html = '';
    for (let i = -1; i <= 2; i++) {
      const date = new Date(currentYear, currentMonth + i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthName = months[State.language][month];
      const value = `${year}-${(month + 1).toString().padStart(2, '0')}`;
      const selected = i === 0 ? 'selected' : '';
      html += `<option value="${value}" ${selected}>${monthName} ${year}</option>`;
    }

    El.monthSelect.innerHTML = html;
  }

  // Load Monthly Calendar
  async function loadMonthlyCalendar() {
    if (!State.currentZone) return;

    const selectedMonth = El.monthSelect.value;
    const [year, month] = selectedMonth.split('-');

    showLoading(true);
    El.calendarGrid.innerHTML = '<div class="wsa-loading">' + 
      (State.language === 'ms' ? 'Memuatkan kalendar...' : 'Loading calendar...') + 
      '</div>';

    try {
      const zoneData = CONFIG.JAKIM_ZONES[State.currentZone];
      const daysInMonth = new Date(year, month, 0).getDate();
      
      let calendarHTML = '';
      const weekDays = State.language === 'ms' 
        ? ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Header row
      weekDays.forEach(day => {
        calendarHTML += `<div class="wsa-calendar-day" style="font-weight:700;">${day}</div>`;
      });

      // Get first day offset
      const firstDay = new Date(year, month - 1, 1).getDay();
      for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="wsa-calendar-day" style="opacity:0.3;"></div>';
      }

      // Fetch month data
      const timestamp = new Date(year, month - 1, 15).getTime() / 1000;
      const response = await fetch(
        `${CONFIG.API_BASE}/calendar/${year}/${month}?latitude=${zoneData.lat}&longitude=${zoneData.lon}&method=3`
      );
      
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        const today = new Date().toDateString();
        
        data.data.forEach(day => {
          const date = new Date(day.date.gregorian.date);
          const isToday = date.toDateString() === today;
          const dayClass = isToday ? 'wsa-today' : '';
          
          calendarHTML += `
            <div class="wsa-calendar-day ${dayClass}">
              <div class="wsa-calendar-date">${day.date.gregorian.day}</div>
              <div class="wsa-calendar-prayers">
                ${formatTime(day.timings.Fajr)}<br>
                ${formatTime(day.timings.Dhuhr)}<br>
                ${formatTime(day.timings.Asr)}<br>
                ${formatTime(day.timings.Maghrib)}<br>
                ${formatTime(day.timings.Isha)}
              </div>
            </div>
          `;
        });
      }

      El.calendarGrid.innerHTML = calendarHTML;
      State.monthlyData[State.currentZone] = data.data;
      
    } catch (error) {
      console.error('Error loading monthly calendar:', error);
      El.calendarGrid.innerHTML = '<div class="wsa-loading">' + 
        (State.language === 'ms' ? 'Ralat memuatkan kalendar' : 'Error loading calendar') + 
        '</div>';
    } finally {
      showLoading(false);
    }
  }

  // Copy Widget Code
  function copyWidgetCode() {
    const code = document.getElementById('wsaWidgetCode').innerText;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        showToast(
          State.language === 'ms' ? 'Kod disalin!' : 'Code copied!',
          'success'
        );
      });
    }
  }

  // Get User Location
  function getUserLocation() {
    if (!navigator.geolocation) {
      showToast(
        State.language === 'ms' ? 'Pelayar tidak menyokong geolokasi' : 'Browser doesn\'t support geolocation',
        'error'
      );
      return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        State.userLat = position.coords.latitude;
        State.userLon = position.coords.longitude;
        
        const nearestZone = findNearestZone(State.userLat, State.userLon);
        El.stateSelect.value = nearestZone;
        
        await loadPrayerTimes(nearestZone, State.userLat, State.userLon);
        showLoading(false);
      },
      (error) => {
        showLoading(false);
        showToast(
          State.language === 'ms' ? 'Tidak dapat mengesan lokasi' : 'Cannot detect location',
          'warning'
        );
        El.stateSelect.value = 'WLY01';
        handleZoneChange();
      }
    );
  }

  // Find Nearest Zone
  function findNearestZone(lat, lon) {
    let nearest = 'WLY01';
    let minDistance = Infinity;

    for (const [zone, data] of Object.entries(CONFIG.JAKIM_ZONES)) {
      const distance = calculateDistance(lat, lon, data.lat, data.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = zone;
      }
    }

    return nearest;
  }

  // Calculate Distance
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Handle Zone Change
  async function handleZoneChange() {
    const zone = El.stateSelect.value;
    if (!zone) return;

    const zoneData = CONFIG.JAKIM_ZONES[zone];
    if (!zoneData) return;

    showLoading(true);
    await loadPrayerTimes(zone, zoneData.lat, zoneData.lon);
    showLoading(false);
  }

  // Load Prayer Times
  async function loadPrayerTimes(zone, lat, lon) {
    try {
      const zoneData = CONFIG.JAKIM_ZONES[zone];
      State.currentZone = zone;
      State.currentLocation = { lat, lon };

      El.locationName.textContent = zoneData.state;
      const optionText = El.stateSelect.options[El.stateSelect.selectedIndex]?.text || '';
      El.locationZone.textContent = optionText.replace(/^.*?\-\s*/, '') || zone;

      const today = new Date();
      const timestamp = Math.floor(today.getTime() / 1000);
      
      const response = await fetch(
        `${CONFIG.API_BASE}/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=3`
      );

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        displayPrayerTimes(data.data);
        startCountdown();
        updateHijriDate(data.data.date.hijri);
        applyPrayerTracking();
      }

    } catch (error) {
      console.error('Error loading prayer times:', error);
      showToast(
        State.language === 'ms' ? 'Ralat memuat waktu solat' : 'Error loading prayer times',
        'error'
      );
    }
  }

  // Display Prayer Times
  function displayPrayerTimes(data) {
    const times = data.timings;
    State.prayerTimes = {
      imsak: times.Imsak || times.Fajr,
      subuh: times.Fajr,
      syuruk: times.Sunrise,
      zohor: times.Dhuhr,
      asar: times.Asr,
      maghrib: times.Maghrib,
      isyak: times.Isha
    };

    const cards = {
      imsak: State.prayerTimes.imsak,
      subuh: State.prayerTimes.subuh,
      syuruk: State.prayerTimes.syuruk,
      dhuhr: State.prayerTimes.zohor,
      asr: State.prayerTimes.asar,
      maghrib: State.prayerTimes.maghrib,
      isha: State.prayerTimes.isyak
    };

    for (const [prayer, time] of Object.entries(cards)) {
      const card = document.querySelector(`[data-prayer="${prayer}"]`);
      if (card) {
        const timeElement = card.querySelector('.wsa-prayer-time');
        if (timeElement) {
          timeElement.textContent = formatTime(time);
        }
      }
    }

    highlightCurrentPrayer();
  }

  // Apply Prayer Tracking Status
  function applyPrayerTracking() {
    const today = new Date().toDateString();
    if (State.prayerTracking[today]) {
      for (const [prayer, completed] of Object.entries(State.prayerTracking[today])) {
        const card = document.querySelector(`[data-prayer="${prayer}"]`);
        if (card && completed) {
          card.classList.add('wsa-completed');
        }
      }
    }
  }

  // Format Time
  function formatTime(time24) {
    if (!time24) return '--:--';
    const [hours, minutes] = time24.split(':');
    return `${hours}:${minutes}`;
  }

  // Highlight Current Prayer
  function highlightCurrentPrayer() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'imsak', time: State.prayerTimes.imsak },
      { name: 'subuh', time: State.prayerTimes.subuh },
      { name: 'syuruk', time: State.prayerTimes.syuruk },
      { name: 'dhuhr', time: State.prayerTimes.zohor },
      { name: 'asr', time: State.prayerTimes.asar },
      { name: 'maghrib', time: State.prayerTimes.maghrib },
      { name: 'isha', time: State.prayerTimes.isyak }
    ];

    document.querySelectorAll('.wsa-prayer-card').forEach(card => {
      card.classList.remove('wsa-current', 'wsa-highlight');
    });

    let nextPrayer = null;
    for (let i = 0; i < prayers.length; i++) {
      const prayer = prayers[i];
      const [hours, minutes] = prayer.time.split(':');
      const prayerTime = parseInt(hours) * 60 + parseInt(minutes);

      if (currentTime < prayerTime) {
        nextPrayer = prayer;
        break;
      }
    }

    if (!nextPrayer) {
      nextPrayer = prayers[0];
    }

    State.nextPrayer = nextPrayer;

    const nextCard = document.querySelector(`[data-prayer="${nextPrayer.name}"]`);
    if (nextCard) {
      nextCard.classList.add('wsa-highlight');
    }
  }

  // Start Countdown
  function startCountdown() {
    if (State.countdownInterval) {
      clearInterval(State.countdownInterval);
    }

    updateCountdown();
    State.countdownInterval = setInterval(updateCountdown, 1000);
  }

  // Update Countdown
  function updateCountdown() {
    if (!State.nextPrayer) return;

    const now = new Date();
    const [hours, minutes] = State.nextPrayer.time.split(':');
    
    let nextPrayerDate = new Date();
    nextPrayerDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (nextPrayerDate <= now) {
      nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
    }

    const diff = nextPrayerDate - now;
    
    const h = Math.floor(diff / 1000 / 60 / 60);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    El.countdown.textContent = 
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    const prayerNames = {
      ms: { imsak: 'Imsak', subuh: 'Subuh', syuruk: 'Syuruk', dhuhr: 'Zohor', asr: 'Asar', maghrib: 'Maghrib', isha: 'Isyak' },
      en: { imsak: 'Imsak', subuh: 'Fajr', syuruk: 'Sunrise', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' }
    };
    El.nextName.textContent = prayerNames[State.language][State.nextPrayer.name] || State.nextPrayer.name;
  }

  // Update Date & Time
  function updateDateTime() {
    const now = new Date();
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const locale = State.language === 'ms' ? 'ms-MY' : 'en-US';
    El.dateGregorian.textContent = now.toLocaleDateString(locale, options);
  }

  // Update Hijri Date
  function updateHijriDate(hijri) {
    if (hijri) {
      const months = {
        ms: ['Muharram', 'Safar', 'Rabiulawal', 'Rabiulakhir', 'Jamadilawal', 'Jamadilakhir', 
             'Rejab', 'Syaaban', 'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijjah'],
        en: ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani',
             'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah']
      };
      
      const monthIndex = parseInt(hijri.month.number) - 1;
      const monthName = months[State.language][monthIndex];
      El.dateHijri.textContent = `${hijri.day} ${monthName} ${hijri.year}H`;
    }
  }

  // Find Nearby Mosques
  async function findNearbyMosques() {
    if (!State.userLat || !State.userLon) {
      const zoneData = CONFIG.JAKIM_ZONES[State.currentZone];
      if (zoneData) {
        State.userLat = zoneData.lat;
        State.userLon = zoneData.lon;
      } else {
        showToast(
          State.language === 'ms' ? 'Sila aktifkan lokasi' : 'Please enable location',
          'warning'
        );
        return;
      }
    }

    showLoading(true);
    El.mosqueSection.style.display = 'block';
    El.mosqueList.innerHTML = '<div class="wsa-loading">' + 
      (State.language === 'ms' ? 'Mencari masjid terdekat...' : 'Finding nearby mosques...') + 
      '</div>';

    try {
      const radius = 5000;
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${State.userLat},${State.userLon});
          way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${State.userLat},${State.userLon});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch(CONFIG.OVERPASS_API, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query)
      });

      if (!response.ok) throw new Error('Overpass API error');

      const data = await response.json();
      displayMosques(data.elements);

    } catch (error) {
      console.error('Error finding mosques:', error);
      El.mosqueList.innerHTML = '<div class="wsa-loading">' + 
        (State.language === 'ms' ? 'Ralat mencari masjid' : 'Error finding mosques') + 
        '</div>';
    } finally {
      showLoading(false);
    }
  }

  // Display Mosques
  function displayMosques(mosques) {
    if (!mosques || mosques.length === 0) {
      El.mosqueList.innerHTML = '<div class="wsa-loading">' + 
        (State.language === 'ms' ? 'Tiada masjid ditemui' : 'No mosques found') + 
        '</div>';
      return;
    }

    const mosquesWithDistance = mosques
      .filter(m => m.lat && m.lon && m.tags && (m.tags.name || m.tags['name:ms']))
      .map(mosque => ({
        name: mosque.tags.name || mosque.tags['name:ms'] || 'Masjid',
        lat: mosque.lat,
        lon: mosque.lon,
        distance: calculateDistance(State.userLat, State.userLon, mosque.lat, mosque.lon)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    if (mosquesWithDistance.length === 0) {
      El.mosqueList.innerHTML = '<div class="wsa-loading">' + 
        (State.language === 'ms' ? 'Tiada masjid ditemui' : 'No mosques found') + 
        '</div>';
      return;
    }

    const directionText = State.language === 'ms' ? 'Arah' : 'Direction';
    const fromText = State.language === 'ms' ? 'dari lokasi anda' : 'from your location';

    const html = mosquesWithDistance.map(mosque => `
      <div class="wsa-mosque-item">
        <div class="wsa-mosque-info">
          <div class="wsa-mosque-name">🕌 ${mosque.name}</div>
          <div class="wsa-mosque-distance">📍 ${mosque.distance.toFixed(2)} km ${fromText}</div>
        </div>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="wsa-mosque-directions">
          ${directionText}
        </a>
      </div>
    `).join('');

    El.mosqueList.innerHTML = html;
  }

  // Toggle Qibla
  function toggleQibla() {
    if (El.qiblaSection.style.display === 'none' || !El.qiblaSection.style.display) {
      showQibla();
    } else {
      hideQibla();
    }
  }

  // Show Qibla
  function showQibla() {
    if (!State.userLat || !State.userLon) {
      const zoneData = CONFIG.JAKIM_ZONES[State.currentZone];
      if (zoneData) {
        State.userLat = zoneData.lat;
        State.userLon = zoneData.lon;
      } else {
        showToast(
          State.language === 'ms' ? 'Sila aktifkan lokasi' : 'Please enable location',
          'warning'
        );
        return;
      }
    }

    El.qiblaSection.style.display = 'block';
    
    const qiblaAngle = calculateQibla(State.userLat, State.userLon);
    El.qiblaAngle.textContent = `${Math.round(qiblaAngle)}°`;

    if (window.DeviceOrientationEvent) {
      startCompass(qiblaAngle);
    } else {
      El.compass.style.transform = `rotate(${qiblaAngle}deg)`;
    }
  }

  // Hide Qibla
  function hideQibla() {
    El.qiblaSection.style.display = 'none';
    stopCompass();
  }

  // Calculate Qibla
  function calculateQibla(lat, lon) {
    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;

    const dLon = toRad(kaabaLon - lon);
    const y = Math.sin(dLon) * Math.cos(toRad(kaabaLat));
    const x = Math.cos(toRad(lat)) * Math.sin(toRad(kaabaLat)) -
              Math.sin(toRad(lat)) * Math.cos(toRad(kaabaLat)) * Math.cos(dLon);
    
    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180 / Math.PI + 360) % 360;
    
    return bearing;
  }

  // Start Compass
  function startCompass(qiblaAngle) {
    function handleOrientation(event) {
      let heading = event.alpha || event.webkitCompassHeading || 0;
      
      if (event.webkitCompassHeading) {
        heading = event.webkitCompassHeading;
      } else {
        heading = 360 - heading;
      }

      const rotation = heading - qiblaAngle;
      El.compass.style.transform = `rotate(${-rotation}deg)`;
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation);
    window.addEventListener('deviceorientation', handleOrientation);
  }

  // Stop Compass
  function stopCompass() {
    // Remove listeners (would need to store reference)
  }

  // Download PDF
  async function downloadPDF() {
    if (!State.prayerTimes) {
      showToast(
        State.language === 'ms' ? 'Sila muat waktu solat terlebih dahulu' : 'Please load prayer times first',
        'warning'
      );
      return;
    }

    showLoading(true);

    try {
      const zoneData = CONFIG.JAKIM_ZONES[State.currentZone];
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Waktu Solat - ${zoneData.state}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #249749; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { padding: 15px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #249749; color: white; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>🕌 Waktu Solat ${zoneData.state}</h1>
          <p style="text-align:center;">${El.locationZone.textContent}</p>
          <p style="text-align:center;">${El.dateGregorian.textContent}</p>
          <table>
            <tr><th>Waktu Solat</th><th>Masa</th></tr>
            <tr><td>Imsak</td><td>${formatTime(State.prayerTimes.imsak)}</td></tr>
            <tr><td>Subuh</td><td>${formatTime(State.prayerTimes.subuh)}</td></tr>
            <tr><td>Syuruk</td><td>${formatTime(State.prayerTimes.syuruk)}</td></tr>
            <tr><td>Zohor</td><td>${formatTime(State.prayerTimes.zohor)}</td></tr>
            <tr><td>Asar</td><td>${formatTime(State.prayerTimes.asar)}</td></tr>
            <tr><td>Maghrib</td><td>${formatTime(State.prayerTimes.maghrib)}</td></tr>
            <tr><td>Isyak</td><td>${formatTime(State.prayerTimes.isyak)}</td></tr>
          </table>
          <div class="footer">
            Dijana dari <a href="https://www.ilmualam.com/p/waktu-solat-malaysia.html" target="_blank">www.ilmualam.com</a><br>
            ${new Date().toLocaleDateString('ms-MY')}
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        showLoading(false);
      }, 250);

    } catch (error) {
      console.error('PDF error:', error);
      showToast(
        State.language === 'ms' ? 'Ralat menjana PDF' : 'Error generating PDF',
        'error'
      );
      showLoading(false);
    }
  }

  // Share Times
  async function shareTimes() {
    if (!State.prayerTimes) {
      showToast(
        State.language === 'ms' ? 'Sila muat waktu solat terlebih dahulu' : 'Please load prayer times first',
        'warning'
      );
      return;
    }

    const zoneData = CONFIG.JAKIM_ZONES[State.currentZone];
    const shareText = `🕌 Waktu Solat ${zoneData.state}\n${El.dateGregorian.textContent}\n\n` +
      `Imsak: ${formatTime(State.prayerTimes.imsak)}\n` +
      `Subuh: ${formatTime(State.prayerTimes.subuh)}\n` +
      `Syuruk: ${formatTime(State.prayerTimes.syuruk)}\n` +
      `Zohor: ${formatTime(State.prayerTimes.zohor)}\n` +
      `Asar: ${formatTime(State.prayerTimes.asar)}\n` +
      `Maghrib: ${formatTime(State.prayerTimes.maghrib)}\n` +
      `Isyak: ${formatTime(State.prayerTimes.isyak)}\n\n` +
      `www.ilmualam.com/p/waktu-solat-malaysia.html`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Waktu Solat Malaysia',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare(shareText);
        }
      }
    } else {
      fallbackShare(shareText);
    }
  }

  // Fallback Share
  function fallbackShare(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(
          State.language === 'ms' ? 'Waktu solat disalin!' : 'Prayer times copied!',
          'success'
        );
      });
    }
  }

  // Show Loading
  function showLoading(show) {
    El.overlay.style.display = show ? 'flex' : 'none';
  }

  // Show Toast Notification
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `wsa-toast wsa-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'wsaSlideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
  }
})();
