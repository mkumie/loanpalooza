import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";
import { useSession } from "@supabase/auth-helpers-react";

export const useDraftApplication = () => {
  const { setFormData } = useLoanApplication();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');
  const session = useSession();

  const { data: draftData } = useQuery({
    queryKey: ['draft-application', draftId],
    queryFn: async () => {
      if (!draftId || !session?.user) return null;

      console.log("Fetching draft application:", draftId);
      
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('id', draftId)
        .eq('user_id', session.user.id)
        .eq('status', 'draft')
        .single();

      if (error) {
        console.error('Error fetching draft:', error);
        toast.error('Failed to load draft application');
        return null;
      }

      console.log("Draft data fetched:", data);
      return data;
    },
    enabled: !!draftId && !!session?.user,
  });

  useEffect(() => {
    if (draftData) {
      setFormData({
        firstName: draftData.first_name,
        surname: draftData.surname,
        dateOfBirth: draftData.date_of_birth,
        gender: draftData.gender,
        maritalStatus: draftData.marital_status,
        district: draftData.district,
        village: draftData.village,
        homeProvince: draftData.home_province,
        employmentStatus: draftData.employment_status,
        employerName: draftData.employer_name || '',
        occupation: draftData.occupation || '',
        monthlyIncome: draftData.monthly_income?.toString() || '',
        employmentLength: draftData.employment_length || '',
        workAddress: draftData.work_address || '',
        workPhone: draftData.work_phone || '',
        loanAmount: draftData.loan_amount?.toString() || '',
        loanPurpose: draftData.loan_purpose,
        repaymentPeriod: draftData.repayment_period?.toString() || '',
        existingLoans: draftData.existing_loans,
        existingLoanDetails: draftData.existing_loan_details || '',
        referenceFullName: draftData.reference_full_name,
        referenceRelationship: draftData.reference_relationship,
        referenceAddress: draftData.reference_address,
        referencePhone: draftData.reference_phone,
        referenceOccupation: draftData.reference_occupation,
        bankName: draftData.bank_name,
        accountNumber: draftData.account_number,
        accountType: draftData.account_type,
        branchName: draftData.branch_name,
        accountHolderName: draftData.account_holder_name,
      });
    }
  }, [draftData, setFormData]);

  return { draftId };
};