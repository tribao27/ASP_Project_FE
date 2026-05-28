/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import antdTheme from '@/config/theme.js';

import { AppProvider, useAppContext } from './context/AppContext.jsx';
import AppRoutes from './AppRoutes.jsx';

// Component to dynamically apply the Ant Design theme based on context state
const ThemeWrapper = ({ children }) => {
  const { accentColor } = useAppContext();

  return (
    <ConfigProvider theme={{
      ...antdTheme,
      token: {
        ...antdTheme.token,
        colorPrimary: accentColor,
        colorPrimaryHover: accentColor + 'ee',
        colorPrimaryActive: accentColor,
      }
    }}>
      <AntApp>
        <div id="root-portal-view" className="w-full min-h-screen bg-white text-[#1d1d1f] font-sans">
          {children}
        </div>
      </AntApp>
    </ConfigProvider>
  );
};

export default function App() {
  return (
    <StyleProvider layer>
      <AppProvider>
        <ThemeWrapper>
          <AppRoutes />
        </ThemeWrapper>
      </AppProvider>
    </StyleProvider>
  );
}
