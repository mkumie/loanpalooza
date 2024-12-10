import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PersonalInfoFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const PersonalInfoFields = ({ formData, setFormData }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <input
          type="text"
          id="firstName"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          readOnly={!!formData.firstName}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="surname">Surname</Label>
        <input
          type="text"
          id="surname"
          value={formData.surname}
          onChange={(e) =>
            setFormData({ ...formData, surname: e.target.value })
          }
          readOnly={!!formData.surname}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <input
          type="date"
          id="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
          readOnly={!!formData.dateOfBirth}
          className="w-full p-2 border rounded"
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
          disabled={!!formData.gender}
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
      </div>
    </>
  );
};