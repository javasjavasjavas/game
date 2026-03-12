# Isla Bruma (MVP tipo Maupiti)

Pequeña aventura detectivesca point-and-click hecha con Phaser + Express.

## Incluye

- 4 salas conectadas
- 3 NPCs con rutinas horarias
- reloj interno de 08:00 a 22:00
- diálogo con condiciones
- inventario de pistas
- acusación final con distintos desenlaces
- interfaz visual estilo noir/cyber retro

## Ejecutar local

```bash
npm install
npm start
```

Abrir `http://localhost:3000`.

## Assets visuales

Sube tus imagenes en:

- `assets/images/background_1.png`
- `assets/images/character_masked.png`

Si no existen, la UI muestra fallback visual para que el juego siga cargando.

## Deploy en Render

1. Crear un `Web Service` apuntando a este repo.
2. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Render usará el puerto de `PORT` automáticamente (ya soportado en `server.js`).
