# PDF Editor — local

Alternative privée à ILovePDF. Fusionner et compresser des PDF sur votre machine.
**Vos fichiers ne quittent jamais votre navigateur.**

---

## 📲 Utilisation — installable comme une vraie application (PWA)

Une fois la page GitHub Pages activée (voir ci-dessous), ouvrez :

**https://theomeurr.github.io/PDF-Editor/**

- Sur **Chrome / Edge / Brave** : un bouton **« ⬇ Installer l'app »** apparaît en haut à droite (ou l'icône d'installation dans la barre d'adresse). Cliquez → l'app s'ajoute au menu Démarrer / dock, comme n'importe quelle application native.
- Sur **Safari iOS / iPadOS** : bouton « Partager » → « Sur l'écran d'accueil ».
- Sur **Firefox** : pas d'installation native, mais l'app fonctionne normalement dans l'onglet (et fonctionne hors-ligne).

Une fois installée :
- ✅ Icône PDF Editor dans votre menu Démarrer / dock
- ✅ S'ouvre dans sa propre fenêtre, sans barre d'URL
- ✅ Fonctionne **hors-ligne** (service worker met tout en cache)
- ✅ Mises à jour automatiques quand vous êtes en ligne

---

## 🚀 Sans installation — directement dans le navigateur

Allez sur **https://theomeurr.github.io/PDF-Editor/** et utilisez l'app sans rien installer.

Ou bien téléchargez `index.html` + les autres fichiers du repo et ouvrez `index.html` localement (mode hors-ligne complet, mais sans la possibilité d'installer comme PWA — voir limite plus bas).

---

## Fonctionnalités

- **Fusion** : combinez plusieurs PDF
  - aperçu visuel de chaque page de garde
  - nombre de pages affiché
  - réorganisation par **glisser-déposer** ou flèches ↑ ↓
- **Compression** : 4 niveaux (écran / ebook / impression / prépresse)
  - barre de progression
  - re-rendu de chaque page en image (le texte n'est plus sélectionnable après)

## Comment ça marche

Tout se passe **dans votre navigateur** :

- **Fusion** via [pdf-lib](https://pdf-lib.js.org/) — préserve le texte sélectionnable
- **Compression** via [pdf.js](https://mozilla.github.io/pdf.js/) qui re-rend chaque page en JPEG à la résolution choisie
- **Aperçus** via pdf.js également

Les bibliothèques se chargent depuis un CDN à la première ouverture, puis sont mises en cache par le service worker — l'app fonctionne ensuite hors-ligne.

---

## Activer GitHub Pages (à faire une fois)

Pour que `https://theomeurr.github.io/PDF-Editor/` soit accessible :

1. Aller sur https://github.com/theomeurr/PDF-Editor/settings/pages
2. Section **Source** → choisir **« Deploy from a branch »**
3. Branche : **`main`** · Dossier : **`/ (root)`** → cliquer **Save**
4. Attendre 1-2 minutes que GitHub publie le site

Ensuite l'URL est en ligne pour de bon. Toute modification poussée sur `main` est déployée automatiquement.

---

## Limites

- **Texte non sélectionnable après compression** (re-rendu en image)
- **Installation PWA = nécessite HTTPS** : possible via GitHub Pages, pas en `file://`
- **Fichier ouvert localement (`file://`)** : marche pour fusion + compression, mais pas d'installation PWA ni de service worker

## Vie privée

100 % navigateur. Aucun fichier n'est envoyé sur Internet. Vous pouvez couper votre connexion après le premier chargement — tout continue de marcher grâce au service worker.
