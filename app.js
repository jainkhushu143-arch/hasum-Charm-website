const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const products = {
  keychain: {
    name: "Keychain",
    label: "KEYCHAIN — LIVE EDIT",
    description: "Choose the hardware that suits your everyday carry.",
    limit: 5,
    bases: [
      { id: "classic", name: "Classic ring", detail: "Silver · 5 positions", price: 299, swatch: "#aaa8a3" },
      { id: "carabiner", name: "Soft carabiner", detail: "Graphite · 4 positions", price: 349, swatch: "#5d5b58" },
      { id: "chain", name: "Long chain", detail: "Silver · 5 positions", price: 399, swatch: "#c2bdb5" },
    ],
    anchors: [[48, 57], [43, 67], [52, 70], [38, 78], [57, 80]],
  },
  scarf: {
    name: "Scarf",
    label: "SCARF — LIVE EDIT",
    description: "Choose a silk colour before composing your pins and talismans.",
    limit: 6,
    bases: [
      { id: "wine", name: "Bordeaux silk", detail: "68 × 68 cm · hand rolled", price: 1499, swatch: "#6d1f32" },
      { id: "ivory", name: "Soft ivory", detail: "68 × 68 cm · hand rolled", price: 1499, swatch: "#e7dfd1" },
      { id: "noir", name: "Evening noir", detail: "68 × 68 cm · hand rolled", price: 1599, swatch: "#282522" },
    ],
    anchors: [[35, 37], [49, 42], [62, 37], [40, 56], [55, 59], [68, 54]],
  },
  brooch: {
    name: "Jeans brooch",
    label: "JEANS BROOCH — LIVE EDIT",
    description: "Select the brooch foundation that will sit against your denim.",
    limit: 5,
    bases: [
      { id: "bar", name: "Pin bar", detail: "Antique silver · 5 positions", price: 449, swatch: "#a9a39a" },
      { id: "chain", name: "Double chain", detail: "Polished silver · 4 positions", price: 549, swatch: "#c6c0b6" },
      { id: "ribbon", name: "Velvet ribbon", detail: "Wine · 5 positions", price: 499, swatch: "#70253a" },
    ],
    anchors: [[36, 43], [48, 48], [60, 43], [42, 61], [57, 62]],
  },
  bracelet: {
    name: "Bracelet",
    label: "BRACELET — LIVE EDIT",
    description: "Choose a bracelet finish, then space your charms around the chain.",
    limit: 7,
    bases: [
      { id: "silver", name: "Silver links", detail: "Adjustable · 7 positions", price: 699, swatch: "#bcb8b0" },
      { id: "gold", name: "Warm gold", detail: "Adjustable · 7 positions", price: 799, swatch: "#bd9658" },
      { id: "cord", name: "Bordeaux cord", detail: "Sliding knot · 6 positions", price: 599, swatch: "#70253a" },
    ],
    anchors: [[25, 56], [34, 69], [46, 75], [58, 74], [69, 66], [76, 53], [70, 39]],
  },
};

const charms = [
  { id: "heart", name: "Love token", category: "Symbols", price: 149, kind: "heart", color: "#8d2942" },
  { id: "star", name: "North star", category: "Symbols", price: 129, kind: "star", color: "#c09a52" },
  { id: "pearl", name: "Little pearl", category: "Classics", price: 179, kind: "pearl", color: "#e9dfcc" },
  { id: "bow", name: "Silk bow", category: "Classics", price: 169, kind: "bow", color: "#bd7d85" },
  { id: "cherry", name: "Cherry pair", category: "Objects", price: 189, kind: "cherry", color: "#8b2035" },
  { id: "initial", name: "Initial C", category: "Letters", price: 199, kind: "initial", color: "#eee5d8" },
  { id: "lock", name: "Keepsake lock", category: "Symbols", price: 189, kind: "lock", color: "#aaa49b" },
  { id: "moon", name: "Soft moon", category: "Symbols", price: 149, kind: "moon", color: "#d2c5aa" },
  { id: "flower", name: "Pressed flower", category: "Nature", price: 179, kind: "flower", color: "#a76873" },
  { id: "dice", name: "Lucky dice", category: "Objects", price: 159, kind: "dice", color: "#eee8dc" },
  { id: "camera", name: "Tiny camera", category: "Objects", price: 219, kind: "camera", color: "#373431" },
  { id: "bolt", name: "Lightning", category: "Symbols", price: 139, kind: "bolt", color: "#b69a63" },
];

