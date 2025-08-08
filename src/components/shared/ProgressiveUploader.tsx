import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Eye,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileValidation {
  maxSize: number;
  allowedTypes: string[];
  requiredColumns?: string[];
}

interface UploadedFile {
  file: File;
  id: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  error?: string;
  preview?: unknown[];
  rowCount?: number;
}

interface ProgressiveUploaderProps {
  onFilesProcessed: (files: UploadedFile[]) => void;
  validation: FileValidation;
  multiple?: boolean;
  className?: string;
  title?: string;
  description?: string;
  showPreview?: boolean;
  maxPreviewRows?: number;
}

const ProgressiveUploader: React.FC<ProgressiveUploaderProps> = ({
  onFilesProcessed,
  validation,
  multiple = false,
  className,
  title = "Upload Files",
  description = "Drag and drop files here or click to browse",
  showPreview = true,
  maxPreviewRows = 5,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const processFile = useCallback(async (file: File): Promise<UploadedFile> => {
    const fileId = `${file.name}-${Date.now()}`;
    
    const uploadedFile: UploadedFile = {
      file,
      id: fileId,
      status: "uploading",
      progress: 0,
    };

    // Simulate file upload progress
    const updateProgress = (progress: number) => {
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, progress } : f)
      );
    };

    // Validate file
    if (!validation.allowedTypes.some(type => file.name.toLowerCase().endsWith(type))) {
      return {
        ...uploadedFile,
        status: "error",
        error: `File type not allowed. Accepted types: ${validation.allowedTypes.join(", ")}`,
      };
    }

    if (file.size > validation.maxSize) {
      return {
        ...uploadedFile,
        status: "error",
        error: `File size exceeds ${Math.round(validation.maxSize / (1024 * 1024))}MB limit`,
      };
    }

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 50));
      updateProgress(i);
    }

    // Process file (simulate CSV parsing)
    try {
      uploadedFile.status = "processing";
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, status: "processing" } : f)
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock CSV data for preview
      const mockPreview = Array.from({ length: Math.min(maxPreviewRows, 10) }, (_, i) => ({
        id: i + 1,
        name: `Sample Row ${i + 1}`,
        value: Math.random() * 100,
      }));

      return {
        ...uploadedFile,
        status: "completed",
        progress: 100,
        preview: mockPreview,
        rowCount: Math.floor(Math.random() * 1000) + 100,
      };
    } catch (error) {
      return {
        ...uploadedFile,
        status: "error",
        error: error instanceof Error ? error.message : "Processing failed",
      };
    }
  }, [validation, maxPreviewRows]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: `${file.name}-${Date.now()}`,
      status: "uploading" as const,
      progress: 0,
    }));

    setUploadedFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);

    const processedFiles = await Promise.all(
      acceptedFiles.map(processFile)
    );

    setUploadedFiles(prev => 
      prev.map(existing => {
        const processed = processedFiles.find(p => p.file.name === existing.file.name);
        return processed || existing;
      })
    );

    onFilesProcessed(processedFiles);
  }, [processFile, multiple, onFilesProcessed]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "uploading":
      case "processing":
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (file: UploadedFile) => {
    switch (file.status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "uploading":
        return <Badge variant="secondary">Uploading</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Max size: {Math.round(validation.maxSize / (1024 * 1024))}MB</span>
              <span>•</span>
              <span>Formats: {validation.allowedTypes.join(", ")}</span>
              {multiple && (
                <>
                  <span>•</span>
                  <span>Multiple files supported</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="mb-4 text-sm font-medium">Uploaded Files</h4>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(file.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.file.size / 1024).toFixed(1)} KB
                          {file.rowCount && ` • ${file.rowCount} rows`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(file)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {(file.status === "uploading" || file.status === "processing") && (
                    <div className="space-y-1">
                      <Progress value={file.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {file.status === "uploading" ? "Uploading" : "Processing"}: {file.progress}%
                      </p>
                    </div>
                  )}

                  {file.error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{file.error}</span>
                    </div>
                  )}

                  {file.status === "completed" && showPreview && file.preview && (
                    <div className="rounded-lg border bg-muted/20 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-xs font-medium">Data Preview</h5>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View All
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="grid grid-cols-3 gap-2 font-medium mb-1">
                          <span>ID</span>
                          <span>Name</span>
                          <span>Value</span>
                        </div>
                        {file.preview.slice(0, maxPreviewRows).map((row: any, i) => (
                          <div key={i} className="grid grid-cols-3 gap-2 py-1 border-t">
                            <span>{row.id}</span>
                            <span className="truncate">{row.name}</span>
                            <span>{typeof row.value === 'number' ? row.value.toFixed(2) : row.value}</span>
                          </div>
                        ))}
                        {file.preview.length > maxPreviewRows && (
                          <div className="text-center py-2 text-muted-foreground">
                            ... and {file.preview.length - maxPreviewRows} more rows
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressiveUploader;