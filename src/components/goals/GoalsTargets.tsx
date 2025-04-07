import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const GoalsTargets: React.FC = () => {
  // Mock data for demonstration
  const goals = [
    {
      id: 1,
      title: "Increase Q3 Sales Revenue by 15%",
      progress: 75,
      target: "$150,000",
      current: "$112,500",
    },
    {
      id: 2,
      title: "Acquire 50 New Leads in July",
      progress: 40,
      target: "50 Leads",
      current: "20 Leads",
    },
    {
      id: 3,
      title: "Improve Customer Satisfaction Score to 4.5",
      progress: 90,
      target: "4.5 Stars",
      current: "4.4 Stars",
    },
    {
      id: 4,
      title: "Reduce Churn Rate by 5%",
      progress: 20,
      target: "5% Reduction",
      current: "1% Reduction",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Goals & Targets
        </h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">
                {goal.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Progress: {goal.current} / {goal.target}
                </p>
              </div>
              <Progress value={goal.progress} className="w-full h-2" />
              <div className="text-right text-sm font-semibold text-blue-600 dark:text-blue-400">
                {goal.progress}% Complete
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalsTargets;
