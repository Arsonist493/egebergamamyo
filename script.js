document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        let cardRafId = null;
        let cardRect = null;

        // Cache rect on enter to avoid repeated getBoundingClientRect calls
        card.addEventListener('mouseenter', () => {
            cardRect = card.getBoundingClientRect();
        });

        card.addEventListener('mousemove', (e) => {
            if (cardRafId) return; // already scheduled this frame
            cardRafId = requestAnimationFrame(() => {
                cardRafId = null;
                if (!cardRect) cardRect = card.getBoundingClientRect();
                const x = e.clientX - cardRect.left;
                const y = e.clientY - cardRect.top;
                const midX = cardRect.width / 2;
                const midY = cardRect.height / 2;
                const rotateX = ((y - midY) / midY) * -2.5;
                const rotateY = ((x - midX) / midX) * 2.5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.005)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            cardRect = null;
            if (cardRafId) {
                cancelAnimationFrame(cardRafId);
                cardRafId = null;
            }
            card.style.transform = '';
        });
    });

    // Cache orb elements and throttle with RAF
    const orbs = Array.from(document.querySelectorAll('.background-orb'));
    let orbRafId = null;

    document.addEventListener('mousemove', (e) => {
        if (orbRafId) return;
        orbRafId = requestAnimationFrame(() => {
            orbRafId = null;
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            orbs.forEach((orb, index) => {
                const speed = index + 1;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    });

    // ============================================================
    // TITLE: Split letters for interactive hover scaling effect
    // ============================================================
    const titleWords = document.querySelectorAll('.title-word');

    titleWords.forEach(word => {
        const text = word.textContent.trim();
        word.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === ' ') {
                const space = document.createElement('span');
                space.className = 'title-space';
                space.innerHTML = '&nbsp;';
                word.appendChild(space);
            } else {
                const span = document.createElement('span');
                span.className = 'title-letter';
                span.textContent = ch;
                word.appendChild(span);
            }
        }
    });

});
