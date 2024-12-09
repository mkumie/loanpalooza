import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    district: "",
    village: "",
    homeProvince: "",
    // Add more fields as needed
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <img
          src="/lovable-uploads/f0fb53a5-a674-4e11-831b-1a03ca06e7eb.png"
          alt="YES Finance Ltd Logo"
          className="h-16"
        />
        <div>
          <h1 className="text-2xl font-bold text-primary">YES Finance Ltd</h1>
          <p className="text-sm text-gray-600">Personal Loan Application Form</p>
        </div>
      </div>

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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-primary text-white">
          <CardTitle>Client's Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Employment details fields will go here */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-primary text-white">
          <CardTitle>Loan Amount Request</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Loan amount request fields will go here */}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="bg-primary hover:bg-primary-600">
          Submit Application
        </Button>
      </div>
    </form>
  );
};