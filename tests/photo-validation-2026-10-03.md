# Fotoprüfung vom 03.10.2026

Die acht vorhandenen Fotos liefern weiterhin 57 Einzelkartenausschnitte.
Vier erkannte Ecken ermöglichen eine perspektivisch entzerrte Vorschau;
manuelle oder nur rechteckig erkannte Rahmen behalten den bisherigen Zuschnitt.

Eine zusätzliche lokale PaddleOCR-Instanz wurde mit allen 57 Ausschnitten in
Chromium getestet, ohne OCR-Antworten zu simulieren. Alle 57 Aufrufe lieferten
Text. Dies ist keine Aussage, dass alle Karten, Nummern oder Varianten korrekt sind.
Unter anderem wurden 呆火鳄 (0304/09), 炙烫鳄, 船长皮卡丘 und 喵喵 gelesen.
Die neue offizielle Worker-Einbindung wurde separat mit 呆火鳄 und 0304/09 geprüft.
Der vollständige Kombinationstest mit Katalog- und Bildabgleich wurde beendet:
57 Ausschnitte, 55 mit Namen, 46 mit Nummer und 29 mit direktem Produktlink.
Diese Zahlen messen ausgefüllte Ergebnisse, nicht die Genauigkeit jeder Variante.
Gegenüber dem vorher dokumentierten Lauf (39 Namen, 36 Nummern, 22 Links) ist die
Abdeckung verbessert. Der neue Lauf verwendet auch mehr Referenzen und entzerrte
Bilder; die Verbesserung ist deshalb nicht allein der OCR zuzurechnen.

Anschließend wurden zwei konkrete Fehler nachgetestet: Eisenfalter erhält aus
der zusammengezogenen Fußzeile 028/182 und das Set Paradoxrift; die erste
Kapitän-Pikachu erhält 0701/09, bleibt wegen widersprechender Lesungen unsicher.
Die Erkennung prüft bei weiterhin fehlendem Namen zusätzlich die Gegenrichtung.
Der Gegenrichtungstest erkennt Schwalboss nun als Swellow 072/108 mit passendem
Roaring-Skies-Produktlink. Der verbliebene Magby-Ausschnitt bleibt ohne sicheren Namen.
Die abschließenden Änderungen wurden gezielt getestet, nicht nochmals als
vollständiger 57-Karten-Lauf.

Die öffentliche Referenzsammlung enthält nun 874 Einträge und 872 verfügbare
Bilder. Zusätzlich ergänzt wurden geprüfte direkte Produktseiten für Magby
(L3 012) und Ponita (Pt4 018). Sie waren im genannten Gesamtlauf noch nicht geladen:
- https://www.cardmarket.com/en/Pokemon/Products/Singles/Clash-at-the-Summit/Magby-L3012
- https://www.cardmarket.com/en/Pokemon/Products/Singles/Advent-of-Arceus/Ponyta-Lv8-Pt4018

Offen bleiben insbesondere einige ältere japanische Drucke, schlecht lesbare
Promo-Nummern und chinesische Holo-Varianten. Eine sichere Komplettzuordnung
aller 57 Karten zu Cardmarket wurde nicht erreicht.

Bekannte Grenze: Eine Kapitän-Pikachu-Lesung ergibt trotz hoher Modellkonfidenz
0701/09; der bisherige Fotoabgleich erwartete 0702/09. Modellkonfidenz ist kein
Beweis. Widersprechende sichere Lesungen sperren deshalb automatische Produktlinks.
Chinesische Gem-Pack-Varianten erfordern weiterhin die Bestätigung des Drucks
und der Holo-Variante. Die App verspricht keine vollständige Cardmarket-Abdeckung.

Regressionsprüfungen: Titel-/Fußbereich, unsichere Nummern ohne Namen,
Illustrationsmerkmale, Promo-/Teilsetnummern sowie bisherige Tests und Build.
Private Fotos und Ausschnitte werden nicht ins Repository übernommen.
