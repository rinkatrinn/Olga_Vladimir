document.addEventListener("DOMContentLoaded", () => {
    // Инициализация плавного скролла Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Анимация открытия мокапа телефона и включения музыки
    const gate = document.getElementById('invitation-gate');
    const phoneFrame = document.getElementById('open-letter');
    const bgMusic = document.getElementById('bg-music');

    if (phoneFrame && gate) {
        const openAction = () => {
            phoneFrame.classList.add('is-open');
            document.body.classList.remove('locked');

            // Автоматическое включение музыки при открытии
            if (bgMusic) {
                bgMusic.volume = 0.5;
                bgMusic.play().catch(error => {
                    console.log("Автовоспроизведение заблокировано браузером:", error);
                });
            }

            // Плавное скрытие экрана-заставки
            setTimeout(() => {
                gate.classList.add('fade-out');
                setTimeout(() => {
                    gate.remove();
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                    }
                }, 1000);
            }, 800);
        };

        phoneFrame.addEventListener('click', openAction);
        phoneFrame.addEventListener('touchend', (e) => {
            e.preventDefault();
            openAction();
        });
    }

    // GSAP анимации появления элементов при скролле
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Прогресс бар прокрутки страницы
        gsap.to('.scroll-progress', {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });

        // Плавное появление блоков
        const reveals = document.querySelectorAll('.reveal-up');
        reveals.forEach((elem) => {
            gsap.fromTo(elem, 
                { opacity: 0, y: 40 }, 
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        const revealTexts = document.querySelectorAll('.reveal-text');
        revealTexts.forEach((elem) => {
            gsap.fromTo(elem, 
                { opacity: 0, y: 25 }, 
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }
});