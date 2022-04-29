// Currently, we are using Expo FileSystem to handle local storage.
// This util file holds reusable code for:
  // creating local file directories
  // writing new local files 
  // retrieving local files
// TODO: consider refactoring/moving code handling local storage from other files to here.

import * as FileSystem from 'expo-file-system';

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
  let data: any = await FileSystem.readDirectoryAsync(USER_DATA_DIRECTORY)
    .then(async (files) => {
      // Use for loop as .forEach() cannot return any value
      // NOTE: There will only be one matching file (userData), so technically we don't need to loop
      for (const i in files) {
        let file = files[i];
        let fileContent = await FileSystem.readAsStringAsync(USER_DATA_DIRECTORY + file);
        data = JSON.parse(fileContent);
        return data;
      }
    })
    .catch((err) => {
      console.log("[ERROR] in localStorageUtils: readUserData", err);
    })

  // This function will return either a full userData object,
  // or empty object if it doesn't find one
  // This prevents error 'undefined is not an object' such as `undefined.firstName`
  // TODO: Note how often this happens? Unless empty object is ok upon initialization?
  return data || {};  
}

// Writes to the user data directory
// TODO: This doesn't work properly or save user, getting error during writing
export const writeUserData = (path: string, data: any) => {
  try {
    FileSystem.writeAsStringAsync(USER_DATA_DIRECTORY + path, JSON.stringify(data));
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
export const processAllWordsFromTranscripts = async (allWords: string[], numberOfTopWordsOnly: number=0) => {
  const VALUE_MULTIPLIER = 10;  // NOTE: just to increase bar size. TODO: Can change formula later and apply in rendering
  
  // Helper function to generate object for a single word in the correct format for WordChart
  const initWordChartItemData = (word: string, count: number, totalWords: number) => {
    let value = (count / totalWords) * VALUE_MULTIPLIER;  // TODO: change this ratio, just to make bars bigger
    
    return {
      'word': word,
      'value': value,
      'count': count
    }
  }

  let fullWordList: string[] = [];

  // TODO: Filter articles and other unnecessary words 
  // TODO: make more efficient
  // Seems faster to map the split function? and then just reduce list.
  for (let i=0; i < allWords.length; i++) {
    let splitWords = allWords[i].toLowerCase().split(' ');  // NOTE: lowercasing all strings
    fullWordList = [...fullWordList, ...splitWords];
  }

  // TODO: get totalWords AFTER filtering unnecessary words
  let totalWords = fullWordList.length;  
  let wordCounts: any = {};
  
  for (let i=0; i < fullWordList.length; i++) {
    let currentWord = fullWordList[i];
    if (wordCounts[currentWord])  {
      // Updating values more memory efficient than reassigning whole obj using initWordChartItemData
      // This is because each call would have generated a shallow copy of the object
      // THEN assigned the whole obj with obj.count + 1
      wordCounts[fullWordList[i]].count += 1;
      wordCounts[fullWordList[i]].value = (wordCounts[fullWordList[i]].count / totalWords) * VALUE_MULTIPLIER;
    } else {
      wordCounts[fullWordList[i]] = initWordChartItemData(currentWord, 1, totalWords)
    }
  }

  // Determine unwanted words 
  // TODO: see if language library can help us with this
  // Stop word list: https://xpo6.com/wp-content/uploads/2015/01/stop-word-list.csv
  // TODO: use regex may be more efficient 
  // TODO: can break this up into lists and concat them
  // TODO: refactor and make a util function for this?
  // TODO: Make into an obj
  const articles = ['the', 'a', 'an'];
  const objects = ['this', 'these', 'them', 'they', 'we', 'do', 'he', 'she', 'it'];
  const conjunctions = ['and', 'or'];
  const prepositions = ['to', 'into'];
  const stutters = ['um', 'ah', 'umm', 'hmm', 'hm', 'so'];
  const specialChars =  ['\n', '\t', 'undefined'];
  const unwantedWords = [...articles, ...objects, ...conjunctions, ...prepositions, ...stutters, ...specialChars];
  // 'can', 'can\'t', 'cannot'
  
  // Sort in Ascending order (max first)
  // NOTE: we cannot sort an object directly (inconsistent ordering), 
  // but we can return a sorted array of keys, to then map back to the array of objects
  // See: https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
  
  wordCounts = Object.keys(wordCounts)
                .filter((a) => !unwantedWords.includes(a))  // TODO: Do this better/earlier, inefficient
                .sort((a: any, b: any) => wordCounts[b].count - wordCounts[a].count)
                .map(key => wordCounts[key])

  return wordCounts;
}

export const deleteAllTranscripts = async () => {
  let transcriptDirectory = FileSystem.documentDirectory + "transcripts/";
  await getTranscripts(FileSystem.deleteAsync(transcriptDirectory));
  console.log("Deleted all transcripts");
}

// Helper function to get the base uri of the local file system.
// Later, we can do FileSystem.documentDirectory + 'transcripts/', for example
// Which will become getBaseFileSystemUri + 'transcripts/'
export const getBaseFileSystemUri = (): string => {
  return FileSystem.documentDirectory;
}

export const getTranscriptContent = async (transcriptUri: string) => {
  let transcript_content = "";

  if (transcriptUri) { 
    transcript_content = await FileSystem.readAsStringAsync(transcriptUri)
      .then((content: string) => {
        // console.log("getTranscriptContent: success: ", content);
        return content;
      })
      .catch((err: any) => {
        console.log("[ERROR]: VideosContext.tsx: getTranscriptContent", err);
        return "";
      })
  }

  return transcript_content;
}

// Filename is always "/path/to/file/${14 digit timestamp}.txt"

export const writeFinalTranscript = async (transcriptUri: string, text: string) => {
  let transcriptDirectory = FileSystem.documentDirectory + "transcripts/";
  let result;  // assigned a boolean value based on success of writing file

  await FileSystem.getInfoAsync(transcriptDirectory).then(
    // TODO: check error handling on making the directory
    async ({ exists, _ }) => {
      if (!exists) {
        FileSystem.makeDirectoryAsync(transcriptDirectory);
      }

      result = await FileSystem.writeAsStringAsync(transcriptUri, text)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log("[ERROR] Transcript:FileSystem.writeAsStringAsync:", error);
          return false;
        });
    }).catch((error) => {
      console.log("[ERROR] Transcript:FileSystem.getInfoAsync:", error);
      result = false;
    });
    
    return result;
}
