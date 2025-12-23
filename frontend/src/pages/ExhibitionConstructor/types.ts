export type BlockType =
  | 'HEADER'
  | 'TEXT'
  | 'QUOTE'
  | 'IMAGE_TEXT_RIGHT'
  | 'IMAGE_TEXT_LEFT'
  | 'LAYOUT_IMG_TEXT_IMG'
  | 'LAYOUT_TEXT_IMG_TEXT'
  | 'IMAGE'
  | 'IMAGES_2'
  | 'IMAGES_3'
  | 'IMAGES_4'
  | 'IMAGE_UPLOAD'
  | 'SLIDER'
  | 'PHOTO'
  | 'CAROUSEL'

export interface BlockItem {
  id: string;
  image_url?: string;
  text?: string;
  type?: 'image' | 'text';
}

export interface ExhibitionBlock {
  id: string;
  type: BlockType;
  content?: string;
  items?: BlockItem[];
  settings?: {
    level?: string;
    author?: string;
    source?: string;
    text_left_html?: string;
    text_right_html?: string;
    carousel_variant?: string;
    [key: string]: any;
  };
  position: number;
}

export interface ExhibitionData {
  id?: string;
  title: string;
  description: string;
  organization: string;
  team: string;
  tags: string[];
  blocks: ExhibitionBlock[];
  cover?: string;
  coverKey?: string;
}

export interface FontSettings {
  titleFont: string;
  bodyFont: string;
  fontSize: number;
  titleWeight: string;
  bodyWeight: string;
}

export interface ColorSettings {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export type PanelTab = 'info' | 'styles' | 'blocks';

export type PageBackgroundMode = 'color' | 'image';

export interface PageBackgroundSettings {
  mode: PageBackgroundMode;
  imageUrl?: string;
}

