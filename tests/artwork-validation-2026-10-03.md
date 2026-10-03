# Sprachübergreifende Artwork-Suche – 03.10.2026

## Geprüfte öffentliche Daten

Die tatsächlichen Antworten von `https://api.tcgdex.net/v2/{language}/cards`
liefern zum Testzeitpunkt:

| Sprache | Einträge | Mit Bild-URL |
| --- | ---: | ---: |
| Englisch | 23.736 | 21.987 |
| Deutsch | 20.498 | 14.871 |
| Japanisch | 12.781 | 3.882 |
| Chinesisch vereinfacht (API-Code zh-cn) | 877 | 0 |
| Chinesisch traditionell (zh-tw) | 7.436 | 2.146 |

Eine Bild-URL bedeutet noch nicht, dass das Bild beim Abruf verfügbar ist.
Diese Tabelle ist kein Zähler aller weltweit erschienenen Drucke. Die zh-cn-
Antwort enthält außerdem traditionelle Schreibweisen; sie bestätigt keine
Zuordnung zu den fotografierten vereinfachten chinesischen Gem-Pack-Drucken.

Gleiche Karten-IDs werden nur innerhalb des internationalen en/de-Katalogs
für Namen verbunden. Bei Japanisch existieren Kollisionen: `neo4-100` bezeichnet
in der geprüften englischen Liste „Lucky Stadium“, in der japanischen Liste
„ビルからのメール“. Deshalb werden japanische Sets nicht blind aus englischen IDs
übernommen. 8.827 Namensalias-Einträge werden versioniert mitgeliefert.

## Echte Bildprüfungen

Drei vorhandene Ausschnitte wurden im echten lokalen Chromium ohne simulierten
Bildabgleich verglichen. Der englische Name war für diesen gezielten Komponententest
vorgegeben; das Ergebnis beweist keine neue OCR-Erkennung dieser Namen.

- Japanisches Panflam: 15 englische Referenzen geprüft. Die passende Illustration
  `dp1-76` erreicht 335 geometrisch übereinstimmende Merkmale. Die englische
  Ausgabe wird nur als Artwork-Referenz angezeigt.
- Japanisches Magby aus dem bisher unklaren Ausschnitt: zehn englische Referenzen,
  kein ausreichender Treffer. Auch der neue Suchweg darf hier nichts erfinden.
- Chinesisches Kapitän-Pikachu: 184 englische Referenzen gefunden, 60 nach
  Vorsortierung geometrisch geprüft; kein ausreichender Treffer. Ein englischer
  Katalog enthält nicht zwangsläufig chinesische oder japanische Exklusiv-Artworks.

Der zuvor noch schwache zweite Panflam-Kandidat wird durch zusätzliche Grenzen
für Bildabdeckung, Trefferquote und Bildvergleichswert ausgeschlossen.

## Sicherheit der Zuordnung und Grenzen

Ein fremdsprachiges Artwork setzt keine Sprache, Nummer, Set-ID oder Produkt-URL.
Korrekturen während einer laufenden Suche verwerfen veraltete Ergebnisse.
Bestätigte englische Namensübersetzungen werden auf diesem Gerät gespeichert.
Katalog- und Bildfehler bleiben sichtbar. Pokémon-Species-Seiten und Namenssuchen
sind Suchhilfen, keine bestätigten Produktlinks.

Für eine sichere komplette Zuordnung fehlen insbesondere Referenzen für einige
japanische Exklusivkarten, vereinfachte chinesische Drucke, Stempel und Holo-Varianten.
Ein gemeinsames Artwork beweist keine gemeinsame Ausgabe. Alle Karten und Varianten
in allen vier Sprachen automatisch korrekt zu verlinken ist mit diesen Daten nicht
nachgewiesen und wird nicht behauptet.

Primärquellen:
- https://tcgdex.dev/status
- https://tcgdex.dev/reference/card
- https://help.cardmarket.com/en/cardmarket-api (keine neuen API-Anträge)
- https://www.cardmarket.com/de/Pokemon/Species/Pikachu (automatischer Abruf: HTTP 403)

Regressionstests prüfen gespeicherte Namen, englische Suchparameter, Ausschluss
fremder Bildhosts/TCG Pocket, Trennung von Artwork und Druck sowie veraltete Antworten.
