import React, { useState, useEffect, useRef } from 'react';
import styles from './TextBlock.module.scss';

interface EditableTextProps {
  initialContent: string;
  onContentChange?: (newContent: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  isHeader?: boolean;
  readOnly?: boolean;
  content?: string;
}

const TextBlock: React.FC<EditableTextProps> = ({
                                                     initialContent,
                                                     onContentChange,
                                                     style,
                                                     placeholder = 'Нажмите, чтобы добавить текст...',
                                                     isHeader = false,
                                                     readOnly = false,
                                                     content,
                                                   }) => {
  const [localContent, setLocalContent] = useState(content || initialContent);
  const divRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const newContent = content !== undefined ? content : initialContent;
    setLocalContent(newContent);
    if (divRef.current && divRef.current.textContent !== newContent) {
      divRef.current.textContent = newContent;
    }
  }, [content, initialContent]);
  
  const handleInput = () => {
    if (divRef.current && !readOnly) {
      setLocalContent(divRef.current.textContent || '');
    }
  };
  
  const handleBlur = () => {
    if (!readOnly && onContentChange) {
      onContentChange(localContent);
    }
  };
  
  const Tag = isHeader ? 'h2' : 'p';
  const displayContent = content !== undefined ? content : localContent;
  
  if (readOnly) {
    return (
      <Tag
        ref={divRef}
        className={`${styles.Text} ${styles.readOnly}`}
        style={style}
      >
        {displayContent || ''}
      </Tag>
    );
  }
  
  return (
    <Tag
      ref={divRef}
      contentEditable
      suppressContentEditableWarning={true}
      onInput={handleInput}
      onBlur={handleBlur}
      className={styles.Text}
      style={style}
      data-placeholder={placeholder}
    >
      {displayContent || ''}
    </Tag>
  );
};

export default TextBlock;
