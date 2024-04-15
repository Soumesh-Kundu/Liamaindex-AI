"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
export default function FileUpload() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router=useRouter()
  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
      }
    }
  }

  async function handleSubmitFile(e: any): Promise<void> {
    if (files.length === 0) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setLoading(false);
      }
      router.push('/')
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    // <div className="flex items-start justify-center h-screen">
    <form
      className={`${
        dragActive ? "bg-blue-400" : "bg-gray-100"
      }  p-4 w-1/4 rounded-lg   text-center flex flex-col items-center justify-center`}
      onDragEnter={handleDragEnter}
      onSubmit={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
      <input
        placeholder="fileInput"
        className="hidden"
        ref={inputRef}
        type="file"
        onChange={handleChange}
        accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
      />

      <p>
        Drag & Drop files or{" "}
        <span
          className="font-bold text-blue-600 cursor-pointer"
          onClick={openFileExplorer}
        >
          <u>Select files</u>
        </span>{" "}
        to upload
      </p>

      <div className="flex flex-col items-center p-3">
        {files.map((file: any, idx: any) => (
          <div key={idx} className="flex flex-row space-x-5">
            <span>{file.name}</span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => removeFile(file.name, idx)}
            >
              remove
            </span>
          </div>
        ))}
      </div>

      <Button
        className="bg-black rounded-lg  mt-3 w-auto"
        onClick={handleSubmitFile}
      >
        {isLoading ? (
          <span className="px-1 ">
          <l-dot-wave size={40} speed={1.6} color="white"></l-dot-wave>
          </span>
        ) : (
          <span className="px-1 text-white">Submit</span>
        )}
      </Button>
    </form>
    // </div>
  );
}
