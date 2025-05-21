// components/BlockComponents/QuoteBlock/QuoteBlock.tsx
import React from 'react';
import { ExhibitionBlock } from '../../../types'; // Assuming ExhibitionBlock is needed for settings
import TextBlock from '../TextBlock/TextBlock'; // Assuming you want quotes to be editable
import styles from './QuoteBlock.module.scss';

interface QuoteBlockProps {
  content: string;
  settings?: ExhibitionBlock['settings']; // Settings might contain author, source, etc.
  onUpdate: (updatedData: Partial<ExhibitionBlock>) => void; // ADDED: Prop for updating content/settings
  style?: React.CSSProperties; // Optional: for applying text styles
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ content, settings, onUpdate, style }) => {
  
  const handleQuoteChange = (newContent: string) => {
    onUpdate({ content: newContent });
  };
  
  const handleAuthorChange = (newAuthor: string) => {
    onUpdate({ settings: { ...settings, author: newAuthor } });
  };
  
  const handleSourceChange = (newSource: string) => {
    onUpdate({ settings: { ...settings, source: newSource } });
  };
  
  return (
    <div className={styles.quoteBlock}>
      <TextBlock
        initialContent={content}
        onContentChange={handleQuoteChange}
        style={style}
        placeholder="Введите цитату"
      />
      {settings?.author && (
        <TextBlock
          initialContent={settings.author}
          onContentChange={handleAuthorChange}
          style={{ ...style, fontStyle: 'italic', fontSize: '0.9em' }}
          placeholder="Автор"
        />
      )}
      {settings?.source && (
        <TextBlock
          initialContent={settings.source}
          onContentChange={handleSourceChange}
          style={{ ...style, fontSize: '0.8em' }}
          placeholder="Источник"
        />
      )}
    </div>
  );
};

export default QuoteBlock;
