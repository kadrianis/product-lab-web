# Vérifications reproductibles

Depuis la racine : build API, dotnet run --project products/cycle-001/tests/DomainTests.csproj, puis node --test products/cycle-001/tests/api.test.mjs.
Le runner de domaine est un exécutable .NET sans dépendance de test externe : 10 vérifications, code non nul sur échec. Il exécute les règles de production et la concurrence du store. Ce n’est pas un dotnet test/xUnit déguisé.
Le runner Node démarre une vraie API Kestrel sur port local disponible, utilise HTTP réel, puis attend l’arrêt du processus. Il teste création/lecture/liste/transitions, concurrence, validation, JSON invalide, media refusé, absence et fichiers web. Aucune intégration DB n’est possible sans DB implémentée.
Le test de fichiers statiques ne constitue pas un parcours navigateur : un test de bout en bout navigateur doit vérifier saisie, création puis transition via les contrôles visibles.

CI quality : mêmes commandes, build Docker. Les résultats réellement observés sont consignés dans le dossier de livraison vérifié ; cette documentation n’annonce pas de succès par anticipation.

## Parcours navigateur

Depuis la racine : npm ci, npx playwright install chromium, npm run test:e2e. Le test ouvre un navigateur à 390 × 844, crée une mission par formulaire, démarre puis termine, vérifie l’absence de débordement horizontal et l’affichage littéral d’une chaîne HTML. En local Windows, PLAYWRIGHT_CHANNEL=msedge permet de réutiliser Edge installé. La CI utilise Chromium.
