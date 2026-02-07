import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import VideosContext from '../context/VideosContext';
import VistaSummaryText from './VistaSummaryText';
import Divider from './Divider';
import { text, spacings, colors, icons } from '../styles';

type Props = {
  defaultNumOfWords?: number;
  abridged?: boolean;
  navigation: any,
  callback: any
}

const MAX_NUM_OF_WORDS_TO_DISPLAY = 50;
const WORD_CHART_SUMMARY = "Welcome to your Frequent Words Vista. This widget will display common words that you've mentioned across all your log entries, including how many times these word has been repeated.";

// Renders the chart of words based on their counts
// Each bar is a series of horizontal containers defined in the styles (barItemContainer, barItem, bar)
// I've created a custom chart because the design is complex and it's likely not worth hacking a vanilla library to do this
// TODO: If the bar value is over 50% of the container width, shift the word text outside of the bar
const WordChart = ({ defaultNumOfWords = 10, abridged, callback }: Props) => {
  const videosContext = React.useContext(VideosContext);
  if (!videosContext) throw new Error('WordChart must be used within a VideosProvider');
  const { wordChartData } = videosContext;

  const [numOfWordsCurrentlyDisplayed, setNumOfWordsCurrentlyDisplayed] = React.useState(defaultNumOfWords);
  const [moreWordsShown, setMoreWordsShown] = React.useState(false);

  // If press the "Show More/Show Less" pressable, the number of words to display changes
  // NOTE: All words have been loaded into the data already, 
  // and this simply changes the slice of data we look at.
  // TODO: Could analyze the performance of this in the future.
  const toggleShowWords = () => {
    setMoreWordsShown(!moreWordsShown);
  }

  React.useEffect(() => {
    if (moreWordsShown) {
      setNumOfWordsCurrentlyDisplayed(MAX_NUM_OF_WORDS_TO_DISPLAY);
    } else {
      setNumOfWordsCurrentlyDisplayed(defaultNumOfWords);
    }
  }, [moreWordsShown])

  // This renders each horizontal bar & corresponding word of the WordChart
  // If the bar is over 50% ratio, display the word INSIDE the bar
  // Else, display the word to the right of the bar (after the bar)
  // TODO: Have each bar as a scroll view horizontally to allow for 
  // selecting options on list-items via swipe (iOS style)
  const renderBarWithText = (item: any) => {
    const maximumBarWidth = 0.5;  // Modifier for the container width. TODO: look closely at this
    let barRatio = maximumBarWidth * item.value;
    barRatio = barRatio > 0.90 ? 0.90 : barRatio;  // cap to 90% of the parent container
    let finalBarWidth = `${barRatio * 100}%`;  // convert to string for CSS % of parent width

    const renderBarWithTextInside = (item: any) => {
      return (
        <View key={item.word} style={styles.barItemContainer}>
          <View key={item.word} style={[styles.bar, { width: finalBarWidth }]}>
            <Text style={[styles.barText, { 'color': colors.BACKGROUND }]}>{item.word}</Text>
          </View>

          <View style={styles.barNumberContainer}>
            <Text style={styles.barNumberText}>{item.count}</Text>
          </View>
        </View>
      )
    }

    const renderBarWithTextOutside = (item: any) => {
      return (
        <View key={item.word} style={styles.barItemContainer}>
          <View key={item.word} style={[styles.bar, { width: finalBarWidth }]}></View>
          <Text style={[styles.barText, { 'color': colors.HIGHLIGHT }]}>{item.word}</Text>

          <View style={styles.barNumberContainer}>
            <Text style={styles.barNumberText}>{item.count}</Text>
          </View>
        </View>
      )
    }

    // Item is above the 50th percentile of words across all logs
    return item.value > 0.5 ? renderBarWithTextInside(item) : renderBarWithTextOutside(item)
  }

  // Renders the word chart with appropriate number of words displayed
  const renderWordChart = () => {
    return wordChartData.slice(0, numOfWordsCurrentlyDisplayed)
      .map((item: string) => renderBarWithText(item));
  }

  // A Pressable that toggles state, to change number of words displayed
  const renderShowMoreButton = () => {
    // Don't display option to show more words if not enough words to make a difference
    if (wordChartData && (wordChartData.length < defaultNumOfWords)) return null;

    return (
      moreWordsShown
        ?
        <Pressable onPress={toggleShowWords}>
          <View style={styles.iconTextContainer}>
            <Feather name={"chevron-up"} style={[icons.TINY, { position: 'relative', color: colors.PRIMARY }]} />
            <Text>Show Less</Text>
          </View>
        </Pressable>
        :
        <Pressable onPress={toggleShowWords}>
          <View style={styles.iconTextContainer}>
            <Feather name={"chevron-down"} style={[icons.TINY, { position: 'relative', color: colors.PRIMARY }]} />
            <Text>Show More</Text>
          </View>
        </Pressable>
    )
  }

  return (
    abridged
      ?
      <View>
        <Text style={styles.featureTitle}>Top Words</Text>
        <ScrollView>
          {renderWordChart()}
        </ScrollView>
      </View>
      :
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.featureTitle}>Frequent Words</Text>
          {renderShowMoreButton()}
        </View>

        <ScrollView>
          {renderWordChart()}
          <View style={{ marginTop: spacings.HUGE }}><Divider color={colors.SECONDARY} /></View>
          <View style={{ marginVertical: spacings.MEDIUM }}><VistaSummaryText summaryText={WORD_CHART_SUMMARY} callback={callback} /></View>
        </ScrollView>
      </View>
  )
}

const styles = StyleSheet.create({
  barItemContainer: {
    marginVertical: spacings.SMALL + spacings.TINY,  // 7px
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    backgroundColor: colors.HIGHLIGHT,
    height: 37,
    justifyContent: 'center',
    paddingHorizontal: spacings.MEDIUM,
    marginRight: spacings.MEDIUM
  },
  barText: {
    ...text.h4
  },
  barNumberContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  barNumberText: {
    ...text.h4,
    color: colors.PRIMARY
  },
  featureTitle: {
    ...text.h4,
    marginBottom: spacings.SMALL,
    color: colors.PRIMARY
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default WordChart;
