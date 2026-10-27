import { FileDropzone } from "@/registry/cuelark/ui/file-dropzone";

export default function FileDropzoneDemo() {
  return <FileDropzone className="w-full max-w-md" maxSize={10 * 1024 * 1024} hint="PNG, JPG or PDF · up to 10 MB" />;
}
