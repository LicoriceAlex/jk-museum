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

import infoIcon from '../../../../assets/icons/info.svg';
import infoActiveIcon from '../../../../assets/icons/info-active.svg';
import styleIcon from '../../../../assets/icons/style.svg';
import styleActiveIcon from '../../../../assets/icons/style-active.svg';
import blocksIcon from '../../../../assets/icons/blocks.svg';
import blocksActiveIcon from '../../../../assets/icons/blocks-active.svg';

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
          <img
            src={activeTab === 'info' ? infoActiveIcon : infoIcon}
            alt="Info Icon"
            className={styles.sidebar__tab__icon}
          />
        </button>
        <button
          className={`${styles.sidebar__tab} ${activeTab === 'styles' ? styles['sidebar__tab--active'] : ''}`}
          onClick={() => setActiveTab('styles')}
          title="Настройки стилей"
        >
          <img
            src={activeTab === 'styles' ? styleActiveIcon : styleIcon}
            alt="Styles Icon"
            className={styles.sidebar__tab__icon}
          />
        </button>
        <button
          className={`${styles.sidebar__tab} ${activeTab === 'blocks' ? styles['sidebar__tab--active'] : ''}`}
          onClick={() => setActiveTab('blocks')}
          title="Блоки выставки"
        >
          <img
            src={activeTab === 'blocks' ? blocksActiveIcon : blocksIcon}
            alt="Blocks Icon"
            className={styles.sidebar__tab__icon}
          />
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
          <BlocksPanel addBlock={addBlock} onFileUpload={onFileUpload} />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
