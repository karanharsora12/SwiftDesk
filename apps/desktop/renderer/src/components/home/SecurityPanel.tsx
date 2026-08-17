import { ShieldCheck } from "lucide-react";
import { Button } from "../Button";

export function SecurityPanel() {
  return (
    <section className="shrink-0 rounded-2xl border border-sky-500/20 dark:border-sky-400/20 bg-gradient-to-br from-sky-50 dark:from-sky-400/[0.08] to-transparent p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-100/50 dark:bg-sky-400/15 text-sky-600 dark:text-sky-300">
          <ShieldCheck size={20} />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Secure by design
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
            Every session requires your approval. Remote control is never
            granted automatically.
          </p>
        </div>
      </div>
      <Button
        ripple={false}
        className="mt-3 text-sm font-medium text-sky-300 transition-colors hover:text-sky-200"
      >
        Learn about security <span aria-hidden="true">→</span>
      </Button>
    </section>
  );
}
