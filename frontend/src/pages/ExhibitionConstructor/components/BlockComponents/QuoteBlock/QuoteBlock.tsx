import React from 'react';
import { ExhibitionBlock } from '../../../types';
import TextBlock from '../TextBlock/TextBlock';
import styles from './QuoteBlock.module.scss';

interface QuoteBlockProps {
  content: string;
  settings?: ExhibitionBlock['settings'];
  onUpdate?: (updatedData: Partial<ExhibitionBlock>) => void;
  style?: React.CSSProperties;
  readOnly?: boolean;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ content, settings, onUpdate, style, readOnly = false }) => {
  const handleQuoteChange = (newContent: string) => {
    if (!readOnly && onUpdate) {
      onUpdate({ content: newContent });
    }
  };

  const handleAuthorChange = (newAuthor: string) => {
    if (!readOnly && onUpdate) {
      onUpdate({ settings: { ...settings, author: newAuthor } });
    }
  };

  const baseSize =
    typeof style?.fontSize === 'string'
      ? parseFloat(style.fontSize)
      : typeof style?.fontSize === 'number'
        ? style.fontSize
        : 18;

  const quoteTextStyle: React.CSSProperties = {
    ...style,
    fontSize: `${baseSize * 1.6}px`,
    fontStyle: 'italic',
    textAlign: 'center',
  };

  const authorStyle: React.CSSProperties = {
    ...style,
    fontSize: `${baseSize * 1.2}px`,
    fontStyle: 'normal',
    textAlign: 'center',
  };

  return (
    <div className={styles.quoteBlock}>
      <span className={styles.quoteMarkTopLeft}>&#8220;</span>

      <div className={styles.quoteContentWrapper}>
        <TextBlock
          initialContent={content}
          content={content}
          onContentChange={readOnly ? undefined : handleQuoteChange}
          style={quoteTextStyle}
          placeholder="Введите цитату"
          readOnly={readOnly}
        />

        <hr className={styles.quoteSeparator} />

        <TextBlock
          initialContent={(settings as any)?.author || ''}
          content={(settings as any)?.author || ''}
          onContentChange={readOnly ? undefined : handleAuthorChange}
          style={authorStyle}
          placeholder="Введите автора цитаты"
          readOnly={readOnly}
        />
      </div>

      <span className={styles.quoteMarkBottomRight}>&#8221;</span>
    </div>
  );
};

export default QuoteBlock;
