/**
 * ⚙️ BACKEND: Data Validation
 * 
 * This file contains validation schemas and parsing logic.
 * Validates all student data before processing.
 * 
 * Can be moved to Node.js backend as middleware when scaling up.
 */

import { z } from 'zod';
import { INPUT_RANGES } from './constants';

/**
 * Zod validation schemas for student data and forms
 */

// Individual field schemas
export const attendanceSchema = z
  .number()
  .min(INPUT_RANGES.attendance.min, 'Attendance must be at least 0')
  .max(INPUT_RANGES.attendance.max, 'Attendance cannot exceed 100')
  .or(z.string().pipe(z.coerce.number()));

export const marksSchema = z
  .number()
  .min(INPUT_RANGES.internalMarks.min, 'Marks must be at least 0')
  .max(INPUT_RANGES.internalMarks.max, 'Marks cannot exceed 100')
  .or(z.string().pipe(z.coerce.number()));

export const activitySchema = z
  .number()
  .min(INPUT_RANGES.culturalActivity.min, 'Activity score must be at least 0')
  .max(INPUT_RANGES.culturalActivity.max, 'Activity score cannot exceed 10')
  .or(z.string().pipe(z.coerce.number()));

// Student data schema for prediction
export const studentDataSchema = z.object({
  attendance: attendanceSchema,
  internalMarks: marksSchema,
  culturalActivity: activitySchema,
  classParticipation: activitySchema,
  sportsActivity: activitySchema,
  curricularActivity: activitySchema,
});

export type StudentDataType = z.infer<typeof studentDataSchema>;

// CSV row schema
export const csvRowSchema = z.object({
  attendance: z.union([z.number(), z.string()]),
  internalMarks: z.union([z.number(), z.string()]),
  culturalActivity: z.union([z.number(), z.string()]),
  classParticipation: z.union([z.number(), z.string()]),
  sportsActivity: z.union([z.number(), z.string()]),
  curricularActivity: z.union([z.number(), z.string()]),
});

/**
 * Safely parse and validate student data
 * @returns Discriminated union with success flag and data/error
 */
export const validateStudentData = (data: unknown) => {
  try {
    const validated = studentDataSchema.parse(data);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return {
        success: false,
        error: message,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    };
  }
};

/**
 * Parse CSV row string and validate
 * @param csvLine - CSV line as string (e.g., "85,78,7,8,6,9")
 * @returns Discriminated union with parsed data or error
 */
export const parseCSVRow = (csvLine: string) => {
  try {
    // Split CSV line by comma and trim whitespace
    const values = csvLine.split(',').map(v => v.trim());

    // Ensure we have exactly 6 values
    if (values.length !== 6) {
      return {
        success: false,
        error: `Expected 6 columns, got ${values.length}`,
      };
    }

    // Parse string values to numbers
    const parsed = {
      attendance: parseFloat(values[0]),
      internalMarks: parseFloat(values[1]),
      culturalActivity: parseFloat(values[2]),
      classParticipation: parseFloat(values[3]),
      sportsActivity: parseFloat(values[4]),
      curricularActivity: parseFloat(values[5]),
    };

    // Check for NaN values
    if (Object.values(parsed).some(v => isNaN(v))) {
      return {
        success: false,
        error: 'All columns must contain valid numbers',
      };
    }

    // Validate ranges using schema
    const validated = studentDataSchema.parse(parsed);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Invalid CSV row',
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse row',
    };
  }
};
