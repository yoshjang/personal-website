import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Eye,
  Layers3,
  List,
  Plus,
  Search,
  Shuffle,
  Trash2,
  Upload,
} from "lucide-react";
import { Backdrop, Spotlight, TopNav } from "@/components/atlas/Chrome";
import { SECTIONS } from "@/components/atlas/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accountingQuestions from "@/data/accounting-questions.json";
import capitalMarketsQuestions from "@/data/capital-markets-questions.json";
import industryQuestions from "@/data/industry-questions.json";
import lboQuestions from "@/data/lbo-questions.json";
import maQuestions from "@/data/ma-questions.json";
import valuationQuestions from "@/data/valuation-questions.json";

const SITE_URL = "https://joshuawang.app/technicals";
const STORAGE_KEY = "joshua-ib-technicals-v1";
const TOPICS = [
  "Accounting",
  "Valuation",
  "DCF",
  "M&A",
  "LBO",
  "Markets",
  "Industry",
  "Behavioral",
] as const;
type Topic = (typeof TOPICS)[number];
type StudyMode = "cards" | "browse" | "personalize";
type StudyFilter = "all" | "unseen" | "review" | "mastered";
type Status = "review" | "mastered";
type Question = {
  id: number | string;
  question: string;
  answer: string;
  topic?: Topic;
  personal?: boolean;
};
type PersonalQuestion = Required<Pick<Question, "id" | "question" | "answer" | "topic">>;
type SavedState = { statuses: Record<string, Status>; personal: PersonalQuestion[] };

const BASE_BANKS: Record<Exclude<Topic, "DCF" | "Markets" | "Behavioral">, Question[]> = {
  Accounting: accountingQuestions as Question[],
  Valuation: valuationQuestions as Question[],
  "M&A": maQuestions as Question[],
  LBO: lboQuestions as Question[],
  Industry: industryQuestions as Question[],
};
const DCF_TERMS =
  /\b(dcf|discounted cash flow|terminal value|wacc|unlevered free cash flow|free cash flow)\b/i;
const EMPTY: SavedState = { statuses: {}, personal: [] };
const keyFor = (topic: Topic, id: Question["id"], personal = false) =>
  `${personal ? "personal" : "bank"}:${topic}:${id}`;

function readSaved(): SavedState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!value || typeof value !== "object") return EMPTY;
    const candidate = value as Partial<SavedState>;
    return {
      statuses:
        candidate.statuses && typeof candidate.statuses === "object" ? candidate.statuses : {},
      personal: Array.isArray(candidate.personal)
        ? candidate.personal.filter(isPersonalQuestion)
        : [],
    };
  } catch {
    return EMPTY;
  }
}
function isPersonalQuestion(value: unknown): value is PersonalQuestion {
  if (!value || typeof value !== "object") return false;
  const q = value as Partial<PersonalQuestion>;
  return (
    (typeof q.id === "string" || typeof q.id === "number") &&
    typeof q.question === "string" &&
    q.question.trim().length > 0 &&
    typeof q.answer === "string" &&
    q.answer.trim().length > 0 &&
    typeof q.topic === "string" &&
    TOPICS.includes(q.topic as Topic)
  );
}

