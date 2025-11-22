/**
 * ⚙️ BACKEND: Prediction Algorithm
 * 
 * This file contains the core ML prediction algorithm.
 * It processes student data and generates performance predictions.
 * 
 * Can be moved to Node.js backend as-is when scaling up.
 */

import { PREDICTION_WEIGHTS, RISK_THRESHOLDS, CONFIDENCE_CONFIG } from './constants';

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

/**
 * Predict student performance based on various factors
 * Uses weighted scoring to simulate ML prediction
 * @param data Student engagement and performance data
 * @returns Prediction result with confidence and recommendations
 */
export const predictStudent = (data: StudentData): PredictionResult => {
  // Calculate engagement index
  const engagementIndex = (
    data.culturalActivity +
    data.classParticipation +
    data.sportsActivity +
    data.curricularActivity
  ) / 4;

  // Calculate weighted score (simulating RandomForest prediction)
  const normalizedScore = (
    (data.attendance / 100) * PREDICTION_WEIGHTS.attendance +
    (data.internalMarks / 100) * PREDICTION_WEIGHTS.internalMarks +
    (data.classParticipation / 10) * PREDICTION_WEIGHTS.classParticipation +
    (engagementIndex / 10) * PREDICTION_WEIGHTS.engagement +
    (data.sportsActivity / 10) * PREDICTION_WEIGHTS.sports +
    (data.culturalActivity / 10) * PREDICTION_WEIGHTS.cultural
  );

  // Prediction and confidence
  const prediction: 'Pass' | 'Fail' = normalizedScore >= RISK_THRESHOLDS.passScore ? 'Pass' : 'Fail';
  const confidence = Math.round(
    prediction === 'Pass'
      ? CONFIDENCE_CONFIG.passConfidenceBase + (normalizedScore - RISK_THRESHOLDS.passScore) * CONFIDENCE_CONFIG.passConfidenceMultiplier
      : CONFIDENCE_CONFIG.failConfidenceBase + (RISK_THRESHOLDS.passScore - normalizedScore) * CONFIDENCE_CONFIG.failConfidenceMultiplier
  );

  // Risk score calculation
  const riskScore = Math.round(
    (1 - normalizedScore) * 100 +
    (data.attendance < RISK_THRESHOLDS.lowAttendance ? RISK_THRESHOLDS.attendancePenalty : 0) +
    (data.internalMarks < RISK_THRESHOLDS.lowMarks ? RISK_THRESHOLDS.marksPenalty : 0)
  );

  // Risk level
  const riskLevel: 'Low' | 'Medium' | 'High' =
    riskScore < RISK_THRESHOLDS.lowRiskMaxScore 
      ? 'Low' 
      : riskScore < RISK_THRESHOLDS.mediumRiskMaxScore 
      ? 'Medium' 
      : 'High';

  // Feature importance
  const featureImportance = [
    { feature: 'Attendance', value: data.attendance, importance: PREDICTION_WEIGHTS.attendance * 100 },
    { feature: 'Internal Marks', value: data.internalMarks, importance: PREDICTION_WEIGHTS.internalMarks * 100 },
    { feature: 'Class Participation', value: data.classParticipation, importance: PREDICTION_WEIGHTS.classParticipation * 100 },
    { feature: 'Engagement Index', value: engagementIndex, importance: PREDICTION_WEIGHTS.engagement * 100 },
    { feature: 'Sports Activity', value: data.sportsActivity, importance: PREDICTION_WEIGHTS.sports * 100 },
    { feature: 'Cultural Activity', value: data.culturalActivity, importance: PREDICTION_WEIGHTS.cultural * 100 },
  ].sort((a, b) => b.importance - a.importance);

  // Recommendations
  const recommendations: string[] = [];
  if (data.attendance < RISK_THRESHOLDS.lowAttendance) {
    recommendations.push('Critical: Improve attendance - current rate is below threshold');
  }
  if (data.internalMarks < 60) {
    recommendations.push('Provide academic support and tutoring for core subjects');
  }
  if (data.classParticipation < RISK_THRESHOLDS.lowParticipation) {
    recommendations.push('Encourage active class participation through interactive sessions');
  }
  if (engagementIndex < RISK_THRESHOLDS.lowEngagement) {
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
    confidence: Math.min(Math.max(confidence, 0), 100), // Clamp between 0-100
    riskLevel,
    engagementIndex: Math.round(engagementIndex * 10) / 10,
    riskScore,
    featureImportance,
    recommendations,
  };
};
