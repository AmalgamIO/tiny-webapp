import React, {useState, ChangeEvent} from 'react';
import {FileMeta } from "~/component/FileMeta";
type IMap = { [k: string | number]: any; }

export type ISignedFileProps = {
  fields: IMap,
  submitLabel: string,
  onFile?: (fileMeta: FileMeta) => void,
  onSubmit?: (formData: any) => void
};

const SignedFile: React.FC<ISignedFileProps> = ({ fields, onFile, onSubmit, submitLabel = "Upload" }) => {
  const [imgData, setImgData] = useState<string>();
  const [fileMeta, setFileMeta] = useState<FileMeta>();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    try {
      if (file) {
        const meta = new FileMeta(file);
        setFileMeta(meta);
        meta.getDataURL().then(setImgData);
        if (onFile) onFile(meta)
      }
    }
    catch(e: any) {
      alert(e.message)
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();


    // Add name-value fields first
    Object.entries(fields).forEach((entry) => formData.append(...entry))

    const file = fileMeta?.file

    // Add file last
    if (file) {
      formData.append("Content-Type", file?.type);
      formData.append('file', file, String(file?.name));
    }

    if (onSubmit) onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
    <input
      type="file"
      accept="image/*"
      capture="environment"
      onChange={onChange}
    />
      <button type="submit" hidden={imgData == null}>{submitLabel}</button>

      <div>
        {imgData && (
          <div>
            <h2>Preview:</h2>
            <img src={imgData} alt="Captured" style={{ width: '300px' }} />
          </div>
        )}
      </div>
    </form>
  );
};

export default SignedFile;
