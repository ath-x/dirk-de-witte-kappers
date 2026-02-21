# Specification: Athena Hub Fixes

## 1. Dock Editing Repair
**Probleem:** De gebruiker meldt dat `editableLink`, `editableMedia` etc. niet werken in de Dock context voor `athena-hub`.
**Oorzaak (Hypothese):** Verouderde componenten of mismatch tussen `dock-connector.js` en de React componenten. De `data-dock-type` attributen ontbreken mogelijk of worden verkeerd gelezen door de Dock.

**Oplossing:**
- Vergelijk `sites/athena-hub/src/components/Editable*.jsx` met de laatste "golden standard" (uit een recent werkende site of template).
- Zorg dat `dock-connector.js` in `sites/athena-hub/src/` up-to-date is.
- Verifieer dat `Section.jsx` de props correct doorgeeft.

## 2. Centralized Live Registry & Link Resolver
**Probleem:** Links in `data/*.json` wijzen vaak naar `localhost`, en er is geen centraal overzicht van welke sites al live staan.
**Oplossing:** 
1. **Registry Sync:** Een script dat `sites/*/project-settings/deployment.json` scant en de centrale `dock/public/sites.json` bijwerkt met `liveUrl` en `status`.
2. **Dock UI Integration:** De `VisualEditor` in de Dock krijgt een "Live Projects" selector voor link-velden.

## 4. Live URL Management GUI
**Probleem:** Het beheren van live URLs is nu verspreid over individuele JSON bestanden.
**Oplossing:** Een centrale "Live Manager" in het Athena Dashboard.
- **Backend:** Een API die alle `deployment.json` bestanden verzamelt en kan updaten.
- **Frontend:** Een tabel-overzicht in het Dashboard voor snelle edits van Live URLs en Repo URLs.

## 5. Dock UI Refinement (Link Picker)
**Verbetering:** Vervang de "pills" in de `VisualEditor` door een dropdown-menu voor een compactere en professionelere weergave van live site suggesties.

**Flow:**
- Gebruiker klikt "Deploy" of "Audit Links".
- Systeem toont: "Gevonden localhost links: 3. Vervangen door live versies?"
- [Ja] -> Update JSON files -> Git Commit -> Klaar voor push.
