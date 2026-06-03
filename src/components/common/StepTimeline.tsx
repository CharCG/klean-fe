import type { ReactNode } from "react";

interface Step {
  status: string;
  label: string;
  icon: ReactNode;
}

interface StepTimelineProps {
  currentStatus: string;
  steps: Step[];
}

export default function StepTimeline({ currentStatus, steps }: StepTimelineProps) {
  const currentIndex = steps.findIndex((s) => s.status === currentStatus);

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-stroke)",
      }}
    >
      <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--color-text)" }}>
        Order Status
      </h3>
      <div className="relative">
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5 z-0"
          style={{ backgroundColor: "var(--color-stroke-medium)" }}
        ></div>
        <div className="space-y-6 relative z-10">
          {steps.map((step, index) => {
            const isCompleted = currentIndex >= index;
            const isCurrent = currentIndex === index;
            return (
              <div key={step.status} className="flex gap-4 items-start">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted ? "text-white" : ""}`}
                  style={{
                    backgroundColor: isCompleted ? "var(--color-primary)" : "var(--color-stroke)",
                    color: isCompleted ? undefined : "var(--color-text-tertiary)",
                  }}
                >
                  {step.icon}
                </div>
                <div className="pt-1.5">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: isCompleted ? "var(--color-text)" : "var(--color-text-tertiary)" }}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs font-medium mt-0.5" style={{ color: "var(--color-primary)" }}>
                      Currently here
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
