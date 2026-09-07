import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, Layers3, List, Search, Shuffle } from "lucide-react";
import { Backdrop, Spotlight } from "@/components/atlas/Chrome";
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
import lboQuestions from "@/data/lbo-questions.json";
import maQuestions from "@/data/ma-questions.json";
import valuationQuestions from "@/data/valuation-questions.json";

const SITE_URL = "https://joshuawang.app/technicals";

const TOPICS = ["Accounting", "Valuation", "M&A", "LBO", "Capital Markets", "Industry"] as const;

type StudyMode = "cards" | "browse";
type Question = { id: number; question: string; answer: string };
type Topic = (typeof TOPICS)[number];
type AvailableTopic = "Accounting" | "Valuation" | "M&A" | "LBO" | "Capital Markets";

const QUESTION_BANKS: Record<AvailableTopic, Question[]> = {
  Accounting: accountingQuestions as Question[],
  Valuation: valuationQuestions as Question[],
  "M&A": maQuestions as Question[],
  LBO: lboQuestions as Question[],
  "Capital Markets": capitalMarketsQuestions as Question[],
};

function isAvailableTopic(topic: Topic): topic is AvailableTopic {
  return topic in QUESTION_BANKS;
}

export const Route = createFileRoute("/technicals")({
  component: Technicals,
  head: () => ({
    meta: [
      { title: "Investment Banking Technicals | Joshua Wang" },
      {
        name: "description",
        content:
          "An interactive question bank for investment banking technical interview practice.",
      },
      { property: "og:title", content: "Investment Banking Technicals | Joshua Wang" },
      {
        property: "og:description",
        content:
          "Flashcard practice for accounting, valuation, M&A, LBOs, capital markets, and industry questions.",
      },
      { property: "og:url", content: SITE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
});

function Technicals() {
  const [topic, setTopic] = useState<AvailableTopic>("Accounting");
  const questions = QUESTION_BANKS[topic];

  return (
    <div className="relative min-h-screen">
      <a
        href="#study-bank"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-lime-foreground"
      >
        Skip to question bank
      </a>
      <Backdrop />
      <Spotlight />
      <TechnicalsHeader />

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
                Practice complete accounting, valuation, M&A, LBO, and capital markets banks in
                focused flashcards, or search and browse every answer.
              </p>
            </div>
            <div className="glass min-w-56 rounded-2xl p-4">
              <p className="mono-label">{topic} bank</p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                {questions.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                complete question and answer pairs
              </p>
            </div>
          </div>

          <Tabs
            value={topic}
            onValueChange={(value) => {
              if (
                value === "Accounting" ||
                value === "Valuation" ||
                value === "M&A" ||
                value === "LBO" ||
                value === "Capital Markets"
              ) {
                setTopic(value);
              }
            }}
            className="mt-8"
          >
            <TabsList className="scrollbar-none h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-border bg-surface/80 p-1.5">
              {TOPICS.map((topicName) => {
                const available = isAvailableTopic(topicName);
                return (
                  <TabsTrigger
                    key={topicName}
                    value={topicName}
                    disabled={!available}
                    className="min-h-11 shrink-0 rounded-xl px-4 data-[state=active]:bg-primary/25 data-[state=active]:text-foreground"
                  >
                    {topicName}
                    {!available ? (
                      <span className="ml-2 text-[0.65rem] uppercase tracking-wider">Soon</span>
                    ) : null}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {(Object.keys(QUESTION_BANKS) as AvailableTopic[]).map((topicName) => (
              <TabsContent key={topicName} value={topicName} className="mt-6">
                <StudyBank topic={topicName} questions={QUESTION_BANKS[topicName]} />
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
    </div>
  );
}

function StudyBank({ topic, questions }: { topic: AvailableTopic; questions: Question[] }) {
  const [mode, setMode] = useState<StudyMode>("cards");
  const [order, setOrder] = useState(() => questions.map((_, index) => index));
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [query, setQuery] = useState("");

  const current = questions[order[position]];
  const progress = ((position + 1) / questions.length) * 100;
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return questions;
    return questions.filter(
      (item) =>
        item.question.toLowerCase().includes(normalized) ||
        item.answer.toLowerCase().includes(normalized),
    );
  }, [query, questions]);

  const move = useCallback(
    (direction: -1 | 1) => {
      setPosition((currentPosition) =>
        Math.min(questions.length - 1, Math.max(0, currentPosition + direction)),
      );
      setRevealed(false);
    },
    [questions.length],
  );

  const shuffle = () => {
    const next = questions.map((_, index) => index);
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrder(next);
    setPosition(0);
    setRevealed(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (mode !== "cards") return;
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setRevealed((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, move]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-border bg-background/55 p-1">
          <button
            type="button"
            onClick={() => setMode("cards")}
            aria-pressed={mode === "cards"}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${mode === "cards" ? "bg-primary/25 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Layers3 aria-hidden="true" className="h-4 w-4" />
            Flashcards
          </button>
          <button
            type="button"
            onClick={() => setMode("browse")}
            aria-pressed={mode === "browse"}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${mode === "browse" ? "bg-primary/25 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List aria-hidden="true" className="h-4 w-4" />
            Browse all
          </button>
        </div>
        {mode === "cards" ? (
          <Button variant="outline" onClick={shuffle} className="min-h-11 rounded-full px-4">
            <Shuffle aria-hidden="true" className="h-4 w-4" />
            Shuffle deck
          </Button>
        ) : null}
      </div>

      {mode === "cards" ? (
        <Flashcard
          question={current}
          position={position}
          total={questions.length}
          revealed={revealed}
          progress={progress}
          onReveal={() => setRevealed((value) => !value)}
          onPrevious={() => move(-1)}
          onNext={() => move(1)}
        />
      ) : (
        <BrowseBank topic={topic} query={query} onQueryChange={setQuery} matches={matches} />
      )}
    </>
  );
}

function Flashcard({
  question,
  position,
  total,
  revealed,
  progress,
  onReveal,
  onPrevious,
  onNext,
}: {
  question: Question;
  position: number;
  total: number;
  revealed: boolean;
  progress: number;
  onReveal: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        <Progress value={progress} aria-label={`${position + 1} of ${total} questions`} />
        <p className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
          {position + 1} / {total}
        </p>
      </div>

      <article className="glass lumen mt-5 flex min-h-[28rem] flex-col rounded-3xl p-6 sm:p-9">
        <div className="flex items-center justify-between gap-4">
          <p className="mono-label text-accent">Question {String(question.id).padStart(3, "0")}</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-1 text-xs text-muted-foreground">
            {revealed ? (
              <Check aria-hidden="true" className="h-3.5 w-3.5 text-lime" />
            ) : (
              <Eye aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            {revealed ? "Answer shown" : "Answer hidden"}
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
              className="group flex min-h-40 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-background/25 px-6 text-center transition-colors hover:border-accent/60 hover:bg-secondary/35"
            >
              <span>
                <Eye aria-hidden="true" className="mx-auto h-6 w-6 text-accent" />
                <span className="mt-3 block font-semibold">Show answer</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Press Space or Enter
                </span>
              </span>
            </button>
          )}
        </div>

        {revealed ? (
          <Button
            onClick={onReveal}
            variant="ghost"
            className="mt-6 self-start rounded-full text-muted-foreground"
          >
            Hide answer
          </Button>
        ) : null}
      </article>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={position === 0}
          className="min-h-12 rounded-full"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={position === total - 1}
          className="min-h-12 rounded-full"
        >
          Next
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function BrowseBank({
  topic,
  query,
  onQueryChange,
  matches,
}: {
  topic: AvailableTopic;
  query: string;
  onQueryChange: (value: string) => void;
  matches: Question[];
}) {
  return (
    <div className="mt-6">
      <div className="glass rounded-2xl p-4 sm:p-5">
        <label htmlFor="question-search" className="mono-label text-accent">
          Search the full bank
        </label>
        <div className="relative mt-3">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="question-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search questions and answers"
            className="h-12 rounded-xl bg-background/45 pl-10 text-base"
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {matches.length} {matches.length === 1 ? "result" : "results"}
        </p>
      </div>

      {matches.length ? (
        <Accordion type="multiple" className="glass mt-5 rounded-2xl px-5 sm:px-7">
          {matches.map((item) => (
            <AccordionItem key={item.id} value={String(item.id)} className="border-border/70">
              <AccordionTrigger className="gap-4 py-5 text-base hover:no-underline sm:text-lg">
                <span className="flex items-start gap-3 text-left">
                  <span className="mt-0.5 font-mono text-xs text-accent">
                    {String(item.id).padStart(3, "0")}
                  </span>
                  <span>{item.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pl-0 sm:pl-10">
                <AnswerText answer={item.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="glass mt-5 rounded-2xl p-8 text-center">
          <p className="font-semibold">No matching questions</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader {topic.toLowerCase()} term.
          </p>
        </div>
      )}
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

function TechnicalsHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Primary"
        className="glass-strong mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full p-1.5 pl-2 sm:pl-3"
      >
        <Link to="/" className="group flex items-center gap-2.5 rounded-full py-1 pr-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-[0.7rem] font-bold text-primary-foreground">
            JW
          </span>
          <span className="hidden font-display text-[0.95rem] font-semibold sm:inline">
            Joshua Wang
          </span>
        </Link>
        <div
          className="scrollbar-none flex items-center overflow-x-auto rounded-full bg-background/50 p-1"
          aria-label="Site views"
        >
          <Link
            to="/"
            className="min-h-9 shrink-0 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-4"
          >
            About
          </Link>
          <Link
            to="/markets"
            className="min-h-9 shrink-0 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-4"
          >
            Markets
          </Link>
          <Link
            to="/technicals"
            aria-current="page"
            className="min-h-9 shrink-0 rounded-full bg-primary/25 px-3 py-2 text-sm font-semibold text-foreground shadow-[0_0_18px_-8px] shadow-accent sm:px-4"
          >
            Technicals
          </Link>
        </div>
      </nav>
    </header>
  );
}
