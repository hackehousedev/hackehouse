/* ─── Cursor ─── */
const cursor = document.getElementById('cursor');
const punto = document.getElementById('cursor-punto');
let mx = 0, my = 0, cx = 0, cy = 0;

if (cursor && punto) {
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        punto.style.left = mx + 'px';
        punto.style.top = my + 'px';
    });

    document.querySelectorAll('a, button, .hamburguesa, .menu-link, input, select, textarea, label').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('activo'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('activo'));
    });

    (function animCursor() {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
        requestAnimationFrame(animCursor);
    })();
}

/* ─── Progreso de scroll ─── */
const progreso = document.getElementById('progreso');
if (progreso) {
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
        progreso.style.width = Math.min(pct, 100) + '%';
    });
}

/* ─── Canvas ─── */
const canvas = document.getElementById('canvas-fondo');
const ctx = canvas ? canvas.getContext('2d') : null;
let cols, drops;
const chars = 'HACKHOUSE01AIML∞↯⌬◈>_</>{}[]//∑∇∂';
function initCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 20); drops = Array(cols).fill(1);
}
function drawRain() {
    if (!canvas || !ctx || !drops) return;
    ctx.fillStyle = 'rgba(26,26,26,0.04)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f2f2f2'; ctx.font = '14px Share Tech Mono';
    drops.forEach((y, i) => {
        const c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(c, i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
if (canvas && ctx) {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    setInterval(drawRain, 50);
}

/* ─── Pasos del formulario ─── */
let pasoActual = 1;
const totalPasos = 5;

function irA(paso) {
    document.getElementById(`sec-${pasoActual}`).classList.remove('activa');
    document.querySelectorAll('.step').forEach(s => {
        const n = parseInt(s.dataset.step);
        s.classList.remove('activo', 'completado');
        if (n < paso) s.classList.add('completado');
        if (n === paso) s.classList.add('activo');
    });
    pasoActual = paso;
    document.getElementById(`sec-${paso}`).classList.add('activa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── Contadores de caracteres ─── */
function bindCounter(textareaId, countId) {
    const ta = document.getElementById(textareaId);
    const ct = document.getElementById(countId);
    if (!ta || !ct) return;
    ta.addEventListener('input', () => { ct.textContent = `${ta.value.length} / ${ta.maxLength}`; });
}
bindCounter('bio-textarea', 'bio-count');
bindCounter('desc-curso', 'desc-count');
bindCounter('unico-textarea', 'unico-count');
bindCounter('extras-textarea', 'extras-count');

const tituloCurso = document.getElementById('titulo-curso');
const tituloCount = document.getElementById('titulo-count');
if (tituloCurso && tituloCount) {
    tituloCurso.addEventListener('input', function () {
        tituloCount.textContent = `${this.value.length} / 100`;
    });
}

/* ─── Módulos dinámicos ─── */
let numModulos = 0;

function addModulo(titulo = '', tipo = '', duracion = '') {
    numModulos++;
    const cont = document.getElementById('modulos-container');
    const row = document.createElement('div');
    row.className = 'modulo-row';
    row.dataset.id = numModulos;
    row.innerHTML = `
    <div class="modulo-num-cell">${String(numModulos).padStart(2, '0')}</div>
    <div class="modulo-cell"><input type="text" placeholder="Título de la clase..." value="${titulo}" /></div>
    <div class="modulo-cell">
      <select>
        <option value="">Tipo...</option>
        <option ${tipo === 'video' ? 'selected' : ''}>Video</option>
        <option ${tipo === 'live' ? 'selected' : ''}>Live</option>
        <option ${tipo === 'texto' ? 'selected' : ''}>Texto</option>
        <option ${tipo === 'ejercicio' ? 'selected' : ''}>Ejercicio</option>
        <option ${tipo === 'proyecto' ? 'selected' : ''}>Proyecto</option>
      </select>
    </div>
    <div class="modulo-cell"><input type="text" placeholder="Ej: 20 min" value="${duracion}" /></div>
    <div class="modulo-del-cell"><button class="btn-del-modulo" onclick="delModulo(this, ${numModulos})">✕</button></div>
  `;
    cont.appendChild(row);
    actualizarNums();
    document.getElementById('rango-valor').textContent = cont.children.length;
    document.getElementById('total-modulos-range').value = cont.children.length;
}

function delModulo(btn, id) {
    const row = btn.closest('.modulo-row');
    row.remove();
    actualizarNums();
    const cont = document.getElementById('modulos-container');
    document.getElementById('rango-valor').textContent = cont.children.length;
    document.getElementById('total-modulos-range').value = cont.children.length;
}

function actualizarNums() {
    document.querySelectorAll('.modulo-row').forEach((row, i) => {
        row.querySelector('.modulo-num-cell').textContent = String(i + 1).padStart(2, '0');
    });
}

function sincronizarContador() {
    const val = parseInt(document.getElementById('total-modulos-range').value);
    document.getElementById('rango-valor').textContent = val;
    const current = document.getElementById('modulos-container').children.length;
    if (val > current) {
        for (let i = current; i < val; i++) addModulo();
    } else if (val < current) {
        const rows = document.querySelectorAll('.modulo-row');
        for (let i = rows.length - 1; i >= val; i--) rows[i].remove();
        actualizarNums();
    }
}

function actualizarClases() {
    const n = parseInt(document.getElementById('cant-clases').value) || 0;
    document.getElementById('total-modulos-range').value = Math.min(n, 50);
    document.getElementById('rango-valor').textContent = Math.min(n, 50);
}

// Inicializar con 3 módulos de ejemplo
addModulo('Introducción al curso', 'Video', '10 min');
addModulo('Configuración del entorno', 'Video', '15 min');
addModulo('Primer proyecto práctico', 'Ejercicio', '30 min');

/* ─── Upload ─── */
function mostrarArchivos(inputId, listaId) {
    const input = document.getElementById(inputId);
    const lista = document.getElementById(listaId);
    lista.innerHTML = '';
    Array.from(input.files).forEach(f => {
        const size = f.size > 1024 * 1024 ? (f.size / 1024 / 1024).toFixed(1) + ' MB' : (f.size / 1024).toFixed(0) + ' KB';
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `<span class="upload-item-icon">[ F ]</span><span class="upload-item-name">${f.name}</span><span class="upload-item-size">${size}</span>`;
        lista.appendChild(item);
    });
}

// Drag & drop visual
document.querySelectorAll('.upload-area').forEach(area => {
    area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragover'); });
    area.addEventListener('dragleave', () => area.classList.remove('dragover'));
    area.addEventListener('drop', () => area.classList.remove('dragover'));
});

/* ─── Envío ─── */
function enviarFormulario() {
    const acepto = document.getElementById('acepto-terminos');
    if (!acepto.checked) {
        acepto.closest('.radio-opcion').style.borderColor = 'rgba(242,242,242,0.5)';
        acepto.closest('.radio-opcion').style.background = 'rgba(242,242,242,0.04)';
        setTimeout(() => {
            acepto.closest('.radio-opcion').style.borderColor = '';
            acepto.closest('.radio-opcion').style.background = '';
        }, 1000);
        return;
    }
    // Ocultar form, mostrar éxito
    document.getElementById(`sec-${pasoActual}`).classList.remove('activa');
    document.getElementById('stepper').style.display = 'none';
    const exito = document.getElementById('exito-screen');
    exito.classList.add('visible');
    const id = 'HHA-' + Date.now().toString(36).toUpperCase();
    document.getElementById('exito-id').textContent = '// ID: ' + id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════
// Menú hamburguesa mobile
// ═══════════════════════════════════
const hamburguesa  = document.getElementById('hamburguesa');
const hamLabel     = document.getElementById('ham-label');
const menuOverlay  = document.getElementById('menu-overlay');
let menuEstaAbierto = false;
let animando = false;

function abrirMenu() {
    if (animando) return;
    animando = true;
    menuEstaAbierto = true;

    menuOverlay.classList.add('abierto');
    menuOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-abierto');

    hamburguesa.classList.add('abierto');
    hamburguesa.setAttribute('aria-expanded', 'true');
    hamLabel.textContent = 'CLOSE';

    setTimeout(() => { animando = false; }, 800);
}

function cerrarMenu() {
    if (animando || !menuEstaAbierto) return;
    animando = true;
    menuEstaAbierto = false;

    menuOverlay.classList.add('cerrando');

    hamburguesa.classList.remove('abierto');
    hamburguesa.setAttribute('aria-expanded', 'false');
    hamLabel.textContent = 'MENU';

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

hamburguesa.addEventListener('click', e => {
    e.stopPropagation();
    toggleMenu();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuEstaAbierto) cerrarMenu();
});

document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        if (menuEstaAbierto) cerrarMenu();
    });
});

const menuCta = document.querySelector('.menu-cta');
if (menuCta) {
    menuCta.addEventListener('click', () => {
        if (menuEstaAbierto) cerrarMenu();
    });
}

window.addEventListener('resize', () => {
    // No cerramos el menú por resize para que funcione en todos los viewports
});