const state = {
  product: "keychain",
  bases: Object.fromEntries(Object.entries(products).map(([key, product]) => [key, product.bases[0].id])),
  designs: Object.fromEntries(Object.keys(products).map((key) => [key, []])),
  selectedUid: null,
  step: "base",
  category: "All",
  view: "edit",
};

let uid = 0;
let drag = null;
let toastTimer = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const elements = {
  stage: $("#preview-stage"),
  baseArt: $("#base-art"),
  placed: $("#placed-charms"),
  empty: $("#empty-preview"),
  pieceCount: $("#piece-count"),
  previewLabel: $("#preview-label"),
  baseDescription: $("#base-description"),
  baseOptions: $("#base-options"),
  charmGrid: $("#charm-grid"),
  categoryFilter: $("#category-filter"),
  selectionLimit: $("#selection-limit"),
  selectedControls: $("#selected-controls"),
  selectedName: $("#selected-charm-name"),
  summaryProduct: $("#summary-product"),
  summaryBase: $("#summary-base"),
  summaryCharms: $("#summary-charms"),
  summaryTotal: $("#summary-total"),
  toast: $("#toast"),
};

function metalDefs() {
  return `
    <defs>
      <linearGradient id="silver" x1="0" x2="1">
        <stop offset="0" stop-color="#625f5b"/><stop offset=".18" stop-color="#f4f0e8"/>
        <stop offset=".42" stop-color="#98938d"/><stop offset=".7" stop-color="#f5f1e9"/><stop offset="1" stop-color="#68645f"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" x2="1">
        <stop offset="0" stop-color="#775c2f"/><stop offset=".22" stop-color="#ead49d"/>
        <stop offset=".55" stop-color="#ae8544"/><stop offset=".8" stop-color="#f1db9e"/><stop offset="1" stop-color="#7e6033"/>
      </linearGradient>
    </defs>`;
}

