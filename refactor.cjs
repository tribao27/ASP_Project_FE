const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const fileMap = {
  'App.jsx': 'app/App.jsx',
  'main.jsx': 'main.jsx',
  'index.css': 'styles/index.css',
  
  'api/axiosClient.js': 'api/axiosClient.js',
  'api/documentService.js': 'features/dashboard/services/document.service.js',
  'api/groupService.js': 'features/community/services/community.service.js',
  
  'components/AppHeader.jsx': 'shared/layouts/AppHeader.jsx',
  'components/DocumentManager.jsx': 'features/dashboard/components/DocumentManager.jsx',
  'components/DocumentViewer.jsx': 'features/dashboard/components/DocumentViewer.jsx',
  'components/FileIcon.jsx': 'shared/ui/FileIcon.jsx',
  'components/Sidebar.jsx': 'shared/layouts/Sidebar.jsx',
  
  'data/documents.js': 'features/dashboard/mock/documents.mock.js',
  'data/fileConfig.js': 'shared/utils/fileConfig.js',
  'data/groups.js': 'features/community/mock/groups.mock.js',
  'data/index.js': 'shared/mock/global.mock.js',
  'data/mockData.js': 'shared/mock/mockData.js',
  
  'hooks/useDocuments.js': 'features/dashboard/hooks/useDocuments.js',
  'hooks/useDragScroll.js': 'shared/hooks/useDragScroll.js',
  
  'layouts/MainLayout.jsx': 'shared/layouts/MainLayout.jsx',
  
  'pages/AIScreen.jsx': 'features/ai/pages/AIScreen.jsx',
  'pages/AdminLoginScreen.jsx': 'features/admin/pages/AdminLoginScreen.jsx',
  'pages/AdminScreen.jsx': 'features/admin/pages/AdminScreen.jsx',
  'pages/CommunityScreen.jsx': 'features/community/pages/CommunityScreen.jsx',
  'pages/DashboardScreen.jsx': 'features/dashboard/pages/DashboardScreen.jsx',
  'pages/GroupDetailScreen.jsx': 'features/group-detail/pages/GroupDetailScreen.jsx',
  'pages/IntroScreen.jsx': 'features/landing/pages/IntroScreen.jsx',
  'pages/LoginScreen.jsx': 'features/auth/pages/LoginScreen.jsx',
  'pages/PaymentScreen.jsx': 'features/payment/pages/PaymentScreen.jsx',
  'pages/ProfileScreen.jsx': 'features/profile/pages/ProfileScreen.jsx',
  'pages/TrashScreen.jsx': 'features/trash/pages/TrashScreen.jsx',
  
  'theme/antdTheme.js': 'config/theme.js',
  
  'utils/dateUtils.js': 'shared/utils/dateUtils.js',
  'utils/helpers.js': 'shared/utils/helpers.js'
};

const reverseMap = {};
for (const [oldPath, newPath] of Object.entries(fileMap)) {
  reverseMap[oldPath] = newPath;
}

// 1. First pass: read all files and update their imports, writing to a temp buffer.
const fileContents = {};

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      if (filepath.endsWith('.js') || filepath.endsWith('.jsx')) {
        filelist.push(filepath);
      }
    }
  }
  return filelist;
};

const allJsFiles = walkSync(srcDir);

for (const filePath of allJsFiles) {
  const relativeFromSrc = path.relative(srcDir, filePath).replace(/\\/g, '/');
  if (!reverseMap[relativeFromSrc] && relativeFromSrc !== 'main.jsx') {
    continue; // Don't process if not in map
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all import statements
  const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
  const lazyImportRegex = /import\(['"]([^'"]+)['"]\)/g;

  const replaceImport = (match, importPath) => {
    // If it's a relative import
    if (importPath.startsWith('.')) {
      // Resolve it to an absolute path from src
      const absoluteTarget = path.resolve(path.dirname(filePath), importPath);
      let targetRelativeFromSrc = path.relative(srcDir, absoluteTarget).replace(/\\/g, '/');
      
      // Attempt to resolve extension if omitted
      if (!fs.existsSync(absoluteTarget)) {
        if (fs.existsSync(absoluteTarget + '.js')) targetRelativeFromSrc += '.js';
        else if (fs.existsSync(absoluteTarget + '.jsx')) targetRelativeFromSrc += '.jsx';
        else if (fs.existsSync(absoluteTarget + '.css')) targetRelativeFromSrc += '.css';
      }

      const newTarget = reverseMap[targetRelativeFromSrc];
      if (newTarget) {
        return match.replace(importPath, `@/${newTarget}`);
      }
      
      // If the target wasn't in the map (maybe index.css)
      if (targetRelativeFromSrc === 'index.css' || targetRelativeFromSrc === 'styles/index.css') {
        return match.replace(importPath, `@/styles/index.css`);
      }
    }
    return match;
  };

  content = content.replace(importRegex, replaceImport);
  content = content.replace(lazyImportRegex, replaceImport);
  
  fileContents[relativeFromSrc] = content;
}

// 2. Second pass: Move files and write updated contents
for (const [oldPath, newPath] of Object.entries(fileMap)) {
  const oldAbsPath = path.join(srcDir, oldPath);
  const newAbsPath = path.join(srcDir, newPath);
  
  // Create dir if not exists
  fs.mkdirSync(path.dirname(newAbsPath), { recursive: true });
  
  // Write the updated content
  if (fileContents[oldPath] !== undefined) {
    fs.writeFileSync(newAbsPath, fileContents[oldPath], 'utf8');
  } else if (fs.existsSync(oldAbsPath)) {
    // For non-JS files like index.css
    fs.copyFileSync(oldAbsPath, newAbsPath);
  }
  
  // Delete the old file if it's different from the new file
  if (oldAbsPath !== newAbsPath && fs.existsSync(oldAbsPath)) {
    fs.unlinkSync(oldAbsPath);
  }
}

// Clean up old directories
const dirsToDelete = ['api', 'components', 'data', 'hooks', 'layouts', 'pages', 'theme', 'utils'];
for (const dir of dirsToDelete) {
  const dirPath = path.join(srcDir, dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

console.log('Refactor completed successfully!');
