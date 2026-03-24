import fs from 'fs'
import path from 'path'
import HomePageContent from './HomePageContent'

function getMdFiles() {
  const contentDir = path.join(process.cwd(), 'content')
  if (!fs.existsSync(contentDir)) {
    return []
  }
  return fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))
}

function parseDateFromFilename(filename: string): string {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})/)
  if (match) {
    return match[1]
  }
  return filename.replace('.md', '')
}

export default function Home() {
  const fileNames = getMdFiles().sort().reverse()

  const files = fileNames.map(filename => {
    const date = parseDateFromFilename(filename)
    const slug = filename.replace('.md', '')
    const title = slug.replace(/-/g, ' ')
    
    return {
      filename,
      date,
      slug,
      title
    }
  })

  return <HomePageContent files={files} />
}