function keychainBase(id) {
  if (id === "carabiner") {
    return `<svg viewBox="0 0 600 520" role="img" aria-label="Graphite carabiner keychain">
      ${metalDefs()}
      <path d="M170 105 C80 140 74 300 157 348 C240 397 350 352 372 267 C389 199 340 121 274 103" fill="none" stroke="#474542" stroke-width="29" stroke-linecap="round"/>
      <path d="M273 103 L373 160" stroke="url(#silver)" stroke-width="25" stroke-linecap="round"/>
      <circle cx="315" cy="341" r="27" fill="none" stroke="url(#silver)" stroke-width="13"/>
      <path d="M315 369 C317 395 311 415 300 436" fill="none" stroke="url(#silver)" stroke-width="12" stroke-dasharray="11 8"/>
      <circle cx="300" cy="448" r="15" fill="none" stroke="url(#silver)" stroke-width="8"/>
    </svg>`;
  }
  if (id === "chain") {
    return `<svg viewBox="0 0 600 520" role="img" aria-label="Long silver chain keychain">
      ${metalDefs()}
      <circle cx="250" cy="155" r="112" fill="none" stroke="url(#silver)" stroke-width="22"/>
      <circle cx="399" cy="178" r="64" fill="none" stroke="url(#silver)" stroke-width="19"/>
      <path d="M322 229 C349 253 347 293 323 315 C299 337 302 376 326 398" fill="none" stroke="url(#silver)" stroke-width="18" stroke-dasharray="14 10"/>
      <path d="M325 398 C326 428 309 451 300 475" fill="none" stroke="url(#silver)" stroke-width="15" stroke-dasharray="11 8"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 600 520" role="img" aria-label="Classic silver ring keychain">
    ${metalDefs()}
    <circle cx="235" cy="188" r="127" fill="none" stroke="url(#silver)" stroke-width="23"/>
    <path d="M350 226 C381 253 404 279 415 311" fill="none" stroke="url(#silver)" stroke-width="18"/>
    <path d="M363 149 C416 116 487 155 481 219 C476 273 415 297 374 260" fill="none" stroke="url(#silver)" stroke-width="22" stroke-linecap="round"/>
    <path d="M411 310 C410 347 395 379 399 417" fill="none" stroke="url(#silver)" stroke-width="14" stroke-dasharray="12 8"/>
    <circle cx="399" cy="434" r="18" fill="none" stroke="url(#silver)" stroke-width="9"/>
  </svg>`;
}

function scarfBase(id) {
  const palette = {
    wine: ["#5f172b", "#8b354a", "#d8b59d"],
    ivory: ["#ddd4c6", "#f3ece1", "#8b6f60"],
    noir: ["#1d1c1b", "#3b3835", "#c3a67f"],
  }[id];
  return `<svg viewBox="0 0 600 520" role="img" aria-label="${id} silk scarf">
    <defs><linearGradient id="fabric" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette[0]}"/><stop offset=".48" stop-color="${palette[1]}"/><stop offset="1" stop-color="${palette[0]}"/></linearGradient></defs>
    <path d="M102 78 L493 107 L465 446 L92 408 Z" fill="url(#fabric)" stroke="${palette[2]}" stroke-width="7"/>
    <path d="M125 107 L460 130 L440 412 L121 388 Z" fill="none" stroke="${palette[2]}" stroke-width="3" opacity=".75"/>
    <path d="M92 408 L279 250 L465 446" fill="none" stroke="${palette[2]}" stroke-width="2" opacity=".45"/>
    <path d="M102 78 L279 250 L493 107" fill="none" stroke="${palette[2]}" stroke-width="2" opacity=".45"/>
    <circle cx="290" cy="260" r="68" fill="none" stroke="${palette[2]}" stroke-width="2" opacity=".35"/>
  </svg>`;
}

function broochBase(id) {
  const pin = id === "ribbon"
    ? `<path d="M205 165 C245 120 277 151 299 182 C321 151 358 121 401 166 L371 277 L300 217 L231 278 Z" fill="#70253a"/><circle cx="300" cy="186" r="30" fill="#541a2c"/>`
    : id === "chain"
      ? `<path d="M175 172 C240 115 362 118 428 173" fill="none" stroke="url(#silver)" stroke-width="17"/><path d="M189 190 C230 290 363 303 414 190" fill="none" stroke="url(#silver)" stroke-width="11" stroke-dasharray="12 8"/><circle cx="181" cy="178" r="19" fill="none" stroke="url(#silver)" stroke-width="10"/><circle cx="422" cy="178" r="19" fill="none" stroke="url(#silver)" stroke-width="10"/>`
      : `<path d="M147 204 C170 138 439 134 461 202 C435 225 176 228 147 204 Z" fill="none" stroke="url(#silver)" stroke-width="19"/><path d="M162 201 L127 176" stroke="url(#silver)" stroke-width="12" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 600 520" role="img" aria-label="Jeans brooch on denim">
    ${metalDefs()}
    <path d="M72 45 H528 V455 H72 Z" fill="#34566b"/>
    <path d="M81 58 H519 M81 440 H519" stroke="#d8c5a4" stroke-width="4" stroke-dasharray="10 8" opacity=".7"/>
    <path d="M122 95 H478 V375 C431 417 360 438 301 438 C239 438 167 416 122 375 Z" fill="#3f6479" stroke="#d8c5a4" stroke-width="4" stroke-dasharray="11 8" opacity=".93"/>
    <path d="M123 118 H476" stroke="#d8c5a4" stroke-width="12" opacity=".55"/>
    ${pin}
  </svg>`;
}

function braceletBase(id) {
  if (id === "cord") {
    return `<svg viewBox="0 0 600 520" role="img" aria-label="Bordeaux cord bracelet">
      <path d="M133 260 C145 95 448 93 469 257 C487 399 384 460 295 453 C194 446 117 381 133 260 Z" fill="none" stroke="#70253a" stroke-width="18"/>
      <path d="M285 444 L268 488 M314 445 L334 488" stroke="#70253a" stroke-width="12" stroke-linecap="round"/>
      <circle cx="299" cy="443" r="20" fill="#7f3145" stroke="#4e1424" stroke-width="4"/>
    </svg>`;
  }
  const metal = id === "gold" ? "gold" : "silver";
  return `<svg viewBox="0 0 600 520" role="img" aria-label="${id} link bracelet">
    ${metalDefs()}
    <ellipse cx="300" cy="267" rx="184" ry="170" fill="none" stroke="url(#${metal})" stroke-width="24" stroke-dasharray="18 11"/>
    <ellipse cx="300" cy="267" rx="155" ry="141" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="4"/>
    <rect x="272" y="76" width="56" height="34" rx="12" fill="url(#${metal})"/>
  </svg>`;
}

function baseSvg(product, base) {
  if (product === "keychain") return keychainBase(base);
  if (product === "scarf") return scarfBase(base);
  if (product === "brooch") return broochBase(base);
  return braceletBase(base);
}

function charmSvg(charm) {
  const c = charm.color;
  const hook = `<path d="M50 5 C39 5 39 21 50 21 C61 21 61 5 50 5 Z" fill="none" stroke="#77716a" stroke-width="5"/>`;
  const shapes = {
    heart: `<path d="M50 88 C39 70 15 58 15 36 C15 12 43 9 50 30 C57 9 85 12 85 36 C85 58 61 70 50 88 Z" fill="${c}" stroke="#5a1729" stroke-width="3"/>`,
    star: `<path d="M50 18 L60 40 L85 42 L66 59 L72 84 L50 70 L28 84 L34 59 L15 42 L40 40 Z" fill="${c}" stroke="#775d2e" stroke-width="3"/>`,
    pearl: `<circle cx="50" cy="55" r="31" fill="${c}" stroke="#bcb09c" stroke-width="3"/><circle cx="40" cy="44" r="9" fill="#fff" opacity=".72"/>`,
    bow: `<path d="M49 48 C31 21 7 24 13 54 C19 75 41 60 49 53 Z M51 48 C69 21 93 24 87 54 C81 75 59 60 51 53 Z" fill="${c}" stroke="#7d4a51" stroke-width="3"/><circle cx="50" cy="51" r="10" fill="#9b6068"/><path d="M45 59 L28 89 L50 77 L57 94 L57 59" fill="${c}"/>`,
    cherry: `<path d="M49 31 C45 46 37 50 31 57 M52 31 C59 42 67 45 73 57" fill="none" stroke="#477054" stroke-width="5"/><path d="M50 31 C53 17 68 14 76 19 C68 30 60 35 50 31 Z" fill="#54805d"/><circle cx="28" cy="69" r="18" fill="${c}"/><circle cx="73" cy="69" r="18" fill="#a72b43"/>`,
    initial: `<rect x="18" y="20" width="64" height="72" rx="10" fill="#272421" stroke="#b7afa3" stroke-width="5"/><text x="50" y="73" text-anchor="middle" fill="${c}" font-family="Georgia" font-size="51">C</text>`,
    lock: `<rect x="20" y="45" width="60" height="45" rx="8" fill="${c}" stroke="#69645f" stroke-width="4"/><path d="M33 47 V34 C33 10 67 10 67 34 V47" fill="none" stroke="#8e8982" stroke-width="9"/><circle cx="50" cy="65" r="6" fill="#4a4642"/><path d="M50 69 V79" stroke="#4a4642" stroke-width="5"/>`,
    moon: `<path d="M68 18 C40 22 29 61 54 79 C35 79 17 64 17 43 C17 20 42 4 68 18 Z" fill="${c}" stroke="#95866b" stroke-width="3"/><circle cx="67" cy="31" r="4" fill="#aa9c80"/><circle cx="48" cy="57" r="6" fill="#aa9c80"/>`,
    flower: `<g fill="${c}" stroke="#75424c" stroke-width="2"><ellipse cx="50" cy="29" rx="14" ry="23"/><ellipse cx="50" cy="71" rx="14" ry="23"/><ellipse cx="29" cy="50" rx="23" ry="14"/><ellipse cx="71" cy="50" rx="23" ry="14"/></g><circle cx="50" cy="50" r="13" fill="#d5af72"/>`,
    dice: `<rect x="17" y="20" width="66" height="66" rx="11" fill="${c}" stroke="#837c72" stroke-width="4"/><g fill="#2c2926"><circle cx="34" cy="37" r="5"/><circle cx="66" cy="37" r="5"/><circle cx="50" cy="53" r="5"/><circle cx="34" cy="69" r="5"/><circle cx="66" cy="69" r="5"/></g>`,
    camera: `<rect x="12" y="31" width="76" height="54" rx="8" fill="${c}" stroke="#8e8880" stroke-width="4"/><path d="M27 31 L34 20 H59 L67 31" fill="#5b5752"/><circle cx="50" cy="58" r="18" fill="#b8b2aa" stroke="#1f1e1c" stroke-width="6"/><circle cx="50" cy="58" r="8" fill="#6b8a91"/><circle cx="76" cy="43" r="4" fill="#b45e58"/>`,
    bolt: `<path d="M57 12 L23 55 H45 L36 91 L78 43 H55 Z" fill="${c}" stroke="#755d31" stroke-width="3"/>`,
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${hook}${shapes[charm.kind]}</svg>`;
}

function currentProduct() {
  return products[state.product];
}

function currentDesign() {
  return state.designs[state.product];
}

function currentBase() {
  return currentProduct().bases.find((base) => base.id === state.bases[state.product]);
}

function selectedItem() {
  return currentDesign().find((item) => item.uid === state.selectedUid) || null;
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2400);
}

function renderBaseOptions() {
  const product = currentProduct();
  elements.baseDescription.textContent = product.description;
  elements.baseOptions.innerHTML = product.bases.map((base, index) => `
    <button class="base-option ${base.id === state.bases[state.product] ? "is-selected" : ""}" type="button" data-base="${base.id}" aria-pressed="${base.id === state.bases[state.product]}">
      <span class="base-swatch" style="--swatch:${base.swatch}">${String(index + 1).padStart(2, "0")}</span>
      <span><strong>${base.name}</strong><small>${base.detail}</small></span>
      <span class="base-price">${money.format(base.price)}</span>
    </button>`).join("");

  $$("[data-base]", elements.baseOptions).forEach((button) => {
    button.addEventListener("click", () => {
      state.bases[state.product] = button.dataset.base;
      state.view = "edit";
      render();
    });
  });
}

function renderCategories() {
  const categories = ["All", ...new Set(charms.map((charm) => charm.category))];
  elements.categoryFilter.innerHTML = categories.map((category) => `
    <button type="button" class="${state.category === category ? "is-active" : ""}" data-category="${category}">${category}</button>
  `).join("");
  $$("[data-category]", elements.categoryFilter).forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      renderCharmGrid();
      renderCategories();
    });
  });
}

function renderCharmGrid() {
  const visible = state.category === "All" ? charms : charms.filter((charm) => charm.category === state.category);
  const used = new Set(currentDesign().map((item) => item.charmId));
  elements.charmGrid.innerHTML = visible.map((charm) => `
    <button class="charm-option ${used.has(charm.id) ? "is-used" : ""}" type="button" data-charm="${charm.id}" aria-label="Add ${charm.name}, ${money.format(charm.price)}">
      ${charmSvg(charm)}
      <strong>${charm.name}</strong>
      <small>${money.format(charm.price)}</small>
    </button>
  `).join("");
  $$("[data-charm]", elements.charmGrid).forEach((button) => {
    button.addEventListener("click", () => addCharm(button.dataset.charm));
  });
}

function addCharm(charmId) {
  const design = currentDesign();
  const product = currentProduct();
  if (design.length >= product.limit) {
    showToast(`${product.name} holds up to ${product.limit} charms.`);
    return;
  }
  const anchor = product.anchors[design.length] || [50, 50];
  const item = {
    uid: `${state.product}-${Date.now()}-${uid++}`,
    charmId,
    x: anchor[0],
    y: anchor[1],
    rotation: design.length % 2 ? 7 : -5,
  };
  design.push(item);
  state.selectedUid = item.uid;
  state.view = "edit";
  render();
  showToast("Charm added — drag it directly on the preview.");
}

function renderPlacedCharms() {
  const design = currentDesign();
  elements.placed.innerHTML = design.map((item) => {
    const charm = charms.find((entry) => entry.id === item.charmId);
    return `<button type="button" class="placed-charm ${item.uid === state.selectedUid ? "is-selected" : ""}" data-uid="${item.uid}" style="left:${item.x}%;top:${item.y}%" aria-label="${charm.name}; drag to reposition">
      <span style="display:block;width:100%;height:100%;transform:rotate(${item.rotation}deg)">${charmSvg(charm)}</span>
    </button>`;
  }).join("");

  $$("[data-uid]", elements.placed).forEach((button) => {
    button.addEventListener("click", () => {
      if (state.view === "final") return;
      state.selectedUid = button.dataset.uid;
      renderPlacedCharms();
      renderSelectedControls();
    });
    button.addEventListener("pointerdown", beginDrag);
  });
}

function beginDrag(event) {
  if (state.view === "final" || event.button !== 0) return;
  event.preventDefault();
  const button = event.currentTarget;
  state.selectedUid = button.dataset.uid;
  drag = { pointerId: event.pointerId, button };
  button.setPointerCapture(event.pointerId);
  button.addEventListener("pointermove", moveDrag);
  button.addEventListener("pointerup", endDrag, { once: true });
  button.addEventListener("pointercancel", endDrag, { once: true });
  $$("[data-uid]", elements.placed).forEach((item) => {
    item.classList.toggle("is-selected", item.dataset.uid === state.selectedUid);
  });
  renderSelectedControls();
}

function moveDrag(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const rect = elements.stage.getBoundingClientRect();
  const x = Math.max(8, Math.min(92, ((event.clientX - rect.left) / rect.width) * 100));
  const y = Math.max(8, Math.min(88, ((event.clientY - rect.top) / rect.height) * 100));
  const item = selectedItem();
  if (!item) return;
  item.x = Math.round(x * 10) / 10;
  item.y = Math.round(y * 10) / 10;
  drag.button.style.left = `${item.x}%`;
  drag.button.style.top = `${item.y}%`;
}

function endDrag(event) {
  if (!drag) return;
  const button = event.currentTarget;
  button.removeEventListener("pointermove", moveDrag);
  if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
  drag = null;
  updateSummary();
}

function rotateSelected(amount) {
  const item = selectedItem();
  if (!item) return;
  item.rotation = (item.rotation + amount + 360) % 360;
  renderPlacedCharms();
}

function removeSelected() {
  if (!state.selectedUid) return;
  state.designs[state.product] = currentDesign().filter((item) => item.uid !== state.selectedUid);
  state.selectedUid = null;
  render();
  showToast("Charm removed.");
}

function renderSelectedControls() {
  const item = selectedItem();
  if (!item || state.view === "final") {
    elements.selectedControls.hidden = true;
    return;
  }
  const charm = charms.find((entry) => entry.id === item.charmId);
  elements.selectedControls.hidden = false;
  elements.selectedName.textContent = charm.name;
}

function updateSummary() {
  const design = currentDesign();
  const product = currentProduct();
  const base = currentBase();
  const charmNames = design.map((item) => charms.find((charm) => charm.id === item.charmId).name);
  const total = base.price + design.reduce((sum, item) => sum + charms.find((charm) => charm.id === item.charmId).price, 0);
  elements.pieceCount.textContent = design.length;
  elements.selectionLimit.textContent = `${design.length} / ${product.limit}`;
  elements.summaryProduct.textContent = product.name;
  elements.summaryBase.textContent = base.name;
  elements.summaryCharms.textContent = charmNames.length ? charmNames.join(", ") : "None selected";
  elements.summaryTotal.textContent = money.format(total);
  elements.empty.hidden = design.length > 0;
}

function setStep(step) {
  state.step = step;
  $$('[data-step]').forEach((button) => button.setAttribute("aria-selected", String(button.dataset.step === step)));
  $$('[data-panel]').forEach((panel) => {
    const active = panel.dataset.panel === step;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  if (step === "finish") {
    setView("final");
  } else if (state.view === "final") {
    setView("edit");
  }
}

function setView(view) {
  state.view = view;
  if (view === "final") state.selectedUid = null;
  elements.stage.classList.toggle("is-final", view === "final");
  elements.stage.setAttribute("aria-label", view === "final" ? "Final product preview" : "Editable product preview");
  $$('[data-view]').forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  renderPlacedCharms();
  renderSelectedControls();
}

function setProduct(product) {
  state.product = product;
  state.selectedUid = null;
  state.category = "All";
  state.view = "edit";
  state.step = "base";
  render();
}

function render() {
  const product = currentProduct();
  elements.previewLabel.textContent = product.label;
  elements.baseArt.innerHTML = baseSvg(state.product, state.bases[state.product]);
  $$('[data-product]').forEach((button) => button.setAttribute("aria-selected", String(button.dataset.product === state.product)));
  renderBaseOptions();
  renderCategories();
  renderCharmGrid();
  renderPlacedCharms();
  renderSelectedControls();
  updateSummary();
  setStep(state.step);
  setView(state.view);
}

function orderText() {
  const product = currentProduct();
  const base = currentBase();
  const design = currentDesign();
  const lines = design.map((item, index) => {
    const charm = charms.find((entry) => entry.id === item.charmId);
    return `${index + 1}. ${charm.name} — position ${Math.round(item.x)},${Math.round(item.y)}; rotation ${item.rotation}°`;
  });
  const total = base.price + design.reduce((sum, item) => sum + charms.find((charm) => charm.id === item.charmId).price, 0);
  return [
    "CHARM CURATION — MY DESIGN",
    `Piece: ${product.name}`,
    `Base: ${base.name}`,
    `Charms: ${design.length}`,
    ...(lines.length ? lines : ["No charms selected"]),
    `Total: ${money.format(total)}`,
  ].join("\n");
}

function saveDesign() {
  const payload = {
    savedAt: new Date().toISOString(),
    product: state.product,
    base: state.bases[state.product],
    charms: currentDesign(),
  };
  localStorage.setItem("charm-curation-design", JSON.stringify(payload));
  showToast("Your curation has been saved on this device.");
}

async function copyDesign() {
  const text = orderText();
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  showToast("Order details copied.");
}

function restoreDesign() {
  try {
    const saved = JSON.parse(localStorage.getItem("charm-curation-design"));
    if (!saved || !products[saved.product]) return;
    if (!products[saved.product].bases.some((base) => base.id === saved.base)) return;
    state.product = saved.product;
    state.bases[saved.product] = saved.base;
    state.designs[saved.product] = Array.isArray(saved.charms)
      ? saved.charms.slice(0, products[saved.product].limit).filter((item) => charms.some((charm) => charm.id === item.charmId))
      : [];
  } catch {
    localStorage.removeItem("charm-curation-design");
  }
}

$$('[data-product]').forEach((button) => button.addEventListener("click", () => setProduct(button.dataset.product)));
$$('[data-step]').forEach((button) => button.addEventListener("click", () => setStep(button.dataset.step)));
$$('[data-next]').forEach((button) => button.addEventListener("click", () => setStep(button.dataset.next)));
$$('[data-view]').forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
$$('[data-scroll-customiser]').forEach((button) => button.addEventListener("click", () => $("#customise").scrollIntoView({ behavior: "smooth" })));
$$('[data-open-product]').forEach((button) => button.addEventListener("click", () => {
  setProduct(button.dataset.openProduct);
  $("#customise").scrollIntoView({ behavior: "smooth" });
}));

$("#rotate-left").addEventListener("click", () => rotateSelected(-15));
$("#rotate-right").addEventListener("click", () => rotateSelected(15));
$("#remove-charm").addEventListener("click", removeSelected);
$("#reset-design").addEventListener("click", () => {
  state.designs[state.product] = [];
  state.selectedUid = null;
  render();
  showToast("This design has been cleared.");
});
$("#save-design").addEventListener("click", saveDesign);
$("#copy-design").addEventListener("click", copyDesign);

const menuButton = $(".menu-button");
const mobileNav = $("#mobile-nav");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  mobileNav.hidden = open;
});
$$('a', mobileNav).forEach((link) => link.addEventListener("click", () => {
  menuButton.setAttribute("aria-expanded", "false");
  mobileNav.hidden = true;
}));

$("#year").textContent = new Date().getFullYear();
restoreDesign();
render();
