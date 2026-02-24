import { Deal, STAGE_COLORS } from "@/data/mockData";

interface DealCardProps {
  deal: Deal;
  onDragStart: (e: React.DragEvent, dealId: string) => void;
  onClick?: () => void;
}

function daysInStage(updatedAt: string): number {
  const updated = new Date(updatedAt);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

export default function DealCard({ deal, onDragStart, onClick }: DealCardProps) {
  const days = daysInStage(deal.updatedAt);
  const stageClass = STAGE_COLORS[deal.stage] || "stage-badge-lead";

  return (
    <div
      className="deal-card animate-fade-in cursor-pointer"
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-card-foreground leading-tight pr-2">{deal.name}</h4>
        <span className={`stage-badge ${stageClass} flex-shrink-0`}>{deal.stage}</span>
      </div>

      <p className="text-xs text-muted-foreground mb-2">{deal.contactName}</p>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-primary">
          {formatCurrency(deal.value, deal.currency)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {days === 0 ? "Today" : `${days}d in stage`}
        </span>
      </div>

      {deal.closeDate && (
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground">
            Close: {new Date(deal.closeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
      )}
    </div>
  );
}
