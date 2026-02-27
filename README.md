# Cédule de conteneurs (UI statique)

Application front-end simple en HTML/CSS/JS pour planifier des conteneurs.

## Fonctionnalités

- Pages séparées par zone (Dashboard, Import, Cédule, Historique, Preuve, Items)
- Menu fixe au bas de l’écran avec bouton vers chaque page
- Import Power Automate (lecture d’e-mails) pour intégrer **ASN / numéro de conteneur / LFD**
- Liste importée avec un seul bouton ASN (lien) vers la page Items
- Historique des cédules de la semaine
- Modification / suppression d’une cédule
- Envoi d’information par e-mail via lien `mailto:`
- Preuve de réception avec photo
- Persistance locale via `localStorage`

## Lancer en local

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.
