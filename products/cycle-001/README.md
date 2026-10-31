# AgentOps CRM — première tranche fonctionnelle

Public visé : petites agences souhaitant suivre l’état d’avancement de leurs missions.

Parcours livré : saisir client et titre, créer une mission, démarrer puis terminer.
Critères : création 201 avec Location, lecture par identifiant, liste, validation des champs, transition invalide 409, ressource absente 404, transition concurrente atomique.

La saisie et les transitions nécessitent une connexion ; le navigateur utilise des modules JavaScript natifs et le serveur sert les fichiers statiques.
Stockage RAM limité à 500 éléments ; redémarrer efface toutes les données. Un dépassement de capacité est refusé (409), sans suppression implicite.

## Lancement et commandes

Voir le README racine pour le serveur et les tests. Depuis ce dossier :

```sh
docker compose up --build
curl http://127.0.0.1:5081/health
docker compose down
```

Compose est une option de développement. Le conteneur ne fournit que l’API. Ne pas utiliser cette commande pour des données réelles.
