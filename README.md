# Ny bil — EV vs. Benzin Totaløkonomi Sammenligner

> Et web-værktøj, der sammenligner den samlede økonomi (totalomkostning) ved en elbil kontra en benzinbil, så et bilkøb kan træffes på et oplyst grundlag.

> **Status i Paperclip:** `planned` (fungerende prototype i repoet) · **Repo:** [github.com/qvisty/Ny_bil](https://github.com/qvisty/Ny_bil) · Del af ClipCores portefølje af små, nyttige web-værktøjer.

---

## Formål og vision

Formålet er at gøre det let at gennemskue, om en elbil eller en benzinbil samlet set er billigst over ejertiden. Værktøjet regner totaløkonomi — ikke kun listepris, men også drift, brændstof/strøm og øvrige omkostninger — og præsenterer en klar sammenligning.

Visionen er en simpel, hurtig web-side, hvor man indtaster forudsætninger og straks ser hvilken biltype der bedst betaler sig, og hvorfor.

## Slutmål (Definition of Done)

- En brugbar sammenligner, der giver et retvisende totaløkonomi-billede af EV vs. benzin.
- Klare, forståelige resultater for en almindelig bruger uden regnearks-arbejde.

## Nuværende status

- **Fase:** Prototype (projekt markeret `planned`)
- **Prioritet:** low
- **Hvor langt er vi:** Der ligger en fungerende frontend-prototype i repoet: en beregningsmotor ([`calculator.js`](https://github.com/qvisty/Ny_bil/blob/main/calculator.js)), bildata ([`car-data.js`](https://github.com/qvisty/Ny_bil/blob/main/car-data.js)), applikationslogik ([`app.js`](https://github.com/qvisty/Ny_bil/blob/main/app.js)) samt UI ([`index.html`](https://github.com/qvisty/Ny_bil/blob/main/index.html) og [`style.css`](https://github.com/qvisty/Ny_bil/blob/main/style.css)).
- **Seneste milepæl:** Prototype med beregningsmotor og bildata på plads.

## Planlægning og faser

- ✅ **Fase 1 — Prototype:** Beregningsmotor, bildata og UI.
- 🔧 **Fase 2 — Datakvalitet:** Verificér og udbyg bildata og omkostningsforudsætninger.
- ⬜ **Fase 3 — Brugervenlighed:** Forbedr input/resultat-visning og forklaringer.
- ⬜ **Fase 4 — Publicering:** Deploy (fx GitHub Pages) og evt. deling.

## Mangler på kort sigt (næste skridt)

- [ ] Gennemgå og verificér forudsætningerne i beregningsmotoren (brændstofpriser, strøm, afgifter, afskrivning).
- [ ] Udvid/kvalitetssikr `car-data.js` med flere modeller og realistiske tal.
- [ ] Gør resultaterne mere forklarende (hvad driver forskellen).

## Mangler på lang sigt (roadmap)

- [ ] Publicér værktøjet offentligt (GitHub Pages).
- [ ] Evt. gem/del scenarier.
- [ ] Løbende opdatering af priser/afgifter, så beregningen holder.

## Teknik og opsætning

- **Stak:** Ren frontend (HTML, CSS, vanilla JavaScript) — ingen backend.
- **Kørsel:** Åbn `index.html` i en browser (eller server mappen statisk).

```bash
git clone https://github.com/qvisty/Ny_bil.git
cd Ny_bil
# Åbn index.html i en browser, eller server statisk:
python -m http.server 8000   # http://localhost:8000
```

## Links

- **GitHub-repo:** [github.com/qvisty/Ny_bil](https://github.com/qvisty/Ny_bil)
- **Beregningsmotor:** [`calculator.js`](https://github.com/qvisty/Ny_bil/blob/main/calculator.js)
- **Bildata:** [`car-data.js`](https://github.com/qvisty/Ny_bil/blob/main/car-data.js)
- **README-standard:** [CLIA-4052](/CLIA/issues/CLIA-4052)

---
_Sidst opdateret: 2026-09-04 · Vedligeholdes som del af [CLIA-4052](/CLIA/issues/CLIA-4052)._
