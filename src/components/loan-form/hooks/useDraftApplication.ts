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

  // Query to fetch either draft or most recent application
  const { data: applicationData } = useQuery({
    queryKey: ['application-data', draftId, session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log("No session, skipping fetch");
        return null;
      }

      if (draftId) {
        console.log("Fetching draft application with ID:", draftId);
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

        console.log("Draft data fetched successfully:", data);
        return data;
      } else {
        // If no draft ID, fetch the most recent non-draft application
        console.log("Fetching most recent application");
        const { data, error } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', session.user.id)
          .neq('status', 'draft')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
          console.error('Error fetching recent application:', error);
          return null;
        }

        console.log("Recent application data fetched:", data);
        return data;
      }
    },
    enabled: !!session?.user,
  });

  useEffect(() => {
    if (applicationData) {
      setFormData({
        firstName: applicationData.first_name,
        surname: applicationData.surname,
        dateOfBirth: applicationData.date_of_birth,
        gender: applicationData.gender,
        maritalStatus: applicationData.marital_status,
        district: applicationData.district,
        village: applicationData.village,
        homeProvince: applicationData.home_province,
        employmentStatus: applicationData.employment_status,
        employerName: applicationData.employer_name || '',
        occupation: applicationData.occupation || '',
        monthlyIncome: applicationData.monthly_income?.toString() || '',
        employmentLength: applicationData.employment_length || '',
        workAddress: applicationData.work_address || '',
        workPhone: applicationData.work_phone || '',
        // Don't prefill loan amount and purpose for new applications
        loanAmount: draftId ? applicationData.loan_amount?.toString() || '' : '',
        loanPurpose: draftId ? applicationData.loan_purpose : '',
        repaymentPeriod: draftId ? applicationData.repayment_period?.toString() || '' : '',
        existingLoans: applicationData.existing_loans,
        existingLoanDetails: applicationData.existing_loan_details || '',
        referenceFullName: applicationData.reference_full_name,
        referenceRelationship: applicationData.reference_relationship,
        referenceAddress: applicationData.reference_address,
        referencePhone: applicationData.reference_phone,
        referenceOccupation: applicationData.reference_occupation,
        bankName: applicationData.bank_name,
        accountNumber: applicationData.account_number,
        accountType: applicationData.account_type,
        branchName: applicationData.branch_name,
        accountHolderName: applicationData.account_holder_name,
      });
    }
  }, [applicationData, setFormData, draftId]);

  return { draftId };
};