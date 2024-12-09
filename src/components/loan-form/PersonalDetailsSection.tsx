import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PersonalDetailsSectionProps {
  formData: {
    firstName: string;
    surname: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    district: string;
    village: string;
    homeProvince: string;
  };
  setFormData: (data: any) => void;
}

export const PersonalDetailsSection = ({
  formData,
  setFormData,
}: PersonalDetailsSectionProps) => {
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
          setFormData({
            ...formData,
            firstName: profile.first_name || formData.firstName,
            surname: profile.surname || formData.surname,
            dateOfBirth: profile.date_of_birth || formData.dateOfBirth,
          });
        }
      }
    };

    fetchProfileData();
  }, [session]);

  return (
    <Card>
      <CardHeader className="bg-primary text-white">
        <CardTitle>Client's Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name(s)</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            readOnly={!!formData.firstName} // Make readonly if pre-filled from profile
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
            readOnly={!!formData.surname} // Make readonly if pre-filled from profile
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
            readOnly={!!formData.dateOfBirth} // Make readonly if pre-filled from profile
          />
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
            className="flex gap-4"
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
          <Label>Marital Status</Label>
          <RadioGroup
            value={formData.maritalStatus}
            onValueChange={(value) =>
              setFormData({ ...formData, maritalStatus: value })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single">Single</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="married" id="married" />
              <Label htmlFor="married">Married</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
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
          />
        </div>
      </CardContent>
    </Card>
  );
};