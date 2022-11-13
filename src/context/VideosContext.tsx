// NOTE: Despite being called VideosContext, this is actually GLOBAL context
// "VideosContext" includes data for videos, transcripts, moods, and other data, serving the entire app
// TODO: break down into smaller context files later

import React from 'react';

import * as FileSystem from 'expo-file-system';

import { getTranscriptContent, getAllWordsFromTranscripts, initVideoDataObject, generateTranscriptUri, VIDEO_DIRECTORY, AUDIO_DIRECTORY, createDirectory } from '../utils/localStorageUtils';

// Workaround bug https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#extended-example
const VideosContext = React.createContext(undefined!);

export const VideosProvider:React.FC = ({ children }) => {
  const [query, setQuery] = React.useState<string>("");
  const [videosData, setVideosData] = React.useState(null);
  const [videosCount, setVideosCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [toggleRefresh, setToggleRefresh] = React.useState<boolean>(true);

  // wordChartData is queried from here and passed throughout app
  // TODO: make this separate context
  const [wordChartData, setWordChartData] = React.useState([]);

  // Default mood data structure for rendering. Currently mock data.
  // Will remove very soon, not worth putting it into json and then parsing the
  // date obj.
  const [moodData, setMoodData] = React.useState({
  "week": {
    "last_updated_secs": new Date(2022, 4, 5).getTime() / 1000,
    "days": [
    ]}
  });

  const initSectionData = async (section_key, recorded_sections) => {
    // let videoData = await initVideoDataObject(filename);

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
    // NOTE: because VideosContext is triggered BEFORE App.tsx completes,
    // we must first create the Video directory on initial load instead of waiting
    // for App.tsx to create it first.
    // TODO: consider moving context for Videos around MainNavigator only, so it WILL wait for App.tsx
    await createDirectory(VIDEO_DIRECTORY);
    await createDirectory(AUDIO_DIRECTORY);

    let recorded_sections = await FileSystem.readDirectoryAsync(VIDEO_DIRECTORY)
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
          let transcriptUri: string = await generateTranscriptUri(filename);
          let transcript_content: string = await getTranscriptContent(transcriptUri);

          // Filter videos by if the query appears in the transcript
          if (!transcript_content.toLowerCase().includes(query.toLowerCase())) return;

          // section_key is `${month} ${year}`. Ex: "January 2022".
          let section_key = getSectionKey(parseInt(filename));
          if (!(section_key in recorded_sections)) {
            // Create new section header
            // console.log("Month & Year section header/key not found, creating now");
            recorded_sections = await initSectionData(section_key, recorded_sections);
          }

          // Now that section header/key for Month & year exists, push video into section array
          let singleVideoData = await initVideoDataObject(filename);
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
    console.log("q", query);
    setQuery(query);
    setToggleRefresh(!toggleRefresh);
  }

  // This is a wrapper function for updating toggle state, to be called from other components
  // This function will update the videos context toggle state,
  // which will then trigger a useEffect to refresh video data
  const toggleVideosRefresh = async () => {
    setToggleRefresh(!toggleRefresh);
  }

  const getVideosCount = (videos: any) => {
    if (!videos || !videos[0]) return 0;  // new users that have no videos will not have data loaded

    try {
      return videos[0]['data'][0]['list'].length;
    } catch(err) {
      console.log("[ERROR] VideosContext.tsx:getVideosCount", err);
    }
  }

  // This useEffect helps us fetch video data on command, by toggling shouldUpdate state
  // Runs once entering the app stack, fetching video data
  // We use this state when we search using a query, for example: see submitQuery
  React.useEffect(() => {
    const fetchVideosData = async () => {
      setIsLoading(true);
      console.log("***refreshing videos***, query: ", query);
      let videos = await getVideosFromStorage(query);
      setVideosCount(getVideosCount(videos));
      setVideosData(videos);
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
    <VideosContext.Provider value={{ videosData, videosCount, isLoading, toggleVideosRefresh, submitQuery, moodData, wordChartData }}>
      {children}
    </VideosContext.Provider>
  )
}

export default VideosContext;
