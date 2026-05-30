# PDF Editor — local

Alternative privée à ILovePDF. Fusionner et compresser des PDF sur votre machine.
Vos fichiers ne quittent jamais votre ordinateur.

---

## ✨ Version simple (recommandée) — un seul fichier

**Aucune installation. Aucun terminal. Aucun serveur.**

1. Téléchargez le fichier [`pdf-editor.html`](pdf-editor.html)
   (ou cliquez sur **Code → Download ZIP** sur la page GitHub et prenez ce fichier)
2. **Double-cliquez dessus** — il s'ouvre dans votre navigateur
3. Glissez vos PDF, fusionnez ou compressez, téléchargez le résultat

C'est tout. ✅

Les PDF sont traités **entièrement dans votre navigateur** — rien n'est envoyé sur Internet.
Fonctionne hors-ligne après la première ouverture (les bibliothèques se mettent en cache).

### Fonctionnalités

- **Fusion** : combinez plusieurs PDF, réorganisez l'ordre des fichiers
- **Compression** : 4 niveaux (écran / ebook / impression / prépresse)

### Conseils

- Pour la compression, le mode **Ebook** est le meilleur compromis taille / lisibilité
- Compatible Chrome, Edge, Firefox, Safari (récents)
- Si rien ne se passe la première fois, vérifiez votre connexion Internet
  (les bibliothèques PDF se chargent depuis un CDN)

---

## 🛠 Version avancée (Flask + React + installeur Windows)

Pour ceux qui veulent une **application Windows installable** avec raccourci
menu Démarrer et désinstalleur : voir [WINDOWS.md](WINDOWS.md).

Cette version utilise Ghostscript pour une compression PDF plus fine (préserve
mieux le texte sélectionnable), mais demande une installation plus complète.

---

## Vie privée

- **Version HTML simple** : 100 % navigateur. Vos fichiers ne quittent jamais la page.
- **Version avancée** : 100 % localhost. Aucune communication hors de `127.0.0.1`.
