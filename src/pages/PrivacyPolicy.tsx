import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const PrivacyPolicy = () => {
  const [content, setContent] = useState("");
  const [version, setVersion] = useState("");

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      const { data, error } = await supabase
        .from("privacy_policy_versions")
        .select("content, version")
        .order("effective_date", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching privacy policy:", error);
        return;
      }

      if (data) {
        setContent(data.content);
        setVersion(data.version);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-16 mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-4">
              Version {version} | Last Updated: March 2024
            </div>
            <ScrollArea className="h-[600px] pr-4">
              <div className="prose max-w-none whitespace-pre-line">
                {content}
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;