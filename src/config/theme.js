/**
 * Ant Design Premium Light theme configuration.
 * Adapts to high-end Apple / Stripe bright minimalist premium aesthetic.
 */
const antdTheme = {
  token: {
    // Primary Dynamic Accent
    colorPrimary: '#ff5c00',
    colorPrimaryBg: '#fff5f0',
    colorPrimaryBorder: '#ffab7d',
    colorPrimaryHover: '#ff8a00',
    colorPrimaryActive: '#e52e00',
    colorPrimaryText: '#ff5c00',
    colorPrimaryTextHover: '#ff8a00',

    // Premium Bright light background & containers
    colorBgContainer: '#ffffff',
    colorBgLayout: '#fafafb',
    colorBgElevated: '#ffffff',
    colorBgTextHover: 'rgba(0, 0, 0, 0.04)',

    // TypographyStack
    colorText: '#1d1d1f',
    colorTextSecondary: '#51515f',
    colorTextTertiary: '#868696',
    colorTextQuaternary: '#b8b8c7',

    // Fine warm borders
    colorBorder: 'rgba(0, 0, 0, 0.06)',
    colorBorderSecondary: 'rgba(0, 0, 0, 0.03)',

    // Semantic colors
    colorError: '#ff3b30',
    colorSuccess: '#34c759',
    colorWarning: '#ff9500',
    colorInfo: '#007aff',

    // Geometry
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    borderRadiusXS: 6,

    // Typography Stack
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif',
    fontSize: 14,
    fontSizeHeading1: 36,
    fontSizeHeading2: 24,
    fontSizeHeading3: 18,
    fontSizeHeading4: 15,

    // Shadows
    boxShadow: '0 2px 16px rgba(0, 0, 0, 0.03)',
    boxShadowSecondary: '0 8px 32px rgba(0, 0, 0, 0.06)',
  },
  components: {
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 46,
      fontWeight: 600,
      primaryShadow: '0 4px 12px rgba(255, 92, 0, 0.15)',
    },
    Input: {
      borderRadius: 12,
      controlHeight: 42,
      colorBgContainer: '#ffffff',
      activeBorderColor: '#ff5c00',
      hoverBorderColor: 'rgba(255, 92, 0, 0.5)',
    },
    Select: {
      borderRadius: 12,
      controlHeight: 42,
    },
    Card: {
      borderRadiusLG: 22,
      colorBgContainer: '#ffffff',
    },
    Modal: {
      borderRadiusLG: 22,
      colorBgMask: 'rgba(0, 0, 0, 0.3)',
    },
    Table: {
      borderRadius: 16,
      headerBg: 'rgba(0, 0, 0, 0.015)',
      headerColor: '#51515f',
      rowHoverBg: 'rgba(0, 0, 0, 0.01)',
    },
    Menu: {
      itemBorderRadius: 10,
      itemHeight: 44,
      itemSelectedBg: '#ff5c00',
      itemSelectedColor: '#ffffff',
      itemHoverBg: 'rgba(0, 0, 0, 0.02)',
      itemHoverColor: '#ff5c00',
    },
    Tabs: {
      inkBarColor: '#ff5c00',
      itemSelectedColor: '#1d1d1f',
      itemHoverColor: '#ff5c00',
    },
    Tag: {
      borderRadiusSM: 8,
    },
    Progress: {
      defaultColor: '#ff5c00',
    },
    Segmented: {
      borderRadius: 10,
      itemSelectedBg: '#ffffff',
      itemSelectedColor: '#1d1d1f',
    },
  },
};

export default antdTheme;
