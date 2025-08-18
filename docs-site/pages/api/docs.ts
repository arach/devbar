import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.query

  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'File parameter is required' })
  }

  // Only allow specific files for security
  const allowedFiles = [
    'README.md',
    'getting-started.md',
    'api-reference.md',
    'configuration.md',
    'examples.md',
    'advanced.md'
  ]

  if (!allowedFiles.includes(file)) {
    return res.status(404).json({ error: 'File not found' })
  }

  try {
    // Read from the docs directory
    const filePath = path.join(process.cwd(), '..', 'docs', file)
    const content = fs.readFileSync(filePath, 'utf8')
    res.status(200).send(content)
  } catch (error) {
    console.error('Error reading file:', error)
    res.status(404).json({ error: 'File not found' })
  }
}