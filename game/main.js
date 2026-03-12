import { NPCS, ROOMS } from "./data.js";
import { formatTime, GameState } from "./state.js";

const roomOrder = ["dock", "lobby", "beach", "lighthouse"];
const roomMapLayout = {
  dock: { x: 20, y: 70 },
  lobby: { x: 45, y: 48 },
  beach: { x: 76, y: 70 },
  lighthouse: { x: 74, y: 20 },
};

const inventoryItems = [
  { id: "key", label: "Llave oxidada" },
  { id: "paper", label: "Periodico viejo" },
  { id: "cup", label: "Taza de cafe" },
];

const ui = {
  sidebar: document.getElementById("sidebar"),
  sidebarToggle: document.getElementById("sidebar-toggle"),
  sidebarDialogue: document.getElementById("sidebar-dialogue"),
  sidebarChoices: document.getElementById("sidebar-choices"),
  sidebarClues: document.getElementById("sidebar-clues"),
  statusLine: document.getElementById("status-line"),
  roomTitle: document.getElementById("room-title"),
  roomDescription: document.getElementById("room-description"),
  clock: document.getElementById("clock"),
  dateLabel: document.getElementById("date-label"),
  sceneImage: document.getElementById("scene-image"),
  sceneFallback: document.getElementById("scene-fallback"),
  npcStrip: document.getElementById("npc-strip"),
  characterButton: document.getElementById("character-button"),
  characterLabel: document.getElementById("character-label"),
  mapOverlay: document.getElementById("map-overlay"),
  mapClose: document.getElementById("map-close"),
  mapBtn: document.getElementById("map-btn"),
  mapSvg: document.getElementById("map-svg"),
  waitBtn: document.getElementById("wait-btn"),
  solveBtn: document.getElementById("solve-btn"),
  inspectBtn: document.getElementById("inspect-btn"),
  inspectPanel: document.getElementById("inspect-panel"),
  inspectText: document.getElementById("inspect-text"),
  conversationPanel: document.getElementById("conversation-panel"),
  conversationTitle: document.getElementById("conversation-title"),
  conversationText: document.getElementById("conversation-text"),
  conversationChoices: document.getElementById("conversation-choices"),
  footerNavigation: document.getElementById("footer-navigation"),
  inventoryButtons: [...document.querySelectorAll(".inv-item")],
};

const state = new GameState();
let currentTalkNpcId = null;
let selectedInventoryId = null;

function closeMobileSidebar() {
  ui.sidebar.classList.remove("open");
}

function openConversation(npcId) {
  if (state.finished) return;
  const npc = NPCS.find((n) => n.id === npcId);
  if (!npc) return;
  currentTalkNpcId = npcId;
  const bundle = state.getDialogue(npcId);
  ui.conversationTitle.textContent = `Conversacion - ${npc.name}`;
  ui.conversationText.textContent = bundle?.intro || "No parece querer hablar ahora.";
  ui.conversationChoices.innerHTML = "";

  if (!bundle || bundle.options.length === 0) {
    const noChoice = document.createElement("button");
    noChoice.className = "choice-btn";
    noChoice.textContent = "No hay preguntas disponibles";
    noChoice.disabled = true;
    ui.conversationChoices.appendChild(noChoice);
  } else {
    bundle.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = opt.text;
      btn.addEventListener("click", () => {
        const text = state.pickDialogue(npcId, opt.id);
        ui.conversationText.textContent = text;
        state.lastMessage = text;
        renderAll();
        openConversation(npcId);
      });
      ui.conversationChoices.appendChild(btn);
    });
  }

  const closeBtn = document.createElement("button");
  closeBtn.className = "choice-btn";
  closeBtn.textContent = "[Terminar conversacion]";
  closeBtn.addEventListener("click", () => {
    currentTalkNpcId = null;
    renderFooterMode();
    renderSidebar();
  });
  ui.conversationChoices.appendChild(closeBtn);
  renderFooterMode();
}

function moveTo(roomId) {
  if (state.finished || roomId === state.currentRoom) return;
  state.currentRoom = roomId;
  state.advanceTime(15);
  state.lastMessage = `Te moviste a ${ROOMS[roomId].name}.`;
  currentTalkNpcId = null;
  renderAll();
}

