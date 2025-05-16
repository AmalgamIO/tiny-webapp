import React, {useState, useEffect, useContext} from 'react';
import {FileMeta} from "~/component/FileMeta";
import {GlobalContext} from "~/context/GlobalContext";
import SignedFile from "~/component/SignedFile";
import {IMap, isLocationPath} from "~/util/PromiseTool";
import {useLocation} from "react-router-dom";

export type IScanRecipeProps = {
  title?: string;
};

const ScanRecipe: React.FC<IScanRecipeProps> = () => {
  const context = useContext(GlobalContext);
  const [parsed, setParsed] = useState<any>(null);
  const [fields, setFields] = useState<IMap | null>(null);
  const [action, setAction] = useState("");

  if (!context) {
    throw new Error('GlobalContext only available within GlobalProvider');
  }

  useEffect(() => {
    context.getSigV4Data({
      bucket: "report-it-dev1",
      redir: "/parse"
    })
    .then(({form_fields, form_action}) => {
      form_action && setAction(form_action);
      form_fields && setFields(form_fields);
    });
  }, []);

  const onFile = (fileMeta: FileMeta) => {
    const file = fileMeta.file;
    if (file) {
      console.log(`Got ${file.name}`)
    }
    else {
      alert("Error")
    }
  }


  const onSubmit = (formData: any) =>
    fetch(action, {
      redirect: "follow",
      method: 'POST',
      body: formData as FormData
    })
    .then((response) => response.json().then(setParsed))
    .catch(error => console.error('Fetch error:', error));

  const isHere = isLocationPath(useLocation())()

  return (
    <div id="import" className={`tab-pane in ${isHere('import')} h-100 w-100`}>
      <div className="mt-5 ms-2">
        <h1>Import a recipe</h1>
        <div>
          {fields && <SignedFile fields={fields} onSubmit={onSubmit} submitLabel="Do OCR" />}
        </div>
        { parsed ? <div><h4>Parsed:</h4>{parsed.text}</div>: <></>}
      </div>
    </div>

  );
};

export default ScanRecipe;

