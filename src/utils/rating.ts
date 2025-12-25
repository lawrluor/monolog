// Rating is a class that represents video metadata.
// We export function that construct a Rating object.
// You can construct from a filename by reading from local storage or by passing
// in required values.
// Attributes are accessed with the '.' operator.
import { readFile, writeFile } from '../utils/localStorageUtils';

// Tries to create a rating from a file.
// Best effort to create backwards-compatible legacy rating object.
// Returns null if we can't create one from file.
export const createRatingFromFile = async (filename:string):
    Promise<Rating | undefined>  => {
  try {
    let content = await readFile(filename);
    if (content.length == 3) {
      let rating = {
        emoji: content.substring(0,2),
        index: content[2],
        isCameraOn: "true"  // default value for legacy ratings.
      }
      return new Rating(rating);
    }
    let rating = JSON.parse(content);
    return new Rating(rating);
  } catch {
    return;
  }
}

// Create Rating from video metadata, can't fail.
export const createRatingFromMetadata = (
    emoji:string, index:number, isCameraOn:boolean): Rating => {
  return new Rating({
      emoji: emoji,
      index: index.toString(),
      isCameraOn: JSON.stringify(isCameraOn)
  });
}

class Rating {
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
     this.emoji = ratingJson.emoji;
     this.index = parseInt(ratingJson.index);

     // Parse to boolean.
     this.isCameraOn = JSON.parse(ratingJson.isCameraOn);
   }

    public toString = () : string => {
      return JSON.stringify({
        emoji: this.emoji,
        index: this.index,
        isCameraOn: this.isCameraOn
      });
    }

    public writeRatingToFile = async (filename:string): Promise<boolean> => {
      return await writeFile(filename, this.toString());
    }
}
