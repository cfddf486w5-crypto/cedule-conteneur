# Cédule de conteneurs (UI statique)

Application front-end HTML/CSS/JS pour planifier, suivre et archiver des conteneurs.

## Nouveautés majeures

- Filtres avancés (recherche, zone, statut, tri)
- Tableau de bord KPI hebdomadaire
- Export CSV (cédules + preuves)
- Import JSON des données locales
- Suppression avec annulation
- Mode sombre, mode compact, réduction animations
- Sélecteur d’affichage concret: Auto / iPhone / PC
- Sauvegarde automatique du brouillon de formulaire
- Raccourcis clavier de navigation
- Impression rapide de la vue semaine
- Validation renforcée (week-end, doublons, LFD)
- Import manuel de conteneurs + assistant de cédulage séquentiel

## Import manuel des conteneurs

1. Aller à **Cédule** puis cliquer sur le bouton discret **📋+ Importer**.
2. Coller une liste de lignes (une ligne par conteneur), puis cliquer **Analyser**.
3. Vérifier le résumé (**Reconnues / Ignorées**) et importer la file.
4. Suivre l’assistant séquentiel pour ajouter chaque conteneur à la cédule.

### Format attendu des lignes

Exemples acceptés:

- `Musu1233435 Lfd 02/28`
- `MUSU1233435 - LFD: 02/28`
- `musu1233435 lfd 02/28 Laval`

Le parseur détecte automatiquement:

- Conteneur via `musu\s*\d+` (insensible à la casse)
- LFD via `\blfd\b\D*([0-9]{1,2}\/[0-9]{1,2})`

## Stockage local (localStorage)

- `DL_SCHEDULE_IMPORT_QUEUE`: file d’import séquentielle (pending/scheduled/skipped)
- `DL_SCHEDULE_ENTRIES`: entrées de cédule (miroir compatible avec le stockage existant)
- `DL_SCHEDULE_SETTINGS`: derniers choix (site/date/heure) pour préremplissage

## Lancer en local

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.
