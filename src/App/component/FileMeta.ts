import * as piexif from 'piexif-ts';
import { Optional } from 'typescript-optional';
import {ExifFieldNames, IExif, IExifElement} from "piexif-ts/dist/interfaces";

type IMap = { [k: string | number]: any; }

export interface IFileMeta {
  file: File;
  getMetaData: () => Promise<IMetaData>;
  getDataURL: () =>  Promise<string>;
  getBrowserGeolocation: () => Promise<ICoords>;
  getGPSCoords: () => Promise<ICoords | null>;
  dmsToDecimal: (dms: number[]) => number;
  convertExifGpsToDecimal: (gpsData: any) => ICoords;
  resizeImageToMaxSize: (file: File, maxSizeBytes: number) => Promise<File>
}

export interface ICoords { lat: number | string; lng: number | string }

export type IMetaDataNames = Exclude<ExifFieldNames, "thumbnail">;

// The metadata structure
export type IMetaData = { [K in IMetaDataNames]?: IMap; };

/**
 * A File wrapper that makes accessible EXIF metadata, A dataURL, the GPS coordinates.
 */
export class FileMeta implements IFileMeta{

  file: File;

  static metadata: IMetaData;

  /**
   * Create an IFileMeta object.
   *
   * @param selectedFile
   */
  constructor(selectedFile: File) {
    if (selectedFile?.size < 1) throw new TypeError("'file' cannot be empty or null")
    // const self = this;
    this.file = selectedFile
    this.resizeImageToMaxSize(selectedFile, 1 * 1 * 1024).then(f => this.file = f);
  }


  /**
   * Extracts the meta, if available.
   *
   * @return Promise<IMetaData>
   *
   */
  async getMetaData(): Promise<IMetaData> {
    
    if (FileMeta.metadata) return Promise.resolve(FileMeta.metadata)

    const dataUrl = await this.getDataURL();
    let exifData = null;

    try {
      exifData = piexif.load(dataUrl) as IExif;
    }
    catch (e: any) {
      console.log(e.message)
      throw new Error(JSON.stringify({
        error: "get metadata fail.",
        message: e?.message
      }))
    }

    if (exifData) {
      const makeDataTree = <T extends IMetaData>() => (
        prev: IMetaData,
        {tagKey, exifElem}: { tagKey: IMetaDataNames; exifElem: IExifElement; }
      ): IMetaData => {
        prev[tagKey] = Object.keys(exifElem)
        .map(Number)
        .map((exIfKey) => [exIfKey, piexif.Tags[tagKey][exIfKey]?.name] as [number, string])
        .filter((exIfKey_tagName) => exIfKey_tagName[1] != null)
        .map(([exIfKey, tagName]) => ({tagName, elem: exifElem[exIfKey]}))
        .reduce((store, {tagName, elem}) => {
          store[tagName] = elem;
          return store;
        }, {} as IMap);
        return prev;
      };

      FileMeta.metadata = Object.entries(exifData)
      .filter(([k, v]) => k !== 'thumbnail')
      .map(([k, v]) => ({tagKey: k as IMetaDataNames, exifElem: v}))
      .reduce(makeDataTree<IMetaData>(), {} as IMetaData);
    }

    return FileMeta.metadata;
  };


  // handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;
  //
  //   const MAX_FILE_SIZE_MB = 1; // Maximum file size (1MB)
  //   const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  //
  //   let resizedFile = file;
  //
  //   // If file is too large, start resizing process
  //   if (file.size > MAX_FILE_SIZE_BYTES) {
  //     resizedFile = await this.resizeImageToMaxSize(file, MAX_FILE_SIZE_BYTES);
  //   }
  //
  //   console.log('Resized or Original File:', resizedFile);
  //
  //   // For preview purposes
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     // setImagePreview(e.target?.result as string);
  //   };
  //   reader.readAsDataURL(resizedFile);
  // };

