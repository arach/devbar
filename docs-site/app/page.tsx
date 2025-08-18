import fs from 'fs'
import path from 'path'
import DocsClient from './docs-client'

async function loadDocs() {
  // In GitHub Actions, the working directory is /home/runner/work/devbar/devbar/docs-site
  // We need to go up one level to find the docs folder
  const possiblePaths = [
    path.join(process.cwd(), '..', 'docs'),  // Local development
    path.join(process.cwd(), '..', '..', 'docs'),  // Possible CI structure
    path.join(__dirname, '..', '..', '..', 'docs'),  // Alternative
  ]
  
  let docsDir = ''
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      docsDir = testPath
      console.log(`Found docs at: ${testPath}`)
      break
    }
  }
  
  if (!docsDir) {
    console.error('Could not find docs directory, tried:', possiblePaths)
    docsDir = path.join(process.cwd(), '..', 'docs')  // Fallback
  }
  
  const files = {
    'README.md': '',
    'getting-started.md': '',
    'api-reference.md': '',
    'configuration.md': '',
    'examples.md': '',
    'advanced.md': ''
  }
  
  for (const file of Object.keys(files)) {
    try {
      const content = fs.readFileSync(path.join(docsDir, file), 'utf8')
      files[file as keyof typeof files] = content
    } catch (error) {
      console.error(`Failed to load ${file} from ${docsDir}:`, error)
      files[file as keyof typeof files] = `# Error\n\nFailed to load ${file}`
    }
  }
  
  return files
}

export default async function DocsPage() {
  const docs = await loadDocs()
  
  return <DocsClient docs={docs} />
}