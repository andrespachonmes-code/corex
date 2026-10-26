"use strict";

const $ = (s, r = document) => r.querySelector(s);
const esc = (t) =>
  String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const store = {
  get(k, d) {
    try { const v = localStorage.getItem("cx_" + k); return v === null ? d : JSON.parse(v); } catch { return d; }
  },
  set(k, v) {
    try { localStorage.setItem("cx_" + k, JSON.stringify(v)); } catch { }
  },
};

async function hash(texto) {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    let h = 5381;
    for (const c of texto) h = (h * 33) ^ c.charCodeAt(0);
    return "d" + (h >>> 0).toString(16);
  }
}

const RAW = [["Tarjeta Gráfica NVIDIA RTX 4060",1750000,"Hardware","gpu",1,""],
  ["Licencia Windows 11 Home",530000,"Software","app",1,""],
  ["Grand Theft Auto VI",360000,"Videojuegos","game",1,""],
  ["Procesador AMD Ryzen 5 5600X",650000,"Hardware","cpu",1,""],
  ["FL Studio Producer Edition (Producción Musical)",850000,"Software","app",1,""],
  ["Call of Duty: Black Ops 6",320000,"Videojuegos","game",1,""],
  ["Procesador Intel Core i7-12700K",1450000,"Hardware","cpu",0,""],
  ["Antivirus Kaspersky Total Security (1 PC / 1 Año)",90000,"Software","shield",1,""],
  ["Elden Ring",240000,"Videojuegos","game",0,""],
  ["Placa Madre ASUS Prime B550M-A",480000,"Hardware","board",1,""],
  ["Microsoft 365 Personal (1 Año)",250000,"Software","app",0,""],
  ["Cyberpunk 2077: Ultimate Edition",220000,"Videojuegos","game",0,""],
  ["Memoria RAM Corsair Vengeance 16GB DDR4",220000,"Hardware","ram",1,""],
  ["Adobe Creative Cloud (Todos los programas)",240000,"Software","app",0,""],
  ["Minecraft (Java & Bedrock PC)",120000,"Videojuegos","game",0,""],
  ["Disco Duro Sólido SSD Kingston 1TB NVMe",290000,"Hardware","ssd",0,""],
  ["NordVPN (Plan de 1 Año)",210000,"Software","shield",0,""],
  ["Hogwarts Legacy",180000,"Videojuegos","game",0,""],
  ["Gabinete Gamer Corsair 4000D",450000,"Hardware","case",0,""],
  ["Sublime Text Licencia de Desarrollador",390000,"Software","app",0,""],
  ["Red Dead Redemption 2",90000,"Videojuegos","game",0,""],
  ["Monitor Gamer LG UltraGear 24\" 144Hz",750000,"Hardware","monitor",1,""],
  ["AutoCAD LT (Suscripción Anual)",1950000,"Software","app",0,""],
  ["Forza Horizon 5",180000,"Videojuegos","game",0,""],
  ["Teclado Mecánico Logitech G413",320000,"Hardware","keyboard",0,""],
  ["VMware Workstation Pro (Virtualización)",820000,"Software","app",0,""],
  ["Baldur's Gate 3",240000,"Videojuegos","game",0,""],
  ["Mouse Óptico Logitech G502 Hero",210000,"Hardware","mouse",0,""],
  ["WinRAR Licencia Perpetua",110000,"Software","app",0,""],
  ["EA Sports FC 26 (Fútbol)",320000,"Videojuegos","game",0,""]];


const CATS = ["Hardware", "Software", "Videojuegos"];
const FILTROS = ["Productos Destacados", ...CATS];
const PRODUCTS = RAW.map(([name, price, cat, kind, feat, img], i) => ({ id: "w" + (i + 1), name, price, cat, kind, feat: !!feat, img: `imagenes/productos/producto-${String(i + 1).padStart(2, "0")}.png` }));

const wix = (id, w) => `https://static.wixstatic.com/media/${id}/v1/fill/w_${w},h_${w},al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ai-generated-IMAGE.jpg`;
const FOTOS = {
  hero: "26b5e0_47177bd5d28d4a58a2695cd7609893b6~mv2.jpg",
  seleccion: "26b5e0_3e43f41d0ba84f74bcda12e7b1c17731~mv2.jpg",
  a1: "26b5e0_7a68c8fc9acc4d7da3e2c10ffb51dd32~mv2.jpg",
  a2: "26b5e0_8578dfe6e9794b3191bdd1421ce49659~mv2.jpg",
  a3: "26b5e0_7fd9969aa781457d900100305606dfef~mv2.jpg",
};

const BLOG = [
  { id: "b1", foto: "a1", title: "Ingeniería de detalle", resumen: "Cómo leer las especificaciones de un procesador y elegir el que sí necesitas.",
    body: ["Un procesador no se elige solo por su número de núcleos. Conviene mirar la frecuencia, la memoria caché y, sobre todo, para qué lo vas a usar: estudiar, programar, editar video o jugar.", "Antes de comprar, revisa que la placa madre sea compatible con el procesador y que tu fuente de poder tenga potencia suficiente. Un buen equilibrio entre piezas rinde más que una sola pieza muy potente."] },
  { id: "b2", foto: "a2", title: "Desarrollo disruptivo", resumen: "Qué cambia cuando el software y los equipos se diseñan para trabajar juntos.",
    body: ["Hoy los programas aprovechan mejor el hardware: usan la tarjeta gráfica para acelerar tareas, el disco SSD para abrir proyectos más rápido y la memoria RAM para mantener varias herramientas abiertas.", "Si programas, una buena base es 16 GB de RAM, un disco SSD y un monitor cómodo para trabajar muchas horas."] },
  { id: "b3", foto: "a3", title: "Gaming de nueva generación", resumen: "Trazado de rayos, altas tasas de refresco y qué necesitas para aprovecharlos.",
    body: ["El trazado de rayos simula la luz de forma realista, pero exige una tarjeta gráfica moderna. Un monitor de 144 Hz hace que el movimiento se vea más fluido, siempre que el equipo pueda entregar esa cantidad de imágenes por segundo.", "Antes de actualizar, revisa cuál es tu cuello de botella: a veces cambiar la memoria RAM o el disco mejora más la experiencia que cambiar la tarjeta gráfica."] },
];

