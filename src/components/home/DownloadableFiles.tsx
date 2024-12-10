import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DownloadableFiles = () => {
  const { data: downloadableFiles, isLoading } = useQuery({
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

      if (error) {
        toast.error("Failed to download file");
        throw error;
      }

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Error downloading file");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!downloadableFiles?.length) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <FileText className="h-12 w-12 text-gray-400" />
          <div>
            <h3 className="font-medium">No resources available</h3>
            <p className="text-sm text-gray-500">Check back later for updates.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {downloadableFiles.map((file) => (
        <Card key={file.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{file.title}</h3>
                {file.description && (
                  <p className="text-sm text-gray-600">{file.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Category: {file.category}
                </p>
              </div>
            </div>
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
      </Card>
    ))}
    </div>
  );
};