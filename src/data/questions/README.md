# Interview question bank

Everything on the `/technicals` page is read from the JSON files in this folder.
Edit them directly on GitHub (open a file, click the pencil icon, commit). The site
rebuilds on push. Each deck on the page also has an "Edit this deck on GitHub" link
that opens the right file.

## Layout

```
general/   one file per topic, shown under "General questions"
banks/     one file per bank, shown under "Asked by bank"
```

- **General questions** are questions from the prep guides, plus any question that was
  reported at two or more banks. Those carry an `askedAt` list instead of living in a
  bank file, so each question appears only once on the site.
- **Bank questions** were reported at exactly one bank.

## General file format (`general/<topic>.json`)

```json
{
  "topic": "Accounting",
  "questions": [
    {
      "id": 4,
      "question": "Walk me through the three financial statements.",
      "answer": "Model answer. Use \n for line breaks.",
      "askedAt": ["Morgan Stanley", "Cain Brothers"],
      "source": ["The 500"]
    }
  ]
}
```

`topic` must be one of: Accounting, Valuation, DCF, M&A, LBO, Markets, Industry,
Corporate Finance, Brain Teasers, Excel, Behavioral. A new topic also needs adding to
`TOPICS` in `src/routes/technicals.tsx`.

## Bank file format (`banks/<bank>.json`)

```json
{
  "bank": "Evercore",
  "tier": "Elite Boutique",
  "questions": [
    {
      "id": "evercore-001",
      "topic": "Behavioral",
      "question": "Tell me about something you're proud of.",
      "answer": "",
      "group": "M&A",
      "source": ["IB Questions v12"]
    }
  ]
}
```

`tier` is one of Bulge Bracket, Elite Boutique, Middle Market or Private Equity, which
sets the order of the bank tabs. A new bank file is picked up automatically: no code
change needed.

## Rules for editing

- **Keep `id`s stable.** Study progress in visitors' browsers is saved by topic and
  `id`. Changing or reusing an id resets or mixes up that progress.
- **New ids:** in a general file, use the next unused number (`b-0NN` for Behavioral).
  In a bank file, use the next `<bank>-NNN`.
- **Before adding a question, search the folder for it.** If it already exists, add
  the bank to its `askedAt` instead. If it lives in a bank file and another bank asks it
  too, move it to the matching general file and give it an `askedAt` with both banks.
- `answer` can be `""`. The page then shows "No model answer yet".
- `group` (team, e.g. "RX") and `source` (where the question came from) are optional.
