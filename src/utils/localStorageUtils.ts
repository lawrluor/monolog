// Currently, we are using Expo FileSystem to handle local storage.
// This util file holds reusable code for:
  // creating local file directories
  // writing new local files 
  // retrieving local files
// TODO: consider refactoring/moving code handling local storage from other files to here.

import * as FileSystem from 'expo-file-system';
import { filteredWords, removePunctuation } from './textProcessing';

export const USER_DATA_DIRECTORY = FileSystem.documentDirectory + 'userData/';
export const TRANSCRIPT_DIRECTORY = FileSystem.documentDirectory + 'transcripts/';
export const THUMBNAIL_DIRECTORY = FileSystem.documentDirectory + 'thumbnails/';
export const RATING_DIRECTORY = FileSystem.documentDirectory + 'rating/';
export const VIDEO_DIRECTORY = FileSystem.documentDirectory + 'videos/';

export const createVideoDirectory = async () => {
  await FileSystem.getInfoAsync(VIDEO_DIRECTORY).then(
    // TODO: check error handling on making the directory
    ({ exists, _ }) => {
      if (!exists) {
        FileSystem.makeDirectoryAsync(VIDEO_DIRECTORY);
      }
    }).catch(
    error => {
      console.log("[ERROR] VideosContext:FileSystem.getInfoAsync:", error);
    });
}

export const createTranscriptDirectory = async () => {
  let transcriptDirectory = FileSystem.documentDirectory + "transcripts/";
  await FileSystem.getInfoAsync(transcriptDirectory).then(
    // TODO: check error handling on making the directory
    ({ exists, _ }) => {
      if (!exists) {
        FileSystem.makeDirectoryAsync(transcriptDirectory);
      }
    }).catch(
    error => {
      console.log("[ERROR] Transcript:FileSystem.getInfoAsync:", error);
    });
}

export const createThumbnailDirectory = async () => {
  // Set up Thumbnail Directory if necessary.
  FileSystem.getInfoAsync(THUMBNAIL_DIRECTORY).then(
    ({ exists, _ }) => {
      if (!exists) {
        FileSystem.makeDirectoryAsync(THUMBNAIL_DIRECTORY);
      }
    }
  ).catch(
    error => {
      console.log("[ERROR] Recording:Thumbnail:getInfoAsync:", error);
    }
  );
}

export const createRatingDirectory = async () => {
  // Set up Emoji Rating Directory if necessary.
  FileSystem.getInfoAsync(RATING_DIRECTORY).then(
    ({ exists, _ }) => {
      if (!exists) {
        FileSystem.makeDirectoryAsync(RATING_DIRECTORY);
      }
    }
  ).catch(
    error => {
      console.log("[ERROR] Recording:Rating:getInfoAsync:", error);
    }
  );
}

export const checkUserDataDirectory = async () => {
  let directoryExists = await FileSystem.getInfoAsync(USER_DATA_DIRECTORY).then(
    // TODO: check error handling on making the directory
    ({ exists, _ }) => {
      readUserData();
      return exists;
    }).catch((error) => {
      console.log("[ERROR] localStorageUtils:checkUserDataDirectory: ", error, "This is probably because it doesn't exist yet.");
      return false;
    });
  
  return directoryExists;
}

// Create User data directory if not already existing.
export const createUserDataDirectory = async () => {
  let directoryExists = await checkUserDataDirectory();
  if (!directoryExists) {
    FileSystem.makeDirectoryAsync(USER_DATA_DIRECTORY);
  }
}

export const deleteUserData = async () => {
  await FileSystem.deleteAsync(USER_DATA_DIRECTORY);
  console.log("deleted user data");
}

export const readUserData = async () => {
  let data: any = {};

  if (!checkUserDataDirectory()) return data;

  data = await FileSystem.readDirectoryAsync(USER_DATA_DIRECTORY)
    .then(async (files) => {
      // Use for loop as .forEach() cannot return any value
      // NOTE: There will only be one matching file (userData), so technically we don't need to loop
      for (const i in files) {
        let file = files[i];
        let fileContent = await FileSystem.readAsStringAsync(USER_DATA_DIRECTORY + file);
        fileContent = JSON.parse(fileContent);
        return fileContent;
      }
    })
    .catch((err) => {
      console.log("[ERROR] in localStorageUtils: readUserData", err);
    })

  // This function will return either a full userData object,
  // or empty object if it doesn't find one
  // This prevents error 'undefined is not an object' such as `undefined.firstName`
  // TODO: Note how often this happens? Unless empty object is ok upon initialization?
  return data;  
}

