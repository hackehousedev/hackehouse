/* ─── Cursor ─── */
const cursor = document.getElementById('index-cursor');
const cursorPunto = document.getElementById('index-cursor-punto');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorPunto.style.left = mx + 'px';
    cursorPunto.style.top = my + 'px';
});

function animarCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animarCursor);
}
animarCursor();

document.querySelectorAll('a, button, .index-servicio-tarjeta, .index-cliente-celda').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('activo'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('activo'));
});

/* ─── Progreso de scroll ─── */
const barraProgreso = document.getElementById('index-progreso');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    barraProgreso.style.width = pct + '%';
});

/* ─── Canvas lluvia de código ─── */
(function () {
    const canvas = document.getElementById('index-canvas-fondo');
    const ctx = canvas.getContext('2d');

    function redimensionar() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    redimensionar();
    window.addEventListener('resize', redimensionar);

    const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ{}[]<>/\\|@#$%^&*';
    const TAMANO = 14;
    let cols, gotas;

    function iniciarGotas() {
        cols = Math.floor(canvas.width / TAMANO);
        gotas = Array.from({ length: cols }, () => Math.random() * -canvas.height / TAMANO);
    }
    iniciarGotas();
    window.addEventListener('resize', iniciarGotas);

    function dibujar() {
        ctx.fillStyle = 'rgba(26,26,26,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#f2f2f2';
        ctx.font = TAMANO + 'px "Share Tech Mono", monospace';

        for (let i = 0; i < cols; i++) {
            const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
            const x = i * TAMANO;
            const y = gotas[i] * TAMANO;

            ctx.globalAlpha = Math.random() * 0.5 + 0.1;
            ctx.fillText(ch, x, y);
            ctx.globalAlpha = 1;

            if (y > canvas.height && Math.random() > 0.975) {
                gotas[i] = 0;
            }
            gotas[i] += 0.5;
        }
    }
    setInterval(dibujar, 55);
})();

/* ─── Terminal typing ─── */
const frases = [
    'iniciando sistema seguro...',
    'auditando vulnerabilidades...',
    'compilando soluciones...',
    'desplegando en producción...',
    'construyendo tu próximo proyecto_',
];
let iFrase = 0, iChar = 0, borrando = false;
const elTerminal = document.getElementById('index-terminal-texto');

function escribir() {
    const actual = frases[iFrase];
    if (!borrando) {
        elTerminal.textContent = actual.slice(0, ++iChar);
        if (iChar === actual.length) { borrando = true; setTimeout(escribir, 2200); return; }
    } else {
        elTerminal.textContent = actual.slice(0, --iChar);
        if (iChar === 0) { borrando = false; iFrase = (iFrase + 1) % frases.length; }
    }
    setTimeout(escribir, borrando ? 40 : 70);
}
escribir();

/* ─── Contadores de métricas ─── */
document.querySelectorAll('[data-objetivo]').forEach(el => {
    const objetivo = parseInt(el.dataset.objetivo);
    let actual = 0;
    const paso = Math.max(1, Math.floor(objetivo / 40));
    const intervalo = setInterval(() => {
        actual = Math.min(actual + paso, objetivo);
        el.textContent = actual;
        if (actual >= objetivo) clearInterval(intervalo);
    }, 40);
});

/* ─── Revelar al hacer scroll ─── */
const observador = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observador.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.index-revelar').forEach(el => observador.observe(el));

/* ─── Glitch aleatorio en logo ─── */
const logo = document.querySelector('.index-logo');
setInterval(() => {
    logo.style.transform = `skewX(${(Math.random() - 0.5) * 4}deg)`;
    setTimeout(() => logo.style.transform = '', 80);
}, 5000);
