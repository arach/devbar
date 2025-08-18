#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function build() {
  console.log('Starting custom build process...');
  
  // Remove any existing build artifacts
  try {
    await fs.rm('.next', { recursive: true, force: true });
    await fs.rm('out', { recursive: true, force: true });
  } catch (e) {
    // Ignore if doesn't exist
  }
  
  // Create a temporary pages directory with stub files to prevent Next.js from generating them
  const pagesDir = path.join(process.cwd(), 'pages');
  try {
    await fs.mkdir(pagesDir, { recursive: true });
    
    // Create stub _error.js that won't cause React context issues
    await fs.writeFile(
      path.join(pagesDir, '_error.js'),
      `function Error() { return null; }
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
export default Error;`
    );
    
    // Create stub 404.js
    await fs.writeFile(
      path.join(pagesDir, '404.js'),
      `export default function Custom404() { return null; }`
    );
    
    // Run the actual build
    const { stdout, stderr } = await execAsync('next build');
    console.log(stdout);
    if (stderr) console.error(stderr);
    
  } finally {
    // Clean up the temporary pages directory
    try {
      await fs.rm(pagesDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore if doesn't exist
    }
  }
  
  console.log('Build completed successfully!');
}

build().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});