// Enhanced source definitions with metadata and selectors
export interface SourceConfig {
  url: string;
  name: string;
  category: 'international' | 'regional' | 'national' | 'ngo';
  priority: number; // 1-10, higher is more important
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  selectors: {
    container: string;
    title: string;
    content: string;
    date: string;
    link: string;
  };
  requiresJavaScript: boolean;
}

export const sources: Record<string, SourceConfig> = {
  'afdb': {
    url: 'https://www.afdb.org/en/opportunities/business-opportunities',
    name: 'African Development Bank',
    category: 'international',
    priority: 10,
    updateFrequency: 'daily',
    selectors: {
      container: '.opportunities-list .item',
      title: '.opportunity-title',
      content: '.opportunity-content',
      date: '.posting-date',
      link: 'a'
    },
    requiresJavaScript: false
  },
  'unep': {
    url: 'https://www.unep.org/work-with-us/funding-and-partnerships',
    name: 'UN Environment Programme',
    category: 'international',
    priority: 9,
    updateFrequency: 'weekly',
    selectors: {
      container: '.funding-opportunity',
      title: 'h3',
      content: '.description',
      date: '.deadline',
      link: 'a.read-more'
    },
    requiresJavaScript: true
  },
  'worldbank': {
    url: 'https://www.worldbank.org/en/projects-operations/procurement/notices',
    name: 'World Bank',
    category: 'international',
    priority: 9,
    updateFrequency: 'daily',
    selectors: {
      container: '.procurement-notice',
      title: '.notice-title',
      content: '.notice-description',
      date: '.notice-date',
      link: '.notice-link'
    },
    requiresJavaScript: true
  },
  'unicef': {
    url: 'https://www.unicef.org/procurement/opportunities',
    name: 'UNICEF',
    category: 'international',
    priority: 8,
    updateFrequency: 'weekly',
    selectors: {
      container: '.procurement-item',
      title: '.procurement-title',
      content: '.procurement-description',
      date: '.procurement-deadline',
      link: 'a'
    },
    requiresJavaScript: false
  },
  'un': {
    url: 'https://www.un.org/en/funding/opportunities',
    name: 'United Nations',
    category: 'international',
    priority: 8,
    updateFrequency: 'weekly',
    selectors: {
      container: '.funding-opportunity',
      title: 'h3',
      content: '.opportunity-description',
      date: '.opportunity-deadline',
      link: 'a.more-info'
    },
    requiresJavaScript: false
  },
  'kenya': {
    url: 'https://www.treasury.go.ke/tenders/',
    name: 'Kenya Treasury',
    category: 'national',
    priority: 7,
    updateFrequency: 'weekly',
    selectors: {
      container: '.tender-item',
      title: '.tender-title',
      content: '.tender-description',
      date: '.closing-date',
      link: 'a'
    },
    requiresJavaScript: false
  },
  'afdb-climate': {
    url: 'https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/climate-investment-funds-cif/projects-investments',
    name: 'AfDB Climate Investments',
    category: 'international',
    priority: 9,
    updateFrequency: 'monthly',
    selectors: {
      container: '.climate-project',
      title: '.project-title',
      content: '.project-description',
      date: '.project-date',
      link: 'a.project-link'
    },
    requiresJavaScript: false
  },
  'undp-africa': {
    url: 'https://procurement-notices.undp.org/view_notice.cfm?notice_id=94794',
    name: 'UNDP Africa',
    category: 'regional',
    priority: 8,
    updateFrequency: 'weekly',
    selectors: {
      container: '.procurement-notice',
      title: '.notice-title',
      content: '.notice-content',
      date: '.deadline-date',
      link: 'a.notice-link'
    },
    requiresJavaScript: false
  }
};

// Get source configuration by ID
export const getSourceConfig = (sourceId: string): SourceConfig | undefined => {
  return sources[sourceId];
};

// Get URL for a source
export const getSourceUrl = (sourceId: string): string => {
  // If source is already a URL, return it directly
  if (sourceId.startsWith('http')) {
    return sourceId;
  }
  
  // Otherwise look up in our mapping
  return sources[sourceId]?.url || 'https://www.afdb.org/en/opportunities/business-opportunities';
};

// Get all sources sorted by priority
export const getPrioritizedSources = (): SourceConfig[] => {
  return Object.values(sources).sort((a, b) => b.priority - a.priority);
};

// Get sources by category
export const getSourcesByCategory = (category: string): SourceConfig[] => {
  return Object.values(sources).filter(source => source.category === category);
};

// Get selectors for a specific source
export const getSourceSelectors = (sourceId: string) => {
  return sources[sourceId]?.selectors;
};

// Check if source requires JavaScript
export const sourceRequiresJavaScript = (sourceId: string): boolean => {
  return sources[sourceId]?.requiresJavaScript || false;
}; 