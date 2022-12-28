import React from 'react';
import { View, Text, StyleSheet, FlatList, SectionList } from 'react-native';

import Thumbnail from '../components/Thumbnail';

import { spacings, text, colors } from '../styles';

const VideoList = ({ navigation, videoData }) => {
  const renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    )
  }

  const renderListItem = ({ item }) => {
    return (
      <Thumbnail
        video={item}
        navigation={navigation}>
      </Thumbnail>
    )
  }

  const keyExtractor = (item) => {
    return item.name;
  }

  const renderSection = ({ item }) => {
    return (
      <FlatList
        data={item.list}
        numColumns={3}
        renderItem={renderListItem}
        keyExtractor={keyExtractor}
      />
    )
  }

  return (
    <SectionList
      style={styles.sectionList}
      sections={videoData}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderSection}
      showsVerticalScrollIndicator={false}
      keyExtractor={keyExtractor}
    />
  )
}

const styles = StyleSheet.create({
  sectionList: {

  },
  sectionTitleContainer: {
    flex: 1,
    backgroundColor: colors.BACKGROUND
  },
  sectionTitle: {
    ...text.h3,
    marginVertical: spacings.MEDIUM,
    marginLeft: spacings.SMALL,
    color: colors.SECONDARY,
  }
});

export default VideoList;
