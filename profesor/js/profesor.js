/* ─── Cursor ─── */
const cursor = document.getElementById('cursor');
const punto = document.getElementById('cursor-punto');
let mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; punto.style.left = mx + 'px'; punto.style.top = my + 'px'; });
document.querySelectorAll('a,button,input,select,textarea,label,.nav-item,.kpi-card,.panel,.alumno-card,.modulo-fila').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('activo'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('activo'));
});
(function anim() { cx += (mx - cx) * .12; cy += (my - cy) * .12; cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; requestAnimationFrame(anim); })();

/* ─── Progreso scroll ─── */
const progreso = document.getElementById('progreso');
window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progreso.style.width = Math.min(p, 100) + '%';
});

/* ─── Canvas ─── */
const canvas = document.getElementById('canvas-fondo');
const ctx = canvas.getContext('2d');
let cols, drops;
const chars = 'HACKHOUSE01AIML∞↯⌬◈>_</>{}[]//∑∇∂';
function initCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; cols = Math.floor(canvas.width / 20); drops = Array(cols).fill(1); }
function drawRain() {
    ctx.fillStyle = 'rgba(26,26,26,.04)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#f2f2f2'; ctx.font = '14px Share Tech Mono';
    drops.forEach((y, i) => { const c = chars[Math.floor(Math.random() * chars.length)]; ctx.fillText(c, i * 20, y * 20); if (y * 20 > canvas.height && Math.random() > .975) drops[i] = 0; drops[i]++; });
}
initCanvas(); window.addEventListener('resize', initCanvas); setInterval(drawRain, 50);

/* ─── Reloj ─── */
function actualizarReloj() { const d = new Date(); document.getElementById('topbar-hora').textContent = d.toLocaleTimeString('es-AR', { hour12: false }) + ' · ART'; }
actualizarReloj(); setInterval(actualizarReloj, 1000);

/* ─── Navegación entre vistas ─── */
const titulos = { overview: 'Overview', curso: 'Mi Curso', alumnos: 'Alumnos', finanzas: 'Finanzas', analytics: 'Analytics', reseñas: 'Reseñas', notificaciones: 'Notificaciones', perfil: 'Mi Perfil' };
const rutas = { overview: '// dashboard_docente.exe', curso: '// estructura_curso.json', alumnos: '// registro_alumnos.db', finanzas: '// finanzas_instructor.dat', analytics: '// analytics_engine.py', reseñas: '// feedback.json', notificaciones: '// sys_notifications.log', perfil: '// perfil_instructor.json' };

function irVista(nombre) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('activo'));
    document.getElementById('vista-' + nombre).classList.add('activa');
    document.querySelector('[data-vista="' + nombre + '"]')?.classList.add('activo');
    document.getElementById('topbar-seccion').textContent = titulos[nombre] || nombre;
    document.getElementById('topbar-ruta').textContent = rutas[nombre] || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // En móvil cerramos el menú al cambiar de vista para liberar espacio.
    if (window.matchMedia('(max-width: 760px)').matches) {
        cerrarMenuMovil();
    }
}

document.querySelectorAll('.nav-item[data-vista]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); irVista(el.dataset.vista); });
});

document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => { btn.closest('.alumnos-filtros').querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo')); btn.classList.add('activo'); });
});

/* ─── Menu movil ─── */
const sidebar = document.getElementById('sidebar');
const menuMovilBtn = document.getElementById('menu-movil-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function abrirMenuMovil() {
    if (!sidebar || !menuMovilBtn || !sidebarOverlay) return;
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('activo');
    document.body.classList.add('menu-abierto');
    menuMovilBtn.textContent = '[ close ]';
    menuMovilBtn.setAttribute('aria-expanded', 'true');
}

function cerrarMenuMovil() {
    if (!sidebar || !menuMovilBtn || !sidebarOverlay) return;
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('activo');
    document.body.classList.remove('menu-abierto');
    menuMovilBtn.textContent = '[ menu ]';
    menuMovilBtn.setAttribute('aria-expanded', 'false');
}

