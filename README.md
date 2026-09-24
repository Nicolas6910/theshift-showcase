# the-shift.ai — showcase

Présentation cinématique du site [the-shift.ai](https://www.the-shift.ai/), **rendue à 100 % en code** (HTML / CSS 3D / Canvas / Web Audio).
Aucune image ni vidéo générée par IA : chaque pixel est soit une capture réelle du site, soit dessiné par le code.

- **Page** : `index.html` — lecture automatique, `espace` play/pause, `←/→` plan précédent/suivant, `S` son.
- **Marque** : `brand.json` — logo, palette, typographie et wording extraits du site, jamais devinés.
- **Plans** : `storyboard.md` — 12 plans, 61 s.
- **Rendu déterministe** : toute la scène est une fonction pure du temps (`window.setTime(t)`), aléatoire seedé. L'aperçu web et l'export MP4 sont identiques image par image.

## Structure
```
index.html
src/       brand.js scene.js camera.js shots.js ui-sim.js audio.js main.js utils.js style.css
assets/    captures Playwright du site (Chromium, 1440x900 @2x et 390x844 @3x)
```

Le site source appartient à The Shift. Ce dépôt n'héberge que la présentation et les captures qui la composent.
