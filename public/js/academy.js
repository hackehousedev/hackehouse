/* ════════════════════════════════════════════
   HackHouse Academy — academy.js
   Incluye: cursor, canvas, terminal, contadores,
            menú fullscreen, modal docente
════════════════════════════════════════════ */

// ─── Cursor personalizado ───────────────────
const cursor = document.getElementById('cursor');
const punto  = document.getElementById('cursor-punto');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    punto.style.left = mx + 'px';
    punto.style.top  = my + 'px';
});

document.querySelectorAll('a, button, .modulo-tarjeta, .campo-input, .campo-select, .menu-link').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('activo'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('activo'));
});

(function animCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animCursor);
})();


// ─── Barra de progreso de scroll ────────────
const progreso = document.getElementById('progreso');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progreso.style.width = pct + '%';
});


// ─── Canvas — lluvia de código ──────────────
const canvas = document.getElementById('canvas-fondo');
const ctx    = canvas.getContext('2d');
let cols, drops;
const chars = 'HACKHOUSE01AIML∞↯⌬◈>_</>{}[]//∑∇∂';

function initCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / 20);
    drops = Array(cols).fill(1);
}

function drawRain() {
    ctx.fillStyle = 'rgba(26,26,26,0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f2f2f2';
    ctx.font = '14px Share Tech Mono';
    drops.forEach((y, i) => {
        const c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(c, i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}

initCanvas();
window.addEventListener('resize', initCanvas);
setInterval(drawRain, 50);


// ─── Terminal typewriter ─────────────────────
const frases = [
    'iniciando_modulo_01.py...',
    'entrenando modelo de lenguaje...',
    'desplegando agente autónomo...',
    'conectando base de conocimiento...',
    'generando embeddings...',
    'bienvenido a la academia.',
];
let fi = 0, ci = 0, borrando = false;
const termEl = document.getElementById('terminal-texto');

function typewriter() {
    const frase = frases[fi];
    if (!borrando) {
        termEl.textContent = frase.slice(0, ci + 1);
        ci++;
        if (ci === frase.length) {
            borrando = true;
            setTimeout(typewriter, 1800);
            return;
        }
    } else {
        termEl.textContent = frase.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
            borrando = false;
            fi = (fi + 1) % frases.length;
        }
    }
    setTimeout(typewriter, borrando ? 40 : 80);
}
typewriter();


// ─── Contadores animados + revelar ──────────
function animarContador(el, objetivo) {
    let actual = 0;
    const paso = Math.max(1, Math.floor(objetivo / 40));
    const iv = setInterval(() => {
        actual = Math.min(actual + paso, objetivo);
        el.textContent = actual;
        if (actual >= objetivo) clearInterval(iv);
    }, 40);
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            if (e.target.classList.contains('metrica-numero')) {
                animarContador(e.target, parseInt(e.target.dataset.objetivo));
            }
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.revelar, .metrica-numero').forEach(el => observer.observe(el));


// ═════════════════════════════════════════════
//   MENÚ FULLSCREEN — lógica principal
// ═════════════════════════════════════════════
const hamburguesa  = document.getElementById('hamburguesa');
const hamLabel     = document.getElementById('ham-label');
const menuOverlay  = document.getElementById('menu-overlay');
let menuEstaAbierto = false;
let animando = false;               // evita doble clic durante transición

function abrirMenu() {
    if (animando) return;
    animando = true;
    menuEstaAbierto = true;

    // Activar overlay y bloquear body
    menuOverlay.classList.add('abierto');
    menuOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-abierto');

    // Cambiar ícono
    hamburguesa.classList.add('abierto');
    hamburguesa.setAttribute('aria-expanded', 'true');
    hamLabel.textContent = 'CLOSE';

    // Liberar animando tras la duración del menú
    setTimeout(() => { animando = false; }, 800);
}

function cerrarMenu() {
    if (animando || !menuEstaAbierto) return;
    animando = true;
    menuEstaAbierto = false;

    // Clase de salida — activa animaciones de cierre
    menuOverlay.classList.add('cerrando');

    // Cambiar ícono inmediatamente
    hamburguesa.classList.remove('abierto');
    hamburguesa.setAttribute('aria-expanded', 'false');
    hamLabel.textContent = 'MENU';

    // Tras la animación, limpiar clases
    setTimeout(() => {
        menuOverlay.classList.remove('abierto', 'cerrando');
        menuOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-abierto');
        animando = false;
    }, 750);
}

function toggleMenu() {
    menuEstaAbierto ? cerrarMenu() : abrirMenu();
}

// Click en el botón
hamburguesa.addEventListener('click', e => {
    e.stopPropagation();
    toggleMenu();
});

// Cerrar con ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuEstaAbierto) cerrarMenu();
});

// Cerrar al hacer click en un link del menú
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        if (menuEstaAbierto) cerrarMenu();
    });
});

// Cerrar si se hace clic en el CTA del menú
const menuCta = document.querySelector('.menu-cta');
if (menuCta) {
    menuCta.addEventListener('click', () => {
        if (menuEstaAbierto) cerrarMenu();
    });
}

// Resize: cerrar si pasa a desktop grande (opcional)
window.addEventListener('resize', () => {
    // No cerramos el menú por resize para que funcione en todos los viewports
});


// ═════════════════════════════════════════════
//   MODAL — postulación docente
// ═════════════════════════════════════════════
const modalEl     = document.getElementById('modal-docente');
const btnAbrir    = document.getElementById('abrir-modal-docente');
const btnCerrar   = document.getElementById('cerrar-modal');
const btnEnviar   = document.querySelector('.btn-enviar');

if (btnAbrir && modalEl) {
    btnAbrir.addEventListener('click', e => {
        const href = (btnAbrir.getAttribute('href') || '').trim();
        // Solo abrir modal en enlaces internos tipo "#".
        if (href === '#' || href === '') {
            e.preventDefault();
            modalEl.classList.add('abierto');
        }
    });
}

if (btnCerrar && modalEl) {
    btnCerrar.addEventListener('click', () => modalEl.classList.remove('abierto'));
}

if (modalEl) {
    modalEl.addEventListener('click', e => {
        if (e.target === modalEl) modalEl.classList.remove('abierto');
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalEl?.classList.contains('abierto')) {
        modalEl.classList.remove('abierto');
    }
});

if (btnEnviar && modalEl) {
    btnEnviar.addEventListener('click', () => {
        btnEnviar.textContent = '✓ Postulación enviada';
        btnEnviar.style.pointerEvents = 'none';
        setTimeout(() => {
            modalEl.classList.remove('abierto');
            setTimeout(() => {
                btnEnviar.textContent = 'Enviar postulación →';
                btnEnviar.style.pointerEvents = '';
            }, 400);
        }, 1400);
    });
}