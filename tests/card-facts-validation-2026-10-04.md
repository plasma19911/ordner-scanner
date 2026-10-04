# Structured evidence and detail-photo validation — 2026-10-04

- `npm test` and `npm run build` pass.
- Real private binder crop, Swellow 072/108: browser OCR reads Peck / Wing Attack and damage 30 / 50; Roaring Skies and the existing verified Swellow-ROS72 link remain correct. HP and artist were not legible with sufficient confidence; no values were invented.
- In the same browser session, injecting HP 40 blocks the link and marks a catalogue conflict; HP 90 restores the verified link. This is a synthetic guard test, not a claim that HP was read from the photo.
- Unit tests cover low-confidence HP, body-text HP exclusion, competing HP readings, attack/artist scoring, absent catalogue fields, wrong-card detail photos and stale asynchronous results.
- Search-engine results remain unverified candidates and are not automatically saved to link memory. Known direct products and user-confirmed links remain available, subject to conflict checks.
- Detail photos are processed locally and can be rotated. Conflicting reliable numbers/codes require comparison before replacement.
- Limitless and PkmnCards are optional comparison links, not new automatic recognition APIs. Attacks only rank candidates; translated or missing attack text is not treated as a mismatch. Regional catalogue coverage still limits recognition; identical artwork does not establish a foreign print or foil variant.

## Public catalogue audit

TCGdex `https://api.tcgdex.net/v2/en/cards/xy6-72` supplied thirdParty.cardmarket 282739 for Swellow with Peck / Wing Attack. In Cardmarket's public `https://downloads.s3.cardmarket.com/productCatalog/productList/products_singles_6.json`, product 282739 was named “Swellow [Clutch | Aerial Ace]”. Consequently third-party numeric IDs are not adopted as verified Cardmarket links. The public catalogue was used for this audit, not bundled into the app or advertised as a complete automatic mapping.

The browser photo test used cached public responses served through the test harness; it does not prove live cross-origin availability of every provider. Private photos are not committed.
