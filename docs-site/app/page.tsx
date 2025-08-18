import fs from 'fs'
import path from 'path'
import DocsClient from './docs-client'

async function loadDocs() {
  // Docs are now in the docs-site/docs folder
  const docsDir = path.join(process.cwd(), 'docs')
  
  if (!fs.existsSync(docsDir)) {
    console.error('Could not find docs directory at:', docsDir)
  }
  
  const files = {
    'README.md': '',  // Use README.md which has the comprehensive documentation
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
  
  // Pass docs as a JSON string to avoid RSC serialization issues
  const docsJson = JSON.stringify(docs)
  
  return <DocsClient docsJson={docsJson} />
}