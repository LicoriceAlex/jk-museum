import React from 'react';
import TextBlock from '../TextBlock/TextBlock';
import styles from './LayoutImgTextImgBlock.module.scss';
import { ExhibitionBlock, BlockItem } from '../../../types.ts';

interface StaticImageDisplayProps {
  imageUrl?: string;
}

const StaticImageDisplay: React.FC<StaticImageDisplayProps> = ({ imageUrl }) => {
  return (
    <div className={styles.imageWrapper}>
      {imageUrl ? (
        <img src={imageUrl} alt="Блок изображения" className={styles.staticImage} />
      ) : (
        <div className={styles.placeholderImage}>
          <p>Нет изображения</p>
        </div>
      )}
    </div>
  );
};

interface LayoutImgTextImgBlockProps {
  blockId: string;
  content: string;
  items: BlockItem[];
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
  style?: React.CSSProperties;
}

const LayoutImgTextImgBlock: React.FC<LayoutImgTextImgBlockProps> = ({
                                                                       blockId,
                                                                       content,
                                                                       items = [],
                                                                       updateBlock,
                                                                       style,
                                                                     }) => {
  
  const handleTextChange = (newContent: string) => {
    updateBlock(blockId, { content: newContent });
  };
  const leftImageUrl = items[0]?.image_url;
  const rightImageUrl = items[1]?.image_url;
  
  return (
    <div className={styles.block}>
      <div className={styles.layout}>
        <StaticImageDisplay imageUrl={leftImageUrl} />
        
        <div className={styles.contentWrapper}>
          <TextBlock
            initialContent={content}
            onContentChange={handleTextChange}
            style={style}
            placeholder="Нажмите, чтобы добавить описание"
          />
        </div>
        <StaticImageDisplay imageUrl={rightImageUrl} />
      </div>
    </div>
  );
};

export default LayoutImgTextImgBlock;
