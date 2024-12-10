import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUploadForm, FileCategory, DownloadableFile } from "@/types/files";
import { FileList } from "./file-management/FileList";
import { UploadForm } from "./file-management/UploadForm";

export const FileManagement = () => {
  const [formData, setFormData] = useState<FileUploadForm>({
    title: "",
    description: "",
    category: "other",
    file: null,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["downloadable-files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("downloadable_files")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as DownloadableFile[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FileUploadForm) => {
      if (!formData.file) throw new Error("No file selected");

      // Upload file to storage
      const fileExt = formData.file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("downloadable_files")
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase.from("downloadable_files").insert({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        file_name: formData.file.name,
        file_path: filePath,
        file_type: formData.file.type,
      });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["downloadable-files"] });
      setFormData({
        title: "",
        description: "",
        category: "other",
        file: null,
      });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file: " + error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (file: DownloadableFile) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("downloadable_files")
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("downloadable_files")
        .delete()
        .eq("id", file.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["downloadable-files"] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file: " + error.message,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <UploadForm
        formData={formData}
        onFormChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
        onSubmit={handleSubmit}
        isUploading={uploadMutation.isPending}
      />
      <FileList
        files={files}
        isLoading={isLoading}
        onDelete={(file) => deleteMutation.mutate(file)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};