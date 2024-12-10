import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Save, Edit, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProfileFormData {
  first_name: string;
  surname: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  gender: string;
}

interface ProfileFormProps {
  profile: any;
}

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: profile?.first_name || "",
      surname: profile?.surname || "",
      phone_number: profile?.phone_number || "",
      address: profile?.address || "",
      date_of_birth: profile?.date_of_birth || "",
      gender: profile?.gender || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-semibold">Profile Information</h1>
        </div>
        {profile && (
          <Button
            type="button"
            variant={isEditing ? "destructive" : "secondary"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            {...register("first_name", { required: "First name is required" })}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
          {errors.first_name && (
            <p className="text-sm text-destructive">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input
            id="surname"
            {...register("surname", { required: "Surname is required" })}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
          {errors.surname && (
            <p className="text-sm text-destructive">{errors.surname.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            {...register("date_of_birth", { required: "Date of birth is required" })}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
          {errors.date_of_birth && (
            <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            {...register("gender", { required: "Gender is required" })}
            className="flex space-x-4"
            defaultValue={profile?.gender || ""}
            disabled={!isEditing}
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
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            {...register("phone_number", { required: "Phone number is required" })}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
          {errors.phone_number && (
            <p className="text-sm text-destructive">{errors.phone_number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register("address", { required: "Address is required" })}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      )}
    </form>
  );
};