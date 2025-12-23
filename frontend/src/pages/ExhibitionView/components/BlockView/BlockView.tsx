import React from 'react';
import { ExhibitionBlock, FontSettings, ColorSettings } from '../../../ExhibitionConstructor/types';

import HeaderBlock from '../../../ExhibitionConstructor/components/BlockComponents/HeaderBlock/HeaderBlock';
import TextBlock from '../../../ExhibitionConstructor/components/BlockComponents/TextBlock/TextBlock';
import QuoteBlock from '../../../ExhibitionConstructor/components/BlockComponents/QuoteBlock/QuoteBlock';
import ImageTextBlock from '../../../ExhibitionConstructor/components/BlockComponents/ImageTextBlock/ImageTextBlock';
import ImagesGridBlock from '../../../ExhibitionConstructor/components/BlockComponents/ImagesGridBlock/ImagesGridBlock';
import ImageBlock from '../../../ExhibitionConstructor/components/BlockComponents/ImageBlock/ImageBlock';
import LayoutImgTextImgBlock from '../../../ExhibitionConstructor/components/BlockComponents/LayoutImgTextImgBlock/LayoutImgTextImgBlock';
import LayoutTextImgTextBlock from '../../../ExhibitionConstructor/components/BlockComponents/LayoutTextImgTextBlock/LayoutTextImgTextBlock';
import CarouselBlock from '../../../ExhibitionConstructor/components/BlockComponents/CarouselBlock/CarouselBlock';
import SliderBlock from '../../../ExhibitionConstructor/components/BlockComponents/SliderBlock/SliderBlock';

import styles from './BlockView.module.scss';

interface BlockViewProps {
  block: ExhibitionBlock;
  fontSettings: FontSettings;
  colorSettings: ColorSettings;
}

const BlockView: React.FC<BlockViewProps> = ({
  block,
  fontSettings,
  colorSettings,
}) => {
  // Стиль для обычного текста
  const textStyle: React.CSSProperties = {
    fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
    fontWeight:
      fontSettings.bodyWeight === 'Normal'
        ? 'normal'
        : fontSettings.bodyWeight === 'Bold'
          ? 'bold'
          : fontSettings.bodyWeight === 'Light'
            ? 300
            : 'normal',
    fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
    color: colorSettings.text,
    fontSize: `${fontSettings.fontSize}px`,
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: fontSettings.titleFont,
    fontWeight:
      fontSettings.titleWeight === 'Normal'
        ? 'normal'
        : fontSettings.titleWeight === 'Bold'
          ? 'bold'
          : fontSettings.titleWeight === 'Light'
            ? 300
            : 'normal',
    fontStyle: fontSettings.titleWeight === 'Italic' ? 'italic' : 'normal',
    color: colorSettings.primary,
    fontSize: `${fontSettings.fontSize * 1.5}px`,
  };

  const content = (() => {
    switch (block.type) {
      case 'HEADER':
        return (
          <HeaderBlock
            content={block.content || ''}
            level={block.settings?.level || 'h2'}
            style={headerStyle}
            readOnly={true}
          />
        );

      case 'TEXT':
        return (
          <TextBlock
            initialContent={block.content || ''}
            content={block.content || ''}
            style={textStyle}
            readOnly={true}
          />
        );

      case 'QUOTE':
        return (
          <QuoteBlock
            content={block.content || ''}
            settings={block.settings}
            onUpdate={() => {}}
            style={textStyle}
            readOnly={true}
          />
        );

      case 'IMAGE':
        return (
          <ImageBlock
            imageUrl={block.items?.[0]?.image_url}
            readOnly={true}
          />
        );

      case 'IMAGES_2':
      case 'IMAGES_3':
      case 'IMAGES_4':
      case 'PHOTO':
        return (
          <ImagesGridBlock
            items={block.items || []}
            columns={block.type === 'IMAGES_2' ? 2 : block.type === 'IMAGES_3' ? 3 : block.type === 'IMAGES_4' ? 4 : 1}
            readOnly={true}
          />
        );

      case 'IMAGE_TEXT_RIGHT':
      case 'IMAGE_TEXT_LEFT':
        return (
          <ImageTextBlock
            blockId={block.id}
            content={block.content || ''}
            imageUrl={block.items?.[0]?.image_url}
            imagePosition={block.type === 'IMAGE_TEXT_RIGHT' ? 'right' : 'left'}
            style={textStyle}
            onImageUpload={() => {}}
            onImageRemove={() => {}}
            updateBlock={() => {}}
            readOnly={true}
          />
        );

      case 'LAYOUT_IMG_TEXT_IMG':
        return (
          <LayoutImgTextImgBlock
            blockId={block.id}
            items={block.items || []}
            content={block.content || ''}
            style={textStyle}
            updateBlock={() => {}}
            onImageUpload={() => {}}
            onImageRemove={() => {}}
            readOnly={true}
          />
        );

      case 'LAYOUT_TEXT_IMG_TEXT':
        return (
          <LayoutTextImgTextBlock
            blockId={block.id}
            leftText={block.settings?.text_left_html || ''}
            rightText={block.settings?.text_right_html || ''}
            imageUrl={block.items?.[0]?.image_url}
            style={textStyle}
            updateBlock={() => {}}
            onImageUpload={() => {}}
            onImageRemove={() => {}}
            readOnly={true}
          />
        );

      case 'CAROUSEL':
        return (
          <CarouselBlock
            blockId={block.id}
            items={block.items || []}
            onImageUpload={() => {}}
            onImageRemove={() => {}}
            updateBlock={() => {}}
            readOnly={true}
          />
        );

      case 'SLIDER':
        return (
          <SliderBlock
            blockId={block.id}
            items={block.items || []}
            onImageUpload={() => {}}
            onImageRemove={() => {}}
            updateBlock={() => {}}
            readOnly={true}
          />
        );

      default:
        return null;
    }
  })();

  return (
    <div className={styles.blockViewWrapper}>
      {content}
    </div>
  );
};

export default BlockView;

