# Cédule de conteneurs (UI statique)

Application front-end simple en HTML/CSS/JS pour planifier des conteneurs.

## Fonctionnalités

- Calendrier (sélection de date)
- Plage horaire (heure début / fin)
- Champ texte pour numéro de conteneur
- Bouton **Ajouter à la cédule**
- Historique des entrées
- Modification d’une entrée existante
- Envoi d’information par e-mail via lien `mailto:`
- Persistance locale via `localStorage`

## Déploiement Azure Static Web Apps

Cette application est 100% statique et peut être déployée directement sur **Azure Static Web Apps**.

## Lancer en local

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.
