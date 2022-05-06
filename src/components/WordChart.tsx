import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';

import { Feather } from '@expo/vector-icons';

import Divider from './Divider';

import VideosContext from '../context/VideosContext';

import { text, spacings, colors, dimensions, icons } from '../styles';

type Props = {
  defaultNumOfWords?: number;  
  abridged?: boolean;
}

const MAX_NUM_OF_WORDS_TO_DISPLAY = 50;
const SUMMARY_TEXT = "The word chart is important for understanding what you typically speak about during your video logs. The number refers to how many times the word appeared."

// Renders the chart of words based on their counts
// Each bar is a series of horizontal containers defined in the styles (barItemContainer, barItem, bar)
// I've created a custom chart because the design is complex and it's likely not worth hacking a vanilla library to do this
// TODO: If the bar value is over 50% of the container width, shift the word text outside of the bar
const WordChart = ({ defaultNumOfWords=10, abridged }: Props) => {
  const { wordChartData } = React.useContext(VideosContext);
  const [ numOfWordsCurrentlyDisplayed, setNumOfWordsCurrentlyDisplayed ] = React.useState(defaultNumOfWords);
  const [ moreWordsShown, setMoreWordsShown ] = React.useState(false);

  // If press the "Show More/Show Less" pressable, the number of words to display changes
  // NOTE: All words have been loaded into the data already, 
  // and this simply changes the slice of data we look at.
  // TODO: Could analyze the performance of this in the future.
  const toggleShowWords = () => {
    setMoreWordsShown(!moreWordsShown);
  }

  React.useEffect(() => {
    if (moreWordsShown) {
      // Limit to this number of words instead of showing all words
      setNumOfWordsCurrentlyDisplayed(MAX_NUM_OF_WORDS_TO_DISPLAY);  // i.e. all words (or top 500)
    } else {
      setNumOfWordsCurrentlyDisplayed(defaultNumOfWords);  // i.e. top 5 words
    }
    console.log(numOfWordsCurrentlyDisplayed)
  }, [moreWordsShown])

  // This renders each horizontal bar & corresponding word of the WordChart
  // If the bar is over 50% ratio, display the word INSIDE the bar
  // Else, display the word to the right of the bar (after the bar)
  // TODO: Have each bar as a scroll view horizontally to allow for 
  // selecting options on list-items via swipe (iOS style)
  const renderBarWithText = (item: any) => {
    const fullSizeBar = dimensions.width * 0.75;  // featureContainer is around 85% of screen width

    const renderBarWithTextInside = (item: any) => {
      return (
      <View key={item.word} style={styles.barItemContainer}>
        <View key={item.word} style={[styles.bar, { width: fullSizeBar * item.value }]}>
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
          <View key={item.word} style={[styles.bar, { width: fullSizeBar * item.value }]}></View>
          <Text style={[styles.barText, { 'color': colors.HIGHLIGHT }]}>{item.word}</Text>
          
          <View style={styles.barNumberContainer}>
            <Text style={styles.barNumberText}>{item.count}</Text>
          </View>
        </View>
      )
    }

    return ( 
      item.value > 0.5 
      ?
      renderBarWithTextInside(item)
      :
      renderBarWithTextOutside(item)
    )
  }

  // Renders the word chart with appropriate number of words displayed
  const renderWordChart = () => {
    return wordChartData.slice(0, numOfWordsCurrentlyDisplayed)
                        .map((item: any) => renderBarWithText(item));
  }

  // A Pressable that toggles state, to change number of words displayed
  const renderShowMoreButton = () => {
    if (!abridged) {
      return ( 
        <View style={styles.showMoreContainer}>
          {
            moreWordsShown
            ?
            <Pressable onPress={toggleShowWords}>
              <View style={styles.iconTextContainer}>
                <Feather name={"chevron-up"} style={[icons.TINY, {position: 'relative', color: colors.PRIMARY}]}/>
                <Text>Show Less</Text>
              </View>
            </Pressable>
            :
            <Pressable onPress={toggleShowWords}>
              <View style={styles.iconTextContainer}>
                <Feather name={"chevron-down"} style={[icons.TINY, {position: 'relative', color: colors.PRIMARY}]}/>
                <Text>Show More</Text>
              </View>
            </Pressable>
          }
        </View>
      )
    }

    // Returns null, i.e. doens't render button, if showMoreButton shouldn't exist
    // This happens in Home, for example, where the WordChart is just a summary,
    // and doesn't contain full WordChart functionality
    return null;
  }

  const renderSummaryText = () => {
    return (
      <View style={styles.summaryTextContainer}>
        <View style={{ marginVertical: spacings.MEDIUM }}><Divider color={colors.SECONDARY} /></View>
        <Text style={styles.summaryText}>{SUMMARY_TEXT}</Text>
      </View>
    )
  }

  return (
    abridged
    ?
    <View style={styles.featureContainer}>
      <Text style={styles.featureTitle}>Top Words</Text>
      <ScrollView>
        {renderWordChart()}
      </ScrollView>
    </View>
    :
    <View style={styles.featureContainer}>
      <Text style={styles.featureTitle}>Frequent Words</Text>
      <ScrollView>
        {renderWordChart()}
        {renderSummaryText()}
      </ScrollView>

      {renderShowMoreButton()}
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
  showMoreContainer: {
    marginTop: spacings.MEDIUM,
    alignItems: 'flex-end',
  },
  iconTextContainer: {
    // borderWidth: 1,
    // borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center'
  },
  summaryTextContainer: {
    marginVertical: spacings.SMALL
  },
  summaryText: {
    ...text.p, 
    color: colors.SECONDARY,
    textAlign: 'center'
  }
});

export default WordChart;
