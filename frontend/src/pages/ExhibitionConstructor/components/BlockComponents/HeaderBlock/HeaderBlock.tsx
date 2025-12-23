// components/Blocks/HeaderBlock.tsx
import React, {JSX} from 'react';
import styles from './HeaderBlock.module.scss';
import TextBlock from '../TextBlock/TextBlock';

interface HeaderBlockProps {
  content: string;
  level?: string;
  style?: React.CSSProperties;
  onContentChange?: (newContent: string) => void;
  readOnly?: boolean;
}

const HeaderBlock: React.FC<HeaderBlockProps> = ({ content, level = 'h2', style, onContentChange, readOnly = false }) => {
  if (readOnly) {
    const Tag = level as keyof JSX.IntrinsicElements;
    return (
      <div className={styles.block}>
        <Tag className={styles.header} style={style}>{content}</Tag>
      </div>
    );
  }
  
  return (
    <div className={styles.block}>
      <TextBlock
        initialContent={content}
        content={content}
        onContentChange={onContentChange}
        style={style}
        placeholder="Введите заголовок..."
        isHeader={true}
        readOnly={readOnly}
      />
    </div>
  );
};

export default HeaderBlock;
