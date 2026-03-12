# Isla Bruma

Aventura detectivesca point-and-click con UI en React + Framer Motion + Lucide.

## Stack

- React + TypeScript + Vite
- Framer Motion (transiciones y overlays)
- Lucide React (iconografia)
- Express (servido de `dist` en produccion)

## Estructura

- `src/components/` componentes visuales
- `src/components/panels/` paneles de inspeccion y conversacion
- `src/hooks/useGame.ts` estado y acciones del juego
- `src/game/` datos y reglas (habitaciones, NPCs, dialogo, reloj)
- `src/styles/app.css` tema noir/cyber
- `game/visual.tsx` referencia original exportada desde Magic Patterns

## Desarrollo local

```bash
npm install
npm run dev
```

## Build + run produccion local

```bash
npm run build
npm start
```

`npm start` sirve la carpeta `dist` y expone `/health`.

## Assets visuales

Sube tus imagenes en:

- `assets/images/background_1.png`
- `assets/images/character_masked.png`

## Deploy en Render

Crear un `Web Service` con:

- Build Command: `npm install && npm run build`
- Start Command: `npm start`