const NEWS = [
  { title: "Nuevos juegos en la tienda", text: "Revisa los videojuegos disponibles, de aventura, acción y deportes.", href: "#tienda/Videojuegos", cta: "Ver videojuegos" },
  { title: "Piezas y periféricos para tu PC", text: "Procesadores, tarjetas gráficas, monitores, teclados y más.", href: "#tienda/Hardware", cta: "Ver hardware" },
  { title: "Guía para elegir un procesador", text: "Una lectura corta antes de comprar el corazón de tu equipo.", href: "#blog/b1", cta: "Leer la guía" },
];

const SERVICES = [
  { id: "armado", name: "Armado de equipos", text: "Te ayudamos a elegir las piezas y a armar un computador a tu medida." },
  { id: "mantenimiento", name: "Mantenimiento y limpieza", text: "Limpieza interna, cambio de pasta térmica y revisión general." },
  { id: "software", name: "Instalación de software", text: "Instalamos el sistema operativo y los programas que necesites." },
  { id: "asesoria", name: "Asesoría de compra", text: "Te orientamos para elegir las piezas o los programas que necesitas." },
];

const GROUPS = [
  { id: "gamers", name: "Gamers", text: "Equipos, monitores y periféricos para jugar, y los juegos del momento." },
  { id: "programacion", name: "Programación", text: "Herramientas, equipos y licencias para quienes programan o están aprendiendo." },
  { id: "pc", name: "Hardware y PC", text: "Armado, mejoras y consejos para tu computador." },
  { id: "musica", name: "Producción musical", text: "Software y equipos para crear y grabar música." },
];

const STEPS = ["Pedido recibido", "Pago confirmado", "Preparando envío", "En camino", "Entregado"];
const DEMO_ORDER = {
  code: "CX-1001", fixed: 3, createdAt: Date.now() - 86400000, name: "Cliente de ejemplo", city: "Bogotá",
  items: [{ name: "Tarjeta Gráfica NVIDIA RTX 4060", qty: 1, price: 1750000 }], total: 1750000,
};

