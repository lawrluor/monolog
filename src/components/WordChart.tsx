import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';

import { text, spacings, colors, dimensions } from '../styles';

import VideosContext from '../context/VideosContext';

type Props = {
  numOfWords?: number;  
  showMoreButton?: boolean;
}

// Display 10 words by default
// Is overriden to a custom number by passing prop to WordChart from parent component
const DEFAULT_NUM_OF_WORDS_TO_DISPLAY = 10;  
const MAX_NUM_OF_WORDS_TO_DISPLAY = 50;

// Renders the chart of words based on their counts
// Each bar is a series of horizontal containers defined in the styles (barItemContainer, barItem, bar)
// I've created a custom chart because the design is complex and it's likely not worth hacking a vanilla library to do this
// TODO: If the bar value is over 50% of the container width, shift the word text outside of the bar
const WordChart = ({ numOfWords=DEFAULT_NUM_OF_WORDS_TO_DISPLAY, showMoreButton }: Props) => {
  const { wordChartData } = React.useContext(VideosContext);
  const [ numOfWordsCurrentlyDisplayed, setNumOfWordsCurrentlyDisplayed ] = React.useState(numOfWords);
  const [ moreWordsShown, setMoreWordsShown ] = React.useState(false);

  // If press the "Show More/Show Less" pressable, the number of words to display changes
  // NOTE: All words have been loaded into the data already, 
  // and this simply changes the slice of data we look at.
  // TODO: Could analyze the performance of this in the future.
  const toggleShowWords = () => {
    setMoreWordsShown(!moreWordsShown);
    if (numOfWordsCurrentlyDisplayed > DEFAULT_NUM_OF_WORDS_TO_DISPLAY) {
      setNumOfWordsCurrentlyDisplayed(DEFAULT_NUM_OF_WORDS_TO_DISPLAY);  // i.e. top 5 words
    } else {
      // Limit to this number of words instead of showing all words
      setNumOfWordsCurrentlyDisplayed(MAX_NUM_OF_WORDS_TO_DISPLAY);  // i.e. all words (or top 500)
    }
  }

  // This renders each horizontal bar & corresponding word of the WordChart
  // If the bar is over 50% ratio, display the word INSIDE the bar
  // Else, display the word to the right of the bar (after the bar)
  // TODO: Have each bar as a scroll view horizontally to allow for 
  // selecting options on list-items via swipe (iOS style)
  const renderBarWithText = (item: any) => {
    const renderBarWithTextInside = (item: any) => {
      return (
      <View key={item.word} style={styles.barItemContainer}>
        <View key={item.word} style={[styles.bar, { width: dimensions.width * (0.5 * item.value) }]}>
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
          <View key={item.word} style={[styles.bar, { width: dimensions.width * item.value }]}></View>
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
                        .map((item: any) => { 
                          return renderBarWithText(item);
                        });
  }

  // A Pressable that toggles state, to change number of words displayed
  const renderShowMoreButton = () => {
    if (showMoreButton) {
      return ( 
        <View style={styles.showMoreContainer}>
          {
            moreWordsShown
            ?
            <Pressable onPress={toggleShowWords}><Text>{'<'} Show Less</Text></Pressable>
            :
            <Pressable onPress={toggleShowWords}><Text>Show More {'>'}</Text></Pressable>
          }
        </View>
      )
    }

    // Returns null, i.e. doens't render button, if showMoreButton shouldn't exist
    // This happens in Home, for example, where the WordChart is just a summary,
    // and doesn't contain full WordChart functionality
    return null;
  }

  return (
    <View style={styles.featureContainer}>
      <Text style={styles.featureTitle}>Frequent Words</Text>
      <ScrollView>
        {renderWordChart()}
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
  }

});

export default WordChart;