  resizeImageToMaxSize = (file: File, maxSizeBytes: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      console.log({ size: file.size, maxSizeBytes });

      if (file.size <= maxSizeBytes) resolve(file);
      else {
        img.onload = () => {
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');

          const originalWidth = img.width;
          const originalHeight = img.height;
          let width = originalWidth;
          let height = originalHeight;
          let quality = 0.9; // Start with high quality for JPEG format
          const scaleFactor = 0.9; // Scaling factor to gradually reduce size
          const MIN_RESOLUTION = 300; // Minimum resolution (e.g., 300px)

          const resizeAndCheckSize = () => {
            if (width <= MIN_RESOLUTION || height <= MIN_RESOLUTION) {
              // If resolution goes below minimum, apply grayscale
              width = Math.max(width, MIN_RESOLUTION);
              height = Math.max(height, MIN_RESOLUTION);

              canvas.width = width;
              canvas.height = height;

              ctx?.drawImage(img, 0, 0, width, height);

              console.log({img, width, height});
              // Apply grayscale filter
              const imageData = ctx?.getImageData(0, 0, width, height);
              if (imageData && ctx) {
                for (let i = 0; i < imageData.data.length; i += 4) {
                  const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                  imageData.data[i] = avg; // Red
                  imageData.data[i + 1] = avg; // Green
                  imageData.data[i + 2] = avg; // Blue
                }
                ctx.putImageData(imageData, 0, 0);
              }

              canvas.toBlob((blob) => {
                if (!blob) {
                  reject(new Error('Grayscale conversion failed'));
                  return;
                }
                const grayscaleFile = new File([blob], file.name, { type: file.type });
                resolve(grayscaleFile);
              }, file.type);
            } else {
              // Resize normally
              canvas.width = width;
              canvas.height = height;

              ctx?.clearRect(0, 0, canvas.width, canvas.height);
              ctx?.drawImage(img, 0, 0, width, height);

              canvas.toBlob((blob) => {
                if (!blob) {
                  reject(new Error('Resizing failed'));
                  return;
                }

                // If the file size is below the maximum size, return it
                if (blob.size <= maxSizeBytes || quality <= 0.1) {
                  const resizedFile = new File([blob], file.name, { type: file.type });
                  resolve(resizedFile);
                } else {
                  // Reduce width, height and quality, and try again
                  width = width * scaleFactor;
                  height = height * scaleFactor;
                  quality = quality * scaleFactor; // Reduce quality gradually for JPEG

                  // Retry resizing with new dimensions and quality
                  resizeAndCheckSize();
                }
              }, file.type, quality);
            }
          };

          resizeAndCheckSize();
        };
      }

      img.onerror = (err) => {
        reject(err);
      };

      img.src = url;
    });
  };

  getDataURL = (): Promise<string> =>
    new Promise((resolve, reject) => {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) =>
          Optional.ofNullable(e.target?.result as string).ifPresentOrElse(resolve, () => reject('no image data.'));
        reader.readAsDataURL(this.file);
      } else {
        reject('Does not contain a File');
      }
    });

  getBrowserGeolocation(): Promise<ICoords> {
    return new Promise((resolve, reject) =>
      Optional.ofNullable(navigator.geolocation).ifPresentOrElse(
        (nav_location) => {
          try {
            nav_location.getCurrentPosition(
              (position) => {
                const {
                  coords: {latitude: lat, longitude: lng},
                } = position;
                resolve({lat, lng});
              },
              (error) => reject(error)
            )
          }
          catch(e:any) {
            reject(e)
          }
        },
        () => reject('Geolocation is not supported by this browser.')
      )
    );
  }

  async getGPSCoords(): Promise<ICoords | null> {
    let coords: ICoords;
    let meta: IMetaData = await this.getMetaData();

    if (meta?.GPS) coords = this.convertExifGpsToDecimal(meta.GPS)
    else coords = await this.getBrowserGeolocation();

    return coords;
  }

  dmsToDecimal = (dms: number[]): number => {
    const degrees = dms[0];
    const minutes = dms[1] / 60;
    const seconds = dms[2] / 3600;
    // const fraction = dms[3] / dms[4] / 3600;
    return degrees + minutes + seconds // + fraction;
  };

  private collapseGPS(gpsData: number[][]) {
    return gpsData.flat()
    .map(Number)
    .map((value: number, index: number, ary: number[]) => value / ary[index + 1])
    .filter((v, index) => (index % 2) == 0);
  }

  convertExifGpsToDecimal(gpsData: any): ICoords {
    const latDms = this.collapseGPS(gpsData["GPSLatitude"]);
    const lonDms = this.collapseGPS(gpsData["GPSLongitude"])

    const lat = (gpsData["GPSLatitudeRef"] === 'N' ? 1 : -1) * this.dmsToDecimal(latDms);
    const lng = (gpsData["GPSLongitudeRef"] === 'E' ? 1 : -1) * this.dmsToDecimal(lonDms);

    return { lat, lng };
  }

}
