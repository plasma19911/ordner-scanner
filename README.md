# Ordner-Scanner

Die GitHub-Pages-Version nutzt eine mitgelieferte Sammlung öffentlicher Referenzbilder. Der Workflow `Validate scanner and cache Pages references` baut diese Sammlung auf dem Reparatur-Branch; sie wird beim Zusammenführen mit veröffentlicht. Die Sammlung beginnt mit den Pokémon aus den bereitgestellten Beispielfotos. Weitere Suchnamen können in `scripts/cache-references.mjs` ergänzt und über den Workflow aktualisiert werden.

Weitere deutsche und englische Karten werden ergänzend im offenen TCGdex-Katalog gesucht. Für japanische Drucke außerhalb der mitgelieferten Sammlung ist die Live-Referenzsuche nur auf der Cloudflare-Version verfügbar. GitHub Pages kann diese API nicht ausführen.

Der Cardmarket-Button öffnet ausschließlich direkte Produktseiten: geprüfte Zuordnungen, gespeicherte Links oder Ergebnisse eines eingerichteten Suchhelfers. Unbekannte Produkte erhalten keine erfundene URL über einen externen Weiterleitungsdienst. Den passenden Google-Treffer kann man kopieren und unter „Korrigieren“ übernehmen; Links mit und ohne `www` sowie Google-Verpackungen werden erkannt.

Fotos werden im Browser verarbeitet und nicht in das Repository hochgeladen. Die Referenzsammlung enthält öffentlich verfügbare Katalogbilder, keine Fotos des Nutzers.

Prüfen: `npm test`, `npm run build`. Ein lokaler Server ist für die veröffentlichte GitHub-Pages-Version nicht erforderlich.

## Erkennung für weitere Karten

Die Erkennung bewahrt jetzt auch vierstellige chinesische Nummern mit kleinem Nenner und Promo-Kennungen (z. B. `0202/07`, `SWSH244`, `029/PCG-P`). Ein gedruckter chinesischer Code wie `CM3C` aktiviert das chinesische OCR-Modell. Er bestätigt noch keine Katalogausgabe; die Oberfläche weist auf die nötige Prüfung hin. Westliche Promos werden zusätzlich über ihre Katalog-ID abgefragt. Japanische Promo-Kennungen werden erhalten, benötigen aber weiterhin passende Katalog-/Referenzdaten.

Referenzbilder dürfen sicher gelesene Nummern, Sprache und bestätigte Setcodes nicht überschreiben. Gleich stark unterstützte asiatische Titel bleiben offen. Diese Prüfungen verringern falsche Zuordnungen; sie ersetzen keinen vollständigen Katalog.

Für eine breite Abdeckung sind als nächste Ausbaustufen nötig:

- Ein versionierter Referenzindex pro Sprache, Set und Druck, einschließlich Trainer, Energien, Promos und Karten ohne Sammlernummer. Die aktuelle kleine Pages-Sammlung ist kein Vollkatalog.
- Kandidatensuche über Bildmerkmale auch ohne lesbaren Namen; anschließende Prüfung von Nummer, Setlogo/-code und Sprache am vollständigen Kartenbild. Gleiche Illustrationen in verschiedenen Sets dürfen nicht zusammenfallen.
- Getrennte Identität für Karte und Variante (Stempel, Holo, Reverse). Ohne erkennbare Variantenmerkmale bleibt die Variante offen.
- Verifizierte Zuordnung von Katalog-ID und Variante zu Cardmarket-Produkt. Ein Google-Suchergebnis allein bestätigt die Ausgabe nicht; auch die bestehende Suchhelfer-Anbindung benötigt diese zusätzliche Inhaltsprüfung.
- Ein fester Fototestsatz mit manuell geprüfter Sollkarte pro Ausschnitt. Getrennt messen: Ausschnitte, Name, Nummer, Set, Sprache, Variante und Produktlink. Neue unbekannte Karten gehören in einen unabhängigen Testsatz, damit Verbesserungen nicht nur auf bekannte Fotos passen.

Validiert sind die automatisierten Regressionstests und der Build. Diese Änderung enthält keinen abgeschlossenen End-to-End-Test aller hochgeladenen Fotos und keine Zusage, jede Karte oder Variante zu erkennen.

## Einzelkarten-Vorschau (01.10.2026)