function openAccusationMenu() {
  if (state.finished) return;
  ui.sidebarDialogue.textContent = "A quien acusas por el robo del medallon?";
  ui.sidebarChoices.innerHTML = "";
  NPCS.forEach((npc) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = npc.name;
    btn.addEventListener("click", () => {
      const result = state.solve(npc.id);
      ui.statusLine.textContent = result.ending;
      renderAll();
    });
    ui.sidebarChoices.appendChild(btn);
  });
}

function renderClock() {
  ui.clock.textContent = formatTime(state.timeMinutes);
  ui.dateLabel.textContent = "Lunes, 15 de Marzo";
}

function renderRoomHeader() {
  const room = ROOMS[state.currentRoom];
  ui.roomTitle.textContent = room.name.toUpperCase();
  ui.roomDescription.textContent = room.description;
}

function renderSidebar() {
  ui.statusLine.textContent = state.lastMessage;
  ui.sidebarDialogue.textContent = state.lastMessage;

  const clues = state.getClueEntries();
  ui.sidebarClues.innerHTML = "";
  if (clues.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Sin pistas todavia.";
    ui.sidebarClues.appendChild(li);
  } else {
    clues.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = entry.text;
      ui.sidebarClues.appendChild(li);
    });
  }

  if (!ui.sidebarChoices.children.length || currentTalkNpcId) {
    ui.sidebarChoices.innerHTML = "";
  }
}

function renderNpcs() {
  const npcsHere = state.npcsInRoom(state.currentRoom);
  ui.npcStrip.innerHTML = "";
  if (npcsHere.length === 0) {
    ui.characterLabel.textContent = "Sin testigos";
    return;
  }
  ui.characterLabel.textContent = npcsHere.length === 1 ? `Hablar con ${npcsHere[0].name}` : "Hablar";

  npcsHere.forEach((npc) => {
    const chip = document.createElement("button");
    chip.className = "npc-chip";
    chip.textContent = npc.name;
    chip.addEventListener("click", () => openConversation(npc.id));
    ui.npcStrip.appendChild(chip);
  });
}

function renderMap() {
  const ns = "http://www.w3.org/2000/svg";
  ui.mapSvg.innerHTML = "";

  roomOrder.forEach((roomId) => {
    const room = ROOMS[roomId];
    room.exits.forEach((toId) => {
      const a = roomMapLayout[roomId];
      const b = roomMapLayout[toId];
      if (!a || !b || roomId > toId) return;
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", `${a.x}`);
      line.setAttribute("y1", `${a.y}`);
      line.setAttribute("x2", `${b.x}`);
      line.setAttribute("y2", `${b.y}`);
      line.setAttribute("stroke", "rgba(8,145,168,0.3)");
      line.setAttribute("stroke-width", "0.6");
      ui.mapSvg.appendChild(line);
    });
  });

  roomOrder.forEach((roomId) => {
    const room = ROOMS[roomId];
    const point = roomMapLayout[roomId];
    if (!point) return;

    const isActive = state.currentRoom === roomId;
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", `${point.x}`);
    circle.setAttribute("cy", `${point.y}`);
    circle.setAttribute("r", isActive ? "3.2" : "2.5");
    circle.setAttribute("fill", isActive ? "#c9234e" : "#08090f");
    circle.setAttribute("stroke", isActive ? "#c9234e" : "#0891a8");
    circle.setAttribute("stroke-width", "0.7");
    circle.style.cursor = "pointer";
    circle.addEventListener("click", () => {
      const canGo = state.currentRoom === roomId || ROOMS[state.currentRoom].exits.includes(roomId);
      if (!canGo) {
        state.lastMessage = "No puedes saltar ahi desde tu ubicacion actual.";
        renderAll();
        return;
      }
      moveTo(roomId);
      ui.mapOverlay.classList.remove("open");
    });
    ui.mapSvg.appendChild(circle);

    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", `${point.x}`);
    text.setAttribute("y", `${point.y - 4}`);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "2.6");
    text.setAttribute("font-family", "Orbitron, sans-serif");
    text.setAttribute("fill", isActive ? "#c9234e" : "#93a0b8");
    text.textContent = room.name.toUpperCase();
    ui.mapSvg.appendChild(text);
  });
}