/* ---------- Ilustraciones de respaldo (SVG) ---------- */
const D = "#1b1f3a";
const ICONS = {
  gpu: `<rect x="30" y="92" width="180" height="62" rx="9" fill="#fff"/><circle cx="90" cy="123" r="21" fill="none" stroke="${D}" stroke-width="5"/><circle cx="150" cy="123" r="21" fill="none" stroke="${D}" stroke-width="5"/><path d="M90 109v28M76 123h28M150 109v28M136 123h28" stroke="${D}" stroke-width="4"/><rect x="38" y="154" width="70" height="8" fill="#ffd36b"/>`,
  cpu: `<rect x="76" y="76" width="88" height="88" rx="8" fill="#fff"/><rect x="96" y="96" width="48" height="48" rx="4" fill="${D}"/><path d="M92 58v18M112 58v18M132 58v18M152 58v18M92 164v18M112 164v18M132 164v18M152 164v18M58 92h18M58 112h18M58 132h18M58 152h18M164 92h18M164 112h18M164 132h18M164 152h18" stroke="#fff" stroke-width="6"/>`,
  ram: `<rect x="24" y="92" width="192" height="56" rx="5" fill="#fff"/><path d="M38 104h30M82 104h30M126 104h30M170 104h30M38 126h30M82 126h30M126 126h30M170 126h30" stroke="${D}" stroke-width="14"/><path d="M34 150h172" stroke="#ffd36b" stroke-width="7" stroke-dasharray="4 3"/>`,
  board: `<rect x="44" y="44" width="152" height="152" rx="8" fill="#fff"/><rect x="68" y="68" width="48" height="48" fill="${D}"/><rect x="132" y="66" width="14" height="64" fill="#ffd36b"/><rect x="154" y="66" width="14" height="64" fill="#ffd36b"/><rect x="66" y="144" width="110" height="10" fill="#8b5cf6"/><rect x="66" y="164" width="110" height="10" fill="#22d3ee"/>`,
  ssd: `<rect x="50" y="72" width="140" height="96" rx="10" fill="#fff"/><rect x="64" y="86" width="112" height="42" rx="5" fill="${D}"/><rect x="80" y="142" width="50" height="10" fill="#ffd36b"/>`,
  hdd: `<rect x="56" y="56" width="128" height="128" rx="12" fill="#fff"/><circle cx="120" cy="112" r="38" fill="none" stroke="${D}" stroke-width="6"/><circle cx="120" cy="112" r="8" fill="${D}"/><rect x="76" y="162" width="88" height="8" fill="#ffd36b"/>`,
  case: `<rect x="70" y="36" width="100" height="168" rx="10" fill="#fff"/><rect x="82" y="50" width="76" height="92" rx="6" fill="${D}"/><circle cx="120" cy="96" r="24" fill="none" stroke="#22d3ee" stroke-width="5"/><rect x="82" y="154" width="76" height="8" fill="#ffd36b"/><rect x="82" y="172" width="76" height="8" fill="#c7cbe8"/>`,
  psu: `<rect x="48" y="70" width="144" height="100" rx="10" fill="#fff"/><circle cx="110" cy="120" r="34" fill="none" stroke="${D}" stroke-width="5"/><path d="M110 92v56M82 120h56" stroke="${D}" stroke-width="4"/><rect x="156" y="96" width="24" height="48" rx="3" fill="#ffd36b"/>`,
  cooler: `<rect x="40" y="52" width="160" height="136" rx="10" fill="#fff"/><circle cx="90" cy="120" r="28" fill="none" stroke="${D}" stroke-width="5"/><circle cx="160" cy="120" r="28" fill="none" stroke="${D}" stroke-width="5"/><path d="M40 70h160M40 170h160" stroke="#22d3ee" stroke-width="5"/>`,
  monitor: `<rect x="32" y="52" width="176" height="112" rx="9" fill="#fff"/><rect x="42" y="62" width="156" height="92" rx="4" fill="${D}"/><path d="M42 140l50-40 40 28 30-22 36 34" stroke="#22d3ee" stroke-width="5" fill="none"/><rect x="108" y="164" width="24" height="22" fill="#fff"/><rect x="82" y="184" width="76" height="9" rx="4" fill="#fff"/>`,
  keyboard: `<rect x="24" y="86" width="192" height="80" rx="9" fill="#fff"/><path d="M38 102h164M38 118h164M38 134h164" stroke="${D}" stroke-width="9" stroke-dasharray="11 5"/><rect x="76" y="146" width="88" height="9" rx="3" fill="${D}"/>`,
  keypad: `<rect x="56" y="56" width="128" height="128" rx="8" fill="#fff"/><path d="M72 78h96M72 104h96M72 130h96M72 156h96" stroke="${D}" stroke-width="14" stroke-dasharray="18 6"/>`,
  mouse: `<rect x="82" y="46" width="76" height="148" rx="38" fill="#fff"/><path d="M120 46v54M82 100h76" stroke="${D}" stroke-width="4"/><rect x="114" y="62" width="12" height="26" rx="6" fill="#22d3ee"/>`,
  headset: `<path d="M64 130V108a56 56 0 0 1 112 0v22" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/><rect x="48" y="118" width="34" height="60" rx="14" fill="#fff"/><rect x="158" y="118" width="34" height="60" rx="14" fill="#fff"/>`,
  mic: `<rect x="94" y="40" width="52" height="92" rx="26" fill="#fff"/><path d="M72 108v10a48 48 0 0 0 96 0v-10M120 166v26M92 194h56" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M104 62h32M104 78h32M104 94h32" stroke="${D}" stroke-width="4"/>`,
  webcam: `<circle cx="120" cy="96" r="52" fill="#fff"/><circle cx="120" cy="96" r="30" fill="${D}"/><circle cx="120" cy="96" r="12" fill="#22d3ee"/><rect x="104" y="148" width="32" height="26" fill="#fff"/><rect x="80" y="172" width="80" height="12" rx="6" fill="#fff"/>`,
  hub: `<rect x="28" y="96" width="184" height="52" rx="10" fill="#fff"/><path d="M50 122h140" stroke="${D}" stroke-width="16" stroke-dasharray="16 10"/>`,
  nic: `<rect x="48" y="104" width="144" height="60" rx="6" fill="#fff"/><rect x="62" y="116" width="50" height="30" fill="${D}"/><path d="M150 104V56M180 104V68" stroke="#fff" stroke-width="9" stroke-linecap="round"/><rect x="64" y="164" width="90" height="8" fill="#ffd36b"/>`,
  capture: `<rect x="48" y="84" width="144" height="76" rx="12" fill="#fff"/><rect x="64" y="104" width="30" height="14" fill="${D}"/><rect x="104" y="104" width="30" height="14" fill="${D}"/><circle cx="168" cy="122" r="8" fill="#ec4899"/>`,
  stand: `<rect x="40" y="48" width="108" height="72" rx="6" fill="#fff" fill-opacity=".55"/><path d="M180 196V84l-34 30" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="150" y="190" width="60" height="10" rx="4" fill="#fff"/>`,
  chip: `<rect x="76" y="64" width="88" height="112" rx="6" fill="${D}" stroke="#fff" stroke-width="3"/><path d="M60 80h16M60 104h16M60 128h16M60 152h16M164 80h16M164 104h16M164 128h16M164 152h16" stroke="#fff" stroke-width="7"/><circle cx="96" cy="84" r="6" fill="#fff"/>`,
  sensor: `<rect x="40" y="76" width="160" height="88" rx="8" fill="#fff"/><circle cx="86" cy="120" r="26" fill="${D}"/><circle cx="154" cy="120" r="26" fill="${D}"/><circle cx="86" cy="120" r="10" fill="#22d3ee"/><circle cx="154" cy="120" r="10" fill="#22d3ee"/><path d="M70 164v16M90 164v16M110 164v16M130 164v16" stroke="#ffd36b" stroke-width="6"/>`,
  led: `<path d="M120 48a44 44 0 0 1 28 78v28h-56v-28a44 44 0 0 1 28-78z" fill="#fff"/><circle cx="120" cy="92" r="16" fill="#ffd36b"/><path d="M104 154v38M136 154v38" stroke="#fff" stroke-width="7"/>`,
  motor: `<rect x="40" y="82" width="104" height="76" rx="14" fill="#fff"/><circle cx="170" cy="120" r="34" fill="${D}" stroke="#fff" stroke-width="6"/><circle cx="170" cy="120" r="9" fill="#fff"/><rect x="144" y="114" width="14" height="12" fill="#fff"/>`,
  lcd: `<rect x="30" y="68" width="180" height="104" rx="9" fill="#fff"/><rect x="42" y="80" width="156" height="80" rx="4" fill="#22d3ee"/><path d="M52 104h130M52 130h96" stroke="${D}" stroke-width="10" stroke-dasharray="12 6"/>`,
  arduino: `<rect x="34" y="62" width="172" height="116" rx="12" fill="#fff"/><rect x="48" y="54" width="104" height="10" fill="${D}"/><rect x="48" y="176" width="104" height="10" fill="${D}"/><rect x="52" y="92" width="40" height="40" fill="${D}"/><circle cx="168" cy="106" r="20" fill="#22d3ee"/>`,
  breadboard: `<rect x="34" y="60" width="172" height="120" rx="8" fill="#fff"/><path d="M50 82h140M50 98h140M50 142h140M50 158h140" stroke="${D}" stroke-width="6" stroke-dasharray="3 7"/><rect x="50" y="116" width="140" height="10" fill="#c7cbe8"/>`,
  jumper: `<path d="M40 90c50 0 50 70 110 70M70 60c60 0 40 120 110 120" stroke="#fff" stroke-width="7" fill="none"/><path d="M50 70c60 0 40 100 100 100" stroke="#ffd36b" stroke-width="7" fill="none"/>`,
  resistor: `<path d="M24 120h40M176 120h40" stroke="#fff" stroke-width="7"/><rect x="64" y="94" width="112" height="52" rx="26" fill="#fff"/><rect x="88" y="94" width="10" height="52" fill="#ec4899"/><rect x="108" y="94" width="10" height="52" fill="${D}"/><rect x="128" y="94" width="10" height="52" fill="#ffd36b"/>`,
  battery: `<rect x="40" y="76" width="160" height="88" rx="8" fill="#fff"/><rect x="54" y="90" width="132" height="22" rx="11" fill="#ffd36b"/><rect x="54" y="120" width="132" height="22" rx="11" fill="#ffd36b"/><path d="M200 108h24M200 130h24" stroke="#ec4899" stroke-width="6"/>`,
  relay: `<rect x="56" y="62" width="128" height="116" rx="8" fill="#22d3ee"/><rect x="76" y="82" width="88" height="50" rx="4" fill="#fff"/><rect x="72" y="146" width="22" height="22" fill="${D}"/><rect x="108" y="146" width="22" height="22" fill="${D}"/><rect x="144" y="146" width="22" height="22" fill="${D}"/>`,
  buzzer: `<circle cx="120" cy="120" r="62" fill="${D}" stroke="#fff" stroke-width="6"/><circle cx="120" cy="120" r="14" fill="#fff"/><path d="M104 188v14M136 188v14" stroke="#fff" stroke-width="6"/>`,
  knob: `<circle cx="120" cy="120" r="64" fill="#fff"/><circle cx="120" cy="120" r="44" fill="${D}"/><path d="M120 120L148 86" stroke="#22d3ee" stroke-width="9" stroke-linecap="round"/>`,
  shield: `<path d="M120 40l66 24v52c0 40-28 66-66 84-38-18-66-44-66-84V64z" fill="#fff"/><path d="M92 120l20 20 38-42" stroke="${D}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
};

function iniciales(n) {
  const w = n.replace(/\(.*?\)/g, "").split(/[\s:\/\-]+/).filter((x) => /[A-Za-z0-9]/.test(x) && (x.length > 2 || /\d/.test(x)));
  return w.slice(0, 3).map((x) => x[0].toUpperCase()).join("");
}

function art(p, label) {
  let h = 0;
  for (const c of p.name) h = (h * 31 + c.charCodeAt(0)) % 360;
  const bg = `<defs><linearGradient id="g${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h} 78% 46%)"/><stop offset="1" stop-color="hsl(${(h + 70) % 360} 82% 26%)"/></linearGradient></defs><rect width="240" height="240" fill="url(#g${p.id})"/>`;
  let draw;
  if (p.kind === "app") {
    draw = `<rect x="56" y="56" width="128" height="128" rx="30" fill="#fff" fill-opacity=".95"/><text x="120" y="134" text-anchor="middle" font-family="Sora,Arial,sans-serif" font-weight="800" font-size="42" fill="${D}">${esc(iniciales(p.name))}</text>`;
  } else if (p.kind === "game") {
    draw = `<rect x="62" y="28" width="116" height="184" rx="8" fill="#0b0c1f" stroke="#fff" stroke-opacity=".7" stroke-width="3"/><text x="120" y="84" text-anchor="middle" font-family="Sora,Arial,sans-serif" font-weight="800" font-size="30" fill="#fff">${esc(iniciales(p.name))}</text><path d="M84 148a22 22 0 0 1 22-22h28a22 22 0 0 1 22 22l8 30a12 12 0 0 1-22 6l-6-10h-32l-6 10a12 12 0 0 1-22-6z" fill="#fff"/><circle cx="112" cy="146" r="5" fill="${D}"/><circle cx="132" cy="140" r="4" fill="${D}"/><circle cx="142" cy="150" r="4" fill="${D}"/>`;
  } else {
    draw = ICONS[p.kind] || ICONS.chip;
  }
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : `aria-hidden="true"`;
  return `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" ${a11y}>${bg}${draw}</svg>`;
}

