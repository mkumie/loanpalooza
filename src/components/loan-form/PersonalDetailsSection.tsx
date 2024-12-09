import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";

export const PersonalDetailsSection = () => {
  const { formData, setFormData } = useLoanApplication();
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch profile data",
            variant: "destructive",
          });
          return;
        }

        if (profile) {
          setFormData(prev => ({
            ...prev,
            firstName: profile.first_name || prev.firstName,
            surname: profile.surname || prev.surname,
            dateOfBirth: profile.date_of_birth || prev.dateOfBirth,
          }));
        }
      }
    };

    fetchProfileData();
  }, [session, setFormData, toast]);

  return (
    <Card>
      <CardHeader className="bg-primary text-white">
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
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
      </CardContent>
    </Card>
  );
};