Jedes Foto wird vor der Texterkennung als Ausschnitt-Vorschau angezeigt.
Prüfe dort, dass jedes Vorschaubild genau eine Karte enthält. Du kannst Rahmen
mit Maus oder Finger hinzufügen, über die Miniatur auswählen und löschen.
Ein ausgewählter Rahmen lässt sich über Spalten und Zeilen aufteilen.
„Karten erkennen“ verarbeitet nur diese Ausschnitte; „Foto überspringen“
verarbeitet nichts. Wenn OpenCV nichts findet oder nicht lädt, wird das Foto
nicht mehr stillschweigend als Einzelkarte eingelesen. Die Rahmen können dann
von Hand gesetzt werden. Vollständige Einzelkarten können über „Ganzes Foto
als Rahmen“ übernommen werden.

Der Test mit acht tatsächlichen Uploads ergibt 57 einzelne Kartenausschnitte,
vorher 49 Rahmen einschließlich einer großen Fehlmarkierung. Die genaue
Abdeckung, gefundenen Produktlinks und weiterhin offenen Varianten stehen in
[der Fotoprüfung](tests/photo-validation-2026-10-01.md). Zuschnitt-Erfolg und
sichere Karten-/Varianten-Erkennung werden getrennt bewertet.

## Chinesische Varianten und erneute OCR-Prüfung (02.10.2026)

Die App erklärt chinesische Setfamilien, Gem-Pack-Drucknummern, Seltenheitssymbole
und Holo-Muster. Für die fotografierten Gem-Pack-Varianten gibt es konkrete
Cardmarket-Vergleichslinks und bestätigbare Vorschläge bei fehlendem Setcode.
DPBP-Kennungen gelten nicht mehr als Promo-Nummern; gelesene Teilset- und
Promo-Nummern schützen vor widersprechenden Bildtreffern.

Alle 57 Ausschnitte wurden durch die echte OCR geprüft. Noch sind nicht alle
Karten automatisch sicher zugeordnet. Messwerte und Grenzen stehen in
[der erneuten Fotoprüfung](tests/photo-validation-2026-10-02.md).

## Zusätzliche lokale OCR (03.10.2026)

PaddleOCR liest zusätzlich den vollständigen Einzelkartenausschnitt in einem
Browser-Worker. Nur Text aus dem Titelbereich wird als Name und aus dem Fußbereich
als Drucknummer verwendet. Widersprechende sichere Nummern bleiben zur Prüfung
offen. Falls das zusätzliche Modell nicht verfügbar ist, bleibt die bisherige
Erkennung nutzbar. Fotos werden nicht an einen OCR-Dienst gesendet.

`npm run build:ocr` erzeugt die lokale Laufzeit aus fest versionierten Paketen.
Die Modelle werden beim ersten Einsatz vom offiziellen Paddle-Modellserver geladen.
Der Workflow `Build local OCR and extended references` stellt die Laufzeit auch
für die statische GitHub-Pages-Version bereit. Die Referenzsammlung wurde um die
weiteren Pokémon aus den Testfotos erweitert. Ein Bildtreffer benötigt ausreichend
Übereinstimmung innerhalb der Illustration; gleicher Kartentext allein reicht nicht.

## Englische Namen und sprachübergreifende Artworks (03.10.2026)

Fehlt ein eindeutiger Produktlink, sucht die App zusätzlich nach öffentlichen
englischen Referenzbildern des Pokémon bzw. des genauen Trainer-/Itemnamens.
Der Bildvergleich verwendet Merkmale innerhalb der Illustration, nicht den
fremdsprachigen Regeltext. Bis zu acht passende Kandidaten werden angezeigt.
Bei großen Sammlungen wählt ein Bildvergleich der verkleinerten Illustrationen
60 Kandidaten für die ausführliche Prüfung; die Oberfläche nennt beide Zahlen.
Ein Artwork-Treffer übernimmt weder Sprache noch Set oder Nummer der englischen
Referenz. „Artwork bestätigen“ bestätigt nur die Illustration.

Der Cardmarket-Übersichtslink ist auf die gespeicherten Pokémonnamen erweitert.
Für Trainer, Items und Namen mit Sonderzeichen öffnet er die Namenssuche.
Das Feld „Englischer Name“ kann korrigiert werden; bestätigte Übersetzungen
bleiben im lokalen Namensspeicher des Browsers. Die mitgelieferte Datei
`name-aliases.json` enthält 8.827 eindeutige Alias-Einträge aus dem englischen
und deutschen TCGdex-Katalog. Mehrdeutige Übersetzungen werden nicht geraten.
Die vorhandenen Pokémonnamen ergänzen Japanisch und beide chinesischen Schriften.
Weitere Trainer-/Itemübersetzungen können bestätigt gespeichert werden; dies
ist noch kein vollständiges japanisches oder chinesisches Trainerwörterbuch.

