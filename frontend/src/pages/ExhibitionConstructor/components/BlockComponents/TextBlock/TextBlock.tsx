import React, { useState, useEffect, useRef } from 'react';
import styles from './TextBlock.module.scss'; // Create this SCSS module

interface EditableTextProps {
  initialContent: string;
  onContentChange: (newContent: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  isHeader?: boolean; // To apply header-like styles or semantic tags
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
  
  // Update internal content when initialContent prop changes (e.g., block is loaded)
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
    onContentChange(content); // Save changes when focus leaves
  };
  
  const Tag = isHeader ? 'h2' : 'p'; // Use h2 for headers, p for body text
  
  return (
    <Tag
      ref={divRef}
      contentEditable
      suppressContentEditableWarning={true}
      onInput={handleInput}
      onBlur={handleBlur}
      className={styles.Text}
      style={style}
      data-placeholder={placeholder} // For placeholder styling
    >
      {initialContent || ''} {/* Display initial content directly */}
    </Tag>
  );
};

export default TextBlock;