// Writes to the user data directory
// TODO: This doesn't work properly or save user, getting error during writing
export const writeUserData = (data: any) => {
  try {
    FileSystem.writeAsStringAsync(`${USER_DATA_DIRECTORY}user`, JSON.stringify(data));
  } catch (err) {
    console.log("[ERROR] localStorageUtils:writeUserData:", err);
  }
}

// Get all transcripts from local storage, then print out file names.
// Transcript filename format: {14 digit timestamp}.txt
// Takes one callback function `func` to be called on each file. 
// This callback function defaults to an empty func (i.e. does nothing)
// TODO: do we need this level of abstraction? why not compose the function now and generalize later?
  // Can we fulfill the async requirements without making it generic (pass any func)?
export const getTranscripts = async (func: any=() => {}) => {
  let results: any = [];

  await FileSystem.readDirectoryAsync(TRANSCRIPT_DIRECTORY)
    .then(async (files) => {
      for (let i=0; i < files.length; i++) {
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
export const getAllWordsFromTranscripts = async (numberOfTopWordsOnly: number=50) => {
  let result = await getTranscripts(getTranscriptContent);
  return processAllWordsFromTranscripts(result, numberOfTopWordsOnly);  // array of transcriptContents (unsplit strings)
}

// Processes the list of strings from getAllWordsFromTranscripts
// returns word chart data in the correct format with correct counts.
// Optional param numberOfTopWordsOnly can slice the data, 
// but for now we are sending ALL the data and having individual components slice the top words.
export const processAllWordsFromTranscripts = async (allWordsByTranscript: string[], numberOfTopWordsOnly: number=0) => {  
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

  for (let i=0; i < allWordsByTranscript.length; i++) {
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
    let allWordCountsOnly: number[] = Object.keys(wordsByCount).map((key: string) => wordsByCount[key].count );
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
  // await getTranscripts(FileSystem.deleteAsync(TRANSCRIPT_DIRECTORY));
  await FileSystem.deleteAsync(TRANSCRIPT_DIRECTORY)
  console.log("Deleted all transcripts");
}

export const deleteAllRatings = async () => {
  await FileSystem.deleteAsync(RATING_DIRECTORY);
  console.log("Deleted all ratings");
}

// Deletes all videos with optional parameter of deleting X number of videos
export const deleteAllVideos = async (numberOfVideosToDelete=0) => {
  await FileSystem.readDirectoryAsync(VIDEO_DIRECTORY)
    .then(async (files) => {
      // default is 0, so delete all videos by default
      let numberOfVideos = Math.max(0, files.length - numberOfVideosToDelete);  
      for (let i=0; i<numberOfVideos; i++) {
        await FileSystem.deleteAsync(VIDEO_DIRECTORY + files[i]);
      }
    })
    .catch((err) => console.log("[ERROR] VideosContext: deleteAllVideos", err));
}

export const deleteAllThumbnails = async () => {
  await FileSystem.deleteAsync(THUMBNAIL_DIRECTORY);
  console.log("Deleted all thumbnails");
}

export const deleteAllData = async () => {
  try {
    let promises = [
      deleteAllRatings(),
      deleteAllTranscripts(),
      deleteAllVideos(),
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
  } catch(err) {
    console.log(`[ERROR] localStorageUtils: deleteVideoLog`, err);
    return false;
  }
}

// Helper function to get the base uri of the local file system.
// Later, we can do FileSystem.documentDirectory + 'transcripts/', for example
// Which will become getBaseFileSystemUri + 'transcripts/'
export const getBaseFileSystemUri = (): string => {
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
  let ratingFullUri = `${RATING_DIRECTORY}${uri}.txt`;

  rating = await FileSystem.readAsStringAsync(ratingFullUri)
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
  } catch(err: any) {
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
  let rating = await getRating(filename);

  let videoData = {
    "baseName": filename,
    "name": generateVideoUri(filename),
    "uri": generateVideoUri(filename),
    "thumbnail_uri": generateThumbnailUri(filename),
    "transcript_uri": transcriptUri,
    "transcript_content": transcriptContent,
    "rating": rating
  }

  return videoData;
}