if (menuMovilBtn && sidebarOverlay) {
    menuMovilBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
            cerrarMenuMovil();
            return;
        }
        abrirMenuMovil();
    });

    sidebarOverlay.addEventListener('click', cerrarMenuMovil);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            cerrarMenuMovil();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) {
            cerrarMenuMovil();
        }
    });
}

/* ─── Chart barras inscripciones ─── */
const dataMeses = [
    { m: 'AGO', v: 8 }, { m: 'SEP', v: 14 }, { m: 'OCT', v: 11 }, { m: 'NOV', v: 22 }, { m: 'DIC', v: 18 },
    { m: 'ENE', v: 31 }, { m: 'FEB', v: 27 }, { m: 'MAR', v: 38 }, { m: 'ABR', v: 33 }, { m: 'MAY', v: 42 },
    { m: 'JUN', v: 48 }, { m: 'JUL', v: 52 }
];
const maxV = Math.max(...dataMeses.map(d => d.v));
function renderBarras(containerId, data, suffix = '') {
    const cont = document.getElementById(containerId);
    if (!cont) return;
    cont.innerHTML = '';
    data.forEach(d => {
        const pct = Math.round((d.v / maxV) * 100);
        const w = document.createElement('div');
        w.className = 'barra-wrap';
        w.innerHTML = `<div class="barra" style="height:${pct}%"><span class="barra-tip">${d.v}${suffix}</span></div><div class="barra-mes">${d.m}</div>`;
        cont.appendChild(w);
    });
}
renderBarras('chart-barras', dataMeses);

/* ─── Chart barras finanzas ─── */
const dataFinanzas = [
    { m: 'AGO', v: 220 }, { m: 'SEP', v: 310 }, { m: 'OCT', v: 280 }, { m: 'NOV', v: 450 }, { m: 'DIC', v: 380 },
    { m: 'ENE', v: 520 }, { m: 'FEB', v: 490 }, { m: 'MAR', v: 610 }, { m: 'ABR', v: 570 }, { m: 'MAY', v: 680 }, { m: 'JUN', v: 740 }, { m: 'JUL', v: 680 }
];
const maxF = Math.max(...dataFinanzas.map(d => d.v));
function renderFinanzas() {
    const cont = document.getElementById('chart-finanzas');
    if (!cont) return;
    cont.innerHTML = '';
    dataFinanzas.forEach(d => {
        const pct = Math.round((d.v / maxF) * 100);
        const w = document.createElement('div');
        w.className = 'barra-wrap';
        w.innerHTML = `<div class="barra" style="height:${pct}%"><span class="barra-tip">$${d.v}</span></div><div class="barra-mes">${d.m}</div>`;
        cont.appendChild(w);
    });
}
renderFinanzas();

