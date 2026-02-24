import { useState } from "react";
import { Contact } from "@/data/mockData";
import { useCRM } from "@/context/CRMContext";
import ContactsTable from "@/components/ContactsTable";
import { Plus, Upload, X } from "lucide-react";

export default function ContactsPage() {
  const { contacts, addContact, updateContact } = useCRM();
  const [showModal, setShowModal] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    tags: "",
    notes: "",
  });

  const handleUpdateContact = (id: string, updates: Partial<Contact>) => {
    updateContact(id, updates);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ name: "", email: "", phone: "", company: "", tags: "", notes: "" });
    setShaking(false);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }
    addContact({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      notes: form.notes,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      lastContacted: null,
      createdAt: new Date().toISOString().split("T")[0],
    } as any);
    closeModal();
  };

  const tagColors = [
    "bg-primary/15 text-primary",
    "bg-green-500/15 text-green-700",
    "bg-amber-500/15 text-amber-700",
    "bg-purple-500/15 text-purple-700",
    "bg-rose-500/15 text-rose-700",
  ];

  const previewTags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <div>
          <h1 className="text-xl font-bold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{contacts.length} contacts</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg text-muted-foreground hover:bg-secondary transition">
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Add Contact
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <ContactsTable contacts={contacts} onUpdateContact={handleUpdateContact} />
      </div>

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
            <h2 className="text-lg font-bold text-foreground mb-4">New Contact</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 555-000-0000"
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Company</label>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Tags (comma-separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="Enterprise, Tech, VIP"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {previewTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {previewTags.map((tag, i) => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[i % tagColors.length]}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
