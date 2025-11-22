import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { ROUTES } from "@/lib/constants";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <Header activePath={ROUTES.HOME} showNav={true} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
          Student Performance Predictor
        </h2>
        <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-2">
          Leverage machine learning to predict student outcomes and identify at-risk students early
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-stretch">
          <Link to="/predict" className="w-full sm:w-auto">
            <Button size="lg" className="w-full text-base sm:text-lg">
              Predict Student
            </Button>
          </Link>
          <Link to="/upload" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full text-base sm:text-lg">
              Bulk Upload
            </Button>
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Prediction Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-success flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-success">94.2%</div>
              <p className="text-xs text-muted-foreground">Based on historical data</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Students Analyzed</CardTitle>
              <Users className="h-4 w-4 text-primary flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">1,247</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">At-Risk Students</CardTitle>
              <AlertCircle className="h-4 w-4 text-accent flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-accent">183</div>
              <p className="text-xs text-muted-foreground">Require intervention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-secondary">85.3%</div>
              <p className="text-xs text-muted-foreground">Predicted to pass</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-foreground">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Single Student Prediction</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Input individual student data for instant prediction with detailed insights
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Bulk CSV Upload</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Process entire cohorts at once with batch predictions and downloadable results
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Analytics Dashboard</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Visualize cohort insights with interactive charts and performance metrics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
