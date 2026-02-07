// Currently, we are using Expo FileSystem to handle local storage.
// This util file holds reusable code for:
// creating local file directories
// writing new local files
// retrieving local files
// TODO: consider refactoring/moving code handling local storage from other files to here.

import * as FileSystem from 'expo-file-system';
import { filteredWords, removePunctuation } from './textProcessing';
import { createRatingFromFile } from './rating';

export const USER_DATA_DIRECTORY = FileSystem.documentDirectory + 'userData/';
export const TRANSCRIPT_DIRECTORY = FileSystem.documentDirectory + 'transcripts/';
export const THUMBNAIL_DIRECTORY = FileSystem.documentDirectory + 'thumbnails/';
export const RATING_DIRECTORY = FileSystem.documentDirectory + 'rating/';
export const VIDEO_DIRECTORY = FileSystem.documentDirectory + 'videos/';

export const INITIAL_USER_DATA = {
  'onboarded': false,
  'cameraPermission': false,
  'micPermission': false,
  'speechToTextPermission': false,
  'tutorialMode': true,
  'firstName': "",
  'lastName': "",
  'email': "",
  'gender': "",
  'pronouns': "",
  'age': "0",
  'pathways': {},
  'currentPathway': '',
  'signupDateTime': Date.now()
};

export const readFile = async (uri: string): Promise<string> => {
  return await FileSystem.readAsStringAsync(uri)
    .then((content: string) => {
      return content;
    })
    .catch((err: any) => {
      console.log("[ERROR]: localStorageUtils.tsx:readFile", err);
      return "";
    });
}

export const writeFile =
  async (uri: string, content: string): Promise<boolean> => {
    return await FileSystem.writeAsStringAsync(uri, content)
      .then(() => { return true })
      .catch((err) => {
        console.log("[ERROR] localStorageUtils:writeFile:", err);
        return false;
      });
  }

export const checkVideoDirectory = async () => {
  let result = await FileSystem.getInfoAsync(VIDEO_DIRECTORY).then(
    ({ exists }) => {
      return exists ? true : false;
    }).catch(
      error => {
        console.log("[ERROR] VideosContext:FileSystem.getInfoAsync:", error);
        return false;
      });

  return result;
}

export const createVideoDirectory = async () => {
  try {
    let directoryAlreadyExists = await checkVideoDirectory();
    if (directoryAlreadyExists) return true;

    FileSystem.makeDirectoryAsync(VIDEO_DIRECTORY)
      .then(() => { return Promise.resolve(true) })
      .catch((err: any) => {
        console.log("[ERROR] localStorageUtils:createVideoDirectory", err);
        return Promise.reject(false);
      })
  } catch (err: any) {
    console.log("[ERROR] localStorageUtils:createVideoDirectory", err);
    return Promise.reject(false);
  }
}

export const checkTranscriptDirectory = async () => {
  try {
    return await FileSystem.getInfoAsync(VIDEO_DIRECTORY)
      .then(({ exists }) => {
        return Promise.resolve(exists);
      }).catch((err: any) => {
        console.log("[ERROR] VideosContext:FileSystem.getInfoAsync:", err);
        return Promise.reject(false);
      });
  } catch (err: any) {
    console.log("[ERROR] VideosContext:FileSystem.getInfoAsync:", err);
    return Promise.reject(false);
  }
}

export const createTranscriptDirectory = async () => {
  try {
    let directoryExists = await checkTranscriptDirectory();
    if (directoryExists) return Promise.resolve(true);  // return early

    return await FileSystem.makeDirectoryAsync(TRANSCRIPT_DIRECTORY)
      .then(() => { return Promise.resolve(true) })
      .catch((err: any) => {
        console.log("[ERROR] localStorageUtils: createTranscriptDirectory", err);
        return Promise.reject(false);
      });
  } catch (err: any) {
    console.log("[ERROR] localStorageUtils: createTranscriptDirectory", err);
    return Promise.reject(false);
  }
}

