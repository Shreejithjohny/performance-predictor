/**
 * Application Constants
 * Contains all configuration values, magic numbers, and thresholds
 */

// Prediction algorithm weights
export const PREDICTION_WEIGHTS = {
  attendance: 0.35,
  internalMarks: 0.30,
  classParticipation: 0.15,
  engagement: 0.12,
  sports: 0.05,
  cultural: 0.03,
} as const;

// Risk assessment thresholds
export const RISK_THRESHOLDS = {
  passScore: 0.6,
  lowRiskMaxScore: 30,
  mediumRiskMaxScore: 60,
  lowAttendance: 75,
  lowMarks: 50,
  lowParticipation: 5,
  lowEngagement: 5,
  attendancePenalty: 20,
  marksPenalty: 15,
} as const;

// Input validation ranges
export const INPUT_RANGES = {
  attendance: { min: 0, max: 100 },
  internalMarks: { min: 0, max: 100 },
  culturalActivity: { min: 0, max: 10 },
  classParticipation: { min: 0, max: 10 },
  sportsActivity: { min: 0, max: 10 },
  curricularActivity: { min: 0, max: 10 },
} as const;

// Confidence calculation
export const CONFIDENCE_CONFIG = {
  passConfidenceBase: 50,
  passConfidenceMultiplier: 125,
  failConfidenceBase: 50,
  failConfidenceMultiplier: 125,
} as const;

// CSV Configuration
export const CSV_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxRecords: 10000, // Maximum records per upload
  expectedColumns: [
    'Attendance',
    'Internal Marks',
    'Cultural Activity',
    'Class Participation',
    'Sports Activity',
    'Curricular Activity',
  ],
  delimiter: ',',
} as const;

// Application routes
export const ROUTES = {
  HOME: '/',
  PREDICT: '/predict',
  UPLOAD: '/upload',
  ANALYTICS: '/analytics',
  NOT_FOUND: '*',
} as const;

// UI/UX Constants
export const UI_CONFIG = {
  toastDuration: 3000,
  debounceDelay: 300,
  animationDuration: 300,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  invalidInput: 'Please provide valid input values',
  fileUploadError: 'Error uploading file. Please try again.',
  invalidCSV: 'Invalid CSV format. Please check the file.',
  missingColumns: 'CSV is missing required columns',
  invalidDataType: 'Invalid data type in CSV',
  fileTooLarge: 'File size exceeds 5MB limit',
  noPredictions: 'No predictions could be generated',
  unknownError: 'An unexpected error occurred',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  predictionSuccess: 'Prediction generated successfully',
  uploadSuccess: (count: number) => `Successfully processed ${count} student(s)`,
  downloadSuccess: 'Results downloaded successfully',
} as const;
