import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type ReferralSource = Database["public"]["Enums"]["referral_source"];

export const ClientFeedbackForm = ({ onClose }: { onClose?: () => void }) => {
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralSource, setReferralSource] = useState<ReferralSource | "">("");
  const [otherSource, setOtherSource] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralSource) {
      toast.error("Please select how you heard about us");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("client_feedback").insert({
        user_id: session?.user?.id,
        referral_source: referralSource as ReferralSource,
        other_source: referralSource === "other" ? otherSource : null,
        additional_comments: additionalComments,
      });

      if (error) throw error;

      toast.success("Thank you for your feedback!");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Help Us Improve</h2>
        <p className="text-sm text-gray-600">
          We'd love to know how you heard about YES Finance Ltd.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            How did you hear about us? *
          </label>
          <Select
            value={referralSource}
            onValueChange={(value: ReferralSource) => setReferralSource(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friend_family">Friend or Family</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="search_engine">Search Engine</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
              <SelectItem value="employer">Employer</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {referralSource === "other" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Please specify *
            </label>
            <Input
              value={otherSource}
              onChange={(e) => setOtherSource(e.target.value)}
              placeholder="Please tell us how you heard about us"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Additional Comments
          </label>
          <Textarea
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            placeholder="Any additional feedback you'd like to share?"
            className="h-24"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Skip
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </form>
  );
};