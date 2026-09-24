# Storyboard — the-shift.ai showcase
Durée cible **59 s**, 12 plans, 1920x1080 @ 60 fps. Caméra virtuelle continue : le monde 3D persiste d'un plan à l'autre, les transitions sont des dolly / orbites / match-cuts, jamais un fondu au noir.
Tout le texte à l'écran est copié du site. Palette et typo issues de `brand.json`.

| # | t (s) | Plan | Mouvement caméra | Assets | Texte à l'écran (≤7 mots) |
|---|-------|------|------------------|--------|---------------------------|
| 1 | 0.0–4.2 | **Cold open** — 140 particules bleues (seedées) convergent vers une grille, le logo réel se révèle par masque vertical, halo `--accent-glow` | push-in lent depuis z=-900, léger roll | `logo_raw.png` | `AI Driven Development` |
| 2 | 4.2–10.0 | **Hero reveal** — la fenêtre navigateur (chrome dessiné en code, favicon réel + `the-shift.ai` dans la barre) monte de la profondeur, inclinée rotateY -22° / rotateX 9° | dolly-in + orbite vers la face, ombre de contact qui se resserre | `home_desktop` | — |
| 3 | 10.0–15.4 | **La promesse** — push-in sur le H1 réel, rack focus (arrière-plan flou 8px→0) | push-in jusqu'à 78 % du cadre, jamais bord à bord | `home_sec1` | `Ou elle ne sera plus.` |
| 4 | 15.4–21.6 | **Les chiffres** — 4 cartes stats en stagger 70 ms, compteurs qui montent 0→88/94/6/50, source citée | travelling latéral + parallaxe 3 plans | `state_stats_band`, données `brand.voice.stats` | `88 % · 94 % · 6 %` |
| 5 | 21.6–29.0 | **Exploded view** (plan signature) — la home se décompose en 5 couches (nav, hero, stats, services, footer) écartées sur Z jusqu'à 420 px, puis re-snap avec overshoot | orbite 34° autour de la pile + pull-out | `home_sec1..6` | `Une page, cinq couches` |
| 6 | 29.0–35.0 | **Feature — Services** — curseur animé (easing spring) va cliquer l'onglet `Email`, ripple de clic, le panneau réel bascule | push-in sur la section, léger tilt | `home_sec4`, `state_tab_Email` | `Six modules, connectables` |
| 7 | 35.0–40.4 | **Feature — Donna** — page produit dans le navigateur, scroll interne réel, CTA qui s'enfonce (scale .96) au clic | dolly latéral + rack focus | `donna_full` (scroll), `donna_desktop` | `Donna — employée IA` |
| 8 | 40.4–45.6 | **Feature — Calculateur** — curseur tire le slider, les chiffres du calculateur passent de l'état capturé « avant » à l'état « après » | push-in serré sur la carte de résultat | `state_calc_before`, `state_calc_after` | `Vos économies, chiffrées` |
| 9 | 45.6–49.6 | **Multi-device** — desktop + laptop + téléphone (notch dessiné en code) en formation, même marque, parallaxe entre les trois | orbite lente droite→gauche | `home_desktop`, `produits_desktop`, `home_mobile` | — |
| 10 | 49.6–53.6 | **Carrousel de pages** — 8 pages en arc 3D de 150°, la caméra balaie l'arc, profondeur de champ sur les cartes éloignées | sweep circulaire | `services/produits/pricing/formation/references/casusage/conseil/contact` desktop | `Quinze pages capturées` |
| 11 | 53.6–57.4 | **Preuve** — étude de cas MFA, les trois chiffres réels (3h, 14, 400+) montent en compteur, noms clients en stagger | push-in + léger crane up | `mfa_desktop`, `brand.voice.mfaProof` | `14 marques, 400 documents` |
| 12 | 57.4–61.0 | **End card** — logo réel, CTA du site, URL, halo de marque, particules qui se dispersent | pull-out final, fond qui se referme | `logo_raw.png` | `Audit stratégique gratuit — 45 min` · `the-shift.ai` |

## Règles appliquées
- Aucune capture n'occupe le cadre à plat : chaque écran vit sur une fenêtre navigateur, un laptop, un téléphone ou une carte flottante, toujours avec marge, perspective et ombre de contact.
- Easings : `cubic-bezier(.16,1,.3,1)` pour les entrées, ressort amorti pour le curseur et les clics, aucune interpolation linéaire.
- Le rendu est une fonction pure de `t` (`setTime(t)`), aléatoire seedé — l'aperçu web et l'export MP4 sont identiques image par image.
- Audio optionnel : pad + pulse synthétisés, coupes calées sur les frontières de plans.
