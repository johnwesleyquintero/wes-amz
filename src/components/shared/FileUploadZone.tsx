import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  isLoading?: boolean;
  error?: string;
  className?: string;
  children?: React.ReactNode;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  acceptedFileTypes = [".csv"],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  isLoading = false,
  error,
  className,
  children,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxSize: maxFileSize,
    disabled: isLoading,
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          isLoading && "cursor-not-allowed opacity-50",
        )}
      >
        <input {...getInputProps()} />

        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-primary" />
            <p className="text-sm text-muted-foreground">Processing...</p>
          </div>
        ) : (
          <>
            <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop the file here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptedFileTypes.join(", ")} up to{" "}
                {Math.round(maxFileSize / (1024 * 1024))}MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {children}
    </div>
  );
};

export default FileUploadZone;
