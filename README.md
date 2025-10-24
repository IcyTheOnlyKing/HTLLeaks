# VisionVault Galerie

Eine futuristische Mediengalerie, die Tailwind CSS, Bootstrap 5 und moderne Glaseffekte kombiniert. Droppe deine Fotos, Videos oder Audio-Snippets in den Ordner und die Seite kümmert sich um den Rest.

## Features
- 🎨 Kombiniert Utility-Klassen aus Tailwind mit Bootstrap-Komfort
- 🖼️ Responsive Grid mit Hover-Animationen, Suche & Tag-Filtern
- 🎬 Unterstützt Bilder (PNG/JPG/SVG/WebP), Videos (MP4/WebM/Mov) & Audio (MP3/WAV/Ogg)
- 🌙 Glasoptik, Gradienten und eine dunkle, moderne Farbpalette
- ⚡ Zero-Build Setup im Browser, optionales Node-Script für Automatisierung

## Schnellstart
1. **Projekt klonen oder herunterladen** und in deinem Lieblings-Webserver (VS Code Live Server, `python -m http.server`, etc.) öffnen.
2. **Eigene Medien hinzufügen:** Lege beliebige Dateien in `assets/gallery/` ab. Unterordner werden automatisch als Tags genutzt.
3. **Manifest generieren:** Führe `npm run generate:manifest` aus (Node >= 18). Das Script erzeugt `assets/gallery/gallery-manifest.json` mit allen gefundenen Dateien.
4. **Seite neu laden** und deine Inhalte genießen. Die Filter- und Suchfunktionen funktionieren automatisch.

> 💡 Kein Node zur Hand? Dann kannst du weiterhin manuell Einträge in `assets/js/gallery-data.js` pflegen – die Datei dient als Fallback, falls kein Manifest vorhanden ist.

## Lizenz
Dieses Template steht dir frei zur Verfügung. Viel Spaß beim Gestalten!
