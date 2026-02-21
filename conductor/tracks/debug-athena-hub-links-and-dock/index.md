# Debug Athena Hub: Links & Dock Editing

## Context
De site `athena-hub` (de centrale portfolio/hub site) vertoont twee kritieke problemen:
1.  **Broken Dock Editing:** De functionaliteit om teksten, links en media te bewerken via de Athena Dock werkt niet. De `Editable*` componenten lijken niet correct te binden.
2.  **Localhost Links:** De showcase-sectie bevat links naar `localhost` (bv. `http://localhost:5982/demo-consultant/`). Bij deployment moeten deze automatisch of semi-automatisch worden omgezet naar de live URLs (bv. `https://athena-cms-factory.github.io/...`).

## Doelen
1.  **Herstel Dock Editing:** Analyseer en upgrade de `EditableText`, `EditableLink` en `EditableMedia` componenten en de `dock-connector.js` in `athena-hub` zodat bewerken weer werkt.
2.  **Implementeer Localhost Link Resolver:** Ontwikkel een mechanisme (script of dashboard tool) dat:
    *   `src/data` scant op `localhost` URLs.
    *   Deze vergelijkt met de `sites.json` registry (waarin `liveUrl` staat).
    *   De gebruiker de optie geeft om deze te updaten (of dit automatisch doet bij deployment).

## Deliverables
- [ ] Werkende Dock-editing voor `athena-hub`.
- [ ] Een "Link Audit" of "Resolve Links" tool in de Factory/Dashboard.
- [ ] Geüpdatete `showcase.json` in `athena-hub` met live URLs.