Aktualisierung: `node scripts/build-name-index.mjs`. Fotos bleiben lokal.
Die Cardmarket-Seiten ließen sich im Test nicht automatisiert abrufen (HTTP 403).
Die Artwork-Bilder stammen deshalb aus TCGdex, nicht aus einem behaupteten
Cardmarket-Vollimport. Details, Sprachabdeckung und verbleibende Grenzen:
[Artwork-Prüfung](tests/artwork-validation-2026-10-03.md).

### Kostenlose zusätzliche Artwork-Quellen

Die Artwork-Suche benötigt kein Konto und keinen API-Schlüssel. Sie durchsucht
TCGdex anhand bekannter Namensübersetzungen auch auf Deutsch, Japanisch und
Chinesisch. Zusätzlich enthält `free-artwork-features.json` lokale Bildmerkmale
von zehn öffentlich zugänglichen Referenzen; Quellen und Ausgaben stehen in
`free-artwork-sources.json`. Damit funktionieren diese Vergleiche auch bei
Ausfall der Katalog-API und bei unlesbarem Namen. Vorschauen stammen vom jeweiligen
Originalanbieter. Ein Artwork-Treffer bestätigt weiterhin keine Holo-Variante oder
Cardmarket-Ausgabe. Details: `tests/free-sources-validation-2026-10-03.md`.

### Einzelkarten, Ausrichtung und Set-Hinweise

Eindeutige Einzelrahmen laufen automatisch weiter; die Checkbox über dem Upload
schaltet dies aus. Ergänzte oder unklare Rahmen bleiben im Zuschnitt-Editor.
Jede Karte wird unabhängig über Titel und Fußzeile ausgerichtet. Widersprüchliche
Nummernlesungen bleiben unsicher. Auch noch nicht übersetzte japanische/chinesische
Titel können direkt im jeweiligen Katalog gesucht werden.

`set-hints.json` enthält 176 Set-Datensätze und 175 lokale Symbolvorlagen aus dem
öffentlichen PokemonTCG-Datensatz (Quelle je Eintrag). Die Copyright-Jahreszahl,
Katalogdaten und ähnliche Setsymbole helfen beim Sortieren und Vergleichen, ersetzen
aber nicht die Prüfung von Nummer, Sprache und Druckvariante. Internationale
Erscheinungsdaten können von regionalen Druckjahren abweichen. Messwerte und Grenzen:
`tests/evidence-validation-2026-10-04.md`.

## Vollständige Linkprüfung (05.10.2026)

Die [aktuelle Fotoprüfung mit allen 57 Produktlinks und Kandidaten](tests/photo-validation-2026-10-05.md)
trennt automatische Treffer, manuell zugeordnete Karten und ungeklärte chinesische
Holo-Varianten. Sie ersetzt die fehlerhafte frühere Sollnummer 0702/09 beim zweiten
Captain Pikachu: Auch dort ist 0701/09 gedruckt.

Unklare Nummern erhalten zusätzliche vergrößerte Fußzeilen-Lesungen. Zusammengezogene
SV-/GG-/TG-/RC-Nummern werden normalisiert. Deutsche und englische Kartentexte helfen
bei bisher unklarer Sprache. Regionalformen werden für japanische Suchanfragen
sprachlich vereinheitlicht. Eine Nummer kann einen sehr starken Bildtreffer bei
flächigem Artwork stützen; widersprechende Nummern und reine Rahmenähnlichkeit
bleiben ausgeschlossen. Dafür werden keine kostenpflichtigen Dienste oder neuen
Konten benötigt.

Die Suchreihenfolge gilt allgemein, unabhängig von den Beispielkarten: zuerst
**Sammlernummer vor dem Schrägstrich + englischer Setname**, ersatzweise
**englischer Kartenname + Setname**. Der vollständige Nummernaufdruck bleibt für
den Identitätsabgleich erhalten. Gem-Pack-Drucknummern und DPBP-Speziesnummern
werden nicht wie normale Sammlernummern behandelt. Fehlt der englische Setname,
bleibt der bekannte Setname bzw. Setcode als Suchhilfe erhalten; eine Übersetzung
oder ausländische Setgleichheit wird nicht erfunden.

Google-Suchen heißen ausdrücklich „Nummer + Set bei Google suchen“ bzw.
„Name + Set bei Google suchen“. Die Anfrage enthält nur die Begriffe und
„Cardmarket“, ohne `site:`-Operator, Nenner oder zusätzlichen Sprachfilter.
„Auf Cardmarket öffnen“ bleibt ausschließlich eine direkte Produktseite.
Die beiden Suchwege werden getrennt angeboten, statt beide gleichzeitig in eine
übermäßig eingeschränkte Google-Anfrage zu packen.