export const Route = createFileRoute("/technicals")({
  component: Technicals,
  head: () => ({
    meta: [
      { title: "Investment Banking Technicals | Joshua Wang" },
      {
        name: "description",
        content:
          "A personalized, interactive question bank for investment banking interview practice.",
      },
      { property: "og:title", content: "Investment Banking Technicals | Joshua Wang" },
      {
        property: "og:description",
        content:
          "Practice and track accounting, valuation, DCF, M&A, LBO, markets, industry, and behavioral questions.",
      },
      { property: "og:url", content: SITE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
});

function Technicals() {
  const [topic, setTopic] = useState<Topic>("Accounting");
  const [saved, setSaved] = useState<SavedState>(EMPTY);
  useEffect(() => setSaved(readSaved()), []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved]);

  const questions = useMemo(() => {
    let base: Question[];
    if (topic === "DCF")
      base = (valuationQuestions as Question[]).filter((q) =>
        DCF_TERMS.test(`${q.question} ${q.answer}`),
      );
    else if (topic === "Markets") base = capitalMarketsQuestions as Question[];
    else if (topic === "Behavioral") base = [];
    else base = BASE_BANKS[topic];
    return [
      ...base.map((q) => ({ ...q, topic })),
      ...saved.personal.filter((q) => q.topic === topic).map((q) => ({ ...q, personal: true })),
    ];
  }, [topic, saved.personal]);

  return (
    <div className="relative min-h-screen">
      <a
        href="#study-bank"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2"
      >
        Skip to question bank
      </a>
      <Backdrop />
      <Spotlight />
      <TopNav sections={SECTIONS} currentPage="technicals" />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        <section id="study-bank" aria-labelledby="technicals-title">
          <div className="flex flex-col gap-6 border-b border-border/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mono-label text-accent">Investment banking interview prep</p>
              <h1
                id="technicals-title"
                className="display mt-4 max-w-4xl text-5xl sm:text-6xl lg:text-7xl"
              >
                Technicals, <span className="text-gradient">one answer at a time.</span>
              </h1>
              <p className="body-copy mt-5">
                Build interview recall with focused decks, self-rating, a review queue, and your own
                questions.
              </p>
            </div>
            <div className="glass min-w-56 rounded-2xl p-4">
              <p className="mono-label">{topic} deck</p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                {questions.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">questions including your cards</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-border/70 bg-background/35 p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Private by default.</strong> Your custom questions
            and study progress stay in this browser. Export a backup before clearing browser data or
            switching devices.
          </div>
          <Tabs
            value={topic}
            onValueChange={(v) => {
              if (TOPICS.includes(v as Topic)) setTopic(v as Topic);
            }}
            className="mt-6"
          >
            <TabsList className="scrollbar-none h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-border bg-surface/80 p-1.5">
              {TOPICS.map((name) => (
                <TabsTrigger
                  key={name}
                  value={name}
                  className="min-h-11 shrink-0 rounded-xl px-4 data-[state=active]:bg-primary/25"
                >
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
            {TOPICS.map((name) => (
              <TabsContent key={name} value={name} className="mt-6">
                <StudyBank
                  topic={name}
                  questions={name === topic ? questions : []}
                  saved={saved}
                  setSaved={setSaved}
                />
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
    </div>
  );
}

function StudyBank({
  topic,
  questions,
  saved,
  setSaved,
}: {
  topic: Topic;
  questions: Question[];
  saved: SavedState;
  setSaved: React.Dispatch<React.SetStateAction<SavedState>>;
}) {
  const [mode, setMode] = useState<StudyMode>("cards");
  const [filter, setFilter] = useState<StudyFilter>("all");
  const [order, setOrder] = useState<string[]>([]);
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [query, setQuery] = useState("");
  const identified = useMemo(
    () => questions.map((q) => ({ ...q, studyKey: keyFor(topic, q.id, q.personal) })),
    [questions, topic],
  );
  const filtered = useMemo(
    () =>
      identified.filter(
        (q) =>
          filter === "all" ||
          (filter === "unseen"
            ? !saved.statuses[q.studyKey]
            : saved.statuses[q.studyKey] === (filter === "review" ? "review" : "mastered")),
      ),
    [identified, filter, saved.statuses],
  );
  useEffect(() => {
    setOrder(filtered.map((q) => q.studyKey));
    setPosition(0);
    setRevealed(false);
  }, [filtered]);
  const ordered = order
    .map((id) => filtered.find((q) => q.studyKey === id))
    .filter(Boolean) as (Question & { studyKey: string })[];
  const current = ordered[position];
  const counts = useMemo(
    () =>
      identified.reduce(
        (a, q) => {
          const s = saved.statuses[q.studyKey];
          if (s) a[s] += 1;
          else a.unseen += 1;
          return a;
        },
        { unseen: 0, review: 0, mastered: 0 },
      ),
    [identified, saved.statuses],
  );
  const move = useCallback(
    (d: -1 | 1) => {
      setPosition((p) => Math.min(Math.max(0, ordered.length - 1), Math.max(0, p + d)));
      setRevealed(false);
    },
    [ordered.length],
  );
  const rate = useCallback(
    (status: Status) => {
      if (!current) return;
      setSaved((s) => ({ ...s, statuses: { ...s.statuses, [current.studyKey]: status } }));
      if (position < ordered.length - 1) move(1);
    },
    [current, move, ordered.length, position, setSaved],
  );
  const shuffle = () => {
    const next = [...order];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const left = next[i];
      const right = next[j];
      if (left !== undefined && right !== undefined) {
        next[i] = right;
        next[j] = left;
      }
    }
    setOrder(next);
    setPosition(0);
    setRevealed(false);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || mode !== "cards") return;
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setRevealed((v) => !v);
      }
      if (revealed && e.key.toLowerCase() === "g") rate("mastered");
      if (revealed && e.key.toLowerCase() === "r") rate("review");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, move, revealed, current, rate]);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? identified.filter((x) => `${x.question} ${x.answer}`.toLowerCase().includes(q))
      : identified;
  }, [identified, query]);

  return (
    <>
      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap gap-2" aria-label="Study filter">
          {(["all", "unseen", "review", "mastered"] as StudyFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${filter === f ? "border-accent bg-primary/25" : "border-border text-muted-foreground"}`}
            >
              {f === "review" ? "Review again" : f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" ? ` (${counts[f]})` : ` (${identified.length})`}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-border bg-background/55 p-1">
            {(
              [
                { value: "cards", label: "Flashcards", Icon: Layers3 },
                { value: "browse", label: "Browse all", Icon: List },
                { value: "personalize", label: "My questions", Icon: Plus },
              ] as const
            ).map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold ${mode === value ? "bg-primary/25" : "text-muted-foreground"}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          {mode === "cards" && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={shuffle} className="rounded-full">
                <Shuffle className="h-4 w-4" />
                Shuffle
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  setSaved((s) => ({
                    ...s,
                    statuses: Object.fromEntries(
                      Object.entries(s.statuses).filter(([k]) => !k.includes(`:${topic}:`)),
                    ),
                  }))
                }
                className="rounded-full"
              >
                Reset deck
              </Button>
            </div>
          )}
        </div>
      </div>
      {mode === "cards" ? (
        current ? (
          <Flashcard
            question={current}
            position={position}
            total={ordered.length}
            revealed={revealed}
            status={saved.statuses[current.studyKey] ?? null}
            onReveal={() => setRevealed((v) => !v)}
            onPrevious={() => move(-1)}
            onNext={() => move(1)}
            onRate={rate}
          />
        ) : (
          <EmptyDeck filter={filter} onShowAll={() => setFilter("all")} />
        )
      ) : mode === "browse" ? (
        <BrowseBank
          topic={topic}
          query={query}
          onQueryChange={setQuery}
          matches={matches}
          statuses={saved.statuses}
        />
      ) : (
        <PersonalQuestions topic={topic} saved={saved} setSaved={setSaved} />
      )}
    </>
  );
}

function Flashcard({
  question,
  position,
  total,
  revealed,
  status,
  onReveal,
  onPrevious,
  onNext,
  onRate,
}: {
  question: Question & { studyKey: string };
  position: number;
  total: number;
  revealed: boolean;
  status: Status | null;
  onReveal: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRate: (s: Status) => void;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        <Progress
          value={((position + 1) / total) * 100}
          aria-label={`${position + 1} of ${total}`}
        />
        <p className="shrink-0 font-mono text-sm text-muted-foreground">
          {position + 1} / {total}
        </p>
      </div>
      <article className="glass lumen mt-5 flex min-h-[28rem] flex-col rounded-3xl p-6 sm:p-9">
        <div className="flex items-center justify-between gap-4">
          <p className="mono-label text-accent">
            {question.personal
              ? "Personal card"
              : `Question ${String(question.id).padStart(3, "0")}`}
          </p>
          <span className="rounded-full bg-secondary/70 px-3 py-1 text-xs text-muted-foreground">
            {status ? (status === "mastered" ? "Mastered" : "Review again") : "Unseen"}
          </span>
        </div>
        <h2 className="display-medium mt-8 max-w-4xl text-3xl leading-tight sm:text-4xl">
          {question.question}
        </h2>
        <div className="mt-8 border-t border-border/70 pt-7" aria-live="polite">
          {revealed ? (
            <AnswerText answer={question.answer} />
          ) : (
            <button
              type="button"
              onClick={onReveal}
              className="flex min-h-40 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-background/25 px-6 text-center hover:border-accent/60"
            >
              <span>
                <Eye className="mx-auto h-6 w-6 text-accent" />
                <span className="mt-3 block font-semibold">Show answer</span>
                <span className="mt-1 block text-sm text-muted-foreground">Space or Enter</span>
              </span>
            </button>
          )}
        </div>
        {revealed && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              onClick={() => onRate("review")}
              className="min-h-12 rounded-full"
            >
              Review again <span className="text-xs opacity-60">R</span>
            </Button>
            <Button onClick={() => onRate("mastered")} className="min-h-12 rounded-full">
              <Check className="h-4 w-4" />
              Got it <span className="text-xs opacity-60">G</span>
            </Button>
          </div>
        )}
      </article>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={position === 0}
          className="min-h-12 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={position === total - 1}
          className="min-h-12 rounded-full"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function EmptyDeck({ filter, onShowAll }: { filter: StudyFilter; onShowAll: () => void }) {
  return (
    <div className="glass mt-6 rounded-2xl p-10 text-center">
      <p className="font-semibold">
        {filter === "all" ? "No questions in this deck yet" : "Nothing matches this study filter"}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Add a personal card or switch filters to keep practicing.
      </p>
      {filter !== "all" && (
        <Button onClick={onShowAll} className="mt-5 rounded-full">
          Show all questions
        </Button>
      )}
    </div>
  );
}

function BrowseBank({
  topic,
  query,
  onQueryChange,
  matches,
  statuses,
}: {
  topic: Topic;
  query: string;
  onQueryChange: (v: string) => void;
  matches: (Question & { studyKey: string })[];
  statuses: Record<string, Status>;
}) {
  return (
    <div className="mt-6">
      <div className="glass rounded-2xl p-4 sm:p-5">
        <label htmlFor={`search-${topic}`} className="mono-label text-accent">
          Search this deck
        </label>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={`search-${topic}`}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search questions and answers"
            className="h-12 rounded-xl bg-background/45 pl-10"
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{matches.length} results</p>
      </div>
      {matches.length ? (
        <Accordion type="multiple" className="glass mt-5 rounded-2xl px-5 sm:px-7">
          {matches.map((item) => (
            <AccordionItem key={item.studyKey} value={item.studyKey}>
              <AccordionTrigger className="gap-4 py-5 text-base hover:no-underline">
                <span className="flex w-full items-start justify-between gap-3 text-left">
                  <span>{item.question}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {statuses[item.studyKey] || "unseen"}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <AnswerText answer={item.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <EmptyDeck filter="all" onShowAll={() => undefined} />
      )}
    </div>
  );
}

function PersonalQuestions({
  topic,
  saved,
  setSaved,
}: {
  topic: Topic;
  saved: SavedState;
  setSaved: React.Dispatch<React.SetStateAction<SavedState>>;
}) {
  const [editing, setEditing] = useState<string | number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cardTopic, setCardTopic] = useState<Topic>(topic);
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => setCardTopic(topic), [topic]);
  const clear = () => {
    setEditing(null);
    setQuestion("");
    setAnswer("");
  };
  const saveCard = () => {
    if (!question.trim() || !answer.trim()) return;
    const id = editing ?? `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const card: PersonalQuestion = {
      id,
      question: question.trim(),
      answer: answer.trim(),
      topic: cardTopic,
    };
    setSaved((s) => ({ ...s, personal: [...s.personal.filter((q) => q.id !== id), card] }));
    clear();
  };
  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...saved }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ib-technicals-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importData = async (file?: File) => {
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object") throw new Error();
      const data = parsed as Partial<SavedState>;
      if (
        !Array.isArray(data.personal) ||
        !data.personal.every(isPersonalQuestion) ||
        !data.statuses ||
        typeof data.statuses !== "object" ||
        !Object.values(data.statuses).every((v) => v === "review" || v === "mastered")
      )
        throw new Error();
      setSaved((s) =>
        importMode === "replace"
          ? { personal: data.personal!, statuses: data.statuses! }
          : {
              personal: [
                ...s.personal.filter((old) => !data.personal!.some((q) => q.id === old.id)),
                ...data.personal!,
              ],
              statuses: { ...s.statuses, ...data.statuses },
            },
      );
    } catch {
      window.alert("That file is not a valid IB Technicals backup. Nothing was changed.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <section className="glass rounded-2xl p-5">
        <p className="mono-label text-accent">{editing ? "Edit card" : "Add a question"}</p>
        <label className="mt-4 block text-sm font-semibold">
          Topic
          <select
            value={cardTopic}
            onChange={(e) => setCardTopic(e.target.value as Topic)}
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3"
          >
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Question
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-2 min-h-24 w-full rounded-xl border border-border bg-background p-3"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Answer
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-2 min-h-32 w-full rounded-xl border border-border bg-background p-3"
          />
        </label>
        <div className="mt-4 flex gap-2">
          <Button
            onClick={saveCard}
            disabled={!question.trim() || !answer.trim()}
            className="rounded-full"
          >
            {editing ? "Save changes" : "Add to study"}
          </Button>
          {editing && (
            <Button variant="ghost" onClick={clear} className="rounded-full">
              Cancel
            </Button>
          )}
        </div>
      </section>
      <section className="glass rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mono-label text-accent">Your question bank</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {saved.personal.length} personal cards across all topics
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData} className="rounded-full">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <select
              value={importMode}
              onChange={(e) => setImportMode(e.target.value as "merge" | "replace")}
              aria-label="Import behavior"
              className="rounded-full border border-border bg-background px-3 text-sm"
            >
              <option value="merge">Merge import</option>
              <option value="replace">Replace with import</option>
            </select>
            <Button
              variant="outline"
              onClick={() => fileRef.current?.click()}
              className="rounded-full"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => void importData(e.target.files?.[0])}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Merge keeps existing cards unless an imported card has the same ID. Replace is explicit
          and replaces all personal cards and progress.
        </p>
        <div className="mt-5 space-y-3">
          {saved.personal.length ? (
            saved.personal.map((q) => (
              <article key={q.id} className="rounded-xl border border-border bg-background/35 p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {q.topic}
                    </span>
                    <p className="mt-1 font-semibold">{q.question}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditing(q.id);
                        setQuestion(q.question);
                        setAnswer(q.answer);
                        setCardTopic(q.topic);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${q.question}`}
                      onClick={() =>
                        setSaved((s) => ({
                          ...s,
                          personal: s.personal.filter((x) => x.id !== q.id),
                          statuses: Object.fromEntries(
                            Object.entries(s.statuses).filter(
                              ([k]) => k !== keyFor(q.topic, q.id, true),
                            ),
                          ),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No personal questions yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
function AnswerText({ answer }: { answer: string }) {
  return (
    <p className="max-w-none whitespace-pre-line text-base leading-7 text-foreground/90">
      {answer}
    </p>
  );
        }
