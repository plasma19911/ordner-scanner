# Fotoprüfung vom 03.10.2026

Die acht vorhandenen Fotos liefern weiterhin 57 Einzelkartenausschnitte.
Vier erkannte Ecken ermöglichen eine perspektivisch entzerrte Vorschau;
manuelle oder nur rechteckig erkannte Rahmen behalten den bisherigen Zuschnitt.

Eine zusätzliche lokale PaddleOCR-Instanz wurde mit allen 57 Ausschnitten in
Chromium getestet, ohne OCR-Antworten zu simulieren. Alle 57 Aufrufe lieferten
Text. Dies ist keine Aussage, dass alle Karten, Nummern oder Varianten korrekt sind.
Unter anderem wurden 呆火鳄 (0304/09), 炙烫鳄, 船长皮卡丘 und 喵喵 gelesen.
Die neue offizielle Worker-Einbindung wurde separat mit 呆火鳄 und 0304/09 geprüft.
Die vollständige Kombination mit Katalog- und Bildabgleich wird zusätzlich getestet.

Bekannte Grenze: Eine Kapitän-Pikachu-Lesung ergibt trotz hoher Modellkonfidenz
0701/09; der bisherige Fotoabgleich erwartete 0702/09. Modellkonfidenz ist kein
Beweis. Widersprechende sichere Lesungen sperren deshalb automatische Produktlinks.
Chinesische Gem-Pack-Varianten erfordern weiterhin die Bestätigung des Drucks
und der Holo-Variante. Die App verspricht keine vollständige Cardmarket-Abdeckung.

Regressionsprüfungen: Titel-/Fußbereich, unsichere Nummern ohne Namen,
Illustrationsmerkmale, Promo-/Teilsetnummern sowie bisherige Tests und Build.
Private Fotos und Ausschnitte werden nicht ins Repository übernommen.
