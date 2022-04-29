// NOTE: Despite being called VideosContext, this is actually GLOBAL context 
// "VideosContext" includes data for videos, transcripts, moods, and other data, serving the entire app
// TODO: break down into smaller context files later

import React from 'react';
import { Alert } from 'react-native';

import * as FileSystem from 'expo-file-system';

import { getTranscriptContent, getAllWordsFromTranscripts } from '../utils/localStorageUtils';

// Workaround bug https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#extended-example
const VideosContext = React.createContext(undefined!);

export const VideosProvider:React.FC = ({ children }) => {
  const [query, setQuery] = React.useState<string>("");
  const [videosData, setVideosData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [toggleRefresh, setToggleRefresh] = React.useState<boolean>(true);

  // Default userData structure for alpha release
  // This userData state will be populated from local storage
  // TODO: make this a separate context
  const [userData, setUserData] = React.useState({
    "firstName": "",
    "lastName": "",
    "email": "",
    "gender": "",
    "pronouns": "",
    "age": 21
  });

  // wordChartData is queried from here and passed throughout app 
  // TODO: make this separate context
  const [wordChartData, setWordChartData] = React.useState([]);
  
  // Default mood data structure for rendering. Currently mock data.
  // Will remove very soon, not worth putting it into json and then parsing the
  // date obj.
  const [moodData, setMoodData] = React.useState({
  "week": {
    "last_updated_secs": new Date(2022, 2, 30).getTime() / 1000,
    "days": [
      {
        "mood_score": 3.2,
        "count": 1,
        "date": new Date(2022, 2, 30)
      },
      {
        "mood_score": 4.0,
        "count": 2,
        "date": new Date(2022, 2, 29)
      },
      {
        "mood_score": 3.5,
        "count": 1,
        "date": new Date(2022, 2, 28)
      },
      {
        "mood_score": 1.68,
        "count": 2,
        "date": new Date(2022, 2, 27)
      },
      {
        "mood_score": 1.0,
        "count": 2,
        "date": new Date(2022, 2, 26)
      },
      {
        "mood_score": 2.0,
        "count": 2,
        "date": new Date(2022, 2, 25)
      },
      {
        "mood_score": 1.5,
        "count": 2,
        "date": new Date(2022, 2, 24)
      },
      {
        "mood_score": 1.0,
        "count": 2,
        "date": new Date(2022, 2, 23)
      },
    ]
  }
});


  // Deletes all videos with optional parameter of deleting X number of videos
  const deleteAllVideos = async (numberOfVideosToDelete=0) => {
    Alert.alert(
      "Are you sure?",
      "This action will delete all recorded videos. Proceed?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
            console.log('Deleting all files...');  // does not delete parent directory 'videos/'
            await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "videos/")
              .then(async (files) => {
                // default is 0, so delete all videos by default
                let numberOfVideos = Math.max(0, files.length - numberOfVideosToDelete);  
                for (let i=0; i<numberOfVideos; i++) {
                  await FileSystem.deleteAsync(FileSystem.documentDirectory + "videos/" + files[i]);
                }
              })
              .catch((err) => console.log("[ERROR] VideosContext: deleteAllVideos", err));
            toggleVideosRefresh();
            console.log('Deleted all from videos/');
          }
        }
      ]
    );
  }

  const generateThumbnailUri = (filename: string) => {
    return `${FileSystem.documentDirectory}thumbnails/${filename}.jpg`;
  }

  const generateTranscriptUri = (filename: string) => {
    return `${FileSystem.documentDirectory}transcripts/${filename}.txt`;
  }

  const generateVideoUri = (filename: string) => {
    return `${FileSystem.documentDirectory}videos/${filename}.mov`;
  }

  // takes full filepath, adds proper file extensions
  const initVideoData = async (filename: string) => {
    let transcriptUri = generateTranscriptUri(filename);
    let transcriptContent = await getTranscriptContent(transcriptUri);

    let videoData = {
      "name": generateVideoUri(filename),
      "uri": generateVideoUri(filename),
      "thumbnail_uri": generateThumbnailUri(filename),
      "transcript_uri": transcriptUri,
      "transcript_content": transcriptContent
    }

    return videoData;
  }

  const initSectionData = async (section_key, recorded_sections) => {
    // let videoData = await initVideoData(filename);

    recorded_sections[section_key] = {
      "title": section_key,
      "key": section_key,
      "data": [
        {
          "list": []
        }
      ]
    }

    return recorded_sections;
  }

  const getSectionKey = (file_time_seconds: number) => {
    let file_date = new Date(file_time_seconds * 1000);
    let month = file_date.toLocaleString('default', { month: 'long' });
    let year = file_date.toLocaleString('default', { year: 'numeric' });
    return `${month} ${year}`;
  }

  // Not currently used
  // Filter videos by filename based on query
  const filterVideosByFilename = (files: any, query: string) => {
    return files.filter((filename: string) => filename.includes(query));  // not in place
  }

  // Reads from our video directory and translates it into a format that renderSection understands.
  // Optional string parameter `query`, which first filters the full list of videos before returning them
  // [ { title, key, data [ { list [ { name, uri } ] }] } ]
  const getVideosFromStorage = async (query: string="") => {
    let recorded_sections = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "videos/")
      .then(async (files) => {
        // Process files in reverse order of when they were created.
        // This ensures that within each month, videos are sorted properly.
        files.sort().reverse();

        // TODO: File verification
        let recorded_sections = {}

        // videoDataPromises: array of Promises that will resolve when ALL relevant data is fetched
        let videoDataPromises = files.map(async file => {
          // `file` is in the format: "${timestamp in seconds}.mov".
          // TODO: consider storing file format differently to allow for faster client-side searching
          let filename: string = file.slice(0, -4); 
          let transcriptUri: string = generateTranscriptUri(filename);
          let transcript_content: string = await getTranscriptContent(transcriptUri); 


          // Filter videos by if the query appears in the transcript
          if (!transcript_content.toLowerCase().includes(query.toLowerCase())) return;

          // section_key is `${month} ${year}`. Ex: "January 2022".
          let section_key = getSectionKey(parseInt(filename));
          if (!(section_key in recorded_sections)) {
            // Create new section header
            console.log("Month & Year section header/key not found, creating now");
            recorded_sections = await initSectionData(section_key, recorded_sections);
          }

          // Now that section header/key for Month & year exists, push video into section array
          let singleVideoData = await initVideoData(filename);
          recorded_sections[section_key]["data"][0]["list"].push(singleVideoData);
        });

        // TODO: Look into using Promise.allSettled: wait for ALL promises to be resolved OR rejected, 
        // Promise.allSettled is not supported in React-Native, so we can implement our own allSettled
        // meaning each individual video's data either successfully fetched or failed.
        // Only then will we return final video data, recorded_sections
        // This ensures that if any videos fail, the rest will still be loaded
        const allSettled = (promises: any) => {
          return Promise.all(promises.map((promise: any) => {
            promise
              .then((value: any) => { return value })
              .catch((error: any) => { console.log("[ERROR] VideosContext: allSettled:", error) } )
          }));
        }

        await Promise.all(videoDataPromises);
        // await allSettled(videoDataPromises);
        return recorded_sections;
      })
      .catch(error => {
        console.log(error);
      });

    // Sort months by comparing timestamps of first video.
    let sortedVideosByDate: any[] = Object.values(recorded_sections).sort((a: any, b: any): boolean => {
      return a.data[0].list[0].name > b.data[0].list[0].name;
    });

    return sortedVideosByDate;
  }

  // Wrapper for setQuery and toggleRefresh
  // The default query is empty string and no querying happens
  // When query state is changed (from another component),
  // useEffect will fetch video data again and execute search
  const submitQuery = (query: string) => {
    setQuery(query);
    setToggleRefresh(!toggleRefresh);
  }

  // This is a wrapper function for updating toggle state, to be called from other components
  // This function will update the videos context toggle state,
  // which will then trigger a useEffect to refresh video data
  const toggleVideosRefresh = async () => {
    setToggleRefresh(!toggleRefresh);
  }

  // This useEffect helps us fetch video data on command, by toggling shouldUpdate state
  // Runs once entering the app stack, fetching video data
  // We use this state when we search using a query, for example: see submitQuery

  React.useEffect(() => {    
    const fetchVideosData = async () => {
      console.log("***refreshing videos***");
      let videosData = await getVideosFromStorage(query);
      setVideosData(videosData);
      setIsLoading(false);
    }

    fetchVideosData();
  }, [toggleRefresh])

  // This useEffect fetches wordChart data
  React.useEffect(() => {
    let getWordChartData = async () => {
      let data = await getAllWordsFromTranscripts();  // limit to 5 top words
      setWordChartData(data);
    }

    getWordChartData();
  }, [toggleRefresh]);

  // TODO: Create separate Mood context and User context.
  return (
    <VideosContext.Provider value={{ videosData, isLoading, toggleVideosRefresh, submitQuery, deleteAllVideos, moodData, userData, wordChartData, setUserData }}>
      {children}
    </VideosContext.Provider>
  )
}

export default VideosContext;
