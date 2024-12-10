import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsAndConditionsProps {
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
}

export const TermsAndConditions = ({ agreed, onAgreeChange }: TermsAndConditionsProps) => {
  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle>Terms and Conditions</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ScrollArea className="h-[400px] rounded-md border p-4 mb-4">
          <div className="space-y-4">
            <h3 className="font-semibold">TERMS AND CONDITIONS</h3>
            
            <div className="space-y-2">
              <p>1. The borrower must pay up his/her Personal loan with the interest in due time (date) in accordance to YES Finance Limited loan repayment schedule on the amount agreed on the loan Application Form. The repayment is done on fortnightly installments.</p>
              
              <p>2. If the borrower violates requirement 1 above and does not pay up his/her loan on due time for whatever reason/s:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>A 100% Default Interest fee will be charged based on the missing or delayed or partly paid and balance of fortnightly authorized amount outstanding.</li>
                <li>A further 15% additional Administration fee will be applied from the Default Interest fee (2a).</li>
              </ul>
              
              <p>3. The borrower must meet any cost incurred regarding non-repayments of agreed Personal Loan. This includes legal fees, Communication cost & stationery expenses, loss of business opportunities, etc.</p>
              
              <p>4. If the borrower skips a deduction without YES Finance Ltd's approved amount as per the agreement, the amount will be deducted together with the following pay deduction. The Alesco payroll system from from the Department of Finance (TID) will perform the deduction without the borrower's approval.</p>
              
              <p>5. The amount of loan will be charged into the Client's Account when the borrower is requesting for updated Statement of Accounts.</p>
              
              <p>6. The Lender reserves the Ultimate right to review the loan facility at least annually and withdraw the loan facility for any reason moreover. Any Personal Loan application can be rejected by YES Finance Ltd at its wish.</p>
              
              <p>7. YES Finance Ltd can at any time alter the interest rate but the borrower has to comply with the agreed upon Interest Rate, Default Interest Charges etc during the term of the loan.</p>
            </div>

            <h3 className="font-semibold mt-6">APPLICANT'S AGREEMENT</h3>
            <div className="space-y-2">
              <p>8. I acknowledge that I have read through the Terms and Conditions. Therefore, I will abide by to the Terms and Conditions herein.</p>
              
              <p>9. My personal Account Number is correct and the Lender can directly transfer the proceeds of the loan amount and my future loan redraw. I will NOT authorize any third party account details.</p>
              
              <p>10. I shall be responsible on full indemnity basis for all costs incurred by the Lender in preparation, negotiation, recovery and administration cost of this loan agreement.</p>
              
              <p>11.</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>I give my consent to YES Finance Limited to release my personal and confidential information it holds to any other credit agency (Finance companies).</li>
                <li>I do further give my consent to YES Finance Limited to enquire with any other credit agency (Finance companies) for any credit facility I may have with such other credit agency.</li>
                <li>I do authorize other credit agency to receive from YES Finance Limited and to release such personal and confidential information to YES Finance Limited.</li>
                <li>I further authorize that in the event that I be terminated, resigned, suspended, cease employment, YES Finance Limited is to have complete authority over my savings from POSF, Nambawan Fund, Finish Pay, Final Entitlement, etc to be recouped by them to pay off my outstanding loan balance owing.</li>
              </ul>
              
              <p>12. I authorize my employer to do direct Payroll Deduction under the Pay Deduction code: DURNT and remit the cheque in favour of YES Finance Limited.</p>
              
              <p>13. I acknowledge that I have read and understood the contents of this Personal Loan Agreement and that by signing this Contract, I am legally bound by the said Terms and Conditions therein.</p>
              
              <p>14. I certify that all the information here is true and correct.</p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreed}
            onCheckedChange={(checked) => onAgreeChange(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm">
            I have read, understood, and agree to the Terms and Conditions
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};