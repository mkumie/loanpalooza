export type FileCategory = "policy" | "form" | "guide" | "other";

export interface DownloadableFile {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_path: string;
  file_type: string;
  category: FileCategory;
  is_active: boolean;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FileUploadForm {
  title: string;
  description: string;
  category: FileCategory;
  file: File | null;
}