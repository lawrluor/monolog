// NOTE: Despite being called VideosContext, this is actually GLOBAL context
// "VideosContext" includes data for videos, transcripts, moods, and other data, serving the entire app
// TODO: break down into smaller context files later

import React from 'react';
import * as FileSystem from 'expo-file-system';

import { allSettled } from '../utils/promises';
import { getTranscriptContent, getAllWordsFromTranscripts, initVideoDataObject, generateTranscriptUri, VIDEO_DIRECTORY, createDirectory } from '../utils/localStorageUtils';
import { type SectionData, type RecordedSections } from '../types/video';

type MoodDay = {
  date: Date;
  count: number;
  mood_score: number;
}
type MoodData = {
  week: {
    last_updated_secs: number;
    days: MoodDay[];
  }
};

type VideosContextValue = {
  videosData: SectionData[] | null;
  videosCount: number;
  isLoading: boolean;
  toggleVideosRefresh: () => Promise<void>;
  submitQuery: (query: string) => void;
  moodData: MoodData;
  wordChartData: string[];
};

// Workaround bug https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#extended-example
const VideosContext = React.createContext<VideosContextValue | undefined>(undefined);

export const VideosProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = React.useState<string>("");
  const [videosData, setVideosData] = React.useState<SectionData[] | null>(null);
  const [videosCount, setVideosCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [toggleRefresh, setToggleRefresh] = React.useState<boolean>(true);

  // wordChartData is queried from here and passed throughout app
  // TODO: make this separate context
  const [wordChartData, setWordChartData] = React.useState<string[]>([]);

  // Default mood data structure for rendering. Currently mock data.
  // Will remove very soon, not worth putting it into json and then parsing the
  // date obj.
  const [moodData] = React.useState<MoodData>({
    week: {
      last_updated_secs: new Date(2022, 4, 5).getTime() / 1000,
      days: []
    }
  });

  const initSectionData = async (section_key: string, recorded_sections: RecordedSections) => {
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

  // Filter videos by filename based on query
  const filterVideosByFilename = (filenames: string[], query: string) => {
    return filenames.filter((filename: string) => filename.includes(query));
  }

  // Reads from our video directory and translates it into a format that renderSection understands.
  // Optional string parameter `query`, which first filters the full list of videos before returning them
  // [ { title, key, data [ { list [ { name, uri } ] }] } ]
  const getVideosFromStorage = async (query: string = ""): Promise<SectionData[]> => {
    // NOTE: because VideosContext is triggered BEFORE App.tsx completes,
    // we must first create the Video directory on initial load instead of waiting
    // for App.tsx to create it first.
    // TODO: consider moving context for Videos around MainNavigator only, so it WILL wait for App.tsx
    await createDirectory(VIDEO_DIRECTORY);

    let recorded_sections: RecordedSections = {};

    try {
      const files = await FileSystem.readDirectoryAsync(VIDEO_DIRECTORY);

      // Process files in reverse order of when they were created.
      // This ensures that within each month, videos are sorted properly.
      files.sort().reverse();

      // videoDataPromises: array of Promises that will resolve when ALL relevant data is fetched
      const videoDataPromises = files.map(async file => {
        // `file` is in the format: "${timestamp in seconds}.mov".
        // TODO: consider storing file format differently to allow for faster client-side searching
        const filename: string = file.slice(0, -4);
        const transcriptUri: string = await generateTranscriptUri(filename);
        const transcript_content: string = await getTranscriptContent(transcriptUri);

        // Filter videos by if the query appears in the transcript
        if (!transcript_content.toLowerCase().includes(query.toLowerCase())) return;

        // section_key is `${month} ${year}`. Ex: "January 2022".
        const section_key = getSectionKey(parseInt(filename));

        // Create new section header
        if (!(section_key in recorded_sections)) {
          recorded_sections = await initSectionData(section_key, recorded_sections);
        }

        // Now that section header/key for Month & year exists, push video into section array
        const singleVideoData = await initVideoDataObject(filename);
        recorded_sections[section_key]["data"][0]["list"].push(singleVideoData);
      });

      await allSettled(videoDataPromises);
    } catch (error) {
      console.log(error);
    }

    // Sort months by comparing timestamps of first video.
    if (Object.keys(recorded_sections).length === 0) return [];

    let sortedVideosByDate = Object.values(recorded_sections).sort((a: SectionData, b: SectionData) => {
      return a.data[0].list[0].name > b.data[0].list[0].name ? -1 : 1;
    });

    return sortedVideosByDate;
  }

  // Wrapper for setQuery and toggleRefresh
  // The default query is empty string and no querying happens
  // When query state is changed (from another component),
  // useEffect will fetch video data again and execute search
  const submitQuery = (query: string) => {
    setQuery(query);
    setToggleRefresh(prev => !prev);
  }

  // This is a wrapper function for updating toggle state, to be called from other components
  // This function will update the videos context toggle state,
  // which will then trigger a useEffect to refresh video data
  const toggleVideosRefresh = async () => {
    setToggleRefresh(prev => !prev);
  }

  const getVideosCount = (videos: SectionData[]) => {
    if (!videos || !videos[0]) return 0;  // new users that have no videos will not have data loaded

    try {
      return videos[0]['data'][0]['list'].length;
    } catch (err) {
      console.log("[ERROR] VideosContext.tsx:getVideosCount", err);
    }
  }

  // This useEffect helps us fetch video data on command, by toggling shouldUpdate state
  // Runs once entering the app stack, fetching video data
  // We use this state when we search using a query, for example: see submitQuery
  React.useEffect(() => {
    const fetchVideosData = async () => {
      try {
        setIsLoading(true);

        let videos = await getVideosFromStorage(query);
        setVideosCount(getVideosCount(videos));
        setVideosData(videos);
      } catch (err) {
        console.log("[ERROR] VideosContext.tsx:fetchVideosData", err);
      } finally {
        setIsLoading(false);
      }
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
