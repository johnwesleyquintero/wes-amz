import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  DollarSign,
  Eye,
  MousePointer
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "opportunity" | "warning" | "success" | "info";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  actionable: boolean;
  metric?: {
    value: number;
    change: number;
    unit: string;
  };
  recommendation?: string;
  estimatedImpact?: string;
}

interface RealTimeInsightsProps {
  data?: unknown[];
  context?: "acos" | "ppc" | "keywords" | "general";
  className?: string;
}

const RealTimeInsights: React.FC<RealTimeInsightsProps> = ({
  data = [],
  context = "general",
  className,
}) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate insights based on data and context
  useEffect(() => {
    if (data.length === 0) return;

    setIsAnalyzing(true);
    
    // Simulate analysis time
    const timer = setTimeout(() => {
      const generatedInsights = generateInsights(data, context);
      setInsights(generatedInsights);
      setIsAnalyzing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [data, context]);

  const generateInsights = (data: unknown[], context: string): Insight[] => {
    const insights: Insight[] = [];

    // Generate context-specific insights
    switch (context) {
      case "acos":
        insights.push(
          {
            id: "acos-high",
            type: "warning",
            title: "High ACoS Detected",
            description: "3 campaigns have ACoS above 35%",
            impact: "high",
            actionable: true,
            metric: { value: 42.5, change: 8.2, unit: "%" },
            recommendation: "Consider reducing bids on underperforming keywords",
            estimatedImpact: "Could save $1,200/month in ad spend",
          },
          {
            id: "acos-opportunity",
            type: "opportunity",
            title: "Scaling Opportunity",
            description: "2 campaigns performing well below target ACoS",
            impact: "medium",
            actionable: true,
            metric: { value: 18.3, change: -5.1, unit: "%" },
            recommendation: "Increase budgets for high-performing campaigns",
            estimatedImpact: "Potential 25% revenue increase",
          }
        );
        break;
      case "ppc":
        insights.push(
          {
            id: "ctr-low",
            type: "warning",
            title: "Low Click-Through Rate",
            description: "CTR below industry average on 5 campaigns",
            impact: "medium",
            actionable: true,
            metric: { value: 0.8, change: -0.3, unit: "%" },
            recommendation: "Test new ad creative and product images",
            estimatedImpact: "Could improve CTR by 40%",
          },
          {
            id: "conversion-good",
            type: "success",
            title: "Strong Conversion Performance",
            description: "Conversion rate 15% above category average",
            impact: "high",
            actionable: false,
            metric: { value: 12.4, change: 2.1, unit: "%" },
          }
        );
        break;
      default:
        insights.push(
          {
            id: "general-performance",
            type: "info",
            title: "Performance Summary",
            description: "Overall metrics trending positively",
            impact: "medium",
            actionable: false,
            metric: { value: 85, change: 5, unit: "score" },
          }
        );
    }

    return insights;
  };

  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  const getInsightBadge = (impact: Insight["impact"]) => {
    switch (impact) {
      case "high":
        return <Badge variant="destructive">High Impact</Badge>;
      case "medium":
        return <Badge variant="default">Medium Impact</Badge>;
      case "low":
        return <Badge variant="secondary">Low Impact</Badge>;
    }
  };

  const getMetricIcon = (context: string) => {
    switch (context) {
      case "acos":
        return <DollarSign className="h-4 w-4" />;
      case "ppc":
        return <MousePointer className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Real-Time Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Upload data to see intelligent insights and recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Real-Time Insights
          {isAnalyzing && <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm">Analyzing your data...</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  insight.type === "opportunity" && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
                  insight.type === "warning" && "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30",
                  insight.type === "success" && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
                  insight.type === "info" && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        {getInsightBadge(insight.impact)}
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      
                      {insight.metric && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {getMetricIcon(context)}
                            <span className="font-medium">{insight.metric.value}{insight.metric.unit}</span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1",
                            insight.metric.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          )}>
                            {insight.metric.change > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>{Math.abs(insight.metric.change)}{insight.metric.unit}</span>
                          </div>
                        </div>
                      )}

                      {insight.recommendation && (
                        <div className="rounded-md bg-background/50 p-3 text-sm">
                          <p className="font-medium mb-1">Recommendation:</p>
                          <p>{insight.recommendation}</p>
                          {insight.estimatedImpact && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Estimated impact: {insight.estimatedImpact}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {insight.actionable && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeInsights;