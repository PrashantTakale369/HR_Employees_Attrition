import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const MetricCard = ({ title, value, icon: Icon, trend, trendUp }: MetricCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 bg-gradient-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2 bg-gradient-primary bg-clip-text text-transparent">
              {value}
            </h3>
            {trend && (
              <p className={`text-xs mt-1 ${trendUp ? "text-success" : "text-destructive"}`}>
                {trend}
              </p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
