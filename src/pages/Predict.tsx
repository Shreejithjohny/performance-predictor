import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { predictStudent } from "@/lib/prediction";
import PredictionResult from "@/components/PredictionResult";

const Predict = () => {
  const [formData, setFormData] = useState({
    attendance: "",
    internalMarks: "",
    culturalActivity: "",
    classParticipation: "",
    sportsActivity: "",
    curricularActivity: "",
  });
  
  const [result, setResult] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prediction = predictStudent({
      attendance: parseFloat(formData.attendance),
      internalMarks: parseFloat(formData.internalMarks),
      culturalActivity: parseFloat(formData.culturalActivity),
      classParticipation: parseFloat(formData.classParticipation),
      sportsActivity: parseFloat(formData.sportsActivity),
      curricularActivity: parseFloat(formData.curricularActivity),
    });
    setResult(prediction);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">EduPredict</h1>
          </div>
          <nav className="flex gap-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/upload">
              <Button variant="ghost">Upload</Button>
            </Link>
            <Link to="/analytics">
              <Button variant="ghost">Analytics</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Student Data Input</CardTitle>
              <CardDescription>
                Enter student information to predict academic performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="attendance">Attendance Percentage (0-100)</Label>
                  <Input
                    id="attendance"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                    value={formData.attendance}
                    onChange={(e) => handleChange("attendance", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internalMarks">Internal Marks Average (0-100)</Label>
                  <Input
                    id="internalMarks"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                    value={formData.internalMarks}
                    onChange={(e) => handleChange("internalMarks", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culturalActivity">Cultural Activity Score (0-10)</Label>
                  <Input
                    id="culturalActivity"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    value={formData.culturalActivity}
                    onChange={(e) => handleChange("culturalActivity", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classParticipation">Class Participation Score (0-10)</Label>
                  <Input
                    id="classParticipation"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    value={formData.classParticipation}
                    onChange={(e) => handleChange("classParticipation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sportsActivity">Sports Activity Score (0-10)</Label>
                  <Input
                    id="sportsActivity"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    value={formData.sportsActivity}
                    onChange={(e) => handleChange("sportsActivity", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curricularActivity">Curricular Activity Score (0-10)</Label>
                  <Input
                    id="curricularActivity"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    value={formData.curricularActivity}
                    onChange={(e) => handleChange("curricularActivity", e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Predict Performance
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && <PredictionResult result={result} />}
        </div>
      </div>
    </div>
  );
};

export default Predict;