function pic(p, label) {
  if (!p.img) return art(p, label);
  return `<img src="${p.img}" alt="${esc(label)}" width="252" height="201" loading="lazy" data-id="${p.id}">`;
}
function foto(clave, w, label) {
  return `<img src="${wix(FOTOS[clave], w)}" alt="${esc(label)}" loading="lazy" data-ocultar="1">`;
}
document.addEventListener("error", (e) => {
  const im = e.target;
  if (!im || im.tagName !== "IMG") return;
  if (im.dataset.id) { const p = PRODUCTS.find((x) => x.id === im.dataset.id); if (p) im.outerHTML = art(p, im.alt); }
  else if (im.dataset.ocultar) im.style.visibility = "hidden";
}, true);

/* ---------- Estado ---------- */
let cart = store.get("cart", {});
let users = store.get("users", []);
let session = store.get("session", null);
let orders = store.get("orders", []);
let groups = store.get("groups", {});
let inquiries = store.get("inquiries", []);
let messages = store.get("messages", []);
let filtro = { cat: "Todos", q: "", ord: "rec", shown: 24 };
let lastHash = "#inicio";
let justOrdered = null;

const save = () => {
  store.set("cart", cart); store.set("users", users); store.set("session", session); store.set("orders", orders);
  store.set("groups", groups); store.set("inquiries", inquiries); store.set("messages", messages);
};
const find = (id) => PRODUCTS.find((p) => p.id === id);
const user = () => users.find((u) => u.email === session);
const stepOf = (o) => o.fixed ?? Math.min(4, Math.floor((Date.now() - o.createdAt) / 120000));
const cartLines = () => Object.entries(cart).map(([id, qty]) => ({ p: find(id), qty })).filter((l) => l.p);

let tt;
function toast(msg) {
  const a = $("#aviso");
  a.textContent = msg;
  a.classList.add("ver");
  clearTimeout(tt);
  tt = setTimeout(() => a.classList.remove("ver"), 2400);
}

function updateBar() {
  $("#cuenta").textContent = cartLines().reduce((s, l) => s + l.qty, 0);
  const u = user();
  $("#sesion").innerHTML = u
    ? `<a href="#cuenta">${esc(u.name.split(" ")[0])}</a> · <button type="button" class="link" data-action="salir">Salir</button>`
    : `<a href="#cuenta">Log In</a>`;
}

function addToCart(id, n = 1) {
  if (!find(id)) return;
  cart[id] = Math.min(20, (cart[id] || 0) + n);
  save(); updateBar();
  toast("Agregado al carrito");
}
function removeUnit(id) {
  if (!cart[id]) return;
  cart[id] -= 1;
  if (cart[id] <= 0) delete cart[id];
  save(); updateBar();
}