// TODO: refactor into Check and Create functions
export const createThumbnailDirectory = async () => {
  try {
    return await FileSystem.getInfoAsync(THUMBNAIL_DIRECTORY).then(
      async ({ exists }) => {
        if (!exists) {
          return await FileSystem.makeDirectoryAsync(THUMBNAIL_DIRECTORY)
            .then(() => { return Promise.resolve(true) })
            .catch((err: any) => {
              console.log("[ERROR] localStorageUtils: createThumbnailDirectory", err);
              return Promise.reject(false);
            });
        }

        // Exists already
        return Promise.resolve(true);
      }
    ).catch((err: any) => {
      console.log("[ERROR] Recording:Thumbnail:getInfoAsync:", err);
    }
    );
  } catch (err: any) {
    console.log("[ERROR] localStorageUtils: createThumbnailDirectory", err);
    return Promise.reject(false);
  }
}

export const checkFileExists = async (filename: string) => {
  try {
    return await FileSystem.getInfoAsync(filename)
      .then(({ exists }) => {
        return Promise.resolve(exists);
      }).catch((err: any) => {
        console.log(`[ERROR] localStorageUtils:checkFileExists(${filename}):`, err);
        return Promise.reject(false);
      });
  } catch (err: any) {
    console.log(`[ERROR] localStorageUtils:checkFileExists(${filename}):`, err);
    return Promise.reject(false);
  }
}

export const createDirectory = async (directory: string) => {
  try {
    let directoryExists = await checkFileExists(directory);
    if (directoryExists) return true;

    return await FileSystem.makeDirectoryAsync(directory)
      .then(() => { return Promise.resolve(true) })
      .catch((err: any) => {
        console.log(`[ERROR] localStorageUtils:createDirectory: ${directory}`, err);
        return Promise.reject(false);
      });
  } catch (err: any) {
    console.log(`[ERROR] localStorageUtils:createDirectory: ${directory}`, err);
    return Promise.reject(false);
  }
}

// TODO: If a promise fails, should we be allowed to continue?
export const createAllDirectories = async () => {
  let directories: string[] = [USER_DATA_DIRECTORY, TRANSCRIPT_DIRECTORY, THUMBNAIL_DIRECTORY, RATING_DIRECTORY, VIDEO_DIRECTORY];
  let promises = directories.map((d: string) => createDirectory(d));
  return await Promise.all(promises);
}

export const checkUserDataDirectory = async () => {
  let directoryExists = await FileSystem.getInfoAsync(USER_DATA_DIRECTORY).then(
    // TODO: check error handling on making the directory
    ({ exists }) => {
      return exists;
    }).catch((error) => {
      console.log("[ERROR] localStorageUtils:checkUserDataDirectory: ", error, "This is probably because it doesn't exist yet.");
      return false;
    });

  // TODO: can also use resolve/reject instead of back-passing a variable up and returning at end
  return directoryExists;
}

// Create User data directory if not already existing.
export const createUserDataDirectory = async () => {
  try {
    let directoryExists = await checkUserDataDirectory();
    if (!directoryExists) {
      FileSystem.makeDirectoryAsync(USER_DATA_DIRECTORY);
    }
  } catch (err: any) {
    console.log("[ERROR] localStorageUtils:createUserDataDirectory: ", err);
  }
}

export const deleteUserData = async () => {
  let result = await FileSystem.deleteAsync(USER_DATA_DIRECTORY);
  console.log("deleted user data");
  return result;
}

