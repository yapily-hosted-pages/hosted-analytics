import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const JsonDropzone = ({ onJsonDropped }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          onJsonDropped(json);
        } catch (err) {
          console.error("Error parsing JSON file:", err);
        }
      };

      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-4 rounded-md">
      <input {...getInputProps()} />
      <p>Drag and drop the logs here to see the funnel and bank distribution</p>
    </div>
  );
};

export default JsonDropzone;
