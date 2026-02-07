import React from 'react';
import { View, Text, StyleSheet, FlatList, SectionList } from 'react-native';
import { type StackNavigationProp } from '@react-navigation/stack';

import Thumbnail from '../components/Thumbnail';
import { type Video, type SectionData, type SectionRow } from '../types/video';
import { type AppStackParamsList } from '../types/navigation';
import { spacings, text, colors } from '../styles';

type Props = {
  navigation: StackNavigationProp<AppStackParamsList>;
  videoData: SectionData[];
}

const VideoList = ({ navigation, videoData }: Props) => {
  const renderSectionHeader = ({ section }: { section: SectionData }) => {
    return (
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    )
  }

  const renderListItem = ({ item }: { item: Video }) => {
    return (
      <Thumbnail
        video={item}
        navigation={navigation}>
      </Thumbnail>
    )
  }

  const renderSection = ({ item }: { item: SectionRow }) => {
    return (
      <FlatList
        data={item.list}
        numColumns={3}
        renderItem={renderListItem}
        keyExtractor={(item: Video) => item.uri}
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
      keyExtractor={(item: SectionData) => item.key}
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