/* ---------- Vistas ---------- */
const card = (p) => `
  <article class="card">
    <a class="card-img ${p.img ? "foto" : ""}" href="#producto/${p.id}" aria-label="Ver ${esc(p.name)}">${pic(p, "")}</a>
    <div class="card-body">
      <p class="meta">${p.cat}</p>
      <h3><a href="#producto/${p.id}">${esc(p.name)}</a></h3>
      <p class="price">${money(p.price)}</p>
      <button type="button" class="btn" data-action="add" data-id="${p.id}">Agregar al carrito</button>
    </div>
  </article>`;

const PILARES = [
  ["I", "Equipos", "Piezas y dispositivos para armar, mejorar y trabajar mejor cada día.", "Hardware"],
  ["II", "Sistemas", "Licencias y programas para programar, diseñar, proteger y crear.", "Software"],
  ["III", "Gaming Art", "Videojuegos para disfrutar con gráficos de última generación.", "Videojuegos"],
];

const article = (b) => `
  <a class="article" href="#blog/${b.id}">
    <span class="art-img">${foto(b.foto, 600, "")}</span>
    <h3>${b.title}</h3>
    <p>${b.resumen}</p>
  </a>`;

const contactForm = () => `
  <form id="contacto" class="form box">
    <label class="field"><span>Nombre completo*</span><input name="nombre" required autocomplete="name" value="${esc(user() ? user().name : "")}"></label>
    <label class="field"><span>Correo electrónico*</span><input type="email" name="email" required autocomplete="email" value="${esc(session || "")}"></label>
    <label class="field"><span>Asunto*</span><input name="asunto" required maxlength="80"></label>
    <label class="field"><span>Mensaje*</span><textarea name="mensaje" required maxlength="600"></textarea></label>
    <button class="btn">Enviar mensaje</button>
    <p class="ok" id="okContacto" role="status" hidden></p>
  </form>`;

const contactBlock = (h) => `
  <div class="contact-grid">
    <div class="prose">
      <${h}>Contáctanos</${h}>
      <p>Cuéntanos qué necesitas y te ayudamos a encontrarlo: piezas, programas o juegos.</p>
      <p class="note">Demostración: el mensaje se guarda solo en este navegador.</p>
    </div>
    ${contactForm()}
  </div>`;

const home = () => `
  <section class="wrap hero">
    <div class="hero-text">
      <h1>Tecnología de <span class="grad">nivel superior</span></h1>
      <p class="lead">Hardware, software y videojuegos en un solo lugar. Elige, compáralo y recíbelo con seguimiento.</p>
      <div class="actions">
        <a class="btn" href="#tienda">Ir a la tienda</a>
        <a class="btn-line" href="#contacto">Hablar con Corex</a>
      </div>
    </div>
    <div class="hero-art"><img src="imagenes/logo-corex.png" alt="COREX, tecnología que te acompaña" width="900" height="900"></div>
  </section>

  <section class="wrap">
    <div class="pilares">
      ${PILARES.map(([n, t, d, c]) => `
      <a class="pilar" href="#tienda/${encodeURIComponent(c)}">
        <span class="num">${n}</span>
        <h3>${t}</h3>
        <p>${d}</p>
      </a>`).join("")}
    </div>
  </section>

  <section class="wrap">
    <div class="row-head"><h2>Productos <span class="grad">destacados</span></h2><a href="#tienda/Productos%20Destacados">Ver todos</a></div>
    <div class="grid">${PRODUCTS.filter((p) => p.feat).map(card).join("")}</div>
  </section>

  <section class="wrap">
    <div class="seleccion">
      <div class="sel-img">${foto("seleccion", 800, "")}</div>
      <div class="sel-text">
        <h2>Selección de éxito</h2>
        <p>Los productos que más buscan nuestros clientes, reunidos en un solo lugar.</p>
        <a class="btn" href="#tienda/Productos%20Destacados">Explorar el hub</a>
      </div>
    </div>
  </section>

  <section class="wrap">
    <div class="row-head"><h2>Actualidad <span class="grad">Tech</span></h2><a href="#blog">Ver el blog</a></div>
    <div class="articles">${BLOG.map(article).join("")}</div>
  </section>

  <section class="wrap">${contactBlock("h2")}</section>`;

function visibles() {
  const q = filtro.q.trim().toLowerCase();
  const list = PRODUCTS.filter((p) =>
    (filtro.cat === "Todos" || (filtro.cat === "Productos Destacados" ? p.feat : p.cat === filtro.cat)) &&
    (!q || (p.name + " " + p.cat).toLowerCase().includes(q)));
  if (filtro.ord === "asc") list.sort((a, b) => a.price - b.price);
  if (filtro.ord === "desc") list.sort((a, b) => b.price - a.price);
  if (filtro.ord === "az") list.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return list;
}

const catalog = () => `
  <section class="wrap">
    <h1>Todos los <span class="grad">productos</span></h1>
    <div class="tienda">
      <aside class="lateral" aria-label="Explorar por">
        <h2>Explorar por</h2>
        <div id="cats" class="cats"></div>
      </aside>
      <div>
        <div class="tools">
          <label class="field"><span>Buscar</span><input type="search" id="q" value="${esc(filtro.q)}" placeholder="Nombre del producto"></label>
          <label class="field"><span>Ordenar por</span>
            <select id="ord">
              <option value="rec" ${filtro.ord === "rec" ? "selected" : ""}>Recomendados</option>
              <option value="asc" ${filtro.ord === "asc" ? "selected" : ""}>Precio: menor a mayor</option>
              <option value="desc" ${filtro.ord === "desc" ? "selected" : ""}>Precio: mayor a menor</option>
              <option value="az" ${filtro.ord === "az" ? "selected" : ""}>Nombre A-Z</option>
            </select>
          </label>
        </div>
        <p class="count" id="resumen" aria-live="polite"></p>
        <div class="grid" id="lista"></div>
        <p class="mas"><button type="button" class="btn-line" id="masBtn" data-action="mas">Cargar más</button></p>
      </div>
    </div>
  </section>`;

