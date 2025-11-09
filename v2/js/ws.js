(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'ws_last_zone',
        JAKIM_API: 'https://www.e-solat.gov.my/index.php?r=esolatApi/TakwimSolat&period=month&zone=',
        ALADHAN_API: 'https://api.aladhan.com/v1',
        OVERPASS_API: 'https://overpass-api.de/api/interpreter',
        MOSQUE_RADIUS: 5000 // meters
    };

    const JAKIM_ZONES = {
        'johor': [
            {code: 'JHR01', name: 'Pulau Aur, Pulau Pemanggil', coords: {lat: 2.0, lng: 104.0}},
            {code: 'JHR02', name: 'Johor Bahru, Kota Tinggi, Mersing, Kulai', coords: {lat: 1.4655, lng: 103.7578}},
            {code: 'JHR03', name: 'Kluang, Pontian', coords: {lat: 2.0309, lng: 103.3186}},
            {code: 'JHR04', name: 'Batu Pahat, Muar, Segamat, Gemas', coords: {lat: 1.8548, lng: 102.9325}}
        ],
        'kedah': [
            {code: 'KDH01', name: 'Kota Setar, Kubang Pasu, Pokok Sena', coords: {lat: 6.1184, lng: 100.3681}},
            {code: 'KDH02', name: 'Kuala Muda, Yan, Pendang', coords: {lat: 5.7711, lng: 100.4911}},
            {code: 'KDH03', name: 'Padang Terap, Sik', coords: {lat: 6.1301, lng: 100.7089}},
            {code: 'KDH04', name: 'Baling', coords: {lat: 5.6725, lng: 100.9108}},
            {code: 'KDH05', name: 'Bandar Baharu, Kulim', coords: {lat: 5.3647, lng: 100.5623}},
            {code: 'KDH06', name: 'Langkawi', coords: {lat: 6.3500, lng: 99.8000}},
            {code: 'KDH07', name: 'Gunung Jerai', coords: {lat: 5.7971, lng: 100.4304}}
        ],
        'kelantan': [
            {code: 'KTN01', name: 'Kota Bharu, Bachok, Pasir Puteh, Tumpat, Pasir Mas, Tanah Merah, Machang, Kuala Krai', coords: {lat: 6.1256, lng: 102.2381}},
            {code: 'KTN03', name: 'Jeli, Gua Musang', coords: {lat: 5.6833, lng: 102.2417}}
        ],
        'melaka': [
            {code: 'MLK01', name: 'Seluruh Negeri Melaka', coords: {lat: 2.1896, lng: 102.2501}}
        ],
        'negerisembilan': [
            {code: 'NGS01', name: 'Tampin, Jempol', coords: {lat: 2.4667, lng: 102.2333}},
            {code: 'NGS02', name: 'Jelebu, Kuala Pilah, Port Dickson, Rembau, Seremban', coords: {lat: 2.7258, lng: 101.9424}}
        ],
        'pahang': [
            {code: 'PHG01', name: 'Pulau Tioman', coords: {lat: 2.8128, lng: 104.1603}},
            {code: 'PHG02', name: 'Kuantan, Pekan, Rompin, Muadzam Shah', coords: {lat: 3.8077, lng: 103.3260}},
            {code: 'PHG03', name: 'Jerantut, Temerloh, Maran, Bera, Chenor, Jengka', coords: {lat: 3.4540, lng: 102.3699}},
            {code: 'PHG04', name: 'Bentong, Lipis, Raub', coords: {lat: 3.5222, lng: 101.9063}},
            {code: 'PHG05', name: 'Genting Sempah, Janda Baik, Bukit Tinggi', coords: {lat: 3.4211, lng: 101.7936}},
            {code: 'PHG06', name: 'Cameron Highlands, Genting Highlands, Bukit Fraser', coords: {lat: 4.4704, lng: 101.3779}}
        ],
        'perak': [
            {code: 'PRK01', name: 'Tapah, Slim River, Tanjung Malim', coords: {lat: 4.1967, lng: 101.2576}},
            {code: 'PRK02', name: 'Kuala Kangsar, Sg. Siput, Ipoh, Batu Gajah, Kampar', coords: {lat: 4.5975, lng: 101.0901}},
            {code: 'PRK03', name: 'Lenggong, Pengkalan Hulu, Grik', coords: {lat: 5.0833, lng: 100.9833}},
            {code: 'PRK04', name: 'Temengor, Belum', coords: {lat: 5.5500, lng: 101.3500}},
            {code: 'PRK05', name: 'Kg Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar', coords: {lat: 4.0225, lng: 101.0211}},
            {code: 'PRK06', name: 'Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor', coords: {lat: 4.2125, lng: 100.6167}},
            {code: 'PRK07', name: 'Selama, Taiping, Bagan Serai, Parit Buntar', coords: {lat: 5.0092, lng: 100.7375}}
        ],
        'perlis': [
            {code: 'PLS01', name: 'Seluruh Negeri Perlis', coords: {lat: 6.4449, lng: 100.2048}}
        ],
        'penang': [
            {code: 'PNG01', name: 'Seluruh Negeri Pulau Pinang', coords: {lat: 5.4164, lng: 100.3327}}
        ],
        'sabah': [
            {code: 'SBH01', name: 'Bahagian Sandakan (Timur)', coords: {lat: 5.8403, lng: 118.1179}},
            {code: 'SBH02', name: 'Bahagian Sandakan (Barat)', coords: {lat: 5.8403, lng: 117.5179}},
            {code: 'SBH03', name: 'Lahad Datu, Kunak, Semporna', coords: {lat: 5.0322, lng: 118.3400}},
            {code: 'SBH04', name: 'Tawau, Balong, Merotai, Kalabakan', coords: {lat: 4.2446, lng: 117.8920}},
            {code: 'SBH05', name: 'Kudat, Kota Marudu, Pitas', coords: {lat: 6.8833, lng: 116.8333}},
            {code: 'SBH06', name: 'Gunung Kinabalu', coords: {lat: 6.0750, lng: 116.5586}},
            {code: 'SBH07', name: 'Kota Kinabalu, Ranau, Tuaran, Penampang, Papar', coords: {lat: 5.9804, lng: 116.0735}},
            {code: 'SBH08', name: 'Keningau, Tambunan, Nabawan', coords: {lat: 5.3394, lng: 116.1608}},
            {code: 'SBH09', name: 'Beaufort, Kuala Penyu, Sipitang, Tenom', coords: {lat: 5.3472, lng: 115.7469}}
        ],
        'sarawak': [
            {code: 'SWK01', name: 'Limbang, Lawas, Sundar, Trusan', coords: {lat: 4.7500, lng: 115.0167}},
            {code: 'SWK02', name: 'Miri, Niah, Bekenu, Sibuti, Marudi', coords: {lat: 4.3900, lng: 113.9910}},
            {code: 'SWK03', name: 'Bintulu, Tatau, Sebauh', coords: {lat: 3.1667, lng: 113.0333}},
            {code: 'SWK04', name: 'Sibu, Mukah, Dalat, Song, Kapit', coords: {lat: 2.3000, lng: 111.8167}},
            {code: 'SWK05', name: 'Sarikei, Matu, Julau, Rajang', coords: {lat: 2.1167, lng: 111.5167}},
            {code: 'SWK06', name: 'Sri Aman, Lubok Antu, Betong', coords: {lat: 1.2333, lng: 111.4667}},
            {code: 'SWK07', name: 'Samarahan, Serian, Simunjan', coords: {lat: 1.4667, lng: 110.4500}},
            {code: 'SWK08', name: 'Kuching, Bau, Lundu, Sematan', coords: {lat: 1.5533, lng: 110.3593}},
            {code: 'SWK09', name: 'Zon Khas', coords: {lat: 3.8333, lng: 115.5000}}
        ],
        'selangor': [
            {code: 'SGR01', name: 'Gombak, H.Selangor, Rawang, H.Langat, Sepang, Petaling, S.Alam', coords: {lat: 3.2190, lng: 101.7258}},
            {code: 'SGR02', name: 'Kuala Selangor, Sabak Bernam', coords: {lat: 3.3375, lng: 101.2525}},
            {code: 'SGR03', name: 'Klang, Kuala Langat', coords: {lat: 3.0333, lng: 101.5000}}
        ],
        'terengganu': [
            {code: 'TRG01', name: 'Kuala Terengganu, Marang', coords: {lat: 5.3302, lng: 103.1408}},
            {code: 'TRG02', name: 'Besut, Setiu', coords: {lat: 5.8167, lng: 102.5667}},
            {code: 'TRG03', name: 'Hulu Terengganu', coords: {lat: 5.3089, lng: 102.8086}},
            {code: 'TRG04', name: 'Dungun, Kemaman', coords: {lat: 4.7564, lng: 103.4167}}
        ],
        'wlp': [
            {code: 'WLY01', name: 'Kuala Lumpur', coords: {lat: 3.1390, lng: 101.6869}},
            {code: 'WLY02', name: 'Putrajaya', coords: {lat: 2.9264, lng: 101.6964}}
        ],
        'labuan': [
            {code: 'LBN01', name: 'Labuan', coords: {lat: 5.2831, lng: 115.2308}}
        ]
    };

    const HIJRI_MONTHS = [
        'Muharram', 'Safar', 'Rabi\'ul Awal', 'Rabi\'ul Akhir',
        'Jamadil Awal', 'Jamadil Akhir', 'Rejab', 'Syaaban',
        'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijjah'
    ];

    const STATE_NAMES = {
        'johor': 'Johor', 'kedah': 'Kedah', 'kelantan': 'Kelantan',
        'melaka': 'Melaka', 'negerisembilan': 'Negeri Sembilan',
        'pahang': 'Pahang', 'perak': 'Perak', 'perlis': 'Perlis',
        'penang': 'Pulau Pinang', 'sabah': 'Sabah', 'sarawak': 'Sarawak',
        'selangor': 'Selangor', 'terengganu': 'Terengganu',
        'wlp': 'Wilayah Persekutuan', 'labuan': 'Labuan'
    };

    // State
    let currentZoneCode = 'SGR01';
    let currentZoneName = 'Gombak, H.Selangor, Rawang';
    let currentState = 'selangor';
    let prayerTimes = null;
    let monthlyData = null;
    let countdownInterval = null;
    let userLocation = null;

    // DOM Elements
    const stateSelect = document.getElementById('ws-state-select');
    const zoneSelect = document.getElementById('ws-zone-select');
    const detectBtn = document.getElementById('ws-detect-btn');
    const mainContent = document.getElementById('ws-main-content');
    const qiblaBtn = document.getElementById('ws-qibla-btn');
    const shareBtn = document.getElementById('ws-share-btn');
    const monthlyContent = document.getElementById('ws-monthly-content');
    const findMosquesBtn = document.getElementById('ws-find-mosques-btn');
    const mosqueResults = document.getElementById('ws-mosque-results');

    function init() {
        loadSavedZone();
        populateStateSelect();
        setupEventListeners();
        setupTabs();
        loadDefaultData();
    }

    function loadSavedZone() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                currentZoneCode = data.code;
                currentZoneName = data.name;
                currentState = data.state;
            }
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    }

    function saveZone() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                code: currentZoneCode,
                name: currentZoneName,
                state: currentState
            }));
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    }

    function setupTabs() {
        const tabs = document.querySelectorAll('.ws-tool__tab');
        const tabContents = document.querySelectorAll('.ws-tool__tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');

                tabs.forEach(t => t.classList.remove('ws-tool__tab--active'));
                tabContents.forEach(tc => tc.classList.remove('ws-tool__tab-content--active'));

                this.classList.add('ws-tool__tab--active');
                document.getElementById('tab-' + targetTab).classList.add('ws-tool__tab-content--active');

                if (targetTab === 'monthly' && monthlyData && !document.querySelector('.ws-tool__table')) {
                    displayMonthlySchedule();
                }
            });
        });
    }

    function populateStateSelect() {
        const states = Object.keys(JAKIM_ZONES).sort();
        states.forEach(stateKey => {
            const option = document.createElement('option');
            option.value = stateKey;
            option.textContent = STATE_NAMES[stateKey] || stateKey;
            stateSelect.appendChild(option);
        });
        stateSelect.value = currentState;
        populateZoneSelect(currentState);
    }

    function populateZoneSelect(stateKey) {
        zoneSelect.innerHTML = '<option value="">Pilih Zon...</option>';
        if (!stateKey || !JAKIM_ZONES[stateKey]) return;

        JAKIM_ZONES[stateKey].forEach(zone => {
            const option = document.createElement('option');
            option.value = zone.code;
            option.textContent = zone.name;
            zoneSelect.appendChild(option);
        });

        if (JAKIM_ZONES[stateKey].find(z => z.code === currentZoneCode)) {
            zoneSelect.value = currentZoneCode;
        }
    }

    function setupEventListeners() {
        stateSelect.addEventListener('change', function() {
            currentState = this.value;
            populateZoneSelect(currentState);
        });

        zoneSelect.addEventListener('change', function() {
            if (this.value) {
                currentZoneCode = this.value;
                const zone = findZoneByCode(this.value);
                if (zone) {
                    currentZoneName = zone.name;
                    saveZone();
                    loadPrayerTimes();
                }
            }
        });

        detectBtn.addEventListener('click', detectLocation);
        qiblaBtn.addEventListener('click', showQiblaDirection);
        shareBtn.addEventListener('click', shareContent);
        findMosquesBtn.addEventListener('click', findNearbyMosques);
    }

    function findZoneByCode(code) {
        for (const stateKey in JAKIM_ZONES) {
            const zone = JAKIM_ZONES[stateKey].find(z => z.code === code);
            if (zone) return zone;
        }
        return null;
    }

    function loadDefaultData() {
        loadPrayerTimes();
    }

    async function loadPrayerTimes() {
        showLoading();

        try {
            const response = await fetch(CONFIG.JAKIM_API + currentZoneCode);
            if (!response.ok) throw new Error('JAKIM API error');
            
            const data = await response.json();
            
            if (!data.prayerTime || data.prayerTime.length === 0) {
                throw new Error('No data');
            }

            const today = new Date();
            const todayStr = today.getDate();
            const todayData = data.prayerTime.find(day => parseInt(day.date) === todayStr);
            
            if (!todayData) throw new Error('Today data not found');

            prayerTimes = {
                imsak: todayData.imsak,
                fajr: todayData.fajr,
                syuruk: todayData.syuruk,
                dhuhr: todayData.dhuhr,
                asr: todayData.asr,
                maghrib: todayData.maghrib,
                isha: todayData.isha
            };

            monthlyData = data.prayerTime;
            await getHijriDate();
            displayPrayerTimes();

        } catch (error) {
            console.error('JAKIM Error:', error);
            loadPrayerTimesAladhan();
        }
    }

    async function loadPrayerTimesAladhan() {
        try {
            const today = new Date();
            const zone = findZoneByCode(currentZoneCode);
            const coords = zone && zone.coords ? zone.coords : {lat: 3.1390, lng: 101.6869};
            
            const url = `${CONFIG.ALADHAN_API}/calendar/${today.getFullYear()}/${today.getMonth() + 1}?latitude=${coords.lat}&longitude=${coords.lng}&method=3`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.code === 200 && data.data) {
                const todayIndex = today.getDate() - 1;
                const todayData = data.data[todayIndex];
                const timings = todayData.timings;

                prayerTimes = {
                    imsak: timings.Imsak.split(' ')[0],
                    fajr: timings.Fajr.split(' ')[0],
                    syuruk: timings.Sunrise.split(' ')[0],
                    dhuhr: timings.Dhuhr.split(' ')[0],
                    asr: timings.Asr.split(' ')[0],
                    maghrib: timings.Maghrib.split(' ')[0],
                    isha: timings.Isha.split(' ')[0]
                };

                const hijri = todayData.date.hijri;
                window.wsHijriDate = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;

                displayPrayerTimes();
            } else {
                throw new Error('Aladhan API error');
            }
        } catch (error) {
            console.error('Aladhan Error:', error);
            showError('Gagal memuat waktu solat. Sila cuba sebentar lagi atau pilih zon secara manual.');
        }
    }

    async function getHijriDate() {
        try {
            const today = new Date();
            const formatted = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
            
            const response = await fetch(`${CONFIG.ALADHAN_API}/gToH/${formatted}`);
            const data = await response.json();
            
            if (data.code === 200) {
                const hijri = data.data.hijri;
                const monthName = HIJRI_MONTHS[parseInt(hijri.month.number) - 1];
                window.wsHijriDate = `${hijri.day} ${monthName} ${hijri.year} H`;
            }
        } catch (error) {
            window.wsHijriDate = 'Tarikh Hijrah tidak tersedia';
        }
    }

    function displayPrayerTimes() {
        if (!prayerTimes) return;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const times = [
            {name: 'Imsak', time: prayerTimes.imsak},
            {name: 'Subuh', time: prayerTimes.fajr},
            {name: 'Syuruk', time: prayerTimes.syuruk},
            {name: 'Zohor', time: prayerTimes.dhuhr},
            {name: 'Asar', time: prayerTimes.asr},
            {name: 'Maghrib', time: prayerTimes.maghrib},
            {name: 'Isyak', time: prayerTimes.isha}
        ];

        let nextPrayerIndex = -1;
        for (let i = 0; i < times.length; i++) {
            const prayerTime = timeToMinutes(times[i].time);
            if (currentTime < prayerTime) {
                nextPrayerIndex = i;
                break;
            }
        }

        if (nextPrayerIndex === -1) nextPrayerIndex = 0;

        const today = new Date();
        const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 
                       'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
        
        const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
        const hijriStr = window.wsHijriDate || 'Memuatkan...';

        let html = `
            <div class="ws-tool__date">
                <div class="ws-tool__date-hijri">${hijriStr}</div>
                <div class="ws-tool__date-gregorian">${dateStr}</div>
            </div>
            <div class="ws-tool__location">📌 ${currentZoneName} (${currentZoneCode})</div>
            <div class="ws-tool__times">
        `;

        times.forEach((prayer, index) => {
            const isNext = index === nextPrayerIndex;
            html += `
                <div class="ws-tool__time-card ${isNext ? 'ws-tool__time-card--next' : ''}">
                    <div class="ws-tool__time-label">${prayer.name}</div>
                    <div class="ws-tool__time-value">${prayer.time}</div>
                </div>
            `;
        });

        html += '</div>';

        const nextPrayer = times[nextPrayerIndex];
        html += `
            <div class="ws-tool__countdown">
                <div class="ws-tool__countdown-label">Waktu Solat Seterusnya: ${nextPrayer.name}</div>
                <div class="ws-tool__countdown-time" id="ws-countdown-display">Mengira...</div>
            </div>
        `;

        mainContent.innerHTML = html;
        startCountdown(nextPrayer.time);
    }

    function displayMonthlySchedule() {
        if (!monthlyData || monthlyData.length === 0) {
            monthlyContent.innerHTML = '<p style="text-align: center; color: #666;">Data bulanan tidak tersedia.</p>';
            return;
        }

        let html = `
            <table class="ws-tool__table">
                <thead>
                    <tr>
                        <th style="text-align:center;color:#fff;!important;">Tarikh</th>
                        <th style="text-align:center;color:#fff;!important;">Imsak</th>
                        <th style="text-align:center;color:#fff;!important;">Subuh</th>
                        <th style="text-align:center;color:#fff;!important;">Syuruk</th>
                        <th style="text-align:center;color:#fff;!important;">Zohor</th>
                        <th style="text-align:center;color:#fff;!important;">Asar</th>
                        <th style="text-align:center;color:#fff;!important;">Maghrib</th>
                        <th style="text-align:center;color:#fff;!important;">Isyak</th>
                    </tr>
                </thead>
                <tbody>
        `;

        monthlyData.forEach(day => {
            html += `
                <tr>
                    <td>${day.date}</td>
                    <td>${day.imsak}</td>
                    <td>${day.fajr}</td>
                    <td>${day.syuruk}</td>
                    <td>${day.dhuhr}</td>
                    <td>${day.asr}</td>
                    <td>${day.maghrib}</td>
                    <td>${day.isha}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        monthlyContent.innerHTML = html;
    }

    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function startCountdown(nextPrayerTime) {
        if (countdownInterval) clearInterval(countdownInterval);

        const display = document.getElementById('ws-countdown-display');
        if (!display) return;

        function updateCountdown() {
            const now = new Date();
            const [hours, minutes] = nextPrayerTime.split(':').map(Number);
            
            let target = new Date();
            target.setHours(hours, minutes, 0, 0);

            if (target < now) {
                target.setDate(target.getDate() + 1);
            }

            const diff = target - now;
            const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

            display.textContent = `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
        }

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    function detectLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation tidak disokong oleh pelayar anda.');
            return;
        }

        detectBtn.textContent = '🔄 Mengesan...';
        detectBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            async function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                const zone = findNearestZone(userLocation.lat, userLocation.lng);
                
                currentZoneCode = zone.code;
                currentZoneName = zone.name;
                currentState = zone.state;

                stateSelect.value = currentState;
                populateZoneSelect(currentState);
                zoneSelect.value = currentZoneCode;

                saveZone();
                await loadPrayerTimes();

                detectBtn.textContent = '✅ Lokasi Dikesan';
                setTimeout(() => {
                    detectBtn.textContent = '🔎 Auto-Detect Lokasi';
                    detectBtn.disabled = false;
                }, 2000);
            },
            function(error) {
                console.error('Geolocation error:', error);
                alert('Gagal mengesan lokasi. Sila aktifkan GPS atau pilih zon secara manual.');
                detectBtn.textContent = '📍 Auto-Detect Lokasi';
                detectBtn.disabled = false;
            }
        );
    }

    function findNearestZone(lat, lng) {
        let nearest = {code: currentZoneCode, name: currentZoneName, state: currentState};
        let minDistance = Infinity;

        for (const stateKey in JAKIM_ZONES) {
            JAKIM_ZONES[stateKey].forEach(zone => {
                if (zone.coords) {
                    const dist = calculateDistance(lat, lng, zone.coords.lat, zone.coords.lng);
                    if (dist < minDistance) {
                        minDistance = dist;
                        nearest = {
                            code: zone.code,
                            name: zone.name,
                            state: stateKey
                        };
                    }
                }
            });
        }

        return nearest;
    }

    function showQiblaDirection() {
        if (!navigator.geolocation) {
            alert('Geolocation tidak disokong.');
            return;
        }

        qiblaBtn.textContent = '🔄 Mengira...';
        qiblaBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                const kaabaLat = 21.4225;
                const kaabaLng = 39.8262;

                const dLng = (kaabaLng - lng) * Math.PI / 180;
                const lat1 = lat * Math.PI / 180;
                const lat2 = kaabaLat * Math.PI / 180;

                const y = Math.sin(dLng) * Math.cos(lat2);
                const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
                const bearing = Math.atan2(y, x) * 180 / Math.PI;
                const qibla = (bearing + 360) % 360;

                alert(`🧭 Arah Kiblat dari lokasi anda:\n\n${qibla.toFixed(1)}° dari Utara\n\nPanduan: Gunakan kompas telefon dan hadapkan ke arah ${qibla.toFixed(1)}°`);

                qiblaBtn.textContent = '🧭 Arah Kiblat';
                qiblaBtn.disabled = false;
            },
            function(error) {
                alert('Gagal mendapatkan lokasi. Sila aktifkan GPS.');
                qiblaBtn.textContent = '🧭 Arah Kiblat';
                qiblaBtn.disabled = false;
            }
        );
    }

    function findNearbyMosques() {
        if (!navigator.geolocation) {
            alert('Geolocation tidak disokong. Sila aktifkan lokasi untuk cari masjid terdekat.');
            return;
        }

        findMosquesBtn.textContent = '🔄 Mencari...';
        findMosquesBtn.disabled = true;

        mosqueResults.innerHTML = `
            <div class="ws-tool__loading">
                <div class="ws-tool__spinner"></div>
                <p>Mencari masjid dan surau terdekat...</p>
            </div>
        `;

        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                userLocation = {lat, lng};

                try {
                    const query = `
                        [out:json][timeout:25];
                        (
                          node["amenity"="place_of_worship"]["religion"="muslim"](around:${CONFIG.MOSQUE_RADIUS},${lat},${lng});
                          way["amenity"="place_of_worship"]["religion"="muslim"](around:${CONFIG.MOSQUE_RADIUS},${lat},${lng});
                        );
                        out center;
                    `;

                    const response = await fetch(CONFIG.OVERPASS_API + '?data=' + encodeURIComponent(query));
                    const data = await response.json();

                    if (data.elements && data.elements.length > 0) {
                        displayMosqueResults(data.elements, lat, lng);
                    } else {
                        mosqueResults.innerHTML = `
                            <div class="ws-tool__error">
                                <p><strong>🕌 Tiada masjid/surau dijumpai</strong></p>
                                <p>Tiada masjid atau surau dijumpai dalam radius 5km dari lokasi anda.</p>
                                <p style="margin-top: 15px;">
                                    <a href="https://www.google.com/maps/search/masjid/@${lat},${lng},15z" target="_blank" class="ws-tool__mosque-btn">
                                        🗺️ Cari di Google Maps
                                    </a>
                                </p>
                            </div>
                        `;
                    }

                } catch (error) {
                    console.error('Mosque search error:', error);
                    mosqueResults.innerHTML = `
                        <div class="ws-tool__error">
                            <p><strong>⚠️ Ralat Carian</strong></p>
                            <p>Gagal mencari masjid. Sila cuba cari di Google Maps:</p>
                            <p style="margin-top: 15px;">
                                <a href="https://www.google.com/maps/search/masjid/@${lat},${lng},15z" target="_blank" class="ws-tool__mosque-btn">
                                    🗺️ Buka Google Maps
                                </a>
                            </p>
                        </div>
                    `;
                }

                findMosquesBtn.textContent = '📍 Cari Masjid Terdekat';
                findMosquesBtn.disabled = false;
            },
            function(error) {
                console.error('Geolocation error:', error);
                mosqueResults.innerHTML = `
                    <div class="ws-tool__error">
                        <p><strong>⚠️ Lokasi Tidak Dijumpai</strong></p>
                        <p>Gagal mendapatkan lokasi anda. Sila aktifkan GPS dan cuba lagi.</p>
                    </div>
                `;
                findMosquesBtn.textContent = '📍 Cari Masjid Terdekat';
                findMosquesBtn.disabled = false;
            }
        );
    }

    function displayMosqueResults(mosques, userLat, userLng) {
        const mosquesWithDistance = mosques.map(mosque => {
            const lat = mosque.lat || (mosque.center ? mosque.center.lat : null);
            const lon = mosque.lon || (mosque.center ? mosque.center.lon : null);
            
            if (!lat || !lon) return null;

            const distance = calculateDistance(userLat, userLng, lat, lon);
            
            return {
                name: mosque.tags.name || mosque.tags['name:ms'] || mosque.tags['name:en'] || 'Masjid/Surau',
                lat: lat,
                lng: lon,
                distance: distance,
                address: mosque.tags['addr:full'] || mosque.tags['addr:street'] || ''
            };
        }).filter(m => m !== null).sort((a, b) => a.distance - b.distance);

        const top10 = mosquesWithDistance.slice(0, 10);

        if (top10.length === 0) {
            mosqueResults.innerHTML = `
                <div class="ws-tool__error">
                    <p><strong>🕌 Tiada masjid/surau dijumpai</strong></p>
                    <p>Tiada masjid atau surau dijumpai dalam radius 5km.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="ws-tool__success">
                <p><strong>✅ Dijumpai ${top10.length} masjid/surau terdekat</strong></p>
            </div>
            <div class="ws-tool__mosque-list">
        `;
        
        top10.forEach((mosque, index) => {
            html += `
                <div class="ws-tool__mosque-item">
                    <div class="ws-tool__mosque-info">
                        <div class="ws-tool__mosque-name">${index + 1}. ${mosque.name}</div>
                        <div class="ws-tool__mosque-distance">📍 ${mosque.distance.toFixed(2)} km dari anda</div>
                        ${mosque.address ? `<div class="ws-tool__mosque-address">${mosque.address}</div>` : ''}
                    </div>
                    <a href="https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${mosque.lat},${mosque.lng}" target="_blank" class="ws-tool__mosque-btn" aria-label="Dapatkan arah ke ${mosque.name}">
                        🗺️ Arah
                    </a>
                </div>
            `;
        });

        html += '</div>';
        mosqueResults.innerHTML = html;
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function shareContent() {
        if (!prayerTimes) return;

        const text = `🕌 Waktu Solat Hari Ini (${currentZoneName}):\n\n` +
                    `Imsak: ${prayerTimes.imsak}\n` +
                    `Subuh: ${prayerTimes.fajr}\n` +
                    `Syuruk: ${prayerTimes.syuruk}\n` +
                    `Zohor: ${prayerTimes.dhuhr}\n` +
                    `Asar: ${prayerTimes.asr}\n` +
                    `Maghrib: ${prayerTimes.maghrib}\n` +
                    `Isyak: ${prayerTimes.isha}\n\n` +
                    `📅 ${window.wsHijriDate || ''}\n\n` +
                    `Lihat waktu solat: ${window.location.href}`;

        if (navigator.share) {
            navigator.share({
                title: 'Waktu Solat Malaysia',
                text: text
            }).catch(err => console.log('Share cancelled'));
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert('✅ Waktu solat telah disalin ke clipboard!');
            }).catch(() => {
                alert('❌ Gagal menyalin. Sila cuba lagi.');
            });
        }
    }

    function showLoading() {
        mainContent.innerHTML = `
            <div class="ws-tool__loading">
                <div class="ws-tool__spinner"></div>
                <p>Memuatkan waktu solat...</p>
            </div>
        `;
    }

    function showError(message) {
        mainContent.innerHTML = `
            <div class="ws-tool__error">
                <p><strong>⚠️ Ralat</strong></p>
                <p>${message}</p>
            </div>
        `;
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
