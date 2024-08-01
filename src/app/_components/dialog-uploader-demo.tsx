"use client"

import * as React from "react"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"
import { useUploadFile } from "@/hooks/use-upload-file"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileUploader } from "@/components/file-uploader"

import { UploadedFilesCard } from "./uploaded-files-card"

export function DialogUploaderDemo() {
  const [files, setFiles] = React.useState<File[]>([])
  const { onUpload, progresses, isUploading, uploadedFiles } = useUploadFile(
    "imageUploader",
    {
      defaultUploadedFiles: [],
    }
  )

  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex flex-col gap-8">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-fit" variant="outline">
            Upload files {files.length > 0 && `(${files.length})`}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription>
              Drag and drop your files here or click to browse.
            </DialogDescription>
          </DialogHeader>
          <FileUploader
            maxFileCount={8}
            maxSize={8 * 1024 * 1024}
            onValueChange={setFiles}
            progresses={progresses}
          />
          <div className="flex flex-row items-center gap-8">
            <Button
              onClick={() => {
                setLoading(true)

                toast.promise(onUpload(files), {
                  loading: "Uploading images...",
                  success: () => {
                    setFiles([])
                    setLoading(false)
                    return "Images uploaded"
                  },
                  error: (err) => {
                    setLoading(false)
                    return getErrorMessage(err)
                  },
                })
              }}
              className="w-fit"
              disabled={isUploading || !files}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {uploadedFiles.length > 0 ? (
        <UploadedFilesCard uploadedFiles={uploadedFiles} />
      ) : null}
    </div>
  )
}
