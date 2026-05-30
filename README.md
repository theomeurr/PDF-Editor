# PDF Editor — local

Alternative privée à ILovePDF. Fusionner et compresser des PDF sur votre machine.
**Vos fichiers ne quittent jamais votre navigateur.**

---

## 🚀 Utilisation — un seul fichier, aucune installation

1. Téléchargez le fichier [`pdf-editor.html`](pdf-editor.html)
   *(sur GitHub : cliquez sur le fichier, puis sur le bouton **« Download raw file »**)*
2. **Double-cliquez sur le fichier** — il s'ouvre dans votre navigateur
3. Glissez vos PDF, fusionnez ou compressez, téléchargez le résultat

C'est tout. ✅

---

## Fonctionnalités

- **Fusion** : combinez plusieurs PDF, réorganisez l'ordre (flèches ↑ ↓)
- **Compression** : 4 niveaux (écran / ebook / impression / prépresse)
- **Drag & drop** pour ajouter vos fichiers
- **Barre de progression** pendant la compression

## Comment ça marche

Tout se passe **dans votre navigateur** :

- **Fusion** via [pdf-lib](https://pdf-lib.js.org/) — préserve le texte sélectionnable
- **Compression** via [pdf.js](https://mozilla.github.io/pdf.js/) : chaque page est re-rendue à la résolution choisie en image JPEG, puis ré-empaquetée dans un nouveau PDF

Les bibliothèques se chargent depuis un CDN à la première ouverture, puis
sont mises en cache par votre navigateur — l'app fonctionne ensuite hors-ligne.

## ⚠ Limite de la compression

La compression re-rend chaque page en image. **Le texte du PDF compressé ne sera plus
sélectionnable**. Pour la fusion, le texte est préservé normalement.

## Compatibilité

Chrome, Edge, Firefox, Safari récents (toute version de 2022+).

## Vie privée

100 % navigateur. Aucun fichier n'est envoyé sur Internet. Vous pouvez
même couper votre connexion après la première ouverture — tout continue de marcher.
