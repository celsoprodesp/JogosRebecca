(function() {
    console.log('Iniciando o Mundo Mágico...');

    const globeContainer = document.getElementById('globe-container');
    const infoPanel = document.getElementById('info-panel');
    const countryNameEl = document.getElementById('country-name');
    const countryFlagEl = document.getElementById('country-flag');
    const challengeBtn = document.getElementById('challenge-btn');
    const challengeFeedbackEl = document.getElementById('challenge-feedback');

    let world;
    let countriesData = [];
    let translations = {}; // PT-BR Translations
    let targetCountry = null;
    let isChallengeActive = false;

    // Translation Source (ISO 3166-1 alpha-2 -> PT-BR)
    const TRANSLATIONS_URL = 'https://raw.githubusercontent.com/umpirsky/country-list/master/data/pt_BR/country.json';
    const GEOJSON_URL = 'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

    function getCountryName(d) {
        const code = d.properties.ISO_A2 || d.properties.BRK_A2;
        return translations[code] || d.properties.NAME;
    }

    function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode === '-99') return '🌍';
        try {
            const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
            return String.fromCodePoint(...codePoints);
        } catch (e) { return '🌍'; }
    }

    function initGlobe() {
        console.log('Dados carregados, inicializando o globo 3D...');
        
        try {
            if (typeof Globe === 'undefined') {
                throw new Error('A biblioteca Globe.gl não foi detectada. Verifique se o script no HTML foi carregado.');
            }

            world = Globe()
                (globeContainer)
                .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-day.jpg')
                .backgroundColor('rgba(0,0,0,0)')
                .showAtmosphere(true)
                .atmosphereColor('#FAD7F7')
                .polygonsData(countriesData)
                .polygonCapColor(() => '#86EFAC')
                .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
                .polygonStrokeColor(() => '#FFF')
                .onPolygonHover(hoverD => world
                    .polygonAltitude(d => d === hoverD ? 0.05 : 0.01)
                    .polygonCapColor(d => d === hoverD ? '#FF4DA6' : '#86EFAC')
                )
                .onPolygonClick(d => {
                    selectCountry(d);
                })
                .polygonLabel(d => `
                    <div style="background: white; color: #FF4DA6; padding: 10px; border-radius: 10px; border: 2px solid #FF4DA6; font-family: 'Bubblegum Sans'; font-size: 1.2rem; pointer-events: none;">
                        <b>${getCountryName(d)}</b>
                    </div>
                `);

            // Position camera on South America
            world.pointOfView({ lat: -15, lng: -55, altitude: 2.5 });

            console.log('Globo inicializado com sucesso!');
        } catch (err) {
            console.error('Falha crítica na inicialização do globo:', err);
            document.body.innerHTML += `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border:3px solid red;z-index:9999;">
                <h3>Erro ao carregar o globo 🌍</h3>
                <p>Ocorreu um erro técnico: ${err.message}</p>
                <p>Tente recarregar a página ou verifique sua conexão.</p>
            </div>`;
        }
    }

    function selectCountry(d) {
        const name = getCountryName(d);
        const code = d.properties.ISO_A2 || d.properties.BRK_A2;
        
        countryNameEl.textContent = name;
        countryFlagEl.textContent = getFlagEmoji(code);
        infoPanel.style.display = 'block';

        if (isChallengeActive) {
            if (name === getCountryName(targetCountry)) {
                handleWin();
            } else {
                challengeFeedbackEl.textContent = "Não é esse! Tente novamente! ✨";
                challengeFeedbackEl.style.color = "#FF4DA6";
            }
        } else {
            challengeFeedbackEl.textContent = "Explorando o mundo...";
            challengeFeedbackEl.style.color = "#666";
        }
    }

    function startChallenge() {
        if (countriesData.length === 0) return;
        isChallengeActive = true;
        targetCountry = countriesData[Math.floor(Math.random() * countriesData.length)];
        challengeBtn.textContent = `Encontre: ${getCountryName(targetCountry)} 🔍`;
        challengeBtn.style.background = '#FFD700';
        infoPanel.style.display = 'none';
        world.pointOfView({ altitude: 3.5 }, 1000);
    }

    function handleWin() {
        isChallengeActive = false;
        challengeBtn.textContent = "Você conseguiu! ✨ Outro?";
        challengeBtn.style.background = '#22C55E';
        challengeBtn.style.color = "white";
        challengeFeedbackEl.textContent = "PARABÉNS! Você achou! 🌈";
        challengeFeedbackEl.style.color = "#22C55E";
        if (window.confetti) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FF4DA6', '#FFD700', '#C084FC', '#86EFAC'] });
        }
    }

    // Load data and start
    Promise.all([
        fetch(GEOJSON_URL).then(res => res.json()),
        fetch(TRANSLATIONS_URL).then(res => res.json())
    ])
    .then(([geojson, translationsData]) => {
        countriesData = geojson.features;
        translations = translationsData;
        initGlobe();
    })
    .catch(err => {
        console.error('Erro ao buscar dados:', err);
        initGlobe(); // Try anyway with empty data
    });

    challengeBtn.addEventListener('click', startChallenge);
})();
