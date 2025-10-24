# VisionVault Galerie

Eine futuristische Mediengalerie, die Tailwind CSS, Bootstrap 5 und moderne Glaseffekte kombiniert. Droppe deine Fotos oder Videos in den bereitgestellten Ordner und pflege sie in die Datenquelle ein – fertig ist dein kuratierter Showcase.

## Features
- 🎨 Kombiniert Utility-Klassen aus Tailwind mit Bootstrap-Komfort
- 🖼️ Responsive Grid mit Hover-Animationen, Suche & Tag-Filtern
- 🎬 Unterstützt Bilder (PNG/JPG/SVG/WebP) und Videos (MP4/WebM)
- 🌙 Glasoptik, Gradienten und eine dunkle, moderne Farbpalette
- ⚡ Zero-Build Setup: funktioniert komplett über CDN-Imports

## Schnellstart
1. **Projekt klonen oder herunterladen** und in deinem Lieblings-Webserver (VS Code Live Server, `python -m http.server`, etc.) öffnen.
2. **Eigene Medien hinzufügen:**
   - Bilder in `assets/gallery/`
   - Videos in `assets/video/`
3. **Datenquelle pflegen:** `assets/js/gallery-data.js`
   ```js
   {
     type: 'image',
     title: 'Mein Shooting',
     description: 'Kurzer Mood-Text',
     src: 'assets/gallery/mein-bild.jpg',
     tags: ['Studio', 'Portrait']
   }
   ```
4. **Seite neu laden** und deine Inhalte genießen. Die Filter- und Suchfunktionen funktionieren automatisch.

## Optional: Struktur automatisieren
Wenn du viele Dateien hast, kannst du dir mit einem kleinen Script eine JSON-Liste generieren und diese importieren. Solange die Struktur dem Schema in `gallery-data.js` folgt, wird alles automatisch gerendert.

## Lizenz
Dieses Template steht dir frei zur Verfügung. Viel Spaß beim Gestalten!
