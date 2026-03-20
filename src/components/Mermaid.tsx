'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#1f2937',
    primaryBorderColor: '#d1d5db',
    lineColor: '#6b7280',
    secondaryColor: '#f3f4f6',
    tertiaryColor: '#e5e7eb',
    background: '#ffffff',
    mainBkg: '#f9fafb',
    fill: '#ffffff',
    sectionBkg: '#f3f4f6',
    altSectionBkg: '#e5e7eb',
    gridColor: '#d1d5db',
    axisColor: '#6b7280',
    border1: '#d1d5db',
    border2: '#e5e7eb',
    curve: '#6b7280',
    textColor: '#1f2937',
    mainBkgComponent: '#f3f4f6',
    highlight: '#3b82f6',
  },
})

interface MermaidProps {
  chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && chart) {
      const trimmedChart = chart.trim()
      const uniqueId = `mermaid-${Math.random().toString(36).slice(2, 9)}`
      mermaid.render(uniqueId, trimmedChart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
          const svgEl = ref.current.querySelector('svg')
          if (svgEl) {
            svgEl.style.backgroundColor = '#ffffff'
            svgEl.style.fill = 'none'
            // 遍历所有元素，修改内联 style 中的 fill 和 stroke
            svgEl.querySelectorAll('*').forEach(el => {
              const style = el.getAttribute('style')
              if (style) {
                let newStyle = style
                  .replace(/fill:\s*rgb\(\d+,\s*\d+,\s*\d+\)/g, 'fill: #e5e7eb')
                  .replace(/stroke:\s*rgb\(\d+,\s*\d+,\s*\d+\)/g, 'stroke: #d1d5db')
                if (newStyle !== style) {
                  el.setAttribute('style', newStyle)
                }
              }
            })
          }
        }
      }).catch((err) => {
        console.error('Mermaid render error:', err)
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-red-500">${trimmedChart}</pre>`
        }
      })
    }
  }, [chart])

  return (
    <div
      ref={ref}
      className="mermaid-container flex justify-center my-6"
      style={{ backgroundColor: '#ffffff' }}
    />
  )
}