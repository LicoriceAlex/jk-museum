// components/Preview/BlockPreview.tsx
import React from 'react';
import { ExhibitionBlock, FontSettings, ColorSettings} from '../../types';
import HeaderBlock from '../BlockComponents/HeaderBlock/HeaderBlock.tsx';
import TextBlock from '../BlockComponents/TextBlock/TextBlock.tsx'; // This should now be EditableText or similar
import QuoteBlock from '../BlockComponents/QuoteBlock/QuoteBlock.tsx'; // This should also be editable
import ImageBlock from '../BlockComponents/ImageBlock/ImageBlock.tsx';
import ImageGridBlock from '../BlockComponents/ImagesGridBlock/ImagesGridBlock.tsx';
import CarouselBlock from '../BlockComponents/CarouselBlock/CarouselBlock.tsx';
import ImageTextBlock from '../BlockComponents/ImageTextBlock/ImageTextBlock.tsx';
import LayoutImgTextImgBlock from '../BlockComponents/LayoutImgTextImgBlock/LayoutImgTextImgBlock.tsx';
import LayoutTextImgTextBlock from '../BlockComponents/LayoutTextImgTextBlock/LayoutTextImgTextBlock.tsx';
import PhotoBlock from '../BlockComponents/PhotoBlock/PhotoBlock.tsx';
import SliderBlock from '../BlockComponents/SliderBlock/SliderBlock.tsx';

// Import EditableText for TEXT and HEADER blocks if they are editable

interface BlockPreviewProps {
  block: ExhibitionBlock;
  fontSettings: FontSettings;
  colorSettings: ColorSettings;
  onImageUpload: (blockId: string, index: number, file: File) => void;
  onImageRemove: (blockId: string, index: number) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void; // ADDED
  removeBlock: (blockId: string) => void; // ADDED
  moveBlock: (blockId: string, direction: 'up' | 'down') => void; // ADDED
}

const BlockPreview: React.FC<BlockPreviewProps> = ({
                                                     block,
                                                     fontSettings,
                                                     colorSettings,
                                                     onImageUpload,
                                                     onImageRemove,
                                                     updateBlock, // DESTRUCTURED
                                                     removeBlock, // DESTRUCTURED
                                                     moveBlock // DESTRUCTURED
                                                   }) => {
  const textStyle = {
    fontFamily: fontSettings.bodyFont,
    color: colorSettings.text,
    fontSize: `${fontSettings.fontSize}px`
  };
  
  const renderBlockContent = () => {
    const getImageUrl = (itemIndex: number): string | undefined => {
      return block.items?.[itemIndex]?.image_url;
    };
    
    switch (block.type) {
      case 'HEADER':
        // Use EditableText for HEADER
        return (
          <HeaderBlock content={block.content || ''}/>
        );
      
      case 'TEXT':
        // Use EditableText for TEXT
        return (
          <TextBlock
            initialContent={block.content || ''}
            onContentChange={(newContent) => updateBlock(block.id, { content: newContent })}
            style={textStyle}
            placeholder="Нажмите, чтобы добавить текст."
          />
        );
      
      case 'QUOTE':
        // Assuming QuoteBlock also uses an internal editable component or needs an update prop
        // If QuoteBlock has its own internal EditableText, it will need to pass onContentChange itself.
        // If it's a display block, ensure QuoteBlockProps makes onUpdate optional or removes it.
        // For now, I'm assuming it needs an update handler for content.
        return (
          <QuoteBlock
            content={block.content || ''}
            settings={block.settings}
            onUpdate={(updatedData: Partial<ExhibitionBlock>) => updateBlock(block.id, updatedData)} // Pass updateBlock
            style={textStyle} // Assuming QuoteBlock can take style
          />
        );
      
      case 'IMAGE':
        return (
          <ImageBlock
            imageUrl={getImageUrl(0)}
            onUpload={(file: File) => onImageUpload(block.id, 0, file)}
            onRemove={() => onImageRemove(block.id, 0)}
            style={textStyle}
          />
        );
      
      case 'IMAGE_UPLOAD':
        return (
          <ImageBlock
            imageUrl={getImageUrl(0)}
            onUpload={(file: File) => onImageUpload(block.id, 0, file)}
            onRemove={() => onImageRemove(block.id, 0)}
            style={textStyle}
          />
        );
      
      case 'IMAGES_2':
        return (
          <ImageGridBlock
            images={(block.items || []).slice(0, 2).map(item => ({ url: item.image_url }))}
            onUpload={(index, file) => onImageUpload(block.id, index, file)}
            onRemove={(index) => onImageRemove(block.id, index)}
            style={textStyle}
            columns={2}
          />
        );
      
      case 'IMAGES_3':
        return (
          <ImageGridBlock
            images={(block.items || []).slice(0, 3).map(item => ({ url: item.image_url }))}
            onUpload={(index, file) => onImageUpload(block.id, index, file)}
            onRemove={(index) => onImageRemove(block.id, index)}
            style={textStyle}
            columns={3}
          />
        );
      
      case 'IMAGES_4':
        return (
          <ImageGridBlock
            images={(block.items || []).slice(0, 4).map(item => ({ url: item.image_url }))}
            onUpload={(index, file) => onImageUpload(block.id, index, file)}
            onRemove={(index) => onImageRemove(block.id, index)}
            style={textStyle}
            columns={2}
          />
        );
      
      case 'CAROUSEL':
        // Assuming CarouselBlock also needs updateBlock, onImageUpload, onImageRemove if it's editable
        // And it needs blockId
        return (
          <CarouselBlock
            blockId={block.id}
            items={block.items || []}
            style={textStyle}
            onImageUpload={onImageUpload} // Pass upload handlers
            onImageRemove={onImageRemove}
            updateBlock={updateBlock} // Pass updateBlock
          />
        );
      
      case 'IMAGE_TEXT_RIGHT':
      case 'IMAGE_TEXT_LEFT':
        // Passing blockId, onImageUpload, onImageRemove, updateBlock to ImageTextBlock
        return (
          <ImageTextBlock
            blockId={block.id}
            content={block.content || ''}
            imageUrl={getImageUrl(0)} // Pass imageUrl directly
            imagePosition={block.type === 'IMAGE_TEXT_RIGHT' ? 'right' : 'left'}
            style={textStyle}
            onImageUpload={onImageUpload} // Pass upload handlers
            onImageRemove={onImageRemove}
            updateBlock={updateBlock} // Pass updateBlock
          />
        );
      
      case 'LAYOUT_IMG_TEXT_IMG':
        // Passing blockId, onImageUpload, onImageRemove, updateBlock to LayoutImgTextImgBlock
        return (
          <LayoutImgTextImgBlock
            blockId={block.id}
            content={block.content || ''}
            leftImageUrl={getImageUrl(0)}
            rightImageUrl={getImageUrl(1)}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            updateBlock={updateBlock}
            style={textStyle}
          />
        );
      
      case 'LAYOUT_TEXT_IMG_TEXT':
        // Passing blockId, onImageUpload, onImageRemove, updateBlock to LayoutTextImgTextBlock
        return (
          <LayoutTextImgTextBlock
            blockId={block.id}
            content={block.content || ''}
            imageUrl={getImageUrl(0)}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            updateBlock={updateBlock}
            style={textStyle}
          />
        );
      
      case 'PHOTO':
        // Assuming PhotoBlock also needs blockId, onImageUpload, onImageRemove if it's editable
        // And it needs updateBlock if it has editable content or settings
        return (
          <PhotoBlock
            blockId={block.id}
            imageUrl={getImageUrl(0)}
            onUpload={(file: File) => onImageUpload(block.id, 0, file)}
            onRemove={() => onImageRemove(block.id, 0)}
            updateBlock={updateBlock} // If PhotoBlock can update its own content/settings
            style={textStyle}
          />
        );
      
      case 'SLIDER':
        // Assuming SliderBlock also needs blockId, onImageUpload, onImageRemove, updateBlock if it's editable
        return (
          <SliderBlock
            blockId={block.id} // Pass blockId
            items={block.items || []}
            style={textStyle}
            onImageUpload={onImageUpload} // Pass upload handlers
            onImageRemove={onImageRemove}
            updateBlock={updateBlock} // Pass updateBlock
          />
        );
      
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  };
  
  return (
    <div className="block-preview-wrapper" style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
      <div style={{ textAlign: 'right', marginBottom: '5px' }}>
        <button onClick={() => moveBlock(block.id, 'up')} style={{ marginRight: '5px' }}>↑</button>
        <button onClick={() => moveBlock(block.id, 'down')} style={{ marginRight: '5px' }}>↓</button>
        <button onClick={() => removeBlock(block.id)} style={{ color: 'red' }}>X</button>
      </div>
      <div className="block-preview-content">
        {renderBlockContent()}
      </div>
    </div>
  );
};

export default BlockPreview;
