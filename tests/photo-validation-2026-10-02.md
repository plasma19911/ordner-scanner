# Erneute Fotoprüfung am 02.10.2026

Alle acht Uploads wurden erneut mit den echten App-Funktionen `detectRects`
und `extractCard` verarbeitet: 8 + 8 + 8 + 6 + 3 + 7 + 8 + 9 = **57 einzelne
Ausschnitte**. Das bestätigt die Trennung, nicht die Kartenidentität.

Anschließend wurden sämtliche 57 Ausschnitte im Chromium-Browser durch die
reale Funktion `readCard` verarbeitet, mit Tesseract.js, englischem/deutschem,
japanischem/chinesischem Sprachmodell und öffentlichen TCGdex-Abfragen.
Die lokale Prüfung verwendet wie GitHub Pages keinen laufenden Worker für
`api/references`; die vorhandene statische Referenzsammlung bleibt verfügbar.
Einige externe Bild-/Katalogabfragen waren nicht verfügbar. Nutzerfotos werden
nicht veröffentlicht.

## Gemessener Ausgangslauf

- 57/57 OCR-Aufrufe abgeschlossen.
- 39 Ausschnitte mit ausgegebenem Namen.
- 36 Ausschnitte mit ausgegebener Nummer.
- 22 Ausschnitte mit ausgegebenem Produktlink.

**Das sind Ausgabezahlen, keine geprüfte Trefferquote.** Mindestens die deutsche
Galar-Ponita wurde falsch als andere Ponita-Ausgabe zugeordnet. Eine vollständige
sichere Zuordnung aller Karten ist weiterhin nicht erreicht.

## Aus den Fehlern abgeleitete Änderungen

- `0304/09` wurde zunächst gelesen, wegen des kleinen Nenners aber verworfen.
  Gem-Pack-Nummern bleiben nun als Kandidat erhalten; wiederholte Lesungen werden
  weiterhin getrennt bewertet. Zusätzliche untere Lesebereiche berücksichtigen
  Hüllenränder und verschobene Nummernzeilen.
- `SV047/SV122` und andere explizite Teilset-/Promo-Nummern dürfen durch einen
  widersprechenden Referenzbildtreffer nicht mehr ersetzt werden.
- `DPBP#451` wird nicht länger als Promo-Sammlernummer ausgegeben.
- Bei unbekannter Schrift und fehlendem japanischem Treffer wird auch das
  chinesische Namensmodell versucht.
- Erkannte oder eingegebene chinesische Setcodes werden berücksichtigt; `CSV`
  und auseinandergezogene Kennungen werden ebenfalls gelesen.
- Für acht konkrete Drucknummern gibt es nachgeschlagene Cardmarket-Kandidaten:
  CM1C 0304/09, 0402/08, 0701/09, 0702/09, 0704/09;
  CM3C 0202/07, 0203/07, 0204/07. Diese decken neun fotografierte Karten ab.
  Die Existenz der Produktseite ist geprüft, ihre exakte Holo-Zuordnung nicht
  allein aus dem V-Suffix abgeleitet. Daher sind sie Vergleichslinks, keine
  automatisch bestätigten Treffer.
- Ohne lesbaren Setcode werden passende Einträge als Vorschläge angeboten.
  Erst die ausdrückliche Bestätigung setzt Set und Nummer; der Produktlink
  bleibt bis zum Bild-/Variantenabgleich unbestätigt.
- Für Panflam, Feurigel, Magby, Magmar und Ponita werden bei unklarer Ausgabe
  zusätzlich die tatsächlichen Cardmarket-Seiten mit allen Ausgaben verlinkt.

Der gezielte erneute OCR-Lauf mit den neun chinesischen Ausschnitten gab sieben
Nummern und zwei Namen aus; kein chinesischer Produktlink wurde automatisch
bestätigt. Kleine Setcodes, Spiegelungen und unlesbare Titel bleiben Grenzen.
Die zweite Captain-Pikachu-Karte ist **0702/09**, nicht nochmals 0701/09.

## Quellen für die Variantenhilfe

Die Hilfe in der App unterscheidet Setfamilie, Drucknummer, Seltenheit,
Oberflächenmuster, Illustration und Spielmechanik. Sie ist kein vollständiger
chinesischer Kartenkatalog.

Offizielle Beschreibungen der Gem Packs:
- https://www.pokemon.cn/tcg/product/15582.html (Vol. 1; fünf Symbole,
  Typ-/Pokéball-/Meisterball-Muster, Goldprägung, schillernde Illustrationen)
- https://www.pokemon.cn/tcg/product/15518.html (Vol. 2)
- https://www.pokemon.cn/tcg/product/15431.html (Vol. 3)
- https://www.pokemon.cn/tcg/product/20382.html (Vol. 4)
- https://www.pokemon.cn/tcg/product/21078.html (Vol. 5)
- https://www.pokemon.cn/tcg/product/23048.html (Vol. 6)

Weitere offizielle Serieninformationen:
- https://www.pokemon.cn/tcg/product/15585.html (Beginn der chinesischen SV-Serie)
- https://www.pokemon.cn/tcg/product/15541.html (Collect 151)
- https://www.pokemon.cn/tcg/product/16111.html (Schwert & Schild / Spieleffekte)

Die konkret recherchierten Produkt-URLs stehen einzeln in `chinese-cards.js`.
Ein fremder chinesischer Komplettdatensatz wurde wegen eingeschränkter
Weiterverwendungsbedingungen nicht in die App übernommen.

## Prüfungen

`npm test` und `npm run build`; zusätzlich echter Chromium-Oberflächentest für
Variantenhilfe, Kandidatenanzeige und ausdrückliche Setbestätigung. Der Test
prüft auch, dass ein Vorschlag nicht automatisch zum bestätigten Produktlink
wird. Keine Fotos oder Browser-Testbilder im öffentlichen Repository.

Abschließende Wiederholung der zwei konkreten Fehlerfälle mit dem finalen Code:
Krokel behält `0304/09` (zweimal gelesen); die deutsche Galar-Ponita behält
`SV047/SV122` (zweimal gelesen) und wird nicht mehr als `021/195` ausgegeben.
Ihr verkürzt gelesener Name „Ponita“ verhindert noch die sichere Setzuordnung;
die App lässt diesen Fall jetzt offen, statt die falsche Ausgabe zu bestätigen.