/* ─── Tabla de módulos ─── */
const modulos = [
    { n: 1, titulo: 'Introducción al curso y setup del entorno', tipo: 'Video', dur: '12 min', estado: 'publicada' },
    { n: 2, titulo: 'Fundamentos de embeddings y vectores', tipo: 'Video', dur: '38 min', estado: 'publicada' },
    { n: 3, titulo: 'PostgreSQL con pgvector: instalación y config', tipo: 'Video', dur: '44 min', estado: 'publicada' },
    { n: 4, titulo: 'Tu primer embedding con OpenAI API', tipo: 'Ejercicio', dur: '25 min', estado: 'publicada' },
    { n: 5, titulo: 'Indexado eficiente: HNSW vs IVFFlat', tipo: 'Video', dur: '52 min', estado: 'publicada' },
    { n: 6, titulo: 'Búsqueda por similitud coseno', tipo: 'Video', dur: '35 min', estado: 'publicada' },
    { n: 7, titulo: 'Chunking strategies para documentos largos', tipo: 'Video', dur: '40 min', estado: 'publicada' },
    { n: 8, titulo: 'LangChain: introducción y cadenas básicas', tipo: 'Video', dur: '48 min', estado: 'publicada' },
    { n: 9, titulo: 'RAG pipeline completo: paso a paso', tipo: 'Proyecto', dur: '90 min', estado: 'publicada' },
    { n: 10, titulo: 'RetrievalQA y ConversationalRetrievalChain', tipo: 'Video', dur: '44 min', estado: 'publicada' },
    { n: 11, titulo: 'Metadatos y filtrado híbrido', tipo: 'Ejercicio', dur: '30 min', estado: 'publicada' },
    { n: 12, titulo: 'RAG multimodal con imágenes', tipo: 'Video', dur: '56 min', estado: 'publicada' },
    { n: 13, titulo: 'Evaluación del sistema RAG (RAGAs)', tipo: 'Video', dur: '42 min', estado: 'publicada' },
    { n: 14, titulo: 'Caching de embeddings con Redis', tipo: 'Video', dur: '38 min', estado: 'publicada' },
    { n: 15, titulo: 'Optimización de queries en pgvector', tipo: 'Ejercicio', dur: '35 min', estado: 'publicada' },
    { n: 16, titulo: 'Arquitectura multi-tenant', tipo: 'Video', dur: '48 min', estado: 'publicada' },
    { n: 17, titulo: 'Deploy con FastAPI en Railway', tipo: 'Video', dur: '60 min', estado: 'publicada' },
    { n: 18, titulo: 'Monitoring con LangSmith', tipo: 'Video', dur: '35 min', estado: 'publicada' },
    { n: 19, titulo: 'Fine-tuning de embeddings custom', tipo: 'Video', dur: '—', estado: 'borrador' },
    { n: 20, titulo: 'Seguridad y rate limiting en RAG APIs', tipo: 'Video', dur: '—', estado: 'borrador' },
    { n: 21, titulo: 'Testing de sistemas RAG', tipo: 'Ejercicio', dur: '—', estado: 'borrador' },
    { n: 22, titulo: 'Escalado horizontal del pipeline', tipo: 'Video', dur: '—', estado: 'borrador' },
    { n: 23, titulo: 'CI/CD para sistemas de IA', tipo: 'Video', dur: '—', estado: 'borrador' },
    { n: 24, titulo: 'Proyecto final: RAG deployable completo', tipo: 'Proyecto', dur: '—', estado: 'borrador' },
];

function renderModulos() {
    const lista = document.getElementById('modulos-lista');
    if (!lista) return;
    lista.innerHTML = '';
    modulos.forEach(m => {
        const fila = document.createElement('div');
        fila.className = 'modulo-fila ' + m.estado;
        fila.innerHTML = `
          <div class="modulo-celda num">${String(m.n).padStart(2, '0')}</div>
          <div class="modulo-celda titulo"><div class="modulo-estado-dot"></div>${m.titulo}</div>
          <div class="modulo-celda"><span class="modulo-tipo-badge">${m.tipo}</span></div>
          <div class="modulo-celda">${m.dur}</div>
          <div class="modulo-celda"><span class="modulo-tipo-badge">${m.estado === 'publicada' ? '✓ publicada' : 'borrador'}</span></div>
        `;
        lista.appendChild(fila);
    });
}
renderModulos();

/* ─── Tabla alumnos ─── */
const alumnos = [
    { ini: 'VS', n: 'Valentina Suárez', ingreso: '15 dic 2025', acceso: 'hoy', avance: 91, estado: 'activa' },
    { ini: 'LM', n: 'Lucas Medina', ingreso: '18 dic 2025', acceso: 'hace 2 días', avance: 72, estado: 'activa' },
    { ini: 'CR', n: 'Camila Reyes', ingreso: '20 dic 2025', acceso: 'ayer', avance: 58, estado: 'activa' },
    { ini: 'FG', n: 'Franco García', ingreso: '22 dic 2025', acceso: 'hace 3 días', avance: 35, estado: 'activa' },
    { ini: 'MA', n: 'Martín Álvarez', ingreso: '1 ene 2026', acceso: 'hace 1 semana', avance: 100, estado: 'completó' },
    { ini: 'RL', n: 'Roxana López', ingreso: '3 ene 2026', acceso: 'hace 10 días', avance: 100, estado: 'completó' },
    { ini: 'DB', n: 'Diego Benítez', ingreso: '5 ene 2026', acceso: 'hace 15 días', avance: 44, estado: 'inactiva' },
    { ini: 'SV', n: 'Sofía Vidal', ingreso: '8 ene 2026', acceso: 'hace 2 días', avance: 81, estado: 'activa' },
    { ini: 'NT', n: 'Nicolás Torres', ingreso: '10 ene 2026', acceso: 'hoy', avance: 12, estado: 'activa' },
    { ini: 'JP', n: 'Jorge Pereira', ingreso: 'hoy', acceso: 'hoy', avance: 4, estado: 'activa' },
];

