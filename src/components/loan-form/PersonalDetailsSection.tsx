import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useProfileData } from "./personal-details/useProfileData";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalDetailsSectionProps {
  validationErrors: Record<string, string>;
}

export const PersonalDetailsSection = ({ validationErrors }: PersonalDetailsSectionProps) => {
  const { formData, setFormData } = useProfileData();

  return (
    <Card>
      <CardHeader className="bg-primary text-white">
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              error={!!validationErrors.firstName}
              errorMessage={validationErrors.firstName}
              readOnly={!!formData.firstName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname">Surname</Label>
            <Input
              id="surname"
              value={formData.surname}
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
              error={!!validationErrors.surname}
              errorMessage={validationErrors.surname}
              readOnly={!!formData.surname}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              error={!!validationErrors.dateOfBirth}
              errorMessage={validationErrors.dateOfBirth}
              readOnly={!!formData.dateOfBirth}
            />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
            {validationErrors.gender && (
              <p className="text-sm text-red-500">{validationErrors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select
              value={formData.maritalStatus}
              onValueChange={(value) =>
                setFormData({ ...formData, maritalStatus: value })
              }
            >
              <SelectTrigger className={validationErrors.maritalStatus ? "border-red-500" : ""}>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.maritalStatus && (
              <p className="text-sm text-red-500">{validationErrors.maritalStatus}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              error={!!validationErrors.district}
              errorMessage={validationErrors.district}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              value={formData.village}
              onChange={(e) =>
                setFormData({ ...formData, village: e.target.value })
              }
              error={!!validationErrors.village}
              errorMessage={validationErrors.village}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homeProvince">Home Province</Label>
            <Input
              id="homeProvince"
              value={formData.homeProvince}
              onChange={(e) =>
                setFormData({ ...formData, homeProvince: e.target.value })
              }
              error={!!validationErrors.homeProvince}
              errorMessage={validationErrors.homeProvince}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};