import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { PredictionResult as PredictionResultType } from "@/lib/prediction";

interface PredictionResultProps {
  result: PredictionResultType;
}

const PredictionResult = ({ result }: PredictionResultProps) => {
  const isPassing = result.prediction === 'Pass';
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Prediction Result</CardTitle>
            <CardDescription className="mt-1">
              USN: {result.usn} | Batch: {result.batch}
            </CardDescription>
          </div>
          {isPassing ? (
            <CheckCircle2 className="h-8 w-8 text-success" />
          ) : (
            <XCircle className="h-8 w-8 text-destructive" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prediction */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold" style={{ color: isPassing ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>
            {result.prediction}
          </div>
          <div className="text-sm text-muted-foreground">
            Confidence: {result.confidence}%
          </div>
          <Progress value={result.confidence} className="h-2" />
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className={
              result.riskLevel === 'Low' ? 'text-success' :
              result.riskLevel === 'Medium' ? 'text-accent' :
              'text-destructive'
            } />
            <span className="font-semibold">Risk Level</span>
          </div>
          <Badge variant={
            result.riskLevel === 'Low' ? 'default' :
            result.riskLevel === 'Medium' ? 'secondary' :
            'destructive'
          }>
            {result.riskLevel}
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="text-xs text-muted-foreground">Engagement Index</div>
            <div className="text-2xl font-bold text-foreground">{result.engagementIndex}/10</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-xs text-muted-foreground">Risk Score</div>
            <div className="text-2xl font-bold text-foreground">{result.riskScore}/100</div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Feature Importance</h4>
          {result.featureImportance.map((item) => (
            <div key={item.feature} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{item.feature}</span>
                <span className="font-medium text-foreground">{item.importance.toFixed(0)}%</span>
              </div>
              <Progress value={item.importance} className="h-1.5" />
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Recommendations</h4>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
