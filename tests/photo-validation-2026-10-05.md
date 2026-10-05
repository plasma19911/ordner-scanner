# Fotoprüfung und Cardmarket-Links – 05.10.2026

**57 Kartenausschnitte geprüft: 40 automatische Produktlinks, 8 zusätzlich manuell zugeordnete Karten, 9 chinesische Karten mit noch unbestätigter Holo-Zuordnung.**

Für jede Karte steht unten eine direkte Produktseite. Bei „Holo prüfen“ ist sie nur ein **Kandidat**: Die Cardmarket-V-Nummer ist kein Beweis für das Holo-Muster. Diese neun Links zählen nicht als exakt bestätigte Zuordnung. Es wurde keine vollständige automatische Erkennung aller 57 Karten erreicht.

## Testumfang

- Ausgangsstand `e8c174aa`: vollständiger Browserlauf über 57 Ausschnitte, 33 automatische direkte Links.
- Zweiter vollständiger Lauf über alle 57 Ausschnitte mit Fußzeilen-/Sprachkorrekturen: 39 automatische Links. Anschließende gezielte Tests der nummerngestützten Bildprüfung und regionalen Setnamen erhöhen den gemessenen Stand auf 40. Die letzte Suchoberflächen-Änderung wurde separat im Browser getestet; kein dritter vollständiger 57-Karten-Lauf.
- Erneute echte OCR mit PaddleOCR und Tesseract sowie Katalog-/Bildabgleich; keine simulierten OCR-Texte und keine auf Dateinamen basierenden Erkennungsregeln.
- Nachtests bestätigen zusätzliche Links für Scorbunny SWSH244, Cyndaquil L1SS014, Volcarona PLB13, Magmar Pt3017, Ursaring SK110, Natu PAF151 und Galarian Corsola s4a248.
- Galarian Corsola: 267 geometrisch passende Bildpunkte über die Karte, aber nur sechs im flächigen Artwork. Die Ausnahme benötigt eine übereinstimmende, widerspruchsfreie gelesene Nummer sowie mindestens 150 Bildpunkte, 70 % Inlier-Anteil, 30 % Bildabdeckung und vier Artwork-Punkte. Ein deutlicher Abstand zum zweitbesten Bild bleibt nötig. Ein Kartenrahmen allein reicht weiterhin nicht.
- Browsertests verwendeten zwischengespeicherte öffentliche Referenzantworten über den Testserver. Das prüft Erkennung, jedoch nicht die aktuelle CORS-Verfügbarkeit aller externen Anbieter.
- Die 57 bereits getrennten Ausschnitte wurden geprüft. Das ist kein neuer Test der automatischen Seitentrennung. Die vorhandenen Trennungs-/Drehungstests bleiben Teil von `npm test`.
- Private Fotos sind nicht im Repository enthalten. Die JSON-Datei enthält Sollzuordnung und tatsächlich beobachtete App-Ausgabe getrennt.

## Korrigierte Zuordnungen

Beide ersten Captain-Pikachu-Fotos zeigen **0701/09**, nicht 0702/09. Der ältere Prüfbericht enthielt einen falschen Sollwert. Die zwei japanischen Dedenne sind beide **250/190 aus Shiny Star V**. Die japanische Ninetales ist **013/070 aus VMAX Rising**. Die beiden Eisenfalter haben den **Paradoxrift-Setstempel** und passen zur Produktvariante **V6**; die ungestempelte Standardkarte wäre falsch.

TCGdex lieferte für einige japanische SV4a-Ergebnisse einen falschen Setnamen. Die App korrigiert diese Setnamen jetzt anhand bestätigter japanischer Setcodes (s4a, sv4a und sm12a). Die Sollspalte nennt Shiny Treasure ex; ältere tatsächliche App-Ausgaben bleiben als Beobachtung in der JSON-Datei sichtbar. Der Produktlink wird separat bewertet.

## Alle 57 Karten

Ausschnittnummern beziehen sich auf die nummerierten Einzelbilder des jeweiligen Fotos. „Automatisch“ bedeutet, dass die App einen direkten Link ausgegeben hat. „Manuell zugeordnet“ bedeutet: am Foto und anhand öffentlicher Quellen identifiziert, aber noch kein automatischer Treffer. Keine Aussage zum Kartenzustand oder zur Erstauflage.

| Foto / Ausschnitt | Karte | Nummer | Set / Ausgabe | Status | Cardmarket |
|---|---|---|---|---|---|
| 160733 / 1 | Chimchar Lv.8 | ohne Sammlernummer | Space-Time Creation | Manuell zugeordnet | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Space-Time-Creation/Chimchar-Lv8-DP1) |
| 160733 / 2 | Chimchar Lv.8 | ohne Sammlernummer | Space-Time Creation | Manuell zugeordnet | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Space-Time-Creation/Chimchar-Lv8-DP1) |
| 160733 / 3 | Fuecoco | 0304/09 | Gem Pack Vol. 1 | Holo prüfen | [Kandidat](https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-1/Fuecoco-V4-CBB1C03) |
| 160733 / 4 | Krokel | SVP192 | SV Black Star Promos | Manuell zugeordnet | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/SV-Black-Star-Promos/Fuecoco-SVP192) |
| 160733 / 5 | Crocalor | 0402/08 | Gem Pack Vol. 1 | Holo prüfen | [Kandidat](https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-1/Crocalor-V2-CBB1C04) |
| 160733 / 6 | Scorbunny | SWSH244 | SWSH Black Star Promos | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/SWSH-Black-Star-Promos/Scorbunny-SWSH244) |
| 160733 / 7 | Scorbunny | SWSH244 | SWSH Black Star Promos | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/SWSH-Black-Star-Promos/Scorbunny-SWSH244) |
| 160733 / 8 | Scorbunny | SWSH244 | SWSH Black Star Promos | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/SWSH-Black-Star-Promos/Scorbunny-SWSH244) |
| 160736 / 1 | Cyndaquil | 014/070 | SoulSilver Collection | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/SoulSilver-Collection/Cyndaquil-L1SS014) |
| 160736 / 2 | Volcarona | 013/101 | Plasma Blast | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Plasma-Blast/Volcarona-PLB13) |
| 160736 / 3 | Eisenfalter | 028/182 | Paradoxrift – Setstempel | Manuell zugeordnet | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Paradox-Rift/Iron-Moth-V6-PAR028) |
| 160736 / 4 | Eisenfalter | 028/182 | Paradoxrift – Setstempel | Manuell zugeordnet | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Paradox-Rift/Iron-Moth-V6-PAR028) |
| 160736 / 5 | Magby Lv.5 | ohne Sammlernummer | Secret of the Lakes | Manuell zugeordnet | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Secret-of-the-Lakes/Magby-Lv5-DP2) |
| 160736 / 6 | Magby | 012/080 | Clash at the Summit | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Clash-at-the-Summit/Magby-L3012) |
| 160736 / 7 | Magby Lv.5 | ohne Sammlernummer | Bastiodon the Defender | Manuell zugeordnet | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Bastiodon-the-Defender/Magby-Lv5-BtD) |
| 160736 / 8 | Magmar | 017/100 | Beat of the Frontier | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Beat-of-the-Frontier/Magmar-Lv28-Pt3017) |
| 160739 / 1 | Entei | 021/159 | Crown Zenith | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Crown-Zenith/Entei-CRZ021) |
| 160739 / 2 | Entei | 021/159 | Crown Zenith | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Crown-Zenith/Entei-CRZ021) |
| 160739 / 3 | Ninetales | 013/070 | VMAX Rising | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/VMAX-Rising/Ninetales-s1a13) |
| 160739 / 4 | Vulnona | 019/124 | Hoheit der Drachen | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Dragons-Exalted/Ninetales-DRX19) |
| 160739 / 5 | Ponyta | 018/090 | Advent of Arceus | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Advent-of-Arceus/Ponyta-Lv8-Pt4018) |
| 160739 / 6 | Ponyta | 018/090 | Advent of Arceus | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Advent-of-Arceus/Ponyta-Lv8-Pt4018) |
| 160739 / 7 | Ponyta | 018/090 | Advent of Arceus | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Advent-of-Arceus/Ponyta-Lv8-Pt4018) |
| 160739 / 8 | Ponyta | 018/090 | Advent of Arceus | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Advent-of-Arceus/Ponyta-Lv8-Pt4018) |
| 160748 / 1 | Zeraora | 050/173 | Tag All Stars | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Tag-All-Stars/Zeraora) |
| 160748 / 2 | Zeraora | 050/173 | Tag All Stars | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Tag-All-Stars/Zeraora) |
| 160748 / 3 | Voltobal | 113/144 | Skyridge | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Voltorb-SK113) |
| 160748 / 4 | Voltobal | 113/144 | Skyridge | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Voltorb-SK113) |
| 160748 / 5 | Lektrobal | 036/144 | Skyridge | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Electrode-SK36) |
| 160748 / 6 | Lektrobal | 036/144 | Skyridge | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Electrode-SK36) |
| 160750 / 1 | Captain Pikachu | 0701/09 | Gem Pack Vol. 1 | Holo prüfen | [Kandidat](https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-1/Captain-Pikachu-V1-CBB1C07) |
| 160750 / 2 | Captain Pikachu | 0701/09 | Gem Pack Vol. 1 | Holo prüfen | [Kandidat](https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-1/Captain-Pikachu-V1-CBB1C07) |
| 160750 / 3 | Captain Pikachu | 0704/09 | Gem Pack Vol. 1 | Holo prüfen | [Kandidat](https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-1/Captain-Pikachu-V4-CBB1C07) |
| 160757 / 1 | Dodu | 055/083 | Generationen | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Generations/Doduo-GEN55) |
| 160757 / 2 | Lugia | 140/189 | Darkness Ablaze | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Darkness-Ablaze/Lugia-DAA140) |
| 160757 / 3 | Lugia | 140/189 | Darkness Ablaze | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Darkness-Ablaze/Lugia-DAA140) |
| 160757 / 4 | Lugia | 140/189 | Darkness Ablaze | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Darkness-Ablaze/Lugia-DAA140) |
| 160757 / 5 | Unfezant | 081/108 | Roaring Skies | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Roaring-Skies/Unfezant-ROS81) |
| 160757 / 6 | Unfezant | 081/108 | Roaring Skies | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Roaring-Skies/Unfezant-ROS81) |
| 160757 / 7 | Swellow | 072/108 | Roaring Skies | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Roaring-Skies/Swellow-ROS72) |
| 160802 / 1 | Meowth | 0202/07 | Gem Pack Vol. 3 | Holo prüfen | [Kandidat](https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-3/Meowth-V2-CBB3C02) |
| 160802 / 2 | Meowth | 0202/07 | Gem Pack Vol. 3 | Holo prüfen | [Kandidat](https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-3/Meowth-V2-CBB3C02) |
| 160802 / 3 | Meowth | 0203/07 | Gem Pack Vol. 3 | Holo prüfen | [Kandidat](https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-3/Meowth-V3-CBB3C02) |
| 160802 / 4 | Meowth | 0204/07 | Gem Pack Vol. 3 | Holo prüfen | [Kandidat](https://www.cardmarket.com/de/Pokemon/Products/Singles/Gem-Pack-Vol-3/Meowth-V4-CBB3C02) |
| 160802 / 5 | Teddiursa | 109/144 | Skyridge | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Teddiursa-SK109) |
| 160802 / 6 | Teddiursa | 109/144 | Skyridge | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Teddiursa-SK109) |
| 160802 / 7 | Ursaring | 110/144 | Skyridge | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Ursaring-SK110) |
| 160802 / 8 | Ursaring | 172/236 | Cosmic Eclipse | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Cosmic-Eclipse/Ursaring-CEC172) |
| WhatsApp / 1 | Dedenne | 250/190 | Shiny Star V | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Shiny-Star-V/Dedenne-V2-s4a250) |
| WhatsApp / 2 | Dedenne | 250/190 | Shiny Star V | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Shiny-Star-V/Dedenne-V2-s4a250) |
| WhatsApp / 3 | Drifblim | 261/190 | Shiny Treasure ex | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Shiny-Treasure-ex/Drifblim-V2-sv4a261) |
| WhatsApp / 4 | Natu | 151/091 | Paldean Fates | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Paldean-Fates/Natu-V2-PAF151) |
| WhatsApp / 5 | Tinkaton | 273/190 | Shiny Treasure ex | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Shiny-Treasure-ex/Tinkaton-V2-sv4a273) |
| WhatsApp / 6 | Galarian Corsola | 248/190 | Shiny Star V | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Shiny-Star-V/Galarian-Corsola-V2-s4a248) |
| WhatsApp / 7 | Galar-Ponita | SV047/SV122 | Glänzendes Schicksal Glitzer-Tresor | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Shining-Fates/Galarian-Ponyta) |
| WhatsApp / 8 | Galarian Ponyta | SV047/SV122 | Shining Fates Shiny Vault | Automatisch | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Shining-Fates/Galarian-Ponyta) |
| WhatsApp / 9 | Galarian Rapidash | SV048/SV122 | Shining Fates | Manuell zugeordnet | [Produkt](https://www.cardmarket.com/de/Pokemon/Products/Singles/Shining-Fates/Galarian-Rapidash-SHFSV48) |

## Quellen und verbleibende Grenzen

- [Offizieller japanischer Chimchar-Katalogeintrag](https://www.pokemon-card.com/card-search/details.php/card/1021/regu/DP): DP1, DPBP#451, KP 50. DPBP ist keine Sammlernummer.
- [Offizieller Magby-Katalogeintrag, Secret of the Lakes](https://www.pokemon-card.com/card-search/details.php/card/2019) und [Bastiodon the Defender](https://www.pokemon-card.com/card-search/details.php/card/2124): unterschiedliche Bilder trotz gleicher Spielwerte und DPBP#148.
- [Eisenfalter-Produktbild mit Paradoxrift-Stempel und Produktcode V6](https://www.gengar.cz/en/p/iron-moth-par-028), zusätzlich die direkte Cardmarket-Produktseite aus der Tabelle.
- Die übrigen direkten Links kommen aus den geprüften Produktzuordnungen in `links.json` und `CM_PRODUCTS_BY_ID`. Chinesische Kandidaten stehen in `chinese-cards.js` und bleiben dort ausdrücklich unbestätigt.
- Cardmarket blockiert hier direkte automatisierte Seitenabrufe mit HTTP 403. Linkexistenz wurde zusätzlich über öffentliche Suchindizes recherchiert; es wird kein vollständiger Live-HTTP-Test aller Produktseiten behauptet.
- Offen in der automatischen Erkennung: die alten unnummerierten japanischen Karten, Krokel SVP192, die Setstempel von Eisenfalter, Galarian Rapidash SV048/SV122 und die chinesischen Druck-/Holo-Varianten. Ein scharfes Detailfoto der Nummer bzw. ein schräges Foto der Holo-Oberfläche kann zusätzliche Evidenz liefern.

Maschinenlesbar: [Soll- und Ist-Ergebnisse](photo-audit-2026-10-05.json).
