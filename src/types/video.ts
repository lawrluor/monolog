export type Video = {
  baseName: string;
  name: string;
  uri: string;
  show_video: boolean;
  thumbnail_uri?: string;
  rating?: string;
  transcript_uri?: string;
  transcript_content?: string;
};

export type SectionRow = { list: Video[] };

export type SectionData = {
  title: string;
  key: string;
  data: SectionRow[];
};

export type RecordedSections = Record<string, SectionData>;
