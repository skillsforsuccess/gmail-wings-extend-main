import { useState } from "react";
import { Deal, STAGES } from "@/data/mockData";
import DealCard from "./DealCard";
import { Plus } from "lucide-react";

interface KanbanBoardProps {
  deals: Deal[];
  onMoveDeal: (dealId: string, newStage: string) => void;
  onSelectDeal?: (deal: Deal) => void;
}

const STAGE_HEADER_COLORS: Record<string, string> = {
  Lead: "bg-stage-lead",
  Contacted: "bg-stage-contacted",
  Proposal: "bg-stage-proposal",
  Negotiation: "bg-stage-negotiation",
  Won: "bg-stage-won",
  Lost: "bg-stage-lost",
};

export default function KanbanBoard({ deals, onMoveDeal, onSelectDeal }: KanbanBoardProps) {
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("text/plain", dealId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain");
    if (dealId) {
      onMoveDeal(dealId, stage);
    }
    setDragOverStage(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-1">
      {STAGES.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage);
        const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
        const isOver = dragOverStage === stage;

        return (
          <div
            key={stage}
            className={`kanban-column transition-colors ${isOver ? "ring-2 ring-primary ring-opacity-50" : ""}`}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="px-3 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${STAGE_HEADER_COLORS[stage]}`} />
                <span className="text-sm font-semibold text-foreground">{stage}</span>
                <span className="text-xs text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5">
                  {stageDeals.length}
                </span>
              </div>
              <button className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="px-3 pb-2">
              <p className="text-xs text-muted-foreground">
                ${totalValue.toLocaleString()}
              </p>
            </div>

            <div className="flex-1 px-2 pb-2 space-y-2 min-h-[100px]">
              {stageDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onDragStart={handleDragStart}
                  onClick={() => onSelectDeal?.(deal)}
                />
              ))}

              {stageDeals.length === 0 && (
                <div className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                  isOver ? "border-primary bg-accent" : "border-border"
                }`}>
                  <p className="text-xs text-muted-foreground">Drop deals here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
