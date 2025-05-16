import {ChangeEvent, useState} from "react";

function UploadComponent() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [signedUrl, setSignedUrl] = useState(null);

  const getSignedUrl = async (filePath: string) => {
    const response = await fetch(`/get-signed-url?filePath=${filePath}`);
    const data = await response.json();
    setSignedUrl(data?.signedUrl);
  };

  const handleFileUpload = async  (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setFile(file);

    if (file) {
      // Get the signed URL for the file
      await getSignedUrl(file.name);

      if (signedUrl) {
        // Perform the file upload to the signed URL
        await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        console.log("File uploaded successfully!");
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default UploadComponent;
