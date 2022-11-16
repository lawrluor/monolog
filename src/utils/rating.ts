// Rating is a class that represents video metadata.
// We export function that construct a Rating object.
// You can construct from a filename by reading from local storage or by passing
// in required values.
// Attributes are accessed with the '.' operator.
import { getRating, readFile } from '../utils/localStorageUtils';

// Tries to create a rating from a file.
// Best effort to create backwards-compatible legacy rating object.
// Returns null if we can't create one from file.
export const createRatingFromFile = async (filename:string):
    Promise<Rating> => {
  try {
    return new Rating(JSON.parse(await readFile(filename)));
  } catch (error) {
    // Try creating from a legacy rating file.
    let rating = await getRating(filename)
    if (rating.length != 3) {
      // rating file is malformed, exit.
      return null;
    }
    let ratingJson = {
      filename: filename,
      emoji: rating.substring(0,2),
      index: rating[2],
      isCameraOn: "true"
    };
    return new Rating(ratingJson);
  }
}

// Create Rating from video metadata, can't fail.
// We don't set filename because we didn't read from a file.
export const createRatingFromMetadata = (
    emoji:string, index:number, isCameraOn:boolean):Rating => {
  return new Rating({
      emoji: emoji,
      index: index,
      isCameraOn: true
  });
}

class Rating {
   // This Rating was parsed from this file stored at filename.
   filename:string;

   // emoji is the emoji selected by a user.
   emoji:string;

   // TODO(ryanluo): Create a central emoji util.
   // index of the emoji, references the Rating file.
   index:number;

   // Was the associated video recorded with camera off?
   isCameraOn:boolean;

   // Expects that ratingJson is well-formed with the following structure:
   // {
   //   emoji: "{EMOJI}"
   //   index: "{NUMBER}"
   //   isCameraOn: "{IS_CAMERA_ON}"
   // }
   constructor(ratingJson:any) {
     if ("filename" in ratingJson) {
       this.filename = ratingJson.filename;
     } else {
       this.filename = ""
     }
     this.emoji = ratingJson.emoji;
     this.index = parseInt(ratingJson.index);

     // Parse to boolean.
     this.isCameraOn = JSON.parse(ratingJson.isCameraOn);
   }

    public toString = () : string => {
      return JSON.stringify({
        filename: this.filename,
        emoji: this.emoji,
        index: this.index,
        isCameraOn: this.isCameraOn
      });
    }
}
