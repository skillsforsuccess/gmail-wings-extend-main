import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Contact, Deal, mockContacts, mockDeals } from '@/data/mockData';

interface CRMContextType {
  deals: Deal[];
  contacts: Contact[];
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
}

const CRMContext = createContext<CRMContextType | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useLocalStorage<Deal[]>('gmailcrm_deals', mockDeals);
  const [contacts, setContacts] = useLocalStorage<Contact[]>('gmailcrm_contacts', mockContacts);

  const addDeal = (deal: Omit<Deal, 'id'>) => {
    const newDeal: Deal = { ...deal, id: `d${Date.now()}` };
    setDeals((prev) => [...prev, newDeal]);

    const email = (deal as any).contactEmail || '';
    if (email && deal.contactName) {
      setContacts((prev) => {
        const exists = prev.some(
          (c) => c.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) return prev;
        return [...prev, {
          id: `c${Date.now()}_auto`,
          name: deal.contactName,
          email,
          phone: '',
          company: '',
          notes: '',
          tags: ['lead'],
          lastContacted: null,
          createdAt: new Date().toISOString().split('T')[0],
        }];
      });
    }
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDeal = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = { ...contact, id: `c${Date.now()}` };
    setContacts((prev) => [...prev, newContact]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CRMContext.Provider value={{ deals, contacts, addDeal, updateDeal, deleteDeal, addContact, updateContact, deleteContact }}>
      {children}
    </CRMContext.Provider>
  );
}

export const useCRM = () => {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used within CRMProvider');
  return ctx;
};
