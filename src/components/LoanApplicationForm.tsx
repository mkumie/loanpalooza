import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    surname: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    district: "",
    village: "",
    homeProvince: "",
    // Employment Details
    employmentStatus: "",
    employerName: "",
    occupation: "",
    monthlyIncome: "",
    employmentLength: "",
    workAddress: "",
    workPhone: "",
    // Loan Details
    loanAmount: "",
    loanPurpose: "",
    repaymentPeriod: "",
    existingLoans: false,
    existingLoanDetails: "",
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
          src="/lovable-uploads/58b13019-da3c-47e4-8458-ebac6ebf7cee.png"
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerName">Employer Name</Label>
            <Input
              id="employerName"
              value={formData.employerName}
              onChange={(e) =>
                setFormData({ ...formData, employerName: e.target.value })
              }
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
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-primary text-white">
          <CardTitle>Loan Amount Request</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount Required (K)</Label>
            <Input
              id="loanAmount"
              type="number"
              value={formData.loanAmount}
              onChange={(e) =>
                setFormData({ ...formData, loanAmount: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repaymentPeriod">Repayment Period (Months)</Label>
            <Input
              id="repaymentPeriod"
              type="number"
              value={formData.repaymentPeriod}
              onChange={(e) =>
                setFormData({ ...formData, repaymentPeriod: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="loanPurpose">Purpose of Loan</Label>
            <Input
              id="loanPurpose"
              value={formData.loanPurpose}
              onChange={(e) =>
                setFormData({ ...formData, loanPurpose: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="existingLoans"
                checked={formData.existingLoans}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, existingLoans: checked as boolean })
                }
              />
              <Label htmlFor="existingLoans">
                Do you have any existing loans?
              </Label>
            </div>

            {formData.existingLoans && (
              <div className="space-y-2">
                <Label htmlFor="existingLoanDetails">
                  Please provide details of existing loans
                </Label>
                <Input
                  id="existingLoanDetails"
                  value={formData.existingLoanDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      existingLoanDetails: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
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