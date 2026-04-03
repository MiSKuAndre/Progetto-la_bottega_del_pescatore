document.addEventListener('DOMContentLoaded', () => {

    // ── COOKIE BANNER ──
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        const consent = localStorage.getItem('cookieConsent');
        if (consent) {
            // Già scelto in precedenza: nascondi subito senza animazione
            banner.style.display = 'none';
        } else {
            document.getElementById('cookieAccept').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                banner.classList.add('hidden');
                setTimeout(() => banner.style.display = 'none', 350);
            });
            document.getElementById('cookieDecline').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                banner.classList.add('hidden');
                setTimeout(() => banner.style.display = 'none', 350);
            });
        }
    }
    
    // 1. Scroll reveal: Anima gli elementi quando appaiono a schermo
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Aggiunge un piccolo ritardo progressivo per un effetto cascata
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));

    // 2. Nav scroll effect: Riduce la navbar quando si scende con la pagina
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.style.padding = '.8rem 3rem';
            nav.style.boxShadow = '0 4px 30px rgba(0,0,0,.4)';
            nav.style.background = 'rgba(5,21,37,0.95)';
        } else {
            nav.style.padding = '1.2rem 3rem';
            nav.style.boxShadow = 'none';
            nav.style.background = 'rgba(5,21,37,0.85)';
        }
    });

    // 3. Highlight current day: Evidenzia il giorno corrente nella tabella orari
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const today = days[new Date().getDay()];
    
    document.querySelectorAll('.orari-table td:first-child').forEach(td => {
        if (td.textContent.trim().startsWith(today)) {
            const row = td.closest('tr');
            row.style.background = 'rgba(244,161,42,0.08)';
            td.style.color = '#f4a12a'; // Colore gold
            td.style.fontWeight = '700';
        }
    });

    // 4. Smooth scroll per i link interni (opzionale, già gestito da CSS)
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 5. Recensioni carousel
    const track = document.getElementById('recensioniTrack');
    const dotsContainer = document.getElementById('recDots');
    if (track) {
        const cards = track.querySelectorAll('.recensione-card');
        const visibleCount = window.innerWidth <= 900 ? 1 : 3;
        const maxIndex = Math.ceil(cards.length / visibleCount) - 1;
        let current = 0;

        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.className = 'rec-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }

        function goTo(index) {
            current = Math.max(0, Math.min(index, maxIndex));
            const cardWidth = cards[0].offsetWidth + 28;
            track.style.transform = `translateX(-${current * cardWidth * visibleCount}px)`;
            dotsContainer.querySelectorAll('.rec-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        document.getElementById('recPrev').addEventListener('click', () => goTo(current - 1));
        document.getElementById('recNext').addEventListener('click', () => goTo(current + 1));
        setInterval(() => goTo(current < maxIndex ? current + 1 : 0), 5000);
    }
});