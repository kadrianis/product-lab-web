# Sécurité, exploitation et reprise

Développement local uniquement. Ne saisir aucun nom/client réel, secret ou compte rendu sensible. Pas de TLS, authentification, isolation multi-tenant, quotas par utilisateur, journal d’audit ou sauvegarde. Les en-têtes CSP/nosniff ne remplacent pas ces contrôles. L’interface utilise textContent pour les données, sans HTML utilisateur.

Santé : GET /health vérifie la disponibilité HTTP, sans dépendance DB. Conteneur non root, système de fichiers en lecture seule via Compose, capacités supprimées. Pas de healthcheck interne artificiel : sonder /health depuis l’environnement d’exécution. Image runtime mutable 10.0 : épingler un digest revu avant production.

Logs standards ASP.NET : démarrage et requêtes ; aucun middleware de journalisation des corps. Examiner les logs avant partage, ne pas ajouter de données sensibles aux URLs. En cas de 400 vérifier JSON et longueurs ; 409 vérifier état/capacité ; indisponibilité vérifier processus, port et pare-feu. Pas de métriques ni tracing revendiqués.

Arrêt : Ctrl+C, ou docker compose down (sans --volumes). Toute mémoire est perdue. Avant une nouvelle version, fermer le serveur synthétique. Retour arrière : lancer le SHA précédent depuis un checkout distinct ; aucune reprise de données possible à ce stade. Aucun déploiement cloud effectué. Une CI verte prouve les contrôles du code, pas la disponibilité d’une URL publique.

Avant pilote : runtime corrigé, DB persistante + migrations/restauration, HTTPS, identité et tests d’autorisation inter-organisations, limitation de débit, pagination, monitoring, licences et dépendances revues, exigences de confidentialité applicables définies avec les données réellement collectées.
