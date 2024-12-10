import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DownloadableFiles = () => {
  const { data: downloadableFiles } = useQuery({
    queryKey: ["downloadableFiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("downloadable_files")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("downloadable_files")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (!downloadableFiles?.length) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Download className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Important Documents</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {downloadableFiles.map((file) => (
          <Card key={file.id} className="p-4 hover:bg-gray-50">
            <div className="space-y-2">
              <h3 className="font-medium">{file.title}</h3>
              {file.description && (
                <p className="text-sm text-gray-600">{file.description}</p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleDownload(file.file_path, file.file_name)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};