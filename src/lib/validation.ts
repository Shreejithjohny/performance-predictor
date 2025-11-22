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

// Student metadata schema
export const studentMetadataSchema = z.object({
  usn: z.string().min(8, 'USN must be at least 8 characters').max(20, 'USN cannot exceed 20 characters'),
  batch: z.string().min(2, 'Batch must be specified'),
});

// Student data schema for prediction
export const studentDataSchema = z.object({
  usn: z.string().min(8, 'USN must be at least 8 characters').max(20, 'USN cannot exceed 20 characters'),
  batch: z.string().min(2, 'Batch must be specified'),
  attendance: attendanceSchema,
  internalMarks: marksSchema,
  culturalActivity: activitySchema,
  classParticipation: activitySchema,
  sportsActivity: activitySchema,
  curricularActivity: activitySchema,
});

export type StudentDataType = z.infer<typeof studentDataSchema>;

// CSV row schema (for batch upload)
export const csvRowSchema = z.object({
  usn: z.string().optional(),
  batch: z.string().optional(),
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
 * @param csvLine - CSV line as string
 * @returns Discriminated union with parsed data or error
 */
export const parseCSVRow = (csvLine: string) => {
  try {
    // Split CSV line by comma and trim whitespace
    const values = csvLine.split(',').map(v => v.trim());

    // Ensure we have at least 6 values (or more if USN and Batch are included)
    if (values.length < 6) {
      return {
        success: false,
        error: `Expected at least 6 columns, got ${values.length}`,
      };
    }

    // Parse with optional USN and Batch at the beginning
    let usn = '';
    let batch = '';
    let startIndex = 0;

    // If first column looks like USN (alphanumeric, 8+ chars), treat it as USN
    if (values[0]?.length >= 8 && /^[A-Z0-9]{8,}$/.test(values[0])) {
      usn = values[0];
      startIndex = 1;

      // If second column looks like batch, treat it as batch
      if (values[1]?.length >= 2 && /^[0-9]{1,2}[A-Z]{2,3}$/.test(values[1])) {
        batch = values[1];
        startIndex = 2;
      }
    }

    // Get metrics starting from startIndex
    const metricsValues = values.slice(startIndex, startIndex + 6);

    if (metricsValues.length !== 6) {
      return {
        success: false,
        error: `Expected 6 metric columns, got ${metricsValues.length}`,
      };
    }

    // Parse string values to numbers
    const parsed = {
      usn: usn || `AUTO-${Date.now()}`,
      batch: batch || 'Unknown',
      attendance: parseFloat(metricsValues[0]),
      internalMarks: parseFloat(metricsValues[1]),
      culturalActivity: parseFloat(metricsValues[2]),
      classParticipation: parseFloat(metricsValues[3]),
      sportsActivity: parseFloat(metricsValues[4]),
      curricularActivity: parseFloat(metricsValues[5]),
    };

    // Check for NaN values
    if ([parsed.attendance, parsed.internalMarks, parsed.culturalActivity, 
         parsed.classParticipation, parsed.sportsActivity, parsed.curricularActivity]
        .some(v => isNaN(v))) {
      return {
        success: false,
        error: 'All metric columns must contain valid numbers',
      };
    }

    // Validate using schema
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
