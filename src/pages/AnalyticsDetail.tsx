import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  CollegeAnalytics,
  YearAnalytics,
  SemesterAnalytics,
  BranchAnalytics,
  buildCollegeAnalytics,
  getYearAnalytics,
  getSemesterAnalytics,
  getBranchAnalytics,
  ALL_YEARS,
  getSemestersForYear,
  StudentRecord,
} from '@/backend/analytics';
import { ROUTES } from '@/lib/constants';

const AnalyticsDetail = () => {
  // Sample data - in production, this would come from a database
  const sampleStudents: StudentRecord[] = [
    {
      studentId: '1001',
      name: 'Rajesh Kumar',
      year: 1,
      semester: 1,
      branch: 'CSE',
      attendance: 90,
      internalMarks: 85,
      classParticipation: 8,
      culturalActivity: 7,
      sportsActivity: 6,
      curricularActivity: 8,
      prediction: 'Pass',
      confidence: 92,
      riskLevel: 'Low',
      engagementIndex: 7.0,
      riskScore: 5,
    },
    {
      studentId: '1002',
      name: 'Priya Singh',
      year: 1,
      semester: 1,
      branch: 'CSE',
      attendance: 75,
      internalMarks: 72,
      classParticipation: 6,
      culturalActivity: 8,
      sportsActivity: 5,
      curricularActivity: 7,
      prediction: 'Pass',
      confidence: 78,
      riskLevel: 'Medium',
      engagementIndex: 6.7,
      riskScore: 28,
    },
    {
      studentId: '1003',
      name: 'Amit Patel',
      year: 1,
      semester: 1,
      branch: 'ISE',
      attendance: 88,
      internalMarks: 92,
      classParticipation: 9,
      culturalActivity: 6,
      sportsActivity: 8,
      curricularActivity: 9,
      prediction: 'Pass',
      confidence: 95,
      riskLevel: 'Low',
      engagementIndex: 7.7,
      riskScore: 3,
    },
    {
      studentId: '1004',
      name: 'Neha Sharma',
      year: 1,
      semester: 2,
      branch: 'CSE',
      attendance: 70,
      internalMarks: 65,
      classParticipation: 5,
      culturalActivity: 4,
      sportsActivity: 3,
      curricularActivity: 5,
      prediction: 'Fail',
      confidence: 88,
      riskLevel: 'High',
      engagementIndex: 4.0,
      riskScore: 75,
    },
    {
      studentId: '1005',
      name: 'Vikram Singh',
      year: 2,
      semester: 3,
      branch: 'MECH',
      attendance: 92,
      internalMarks: 88,
      classParticipation: 8,
      culturalActivity: 7,
      sportsActivity: 9,
      curricularActivity: 8,
      prediction: 'Pass',
      confidence: 93,
      riskLevel: 'Low',
      engagementIndex: 8.0,
      riskScore: 8,
    },
    {
      studentId: '1006',
      name: 'Deepika Reddy',
      year: 2,
      semester: 3,
      branch: 'EEE',
      attendance: 85,
      internalMarks: 80,
      classParticipation: 7,
      culturalActivity: 6,
      sportsActivity: 7,
      curricularActivity: 8,
      prediction: 'Pass',
      confidence: 87,
      riskLevel: 'Low',
      engagementIndex: 7.0,
      riskScore: 12,
    },
  ];

  const collegeAnalytics = useMemo(() => buildCollegeAnalytics(sampleStudents), []);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const yearAnalytics = selectedYear
    ? getYearAnalytics(collegeAnalytics, selectedYear as any)
    : null;

  const semesterAnalytics =
    selectedYear && selectedSemester
      ? getSemesterAnalytics(collegeAnalytics, selectedYear as any, selectedSemester as any)
      : null;

  const yearChartData = collegeAnalytics.yearBreakdown.map((y) => ({
    year: `Year ${y.year}`,
    pass: y.passCount,
    fail: y.failCount,
    passPercentage: y.passPercentage,
  }));

  const semesterChartData = yearAnalytics
    ? yearAnalytics.semesterBreakdown.map((s) => ({
        semester: `Sem ${s.semester}`,
        pass: s.passCount,
        fail: s.failCount,
        passPercentage: s.passPercentage,
      }))
    : [];

  const branchChartData = semesterAnalytics
    ? semesterAnalytics.branchBreakdown.map((b) => ({
        branch: b.branch,
        pass: b.passCount,
        fail: b.failCount,
        passPercentage: b.passPercentage,
      }))
    : [];

  const riskDistributionData = [
    { name: 'Low Risk', value: collegeAnalytics.riskDistribution.low, fill: 'hsl(var(--success))' },
    { name: 'Medium Risk', value: collegeAnalytics.riskDistribution.medium, fill: 'hsl(var(--accent))' },
    { name: 'High Risk', value: collegeAnalytics.riskDistribution.high, fill: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <Header activePath={ROUTES.ANALYTICS} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">College Analytics</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          Hierarchical drilldown: College → Year → Semester → Branch
        </p>

        {/* College Level Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">College Wide Performance</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Overall statistics for all {collegeAnalytics.totalStudents} students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 border rounded-lg">
                <div className="text-xs sm:text-sm text-muted-foreground">Total Students</div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  {collegeAnalytics.totalStudents}
                </div>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg">
                <div className="text-xs sm:text-sm text-muted-foreground">Pass Rate</div>
                <div className="text-xl sm:text-2xl font-bold text-success">
                  {collegeAnalytics.passPercentage}%
                </div>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg">
                <div className="text-xs sm:text-sm text-muted-foreground">Avg Confidence</div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {collegeAnalytics.avgConfidence}%
                </div>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg">
                <div className="text-xs sm:text-sm text-muted-foreground">Avg Attendance</div>
                <div className="text-xl sm:text-2xl font-bold text-info">
                  {collegeAnalytics.avgAttendance}%
                </div>
              </div>
            </div>

            {/* College Level Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              <div className="border rounded-lg p-4">
                <h4 className="text-sm sm:text-base font-semibold mb-4">Risk Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="text-sm sm:text-base font-semibold mb-4">Performance by Year</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={yearChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pass" fill="hsl(var(--success))" />
                    <Bar dataKey="fail" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Year Level Drilldown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Drilldown by Year</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Select a year to view detailed analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {ALL_YEARS.map((year) => {
                const data = getYearAnalytics(collegeAnalytics, year as any);
                return (
                  <Button
                    key={year}
                    variant={selectedYear === year ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedYear(year);
                      setSelectedSemester(null);
                    }}
                    className="text-xs sm:text-sm"
                  >
                    Year {year} ({data?.totalStudents || 0})
                  </Button>
                );
              })}
            </div>

            {yearAnalytics && (
              <div className="border rounded-lg p-4 mt-4">
                <h4 className="text-sm sm:text-base font-semibold mb-3">Year {yearAnalytics.year} Statistics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Students</div>
                    <div className="text-lg sm:text-xl font-bold">{yearAnalytics.totalStudents}</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Pass %</div>
                    <div className="text-lg sm:text-xl font-bold text-success">
                      {yearAnalytics.passPercentage}%
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Avg Marks</div>
                    <div className="text-lg sm:text-xl font-bold">{yearAnalytics.avgMarks}</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Low Risk</div>
                    <div className="text-lg sm:text-xl font-bold text-success">
                      {yearAnalytics.lowRiskCount}
                    </div>
                  </div>
                </div>

                {/* Semester Level for Selected Year */}
                {yearAnalytics && (
                  <div className="mt-6">
                    <h5 className="text-sm font-semibold mb-3">Semesters in Year {yearAnalytics.year}</h5>
                    <div className="flex flex-wrap gap-2">
                      {yearAnalytics.semesterBreakdown.map((sem) => (
                        <Button
                          key={sem.semester}
                          variant={selectedSemester === sem.semester ? 'default' : 'outline'}
                          onClick={() => setSelectedSemester(sem.semester)}
                          className="text-xs sm:text-sm"
                        >
                          Sem {sem.semester} ({sem.totalStudents})
                        </Button>
                      ))}
                    </div>

                    {/* Performance by Semester Chart */}
                    {semesterChartData.length > 0 && (
                      <div className="border rounded-lg p-4 mt-4">
                        <h5 className="text-sm font-semibold mb-3">Semester Performance</h5>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={semesterChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="semester" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="pass" fill="hsl(var(--success))" />
                            <Bar dataKey="fail" fill="hsl(var(--destructive))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Branch Level Drilldown */}
        {semesterAnalytics && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Branch Analytics - Year {semesterAnalytics.year} Sem {semesterAnalytics.semester}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Performance breakdown by branch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={branchChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="branch" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pass" fill="hsl(var(--success))" name="Pass" />
                    <Bar dataKey="fail" fill="hsl(var(--destructive))" name="Fail" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {semesterAnalytics.branchBreakdown.map((branch) => (
                  <div key={branch.branch} className="border rounded-lg p-4">
                    <h5 className="text-sm font-semibold mb-3">{branch.branch}</h5>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-bold">{branch.totalStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pass Rate:</span>
                        <span className="font-bold text-success">{branch.passPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Marks:</span>
                        <span className="font-bold">{branch.avgMarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Attendance:</span>
                        <span className="font-bold">{branch.avgAttendance}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDetail;