export const readUserData = async () => {
  let data: any = {};

  if (!await checkUserDataDirectory()) return data;

  // Can be used for convenience, but fails when user data directory not yet created
  const readDataFromFile = async () => {
    let fileContent = await FileSystem.readAsStringAsync(`${USER_DATA_DIRECTORY}user`);
    fileContent = JSON.parse(fileContent);

    // if fileContent is empty, will simply be the string "user". We want to treat this as empty
    return fileContent === "user" ? {} : fileContent;
  }

  // Works regardless if user directory is created or not
  const readDataFromDirectory = async () => {
    data = await FileSystem.readDirectoryAsync(USER_DATA_DIRECTORY)
      .then(async (files) => {
        // Use for loop as .forEach() cannot return any value
        // NOTE: There will only be one matching file (userData), so technically we don't need to loop
        for (const i in files) {
          let file = files[i];
          // `${USER_DATA_DIRECTORY}user}`
          let fileContent = await FileSystem.readAsStringAsync(USER_DATA_DIRECTORY + file);
          fileContent = JSON.parse(fileContent);
          return fileContent;
        }
      })
      .catch((err) => {
        console.log("[ERROR] in localStorageUtils: readUserData", err);
      })
  }

  // This function will return either a full userData object,
  // or empty object if it doesn't find one
  // This prevents error 'undefined is not an object' such as `undefined.firstName`
  // TODO: Note how often this happens? Unless empty object is ok upon initialization?
  return await readDataFromFile();
}

// Writes to the user data directory
// TODO: This doesn't work properly or save user, getting error during writing
export const writeUserData = async (data: any) => {
  let success = false;
  if (!await checkUserDataDirectory()) return false;

  success = await FileSystem.writeAsStringAsync(`${USER_DATA_DIRECTORY}user`, JSON.stringify(data))
    .then(() => { return true })
    .catch((err) => {
      console.log("[ERROR] localStorageUtils:writeUserData:", err);
      return false;
    });

  success = true;
  return success;

}

// Get all transcripts from local storage, then print out file names.
// Transcript filename format: {14 digit timestamp}.txt
// Takes one callback function `func` to be called on each file.
// This callback function defaults to an empty func (i.e. does nothing)
// TODO: do we need this level of abstraction? why not compose the function now and generalize later?
// Can we fulfill the async requirements without making it generic (pass any func)?
export const getTranscripts = async (func: any = () => { }) => {
  let results: any = [];

  await FileSystem.readDirectoryAsync(TRANSCRIPT_DIRECTORY)
    .then(async (files) => {
      for (let i = 0; i < files.length; i++) {
        let result = await func(`${TRANSCRIPT_DIRECTORY}${files[i]}`);

        // NOTE: DO NOT do any processing/filtering here!
        // This is the raw transcript that should be readable in its exact form.
        if (result) results.push(result);
      };
    })
    .catch((err: any) => {
      console.log("[ERROR]: localStorageUtils: getTranscripts:", err);
    });

  results = await Promise.all(results);
  return results
}

// Returns a list of strings containing all words ever spoken across all transcripts
// This serves as a "bucket" of strings to be processed by processAllWordsFromTranscripts
// At this point, there is no ordering nor sorting of words
// Optional parameter `numberOfTopWordsOnly` to cutoff return numberOfTopWordsOnly words
export const getAllWordsFromTranscripts = async (numberOfTopWordsOnly: number = 50) => {
  // NOTE: because this function is called in VideosContext
  // and VideosContext is triggered BEFORE App.tsx,
  // we must first create the Video directory on initial load instead of waiting
  // for App.tsx to create it first.
  // TODO: Double check this
  // await createDirectory(TRANSCRIPT_DIRECTORY);

  let result = await getTranscripts(getTranscriptContent);
  return processAllWordsFromTranscripts(result, numberOfTopWordsOnly);  // array of transcriptContents (unsplit strings)
}

