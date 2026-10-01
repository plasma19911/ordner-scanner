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
