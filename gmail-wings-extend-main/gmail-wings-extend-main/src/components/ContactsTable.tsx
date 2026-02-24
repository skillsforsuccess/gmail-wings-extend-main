import { useState } from "react";
import { Contact } from "@/data/mockData";
import { Search, Tag, Pencil, Check, X } from "lucide-react";

interface ContactsTableProps {
  contacts: Contact[];
  onUpdateContact: (id: string, updates: Partial<Contact>) => void;
}

export default function ContactsTable({ contacts, onUpdateContact }: ContactsTableProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Contact>>({});

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const startEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setEditValues({ name: contact.name, email: contact.email, phone: contact.phone, company: contact.company });
  };

  const saveEdit = (id: string) => {
    onUpdateContact(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search contacts by name, email, company, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Tags</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Contact</th>
              <th className="w-16 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact) => {
              const isEditing = editingId === contact.id;
              return (
                <tr key={contact.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input className="text-sm bg-background border border-input rounded px-2 py-1 w-full" value={editValues.name || ""} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{contact.name.charAt(0)}</div>
                        <span className="text-sm font-medium text-foreground">{contact.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input className="text-sm bg-background border border-input rounded px-2 py-1 w-full" value={editValues.email || ""} onChange={(e) => setEditValues({ ...editValues, email: e.target.value })} />
                    ) : (
                      <span className="text-sm text-muted-foreground">{contact.email}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {isEditing ? (
                      <input className="text-sm bg-background border border-input rounded px-2 py-1 w-full" value={editValues.phone || ""} onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })} />
                    ) : (
                      <span className="text-sm text-muted-foreground">{contact.phone}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input className="text-sm bg-background border border-input rounded px-2 py-1 w-full" value={editValues.company || ""} onChange={(e) => setEditValues({ ...editValues, company: e.target.value })} />
                    ) : (
                      <span className="text-sm text-foreground">{contact.company}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent text-accent-foreground">
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {contact.lastContacted
                        ? new Date(contact.lastContacted).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "Never"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-1">
                        <button onClick={() => saveEdit(contact.id)} className="w-6 h-6 rounded flex items-center justify-center text-success hover:bg-success/10 transition"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={cancelEdit} className="w-6 h-6 rounded flex items-center justify-center text-destructive hover:bg-destructive/10 transition"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(contact)} className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary transition"><Pencil className="w-3.5 h-3.5" /></button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
