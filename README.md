# Ordner-Scanner

Die GitHub-Pages-Version nutzt eine mitgelieferte Sammlung öffentlicher Referenzbilder. Der Workflow `Validate scanner and cache Pages references` baut diese Sammlung auf dem Reparatur-Branch; sie wird beim Zusammenführen mit veröffentlicht. Die Sammlung beginnt mit den Pokémon aus den bereitgestellten Beispielfotos. Weitere Suchnamen können in `scripts/cache-references.mjs` ergänzt und über den Workflow aktualisiert werden.

Weitere deutsche und englische Karten werden ergänzend im offenen TCGdex-Katalog gesucht. Für japanische Drucke außerhalb der mitgelieferten Sammlung ist die Live-Referenzsuche nur auf der Cloudflare-Version verfügbar. GitHub Pages kann diese API nicht ausführen.

Der Cardmarket-Button öffnet ausschließlich direkte Produktseiten: geprüfte Zuordnungen, gespeicherte Links oder Ergebnisse eines eingerichteten Suchhelfers. Unbekannte Produkte erhalten keine erfundene URL über einen externen Weiterleitungsdienst. Den passenden Google-Treffer kann man kopieren und unter „Korrigieren“ übernehmen; Links mit und ohne `www` sowie Google-Verpackungen werden erkannt.

Fotos werden im Browser verarbeitet und nicht in das Repository hochgeladen. Die Referenzsammlung enthält öffentlich verfügbare Katalogbilder, keine Fotos des Nutzers.

Prüfen: `npm test`, `npm run build`. Ein lokaler Server ist für die veröffentlichte GitHub-Pages-Version nicht erforderlich.
