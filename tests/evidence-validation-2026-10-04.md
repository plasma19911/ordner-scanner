# Recognition evidence and automatic single-card processing

## Changes
- Safe, detected, non-overlapping individual rectangles can bypass manual review
  (checkbox enabled by default). Missing, inferred, clipped or ambiguous rectangles
  still open the existing editor. No whole binder image becomes a single card.
- Each crop is independently normalized to portrait, then both 0/180 orientations
  are compared using exact title recognition and positioned footer evidence.
  The selected neural result is reused later. Page-wide orientation does not decide.
- Number votes compare normalized numbers (007/083 = 7/83). Close competing votes
  remain uncertain. Existing independent OCR conflict checks remain in force.
- Exact multilingual title aliases accept multiword trainers/items and HP noise.
  Untranslated native Japanese/Chinese titles can query their regional catalogues;
  they do not acquire a made-up English translation or printing identity.
- Copyright years are read from the footer, including a separate lowest-edge pass.
  Trademark years are preserved; the latest plausible year only ranks candidates.
  Neither year nor a tiny symbol alone confirms a Cardmarket product.
- Local metadata covers 176 international sets; 175 monochrome symbol templates
  avoid remote CORS and missing-image problems. Regional Japanese/Chinese IDs never
  inherit English metadata just because the IDs happen to be equal.

## Sources (no account/API key)
- https://github.com/PokemonTCG/pokemon-tcg-data/blob/master/sets/en.json
- Symbol provenance is recorded per set in set-hints.json (images.pokemontcg.io).
- https://tcgdex.dev/reference/set (releaseDate, symbol, cardCount)
- https://tcgdex.dev/assets (symbols use .webp/.png, not /high.webp)

The local set metadata uses international release dates. Regional delays/reprints
can differ. These dates are hints, not a table of printed copyright lines.
Template matching searches the footer and the older right-under-artwork position,
requires a strong score and margin, and is advisory only. Missing symbols are skipped.

## Validation
- npm test, including years/ranges, false numeric years, conflicting number votes,
  multilingual trainer titles, regional isolation, all 175 template dimensions and
  automatic-crop gates.
- Original 8 binder photos: 57 proposed individual crops (8/8/8/6/3/7/8/9).
  Three photos pass automatic gates; five retain review due to inferred/boundary
  geometry. This is not a claim that every crop is perfect without inspection.
- Actual Vulnona photo at 0/90/180/270 degrees: correct upright choice in all four
  cases; title/footer orientation scores 8 vs 0 (reversed when upside down).
- Actual Vulnona 019/124 and Swellow 072/108 still resolve to their existing correct
  Cardmarket product URLs. Magby with unreadable OCR can infer its English name from
  strong local artwork matches; its exact printing/language remain unconfirmed.
- Synthetic symbol placement: xy6 recognized against competing bw5 template.
  Real Swellow symbol remained unresolved rather than producing a false match.
- Tiny copyright dates were not legible in the tested Magby/Swellow photos; no year
  was invented. Year parsing and candidate ranking passed deterministic tests.

No private photographs are published in this repository. No complete recognition
coverage, universal symbol recognition or guaranteed foil discrimination is claimed.
