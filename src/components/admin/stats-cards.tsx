import { cn } from "@/lib/cn";
import type { computeStats } from "@/lib/guest-stats";

function StatCard({ label, value, sub, valueClass }: { label: string; value: number; sub: string; valueClass: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-card border border-line-subtle bg-card px-[18px] py-4">
      <span className="label-caps">{label}</span>
      <span className={cn("font-sans text-34 leading-none font-semibold tracking-tight", valueClass)}>{value}</span>
      <span className="font-sans text-12 text-muted">{sub}</span>
    </div>
  );
}

export function StatsCards({ stats }: { stats: ReturnType<typeof computeStats> }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
      <StatCard
        label="Total de pessoas"
        value={stats.people}
        sub={`${stats.yes} convidados + ${stats.companions} acompanhantes`}
        valueClass="text-accent"
      />
      <StatCard label="Confirmados" value={stats.yes} sub="convites" valueClass="text-ink" />
      <StatCard label="Pendentes" value={stats.pending} sub="sem resposta" valueClass="text-gold" />
      <StatCard label="Não vão" value={stats.no} sub="recusaram" valueClass="text-secondary" />
    </div>
  );
}
