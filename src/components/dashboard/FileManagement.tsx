import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FileUp, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FileUploadForm {
  title: string;
  description: string;
  category: string;
  file: File | null;
}

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
      return data;
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
    mutationFn: async (file: any) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>

        <Button type="submit" disabled={uploadMutation.isPending}>
          <FileUp className="mr-2 h-4 w-4" />
          {uploadMutation.isPending ? "Uploading..." : "Upload File"}
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Uploaded Files</h3>
        {isLoading ? (
          <p>Loading files...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {files?.map((file) => (
              <div
                key={file.id}
                className="p-4 border rounded-lg bg-card flex justify-between items-start"
              >
                <div>
                  <h4 className="font-medium">{file.title}</h4>
                  <p className="text-sm text-muted-foreground">{file.description}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Category: {file.category}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(file)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};