// Processes the list of strings from getAllWordsFromTranscripts
// returns word chart data in the correct format with correct counts.
// Optional param numberOfTopWordsOnly can slice the data,
// but for now we are sending ALL the data and having individual components slice the top words.
export const processAllWordsFromTranscripts = async (allWordsByTranscript: string[], numberOfTopWordsOnly: number = 0) => {
  // Helper function to generate object for a single word in the correct format for WordChart
  const initWordChartItemData = (count: number, currentWord: string) => {
    return {
      'word': currentWord,
      'count': count
    }
  }

  // TODO: make more efficient in as few loops as possible
  // Can we do this in one pass?
  let wordsByCount: any = {};
  let totalWordCount: number = 0;

  for (let i = 0; i < allWordsByTranscript.length; i++) {
    let transcript = allWordsByTranscript[i];
    let splitWords = removePunctuation(transcript).toLowerCase().split(' ');

    for (let currentWord of splitWords) {
      if (filteredWords.includes(currentWord)) continue;  // skip filtered words

      // Updating values more memory efficient than reassigning whole obj using initWordChartItemData
      // This is because each call would have generated a shallow copy of the object
      // THEN assigned the whole obj with obj.count + 1
      if (wordsByCount[currentWord]) {
        wordsByCount[currentWord].count += 1;
        // can't recalculate the overall ratio because we don't know how many words exist yet
        // even if we calculate with just the length of just the total words, will not be accurate
        // Therefore, we have to do another pass/map/loop later
      } else {
        wordsByCount[currentWord] = initWordChartItemData(1, currentWord);
      }

      totalWordCount++;
    }
  }

  // Calculates the simple ratio of a given word against all relevant/non-filtered words.
  // Multiplies by value to make it look better
  const calculateSimpleRatio = (count: number): number => {
    return (count / totalWordCount) * 6;
  }

  // Calculates the top X percent (percentile) of this word's count
  const calculateWeightedRatio = (count: number): number => {
    let allWordCountsOnly: number[] = Object.keys(wordsByCount).map((key: string) => wordsByCount[key].count);
    let min = Math.min(...allWordCountsOnly);  // Must destructure array first
    let max = Math.max(...allWordCountsOnly);
    let weightedPercentage = 0.1 + (0.8 * (count - min) / (max - min));  // Keep between 10% and 80% of bar width
    return weightedPercentage
  }

  wordsByCount = Object.keys(wordsByCount)
    .sort((a: string, b: string) => wordsByCount[b].count - wordsByCount[a].count)
    .map((key: string) => {
      wordsByCount[key].value =
        (totalWordCount > 200)
          ? calculateWeightedRatio(wordsByCount[key].count)
          : calculateSimpleRatio(wordsByCount[key].count);

      return wordsByCount[key];
    });

  return wordsByCount;
}

export const deleteAllTranscripts = async () => {
  let result = await FileSystem.deleteAsync(TRANSCRIPT_DIRECTORY)
  console.log("Deleted all transcripts");
  return result;
}

export const deleteAllRatings = async () => {
  let result = await FileSystem.deleteAsync(RATING_DIRECTORY);
  console.log("Deleted all ratings");
  return result;
}

export const deleteAllVideos = async () => {
  let result = await FileSystem.deleteAsync(VIDEO_DIRECTORY);
  console.log("Deleted all videos");
  return result;

  // Before, we were querying each video file and deleting each thumbnail, transcript, etc
  // associated with it. Now, we simply delete the video directory itself, which is much cleaner
  return await FileSystem.readDirectoryAsync(VIDEO_DIRECTORY)
    .then(async (files: any) => {
      files.forEach((file: any) => {
        deleteVideoLog(file);  // await FileSystem.deleteAsync(VIDEO_DIRECTORY + files[i]);
      })

      console.log("Deleted all videos");
    })
    .catch((err) => console.log("[ERROR] VideosContext: deleteAllVideos", err));
}

export const deleteAllThumbnails = async () => {
  let result = await FileSystem.deleteAsync(THUMBNAIL_DIRECTORY);
  console.log("Deleted all thumbnails");
  return result;
}

