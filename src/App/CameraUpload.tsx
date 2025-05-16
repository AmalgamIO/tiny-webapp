import React, { useState, ChangeEvent, useEffect } from 'react';
import {FileMeta, ICoords, IMetaData} from "~/component/FileMeta";
import {IMap} from "~/util/PromiseTool";
// import * as Ramda from "ramda";



export type ICameraUploadProps = { fields: IMap, action: string };

const CameraUpload: React.FC<ICameraUploadProps> = ({ fields, action }) => {
  const [imgData, setImgData] = useState<string>();
  const [coordinates, setCoordinates] = useState<ICoords | null>(null);
  const [fileFuture, setFileFuture] = useState<FileMeta>();
  const [metaData, setMetaData] = useState<IMetaData & IMap>();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    try {
      if (file) {
        const imageBox = new FileMeta(file);
        setFileFuture(imageBox);

        imageBox.getMetaData().then(setMetaData);
        imageBox.getGPSCoords().then(setCoordinates)
        imageBox.getDataURL().then(setImgData);
      }
    }
    catch(e: any) {
      alert(e.message)
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();

    // Add the necessary fields to the formData
    Object.entries(fields)
      .forEach((entry) => formData.append(...entry))

    const file = fileFuture?.file
    // Add image file
    if (file) {
      formData.append("Content-Type", file?.type);
      formData.append('file', file, String(file?.name));
    }

    const requestInit: RequestInit = {
      redirect: "follow",
      method: 'POST',
      body: formData as FormData
    };

    console.log({action, requestInit})
    fetch(action ?? "/", requestInit)
    .then((response) => response.text()
      .then(jsonStr => JSON.parse(jsonStr) as IMap)
      .then(respDat => setMetaData({...metaData, ...respDat}))
    )
    .catch(error => console.error('Fetch error:', error))
  }



  return (
    <div>
      <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
      <h1>Camera Upload</h1>
      <input
        type="file"
        accept="image/*"
        capture="environment" // or "user" for the front-facing camera
        onChange={onChange}
      />
        <button type="submit" hidden={imgData == null}>Upload to S3</button>
      </form>
      {imgData && (
        <div>
          <h2>Preview:</h2>
          <img src={imgData} alt="Captured" style={{ width: '300px' }} />
        </div>
      )}
      {coordinates && (
        <div>
          <div>{`https://maps.google.com/?q=${coordinates?.lat},${coordinates?.lng}`}</div>
          <a target="_blank" rel="noopener noreferrer" href={`https://maps.google.com/?q=${coordinates?.lat},${coordinates?.lng}`}>
            Find It
          </a>
        </div>
      )}
      {metaData && (
        <div>
          <h2>Metadata:</h2>
          <pre>{JSON.stringify(metaData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CameraUpload;


// import {FileMeta, ICoords, IMetaData} from "~/component/FileMeta";

// const extractExifGps = (dataUrl: string, file: File) => {
//   try {
//     const exifObj = piexif.load(dataUrl);
//     const gpsData: IExifElement | undefined = exifObj.GPS;
//
//     if (gpsData && Object.keys(gpsData).length > 0) {
//       const gpsCoordinates = convertExifGpsToDecimal(gpsData);
//       setCoordinates(gpsCoordinates);
//     } else {
//       getBrowserGeolocation();
//     }
//   } catch (error) {
//     console.error('Error reading EXIF data:', error);
//     getBrowserGeolocation();
//   }
// };




// const getBrowserGeolocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCoordinates({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       (error) => {
//         console.error('Error getting geolocation:', error);
//       }
//     );
//   } else {
//     console.error('Geolocation is not supported by this browser.');
//   }
// };

// useEffect(() => {
//   if (fileMeta) {
//     fileMeta.getGPSCoords().then(setCoordinates);
//     fileMeta.getMetaData().then(setMetaData);
//     fileMeta.getDataURL().then(setImgData);
//   }
// }, [fileMeta, fileMeta?.file]);

// Example EXIF GPS data
// const exifGpsData = {
//   "1": "1 -> GPSLatitudeRef: N",
//   "2": "2 -> GPSLatitude: 45,1,32,1,1334,100",
//   "3": "3 -> GPSLongitudeRef: W",
//   "4": "4 -> GPSLongitude: 122,1,35,1,2967,100",
//   "5": "5 -> GPSAltitudeRef: 0",
//   "6": "6 -> GPSAltitude: 144054,2087",
//   "12": "12 -> GPSSpeedRef: K",
//   "13": "13 -> GPSSpeed: 0,1",
//   "16": "16 -> GPSImgDirectionRef: T",
//   "17": "17 -> GPSImgDirection: 738875,2169",
//   "23": "23 -> GPSDestBearingRef: T",
//   "24": "24 -> GPSDestBearing: 738875,2169",
//   "29": "29 -> GPSDateStamp: 2024:07:27",
//   "31": "31 -> GPSHPositioningError: 35,1"
// };

// Create Google Maps URL
// const googleMapsUrl = `https://www.google.com/maps/place/${coordinates?.lat}+${coordinates?.lng}`;
// console.log(`Google Maps URL: ${googleMapsUrl}`);

