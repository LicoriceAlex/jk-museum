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
                                                     placeholder = 'Введите текст...',
                                                     isHeader = false,
                                                     readOnly = false,
                                                     content,
                                                   }) => {
  const [localContent, setLocalContent] = useState(content || initialContent);
  const divRef = useRef<HTMLDivElement>(null);
  
  // Устанавливаем содержимое и направление через ref при каждом рендере
  useEffect(() => {
    if (divRef.current && !readOnly) {
      const newContent = content !== undefined ? content : initialContent;
      const currentText = divRef.current.textContent || '';
      
      // Обновляем содержимое только если оно изменилось
      if (currentText !== newContent) {
        if (!newContent || !newContent.trim()) {
          divRef.current.innerHTML = '';
        } else {
          divRef.current.textContent = newContent;
        }
      }
      
      // Устанавливаем direction через inline стиль для гарантии
      divRef.current.style.direction = 'ltr';
      divRef.current.setAttribute('dir', 'ltr');
    }
  }, [content, initialContent, readOnly]);
  
  const handleInput = () => {
    if (divRef.current && !readOnly) {
      const text = divRef.current.textContent || '';
      setLocalContent(text);
      
      // Если элемент пустой, очищаем innerHTML чтобы :empty работал
      if (!text.trim()) {
        divRef.current.innerHTML = '';
      }
      
      // Поддерживаем direction при вводе
      divRef.current.style.direction = 'ltr';
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
        dir="ltr"
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
      style={{ ...style, direction: 'ltr' }}
      data-placeholder={placeholder}
      dir="ltr"
      spellCheck={false}
    />
  );
};

export default TextBlock;
