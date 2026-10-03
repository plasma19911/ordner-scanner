# Account-free reference supplement — 2026-10-03

No registration, key, subscription or paid endpoint is required. TCGdex searches
English, German, Japanese and both Chinese endpoints using known name aliases.
Catalogue coverage still varies; unavailable sources do not discard other results.

Ten public reference records are listed with provenance in free-artwork-sources.json:
eight Gem Pack 1/3 records from PikaQian public pages and two Magby records from
pokemon-card.com. No authenticated PikaQian API is used. The shipped supplement
contains computed ORB descriptors/thumbnail signatures, not copies of card images.
Preview images load from their original public URLs. Browser matching uses bundled
features, so cross-origin canvas restrictions do not prevent comparison. Private
validation photographs are not included in the repository or uploaded to providers.

Manual browser validation used the existing eleven single-card crops. Comparing
against the bundled features loaded no reference images at runtime. Inlier counts
for the leading artwork were: Fuecoco 53, Crocalor 396, Magby 277 and 313,
Captain Pikachu 502/642/402, Meowth 465/553/529/263. This is an artwork comparison,
NOT eleven confirmed exact printings. Foil variants share artwork: e.g. 0704/09
can rank a 0702/09 reference higher. Therefore no set, number, language or Cardmarket
product identity is copied from artwork confirmation.

The official Magby references also correct an earlier assumption: crop 5 matches
card 2019 (Secret of the Lakes); crop 7 matches card 2124 (Bastiodon the Defender).
Small reference scans are normalized to 1000px height before feature extraction.
Names unreadable by OCR can search the ten bundled references without a title.
This supplement is deliberately small, not a complete Chinese/Japanese catalogue.

Verification: npm test, static build, local Chromium/OpenCV photo comparisons.
