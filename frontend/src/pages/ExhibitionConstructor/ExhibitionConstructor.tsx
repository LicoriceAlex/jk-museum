import React, { useState, useCallback, useEffect } from 'react';
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
import { PageBackgroundSettings } from './types';
import {
  ORGANIZATION_ID,
  createBlock,
  createExhibition,
  fetchExhibitionById,
  uploadFile,
} from '../../features/exhibitions/service';
import { useParams } from 'react-router-dom';


const ExhibitionConstructor: React.FC = () => {
  const { id: exhibitionId } = useParams<{ id: string }>();
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

  const [pageBackground, setPageBackground] = useState<PageBackgroundSettings>({
  mode: 'color',
  imageUrl: undefined,
});

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoadingExhibition, setIsLoadingExhibition] = useState(false);

  
  const updateExhibitionData = (newData: Partial<ExhibitionData>) => {
    setExhibitionData(prev => ({ ...prev, ...newData }));
  };
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);

  const addBlock = useCallback((type: BlockType, initialData?: { items?: BlockItem[]; content?: string; }) => {
    console.log('ExhibitionConstructor: addBlock received type:', type, 'and initialData.items:', initialData?.items);
    
    let itemsForNewBlock: BlockItem[];
    if (initialData && initialData.items && initialData.items.length > 0) {
      itemsForNewBlock = initialData.items;
    } else if (type.includes('IMAGE') || type === 'CAROUSEL' || type === 'SLIDER' || type.includes('LAYOUT_IMG')) {
      const numImageSlots = type === 'IMAGES_4' ? 4 : type === 'IMAGES_3' ? 3 : type === 'IMAGES_2' ? 2 : 1;
      itemsForNewBlock = Array(numImageSlots).fill({} as BlockItem);
    } else {
      itemsForNewBlock = [];
    }
    
    const newBlock: ExhibitionBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      position: exhibitionData.blocks.length,
      content: initialData?.content || '',
      items: itemsForNewBlock,
      settings: {}
    };
    
    console.log('ExhibitionConstructor: Created newBlock.items:', newBlock.items);
    
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
                updatedItems[itemIndex] = { id: Math.random().toString(36).substring(2, 11), type: 'image' };
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
  }, []);
  
  const handleImageRemove = useCallback((blockId: string, itemIndex: number) => {
    console.log(`[ExhibitionConstructor] Removing image for block ${blockId}, item ${itemIndex}`);
    setExhibitionData(prevData => ({
      ...prevData,
      blocks: prevData.blocks.map(block => {
        if (block.id === blockId) {
          const updatedItems = block.items ? [...block.items] : [];
          if (updatedItems[itemIndex]) {
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], image_url: undefined };
          }
          return { ...block, items: updatedItems };
        }
        return block;
      }),
    }));
  }, []);
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
  }, []);

  const uploadDataUrlAsFile = async (dataUrl: string, prefix: string) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], 'upload.png', { type: blob.type || 'image/png' });
    return uploadFile(file, prefix);
  };

  const handleSaveExhibition = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      let coverKey: string | undefined = undefined;
      if (exhibitionData.cover && exhibitionData.cover.startsWith('data:')) {
        const { object_key } = await uploadDataUrlAsFile(exhibitionData.cover, 'exhibitions/cover/');
        coverKey = object_key;
      }

      const exhibitionResponse = await createExhibition({
        title: exhibitionData.title || '',
        description: exhibitionData.description || '',
        cover_image_key: coverKey,
        cover_type: 'outside',
        status: 'draft',
        date_template: 'year',
        start_year: 0,
        end_year: 0,
        rating: 0,
        settings: {},
        organization_id: ORGANIZATION_ID,
        participants: [],
        tags: exhibitionData.tags || [],
      });

      const expoId = exhibitionResponse.id;

      const uploadItemImageIfNeeded = async (imageUrl?: string) => {
        if (!imageUrl) return undefined;
        if (!imageUrl.startsWith('data:')) return undefined;
        const { object_key } = await uploadDataUrlAsFile(imageUrl, 'blocks/images/');
        return object_key;
      };

      for (let i = 0; i < exhibitionData.blocks.length; i += 1) {
        const block = exhibitionData.blocks[i];
        const itemsPayload = block.items
          ? await Promise.all(
              block.items.map(async (item, idx) => ({
                position: idx,
                text: item.text,
                image_key: await uploadItemImageIfNeeded(item.image_url),
              }))
            )
          : undefined;

        await createBlock(expoId, {
          type: block.type,
          content: block.content,
          settings: block.settings || {},
          position: i,
          items: itemsPayload,
        });
      }

      alert('Выставка сохранена и отправлена в список «Выставки»');
    } catch (e) {
      console.error(e);
      setSaveError('Не удалось сохранить выставку. Попробуйте позже.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadExhibition = async () => {
      if (!exhibitionId) return;
      setIsLoadingExhibition(true);
      try {
        const data = await fetchExhibitionById(exhibitionId);
        setExhibitionData(prev => ({
          ...prev,
          title: data.title || '',
          description: data.description || '',
          organization: data.settings?.constructor?.organization || '',
          team: data.settings?.constructor?.team || '',
          tags: (data.settings?.constructor?.tags as string[]) || data.tags?.map((t: any) => t.name) || [],
          cover: data.cover_image_key
            ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : ''}/api/v1/files/${data.cover_image_key}`
            : '',
          blocks: (data.blocks || [])
            .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
            .map((b: any, idx: number) => ({
              id: b.id || `block-${idx}`,
              type: b.type,
              position: b.position ?? idx,
              content: b.content || '',
              settings: b.settings || {},
              items: (b.items || []).map((it: any, i: number) => ({
                id: `${b.id || idx}-item-${i}`,
                text: it.text,
                image_url: it.image_key
                  ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : ''}/api/v1/files/${it.image_key}`
                  : undefined,
              })),
            })),
        }));

        if (data.settings?.constructor?.fontSettings) {
          setFontSettings(data.settings.constructor.fontSettings);
        }
        if (data.settings?.constructor?.colorSettings) {
          setColorSettings(data.settings.constructor.colorSettings);
        }
      } catch (e) {
        console.error('Не удалось загрузить выставку', e);
        setSaveError('Не удалось загрузить выставку для редактирования.');
      } finally {
        setIsLoadingExhibition(false);
      }
    };

    loadExhibition();
  }, [exhibitionId]);
  
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
          onFileUpload={onFileUploadForBlocksPanel}
          pageBackground={pageBackground}
          setPageBackground={setPageBackground}
          onSave={handleSaveExhibition}
          isSaving={isSaving}
          saveError={saveError}
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
          pageBackground={pageBackground}
        />
      </main>
      {isNoticeOpen && (
        <div className={styles.noticeOverlay}>
          <div className={styles.noticeModal}>
            <button
              type="button"
              className={styles.noticeCloseButton}
              onClick={() => setIsNoticeOpen(false)}
              aria-label="Закрыть уведомление"
            >
              ×
            </button>

            <h3 className={styles.noticeTitle}>Внимание!</h3>

            <p className={styles.noticeText}>
              Материалы, используемые при создании выставок, должны
              содержать обязательное указание на их правообладателя. Перед
              публикацией на платформе выставки проходят модерацию. В случае
              несоответствия указанному требованию процедура публикации
              выставки на платформе будет приостановлена, выставка
              возвращена для доработки.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitionConstructor;