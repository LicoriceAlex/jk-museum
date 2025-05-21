import React from 'react';
import styles from './SideBar.module.scss';
import {
  PanelTab,
  ExhibitionData,
  FontSettings,
  ColorSettings,
  BlockType, BlockItem
} from '../../types';
import InfoPanel from './InfoPanel';
import StylesPanel from './StylesPanel';
import BlocksPanel from './BlocksPanel';

interface SidebarProps {
  activeTab: PanelTab;
  setActiveTab: (tab: PanelTab) => void;
  exhibitionData: ExhibitionData;
  updateExhibitionData: (data: Partial<ExhibitionData>) => void;
  fontSettings: FontSettings;
  setFontSettings: (settings: FontSettings) => void;
  colorSettings: ColorSettings;
  setColorSettings: (settings: ColorSettings) => void;
  addBlock: (type: BlockType, initialData?: { items?: BlockItem[]; content?: string; }) => void;
  onFileUpload: (file: File) => Promise<{ url: string }>;
}

const Sidebar: React.FC<SidebarProps> = ({
                                           activeTab,
                                           setActiveTab,
                                           exhibitionData,
                                           updateExhibitionData,
                                           fontSettings,
                                           setFontSettings,
                                           colorSettings,
                                           setColorSettings,
                                           addBlock, onFileUpload
                                         }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__tabs}>
        <button
          className={`${styles.sidebar__tab} ${activeTab === 'info' ? styles['sidebar__tab--active'] : ''}`}
          onClick={() => setActiveTab('info')}
          title="Информация о выставке"
        >
          {/* Использовать styles['sidebar__tab-icon'] для надежности */}
          <img src={'./info.svg'} alt={''}/>
        </button>
        <button
          className={`${styles.sidebar__tab} ${activeTab === 'styles' ? styles['sidebar__tab--active'] : ''}`}
          onClick={() => setActiveTab('styles')}
          title="Настройки стилей"
        >
          {/* Использовать styles['sidebar__tab-icon'] для надежности */}
          <img src={'./style.svg'} alt={''}/>
        </button>
        <button
          className={`${styles.sidebar__tab} ${activeTab === 'blocks' ? styles['sidebar__tab--active'] : ''}`}
          onClick={() => setActiveTab('blocks')}
          title="Блоки выставки"
        >
          {/* Использовать styles['sidebar__tab-icon'] для надежности */}
          <img src={'./blocks.svg'} alt={''}/>
        </button>
      </div>
      
      <div className={styles.sidebar__content}>
        {activeTab === 'info' && (
          <InfoPanel
            exhibitionData={exhibitionData}
            updateExhibitionData={updateExhibitionData}
            onCoverImageUpload={() => {}}/>
        )}
        
        {activeTab === 'styles' && (
          <StylesPanel
            fontSettings={fontSettings}
            setFontSettings={setFontSettings}
            colorSettings={colorSettings}
            setColorSettings={setColorSettings}
          />
        )}
        
        {activeTab === 'blocks' && (
          <BlocksPanel addBlock={addBlock} onFileUpload={onFileUpload} /> // ДОБАВИТЬ ЭТО
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
