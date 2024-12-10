import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmploymentDetailsSectionProps {
  formData: {
    employmentStatus: string;
    employerName: string;
    occupation: string;
    monthlyIncome: string;
    employmentLength: string;
    workAddress: string;
    workPhone: string;
  };
  setFormData: (data: any) => void;
  validationErrors: Record<string, string>;
}

export const EmploymentDetailsSection = ({
  formData,
  setFormData,
  validationErrors,
}: EmploymentDetailsSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-primary text-white">
        <CardTitle>Client's Employment Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-2">
          <Label>Employment Status</Label>
          <RadioGroup
            value={formData.employmentStatus}
            onValueChange={(value) =>
              setFormData({ ...formData, employmentStatus: value })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="employed" id="employed" />
              <Label htmlFor="employed">Employed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self-employed" id="self-employed" />
              <Label htmlFor="self-employed">Self-Employed</Label>
            </div>
          </RadioGroup>
          {validationErrors.employmentStatus && (
            <p className="text-sm text-red-500">{validationErrors.employmentStatus}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="employerName">Employer Name</Label>
          <Input
            id="employerName"
            value={formData.employerName}
            onChange={(e) =>
              setFormData({ ...formData, employerName: e.target.value })
            }
            error={!!validationErrors.employerName}
            errorMessage={validationErrors.employerName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation/Position</Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) =>
              setFormData({ ...formData, occupation: e.target.value })
            }
            error={!!validationErrors.occupation}
            errorMessage={validationErrors.occupation}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income (K)</Label>
          <Input
            id="monthlyIncome"
            type="number"
            value={formData.monthlyIncome}
            onChange={(e) =>
              setFormData({ ...formData, monthlyIncome: e.target.value })
            }
            error={!!validationErrors.monthlyIncome}
            errorMessage={validationErrors.monthlyIncome}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentLength">Length of Employment</Label>
          <Input
            id="employmentLength"
            placeholder="e.g., 2 years"
            value={formData.employmentLength}
            onChange={(e) =>
              setFormData({ ...formData, employmentLength: e.target.value })
            }
            error={!!validationErrors.employmentLength}
            errorMessage={validationErrors.employmentLength}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workPhone">Work Phone Number</Label>
          <Input
            id="workPhone"
            type="tel"
            value={formData.workPhone}
            onChange={(e) =>
              setFormData({ ...formData, workPhone: e.target.value })
            }
            error={!!validationErrors.workPhone}
            errorMessage={validationErrors.workPhone}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="workAddress">Work Address</Label>
          <Input
            id="workAddress"
            value={formData.workAddress}
            onChange={(e) =>
              setFormData({ ...formData, workAddress: e.target.value })
            }
            error={!!validationErrors.workAddress}
            errorMessage={validationErrors.workAddress}
          />
        </div>
      </CardContent>
    </Card>
  );
};