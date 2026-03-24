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
    // 增加更多彩色的饼图配置
    pie1: '#3b82f6', // blue-500
    pie2: '#10b981', // emerald-500
    pie3: '#f59e0b', // amber-500
    pie4: '#ef4444', // red-500
    pie5: '#8b5cf6', // violet-500
    pie6: '#06b6d4', // cyan-500
    pie7: '#f97316', // orange-500
    pie8: '#ec4899', // pink-500
    pie9: '#84cc16', // lime-500
    pie10: '#6366f1', // indigo-500
    pie11: '#14b8a6', // teal-500
    pie12: '#f43f5e', // rose-500
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
            // Removed manual style replacements to preserve pie chart and other diagrams' original colors
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