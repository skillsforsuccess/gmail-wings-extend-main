import { useState, useEffect } from "react";
import { Deal, STAGES } from "@/data/mockData";
import { useCRM } from "@/context/CRMContext";
import KanbanBoard from "@/components/KanbanBoard";
import { Filter, Plus, X, DollarSign, Trash2 } from "lucide-react";

export default function PipelinePage() {
  const { deals, addDeal, updateDeal, deleteDeal } = useCRM();
  const [showModal, setShowModal] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contactName: "",
    contactEmail: "",
    stage: STAGES[0] as string,
    value: "",
    closeDate: "",
    notes: "",
  });

  // Keep selectedDeal in sync with deals state
  useEffect(() => {
    if (selectedDeal) {
      const updated = deals.find((d) => d.id === selectedDeal.id);
      if (updated) setSelectedDeal(updated);
      else setSelectedDeal(null);
    }
  }, [deals]);

  // Escape key closes detail panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDeal(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleMoveDeal = (dealId: string, newStage: string) => {
    updateDeal(dealId, { stage: newStage, updatedAt: new Date().toISOString().split("T")[0] });
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ name: "", contactName: "", contactEmail: "", stage: STAGES[0], value: "", closeDate: "", notes: "" });
    setShaking(false);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    addDeal({
      name: form.name,
      contactId: "",
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      stage: form.stage,
      value: parseFloat(form.value) || 0,
      currency: "USD",
      closeDate: form.closeDate || null,
      notes: form.notes,
      createdAt: today,
      updatedAt: today,
    } as any);
    closeModal();
  };

  const handleDeleteDeal = () => {
    if (selectedDeal) {
      deleteDeal(selectedDeal.id);
      setSelectedDeal(null);
      setConfirmDelete(false);
    }
  };

  const handleDetailBlur = (field: keyof Deal, value: any) => {
    if (selectedDeal) {
      updateDeal(selectedDeal.id, { [field]: value });
    }
  };

  const totalValue = deals.reduce((s, d) => s + d.value, 0);
  const activeDeals = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <div>
          <h1 className="text-xl font-bold text-foreground">Sales Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeDeals.length} active deals · ${totalValue.toLocaleString()} total value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg text-muted-foreground hover:bg-secondary transition">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Add Deal
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-auto p-6">
        <KanbanBoard deals={deals} onMoveDeal={handleMoveDeal} onSelectDeal={setSelectedDeal} />
      </div>

      {/* New Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className={`relative bg-card border rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 ${shaking ? "animate-shake" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">New Deal</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Deal Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Enterprise License"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Contact Name</label>
                  <input
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Contact Email</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Pipeline Stage</label>
                <select
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Deal Value</label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="number"
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: e.target.value })}
                      placeholder="0"
                      className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Close Date</label>
                  <input
                    type="date"
                    value={form.closeDate}
                    onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={closeModal} className="px-4 py-2 text-sm border rounded-lg text-muted-foreground hover:bg-secondary transition">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium">
                Save Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deal Detail Slide-in Panel */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50" onClick={() => setSelectedDeal(null)}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-card border-l shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${
          selectedDeal ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedDeal && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-base font-bold text-foreground">Deal Details</h3>
              <button onClick={() => setSelectedDeal(null)} className="text-muted-foreground hover:text-foreground transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Deal Name</label>
                <input
                  defaultValue={selectedDeal.name}
                  onBlur={(e) => handleDetailBlur("name", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact</label>
                <p className="text-sm text-foreground mt-1">{selectedDeal.contactName || "—"}</p>
                {(selectedDeal as any).contactEmail && (
                  <p className="text-xs text-muted-foreground">{(selectedDeal as any).contactEmail}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stage</label>
                <select
                  value={selectedDeal.stage}
                  onChange={(e) => handleDetailBlur("stage", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Value</label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="number"
                    defaultValue={selectedDeal.value}
                    onBlur={(e) => handleDetailBlur("value", parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Close Date</label>
                <input
                  type="date"
                  defaultValue={selectedDeal.closeDate || ""}
                  onBlur={(e) => handleDetailBlur("closeDate", e.target.value || null)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</label>
                <textarea
                  defaultValue={selectedDeal.notes || ""}
                  onBlur={(e) => handleDetailBlur("notes", e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="px-5 py-4 border-t">
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Deal
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-destructive font-medium">Are you sure?</span>
                  <button onClick={handleDeleteDeal} className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition">
                    Yes, delete
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-sm border rounded-lg text-muted-foreground hover:bg-secondary transition">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
