import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload as UploadIcon, Download, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { predictStudent, PredictionResult, StudentData } from "@/lib/prediction";
import { parseCSVRow, validateStudentData } from "@/lib/validation";
import { CSV_CONFIG, ROUTES } from "@/lib/constants";

interface PredictionWithStudent extends StudentData {
  studentId: number;
  prediction: PredictionResult['prediction'];
  confidence: PredictionResult['confidence'];
  riskLevel: PredictionResult['riskLevel'];
  engagementIndex: PredictionResult['engagementIndex'];
  riskScore: PredictionResult['riskScore'];
}

const Upload = () => {
  const [predictions, setPredictions] = useState<PredictionWithStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [processedCount, setProcessedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setUploadError("");
      setUploadSuccess("");
      setPredictions([]);
      setProcessedCount(0);
      setFailedCount(0);
      setProgress(0);

      // Validate file size
      if (file.size > CSV_CONFIG.maxFileSize) {
        setUploadError(
          `File size exceeds limit. Maximum: ${CSV_CONFIG.maxFileSize / (1024 * 1024)}MB`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const csv = event.target?.result as string;
          const lines = csv.split("\n").filter((line) => line.trim());

          if (lines.length < 2) {
            setUploadError("CSV file must contain at least headers and one data row");
            return;
          }

          const results = [];
          let processed = 0;
          let failed = 0;

          // Skip header and process data rows
          for (let i = 1; i < lines.length; i++) {
            try {
              // Update progress
              setProgress(Math.round((i / (lines.length - 1)) * 100));

              // Parse CSV row (now accepts string)
              const parseResult = parseCSVRow(lines[i]);
              if (!parseResult.success) {
                console.warn(`Row ${i}: ${parseResult.error}`);
                failed++;
                continue;
              }

              // Note: Validation already done in parseCSVRow
              // But validateStudentData can do additional checks
              const validationResult = validateStudentData(parseResult.data);
              if (!validationResult.success) {
                console.warn(`Row ${i}: ${validationResult.error}`);
                failed++;
                continue;
              }

              // Make prediction
              const prediction = predictStudent(validationResult.data);
              results.push({
                studentId: i,
                ...validationResult.data,
                ...prediction,
              });
              processed++;

              // Respect max records limit
              if (processed >= CSV_CONFIG.maxRecords) {
                setUploadError(
                  `Processing limited to ${CSV_CONFIG.maxRecords} records. Remaining rows ignored.`
                );
                break;
              }
            } catch (rowError) {
              console.error(`Error processing row ${i}:`, rowError);
              failed++;
              continue;
            }
          }

          if (results.length === 0) {
            setUploadError("No valid records found in the CSV file. Please check the data format.");
            setFailedCount(failed);
            return;
          }

          setPredictions(results);
          setProcessedCount(processed);
          setFailedCount(failed);
          setProgress(100);
          setUploadSuccess(
            `Successfully processed ${processed} students${failed > 0 ? ` (${failed} records had errors)` : ""}`
          );

          toast({
            title: "Upload Successful",
            description: `Processed ${processed} students`,
          });
        } catch (parseError) {
          setUploadError(
            `Failed to parse CSV: ${parseError instanceof Error ? parseError.message : "Unknown error"}`
          );
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsText(file);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "An error occurred during file upload");
      setIsLoading(false);
    }
  };

  const downloadResults = () => {
    const csvContent = [
      "Student ID,Attendance,Internal Marks,Cultural,Class Part.,Sports,Curricular,Prediction,Confidence,Risk Level",
      ...predictions.map(
        (p) =>
          `${p.studentId},${p.attendance},${p.internalMarks},${p.culturalActivity},${p.classParticipation},${p.sportsActivity},${p.curricularActivity},${p.prediction},${p.confidence}%,${p.riskLevel}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "predictions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const template =
      "Attendance,Internal Marks,Cultural Activity,Class Participation,Sports Activity,Curricular Activity\n85,78,7,8,6,9\n92,88,9,10,8,7";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <Header activePath={ROUTES.UPLOAD} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Bulk Upload</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Upload a CSV file with student data for batch predictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-sm sm:text-base">Error</AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm">{uploadError}</AlertDescription>
                </Alert>
              )}

              {uploadSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 text-sm sm:text-base">Success</AlertTitle>
                  <AlertDescription className="text-green-700 text-xs sm:text-sm">{uploadSuccess}</AlertDescription>
                </Alert>
              )}

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                    <span>Processing file... {progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-wrap">
                <Button variant="outline" onClick={downloadTemplate} disabled={isLoading} className="w-full sm:w-auto text-xs sm:text-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
                <label htmlFor="file-upload" className="w-full sm:w-auto">
                  <Button asChild disabled={isLoading} className="w-full text-xs sm:text-sm">
                    <span>
                      <UploadIcon className="mr-2 h-4 w-4" />
                      {isLoading ? "Uploading..." : "Upload CSV"}
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </div>

              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                <p>• Maximum file size: {CSV_CONFIG.maxFileSize / (1024 * 1024)}MB</p>
                <p>• Maximum records: {CSV_CONFIG.maxRecords}</p>
                <p>• Accepted format: CSV with headers in first row</p>
              </div>
            </CardContent>
          </Card>

          {predictions.length > 0 && (
            <Card>
              <CardHeader className="flex-col sm:flex-row">
                <div className="flex-1">
                  <CardTitle className="text-base sm:text-lg">Results ({predictions.length} students)</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Prediction results for uploaded cohort
                    {failedCount > 0 && ` (${failedCount} records failed validation)`}
                  </CardDescription>
                </div>
                <Button onClick={downloadResults} className="mt-4 sm:mt-0 w-full sm:w-auto text-xs sm:text-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download Results
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="border-b bg-gray-50">
                      <tr className="text-left">
                        <th className="pb-3 px-2 font-semibold">ID</th>
                        <th className="pb-3 px-2 font-semibold">Attendance</th>
                        <th className="pb-3 px-2 font-semibold">Marks</th>
                        <th className="pb-3 px-2 font-semibold">Prediction</th>
                        <th className="pb-3 px-2 font-semibold">Confidence</th>
                        <th className="pb-3 px-2 font-semibold">Risk</th>
                        <th className="pb-3 px-2 font-semibold">Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((p) => (
                        <tr key={p.studentId} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">{p.studentId}</td>
                          <td className="py-3 px-2">{p.attendance.toFixed(1)}%</td>
                          <td className="py-3 px-2">{p.internalMarks.toFixed(1)}</td>
                          <td className="py-3 px-2">
                            <span
                              className={
                                p.prediction === "Pass"
                                  ? "font-semibold text-green-600"
                                  : "font-semibold text-red-600"
                              }
                            >
                              {p.prediction}
                            </span>
                          </td>
                          <td className="py-3 px-2">{p.confidence}%</td>
                          <td className="py-3 px-2">
                            <span
                              className={
                                p.riskLevel === "Low"
                                  ? "text-green-600 font-medium"
                                  : p.riskLevel === "Medium"
                                    ? "text-yellow-600 font-medium"
                                    : "text-red-600 font-medium"
                              }
                            >
                              {p.riskLevel}
                            </span>
                          </td>
                          <td className="py-3 px-2">{p.engagementIndex.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-600">Total Students</p>
                      <p className="text-xl sm:text-2xl font-bold">{predictions.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pass Rate</p>
                      <p className="text-xl sm:text-2xl font-bold">
                        {Math.round((predictions.filter((p) => p.prediction === "Pass").length / predictions.length) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Confidence</p>
                      <p className="text-xl sm:text-2xl font-bold">
                        {Math.round(predictions.reduce((a, p) => a + p.confidence, 0) / predictions.length)}%
                      </p>
                    </div>
                  </div>
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
