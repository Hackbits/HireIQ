"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import * as pdfjsLib from "pdfjs-dist";
import { uploadFiles } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/use-toast";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface UploadFormProps {
  onSuccess: (jobId: string) => void;
}

interface FileProgress {
  file: File;
  status: "pending" | "reading" | "extracting" | "uploading" | "screening" | "done" | "error";
  errorText?: string;
  url?: string;
}

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState<FileProgress[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const pdfs = newFiles.filter((f) => f.type === "application/pdf");
    setFiles((prev) => [
      ...prev,
      ...pdfs.map((file) => ({ file, status: "pending" as const })),
    ]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileStatus = (index: number, status: FileProgress["status"], errorText?: string, url?: string) => {
    setFiles((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], status, errorText, url };
      return clone;
    });
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item): item is { str: string } & typeof item => "str" in item)
        .map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || files.length === 0 || !jobTitle || !jobDescription) return;

    if (profile && profile.plan === "free" && profile.screensUsed + files.length > profile.screensLimit) {
        toast(`You only have ${profile.screensLimit - profile.screensUsed} screens left on the Free plan.`, "error");
        return;
    }

    setIsProcessing(true);

    try {
      const jobDoc = await addDoc(collection(db, "jobs"), {
        title: jobTitle,
        description: jobDescription,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      const jobId = jobDoc.id;

      for (let i = 0; i < files.length; i++) {
        const fileObj = files[i];
        if (fileObj.status === "error" || fileObj.status === "done") continue;

        try {
          updateFileStatus(i, "extracting");
          const text = await extractTextFromPDF(fileObj.file);

          updateFileStatus(i, "uploading");
          const [res] = await uploadFiles("pdfUploader", {
            files: [fileObj.file],
          });

          if (!res) throw new Error("Upload failed");

          updateFileStatus(i, "screening");
          const response = await fetch("/api/screen", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resumeText: text,
              jobDescription,
              jobId,
              candidateName: fileObj.file.name.replace(".pdf", ""),
              firebaseUid: user.uid,
              resumeUrl: res.url,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Screening failed");
          }

          updateFileStatus(i, "done", undefined, res.url);
        } catch (err: unknown) {
          updateFileStatus(i, "error", err instanceof Error ? err.message : "Unknown error");
        }
      }

      onSuccess(jobId);
    } catch (err) {
      console.error(err);
      toast("Failed to initialize job. Please try again.", "error");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Job Title</label>
        <Input
          type="text"
          required
          placeholder="e.g. Senior Frontend Developer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          disabled={isProcessing}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Job Description</label>
        <textarea
          required
          placeholder="Paste the full job description here..."
          className="bg-secondary border border-border text-foreground rounded-md w-full min-h-[120px] resize-y px-3 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isProcessing}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Resumes (PDF only)</label>
        <div
          className={`bg-secondary border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors ${isDragActive ? "border-primary" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          style={{ opacity: isProcessing ? 0.5 : 1, pointerEvents: isProcessing ? "none" : "auto" }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={handleChange}
          />
          <div className="flex flex-col items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-3">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="font-semibold text-foreground mb-1">Click or drag dropping PDFs here</p>
            <p className="text-xs text-muted-foreground">Maximum 16mb per file (UploadThing limit)</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-3 overflow-hidden">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground flex-shrink-0">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span className="text-sm truncate text-foreground" title={f.file.name}>{f.file.name}</span>
              </div>

              <div className="flex items-center gap-3">
                {f.status !== "pending" && (
                  <span className={`rounded-md px-2 py-0.5 text-xs ${
                    f.status === "error"
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : f.status === "done"
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-primary/10 text-primary border border-primary/20"
                  }`}>
                    {f.status === "uploading" ? "uploading to ut" : f.status}
                  </span>
                )}
                {!isProcessing && (
                  <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full" disabled={files.length === 0 || isProcessing}>
        {isProcessing ? "Processing Resumes..." : `Screen ${files.length} Candidate${files.length !== 1 ? "s" : ""}`}
      </Button>
    </form>
  );
}
