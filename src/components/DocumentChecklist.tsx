import { Check, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const requiredDocuments = [
  {
    title: "Valid ID",
    description: "National ID, Passport, or Driver's License",
  },
  {
    title: "Proof of Income",
    description: "Recent pay slips or bank statements (last 3 months)",
  },
  {
    title: "Proof of Address",
    description: "Utility bill or rental agreement (not older than 3 months)",
  },
  {
    title: "Employment Verification",
    description: "Employment contract or letter from employer",
  },
  {
    title: "Bank Statements",
    description: "Last 6 months of bank statements",
  },
];

export const DocumentChecklist = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Required Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {requiredDocuments.map((doc, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{doc.title}</h3>
                <p className="text-sm text-gray-600">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};