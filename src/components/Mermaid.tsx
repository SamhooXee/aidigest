'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import { useTheme } from '@mui/material/styles'

interface MermaidProps {
  chart: string
}

const pieColors = {
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
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)
  const muiTheme = useTheme()
  const isDark = muiTheme.palette.mode === 'dark'

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'base',
      themeVariables: isDark ? {
        ...pieColors,
        background: 'transparent',
        primaryTextColor: '#f3f4f6',
        textColor: '#f3f4f6',
        lineColor: '#9ca3af',
        pieLegendTextSize: '16px',
        pieTitleTextSize: '20px',
      } : {
        primaryColor: '#3b82f6',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#d1d5db',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#e5e7eb',
        background: 'transparent',
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
        pieLegendTextSize: '16px',
        pieTitleTextSize: '20px',
        ...pieColors,
      },
    })

    if (ref.current && chart) {
      const trimmedChart = chart.trim()
      const uniqueId = `mermaid-${Math.random().toString(36).slice(2, 9)}`
      
      // Clear previous chart on re-render / theme toggle
      ref.current.innerHTML = ''

      mermaid.render(uniqueId, trimmedChart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
          const svgEl = ref.current.querySelector('svg')
          if (svgEl) {
            svgEl.style.backgroundColor = 'transparent'
            svgEl.style.fill = 'none'
          }
        }
      }).catch((err) => {
        console.error('Mermaid render error:', err)
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-red-500">${trimmedChart}</pre>`
        }
      })
    }
  }, [chart, isDark])

  return (
    <div
      ref={ref}
      className={`mermaid-container flex justify-center my-6 p-4 rounded-lg overflow-x-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}
    />
  )
}