function renderInspectPanel() {
  const room = ROOMS[state.currentRoom];
  const exitNames = room.exits.map((id) => ROOMS[id].name).join(", ");
  ui.inspectText.textContent =
    `${room.description} Salidas visibles: ${exitNames}. ` +
    "El viento tapa algunas voces; revisa pistas e interroga a los presentes.";
}

function renderFooterMode() {
  const inspectOpen = ui.inspectPanel.classList.contains("open");
  const talkOpen = Boolean(currentTalkNpcId);
  ui.footerNavigation.style.display = !inspectOpen && !talkOpen ? "flex" : "none";
  ui.inspectPanel.classList.toggle("open", inspectOpen && !talkOpen);
  ui.conversationPanel.classList.toggle("open", talkOpen);
}

function renderInventory() {
  ui.inventoryButtons.forEach((btn) => {
    const id = btn.dataset.id;
    btn.classList.toggle("active", selectedInventoryId === id);
  });
}

function renderAll() {
  renderClock();
  renderRoomHeader();
  renderSidebar();
  renderNpcs();
  renderMap();
  renderInspectPanel();
  renderFooterMode();
  renderInventory();
}

function setupImageFallbacks() {
  const sceneError = () => {
    ui.sceneImage.style.display = "none";
    ui.sceneFallback.style.display = "grid";
    ui.sceneFallback.classList.add("error-note");
  };
  ui.sceneImage.addEventListener("error", sceneError);

  const characterImage = document.getElementById("character-image");
  characterImage.addEventListener("error", () => {
    characterImage.style.display = "none";
    ui.characterLabel.textContent = "Sube assets/images/personaje.png";
  });
}

function wireEvents() {
  ui.sidebarToggle.addEventListener("click", () => ui.sidebar.classList.toggle("open"));
  ui.waitBtn.addEventListener("click", () => {
    if (state.finished) return;
    state.advanceTime(30);
    state.lastMessage = "Esperaste 30 minutos.";
    currentTalkNpcId = null;
    ui.inspectPanel.classList.remove("open");
    renderAll();
  });
  ui.solveBtn.addEventListener("click", openAccusationMenu);
  ui.inspectBtn.addEventListener("click", () => {
    ui.inspectPanel.classList.toggle("open");
    currentTalkNpcId = null;
    renderAll();
  });
  ui.mapBtn.addEventListener("click", () => ui.mapOverlay.classList.add("open"));
  ui.mapClose.addEventListener("click", () => ui.mapOverlay.classList.remove("open"));
  ui.characterButton.addEventListener("click", () => {
    const npcsHere = state.npcsInRoom(state.currentRoom);
    if (npcsHere.length === 0) {
      state.lastMessage = "No hay nadie para hablar aqui.";
      renderAll();
      return;
    }
    if (npcsHere.length === 1) {
      openConversation(npcsHere[0].id);
      return;
    }
    ui.conversationTitle.textContent = "Conversacion";
    ui.conversationText.textContent = "Con quien quieres hablar?";
    ui.conversationChoices.innerHTML = "";
    npcsHere.forEach((npc) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = npc.name;
      btn.addEventListener("click", () => openConversation(npc.id));
      ui.conversationChoices.appendChild(btn);
    });
    currentTalkNpcId = "selector";
    renderFooterMode();
  });

  ui.inventoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const clicked = inventoryItems.find((item) => item.id === id);
      if (!clicked) return;
      selectedInventoryId = selectedInventoryId === id ? null : id;
      state.lastMessage = selectedInventoryId
        ? `Seleccionaste: ${clicked.label}.`
        : "Inventario sin seleccion.";
      renderAll();
    });
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 900 && !ui.sidebar.contains(event.target) && event.target !== ui.sidebarToggle) {
      closeMobileSidebar();
    }
  });
}

setupImageFallbacks();
wireEvents();
renderAll();
