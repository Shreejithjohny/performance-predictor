/**
 * ⚙️ BACKEND: Analytics Engine
 * 
 * This file contains functions to aggregate student predictions
 * by college, year, semester, and branch.
 * 
 * Supports hierarchical drilldown analytics.
 */

export type Branch = 'ISE' | 'CSE' | 'MECH' | 'CV' | 'EC' | 'EEE' | 'IM' | 'AIML' | 'CSBS';
export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Year = 1 | 2 | 3 | 4;

export interface StudentRecord {
  studentId: string;
  name: string;
  year: Year;
  semester: Semester;
  branch: Branch;
  attendance: number;
  internalMarks: number;
  classParticipation: number;
  culturalActivity: number;
  sportsActivity: number;
  curricularActivity: number;
  prediction: 'Pass' | 'Fail';
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  engagementIndex: number;
  riskScore: number;
}

export interface AnalyticsMetrics {
  totalStudents: number;
  passCount: number;
  failCount: number;
  passPercentage: number;
  avgConfidence: number;
  avgAttendance: number;
  avgMarks: number;
  avgEngagement: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface CollegeAnalytics extends AnalyticsMetrics {
  type: 'college';
  yearBreakdown: YearAnalytics[];
}

export interface YearAnalytics extends AnalyticsMetrics {
  type: 'year';
  year: Year;
  semesterBreakdown: SemesterAnalytics[];
}

export interface SemesterAnalytics extends AnalyticsMetrics {
  type: 'semester';
  year: Year;
  semester: Semester;
  branchBreakdown: BranchAnalytics[];
}

export interface BranchAnalytics extends AnalyticsMetrics {
  type: 'branch';
  branch: Branch;
  year: Year;
  semester: Semester;
}

/**
 * Calculate metrics from an array of student records
 */
export const calculateMetrics = (students: StudentRecord[]): AnalyticsMetrics => {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      passCount: 0,
      failCount: 0,
      passPercentage: 0,
      avgConfidence: 0,
      avgAttendance: 0,
      avgMarks: 0,
      avgEngagement: 0,
      lowRiskCount: 0,
      mediumRiskCount: 0,
      highRiskCount: 0,
      riskDistribution: { low: 0, medium: 0, high: 0 },
    };
  }

  const passCount = students.filter((s) => s.prediction === 'Pass').length;
  const failCount = students.length - passCount;
  const lowRiskCount = students.filter((s) => s.riskLevel === 'Low').length;
  const mediumRiskCount = students.filter((s) => s.riskLevel === 'Medium').length;
  const highRiskCount = students.filter((s) => s.riskLevel === 'High').length;

  return {
    totalStudents: students.length,
    passCount,
    failCount,
    passPercentage: Math.round((passCount / students.length) * 100),
    avgConfidence: Math.round(
      students.reduce((sum, s) => sum + s.confidence, 0) / students.length
    ),
    avgAttendance: Math.round(
      students.reduce((sum, s) => sum + s.attendance, 0) / students.length
    ),
    avgMarks: Math.round(
      students.reduce((sum, s) => sum + s.internalMarks, 0) / students.length
    ),
    avgEngagement: Math.round(
      (students.reduce((sum, s) => sum + s.engagementIndex, 0) / students.length) * 10
    ) / 10,
    lowRiskCount,
    mediumRiskCount,
    highRiskCount,
    riskDistribution: {
      low: Math.round((lowRiskCount / students.length) * 100),
      medium: Math.round((mediumRiskCount / students.length) * 100),
      high: Math.round((highRiskCount / students.length) * 100),
    },
  };
};

/**
 * Build hierarchical analytics for entire college
 */
export const buildCollegeAnalytics = (
  students: StudentRecord[]
): CollegeAnalytics => {
  const collegeMetrics = calculateMetrics(students);

  // Group by year
  const yearGroups = new Map<Year, StudentRecord[]>();
  students.forEach((student) => {
    if (!yearGroups.has(student.year)) {
      yearGroups.set(student.year, []);
    }
    yearGroups.get(student.year)!.push(student);
  });

  // Build year analytics
  const yearBreakdown: YearAnalytics[] = [];
  yearGroups.forEach((yearStudents, year) => {
    const yearMetrics = calculateMetrics(yearStudents);

    // Group by semester
    const semesterGroups = new Map<Semester, StudentRecord[]>();
    yearStudents.forEach((student) => {
      if (!semesterGroups.has(student.semester)) {
        semesterGroups.set(student.semester, []);
      }
      semesterGroups.get(student.semester)!.push(student);
    });

    // Build semester analytics
    const semesterBreakdown: SemesterAnalytics[] = [];
    semesterGroups.forEach((semStudents, semester) => {
      const semMetrics = calculateMetrics(semStudents);

      // Group by branch
      const branchGroups = new Map<Branch, StudentRecord[]>();
      semStudents.forEach((student) => {
        if (!branchGroups.has(student.branch)) {
          branchGroups.set(student.branch, []);
        }
        branchGroups.get(student.branch)!.push(student);
      });

      // Build branch analytics
      const branchBreakdown: BranchAnalytics[] = [];
      branchGroups.forEach((branchStudents, branch) => {
        const branchMetrics = calculateMetrics(branchStudents);
        branchBreakdown.push({
          ...branchMetrics,
          type: 'branch',
          branch,
          year,
          semester,
        });
      });

      // Sort branches alphabetically
      branchBreakdown.sort((a, b) => a.branch.localeCompare(b.branch));

      semesterBreakdown.push({
        ...semMetrics,
        type: 'semester',
        year,
        semester,
        branchBreakdown,
      });
    });

    // Sort semesters by semester number
    semesterBreakdown.sort((a, b) => a.semester - b.semester);

    yearBreakdown.push({
      ...yearMetrics,
      type: 'year',
      year,
      semesterBreakdown,
    });
  });

  // Sort years by year number
  yearBreakdown.sort((a, b) => a.year - b.year);

  return {
    ...collegeMetrics,
    type: 'college',
    yearBreakdown,
  };
};

/**
 * Get specific analytics at different levels
 */
export const getYearAnalytics = (
  collegeAnalytics: CollegeAnalytics,
  year: Year
): YearAnalytics | undefined => {
  return collegeAnalytics.yearBreakdown.find((y) => y.year === year);
};

export const getSemesterAnalytics = (
  collegeAnalytics: CollegeAnalytics,
  year: Year,
  semester: Semester
): SemesterAnalytics | undefined => {
  const yearAnalytics = getYearAnalytics(collegeAnalytics, year);
  return yearAnalytics?.semesterBreakdown.find((s) => s.semester === semester);
};

export const getBranchAnalytics = (
  collegeAnalytics: CollegeAnalytics,
  year: Year,
  semester: Semester,
  branch: Branch
): BranchAnalytics | undefined => {
  const semAnalytics = getSemesterAnalytics(collegeAnalytics, year, semester);
  return semAnalytics?.branchBreakdown.find((b) => b.branch === branch);
};

/**
 * Get all branches
 */
export const ALL_BRANCHES: Branch[] = [
  'ISE',
  'CSE',
  'MECH',
  'CV',
  'EC',
  'EEE',
  'IM',
  'AIML',
  'CSBS',
];

/**
 * Get all years
 */
export const ALL_YEARS: Year[] = [1, 2, 3, 4];

/**
 * Get semesters for a specific year
 */
export const getSemestersForYear = (year: Year): Semester[] => {
  const startSem = ((year - 1) * 2 + 1) as Semester;
  const endSem = (startSem + 1) as Semester;
  return [startSem, endSem];
};
