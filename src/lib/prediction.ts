export interface StudentData {
  attendance: number;
  internalMarks: number;
  culturalActivity: number;
  classParticipation: number;
  sportsActivity: number;
  curricularActivity: number;
}

export interface PredictionResult {
  prediction: 'Pass' | 'Fail';
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  engagementIndex: number;
  riskScore: number;
  featureImportance: {
    feature: string;
    value: number;
    importance: number;
  }[];
  recommendations: string[];
}

export const predictStudent = (data: StudentData): PredictionResult => {
  // Calculate engagement index
  const engagementIndex = (
    data.culturalActivity +
    data.classParticipation +
    data.sportsActivity +
    data.curricularActivity
  ) / 4;

  // Calculate weighted score (simulating RandomForest prediction)
  const weights = {
    attendance: 0.35,
    internalMarks: 0.30,
    classParticipation: 0.15,
    engagement: 0.12,
    sports: 0.05,
    cultural: 0.03,
  };

  const normalizedScore = (
    (data.attendance / 100) * weights.attendance +
    (data.internalMarks / 100) * weights.internalMarks +
    (data.classParticipation / 10) * weights.classParticipation +
    (engagementIndex / 10) * weights.engagement +
    (data.sportsActivity / 10) * weights.sports +
    (data.culturalActivity / 10) * weights.cultural
  );

  // Prediction and confidence
  const prediction: 'Pass' | 'Fail' = normalizedScore >= 0.6 ? 'Pass' : 'Fail';
  const confidence = Math.round(
    prediction === 'Pass'
      ? 50 + (normalizedScore - 0.6) * 125
      : 50 + (0.6 - normalizedScore) * 125
  );

  // Risk score calculation
  const riskScore = Math.round(
    (1 - normalizedScore) * 100 +
    (data.attendance < 75 ? 20 : 0) +
    (data.internalMarks < 50 ? 15 : 0)
  );

  // Risk level
  const riskLevel: 'Low' | 'Medium' | 'High' =
    riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : 'High';

  // Feature importance
  const featureImportance = [
    { feature: 'Attendance', value: data.attendance, importance: weights.attendance * 100 },
    { feature: 'Internal Marks', value: data.internalMarks, importance: weights.internalMarks * 100 },
    { feature: 'Class Participation', value: data.classParticipation, importance: weights.classParticipation * 100 },
    { feature: 'Engagement Index', value: engagementIndex, importance: weights.engagement * 100 },
    { feature: 'Sports Activity', value: data.sportsActivity, importance: weights.sports * 100 },
    { feature: 'Cultural Activity', value: data.culturalActivity, importance: weights.cultural * 100 },
  ].sort((a, b) => b.importance - a.importance);

  // Recommendations
  const recommendations: string[] = [];
  if (data.attendance < 75) {
    recommendations.push('Critical: Improve attendance - current rate is below threshold');
  }
  if (data.internalMarks < 60) {
    recommendations.push('Provide academic support and tutoring for core subjects');
  }
  if (data.classParticipation < 5) {
    recommendations.push('Encourage active class participation through interactive sessions');
  }
  if (engagementIndex < 5) {
    recommendations.push('Increase engagement through extracurricular activities');
  }
  if (prediction === 'Pass' && riskLevel === 'Low') {
    recommendations.push('Maintain current performance with regular monitoring');
  }
  if (recommendations.length === 0) {
    recommendations.push('Continue with balanced academic and extracurricular focus');
  }

  return {
    prediction,
    confidence,
    riskLevel,
    engagementIndex: Math.round(engagementIndex * 10) / 10,
    riskScore,
    featureImportance,
    recommendations,
  };
};
