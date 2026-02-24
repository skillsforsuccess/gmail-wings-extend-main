import { mockDeals, mockEmailTracks, mockContacts, STAGES } from "@/data/mockData";
import { Mail, Eye, MousePointerClick, DollarSign, Users, TrendingUp } from "lucide-react";

function BarChart({ data, maxVal }: { data: { label: string; value: number }[]; maxVal: number }) {
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item) => (
        <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-medium text-foreground">{item.value}</span>
          <div className="w-full relative rounded-t overflow-hidden" style={{ height: `${Math.max(4, (item.value / maxVal) * 100)}%` }}>
            <div className="bar-chart-bar w-full h-full" />
          </div>
          <span className="text-[9px] text-muted-foreground text-center leading-tight">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const stageData = STAGES.map((stage) => ({
    label: stage,
    value: mockDeals.filter((d) => d.stage === stage).length,
  }));

  const totalOpens = mockEmailTracks.reduce((s, t) => s + t.openCount, 0);
  const totalClicks = mockEmailTracks.reduce((s, t) => s + t.linkClicks, 0);
  const totalSent = mockEmailTracks.length;
  const openRate = totalSent > 0 ? Math.round((mockEmailTracks.filter((t) => t.openCount > 0).length / totalSent) * 100) : 0;

  const pipelineValue = mockDeals.reduce((s, d) => s + d.value, 0);
  const wonValue = mockDeals.filter((d) => d.stage === "Won").reduce((s, d) => s + d.value, 0);

  const valueByStage = STAGES.filter((s) => s !== "Lost").map((stage) => ({
    label: stage,
    value: mockDeals.filter((d) => d.stage === stage).reduce((s, d) => s + d.value, 0),
  }));
  const maxStageValue = Math.max(...valueByStage.map((v) => v.value), 1);

  const stats = [
    { label: "Total Pipeline", value: `$${pipelineValue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Won Revenue", value: `$${wonValue.toLocaleString()}`, icon: TrendingUp, color: "text-success" },
    { label: "Contacts", value: mockContacts.length.toString(), icon: Users, color: "text-stage-contacted" },
    { label: "Emails Sent", value: totalSent.toString(), icon: Mail, color: "text-stage-proposal" },
    { label: "Total Opens", value: totalOpens.toString(), icon: Eye, color: "text-warning" },
    { label: "Open Rate", value: `${openRate}%`, icon: Eye, color: "text-stage-negotiation" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Pipeline performance & email tracking</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Deals by stage */}
          <div className="bg-card rounded-lg border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Deals by Stage</h3>
            <BarChart data={stageData} maxVal={Math.max(...stageData.map((d) => d.value), 1)} />
          </div>

          {/* Value by stage */}
          <div className="bg-card rounded-lg border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Pipeline Value by Stage</h3>
            <BarChart data={valueByStage.map((v) => ({ ...v, value: Math.round(v.value / 1000) }))} maxVal={Math.round(maxStageValue / 1000)} />
            <p className="text-[10px] text-muted-foreground mt-2 text-right">Values in $K</p>
          </div>
        </div>

        {/* Email tracking table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h3 className="text-sm font-semibold text-foreground">Email Tracking</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recipient</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Subject</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opens</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clicks</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Opened</th>
              </tr>
            </thead>
            <tbody>
              {mockEmailTracks.map((track) => (
                <tr key={track.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 text-sm text-foreground">{track.recipientEmail}</td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground truncate max-w-[200px] hidden md:table-cell">{track.subject}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${track.openCount > 0 ? "text-success" : "text-muted-foreground"}`}>
                      <Eye className="w-3 h-3" /> {track.openCount}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${track.linkClicks > 0 ? "text-primary" : "text-muted-foreground"}`}>
                      <MousePointerClick className="w-3 h-3" /> {track.linkClicks}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground hidden lg:table-cell">
                    {track.lastOpenedAt
                      ? new Date(track.lastOpenedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
