import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { predictStudent, StudentData, PredictionResult } from "@/lib/prediction";
import PredictionResultDisplay from "@/components/PredictionResult";
import { studentDataSchema } from "@/lib/validation";
import { ROUTES } from "@/lib/constants";

const Predict = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<StudentData>({
    resolver: zodResolver(studentDataSchema),
    mode: "onBlur",
    defaultValues: {
      attendance: 0,
      internalMarks: 0,
      culturalActivity: 0,
      classParticipation: 0,
      sportsActivity: 0,
      curricularActivity: 0,
    },
  });

  const onSubmit = async (data: StudentData) => {
    try {
      setIsLoading(true);
      setGeneralError("");

      // Note: validation already happened via zodResolver in useForm
      // Simulate processing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const prediction = predictStudent(data);
      setResult(prediction);
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "An error occurred while making the prediction"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setGeneralError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <Header activePath={ROUTES.PREDICT} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Student Data Input</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Enter student information to predict academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              {generalError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                {/* Attendance */}
                <div className="space-y-2">
                  <Label htmlFor="attendance" className="text-xs sm:text-sm">Attendance Percentage (0-100)</Label>
                  <Controller
                    name="attendance"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="attendance"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0-100"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={`text-sm ${errors.attendance ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.attendance && (
                    <p className="text-xs text-red-500">{errors.attendance.message}</p>
                  )}
                </div>

                {/* Internal Marks */}
                <div className="space-y-2">
                  <Label htmlFor="internalMarks" className="text-xs sm:text-sm">Internal Marks Average (0-100)</Label>
                  <Controller
                    name="internalMarks"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="internalMarks"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0-100"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={`text-sm ${errors.internalMarks ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.internalMarks && (
                    <p className="text-xs text-red-500">{errors.internalMarks.message}</p>
                  )}
                </div>

                {/* Class Participation */}
                <div className="space-y-2">
                  <Label htmlFor="classParticipation" className="text-xs sm:text-sm">Class Participation Score (0-10)</Label>
                  <Controller
                    name="classParticipation"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="classParticipation"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0-10"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={`text-sm ${errors.classParticipation ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.classParticipation && (
                    <p className="text-xs text-red-500">{errors.classParticipation.message}</p>
                  )}
                </div>

                {/* Cultural Activity */}
                <div className="space-y-2">
                  <Label htmlFor="culturalActivity" className="text-xs sm:text-sm">Cultural Activity Score (0-10)</Label>
                  <Controller
                    name="culturalActivity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="culturalActivity"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0-10"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={`text-sm ${errors.culturalActivity ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.culturalActivity && (
                    <p className="text-xs text-red-500">{errors.culturalActivity.message}</p>
                  )}
                </div>

                {/* Sports Activity */}
                <div className="space-y-2">
                  <Label htmlFor="sportsActivity" className="text-xs sm:text-sm">Sports Activity Score (0-10)</Label>
                  <Controller
                    name="sportsActivity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="sportsActivity"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0-10"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={`text-sm ${errors.sportsActivity ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.sportsActivity && (
                    <p className="text-xs text-red-500">{errors.sportsActivity.message}</p>
                  )}
                </div>

                {/* Curricular Activity */}
                <div className="space-y-2">
                  <Label htmlFor="curricularActivity" className="text-xs sm:text-sm">Curricular Activity Score (0-10)</Label>
                  <Controller
                    name="curricularActivity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="curricularActivity"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0-10"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={`text-sm ${errors.curricularActivity ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.curricularActivity && (
                    <p className="text-xs text-red-500">{errors.curricularActivity.message}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button type="submit" className="flex-1 text-sm sm:text-base" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      "Predict Performance"
                    )}
                  </Button>
                  {result && (
                    <Button variant="outline" onClick={handleReset} disabled={isLoading} className="text-sm sm:text-base">
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Prediction Complete</AlertTitle>
                <AlertDescription className="text-green-700">
                  The analysis has been completed successfully.
                </AlertDescription>
              </Alert>
              <PredictionResultDisplay result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;
