import React, { useState, useCallback } from 'react';
import styles from './ExhibitionConstructor.module.scss';
import {
  PanelTab,
  ExhibitionData,
  FontSettings,
  ColorSettings,
  BlockType,
  ExhibitionBlock,
  BlockItem
} from './types';
import Sidebar from './components/SideBar/SideBar';
import ExhibitionPreview from './components/Preview/ExhibitionPreview';
import Header from '../../components/layout/Header/Header.tsx';

const ExhibitionConstructor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PanelTab>('info');
  const [exhibitionData, setExhibitionData] = useState<ExhibitionData>({
    title: '',
    organization: '',
    description: '',
    team: '',
    tags: [],
    cover: '',
    blocks: []
  });
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    titleFont: 'Serif',
    bodyFont: 'Sans-serif',
    fontSize: 16,
    titleWeight: 'Regular',
    bodyWeight: 'Regular'
  });
  const [colorSettings, setColorSettings] = useState<ColorSettings>({
    primary: '#1F3B2C',
    secondary: '#E8E5DE',
    background: '#FFFFFF',
    text: '#333333'
  });
  
  const updateExhibitionData = (newData: Partial<ExhibitionData>) => {
    setExhibitionData(prev => ({ ...prev, ...newData }));
  };
  
  // ИЗМЕНЕНИЕ 1: Добавляем initialData в сигнатуру функции addBlock
  const addBlock = useCallback((type: BlockType, initialData?: { items?: BlockItem[]; content?: string; }) => {
    console.log('ExhibitionConstructor: addBlock received type:', type, 'and initialData.items:', initialData?.items);
    
    let itemsForNewBlock: BlockItem[];
    
    // ЭТОТ БЛОК КОДА ДОЛЖЕН БЫТЬ ПРАВИЛЬНЫМ:
    if (initialData && initialData.items && initialData.items.length > 0) {
      itemsForNewBlock = initialData.items; // ИСПОЛЬЗУЕМ ПЕРЕДАННЫЕ ДАННЫЕ
    } else if (type.includes('IMAGE') || type === 'CAROUSEL' || type === 'SLIDER' || type.includes('LAYOUT_IMG')) {
      // Если initialData.items нет или они пустые, но это блок с изображениями, создаем пустые слоты
      const numImageSlots = type === 'IMAGES_4' ? 4 : type === 'IMAGES_3' ? 3 : type === 'IMAGES_2' ? 2 : 1;
      itemsForNewBlock = Array(numImageSlots).fill({} as BlockItem); // Создаем пустые объекты {}
    } else {
      // Для других типов блоков, которые не используют items
      itemsForNewBlock = [];
    }
    
    const newBlock: ExhibitionBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      position: exhibitionData.blocks.length,
      content: initialData?.content || '',
      items: itemsForNewBlock, // <-- Используем правильные itemsForNewBlock
      settings: {}
    };
    
    console.log('ExhibitionConstructor: Created newBlock.items:', newBlock.items); // <-- ЭТОТ ЛОГ ВЫ СЕЙЧАС ВИДИТЕ ПУСТЫМ
    
    setExhibitionData(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  }, [exhibitionData.blocks.length]);
  
  const updateBlock = (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => {
    setExhibitionData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, ...updatedBlock } : block
      )
    }));
  };
  
  const removeBlock = (blockId: string) => {
    setExhibitionData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
  };
  
  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = exhibitionData.blocks.findIndex(block => block.id === blockId);
    if (blockIndex === -1) return;
    
    const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
    if (newIndex < 0 || newIndex >= exhibitionData.blocks.length) return;
    
    const newBlocks = [...exhibitionData.blocks];
    [newBlocks[blockIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[blockIndex]];
    
    newBlocks.forEach((block, index) => {
      block.position = index;
    });
    
    setExhibitionData(prev => ({ ...prev, blocks: newBlocks }));
  };
  
  const handleImageUpload = useCallback(async (blockId: string, itemIndex: number, file: File) => {
    console.log(`[ExhibitionConstructor] Attempting to upload image for block ${blockId}, item ${itemIndex}, file:`, file);
    
    try {
      // Simulate File Upload
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const uploadedImageUrl = reader.result as string;
        console.log(`[ExhibitionConstructor] Simulated upload successful. URL: ${uploadedImageUrl}`);
        
        setExhibitionData(prevData => ({
          ...prevData,
          blocks: prevData.blocks.map(block => {
            if (block.id === blockId) {
              const updatedItems = block.items ? [...block.items] : [];
              if (!updatedItems[itemIndex]) {
                updatedItems[itemIndex] = { id: Math.random().toString(36).substring(2, 11), type: 'image' }; // Убедитесь, что объект BlockItem существует
              }
              updatedItems[itemIndex] = { ...updatedItems[itemIndex], image_url: uploadedImageUrl };
              return { ...block, items: updatedItems };
            }
            return block;
          }),
        }));
      };
      
      reader.onerror = (error) => {
        console.error('[ExhibitionConstructor] FileReader error:', error);
      };
      
    } catch (error) {
      console.error('[ExhibitionConstructor] Error during image upload:', error);
      alert('Ошибка загрузки изображения. Проверьте консоль для деталей.');
    }
  }, []); // Добавил [ ], так как зависимостей нет, чтобы useCallback кэшировал функцию
  
  const handleImageRemove = useCallback((blockId: string, itemIndex: number) => {
    console.log(`[ExhibitionConstructor] Removing image for block ${blockId}, item ${itemIndex}`);
    setExhibitionData(prevData => ({
      ...prevData,
      blocks: prevData.blocks.map(block => {
        if (block.id === blockId) {
          const updatedItems = block.items ? [...block.items] : [];
          if (updatedItems[itemIndex]) {
            // Удаляем URL, но сохраняем другие свойства item, если они есть
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], image_url: undefined };
          }
          return { ...block, items: updatedItems };
        }
        return block;
      }),
    }));
  }, []); // Добавил [ ], так как зависимостей нет, чтобы useCallback кэшировал функцию
  
  // Эта функция будет передана в BlocksPanel через Sidebar
  // и вернет URL для использования во временном состоянии BlocksPanel
  const onFileUploadForBlocksPanel = useCallback(async (file: File): Promise<{ url: string }> => {
    console.log('[ExhibitionConstructor] onFileUploadForBlocksPanel called with file:', file);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = () => {
        const uploadedImageUrl = reader.result as string;
        console.log('[ExhibitionConstructor] File read and URL generated:', uploadedImageUrl);
        resolve({ url: uploadedImageUrl });
      };
      
      reader.onerror = (error) => {
        console.error('[ExhibitionConstructor] FileReader error:', error);
        reject(new Error('Failed to read file'));
      };
    });
  }, []); // Пустой массив зависимостей, так как не зависит от изменяемых внешних значений
  
  return (
    <div className={styles.constructorWrapper}>
      <Header currentPath="/exhibits" />
      
      <main className={styles.main}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          exhibitionData={exhibitionData}
          updateExhibitionData={updateExhibitionData}
          fontSettings={fontSettings}
          setFontSettings={setFontSettings}
          colorSettings={colorSettings}
          setColorSettings={setColorSettings}
          addBlock={addBlock}
          onFileUpload={onFileUploadForBlocksPanel} // Передаем функцию для загрузки
        />
        
        <ExhibitionPreview
          className={styles.exhibitionPreview}
          exhibitionData={exhibitionData}
          updateBlock={updateBlock}
          removeBlock={removeBlock}
          moveBlock={moveBlock}
          fontSettings={fontSettings}
          colorSettings={colorSettings}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />
      </main>
    </div>
  );
};

export default ExhibitionConstructor;
