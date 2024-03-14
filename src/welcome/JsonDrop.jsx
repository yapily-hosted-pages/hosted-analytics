import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const JsonDrop = ({ onDropped, label }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          onDropped(json);
        } catch (err) {
          console.error("Error parsing JSON file:", err);
        }
      };

      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-4 rounded-md ${
        isDragActive ? "border-green-200" : ""
      }`}
    >
      <input {...getInputProps()} />
      <p>{label}</p>
    </div>
  );
};