function paintList() {
  const list = visibles();
  const total = PRODUCTS.length;
  $("#resumen").textContent = list.length ? `${list.length} ${list.length === 1 ? "producto" : "productos"}${filtro.cat === "Todos" && !filtro.q ? "" : ` de ${total}`}` : "No hay productos con esa búsqueda. Prueba con otro nombre o categoría.";
  $("#lista").innerHTML = list.slice(0, filtro.shown).map(card).join("");
  $("#masBtn").hidden = list.length <= filtro.shown;
  const cuenta = (c) => (c === "Todos" ? total : c === "Productos Destacados" ? PRODUCTS.filter((p) => p.feat).length : PRODUCTS.filter((p) => p.cat === c).length);
  $("#cats").innerHTML = ["Todos", ...FILTROS].map((c) =>
    `<button type="button" class="chip" data-action="cat" data-cat="${c}" aria-pressed="${c === filtro.cat}">${c === "Todos" ? "Todos los productos" : c} <span>${cuenta(c)}</span></button>`).join("");
}

const notFound = () => `<section class="wrap"><h1>No encontramos esta página</h1><p class="empty">Puede que el producto ya no esté disponible.</p><a class="btn" href="#tienda">Ir a la tienda</a></section>`;

function detail(id) {
  const p = find(id);
  if (!p) return notFound();
  const rel = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  return `
  <section class="wrap">
    <nav class="crumbs" aria-label="Ruta"><a href="#inicio">Inicio</a><span>/</span><a href="#tienda">Tienda</a><span>/</span><a href="#tienda/${encodeURIComponent(p.cat)}">${p.cat}</a><span>/</span><span>${esc(p.name)}</span></nav>
    <div class="detail-grid">
      <div class="big-img ${p.img ? "foto" : ""}">${pic(p, p.name)}</div>
      <div class="info">
        <p class="meta">${p.cat}</p>
        <h1>${esc(p.name)}</h1>
        <p class="price grande">${money(p.price)}</p>
        <label class="field cant"><span>Cantidad*</span><input type="number" id="qty" min="1" max="20" value="1"></label>
        <div class="actions">
          <button type="button" class="btn" data-action="add-qty" data-id="${p.id}">Agregar al carrito</button>
          <button type="button" class="btn-line" data-action="comprar" data-id="${p.id}">Realizar compra</button>
        </div>
        <ul class="trust"><li>Seguimiento del pedido con código</li><li>Pago y entrega acordados al confirmar</li></ul>
      </div>
    </div>
    <h2 class="sec">También te puede <span class="grad">interesar</span></h2>
    <div class="grid">${rel.map(card).join("")}</div>
  </section>`;
}

function cartView() {
  const lines = cartLines();
  if (!lines.length) return `<section class="wrap"><h1>Carrito</h1><p class="empty">Tu carrito está vacío.</p><a class="btn" href="#tienda">Ir a la tienda</a></section>`;
  const total = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const u = user();
  const checkout = u
    ? `<form id="pago" class="form">
        <label class="field"><span>Nombre completo</span><input name="nombre" required value="${esc(u.name)}"></label>
        <label class="field"><span>Ciudad</span><input name="ciudad" required></label>
        <label class="field"><span>Dirección de entrega</span><input name="direccion" required></label>
        <label class="field"><span>Método de pago</span><select name="pago"><option>Tarjeta</option><option>PSE</option><option>Pago contra entrega</option></select></label>
        <button class="btn full">Confirmar pedido</button>
        <p class="note">Demostración: este pedido no genera ningún cobro real.</p>
      </form>`
    : `<p>Para confirmar tu pedido, ingresa o crea tu cuenta.</p><a class="btn full" href="#cuenta">Log In o crear cuenta</a>`;
  return `
  <section class="wrap">
    <h1>Carrito</h1>
    <div class="cart-layout">
      <ul class="lines">
        ${lines.map(({ p, qty }) => `
        <li class="line">
          <div class="thumb ${p.img ? "foto" : ""}">${pic(p, p.name)}</div>
          <div>
            <a class="name" href="#producto/${p.id}">${esc(p.name)}</a>
            <p class="note">${money(p.price)} c/u</p>
            <div class="qty">
              <button type="button" data-action="dec" data-id="${p.id}" aria-label="Quitar una unidad de ${esc(p.name)}">−</button>
              <span aria-live="polite">${qty}</span>
              <button type="button" data-action="inc" data-id="${p.id}" aria-label="Agregar una unidad de ${esc(p.name)}">+</button>
            </div>
          </div>
          <div class="sub"><strong>${money(p.price * qty)}</strong><button type="button" class="link" data-action="remove" data-id="${p.id}">Eliminar</button></div>
        </li>`).join("")}
      </ul>
      <aside class="summary"><p class="total"><span>Total</span> <strong>${money(total)}</strong></p>${checkout}</aside>
    </div>
  </section>`;
}

function account() {
  const u = user();
  if (u) {
    return `
    <section class="wrap">
      <h1>Hola, <span class="grad">${esc(u.name)}</span></h1>
      <p class="note">${esc(u.email)}</p>
      <div class="actions" style="margin:16px 0">
        <a class="btn" href="#rastrear">Mis pedidos</a>
        <a class="btn-line" href="#grupos">Mis grupos</a>
        <button type="button" class="btn-line" data-action="salir">Cerrar sesión</button>
      </div>
    </section>`;
  }
  return `
  <section class="wrap">
    <h1>Log <span class="grad">In</span></h1>
    <div class="two" style="margin-top:20px">
      <div class="box">
        <h2>Ingresar</h2>
        <form id="login" class="form">
          <label class="field"><span>Correo</span><input type="email" name="email" required autocomplete="email"></label>
          <label class="field"><span>Contraseña</span><input type="password" name="clave" required autocomplete="current-password"></label>
          <p class="error" id="errLogin" role="alert"></p>
          <button class="btn full">Ingresar</button>
        </form>
      </div>
      <div class="box">
        <h2>Crear cuenta</h2>
        <form id="registro" class="form">
          <label class="field"><span>Nombre</span><input name="nombre" required autocomplete="name"></label>
          <label class="field"><span>Correo</span><input type="email" name="email" required autocomplete="email"></label>
          <label class="field"><span>Contraseña (mínimo 6 caracteres)</span><input type="password" name="clave" minlength="6" required autocomplete="new-password"></label>
          <p class="error" id="errReg" role="alert"></p>
          <button class="btn full">Crear cuenta</button>
        </form>
      </div>
    </div>
  </section>`;
}

