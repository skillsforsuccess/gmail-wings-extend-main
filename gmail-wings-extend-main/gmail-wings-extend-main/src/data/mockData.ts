export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  tags: string[];
  lastContacted: string | null;
  createdAt: string;
}

export interface Deal {
  id: string;
  name: string;
  contactId: string;
  contactName: string;
  stage: string;
  value: number;
  currency: string;
  closeDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: string[];
}

export interface EmailTrack {
  id: string;
  recipientEmail: string;
  subject: string;
  sentAt: string;
  openCount: number;
  lastOpenedAt: string | null;
  linkClicks: number;
}

export const STAGES = ["Lead", "Contacted", "Proposal", "Negotiation", "Won", "Lost"] as const;

export const STAGE_COLORS: Record<string, string> = {
  Lead: "stage-badge-lead",
  Contacted: "stage-badge-contacted",
  Proposal: "stage-badge-proposal",
  Negotiation: "stage-badge-negotiation",
  Won: "stage-badge-won",
  Lost: "stage-badge-lost",
};

export const mockContacts: Contact[] = [
  { id: "c1", name: "Sarah Chen", email: "sarah@acmecorp.com", phone: "+1 415-555-0101", company: "Acme Corp", notes: "Decision maker, prefers email", tags: ["Enterprise", "Tech"], lastContacted: "2026-02-18", createdAt: "2026-01-05" },
  { id: "c2", name: "James Rodriguez", email: "james@globex.io", phone: "+1 212-555-0202", company: "Globex Inc", notes: "VP of Operations", tags: ["Mid-Market", "Operations"], lastContacted: "2026-02-15", createdAt: "2026-01-10" },
  { id: "c3", name: "Emily Watson", email: "emily@initech.com", phone: "+44 20-7946-0303", company: "Initech", notes: "Interested in annual plan", tags: ["Enterprise", "Finance"], lastContacted: "2026-02-12", createdAt: "2026-01-12" },
  { id: "c4", name: "Michael Park", email: "mpark@umbrella.co", phone: "+1 650-555-0404", company: "Umbrella Co", notes: "Needs demo next week", tags: ["Startup", "Tech"], lastContacted: "2026-02-19", createdAt: "2026-01-20" },
  { id: "c5", name: "Lisa Nakamura", email: "lisa@wayne.ent", phone: "+1 310-555-0505", company: "Wayne Enterprises", notes: "Referred by John", tags: ["Enterprise", "Security"], lastContacted: null, createdAt: "2026-02-01" },
  { id: "c6", name: "David Kim", email: "dkim@stark.ind", phone: "+1 408-555-0606", company: "Stark Industries", notes: "CTO, technical evaluation", tags: ["Enterprise", "Tech"], lastContacted: "2026-02-10", createdAt: "2026-02-05" },
  { id: "c7", name: "Anna Petrov", email: "anna@oscorp.net", phone: "+1 718-555-0707", company: "Oscorp", notes: "Budget approved Q1", tags: ["Mid-Market", "Biotech"], lastContacted: "2026-02-17", createdAt: "2026-02-08" },
];