export const deleteAllData = async () => {
  try {
    let promises = [
      deleteAllVideos(),
      deleteAllRatings(),
      deleteAllTranscripts(),
      deleteAllThumbnails(),
      deleteUserData()
    ]

    await Promise.all(promises);
    console.log("Deleted all data");
  } catch (err) {
    console.log("[ERROR] localStorageUtils: deleteAllData", err);
  }
}

// Deletes a video log and its associated data, given the pure filename (123123123)
export const deleteVideoLog = async (filename: string) => {
  try {
    let promises = [
      FileSystem.deleteAsync(`${VIDEO_DIRECTORY}${filename}.mov`),
      FileSystem.deleteAsync(`${THUMBNAIL_DIRECTORY}${filename}.jpg`),
      FileSystem.deleteAsync(`${TRANSCRIPT_DIRECTORY}${filename}.txt`),
      FileSystem.deleteAsync(`${RATING_DIRECTORY}${filename}.txt`)
    ]

    await Promise.all(promises);
    console.log(`Deleted log ${filename}`);
    return true;
  } catch (err) {
    console.log(`[ERROR] localStorageUtils: deleteVideoLog`, err);
    return false;
  }
}

// Helper function to get the base uri of the local file system.
// Later, we can do FileSystem.documentDirectory + 'transcripts/', for example
// Which will become getBaseFileSystemUri + 'transcripts/'
export const getBaseFileSystemUri = () => {
  return FileSystem.documentDirectory;
}

export const getTranscriptContent = async (transcriptUri: string) => {
  let transcript_content: string = "";

  transcript_content = await FileSystem.readAsStringAsync(transcriptUri)
    .then((content: string) => {
      return content;
    })
    .catch((err: any) => {
      console.log("[ERROR]: VideosContext.tsx: getTranscriptContent", err);
      return "";
    })

  return transcript_content;
}

export const getRating = async (uri: string) => {
  let rating: string = "";

  rating = await FileSystem.readAsStringAsync(uri)
    .then((content: string) => {
      return content;
    })
    .catch((err: any) => {
      console.log("[ERROR]: VideosContext.tsx: getRating", err);
      return "";
    })

  return rating;
}

export const writeFinalTranscript = async (transcriptUri: string, text: string) => {
  try {
    FileSystem.writeAsStringAsync(transcriptUri, text);  // No return value
    return true;
  } catch (err: any) {
    console.log("[ERROR] Transcript:FileSystem.writeAsStringAsync:", err);
    return false;
  }
}

export const generateThumbnailUri = (filename: string) => {
  return `${THUMBNAIL_DIRECTORY}${filename}.jpg`;
}

export const generateTranscriptUri = (filename: string) => {
  return `${TRANSCRIPT_DIRECTORY}${filename}.txt`;
}

export const generateVideoUri = (filename: string) => {
  return `${FileSystem.documentDirectory}videos/${filename}.mov`;
}

export const generateRatingUri = (filename: string) => {
  return `${RATING_DIRECTORY}${filename}.txt`;
}

export const initVideoDataObject = async (filename: string) => {
  let transcriptUri = generateTranscriptUri(filename);
  let transcriptContent = await getTranscriptContent(transcriptUri);

  let ratingObject = await createRatingFromFile(generateRatingUri(filename));
  let rating = ""
  let showVideo = true  // default set to true.
  if (ratingObject) {
    rating = `${ratingObject.emoji}${ratingObject.index}`
    showVideo = ratingObject.isCameraOn
  }
  let videoData = {
    "baseName": filename,
    "name": generateVideoUri(filename),
    "uri": generateVideoUri(filename),
    "thumbnail_uri": generateThumbnailUri(filename),
    "transcript_uri": transcriptUri,
    "transcript_content": transcriptContent,
    "rating": rating,
    // isCameraOn means show video, defaults to true in ratings.ts
    // However, if this field doesn't exist (undefined, migrating from older versions),
    // this will be explicitly set to boolean false
    "show_video": showVideo
  }

  return videoData;
}
