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
  | 'VIDEO';

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
    autoplay?: boolean;
    speed?: number;
    video_url?: string;
    [key: string]: any;
  };
  position: number;
}

export interface ExhibitionData {
  /** появится после первого сохранения (создания на бэке) */
  id?: string;
  title: string;
  description: string;
  /** UI-поле (строкой). На бэк сейчас кладём в settings.constructor */
  organization: string;
  /** UI-поле (строкой). На бэк мапим в participants (сплит по запятым/новой строке) */
  team: string;
  tags: string[];
  blocks: ExhibitionBlock[];
  /** URL для превью (например: `${VITE_API_URL}/api/v1/files/${coverKey}`) */
  cover?: string;
  /** object_key из /files/upload — то, что нужно бэку как cover_image_key */
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
  imageUrl?: string; // data-url или обычный URL
}

