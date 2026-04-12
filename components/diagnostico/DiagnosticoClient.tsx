"use client";

import {
  type DiagnosticoAnswer,
  type DiagnosticoOption,
  DIAGNOSTICO_QUESTIONS,
  DIAGNOSTICO_SESSION_KEY,
  buildDiagnosticoPayload,
  buildDiagnosticoResumen,
  serializeDiagnosticoPayload,
  type DiagnosticoResultPayload,
} from "@/lib/diagnostico";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { DiagnosticoLeadForm, type DiagnosticoLeadData } from "./DiagnosticoLeadForm";
import { DiagnosticoProgress } from "./DiagnosticoProgress";
import { DiagnosticoQuestionStep } from "./DiagnosticoQuestionStep";
import { DiagnosticoResults } from "./DiagnosticoResults";

const TOTAL = DIAGNOSTICO_QUESTIONS.length;

const emptyLead: DiagnosticoLeadData = { nombre: "", email: "", telefono: "" };

function answersFromSelections(
  selections: Record<string, string>,
): DiagnosticoAnswer[] {
  return DIAGNOSTICO_QUESTIONS.map((q) => {
    const optionId = selections[q.id];
    const opt = q.options.find((o) => o.id === optionId)!;
    return {
      questionId: q.id,
      optionId: opt.id,
      points: opt.points,
    };
  });
}

/**
 * step 0 = captura lead; steps 1..TOTAL = preguntas (índice pregunta = step - 1).
 */
export function DiagnosticoClient() {
  const [step, setStep] = useState(0);
  const [leadData, setLeadData] = useState<DiagnosticoLeadData>(emptyLead);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"quiz" | "results">("quiz");
  const [resultPayload, setResultPayload] = useState<DiagnosticoResultPayload | null>(null);

  const qIndex = step > 0 ? step - 1 : 0;
  const question = step > 0 ? DIAGNOSTICO_QUESTIONS[qIndex] : null;
  const selectedId = question ? (selections[question.id] ?? null) : null;

  const resumen = resultPayload ? buildDiagnosticoResumen(resultPayload) : "";

  const selectOption = useCallback(
    (opt: DiagnosticoOption) => {
      if (!question) return;
      setSelections((prev) => ({ ...prev, [question.id]: opt.id }));
    },
    [question],
  );

  const finishQuiz = useCallback(
    (finalSelections: Record<string, string>) => {
      const answers = answersFromSelections(finalSelections);
      const payload = buildDiagnosticoPayload(answers);
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(DIAGNOSTICO_SESSION_KEY, serializeDiagnosticoPayload(payload));
        }
      } catch {
        /* ignore */
      }
      setResultPayload(payload);
      setPhase("results");
    },
    [],
  );

  const goNext = useCallback(() => {
    if (!question || selectedId === null) return;
    const merged = { ...selections, [question.id]: selectedId };

    if (step === TOTAL) {
      finishQuiz(merged);
      return;
    }

    setSelections(merged);
    setStep((s) => s + 1);
  }, [finishQuiz, question, selectedId, selections, step]);

  const goBackInQuiz = useCallback(() => {
    if (step <= 1) {
      setStep(0);
      return;
    }
    setStep((s) => s - 1);
  }, [step]);

  const restart = useCallback(() => {
    setStep(0);
    setLeadData(emptyLead);
    setSelections({});
    setPhase("quiz");
    setResultPayload(null);
  }, []);

  const startQuizAfterLead = useCallback(() => {
    setStep(1);
  }, []);

  const intro = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Diagnóstico digital
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/55">
          Diez preguntas para situar el nivel de digitalización de tu negocio y recibir recomendaciones accionables.
          Tardarás unos tres minutos.
        </p>
      </motion.div>
    ),
    [],
  );

  if (phase === "results" && resultPayload) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#05080c] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute -left-1/4 top-0 h-[420px] w-[420px] rounded-full opacity-[0.12] blur-[100px]"
            style={{ background: "radial-gradient(circle, #4ed3c2 0%, transparent 70%)" }}
            aria-hidden
          />
          <div
            className="absolute -right-1/4 bottom-0 h-[380px] w-[380px] rounded-full opacity-[0.08] blur-[90px]"
            style={{ background: "radial-gradient(circle, #1abbb3 0%, transparent 70%)" }}
            aria-hidden
          />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-sm sm:p-10">
            <DiagnosticoResults
              payload={resultPayload}
              leadData={leadData}
              resumen={resumen}
              onRestart={restart}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#05080c] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -left-1/4 top-0 h-[420px] w-[420px] rounded-full opacity-[0.12] blur-[100px]"
          style={{ background: "radial-gradient(circle, #4ed3c2 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="absolute -right-1/4 bottom-0 h-[380px] w-[380px] rounded-full opacity-[0.08] blur-[90px]"
          style={{ background: "radial-gradient(circle, #1abbb3 0%, transparent 70%)" }}
          aria-hidden
        />
      </div>

      <div className="relative mx-auto max-w-2xl">
        {step === 0 ? intro : null}
        <div
          className={`rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-sm sm:p-10 ${
            step === 0 ? "mt-10" : "mt-0"
          }`}
        >
          {step === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="flex flex-col items-center"
            >
              <DiagnosticoProgress current={0} total={TOTAL} intro />
              <div className="mt-8 flex w-full justify-center">
                <DiagnosticoLeadForm data={leadData} onChange={setLeadData} onSubmit={startQuizAfterLead} />
              </div>
            </motion.div>
          ) : question ? (
            <>
              <div className="mb-10">
                <DiagnosticoProgress current={qIndex} total={TOTAL} />
              </div>
              <DiagnosticoQuestionStep
                question={question}
                selectedId={selectedId}
                onSelect={selectOption}
                onBack={goBackInQuiz}
                onNext={goNext}
                canGoBack
                isLast={step === TOTAL}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
