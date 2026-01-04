"use client";

import { useMemo, useState } from "react";

type Message = {
  id: string;
  role: "ai" | "user";
  content: string;
};

type Mode = "question" | "guess";

const SCENARIO =
  "ある男がレストランでウミガメのスープを注文した。ひとくち飲んだ男は店を出て、のちに死んだ。なぜ？";

const SOLUTION =
  "彼は昔、遭難して命を取り留めた際に「ウミガメのスープ」を食べたと信じていた。レストランで飲んだ本物の味と違うと気づき、自分が当時人肉を食べさせられたと悟り絶望して死んだ。";

const requiredKeywords = {
  shipwreck: ["遭難", "漂流", "海難", "船", "無人島"],
  cannibalism: ["人肉", "人間を食", "カニバリ", "人を食"],
  realizeDifferent: ["味が違", "違うと気づ", "別物", "本物", "違い"],
};

const negativeKeywords = ["毒", "病気", "殺人", "事故", "借金", "失恋"];

function normalize(input: string) {
  return input.replace(/\s+/g, "").toLowerCase();
}

function containsAny(text: string, keywords: string[]) {
  return keywords.some((word) => text.includes(word));
}

function answerQuestion(question: string) {
  const q = normalize(question);

  if (containsAny(q, requiredKeywords.shipwreck)) {
    return "はい。";
  }

  if (containsAny(q, requiredKeywords.cannibalism)) {
    return "はい。";
  }

  if (q.includes("スープ") && containsAny(q, requiredKeywords.realizeDifferent)) {
    return "はい。";
  }

  if (containsAny(q, negativeKeywords)) {
    return "いいえ。";
  }

  if (q.includes("理由") || q.includes("なぜ") || q.includes("死因")) {
    return "関係ない。";
  }

  return "わからない。";
}

function judgeGuess(guess: string) {
  const g = normalize(guess);
  const hasShipwreck = containsAny(g, requiredKeywords.shipwreck);
  const hasCannibalism = containsAny(g, requiredKeywords.cannibalism);
  const hasRealizeDifferent =
    g.includes("スープ") && containsAny(g, requiredKeywords.realizeDifferent);

  return hasShipwreck && hasCannibalism && hasRealizeDifferent;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("question");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-intro",
      role: "ai",
      content: `出題: ${SCENARIO} 質問は「はい / いいえ / 関係ない / わからない」で答えます。`,
    },
  ]);

  const placeholder = useMemo(
    () =>
      mode === "question"
        ? "質問を入力（例: 男は遭難したことがある？）"
        : "解答を入力（例: 遭難時に人肉を食べたと気づいた）",
    [mode],
  );

  function pushMessage(role: Message["role"], content: string) {
    setMessages((prev) => [
      ...prev,
      { id: `${role}-${Date.now()}-${prev.length}`, role, content },
    ]);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    pushMessage("user", trimmed);

    if (mode === "question") {
      const reply = answerQuestion(trimmed);
      pushMessage("ai", reply);
      setInput("");
      return;
    }

    const correct = judgeGuess(trimmed);
    if (correct) {
      pushMessage("ai", `正解！ ${SOLUTION}`);
    } else {
      pushMessage("ai", "不正解。もう少し。");
    }
    setInput("");
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f6f3ee] text-zinc-900">
      <main className="mx-auto flex h-screen w-full max-w-3xl flex-col px-4 pb-6">
        <header className="sticky top-0 z-10 -mx-4 bg-[#f6f3ee]/95 px-4 pt-6 backdrop-blur">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
              AI
            </div>
            <div>
              <p className="text-xs text-zinc-500">出題者</p>
              <h1 className="text-lg font-semibold tracking-tight">ウミガメのスープ</h1>
            </div>
          </div>
          <section className="rounded-t-2xl rounded-b-none border border-zinc-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-zinc-500">出題</p>
            <p className="mt-1 text-base leading-6">{SCENARIO}</p>
          </section>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto rounded-none border border-zinc-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "bg-[#c7f1d8] text-zinc-900"
                      : "bg-[#f1efe9] text-zinc-900"
                  }`}
                >
                  <p className="text-[11px] text-zinc-500">
                    {message.role === "user" ? "あなた" : "AI（出題者）"}
                  </p>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-b-2xl rounded-t-none border border-zinc-200 bg-white px-3 py-3 shadow-sm">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("question")}
              className={`rounded-full px-3 py-1 text-sm ${
                mode === "question"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              質問モード
            </button>
            <button
              type="button"
              onClick={() => setMode("guess")}
              className={`rounded-full px-3 py-1 text-sm ${
                mode === "guess"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              解答モード
            </button>
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={handleSend}
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              送信
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
