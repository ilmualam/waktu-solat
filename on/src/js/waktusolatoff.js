(function() {
    'use strict';

    const JAKIM_ZONES = {
        'johor': [
            {code: 'JHR01', name: 'Pulau Aur, Pulau Pemanggil'},
            {code: 'JHR02', name: 'Johor Bahru, Kota Tinggi, Mersing, Kulai'},
            {code: 'JHR03', name: 'Kluang, Pontian'},
            {code: 'JHR04', name: 'Batu Pahat, Muar, Segamat, Gemas'}
        ],
        'kedah': [
            {code: 'KDH01', name: 'Kota Setar, Kubang Pasu, Pokok Sena'},
            {code: 'KDH02', name: 'Kuala Muda, Yan, Pendang'},
            {code: 'KDH03', name: 'Padang Terap, Sik'},
            {code: 'KDH04', name: 'Baling'},
            {code: 'KDH05', name: 'Bandar Baharu, Kulim'},
            {code: 'KDH06', name: 'Langkawi'},
            {code: 'KDH07', name: 'Gunung Jerai'}
        ],
        'kelantan': [
            {code: 'KTN01', name: 'Kota Bharu, Bachok, Pasir Puteh, Tumpat, Pasir Mas, Tanah Merah, Machang, Kuala Krai'},
            {code: 'KTN03', name: 'Jeli, Gua Musang (Mukim Galas, Bertam)'}
        ],
        'melaka': [
            {code: 'MLK01', name: 'Seluruh Negeri Melaka'}
        ],
        'negerisembilan': [
            {code: 'NGS01', name: 'Tampin, Jempol'},
            {code: 'NGS02', name: 'Jelebu, Kuala Pilah, Port Dickson, Rembau, Seremban'}
        ],
        'pahang': [
            {code: 'PHG01', name: 'Pulau Tioman'},
            {code: 'PHG02', name: 'Kuantan, Pekan, Rompin, Muadzam Shah'},
            {code: 'PHG03', name: 'Jerantut, Temerloh, Maran, Bera, Chenor, Jengka'},
            {code: 'PHG04', name: 'Bentong, Lipis, Raub'},
            {code: 'PHG05', name: 'Genting Sempah, Janda Baik, Bukit Tinggi'},
            {code: 'PHG06', name: 'Cameron Highlands, Genting Highlands, Bukit Fraser'}
        ],
        'perak': [
            {code: 'PRK01', name: 'Tapah, Slim River, Tanjung Malim'},
            {code: 'PRK02', name: 'Kuala Kangsar, Sg. Siput, Ipoh, Batu Gajah, Kampar'},
            {code: 'PRK03', name: 'Lenggong, Pengkalan Hulu, Grik'},
            {code: 'PRK04', name: 'Temengor, Belum'},
            {code: 'PRK05', name: 'Kg Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar'},
            {code: 'PRK06', name: 'Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor'},
            {code: 'PRK07', name: 'Selama, Taiping, Bagan Serai, Parit Buntar'}
        ],
        'perlis': [
            {code: 'PLS01', name: 'Seluruh Negeri Perlis'}
        ],
        'penang': [
            {code: 'PNG01', name: 'Seluruh Negeri Pulau Pinang'}
        ],
        'sabah': [
            {code: 'SBH01', name: 'Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanggong, Tambisan'},
            {code: 'SBH02', name: 'Beluran, Telupid, Pinangah, Terusan, Kuamut, Bahagian Sandakan (Barat)'},
            {code: 'SBH03', name: 'Lahad Datu, Kunak, Silabukan, Tungku, Sahabat, Semporna'},
            {code: 'SBH04', name: 'Tawau, Balong, Merotai, Kalabakan'},
            {code: 'SBH05', name: 'Kudat, Kota Marudu, Pitas, Pulau Banggi'},
            {code: 'SBH06', name: 'Gunung Kinabalu'},
            {code: 'SBH07', name: 'Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan'},
            {code: 'SBH08', name: 'Pensiangan, Keningau, Tambunan, Nabawan'},
            {code: 'SBH09', name: 'Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pa Sia, Membakut, Weston'}
        ],
        'sarawak': [
            {code: 'SWK01', name: 'Limbang, Lawas, Sundar, Trusan'},
            {code: 'SWK02', name: 'Miri, Niah, Bekenu, Sibuti, Marudi'},
            {code: 'SWK03', name: 'Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu'},
            {code: 'SWK04', name: 'Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit'},
            {code: 'SWK05', name: 'Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai'},
            {code: 'SWK06', name: 'Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok'},
            {code: 'SWK07', name: 'Serian, Simunjan, Samarahan, Sebuyau, Meludam'},
            {code: 'SWK08', name: 'Kuching, Bau, Lundu, Sematan'},
            {code: 'SWK09', name: 'Zon Khas (Kampung Patarikan)'}
        ],
        'selangor': [
            {code: 'SGR01', name: 'Gombak, H.Selangor, Rawang, H.Langat, Sepang, Petaling, S.Alam'},
            {code: 'SGR02', name: 'Kuala Selangor, Sabak Bernam'},
            {code: 'SGR03', name: 'Klang, Kuala Langat'}
        ],
        'terengganu': [
            {code: 'TRG01', name: 'Kuala Terengganu, Marang'},
            {code: 'TRG02', name: 'Besut, Setiu'},
            {code: 'TRG03', name: 'Hulu Terengganu'},
            {code: 'TRG04', name: 'Dungun, Kemaman'}
        ],
        'wlp': [
            {code: 'WLY01', name: 'Kuala Lumpur'},
            {code: 'WLY02', name: 'Putrajaya'}
        ],
        'labuan': [
            {code: 'LBN01', name: 'Labuan'}
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

    let currentZoneCode = 'SGR01';
    let currentZoneName = 'Gombak, H.Selangor, Rawang';
    let currentState = 'selangor';
    let prayerTimes = null;
    let monthlyData = null;
    let countdownInterval = null;
    let userLocation = null;

    const stateSelect = document.getElementById('ws-state-select');
    const zoneSelect = document.getElementById('ws-zone-select');
    const detectBtn = document.getElementById('ws-detect-btn');
    const mainContent = document.getElementById('ws-main-content');
    const qiblaBtn = document.getElementById('ws-qibla-btn');
    const pdfBtn = document.getElementById('ws-pdf-btn');
    const shareBtn = document.getElementById('ws-share-btn');
    const monthlyContent = document.getElementById('ws-monthly-content');
    const findMosquesBtn = document.getElementById('ws-find-mosques-btn');
    const mosqueResults = document.getElementById('ws-mosque-results');

    function init() {
        populateStateSelect();
        setupEventListeners();
        setupTabs();
        loadDefaultData();
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
                    loadPrayerTimes();
                }
            }
        });

        detectBtn.addEventListener('click', detectLocation);
        qiblaBtn.addEventListener('click', showQiblaDirection);
        pdfBtn.addEventListener('click', downloadPDF);
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
            const jakimUrl = `https://www.e-solat.gov.my/index.php?r=esolatApi/TakwimSolat&period=month&zone=${currentZoneCode}`;
            
            const response = await fetch(jakimUrl);
            if (!response.ok) throw new Error('Gagal memuat data dari JAKIM');
            
            const data = await response.json();
            
            if (!data.prayerTime || data.prayerTime.length === 0) {
                throw new Error('Data tidak tersedia');
            }

            const today = new Date();
            const todayStr = today.getDate();
            const todayData = data.prayerTime.find(day => parseInt(day.date) === todayStr);
            
            if (!todayData) {
                throw new Error('Data hari ini tidak tersedia');
            }

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
            console.error('Error:', error);
            showError('Gagal memuat waktu solat. Menggunakan data alternatif...');
            loadPrayerTimesAladhan();
        }
    }

    async function loadPrayerTimesAladhan() {
        try {
            const today = new Date();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            
            const coords = {lat: 3.1390, lng: 101.6869};
            const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${coords.lat}&longitude=${coords.lng}&method=3`;
            
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
                window.wsHijriDate = `${hijri.day} ${hijri.month.en} ${hijri.year}`;

                displayPrayerTimes();
            }
        } catch (error) {
            console.error('Aladhan Error:', error);
            showError('Gagal memuat waktu solat. Sila cuba sebentar lagi.');
        }
    }

    async function getHijriDate() {
        try {
            const today = new Date();
            const formatted = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
            
            const response = await fetch(`https://api.aladhan.com/v1/gToH/${formatted}`);
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
        const hijriStr = window.wsHijriDate || 'Loading...';

        let html = `
            <div class="ws-tool__date">
                <div class="ws-tool__date-hijri">${hijriStr}</div>
                <div class="ws-tool__date-gregorian">${dateStr}</div>
            </div>
            <div class="ws-tool__location">📍 ${currentZoneName} (${currentZoneCode})</div>
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
        if (!monthlyData || monthlyData.length === 0) return;

        let html = `
            <table class="ws-tool__table">
                <thead>
                    <tr>
                        <th style="text-align:center;color:#ffffff;!important;">Tarikh</th>
                        <th style="text-align:center;color:#ffffff;!important;">Imsak</th>
                        <th style="text-align:center;color:#ffffff;!important;">Subuh</th>
                        <th style="text-align:center;color:#ffffff;!important;">Syuruk</th>
                        <th style="text-align:center;color:#ffffff;!important;">Zohor</th>
                        <th style="text-align:center;color:#ffffff;!important;">Asar</th>
                        <th style="text-align:center;color:#ffffff;!important;">Maghrib</th>
                        <th style="text-align:center;color:#ffffff;!important;">Isyak</th>
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

                await loadPrayerTimes();

                detectBtn.textContent = '📍 Auto-Detect Lokasi';
                detectBtn.disabled = false;
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
        if (lat >= 2.5 && lat <= 3.5 && lng >= 101 && lng <= 102) {
            return {code: 'SGR01', name: 'Gombak, H.Selangor, Rawang', state: 'selangor'};
        }
        return {code: currentZoneCode, name: currentZoneName, state: currentState};
    }

    function showQiblaDirection() {
        if (!navigator.geolocation) {
            alert('Geolocation tidak disokong.');
            return;
        }

        navigator.geolocation.getCurrentPosition(function(position) {
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

            alert(`Arah Kiblat dari lokasi anda:\n${qibla.toFixed(1)}° dari Utara\n\nPanduan: Gunakan kompas telefon dan hadapkan ke arah ${qibla.toFixed(1)}°`);
        });
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
                    // Use Overpass API for mosque data
                    const radius = 5000; // 5km
                    const query = `
                        [out:json][timeout:25];
                        (
                          node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
                          way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
                        );
                        out center;
                    `;

                    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
                    
                    const response = await fetch(overpassUrl);
                    const data = await response.json();

                    if (data.elements && data.elements.length > 0) {
                        displayMosqueResults(data.elements, lat, lng);
                    } else {
                        mosqueResults.innerHTML = `
                            <div class="ws-tool__error">
                                <p>Tiada masjid/surau dijumpai dalam radius 5km.</p>
                                <p style="margin-top: 10px; font-size: 0.9em;">Cuba cari di Google Maps:</p>
                                <button class="ws-tool__mosque-btn" onclick="window.open('https://www.google.com/maps/search/masjid/@${lat},${lng},15z', '_blank')" style="margin-top: 10px;">
                                    🗺️ Buka Google Maps
                                </button>
                            </div>
                        `;
                    }

                } catch (error) {
                    console.error('Mosque search error:', error);
                    mosqueResults.innerHTML = `
                        <div class="ws-tool__error">
                            <p>Gagal mencari masjid. Cuba cari di Google Maps:</p>
                            <button class="ws-tool__mosque-btn" onclick="window.open('https://www.google.com/maps/search/masjid/@${lat},${lng},15z', '_blank')" style="margin-top: 10px;">
                                🗺️ Buka Google Maps
                            </button>
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
                        <p>Gagal mendapatkan lokasi anda. Sila aktifkan GPS dan cuba lagi.</p>
                    </div>
                `;
                findMosquesBtn.textContent = '📍 Cari Masjid Terdekat';
                findMosquesBtn.disabled = false;
            }
        );
    }

    function displayMosqueResults(mosques, userLat, userLng) {
        // Calculate distances and sort
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

        // Display top 10
        const top10 = mosquesWithDistance.slice(0, 10);

        if (top10.length === 0) {
            mosqueResults.innerHTML = `
                <div class="ws-tool__error">
                    <p>Tiada masjid/surau dijumpai dalam radius 5km.</p>
                </div>
            `;
            return;
        }

        let html = '<div class="ws-tool__mosque-list">';
        
        top10.forEach((mosque, index) => {
            html += `
                <div class="ws-tool__mosque-item">
                    <div class="ws-tool__mosque-info">
                        <div class="ws-tool__mosque-name">${index + 1}. ${mosque.name}</div>
                        <div class="ws-tool__mosque-distance">📍 ${mosque.distance.toFixed(2)} km dari anda</div>
                        ${mosque.address ? `<div class="ws-tool__mosque-address">${mosque.address}</div>` : ''}
                    </div>
                    <button class="ws-tool__mosque-btn" onclick="window.open('https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${mosque.lat},${mosque.lng}', '_blank')">
                        🗺️ Arah
                    </button>
                </div>
            `;
        });

        html += '</div>';
        mosqueResults.innerHTML = html;
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function downloadPDF() {
        alert('Fungsi PDF akan dilaksanakan tidak lama lagi. Untuk sekarang, anda boleh gunakan Print to PDF dari menu pelayar.');
        window.print();
    }

    function shareContent() {
        if (!prayerTimes) return;

        const text = `Waktu Solat Hari Ini (${currentZoneName}):\n` +
                    `Imsak: ${prayerTimes.imsak}\n` +
                    `Subuh: ${prayerTimes.fajr}\n` +
                    `Syuruk: ${prayerTimes.syuruk}\n` +
                    `Zohor: ${prayerTimes.dhuhr}\n` +
                    `Asar: ${prayerTimes.asr}\n` +
                    `Maghrib: ${prayerTimes.maghrib}\n` +
                    `Isyak: ${prayerTimes.isha}\n\n` +
                    `Lihat di: ${window.location.href}`;

        if (navigator.share) {
            navigator.share({
                title: 'Waktu Solat Malaysia',
                text: text
            });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert('Waktu solat telah disalin ke clipboard!');
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
