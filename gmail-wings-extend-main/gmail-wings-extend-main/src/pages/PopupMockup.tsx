import { mockEmailTracks, STAGE_COLORS } from "@/data/mockData";
import { useCRM } from "@/context/CRMContext";
import { Mail, Users, LayoutDashboard, Eye, Settings, ExternalLink } from "lucide-react";

export default function PopupMockup() {
  const { deals, contacts } = useCRM();
  const activeDeals = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const recentTracks = mockEmailTracks.slice(0, 3);
  const totalOpens = mockEmailTracks.reduce((s, t) => s + t.openCount, 0);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
      <div className="w-[400px] h-[500px] bg-card rounded-xl border-2 border-border shadow-xl overflow-hidden flex flex-col">
        {/* Popup header */}
        <div className="bg-primary px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary-foreground/20 flex items-center justify-center">
              <Mail className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-primary-foreground">GmailCRM</span>
          </div>
          <button className="text-primary-foreground/70 hover:text-primary-foreground transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-px bg-border">
          {[
            { label: "Deals", value: activeDeals.length, icon: LayoutDashboard },
            { label: "Contacts", value: contacts.length, icon: Users },
            { label: "Opens", value: totalOpens, icon: Eye },
          ].map((stat) => (
            <div key={stat.label} className="bg-card p-3 text-center">
              <stat.icon className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Active deals */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 py-3 border-b">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Deals</h3>
          </div>
          <div className="divide-y">
            {activeDeals.slice(0, 4).map((deal) => (
              <div key={deal.id} className="px-4 py-2.5 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate pr-2">{deal.name}</span>
                  <span className={`stage-badge ${STAGE_COLORS[deal.stage]} text-[10px]`}>{deal.stage}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{deal.contactName}</span>
                  <span className="text-xs font-semibold text-primary">${deal.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent tracking */}
          <div className="px-4 py-3 border-b border-t">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Tracking</h3>
          </div>
          <div className="divide-y">
            {recentTracks.map((track) => (
              <div key={track.id} className="px-4 py-2.5 hover:bg-muted/30 transition-colors">
                <p className="text-xs text-foreground truncate">{track.subject}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" /> {track.openCount} opens
                  </span>
                  <span className="text-[10px] text-muted-foreground">{track.recipientEmail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t bg-muted/30 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Connected to Gmail</span>
          <button className="text-[10px] text-primary font-medium flex items-center gap-1 hover:underline">
            Open Dashboard <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
