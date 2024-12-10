import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useProfileData } from "./personal-details/useProfileData";
import { PersonalInfoFields } from "./personal-details/PersonalInfoFields";
import { LocationFields } from "./personal-details/LocationFields";

export const PersonalDetailsSection = () => {
  const { formData, setFormData } = useProfileData();

  return (
    <Card>
      <CardHeader className="bg-primary text-white">
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <PersonalInfoFields formData={formData} setFormData={setFormData} />
        
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <select
            id="maritalStatus"
            value={formData.maritalStatus}
            onChange={(e) =>
              setFormData({ ...formData, maritalStatus: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        <LocationFields formData={formData} setFormData={setFormData} />
      </CardContent>
    </Card>
  );
};