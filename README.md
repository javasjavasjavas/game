# Isla Bruma (MVP tipo Maupiti)

Pequeña aventura detectivesca point-and-click hecha con Phaser + Express.

## Incluye

- 4 salas conectadas
- 3 NPCs con rutinas horarias
- reloj interno de 08:00 a 22:00
- diálogo con condiciones
- inventario de pistas
- acusación final con distintos desenlaces

## Ejecutar local

```bash
npm install
npm start
```

Abrir `http://localhost:3000`.

## Deploy en Render

1. Crear un `Web Service` apuntando a este repo.
2. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Render usará el puerto de `PORT` automáticamente (ya soportado en `server.js`).
