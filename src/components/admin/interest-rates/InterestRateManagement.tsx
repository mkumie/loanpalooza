import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterestRateForm } from "./InterestRateForm";
import { InterestRateList } from "./InterestRateList";
import { useQuery } from "@tanstack/react-query";

export const InterestRateManagement = () => {
  const [key, setKey] = useState(0);

  const refreshData = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Interest Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <InterestRateForm onSuccess={refreshData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interest Rate History</CardTitle>
        </CardHeader>
        <CardContent>
          <InterestRateList key={key} onUpdate={refreshData} />
        </CardContent>
      </Card>
    </div>
  );
};