### Manuelle Druck- und Holo-Auswahl

Bei hinterlegten Gem-Pack-Familien zeigt jede Karte eine eigene Versionsauswahl.
Aktuell enthält `variant-catalog.json` 33 einzeln recherchierte Cardmarket-Produkte
für Fuecoco, Crocalor und Captain Pikachu/Pikachu aus Gem Pack Vol. 1 sowie Meowth
aus Vol. 3. Das ist ein erweiterbarer Teilkatalog, keine vollständige Variantenabdeckung.
Acht gedruckte Varianten haben ergänzende Pikaqian-Bildreferenzen. Diese Bilder
sind ausdrücklich **nicht** bestimmten Cardmarket-V-Nummern zugeordnet.
Cardmarket blockiert hier den automatischen Abruf seiner Produktbilder; zum
Bildvergleich öffnet man deshalb die jeweilige Produktseite. V1/V2 usw. werden
nicht als Holo-Typ interpretiert. Erst die manuelle Auswahl setzt den Produktlink.
Sie gilt nur für die einzelne Karte, wird exportiert und bei geänderten Kartendaten
ungültig. Holo-Produkte werden nicht über den gemeinsamen Link-Speicher verteilt.
Die App benötigt dafür keinen Account oder kostenpflichtigen KI-Dienst. Eine
allgemeine KI-Webrecherche wie im Chat läuft in der App nicht automatisch mit.

### Setgröße, Copyright-Jahr und weitere Varianten

Die Zahl vor `/` wird als Sammlernummer gelesen, die Zahl dahinter als gedruckte
Setgröße (Secret Rares dürfen deshalb eine größere Sammlernummer haben).
Copyright-Jahre aus dem unteren Rand, auch separat erkannte Jahreszeilen, werden
mit Erscheinungsdaten verglichen. Bei bestätigter Nummer, passender Setgröße und
übereinstimmendem Namen oder Setsymbol kann ein einzelner Jahres-Treffer die
Zuordnung entscheiden. Fehlende Erscheinungsdaten, gleichjährige und zeitlich
nahe Ausgaben bleiben mehrdeutig. Copyright-Jahr und Erscheinungsjahr sind nicht
immer identisch; die Jahreszahl allein ist kein Identitätsnachweis.

Die App fragt bei bestätigter Sprache/Setnummer außerdem öffentliche TCGdex-
Variantenangaben ab (maximal vier gleichzeitige Anfragen, ohne Bild-Upload oder
Account). Sie kontrolliert Namen, Set, Sammlernummer und Setgröße der Antwort.
Katalogbilder sind als Artwork-Referenzen gekennzeichnet, nicht als Nachweis des
Folienmusters. Die Variantenwahl wird im Text- und Excel-Export festgehalten.
Nach einer neuen Variantenwahl muss der Produktlink separat bestätigt werden;
ein alter Link wird nicht stillschweigend weiterverwendet. Die Abdeckung hängt
von den regionalen Katalogdaten ab, insbesondere bei chinesischen Ausgaben.

Der GitHub-Linkhelfer übernimmt Suchtreffer nur bei passendem englischem Set
und passender Sammlernummer im Produktpfad. Mehrere passende Produkte und
separate V-Produktversionen bleiben zur manuellen Prüfung offen. Es werden keine
Produktpfade aus Kartennamen erfunden. Unbekannte direkte Links bleiben als
Google-Suche gekennzeichnet.

### Bildvergleich für Promos und ältere japanische Karten

`curated-print-references.json` ergänzt geprüfte Druckreferenzen mit vorberechneten
Merkmalen der vollständigen Karte. Damit funktioniert der lokale Bildvergleich
auch bei fehlender Sammlernummer und ohne erneuten Bilddownload. Enthalten sind
Chimchar aus Space-Time Creation, die beiden unterschiedlichen Magby-Ausgaben
aus Secret of the Lakes und Bastiodon the Defender (offizielle japanische Quellen)
sowie die deutsche Krokel-Promo SVP192 (Cardmex-Bild, Identität zusätzlich anhand
der offiziellen Pokémon-Datenbank geprüft). Die Quelldaten und Bildadressen
stehen jeweils am Eintrag. Private Testfotos werden dafür nicht gespeichert.

Mehrfach übereinstimmend gelesene Galerie-Präfixe wie SV, GG oder TG begrenzen die
Bildkandidaten auch dann, wenn einzelne Ziffern noch unsicher sind. Der vollständige
Bildvergleich muss anschließend weiterhin seine Qualitäts- und Abstandsschwellen
erfüllen. Es werden weder fehlende Ziffern ergänzt noch Grenzwerte abgesenkt.