function track(code) {
  const mine = session ? orders.filter((o) => o.email === session) : [];
  let result = "";
  if (code) {
    const o = [...orders, DEMO_ORDER].find((x) => x.code === code.toUpperCase());
    if (o) {
      const s = stepOf(o);
      result = `
      ${justOrdered === o.code ? `<div class="ok"><strong>¡Pedido creado!</strong> Guarda este código para rastrearlo: <strong>${esc(o.code)}</strong></div>` : ""}
      <div class="box">
        <h2>Pedido ${esc(o.code)}</h2>
        <p class="note">${new Date(o.createdAt).toLocaleDateString("es-CO")} · ${esc(o.city)} · ${money(o.total)}</p>
        <ol class="steps">${STEPS.map((t, i) => `<li class="${i < s ? "hecho" : i === s ? "hecho actual" : ""}">${t}</li>`).join("")}</ol>
        <ul>${o.items.map((i) => `<li>${i.qty} × ${esc(i.name)}</li>`).join("")}</ul>
      </div>`;
    } else result = `<p class="error" role="alert">No encontramos el pedido ${esc(code)}. Revisa el código e inténtalo de nuevo.</p>`;
  }
  return `
  <section class="wrap">
    <h1>Rastrear <span class="grad">pedido</span></h1>
    <form id="rastreo" class="inline">
      <label class="field"><span>Código de pedido</span><input name="codigo" value="${esc(code || "")}" placeholder="CX-1001" required></label>
      <button class="btn">Buscar pedido</button>
    </form>
    <p class="note">Para probar, usa el código CX-1001.</p>
    ${result}
    ${mine.length ? `<h2 class="sec">Mis pedidos</h2><ul class="order-list">${mine.map((o) => `<li><a href="#rastrear/${o.code}">${o.code}</a><span>${money(o.total)}</span></li>`).join("")}</ul>` : ""}
  </section>`;
}

const blog = (open) => `
  <section class="wrap">
    <h1><span class="grad">Blog</span></h1>
    <div class="stack">
      ${BLOG.map((b) => `
      <details class="post"${b.id === open ? " open" : ""}>
        <summary>${b.title}</summary>
        <div class="post-body"><div class="post-img">${foto(b.foto, 700, "")}</div><div class="prose">${b.body.map((t) => `<p>${t}</p>`).join("")}</div></div>
      </details>`).join("")}
    </div>
  </section>`;

const news = () => {
  const mine = session ? orders.filter((o) => o.email === session) : [];
  return `
  <section class="wrap">
    <h1><span class="grad">Notificaciones</span></h1>
    <div class="stack">
      ${NEWS.map((n) => `<div class="box"><h2>${n.title}</h2><p>${n.text}</p><p style="margin-top:12px"><a class="btn-line" href="${n.href}">${n.cta}</a></p></div>`).join("")}
    </div>
    <h2 class="sec">Tus pedidos</h2>
    ${session
      ? (mine.length ? `<ul class="order-list">${mine.map((o) => `<li><a href="#rastrear/${o.code}">Pedido ${o.code}</a><span>${STEPS[stepOf(o)]}</span></li>`).join("")}</ul>` : `<p class="empty">Todavía no tienes pedidos.</p>`)
      : `<p class="empty">Ingresa a tu cuenta para ver las novedades de tus pedidos.</p><a class="btn" href="#cuenta">Log In</a>`}
  </section>`;
};

const services = () => `
  <section class="wrap">
    <h1>Nuestros <span class="grad">servicios</span></h1>
    <div class="tiles" style="margin-top:24px">${SERVICES.map((v) => `<div class="tile"><h3>${v.name}</h3><p>${v.text}</p></div>`).join("")}</div>
    <h2 class="sec">Solicita un servicio</h2>
    <form id="servicio" class="form box" style="max-width:560px">
      <label class="field"><span>Servicio</span><select name="servicio">${SERVICES.map((v) => `<option>${v.name}</option>`).join("")}</select></label>
      <label class="field"><span>Nombre completo</span><input name="nombre" required autocomplete="name" value="${esc(user() ? user().name : "")}"></label>
      <label class="field"><span>Correo electrónico</span><input type="email" name="email" required autocomplete="email" value="${esc(session || "")}"></label>
      <label class="field"><span>Cuéntanos qué necesitas</span><textarea name="detalle" required maxlength="600"></textarea></label>
      <button class="btn">Enviar solicitud</button>
      <p class="note">Demostración: la solicitud se guarda solo en este navegador.</p>
      <p class="ok" id="okServicio" role="status" hidden></p>
    </form>
  </section>`;

const groupsView = () => {
  const mine = session ? groups[session] || [] : [];
  return `
  <section class="wrap">
    <h1><span class="grad">Grupos</span></h1>
    <p class="lead" style="margin-top:12px">Elige los temas que te interesan. Tus grupos quedan guardados en tu cuenta.</p>
    <div class="tiles" style="margin-top:24px">
      ${GROUPS.map((g) => {
        const dentro = mine.includes(g.id);
        return `<div class="tile"><h3>${g.name} ${dentro ? '<span class="tag">Eres miembro</span>' : ""}</h3><p>${g.text}</p>
          ${session ? `<button type="button" class="${dentro ? "btn-line" : "btn"}" data-action="grupo" data-id="${g.id}">${dentro ? "Salir del grupo" : "Unirme"}</button>` : `<a class="btn-line" href="#cuenta">Ingresa para unirte</a>`}</div>`;
      }).join("")}
    </div>
  </section>`;
};

const contact = () => `<section class="wrap">${contactBlock("h1")}</section>`;

/* ---------- Router ---------- */
const TITLES = { inicio: "Inicio", tienda: "Tienda", buscar: "Buscar", producto: "Producto", carrito: "Carrito", cuenta: "Log In", blog: "Blog", notificaciones: "Notificaciones", servicios: "Nuestros servicios", grupos: "Grupos", rastrear: "Rastrear pedido", contacto: "Contacto" };

