// Rating is a class that represents video metadata.
// We export function that construct a Rating object.
// You can construct from a filename by reading from local storage or by passing
// in required values.
// Attributes are accessed with the '.' operator.
import { readFile, writeFile } from '../utils/localStorageUtils';

type RatingJSON = {
  emoji: string;
  index: string;
  isCameraOn: string;
}

// Tries to create a rating from a file.
// Best effort to create backwards-compatible legacy rating object.
// Returns null if we can't create one from file.
export const createRatingFromFile = async (filename: string):
  Promise<Rating | undefined> => {

  try {
    let content = await readFile(filename);

    // Check for specific legacy rating format.
    if (content.length == 3) {
      let index = content[2];
      if (index === undefined) throw new Error("index is undefined");

      let rating = {
        emoji: content.substring(0, 2),
        index: index,
        isCameraOn: "true"  // default value for legacy ratings.
      }

      return new Rating(rating);
    }

    let rating = JSON.parse(content);
    return new Rating(rating);
  } catch (error: Error | unknown) {
    console.error("[ERROR] rating.ts:createRatingFromFile", error);
    return
  }
}

// Create Rating from video metadata, can't fail.
export const createRatingFromMetadata = (
  emoji: string, index: number, isCameraOn: boolean): Rating => {
  return new Rating({
    emoji: emoji,
    index: index.toString(),
    isCameraOn: JSON.stringify(isCameraOn)
  });
}

class Rating {
  // emoji is the emoji selected by a user.
  emoji: string;
  index: number;
  isCameraOn: boolean;

  // Expects that ratingJson is well-formed with the following structure:
  // {
  //   emoji: "{EMOJI}"
  //   index: "{NUMBER}"
  //   isCameraOn: "{IS_CAMERA_ON}"
  // }

  constructor(ratingJson: RatingJSON) {
    this.emoji = ratingJson.emoji;
    this.index = parseInt(ratingJson.index);
    this.isCameraOn = JSON.parse(ratingJson.isCameraOn);  // Parse to boolean.
  }

  public toString = (): string => {
    return JSON.stringify({
      emoji: this.emoji,
      index: this.index,
      isCameraOn: this.isCameraOn
    });
  }

  public writeRatingToFile = async (filename: string): Promise<boolean> => {
    return await writeFile(filename, this.toString());
  }
}
