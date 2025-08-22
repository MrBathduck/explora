import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react'

interface DropdownContextType {
  activeDropdownId: string | null
  setActiveDropdownId: (id: string | null) => void
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined)

export const useDropdown = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownProvider')
  }
  return context
}

interface DropdownProviderProps {
  children: ReactNode
}

export const DropdownProvider: React.FC<DropdownProviderProps> = ({ children }) => {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on dropdown elements
      const target = event.target as Element
      if (target?.closest('.add-to-trip-container') || target?.closest('.trip-dropdown')) {
        return
      }
      setActiveDropdownId(null)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdownId(null)
      }
    }

    if (activeDropdownId) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [activeDropdownId])

  return (
    <DropdownContext.Provider value={{ activeDropdownId, setActiveDropdownId }}>
      {children}
    </DropdownContext.Provider>
  )
}