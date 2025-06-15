import React, { useState, useEffect, useRef } from 'react';
import styles from './TextBlock.module.scss';

interface EditableTextProps {
  initialContent: string;
  onContentChange: (newContent: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  isHeader?: boolean;
}

const TextBlock: React.FC<EditableTextProps> = ({
                                                     initialContent,
                                                     onContentChange,
                                                     style,
                                                     placeholder = 'Нажмите, чтобы добавить текст...',
                                                     isHeader = false,
                                                   }) => {
  const [content, setContent] = useState(initialContent);
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setContent(initialContent);
    if (divRef.current && divRef.current.textContent !== initialContent) {
      divRef.current.textContent = initialContent;
    }
  }, [initialContent]);
  
  const handleInput = () => {
    if (divRef.current) {
      setContent(divRef.current.textContent || '');
    }
  };
  
  const handleBlur = () => {
    onContentChange(content);
  };
  
  const Tag = isHeader ? 'h2' : 'p';
  
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
      {initialContent || ''}
    </Tag>
  );
};

export default TextBlock;
