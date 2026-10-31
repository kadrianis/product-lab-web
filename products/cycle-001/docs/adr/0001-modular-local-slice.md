# ADR 0001 — tranche locale et frontières métier

Statut : accepté pour démonstration locale, à réévaluer avant utilisation réelle.

Contexte : valider un parcours de suivi de mission avec peu de composants et des tests reproductibles.
Décision : backend ASP.NET Core net10.0, contrats HTTP explicites, règles pures, store mémoire à capacité bornée. Aucun paquet NuGet tiers.
Le SDK installé est 10.0.402 ; le runtime local 10.0.13 n’est pas présenté comme le dernier correctif. La politique Microsoft consultée au 31/10/2026 indique 10.0.14 : mettre à jour avant exposition. CI utilise 10.0.x.

Client HTML/CSS/JavaScript sans compilation : un seul formulaire et une liste ne justifient pas encore une chaîne React. Réévaluer React/TypeScript lorsque navigation, composants partagés ou état complexe apparaîtront. Le contrat HTTP reste compatible avec ce remplacement.

Alternative base : SQLite fournit une persistance locale simple ; PostgreSQL vise transactions, contraintes, utilisateurs concurrents et isolation par organisation. PostgreSQL est la cible envisagée, non livrée. Ajouter migrations, tests sur vraie DB, sauvegarde/restauration avant d’y placer des données réelles. Redis et base vectorielle n’ont aucun besoin démontré.

Alternative microservices : coûts réseau, secrets, tracing et transactions distribuées sans besoin d’échelle indépendant. Conserver un processus et extraire seulement une frontière démontrée. Docker ne constitue pas Kubernetes.

Coût : aucune ressource externe créée. Le coût d’hébergement n’est pas chiffré sans région, disponibilité et charge définies. Les outils locaux n’impliquent pas d’achat effectué.

Source officielle vérifiée : https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core ; API : https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-10.0 ; https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
