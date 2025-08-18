import fs from 'fs'
import path from 'path'
import DocsClient from './docs-client'

async function loadDocs() {
  const docsDir = path.join(process.cwd(), '..', 'docs')
  
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
      console.error(`Failed to load ${file}:`, error)
      files[file as keyof typeof files] = `# Error\n\nFailed to load ${file}`
    }
  }
  
  return files
}

export default async function DocsPage() {
  const docs = await loadDocs()
  
  return <DocsClient docs={docs} />
}