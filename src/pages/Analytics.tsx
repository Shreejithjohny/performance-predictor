import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Header } from "@/components/Header";
import { ROUTES } from "@/lib/constants";

const performanceData = [
  { name: 'High Performers', value: 342, fill: 'hsl(var(--success))' },
  { name: 'Average', value: 722, fill: 'hsl(var(--primary))' },
  { name: 'At Risk', value: 183, fill: 'hsl(var(--accent))' },
];

const featureImportance = [
  { feature: 'Attendance', importance: 35 },
  { feature: 'Internal Marks', importance: 30 },
  { feature: 'Class Participation', importance: 15 },
  { feature: 'Engagement Index', importance: 12 },
  { feature: 'Sports Activity', importance: 5 },
  { feature: 'Cultural Activity', importance: 3 },
];

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <Header activePath={ROUTES.ANALYTICS} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-foreground">Analytics Dashboard</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Student Distribution</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Performance categorization across cohort</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Feature Importance</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Factors influencing predictions</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="importance" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Key Insights</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Model performance and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">Model Accuracy</div>
                  <div className="text-xl sm:text-2xl font-bold text-success">94.2%</div>
                  <div className="text-xs text-muted-foreground mt-1">Validated on test set</div>
                </div>
                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">Early Detection Rate</div>
                  <div className="text-xl sm:text-2xl font-bold text-primary">87.5%</div>
                  <div className="text-xs text-muted-foreground mt-1">At-risk students identified</div>
                </div>
                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">Intervention Success</div>
                  <div className="text-xl sm:text-2xl font-bold text-secondary">76.3%</div>
                  <div className="text-xs text-muted-foreground mt-1">Improved after support</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm sm:text-base text-foreground">Top Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-muted-foreground">
                  <li>Focus on attendance improvement programs - highest impact factor (35%)</li>
                  <li>Implement early warning systems for students below 75% attendance</li>
                  <li>Strengthen class participation through interactive sessions</li>
                  <li>Provide academic support for students scoring below 70% in internals</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