function renderAlumnos() {
    const tabla = document.getElementById('tabla-alumnos');
    if (!tabla) return;
    tabla.innerHTML = '';
    alumnos.forEach((a, i) => {
        const row = document.createElement('div');
        row.className = 'alumno-card';
        row.innerHTML = `
          <div class="alumno-card-celda" style="display:flex;align-items:center;justify-content:center;">
            <div style="width:28px;height:28px;border:1px solid rgba(242,242,242,.15);display:flex;align-items:center;justify-content:center;font-family:var(--fuente-titulo);font-size:.55rem;color:rgba(242,242,242,.35);">${a.ini}</div>
          </div>
          <div class="alumno-card-celda nombre">${a.n}</div>
          <div class="alumno-card-celda">${a.ingreso}</div>
          <div class="alumno-card-celda">${a.acceso}</div>
          <div class="alumno-card-celda">
            <div style="width:100%">
              <div class="progreso-mini"><div class="progreso-mini-fill" style="width:${a.avance}%"></div></div>
              <div style="font-family:var(--fuente-mono);font-size:.52rem;color:rgba(242,242,242,.25);margin-top:3px;letter-spacing:.08em;">${a.avance}%</div>
            </div>
          </div>
          <div class="alumno-card-celda"><span class="modulo-tipo-badge">${a.estado}</span></div>
        `;
        tabla.appendChild(row);
    });
}
renderAlumnos();

/* ─── Tabla transacciones ─── */
const transacciones = [
    { id: 'TXN-00124', fecha: '1 ene 2026', concepto: 'Revenue share · Diciembre', ventas: 18, monto: 680, estado: 'pagado' },
    { id: 'TXN-00098', fecha: '1 dic 2025', concepto: 'Revenue share · Noviembre', ventas: 16, monto: 610, estado: 'pagado' },
    { id: 'TXN-00071', fecha: '1 nov 2025', concepto: 'Revenue share · Octubre', ventas: 12, monto: 480, estado: 'pagado' },
    { id: 'TXN-00052', fecha: '1 oct 2025', concepto: 'Revenue share · Septiembre', ventas: 10, monto: 390, estado: 'pagado' },
    { id: 'TXN-00134', fecha: '1 feb 2026', concepto: 'Revenue share · Enero', ventas: 20, monto: 312, estado: 'pendiente' },
];

function renderTransacciones() {
    const tbody = document.getElementById('tabla-transacciones');
    if (!tbody) return;
    tbody.innerHTML = '';
    transacciones.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="opacity:.35;font-size:.6rem;">${t.id}</td>
          <td>${t.fecha}</td>
          <td>${t.concepto}</td>
          <td style="text-align:center;">${t.ventas}</td>
          <td class="positivo">USD ${t.monto}</td>
          <td class="tag"><span class="tabla-tag">${t.estado}</span></td>
        `;
        tbody.appendChild(tr);
    });
}
renderTransacciones();

/* ─── Módulos top (analytics) ─── */
const modulosTop = [
    { n: 'Mod 09 — RAG pipeline completo', v: 1240, pct: 100 },
    { n: 'Mod 02 — Fundamentos de embeddings', v: 1190, pct: 96 },
    { n: 'Mod 17 — Deploy con FastAPI', v: 1050, pct: 85 },
    { n: 'Mod 12 — RAG multimodal', v: 890, pct: 72 },
    { n: 'Mod 01 — Intro y setup', v: 1380, pct: 100 },
].sort((a, b) => b.v - a.v);

function renderModulosTop() {
    const cont = document.getElementById('modulos-top');
    if (!cont) return;
    cont.innerHTML = '';
    modulosTop.forEach(m => {
        const el = document.createElement('div');
        el.style.cssText = 'margin-bottom:12px;';
        el.innerHTML = `
          <div style="display:flex;justify-content:space-between;font-family:var(--fuente-mono);font-size:.62rem;color:rgba(242,242,242,.4);letter-spacing:.04em;margin-bottom:5px;">
            <span>${m.n}</span><span style="color:rgba(242,242,242,.25);">${m.v} vistas</span>
          </div>
          <div style="height:3px;background:rgba(242,242,242,.06);">
            <div style="height:100%;width:${m.pct}%;background:rgba(242,242,242,.3);transition:width .4s;"></div>
          </div>`;
        cont.appendChild(el);
    });
}
renderModulosTop();

/* ─── Embudo de conversión ─── */
const embudoData = [
    { label: 'Visitaron el landing', n: 3240, pct: 100 },
    { label: 'Hicieron click en "inscribirse"', n: 648, pct: 20 },
    { label: 'Llegaron al checkout', n: 260, pct: 8 },
    { label: 'Completaron la compra', n: 124, pct: 3.8 },
    { label: 'Completaron el curso', n: 38, pct: 1.2 },
];

function renderEmbudo() {
    const cont = document.getElementById('embudo');
    if (!cont) return;
    cont.innerHTML = '';
    embudoData.forEach(e => {
        const el = document.createElement('div');
        el.innerHTML = `
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:4px;">
            <span style="font-family:var(--fuente-mono);font-size:.62rem;color:rgba(242,242,242,.4);letter-spacing:.04em;min-width:260px;">${e.label}</span>
            <span style="font-family:var(--fuente-titulo);font-size:.85rem;font-weight:900;color:rgba(242,242,242,.6);min-width:48px;">${e.n.toLocaleString('es')}</span>
            <div style="flex:1;height:6px;background:rgba(242,242,242,.05);">
              <div style="height:100%;width:${e.pct}%;background:rgba(242,242,242,.25);"></div>
            </div>
            <span style="font-family:var(--fuente-mono);font-size:.58rem;color:rgba(242,242,242,.2);min-width:38px;text-align:right;">${e.pct}%</span>
          </div>`;
        cont.appendChild(el);
    });
}
renderEmbudo();

/* ─── Notificaciones ─── */
const notifs = [
    { tipo: 'inscripcion', texto: '<strong>Jorge Pereira</strong> se inscribió en tu curso.', hora: 'hace 2 horas', leida: false },
    { tipo: 'reseña', texto: '<strong>Valentina Suárez</strong> dejó una reseña de ★★★★★.', hora: 'hace 3 horas', leida: false },
    { tipo: 'pago', texto: 'Pago acreditado <strong>USD 312</strong> — revenue share enero 2026.', hora: 'hace 5 horas', leida: false },
    { tipo: 'sistema', texto: 'Módulo 18 publicado correctamente. Visible para los alumnos.', hora: 'ayer · 18:30', leida: true },
    { tipo: 'pregunta', texto: '<strong>María López</strong> hizo una pregunta en módulo 07.', hora: 'ayer · 22:41', leida: true },
    { tipo: 'sistema', texto: 'Tu tasa de retención subió al <strong>82%</strong> — nuevo récord.', hora: 'hace 3 días', leida: true },
    { tipo: 'inscripcion', texto: '<strong>Sofía Vidal</strong> se inscribió en tu curso.', hora: 'hace 4 días', leida: true },
];

const iconosNotif = { inscripcion: '◉', reseña: '★', pago: '$', sistema: '⊞', pregunta: '?' };

function renderNotifs() {
    const lista = document.getElementById('lista-notifs');
    if (!lista) return;
    lista.innerHTML = '';
    notifs.forEach(n => {
        const el = document.createElement('div');
        el.className = 'alerta';
        el.style.marginBottom = '8px';
        if (n.leida) el.style.opacity = '.5';
        el.innerHTML = `
          <div class="alerta-icono">${iconosNotif[n.tipo] || '·'}</div>
          <div class="alerta-texto">${n.texto}</div>
          <span class="alerta-hora">${n.hora}</span>
        `;
        lista.appendChild(el);
    });
}
renderNotifs();

/* ─── Tareas toggle ─── */
document.querySelectorAll('.tarea-item').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('done'));
});