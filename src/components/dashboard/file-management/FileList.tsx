import { Button } from "@/components/ui/button";
import { DownloadableFile } from "@/types/files";
import { Trash2 } from "lucide-react";

interface FileListProps {
  files: DownloadableFile[] | undefined;
  isLoading: boolean;
  onDelete: (file: DownloadableFile) => void;
  isDeleting: boolean;
}

export const FileList = ({ files, isLoading, onDelete, isDeleting }: FileListProps) => {
  if (isLoading) {
    return <p>Loading files...</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Uploaded Files</h3>
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
              onClick={() => onDelete(file)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};