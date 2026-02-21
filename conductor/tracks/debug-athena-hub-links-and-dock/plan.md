# Plan: Debug Athena Hub & Link Resolver

## Phase 1: Fix Dock Editing in athena-hub
- [x] **Audit Components:** Vergelijk `EditableText.jsx`, `EditableLink.jsx`, `EditableMedia.jsx` in `athena-hub` met een werkende referentie (bv. `de-salon-site` of templates).
- [x] **Update Components:** Overschrijf/patch de verouderde componenten in `sites/athena-hub/src/components/`.
- [x] **Update Connector:** Controleer en update `sites/athena-hub/public/dock-connector.js` en `src/dock-connector.js`.
- [x] **Verify:** Test of bewerken in de Dock weer werkt (via preview).

## Phase 2: Implement Link Resolver System
- [x] **Create Utility Script:** Maak `factory/6-utilities/resolve-localhost-links.js`.
- [ ] **CLI Integration:** Voeg toe aan `factory/cli/athena-cli.js`.

## Phase 3: Centralized Live Registry
- [x] **Create Sync Script:** Maak `factory/5-engine/sync-sites-registry.js` om `dock/public/sites.json` te vullen op basis van alle `deployment.json` bestanden in de `sites/` map.
- [x] **Automate Sync:** Registry gesynchroniseerd.

## Phase 4: Dock UI Integration
- [x] **Update VisualEditor:** Pas `dock/src/components/VisualEditor.jsx` aan.
    - [x] Haal de lijst met sites op uit de registry.
    - [x] Toon een dropdown/lijst met live URL suggesties wanneer een link wordt bewerkt.
- [ ] **Verify:** Test de nieuwe link-picker in de Dock met `athena-hub`.

## Phase 5: Live URL Management GUI (Dashboard)
- [x] **Backend API:** Voeg `/api/sites/all-deployments` toe aan de SiteController en Athena server om alle deployment data in één keer op te halen en bij te werken.
- [x] **Dashboard View:** Maak een nieuwe sectie "Live Manager" in `factory/dashboard/public/index.html`.
- [x] **Dashboard JS:** Update `app.js` om deze tabel te laden en bewerkingen op te slaan.

## Phase 6: Dock UI Refinement
- [x] **Dropdown Selector:** Vervang de "pills" in `VisualEditor.jsx` door een `<select>` dropdown menu voor live site URLs.
- [x] **Verify:** Test of de dropdown in de Dock correct werkt en de URL invult.
