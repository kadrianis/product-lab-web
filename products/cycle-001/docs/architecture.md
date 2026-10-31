# Architecture implémentée

```mermaid
sequenceDiagram
  participant UI as Navigateur
  participant API as Program.cs / HTTP
  participant Rules as MissionRules
  participant Store as MissionStore / RAM
  UI->>API: POST /api/missions
  API->>Rules: Validate(input)
  Rules-->>API: erreurs ou entrée acceptée
  API->>Store: Create(input)
  Store-->>API: identifiant + état + UTC
  API-->>UI: 201 + Location + JSON
  UI->>API: PATCH /api/missions/{id}/status
  API->>Store: Change(id, status), sous verrou
  Store->>Rules: CanTransition(current, target)
  API-->>UI: 200 ou 409
```

Le transport lie JSON aux contrats CreateMission/ChangeStatus. Les règles pures ne connaissent pas HTTP. Le store possède les données et verrouille lecture/écriture ; la validation de transition et l’écriture sont atomiques. Les records retournés sont immuables. Les routes n’exposent ni suppression ni modification arbitraire d’état.

Limite : règles et stockage sont dans un même assembly ; séparation logique, pas microservices ni architecture distribuée. Chaque instance possède sa mémoire indépendante. Un équilibrage multi-instance casserait la cohérence. L’API ne déduit aucune identité de l’appelant.