function draw() {
  const [path, rawArg] = (location.hash.slice(1) || "inicio").split("/");
  const arg = decodeURIComponent(rawArg || "");
  if (path === "tienda") Object.assign(filtro, { cat: [...FILTROS].includes(arg) ? arg : "Todos", q: "", ord: "rec", shown: 24 });
  if (path === "buscar") Object.assign(filtro, { cat: "Todos", q: arg, ord: "rec", shown: 24 });
  const views = {
    inicio: home, tienda: catalog, buscar: catalog, producto: () => detail(arg), carrito: cartView, cuenta: account,
    blog: () => blog(arg), notificaciones: news, servicios: services, grupos: groupsView, rastrear: () => track(arg), contacto: contact,
  };
  $("#vista").innerHTML = (views[path] || notFound)();
  if (path === "tienda" || path === "buscar") paintList();
  document.title = `${TITLES[path] || "COREX"} | COREX`;
  document.querySelectorAll(".menu a").forEach((a) => {
    const h = a.getAttribute("href");
    if (h === "#" + path || (path === "buscar" && h === "#tienda") || (path === "producto" && h === "#tienda")) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  updateBar();
  return path;
}

function route() {
  const path = draw();
  $("#menu").classList.remove("abierto");
  $("#menuBtn").setAttribute("aria-expanded", "false");
  if (path !== "cuenta") lastHash = location.hash || "#inicio";
  if (path !== "rastrear") justOrdered = null;
  window.scrollTo(0, 0);
  $("#vista").focus({ preventScroll: true });
}

function toggleGroup(id) {
  if (!session) { location.hash = "#cuenta"; return; }
  const mine = new Set(groups[session] || []);
  const salio = mine.delete(id);
  if (!salio) mine.add(id);
  groups[session] = [...mine];
  save();
  draw();
  toast(salio ? "Saliste del grupo" : "Te uniste al grupo");
  const btn = document.querySelector(`[data-action="grupo"][data-id="${id}"]`);
  if (btn) btn.focus();
}

/* ---------- Eventos ---------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const { action, id, cat } = el.dataset;
  const cantidad = () => Math.max(1, Math.min(20, Number(($("#qty") || {}).value) || 1));
  if (action === "add") addToCart(id);
  if (action === "add-qty") addToCart(id, cantidad());
  if (action === "comprar") { addToCart(id, cantidad()); location.hash = "#carrito"; }
  if (action === "inc") { addToCart(id); draw(); }
  if (action === "dec") { removeUnit(id); draw(); }
  if (action === "remove") { delete cart[id]; save(); draw(); }
  if (action === "cat") { filtro.cat = cat; filtro.shown = 24; history.replaceState(null, "", "#tienda"); paintList(); }
  if (action === "mas") { filtro.shown += 24; paintList(); }
  if (action === "grupo") toggleGroup(id);
  if (action === "salir") { session = null; save(); toast("Cerraste sesión"); if (location.hash === "#cuenta") draw(); else updateBar(); }
  if (action === "menu") { const abierto = $("#menu").classList.toggle("abierto"); el.setAttribute("aria-expanded", String(abierto)); }
});

document.addEventListener("input", (e) => {
  if (e.target.id === "q") { filtro.q = e.target.value; filtro.shown = 24; paintList(); }
});
document.addEventListener("change", (e) => {
  if (e.target.id === "ord") { filtro.ord = e.target.value; paintList(); }
});

document.addEventListener("submit", async (e) => {
  const form = e.target;
  const f = new FormData(form);
  const back = () => (lastHash && lastHash !== "#cuenta" ? lastHash : "#tienda");

  if (form.id === "buscador") {
    e.preventDefault();
    location.hash = "#buscar/" + encodeURIComponent(f.get("q").trim());
  }
  if (form.id === "registro") {
    e.preventDefault();
    const email = f.get("email").trim().toLowerCase();
    if (users.some((u) => u.email === email)) { $("#errReg").textContent = "Ese correo ya tiene una cuenta. Ingresa con él."; return; }
    users.push({ name: f.get("nombre").trim(), email, pass: await hash(f.get("clave")) });
    session = email; save(); updateBar();
    toast("Cuenta creada");
    location.hash = back();
  }
  if (form.id === "login") {
    e.preventDefault();
    const email = f.get("email").trim().toLowerCase();
    const u = users.find((x) => x.email === email);
    if (!u || u.pass !== (await hash(f.get("clave")))) { $("#errLogin").textContent = "Correo o contraseña incorrectos."; return; }
    session = email; save(); updateBar();
    location.hash = back();
  }
  if (form.id === "pago") {
    e.preventDefault();
    const lines = cartLines();
    if (!lines.length) return;
    let code;
    do { code = "CX-" + (Math.floor(Math.random() * 9000) + 2000); } while (orders.some((o) => o.code === code));
    orders.unshift({
      code, email: session, name: f.get("nombre").trim(), city: f.get("ciudad").trim(), address: f.get("direccion").trim(),
      pay: f.get("pago"), createdAt: Date.now(),
      items: lines.map((l) => ({ name: l.p.name, qty: l.qty, price: l.p.price })),
      total: lines.reduce((s, l) => s + l.p.price * l.qty, 0),
    });
    cart = {};
    justOrdered = code;
    save(); updateBar();
    location.hash = "#rastrear/" + code;
  }
  if (form.id === "rastreo") {
    e.preventDefault();
    location.hash = "#rastrear/" + encodeURIComponent(f.get("codigo").trim());
  }
  if (form.id === "servicio") {
    e.preventDefault();
    inquiries.unshift({ servicio: f.get("servicio"), nombre: f.get("nombre").trim(), email: f.get("email").trim(), detalle: f.get("detalle").trim(), fecha: Date.now() });
    save(); form.reset();
    const ok = $("#okServicio"); ok.textContent = "Listo, registramos tu solicitud."; ok.hidden = false;
  }
  if (form.id === "contacto") {
    e.preventDefault();
    messages.unshift({ nombre: f.get("nombre").trim(), email: f.get("email").trim(), asunto: f.get("asunto").trim(), mensaje: f.get("mensaje").trim(), fecha: Date.now() });
    save(); form.reset();
    const ok = $("#okContacto"); ok.textContent = "Listo, recibimos tu mensaje."; ok.hidden = false;
  }
});

window.addEventListener("hashchange", route);
route();
