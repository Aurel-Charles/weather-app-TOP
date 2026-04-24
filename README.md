# Weather App — The Odin Project

Application météo en JavaScript vanilla avec Webpack 5.  
Données fournies par [Visual Crossing Weather API](https://www.visualcrossing.com/).

---

## Installation

```bash
git clone https://github.com/Aurel-Charles/template-webpack-TOP.git
cd template-webpack-TOP
npm install
```

Créer un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Remplacer `YOUR_API_KEY` par ta clé API Visual Crossing.

---

## Commandes

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement avec hot reload |
| `npm run build` | Génère le build de production dans `/dist` |
| `npm run deploy` | Déploie sur GitHub Pages (branche `gh-pages`) |

---

## Workflow Git

Commandes à répéter à chaque sauvegarde de progression :

```bash
git add .
git commit -m "message de commit"
git push
```

En une ligne :

```bash
git add . && git commit -m "message" && git push
```
