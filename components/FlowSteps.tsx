import Link from "next/link";

const steps = [
  { n: 1, label: "Cart", href: "/cart" },
  { n: 2, label: "Checkout", href: "/checkout" },
  { n: 3, label: "Confirmed", href: "" },
] as const;

export function FlowSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="steps" aria-label="Purchase progress">
      {steps.map((step) => {
        const state = step.n < current ? "done" : step.n === current ? "current" : "upcoming";
        const body = (
          <>
            <span className="step-index" aria-hidden="true">
              {state === "done" ? "✓" : step.n}
            </span>
            {step.label}
          </>
        );
        return (
          <li
            key={step.n}
            className={`step is-${state}`}
            aria-current={state === "current" ? "step" : undefined}
          >
            {state === "done" && step.href ? <Link href={step.href}>{body}</Link> : body}
          </li>
        );
      })}
    </ol>
  );
}
