# Fotoprüfung vom 01.10.2026

Die tatsächlichen acht Uploads wurden mit den Funktionen `detectRects` und
`extractCard` aus der App und OpenCV.js 4.9.0 verarbeitet. Die erzeugten
Ausschnitte wurden visuell geprüft. Fotos und Ausschnittbilder werden nicht
im öffentlichen Repository gespeichert.

| Foto | Vorher | Nachher | Befund |
|---|---:|---:|---|
| IMG_20261001_160733(1).jpg | 8 | 8 | Einzelkarten; rechte Randkarte bereits im Original angeschnitten |
| IMG_20261001_160736(1).jpg | 8 | 8 | Einzelkarten |
| IMG_20261001_160739(1).jpg | 8 | 8 | Einzelkarten |
| IMG_20261001_160748(1).jpg | 5 | 6 | Rechtes Voltobal ergänzt; reflektierendes Leerfach verworfen |
| IMG_20261001_160750(1).jpg | 3 | 3 | Drei vollständige Pikachu; obere angeschnittene Karten nicht gezählt |
| IMG_20261001_160757(1).jpg | 7 | 7 | Einzelkarten; Leerfach bleibt leer |
| IMG_20261001_160802(1).jpg | 1 | 8 | Großer Sammelrahmen entfernt; sechs Einzelkonturen + zwei Rasterergänzungen |
| WhatsApp Image 2026-09-30 at 17.35.03.jpeg | 9 | 9 | Einzelkarten |
| **Summe** | **49** | **57** | **Einzelne Ausschnitte, keine Erkennungsquote** |

„Vorher“ zählt ausgegebene Rahmen, nicht korrekt erkannte Karten. Die 57
Ausschnitte sind weder 57 verschiedene Kartentypen noch 57 bestätigte
Cardmarket-Varianten. Angeschnittene Nachbarreihen werden nicht als vollständige
Karten ausgegeben. Leicht perspektivische Ausschnitte können weiterhin Hüllenränder
enthalten und sollten in der Vorschau geprüft werden.

## Cardmarket-Abgleich

Die folgenden zusätzlichen Produktseiten wurden bei Cardmarket gefunden und
anhand von Name, Set und Sammlernummer in die geprüfte Linkliste aufgenommen.
Sie werden erst bei bestätigter Katalogidentität verwendet. Ein Produktlink
bestätigt nicht automatisch Reverse, Stempel, Zustand oder Erstauflage.

| Karte | Produktseite |
|---|---|
| Krokel SVP192 | https://www.cardmarket.com/de/Pokemon/Products/Singles/SV-Black-Star-Promos/Fuecoco-SVP192 |
| Teddiursa 109/144 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Teddiursa-SK109 |
| Ursaring 110/144 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Ursaring-SK110 |
| Voltobal 113/144 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Voltorb-SK113 |
| Lektrobal 36/144 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Electrode-SK36 |
| Unfezant 81/108 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Roaring-Skies/Unfezant-ROS81 |
| Swellow 72/108 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Roaring-Skies/Swellow-ROS72 |
| Dodu 55/83 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Generations/Doduo-GEN55 |
| Lugia 140/189 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Darkness-Ablaze/Lugia-DAA140 |
| Ursaring 172/236 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Cosmic-Eclipse/Ursaring-CEC172 |
| Entei 021/159 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Crown-Zenith/Entei-CRZ021 |
| Natu 151/091 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Paldean-Fates/Natu-V2-PAF151 |
| Galar-Ponita SV047 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Shining-Fates/Galarian-Ponyta |
| Galar-Gallopa SV048 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Shining-Fates/Galarian-Rapidash-SHFSV48 |
| Vulnona 19/124 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Dragons-Exalted/Ninetales-DRX19 |
| Japanisches Vulnona s1a 013/070 | https://www.cardmarket.com/de/Pokemon/Products/Singles/VMAX-Rising/Ninetales-s1a13 |
| Japanisches Zeraora sm12a 050/173 | https://www.cardmarket.com/de/Pokemon/Products/Singles/Tag-All-Stars/Zeraora |

Scorbunny SWSH244 sowie Dedenne, Driftlon-Entwicklung Drifblim, Tinkaton und
Galarian Corsola aus den japanischen Shiny-Sets hatten bereits Zuordnungen.

## Noch offen / nicht als sicher ausgeben

- Die neun chinesischen Ausschnitte (Krokel, Lokroko, Pikachu, Mauzi):
  `CM1C` wird für die Suche zu `CBB1C`, `CM3C` zu `CBB3C`.
  `0304/09` wird als Kartenfamilie `03`, gedruckte Variante `04/09` behandelt.
  Der Cardmarket-Suffix `V4` wird daraus **nicht** abgeleitet. Die App verlinkt
  zusätzlich die tatsächlichen Variantenlisten:
  https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-1 und
  https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-3.
  Bei Suchhelfern bleibt ein erster Treffer ungeprüft und wird nicht automatisch übernommen.
- Die älteren japanischen Panflam-, Feurigel-, Magby-, Magmar- und Ponita-Drucke
  sind anhand der bisherigen OCR-/Referenzdaten nicht durchgehend sicher einer
  Ausgabe zugeordnet. DPBP-Kennungen allein bestätigen keine konkrete Ausgabe.
- Das Volcarona mit Team-Plasma-Stempel und die beiden Eisenfalter mit
  Paradox-Rift-Stempel benötigen einen Abgleich der konkreten Sondervariante.
- Ein zusätzlicher OCR-Lesetest der 57 unteren Kartenränder zeigte zahlreiche
  unlesbare oder falsche Nummern. Er ist ausdrücklich kein erfolgreicher
  Ende-zu-Ende-Test der gesamten App. Die neue Behandlung von `07 01/09` zu
  `0701/09` basiert auf einem dabei beobachteten Fehler.

## Automatisierte Prüfungen

`npm test` prüft Erkennung, Eindeutigkeitsregeln, Links, Referenzen sowie jetzt
auch die originale fehlerhafte Konturenliste, die Ausschnitt-Bedienung in jsdom,
Zeichnen/Löschen/Aufteilen/Überspringen und den Fotoablauf bei fehlendem OpenCV.
`npm run build` muss `card-review.js` mit ausliefern.

Kein abgeschlossener Browser-Ende-zu-Ende-Test aller OCR-/Katalogabfragen;
kein Anspruch auf automatische Erkennung beliebiger zukünftiger Karten.
