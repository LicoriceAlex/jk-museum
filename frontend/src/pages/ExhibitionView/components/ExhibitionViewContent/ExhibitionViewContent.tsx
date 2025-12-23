import React from 'react';
import { ExhibitionData, FontSettings, ColorSettings, PageBackgroundSettings, ExhibitionBlock } from '../../../ExhibitionConstructor/types';
import BlockView from '../BlockView/BlockView';
import styles from './ExhibitionViewContent.module.scss';

interface ExhibitionViewContentProps {
  exhibitionData: ExhibitionData;
  fontSettings: FontSettings;
  colorSettings: ColorSettings;
  pageBackground: PageBackgroundSettings;
}

const ExhibitionViewContent: React.FC<ExhibitionViewContentProps> = ({
  exhibitionData,
  fontSettings,
  colorSettings,
  pageBackground,
}) => {
  return (
    <div
      className={styles.exhibitionView}
      style={{
        backgroundColor: colorSettings.background,
        color: colorSettings.text,
        ...(pageBackground.mode === 'image' && pageBackground.imageUrl
          ? {
              backgroundImage: `url(${pageBackground.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : {}),
      }}
    >
      <div className={styles.headerContent}>
        {exhibitionData.cover && (
          <img
            src={exhibitionData.cover}
            alt="Обложка выставки"
            className={styles.coverImage}
          />
        )}

        <div className={styles.textContent}>
          <h1
            style={{
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
              fontSize: `${fontSettings.fontSize * 2.5}px`,
              color: colorSettings.primary,
            }}
          >
            {exhibitionData.title || 'Название выставки'}
          </h1>
          <div className={styles.otherInfo}>
            <p
              style={{
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
                fontSize: `${fontSettings.fontSize * 1.2}px`,
                color: colorSettings.text,
              }}
            >
              {exhibitionData.description || 'Описание выставки'}
            </p>

            {exhibitionData.organization && (
              <p
                style={{
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
                  fontSize: `${fontSettings.fontSize}px`,
                  color: colorSettings.text,
                }}
              >
                Организация: {exhibitionData.organization}
              </p>
            )}

            {exhibitionData.team && (
              <p
                style={{
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
                  fontSize: `${fontSettings.fontSize}px`,
                  color: colorSettings.text,
                }}
              >
                Команда: {exhibitionData.team}
              </p>
            )}

            {exhibitionData.tags && exhibitionData.tags.length > 0 && (
              <div className={styles.tags}>
                {exhibitionData.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                      fontSize: `${fontSettings.fontSize * 0.9}px`,
                      color: colorSettings.secondary,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.blocksContainer}>
        {exhibitionData.blocks.map((block) => (
          <BlockView
            key={block.id}
            block={block}
            fontSettings={fontSettings}
            colorSettings={colorSettings}
          />
        ))}
      </div>
    </div>
  );
};

export default ExhibitionViewContent;

