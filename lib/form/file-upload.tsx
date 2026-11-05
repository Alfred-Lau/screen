"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, X, File, Image, FileText, Loader2, CheckCircle } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  status?: "uploading" | "done" | "error";
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  onFilesChange?: (files: File[]) => void;
  uploadFn?: (file: File) => Promise<void>;
  className?: string;
  id?: string;
}

function getFileIcon(file: File) {
  if (file.type.startsWith("image/")) return <Image className="size-4" />;
  if (file.type.includes("pdf")) return <FileText className="size-4" />;
  return <File className="size-4" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled = false,
  onFilesChange,
  uploadFn,
  className,
  id,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const processFiles = async (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList);

    // Validate
    const validFiles = newFiles.filter((file) => {
      if (maxSize && file.size > maxSize) return false;
      return true;
    });

    if (maxFiles && files.length + validFiles.length > maxFiles) {
      validFiles.splice(maxFiles - files.length);
    }

    const uploadFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: uploadFn ? "uploading" : "done",
    }));

    setFiles((prev) => multiple ? [...prev, ...uploadFiles] : uploadFiles);
    onFilesChange?.(validFiles);

    if (uploadFn) {
      for (const uf of uploadFiles) {
        try {
          await uploadFn(uf.file);
          setFiles((prev) =>
            prev.map((f) => f.id === uf.id ? { ...f, status: "done", progress: 100 } : f)
          );
        } catch {
          setFiles((prev) =>
            prev.map((f) => f.id === uf.id ? { ...f, status: "error", error: "Upload failed" } : f)
          );
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      onFilesChange?.(updated.map((f) => f.file));
      return updated;
    });
  };

  const canAddMore = !maxFiles || files.length < maxFiles;

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Drop zone */}
      {(!files.length || multiple) && canAddMore && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed",
            "transition-all duration-200 cursor-pointer",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-accent/30",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop files here or <span className="text-primary underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {accept && `Accepts: ${accept} · `}
              {maxSize && `Max size: ${formatBytes(maxSize)}`}
              {maxFiles && ` · Max ${maxFiles} file${maxFiles !== 1 ? "s" : ""}`}
            </p>
          </div>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => e.target.files && processFiles(e.target.files)}
            className="sr-only"
          />
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uf) => (
            <div
              key={uf.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl border",
                uf.status === "error"
                  ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
                  : "border-border bg-card"
              )}
            >
              {/* Preview or icon */}
              {uf.preview ? (
                <img src={uf.preview} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-muted-foreground shrink-0">
                  {getFileIcon(uf.file)}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{uf.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(uf.file.size)}
                  {uf.error && <span className="text-red-500 ml-2">{uf.error}</span>}
                </p>
                {uf.status === "uploading" && (
                  <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${uf.progress ?? 0}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Status / remove */}
              <div className="shrink-0">
                {uf.status === "uploading" ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : uf.status === "done" ? (
                  <CheckCircle className="size-4 text-emerald-500" />
                ) : (
                  <button
                    type="button"
                    onClick={() => removeFile(uf.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
