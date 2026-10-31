# Contrat HTTP et modèle de données

Base locale : http://127.0.0.1:5081. JSON UTF-8, noms camelCase. Aucune authentification : strictement démonstration synthétique.

| Méthode | Route | Résultat |
|---|---|---|
| GET | /health | 200, status=ok, storage=volatile-memory |
| GET | /api/missions | 200, tableau trié createdAt décroissant, 500 maximum |
| GET | /api/missions/{id} | 200 ou 404 |
| POST | /api/missions | 201 + Location ; 400 validation ; 409 capacité ; 415 media |
| PATCH | /api/missions/{id}/status | 200 ; 404 absent ; 409 transition refusée |

Création : `{"client":"Exemple synthétique","title":"Mission de démonstration"}`.
client : obligatoire, 120 caractères maximum après Trim. title : obligatoire, 200 caractères maximum après Trim.
Les longueurs sont mesurées en unités UTF-16 .NET. Les champs inconnus sont ignorés par le binding JSON.
Corps limité à 16 Kio par Kestrel (413 si dépassement). JSON invalide : 400. Erreurs métier au format ProblemDetails ; ne pas dépendre du texte anglais, utiliser code HTTP et clés errors.

Réponse : id UUID serveur, client, title, status, createdAt UTC. L’identifiant n’est pas un contrôle d’autorisation.
États autorisés : planned → active → completed. Même état, retour arrière et saut refusés ; deux changements concurrents identiques donnent exactement un succès.

Exemple de transition : `{"status":"active"}`. Une création répétée crée deux objets ; aucune idempotence POST promise.

## Données

Dictionary<Guid, Mission>, mémoire du processus seulement. Pas de SQL, schéma déployé, migration ou stockage disque. Aucune migration à exécuter actuellement, aucune restauration possible après arrêt. Ne pas documenter une sauvegarde fictive.
Prochaine persistance envisagée : table missions (id PK, champs non nuls, statut contraint, created_at), organisation et ownership après conception de l’authentification, concurrence optimiste avec version. Les scripts ne sont pas encore implémentés.
