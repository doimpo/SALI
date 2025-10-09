const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '..', 'public');
const headerPath = path.resolve(__dirname, '..', 'src', 'components', 'header.html');
const footerPath = path.resolve(__dirname, '..', 'src', 'components', 'footer.html');

const headerContent = fs.readFileSync(headerPath, 'utf8');
const footerContent = fs.readFileSync(footerPath, 'utf8');

function applyLayout(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    const relativePath = path.relative(publicDir, filePath);
    const depth = relativePath.split(path.sep).length - 1;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';

    const adjustPaths = (content) => {
      if (!prefix) return content;
      return content
        .replace(/href="(?!#|https?:\/\/|tel:|mailto:)/g, `href="${prefix}`)
        .replace(/src="(?!https?:\/\/)/g, `src="${prefix}`);
    };

    const adjustedHeader = adjustPaths(headerContent);
    const adjustedFooter = adjustPaths(footerContent);

    const updatedData = data.replace(/<header class="header header-layout1">[\s\S]*?<\/header>/, adjustedHeader)
                            .replace(/<footer class="footer">[\s\S]*?<\/footer>/, adjustedFooter);

    fs.writeFile(filePath, updatedData, 'utf8', err => {
      if (err) {
        console.error(`Error writing file ${filePath}:`, err);
      } else {
        console.log(`Successfully updated ${filePath}`);
      }
    });
  });
}

function traverseDir(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error(`Error stating file ${filePath}:`, err);
          return;
        }

        if (stat.isDirectory()) {
          traverseDir(filePath);
        } else if (path.extname(file) === '.html') {
          applyLayout(filePath);
        }
      });
    });
  });
}

traverseDir(publicDir);
