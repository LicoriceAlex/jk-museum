// components/Preview/ExhibitionPreview.tsx
import React from 'react';
import BlockPreview from '../Preview/BlockPreview';
import { ExhibitionBlock, ExhibitionData, FontSettings, ColorSettings } from '../../types';

import styles from './ExhibitionPreview.module.scss';

interface ExhibitionPreviewProps {
  exhibitionData: ExhibitionData;
  updateBlock: (blockId: string, updatedFields: Partial<ExhibitionBlock>) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
  fontSettings: FontSettings;
  colorSettings: ColorSettings;
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
  className?: string;
}

const ExhibitionPreview: React.FC<ExhibitionPreviewProps> = ({
                                                               exhibitionData,
                                                               updateBlock,
                                                               removeBlock,
                                                               moveBlock,
                                                               fontSettings,
                                                               colorSettings,
                                                               onImageUpload,
                                                               onImageRemove,
                                                               className
                                                             }) => {
  
  console.log('ExhibitionPreview: exhibitionData.blocks at render:', exhibitionData.blocks);
  
  return (
    <div
      className={`${styles.previewArea} ${className || ''}`}
      style={{
        backgroundColor: colorSettings.background,
        color: colorSettings.text
      }}
    >
      <div className={styles.headerContent}>
        {exhibitionData.cover && (
          <img src={exhibitionData.cover} alt="Обложка выставки"
               className={styles.coverImage}/>
        )}
        
        <div className={styles.textContent}>
          <h1
            style={{
              fontFamily: fontSettings.titleFont,
              fontWeight: fontSettings.titleWeight === 'Normal' ? 'normal' :
                fontSettings.titleWeight === 'Bold' ? 'bold' :
                  fontSettings.titleWeight === 'Light' ? 300 :
                    'normal',
              fontStyle: fontSettings.titleWeight === 'Italic' ? 'italic' : 'normal',
              fontSize: `${fontSettings.fontSize * 2.5}px`,
              color: colorSettings.primary
            }}
          >
            {exhibitionData.title || 'Название выставки'}
          </h1>
          <div className={styles.otherInfo}>
            <p
              style={{
                fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                fontWeight: fontSettings.bodyWeight === 'Normal' ? 'normal' :
                  fontSettings.bodyWeight === 'Bold' ? 'bold' :
                    fontSettings.bodyWeight === 'Light' ? 300 :
                      'normal',
                fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
                fontSize: `${fontSettings.fontSize * 1.2}px`,
                color: colorSettings.text
              }}
            >
              {exhibitionData.description || 'Описание выставки'}
            </p>
            
            <p
              style={{
                fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                fontWeight: fontSettings.bodyWeight === 'Normal' ? 'normal' :
                  fontSettings.bodyWeight === 'Bold' ? 'bold' :
                    fontSettings.bodyWeight === 'Light' ? 300 :
                      'normal',
                fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
                fontSize: `${fontSettings.fontSize}px`,
                color: colorSettings.text
              }}
            >
              Организация: {exhibitionData.organization || 'Музейная организация'}
            </p>
            
            {exhibitionData.team && (
              <p
                style={{
                  fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                  fontWeight: fontSettings.bodyWeight === 'Normal' ? 'normal' :
                    fontSettings.bodyWeight === 'Bold' ? 'bold' :
                      fontSettings.bodyWeight === 'Light' ? 300 :
                        'normal',
                  fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
                  fontSize: `${fontSettings.fontSize}px`,
                  color: colorSettings.text
                }}
              >
                Команда: {exhibitionData.team}
              </p>
            )}
            
            {exhibitionData.tags && exhibitionData.tags.length > 0 && (
              <p
                style={{
                  fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                  fontWeight: fontSettings.bodyWeight === 'Normal' ? 'normal' :
                    fontSettings.bodyWeight === 'Bold' ? 'bold' :
                      fontSettings.bodyWeight === 'Light' ? 300 :
                        'normal',
                  fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
                  fontSize: `${fontSettings.fontSize}px`,
                  color: colorSettings.text
                }}
              >
                Теги: {exhibitionData.tags.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {exhibitionData.blocks.map((block: ExhibitionBlock) => (
        <BlockPreview
          key={block.id}
          block={block}
          updateBlock={updateBlock}
          removeBlock={removeBlock}
          moveBlock={moveBlock}
          onImageUpload={onImageUpload}
          onImageRemove={onImageRemove}
          fontSettings={fontSettings}
          colorSettings={colorSettings}
        />
      ))}
    </div>
  );
};

export default ExhibitionPreview;
