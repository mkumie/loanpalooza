import { Label } from "@/components/ui/label";

interface LocationFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const LocationFields = ({ formData, setFormData }: LocationFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="district">District</Label>
        <input
          type="text"
          id="district"
          value={formData.district}
          onChange={(e) =>
            setFormData({ ...formData, district: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="village">Village</Label>
        <input
          type="text"
          id="village"
          value={formData.village}
          onChange={(e) =>
            setFormData({ ...formData, village: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="homeProvince">Home Province</Label>
        <input
          type="text"
          id="homeProvince"
          value={formData.homeProvince}
          onChange={(e) =>
            setFormData({ ...formData, homeProvince: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>
    </>
  );
};