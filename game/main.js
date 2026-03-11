import { NAMES, NPCS, ROOMS } from "./data.js";
import { formatTime, GameState } from "./state.js";

const ui = {
  clock: document.getElementById("clock"),
  location: document.getElementById("location"),
  dialogue: document.getElementById("dialogue"),
  choices: document.getElementById("choices"),
  clues: document.getElementById("clues"),
  status: document.getElementById("status"),
  waitBtn: document.getElementById("wait-btn"),
  solveBtn: document.getElementById("solve-btn"),
};

class DetectiveScene extends Phaser.Scene {
  constructor() {
    super("DetectiveScene");
    this.state = new GameState();
    this.exitObjects = [];
    this.npcObjects = [];
    this.dialogOpenWith = null;
  }

  create() {
    this.roomBg = this.add.rectangle(430, 280, 860, 560, 0x1f2f36).setOrigin(0.5);
    this.roomTitle = this.add
      .text(24, 18, "", {
        fontFamily: "Trebuchet MS",
        fontSize: "30px",
        color: "#f1f3ee",
      })
      .setDepth(5);
    this.roomDesc = this.add
      .text(24, 56, "", {
        fontFamily: "Trebuchet MS",
        fontSize: "17px",
        color: "#d0d8d3",
      })
      .setDepth(5);
    this.hint = this.add
      .text(24, 520, "Haz clic en salidas o personajes.", {
        fontFamily: "Trebuchet MS",
        fontSize: "16px",
        color: "#cdb77a",
      })
      .setDepth(5);

    ui.waitBtn.addEventListener("click", () => {
      if (this.state.finished) return;
      this.state.advanceTime(30);
      this.state.lastMessage = "Esperaste media hora para observar movimientos.";
      this.dialogOpenWith = null;
      this.renderAll();
    });

    ui.solveBtn.addEventListener("click", () => this.openAccusationMenu());
    this.renderAll();
  }

  openAccusationMenu() {
    if (this.state.finished) return;
    this.dialogOpenWith = null;
    ui.dialogue.textContent = "¿A quién acusas por el robo del medallón?";
    ui.choices.innerHTML = "";
    NPCS.forEach((npc) => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = npc.name;
      btn.onclick = () => {
        const result = this.state.solve(npc.id);
        ui.status.textContent = result.ending;
        if (result.ok) ui.status.classList.add("success");
        this.renderAll();
      };
      ui.choices.appendChild(btn);
    });
  }

  moveTo(roomId) {
    if (this.state.finished || roomId === this.state.currentRoom) return;
    this.state.currentRoom = roomId;
    this.state.advanceTime(15);
    this.state.lastMessage = `Te moviste a ${ROOMS[roomId].name}.`;
    this.dialogOpenWith = null;
    this.renderAll();
  }

  openDialogue(npcId) {
    if (this.state.finished) return;
    this.dialogOpenWith = npcId;
    const pack = this.state.getDialogue(npcId);
    ui.dialogue.textContent = pack?.intro || "No parece querer hablar.";
    ui.choices.innerHTML = "";
    if (!pack || pack.options.length === 0) {
      const empty = document.createElement("button");
      empty.className = "btn";
      empty.textContent = "No hay preguntas disponibles";
      empty.disabled = true;
      ui.choices.appendChild(empty);
      return;
    }

    pack.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = opt.text;
      btn.onclick = () => {
        const text = this.state.pickDialogue(npcId, opt.id);
        ui.dialogue.textContent = text;
        this.renderAll();
      };
      ui.choices.appendChild(btn);
    });
  }

  clearRoomObjects() {
    this.exitObjects.forEach((o) => o.destroy());
    this.npcObjects.forEach((o) => o.destroy());
    this.exitObjects = [];
    this.npcObjects = [];
  }

  drawExits(room) {
    const spacing = 180;
    room.exits.forEach((exitId, index) => {
      const x = 180 + index * spacing;
      const y = 470;
      const rect = this.add
        .rectangle(x, y, 160, 48, 0x203943)
        .setStrokeStyle(2, 0x6e9aaa)
        .setInteractive({ useHandCursor: true });
      const label = this.add
        .text(x, y, `Ir a ${ROOMS[exitId].name}`, {
          fontFamily: "Trebuchet MS",
          fontSize: "15px",
          color: "#f1f3ee",
          align: "center",
        })
        .setOrigin(0.5);
      rect.on("pointerdown", () => this.moveTo(exitId));
      this.exitObjects.push(rect, label);
    });
  }

  drawNpcs() {
    const npcs = this.state.npcsInRoom(this.state.currentRoom);
    const startX = 220;
    npcs.forEach((npc, index) => {
      const x = startX + index * 220;
      const y = 310;
      const body = this.add
        .ellipse(x, y, 110, 150, 0x2f4a56)
        .setStrokeStyle(2, 0xbfd3d8)
        .setInteractive({ useHandCursor: true });
      const name = this.add
        .text(x, y, npc.name.split(" ")[0], {
          fontFamily: "Trebuchet MS",
          fontSize: "19px",
          color: "#ffffff",
        })
        .setOrigin(0.5);
      body.on("pointerdown", () => this.openDialogue(npc.id));
      this.npcObjects.push(body, name);
    });
  }

  renderSidebar() {
    ui.clock.textContent = formatTime(this.state.timeMinutes);
    ui.location.textContent = `Ubicación: ${ROOMS[this.state.currentRoom].name}`;
    ui.status.textContent = this.state.lastMessage;
    ui.status.classList.toggle("success", this.state.lastMessage.includes("Resolviste"));

    const clues = this.state.getClueEntries();
    ui.clues.innerHTML = "";
    if (clues.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Sin pistas todavía.";
      ui.clues.appendChild(li);
    } else {
      clues.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = entry.text;
        ui.clues.appendChild(li);
      });
    }

    if (!this.dialogOpenWith) {
      ui.dialogue.textContent = this.state.lastMessage;
      ui.choices.innerHTML = "";
    }
  }

  renderScene() {
    const room = ROOMS[this.state.currentRoom];
    this.roomBg.fillColor = room.color;
    this.roomTitle.text = room.name;
    this.roomDesc.text = room.description;
    this.clearRoomObjects();
    this.drawExits(room);
    this.drawNpcs();
    if (this.state.finished) {
      this.hint.text = "Caso cerrado. Reinicia la página para jugar otra vez.";
    } else {
      this.hint.text = "Haz clic en salidas o personajes.";
    }
  }

  renderAll() {
    this.renderScene();
    this.renderSidebar();
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 860,
  height: 560,
  parent: "game-root",
  backgroundColor: "#101820",
  scene: [DetectiveScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});

window.__GAME_INFO__ = {
  suspects: Object.values(NAMES),
  note: "MVP inspirado en aventuras detectivescas con rutina horaria.",
};
