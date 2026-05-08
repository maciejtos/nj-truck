document.addEventListener('DOMContentLoaded', () => {
    // ── Lucide Icons ──
    lucide.createIcons();

    // ── Navbar scroll ──
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        backToTop.classList.toggle('visible', y > 500);
    });

    // ── Back to top ──
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Mobile menu ──
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ── Scroll Reveal Animations ──
    const animElements = document.querySelectorAll('.anim-fade');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => entry.target.classList.add('visible'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animElements.forEach(el => revealObserver.observe(el));

    // ── Card Tilt Effect ──
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── Cursor Glow (desktop) ──
    const cursorGlow = document.getElementById('cursorGlow');
    if (window.matchMedia('(min-width: 993px)').matches && cursorGlow) {
        let mx = 0, my = 0, cx = 0, cy = 0;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            cursorGlow.classList.add('on');
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('on');
        });

        (function loop() {
            cx += (mx - cx) * 0.08;
            cy += (my - cy) * 0.08;
            cursorGlow.style.left = cx + 'px';
            cursorGlow.style.top = cy + 'px';
            requestAnimationFrame(loop);
        })();
    }

    // ── Hero Parallax ──
    const heroImg = document.getElementById('heroImg');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            // Disable parallax on mobile to prevent stuttering/breaking
            if (window.matchMedia('(max-width: 768px)').matches) {
                heroImg.style.transform = '';
                return;
            }
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroImg.style.transform = `scale(${1.05 - y * 0.00005}) translateY(${y * 0.3}px)`;
            }
        }, { passive: true });
    }

    // ── Smooth anchor scroll ──
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            
            // Check if link belongs to current page
            const hashIndex = href.indexOf('#');
            const pathPart = href.substring(0, hashIndex);
            
            const isCurrentPage = pathPart === '' || 
                                  (window.location.pathname.endsWith(pathPart)) || 
                                  (pathPart === 'index.html' && window.location.pathname.endsWith('/'));

            if (isCurrentPage) {
                const hash = href.substring(hashIndex);
                const target = document.querySelector(hash);
                if (target) {
                    e.preventDefault();
                    const offset = navbar.offsetHeight + 10;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    // ── Cookie Consent ──
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAcceptAll = document.getElementById('cookieAcceptAll');
    const cookieRejectAll = document.getElementById('cookieRejectAll');
    const cookieManageBtn = document.getElementById('cookieManageBtn');
    const cookieSavePreferences = document.getElementById('cookieSavePreferences');
    const cookieBackBtn = document.getElementById('cookieBackBtn');
    const cookieMain = document.getElementById('cookieMain');
    const cookiePreferences = document.getElementById('cookiePreferences');
    const cookieMarketingToggle = document.getElementById('cookieMarketingToggle');
    const openCookieSettingsLinks = document.querySelectorAll('.openCookieSettings');

    // Define closeBanner in outer scope so all functions can access it
    const closeBanner = () => {
        if (cookieBanner) {
            cookieBanner.classList.remove('visible');
            cookieBanner.classList.add('hidden');
        }
    };

    function blockFacebookEmbed() {
        const fbEmbed = document.getElementById('fbEmbed');
        if (fbEmbed) {
            const iframe = fbEmbed.querySelector('iframe');
            if (iframe && iframe.src) {
                iframe.dataset.src = iframe.src;
                iframe.removeAttribute('src');
                iframe.style.display = 'none';
            }
            // Show consent message
            if (!fbEmbed.querySelector('.fb-consent-msg')) {
                const msg = document.createElement('div');
                msg.className = 'fb-consent-msg';
                msg.innerHTML = `
                    <p style="text-align:center;color:var(--text-dim);padding:3rem 1.5rem;">
                        <strong style="color:var(--white);display:block;margin-bottom:.5rem;">Wymagana zgoda na cookies marketingowe</strong>
                        Aby wyświetlić opcjonalne treści z Facebooka, zaakceptuj wszystkie pliki cookies w ustawieniach.
                        <br><br>
                        <button class="btn btn-primary fb-accept-all-btn" style="font-size:.85rem;padding:.6rem 1.2rem;">Zaakceptuj wszystkie cookies</button>
                    </p>
                `;
                fbEmbed.appendChild(msg);

                // Attach event listener to the button
                msg.querySelector('.fb-accept-all-btn').addEventListener('click', () => {
                    localStorage.setItem('njtruck_cookie_consent', 'all');
                    if (cookieMarketingToggle) cookieMarketingToggle.checked = true;
                    closeBanner();
                    unblockFacebookEmbed();
                });
            }
        }
    }

    function unblockFacebookEmbed() {
        const fbEmbed = document.getElementById('fbEmbed');
        if (fbEmbed) {
            const iframe = fbEmbed.querySelector('iframe');
            if (iframe && iframe.dataset.src) {
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
                iframe.style.display = 'block';
            }
            const msg = fbEmbed.querySelector('.fb-consent-msg');
            if (msg) msg.remove();
        }
    }

    if (cookieBanner) {
        const consent = localStorage.getItem('njtruck_cookie_consent');

        if (!consent) {
            // Show banner after short delay
            setTimeout(() => cookieBanner.classList.add('visible'), 500);
        } else {
            if (consent === 'all') {
                cookieMarketingToggle.checked = true;
            } else {
                cookieMarketingToggle.checked = false;
            }
        }

        // If consent was not 'all', block Facebook iframe
        if (consent !== 'all') {
            blockFacebookEmbed();
        }

        if (cookieAcceptAll) {
            cookieAcceptAll.addEventListener('click', () => {
                localStorage.setItem('njtruck_cookie_consent', 'all');
                cookieMarketingToggle.checked = true;
                closeBanner();
                unblockFacebookEmbed();
            });
        }

        if (cookieRejectAll) {
            cookieRejectAll.addEventListener('click', () => {
                localStorage.setItem('njtruck_cookie_consent', 'essential');
                cookieMarketingToggle.checked = false;
                closeBanner();
                blockFacebookEmbed();
            });
        }

        if (cookieManageBtn) {
            cookieManageBtn.addEventListener('click', () => {
                cookieMain.style.display = 'none';
                cookiePreferences.style.display = 'block';
            });
        }

        if (cookieBackBtn) {
            cookieBackBtn.addEventListener('click', () => {
                cookiePreferences.style.display = 'none';
                cookieMain.style.display = 'flex';
            });
        }

        if (cookieSavePreferences) {
            cookieSavePreferences.addEventListener('click', () => {
                if (cookieMarketingToggle.checked) {
                    localStorage.setItem('njtruck_cookie_consent', 'all');
                    unblockFacebookEmbed();
                } else {
                    localStorage.setItem('njtruck_cookie_consent', 'essential');
                    blockFacebookEmbed();
                }
                closeBanner();
                setTimeout(() => {
                    cookiePreferences.style.display = 'none';
                    cookieMain.style.display = 'flex';
                }, 500);
            });
        }

        // Open settings from footer / floating button
        openCookieSettingsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                cookieBanner.classList.remove('hidden');
                cookieMain.style.display = 'none';
                cookiePreferences.style.display = 'block';
                
                // Sync toggle with current state
                const currentConsent = localStorage.getItem('njtruck_cookie_consent');
                cookieMarketingToggle.checked = (currentConsent === 'all');
                
                setTimeout(() => cookieBanner.classList.add('visible'), 10);
            });
        });
    }
});
