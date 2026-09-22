import { PenLine } from "lucide-react";
import notesData from "@/data/market-notes.json";

type Note = { date: string; title: string; body: string };

const notes = (notesData as { notes: Note[] }).notes;

function formatNoteDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
}

export function MarketNotes() {
  if (!notes.length) return null;
  const [latest, ...archive] = notes;

  return (
    <section aria-labelledby="market-notes-title" className="mt-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono-label text-accent">Original market notes</p>
          <h2 id="market-notes-title" className="display-medium mt-3 text-4xl sm:text-5xl">
            Joshua&rsquo;s notes
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          Short reads on the tape, written when there is something worth saying - not on a schedule.
          Joshua&rsquo;s own analysis, not investment advice.
        </p>
      </div>

      <article className="glass lumen mt-8 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-lime/40 bg-lime/10 text-lime">
            <PenLine aria-hidden="true" className="h-[1.15rem] w-[1.15rem]" />
          </span>
          <div>
            <p className="mono-label text-[0.65rem]">{formatNoteDate(latest!.date)}</p>
            <h3 className="mt-1 text-xl font-semibold text-foreground">{latest!.title}</h3>
          </div>
        </div>
        <p className="mt-5 max-w-3xl leading-7 text-foreground/90">{latest!.body}</p>
      </article>

      {archive.length ? (
        <div className="mt-4">
          <p className="mono-label text-[0.65rem]">Archive</p>
          <div className="mt-3 grid gap-3">
            {archive.map((note) => (
              <details key={note.date} className="glass group rounded-2xl px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-medium text-foreground group-open:text-accent">
                    {note.title}
                  </span>
                  <span className="mono-label shrink-0 text-[0.65rem]">
                    {formatNoteDate(note.date)}
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-[0.95rem] leading-7 text-foreground/90">
                  {note.body}
                </p>
              </details>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
