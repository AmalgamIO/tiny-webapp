import React, {useContext, useEffect, useState, useRef} from "react";
import {FileMeta, ICoords, IMetaData} from "~/component/FileMeta";
import SignedFile from "~/component/SignedFile";
import {Link, Outlet, Route, Routes, useLocation} from "react-router-dom";
// import {PageLayout} from "~/component/PageLayout";
import sample_image from "~/assets/GPS_Yes_IMG_0526.jpg";
import {IMap, isLocationPath} from "~/util/PromiseTool";
// import {GlobalContext} from "~/context/GlobalContext";


export const Capture: React.FC = () => {
  // const isHere = isLocationPath(useLocation())()
  const [metaData, setMetaData] = useState<IMetaData & IMap>();
  const [coordinates, setCoordinates] = useState<ICoords | null>(null);
  // const context = useContext(GlobalContext);
  const [fields, setFields] = useState<IMap | null>(null);
  const [action, setAction] = useState("");

  // if (!context) {
  //   throw new Error('GlobalContext only available within GlobalProvider');
  // }

  const onFile = (fileMeta: FileMeta) => {
    console.log({fileMeta})
    // fileMeta.getMetaData().then(setMetaData);
    fileMeta.getGPSCoords().then(setCoordinates)
  }

  const onSubmit = (endpoint: string) => (formData: any) => {
    console.log({endpoint})
    const requestInit: RequestInit = {
      redirect: "follow",
      method: 'POST',
      body: formData as FormData
    };
    fetch(endpoint, requestInit)
    .then((response) =>
      response.json().then(json => setMetaData(metaData => ({...json, ...metaData})))
    )
    .catch(error => console.error('Fetch error:', error))
  }

  useEffect(() => {
    const sigV4Opts = {bucket: "report-it-dev1", redir: "/received"}
    setAction("form_action")
    // context.getSigV4Data(sigV4Opts)
    // .then(({form_fields, form_action}) => {
    //   form_action && setAction(form_action);
    //   form_fields && setFields(form_fields);
    // })
    // .catch((e: any) => alert(e.message));
  }, []);



  const [isRecording, setIsRecording] = useState(false);
  const [userAudio, setUserAudio] = useState<{ data: Blob; url: string }>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setUserAudio({ data: blob, url: URL.createObjectURL(blob) })
        chunksRef.current = [];
      };

      setIsRecording(true);

      // Automatically stop recording after 20 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 20000);
    }).catch((error) => {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required to record audio.");
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendDescription = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log("Yoho")
    console.log("Sending " + userAudio?.url)
  };

  return fields && (<div className="mt-4">
    <div>{
      <SignedFile fields={fields} onFile={onFile} onSubmit={onSubmit(action)} submitLabel="Send Photo"/>
    }</div>
    <div>{coordinates &&
      <div>
        <div>{`https://maps.google.com/?q=${coordinates?.lat},${coordinates?.lng}`}</div>
        <a target="_blank" rel="noopener noreferrer" href={`https://maps.google.com/?q=${coordinates?.lat},${coordinates?.lng}`}>
          Find It
        </a>
      </div>
    }</div>
    {
    <div>
        <h2>Audio Recorder</h2>
        <button onClick={startRecording} disabled={isRecording}>
          {isRecording ? "Recording..." : "Start Recording"}
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
        {userAudio && (<>
          <div>
            <h3>Recorded Audio</h3>
            <audio controls src={userAudio.url}></audio>
          </div>

          <button onClick={sendDescription}>
        {isRecording ? "Recording..." : "Send Description"}
          </button>
        </>
        )}
      </div>

    }
    {
    metaData && <div>
      <h2>Metadata:</h2>
      <pre>{JSON.stringify(metaData, null, 2)}</pre>
    </div>
    }
  </div>)
};




//
// return (!(fileElem)) ? <></> : (
//
//
//     {coordinates && (
//       <div>
//         <div>{`https://maps.google.com/?q=${coordinates?.lat},${coordinates?.lng}`}</div>
//         <a target="_blank" rel="noopener noreferrer" href={`https://maps.google.com/?q=${coordinates?.lat},${coordinates?.lng}`}>
//           Find It
//         </a>
//       </div>
//     )}
//     {metaData && (
//       <div>
//         <h2>Metadata:</h2>
//         <pre>{JSON.stringify(metaData, null, 2)}</pre>
//       </div>
//     )
//     }
//
//   </>
// );


// <Routes>
//   <Route>
//     <Route element={<PageLayout title={"Recipe"}/>}>
//       <Route path="/power" element={<div className={`tab-pane in ${isHere('create')} h-100 w-100`}><h1>Create</h1></div>}/>
//       <Route path="/road" element={<ScanRecipe/>} />
//       <Route path="/water" element={<div className={`tab-pane in ${isHere('water')} h-100 w-100`}><h1>View</h1></div>}/>
//     </Route>
//   </Route>
// </Routes>
//
//
// <Routes>
//   <Route>
//     <Route element={<FormLayout />} >
//       {/*<Route path="/" element={<Index />} />*/}
//       <Route path="/power" element={<>
//         <h1>power</h1>
//         {fileElem}
//
//       </>} />
//       <Route path="/road" element={<>
//         <h1>road</h1>
//         {fileElem}
//       </>} />
//       <Route path="/water" element={<>
//         <h1>water</h1>
//         {fileElem}
//       </>} />
//     </Route>
//   </Route>
// </Routes>
//
// <li className="nav-item dropdown">
//   <Link to="/report-it/power" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
//         aria-expanded="false">Report It</Link>
//   <ul className="dropdown-menu">
//
//     <li>
//       <Link to="/report-it/power" className="dropdown-item">Power</Link>
//     </li>
//     <li>
//       <Link to="/report-it/road" className="dropdown-item">Road</Link>
//     </li>
//     <li>
//       <hr className="dropdown-divider" />
//     </li>
//     <li>
//       <Link to="/report-it/water" className="dropdown-item">Water</Link>
//     </li>
//
//   </ul>
// </li>
//
//
// return (<>
//     <h1>Capture: {which}</h1>
//     <CameraUpload fields={fields} action={action} />
//   </>)
// }

const FormLayout: React.FC = () => {

  return (
    <div
      key="FormLayoutComponent"
      className="p-0 m-0 w-100 d-block theme navbar-expand-lg"
    >

      <div>
        <img src={sample_image} style={{ width: '5em', height: '5em'  }} />
        <div>
          <h6>download that image for testing</h6>
          If you need one that (for sure) contains EXIF GPS data.
        </div>
      </div>
      <Outlet />

    </div>
  )
}

