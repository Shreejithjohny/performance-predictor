import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Upload as UploadIcon, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { predictStudent } from "@/lib/prediction";

const Upload = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const results = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const studentData = {
          attendance: parseFloat(values[0]),
          internalMarks: parseFloat(values[1]),
          culturalActivity: parseFloat(values[2]),
          classParticipation: parseFloat(values[3]),
          sportsActivity: parseFloat(values[4]),
          curricularActivity: parseFloat(values[5]),
        };
        
        const prediction = predictStudent(studentData);
        results.push({ studentId: i, ...studentData, ...prediction });
      }
      
      setPredictions(results);
      toast({
        title: "Upload Successful",
        description: `Processed ${results.length} students`,
      });
    };
    
    reader.readAsText(file);
  };

  const downloadResults = () => {
    const csvContent = [
      'Student ID,Attendance,Internal Marks,Cultural,Class Part.,Sports,Curricular,Prediction,Confidence,Risk Level',
      ...predictions.map(p => 
        `${p.studentId},${p.attendance},${p.internalMarks},${p.culturalActivity},${p.classParticipation},${p.sportsActivity},${p.curricularActivity},${p.prediction},${p.confidence}%,${p.riskLevel}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predictions.csv';
    a.click();
  };

  const downloadTemplate = () => {
    const template = 'Attendance,Internal Marks,Cultural Activity,Class Participation,Sports Activity,Curricular Activity\n85,78,7,8,6,9\n92,88,9,10,8,7';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.csv';
    a.click();
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
            <Link to="/predict">
              <Button variant="ghost">Predict</Button>
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

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload</CardTitle>
              <CardDescription>
                Upload a CSV file with student data for batch predictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload CSV
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </CardContent>
          </Card>

          {predictions.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Results ({predictions.length} students)</CardTitle>
                    <CardDescription>Prediction results for uploaded cohort</CardDescription>
                  </div>
                  <Button onClick={downloadResults}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Results
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="pb-2 font-semibold">ID</th>
                        <th className="pb-2 font-semibold">Attendance</th>
                        <th className="pb-2 font-semibold">Marks</th>
                        <th className="pb-2 font-semibold">Prediction</th>
                        <th className="pb-2 font-semibold">Confidence</th>
                        <th className="pb-2 font-semibold">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((p) => (
                        <tr key={p.studentId} className="border-b">
                          <td className="py-2">{p.studentId}</td>
                          <td className="py-2">{p.attendance}%</td>
                          <td className="py-2">{p.internalMarks}</td>
                          <td className="py-2">
                            <span className={p.prediction === 'Pass' ? 'text-success font-semibold' : 'text-destructive font-semibold'}>
                              {p.prediction}
                            </span>
                          </td>
                          <td className="py-2">{p.confidence}%</td>
                          <td className="py-2">
                            <span className={
                              p.riskLevel === 'Low' ? 'text-success' :
                              p.riskLevel === 'Medium' ? 'text-accent' :
                              'text-destructive'
                            }>
                              {p.riskLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