export const mockDeals: Deal[] = [
  { id: "d1", name: "Acme Enterprise License", contactId: "c1", contactName: "Sarah Chen", stage: "Proposal", value: 48000, currency: "USD", closeDate: "2026-03-15", notes: "Annual license, 50 seats", createdAt: "2026-01-15", updatedAt: "2026-02-18" },
  { id: "d2", name: "Globex Integration Package", contactId: "c2", contactName: "James Rodriguez", stage: "Negotiation", value: 32000, currency: "USD", closeDate: "2026-03-01", notes: "Custom API integration needed", createdAt: "2026-01-18", updatedAt: "2026-02-15" },
  { id: "d3", name: "Initech Annual Plan", contactId: "c3", contactName: "Emily Watson", stage: "Contacted", value: 24000, currency: "USD", closeDate: "2026-04-01", notes: "Follow up after demo", createdAt: "2026-01-22", updatedAt: "2026-02-12" },
  { id: "d4", name: "Umbrella Starter Pack", contactId: "c4", contactName: "Michael Park", stage: "Lead", value: 8000, currency: "USD", closeDate: null, notes: "Inbound from website", createdAt: "2026-02-10", updatedAt: "2026-02-19" },
  { id: "d5", name: "Wayne Security Suite", contactId: "c5", contactName: "Lisa Nakamura", stage: "Lead", value: 96000, currency: "USD", closeDate: "2026-06-01", notes: "Large deal, needs executive approval", createdAt: "2026-02-01", updatedAt: "2026-02-14" },
  { id: "d6", name: "Stark Tech Eval", contactId: "c6", contactName: "David Kim", stage: "Proposal", value: 64000, currency: "USD", closeDate: "2026-03-20", notes: "Technical POC running", createdAt: "2026-02-05", updatedAt: "2026-02-16" },
  { id: "d7", name: "Oscorp Q1 Deal", contactId: "c7", contactName: "Anna Petrov", stage: "Won", value: 18000, currency: "USD", closeDate: "2026-02-15", notes: "Closed! Onboarding starts Monday", createdAt: "2026-02-08", updatedAt: "2026-02-15" },
  { id: "d8", name: "Globex Phase 2", contactId: "c2", contactName: "James Rodriguez", stage: "Lead", value: 15000, currency: "USD", closeDate: null, notes: "Expansion opportunity", createdAt: "2026-02-12", updatedAt: "2026-02-18" },
  { id: "d9", name: "Initech Addon", contactId: "c3", contactName: "Emily Watson", stage: "Lost", value: 12000, currency: "USD", closeDate: "2026-02-10", notes: "Went with competitor", createdAt: "2026-01-28", updatedAt: "2026-02-10" },
];

export const mockPipeline: Pipeline = {
  id: "p1",
  name: "Sales Pipeline",
  stages: ["Lead", "Contacted", "Proposal", "Negotiation", "Won", "Lost"],
};

export const mockEmailTracks: EmailTrack[] = [
  { id: "t1", recipientEmail: "sarah@acmecorp.com", subject: "Acme Enterprise Proposal - Updated Pricing", sentAt: "2026-02-18T10:30:00Z", openCount: 5, lastOpenedAt: "2026-02-19T14:22:00Z", linkClicks: 2 },
  { id: "t2", recipientEmail: "james@globex.io", subject: "Re: Globex Integration Timeline", sentAt: "2026-02-15T09:15:00Z", openCount: 3, lastOpenedAt: "2026-02-17T11:05:00Z", linkClicks: 1 },
  { id: "t3", recipientEmail: "emily@initech.com", subject: "Initech Demo Follow-Up", sentAt: "2026-02-12T14:00:00Z", openCount: 1, lastOpenedAt: "2026-02-12T16:30:00Z", linkClicks: 0 },
  { id: "t4", recipientEmail: "mpark@umbrella.co", subject: "Welcome to GmailCRM - Getting Started", sentAt: "2026-02-19T08:00:00Z", openCount: 2, lastOpenedAt: "2026-02-20T09:10:00Z", linkClicks: 3 },
  { id: "t5", recipientEmail: "dkim@stark.ind", subject: "Technical Evaluation - Architecture Doc", sentAt: "2026-02-16T11:45:00Z", openCount: 8, lastOpenedAt: "2026-02-19T16:55:00Z", linkClicks: 4 },
  { id: "t6", recipientEmail: "anna@oscorp.net", subject: "Oscorp Onboarding Schedule", sentAt: "2026-02-15T13:20:00Z", openCount: 4, lastOpenedAt: "2026-02-18T10:00:00Z", linkClicks: 2 },
  { id: "t7", recipientEmail: "lisa@wayne.ent", subject: "Wayne Enterprises - Security Overview", sentAt: "2026-02-14T15:30:00Z", openCount: 0, lastOpenedAt: null, linkClicks: 0 },
];
