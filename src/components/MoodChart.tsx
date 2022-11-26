import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LineChart, Path, XAxis } from 'react-native-svg-charts';
import { ClipPath, Circle, Defs, Rect } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';

import Divider from './Divider';
import VistaSummaryText from './VistaSummaryText';

import VideosContext from '../context/VideosContext';
import { generateRatingUri } from '../utils/localStorageUtils';
import { createRatingFromFile } from '../utils/rating';

import { text, spacings, colors } from '../styles';

const MOOD_CHART_SUMMARY =  "Welcome to your Mood Tracker Vista. This widget will display your average mood across all your logs for a given day, over the past week, based on the emojis that you select after recording an entry."
const MILLISECONDS_IN_A_WEEK = 604800000;
const MILLISECONDS_IN_A_DAY = 86400000;

const MoodChart = ({ abridged, callback }: any) => {
  const { moodData, toggleVideosRefresh } = React.useContext(VideosContext);

  const updateMoodMap = (emojiValue, timestampSeconds) => {
    // Initialize date object for the timestamp in question.
    let dateToUpdate = new Date(0);  // Epoch
    dateToUpdate.setSeconds(timestampSeconds);

    // find the appropriate insertion index in the data structure.
    // upon while termination, either:
    //  a) we found the date bucket to update so we update it, else
    //  b) we insert at the specified counter value.
    let counter = 0;
    while (moodData.week.days.length > 0 && dateToUpdate < moodData.week.days[counter].date &&
           counter <= moodData.week.days.length - 1) {
      counter += 1;
    }

    // If we found the date, update the DataStructure in place.
    // Comparisons use DateString() to make date equality easier. Avoids complex
    // timestamp math.
    if (moodData.week.days.length > 0 && moodData.week.days[counter].date.toLocaleDateString() ===
        dateToUpdate.toLocaleDateString()) {
      moodData.week.days[counter]["mood_score"] *= moodData.week.days[counter].count;
      moodData.week.days[counter].count++;
      moodData.week.days[counter]["mood_score"] += emojiValue;
      moodData.week.days[counter]["mood_score"] /= moodData.week.days[counter].count;
    } else {
      // We didn't find the date, so we insert date at specified counter.
      let newMoodDay = {
        "mood_score": emojiValue,
        "count": 1,
        "date": new Date(dateToUpdate.toDateString())
      }
      moodData.week.days.splice(counter, 0, newMoodDay);
    }
    moodData.week.last_updated_secs = timestampSeconds;
    toggleVideosRefresh();
  }


  // Runs as an effect in Home view. Reads videos from last week in filesystem,
  // removes expired video entries from data structure, and updates data
  // structure.
  const initializeMoodTracker = () => {
    videoTimestamps = []
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "videos/")
      .then((files) => {
        // Process most recent files first for efficiency.
        files.sort().reverse();

        ////////////////////////////////////////////////////////////////////////
        // Find the oldest video within a week from today.
        // Find today's seconds.

        // Filter out videos that happened before last week.
        let todaySec = new Date(new Date().toDateString()).getTime() / 1000;
        let lastWeekSec = todaySec - 604800;
        for (const file of files) {
          let timestamp = file.slice(0,-4)
          if (parseInt(timestamp) >= lastWeekSec) {
            videoTimestamps.push(timestamp);
            continue;
          }
          // Since files are sorted, once we find a week-old video, all
          // remaining videos will be even older.
          break;
        };

        // We don't need to update if we've already accounted for the most
        // recent video.
        if (videoTimestamps === moodData.week.last_updated_secs) {
          return;
        }

        // Clear all week-old data in moodData data structure.
        // Previous filtering is for videos in file system (not yet in DS).
        const clearExpiredMoodData = () => {
          let moodDataList = moodData.week.days;
          while (moodDataList.length > 0 &&
                 (moodDataList[moodDataList.length - 1].date.getTime() / 1000 <
                 lastWeekSec)) {
            moodData.week.days.pop();
          }
       }
       clearExpiredMoodData();

       // Update mood chart from early to late since moodData is sorted.
       videoTimestamps.reverse()
       for (const timestamp of videoTimestamps) {
         // This is both the emoji file name and the timeestamp in seconds.
         createRatingFromFile(
             generateRatingUri(timestamp)).then((rating) => {
               updateMoodMap(rating.index, timestamp);
         }).catch(error => {
           console.log("MoodChart:createRatingFromFile", error);
         });  // createRatingFromFile
        }
      })  // readDirectoryAsync
      .catch(error => {
        console.log("initializeMoodTracker:readDirectoryAsync", error);
      });
  }
  React.useEffect((): void => {
    console.log("initializing from MoodChart");
    initializeMoodTracker();
  }, []);

  // reverses an array in place between start & end.
  // [start, end)
  const revInPlace = (days, start, end) => {
    while(start < end) {
        let temp = days[start];
        days[start] = days[end];
        days[end] = temp;
        start++;
        end--;
    }
  }

  // Rotate in-place efficiently by using reverse in place.
  // https://iq.opengenus.org/reversal-algorithm/
  const rotateDays = (days, rotations) => {
    revInPlace(days, 0, rotations - 1);
    revInPlace(days, rotations, days.length - 1);
    revInPlace(days, 0, days.length - 1)
  }


  const renderMoodTracker = () => {
    // Datastructure that contains all data to render.
    let moodDays = moodData['week']['days'];
    let xaxisMap = ["S", "M", "T", "W", "T", "F", "S"];

    // We rotate display based on today's day-of-week.
    let today = new Date(new Date().toDateString());
    rotateDays(xaxisMap, today.getDay());

    // Add today's date to the end.
    xaxisMap.push(xaxisMap[0]);

    // TODO: Clean up this function and refactor functionality.
    // iterate backwards through the datastructure map and create the rendered
    // data.
    // Also detect "clips", non-contiguous logs that skip days. Skipped days
    // should be connected with dotted lines. These are defined as separate
    // clips.
    // A clip is defined as a pair of inclusive indicies: [start, end]
    // We use clips to add dotted lines between skipped days. Each clip is a
    // chunk of the line graph. Clips are alternating dashed and not dashed.
    let data = [];  // contains each data point (including hidden points).
    let circleData = [];  // contains only data that should be plotted.
    let clipIndex = [ [0, -1] ];  // contains clips.
    for (let i = moodDays.length - 1; i >= 0; i--) {
      // first, detect if there should be a clip.
      // special case first day since instead of comparing against a recorded
      // date, we should compare against today's date..
      if (i == moodDays.length - 1) {
        // Calculate dateDiff from one week from today.
        let dateDiff = parseInt((moodDays[i].date.getTime() -
                           (today.getTime() - MILLISECONDS_IN_A_WEEK)) /
                            MILLISECONDS_IN_A_DAY);
        if (dateDiff > 0) {
          // The first video was not taken on the same day as the start of the
          // window. We need to create a clip.

          // close the 0 clip.
          clipIndex[clipIndex.length - 1][1] = 0;

          // Create a new clip starting at 0 and ending # days until first log.
          clipIndex.push([0, dateDiff]);

          // We now need to populate data with points on this clip for each day
          // skipped.
          let clipCounter = 0;
          let previousMood = moodDays[i].mood_score  // Assume avg mood for last week.
          let moodDiff = moodDays[i].mood_score - previousMood;
          let slope = 0;

          // initialize first point.
          data.push(previousMood);
          circleData.push(-1);
          while (clipCounter < dateDiff - 1) {
            // insert data points in a linear fashion.
            clipCounter++;
            let nextMood = previousMood + slope
            data.push(nextMood);
            circleData.push(-1);  // Don't display circles for skipped days.
            previousMood = nextMood;
          }
          // Now that we finished the dashed clip, start the next clip.
          clipIndex.push([data.length, -1]);
        }
      } else if (i < moodDays.length - 1) {
        let dateDiff = parseInt((moodDays[i].date.getTime() -
                       moodDays[i + 1].date.getTime()) / MILLISECONDS_IN_A_DAY);
        // We found a skipped day. We need to add a clip and compute mood
        // differences.
        if (dateDiff > 1) {
          // close the previous clip by setting the end index to the start of
          // the next clip.
          clipIndex[clipIndex.length - 1][1] = data.length - 1;

          // start the new clip and set the end as start of next actual date.
          clipIndex.push([data.length - 1, data.length - 1 + dateDiff]);

          // We now need to populate data with points on this clip for each day
          // skipped.
          let clipCounter = 0;
          let moodDiff = moodDays[i].mood_score -
                         moodDays[i + 1].mood_score;
          let slope = moodDiff / dateDiff;
          let previousMood = moodDays[i + 1].mood_score;
          while (clipCounter < dateDiff - 1) {
            // insert data points in a linear fashion.
            clipCounter++;
            let nextMood = previousMood + slope
            data.push(nextMood);
            circleData.push(-1);  // Don't display circles for skipped days.
            previousMood = nextMood;
          }
          // Now that we finished the dashed clip, start the next clip.
          clipIndex.push([data.length, -1]);
        }
      }
      data.push(moodDays[i].mood_score);
      circleData.push(moodDays[i].mood_score);
    }
    // Set the end of the final clip.

    if (moodDays.length > 0) {
      // One last time, for skipped days at the tail-end of our window.
      let dateDiff = parseInt((today.getTime() - moodDays[0].date.getTime()) /
                                   MILLISECONDS_IN_A_DAY);
      // We found a skipped day. We need to add a clip and compute mood
      // differences.
      if (dateDiff > 0) {
        // close the previous clip by setting the end index to the start of
        // the next clip.
        clipIndex[clipIndex.length - 1][1] = data.length - 1;

        // start the new clip and set the end as start of next actual date.
        clipIndex.push([data.length - 1, data.length - 1 + dateDiff]);

        // We now need to populate data with points on this clip for each day
        // skipped.
        let clipCounter = 0;
        let moodDiff = 2.0 - moodDays[0].mood_score;  // Assume avg mood in future.
        let slope = 0;
        let previousMood = moodDays[0].mood_score;
        while (clipCounter < dateDiff) {
          // insert data points in a linear fashion.
          clipCounter++;
          let nextMood = previousMood + slope
          data.push(nextMood);
          circleData.push(-1);  // Don't display circles for skipped days.
          previousMood = nextMood;
        }
      }
      clipIndex[clipIndex.length - 1][1] = data.length;
    }

    // Construct Clips svg template given clipIndex.
    const Clips = ({ x, width }) => (
      <Defs key={ 'clips' }>
        {clipIndex.map((elem, index) => (
          <ClipPath key={index} id={ "clip-path-" + index }>
            <Rect x={ x(elem[0]) } y={ '0' } width={ x(elem[1]) - x(elem[0]) } height={ '100%' }/>
          </ClipPath>
        ))}
      </Defs>
    );

    // Construct Dashed Lines for each odd clip.
    let dashedClips = clipIndex.filter((element, index) => {
      return index % 2 === 1;
    });
    const DashedLines = ({ line }) => (
      <>
      {dashedClips.map((elem, index) => (
        <Path
          key={ 'line-' + (2 * index + 1) }
          d={ line }
          stroke={ colors.HIGHLIGHT }
          strokeWidth={ 2 }
          fill={ 'none' }
          strokeDasharray={ [ 4, 4 ] }
          clipPath={ 'url(#clip-path-'+ (2 * index + 1) + ')' }
        />
      ))}
      </>
    );

    // Construct Solid Lines for each even clip.
    let solidClips = clipIndex.filter((element, index) => {
      return index % 2 === 0;
    });
    const SolidLines = ({ line }) => (
      <>
      {solidClips.map((elem, index) => (
        <Path
          key={ 'line-' + (2 * index) }
          d={ line }
          stroke={ colors.HIGHLIGHT }
          strokeWidth={ 2 }
          fill={ 'none' }
          clipPath={ 'url(#clip-path-'+ (2 * index) + ')' }
        />
      ))}
      </>
    );

    // This is a function that runs on each data point of the line graph to
    // create points on the line graph.
    const Decorator = ({ x, y }) => {
        return circleData.map((value, index) => (
            <Circle
                key={ index }
                cx={ x(index) }
                cy={ y(value) }
                r={ 4 }
                stroke={ colors.HIGHLIGHT }
                fill={ colors.HIGHLIGHT }
            />
        ))
    }

    return (
      <>
        <LineChart
          style={{ height: 200 }}
          data={data}
          svg={{ stroke: colors.HIGHLIGHT, strokeWidth: 1.8,
                 clipPath: "url(#clip-path-0)" }}
          contentInset={{ top: 20, bottom: 20 , left: 20, right: 20}}
          yMin={ 0.0 }
          yMax={ 4.0 }
        >
          <Clips/>
          <Decorator/>
          <DashedLines/>
          <SolidLines/>
        </LineChart>

        <View style={{ marginVertical: spacings.LARGE }}>
          <Divider color={colors.SECONDARY} widthPercentage={95} />
        </View>

        <XAxis
          style={{ marginHorizontal: -10 }}
          data={data}
          formatLabel={(value, index) => xaxisMap[index]}
          contentInset={{ top: 20, bottom: 20 , left: 20, right: 20}}
          svg={{ fontSize: 14, fill: 'black' }}
        />
      </>
    )
  }

  return (
    <>
      <Text style={styles.featureTitle}>Mood Chart</Text>
      {renderMoodTracker()}
      {abridged ? null : <View style={{ marginVertical: spacings.MEDIUM }}><VistaSummaryText summaryText={MOOD_CHART_SUMMARY} callback={callback}/></View>}
    </>
  )
}

const styles = StyleSheet.create({
  featureTitle: {
    ...text.h4,
    marginBottom: spacings.SMALL,
    color: colors.PRIMARY
  },
});


export default MoodChart;
