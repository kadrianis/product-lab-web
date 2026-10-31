# AgentOps CRM

Application web pour créer une mission d’agence et la faire passer de planifiée à active puis terminée.
Sources du produit : [products/cycle-001](products/cycle-001/README.md).

Version locale de démonstration : API .NET 10, stockage volatile, données synthétiques uniquement.
Aucune authentification, isolation des organisations, facturation ou publication externe. Ne pas exposer ce serveur sur Internet.


## Démarrage

Prérequis : SDK .NET 10 et Node 22. Depuis la racine :

```sh
dotnet run --project products/cycle-001/api --urls http://127.0.0.1:5081
```

Ouvrir http://127.0.0.1:5081 pour utiliser le formulaire connecté à l’API.

## Vérification

```sh
dotnet build products/cycle-001/api
dotnet run --project products/cycle-001/tests/DomainTests.csproj
node --test products/cycle-001/tests/api.test.mjs
```

Voir [architecture](products/cycle-001/docs/architecture.md), [API et données](products/cycle-001/docs/api.md), [exploitation](products/cycle-001/docs/operations.md) et [tests](products/cycle-001/docs/tests.md).
Licence : aucune licence de réutilisation choisie.
