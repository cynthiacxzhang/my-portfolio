'use client'
import { useState, useEffect } from 'react'

export function useWindowSize() {
  const [size, setSize] = useState({
    W: typeof window !== 'undefined' ? window.innerWidth : 1440,
    H: typeof window !== 'undefined' ? window.innerHeight : 900,
  })

  useEffect(() => {
    function update() {
      setSize({ W: window.innerWidth, H: window.innerHeight })
    }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}
