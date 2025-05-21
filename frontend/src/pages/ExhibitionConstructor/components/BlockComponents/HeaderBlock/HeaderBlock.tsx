// components/Blocks/HeaderBlock.tsx
import React, {JSX} from 'react';
import styles from './HeaderBlock.module.scss';

interface HeaderBlockProps {
  content: string; // Correctly expects string
  level?: string;
  style?: React.CSSProperties;
}

const HeaderBlock: React.FC<HeaderBlockProps> = ({ content, level = 'h2', style }) => {
  const Tag = level as keyof JSX.IntrinsicElements;
  
  return (
    <div className={styles.block}>
      <Tag className={styles.header} style={style}>{content}</Tag>
    </div>
  );
};

export default HeaderBlock;
