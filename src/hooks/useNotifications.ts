import { useState } from 'react'
import type { Notification } from '../components/layout/NotificationSystem'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (
    message: string, 
    type: Notification['type'] = 'info', 
    duration?: number
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const notification: Notification = {
      id,
      type,
      message,
      duration
    }

    setNotifications(prev => [...prev, notification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const showSuccess = (message: string, duration?: number) => 
    addNotification(message, 'success', duration)

  const showError = (message: string, duration?: number) => 
    addNotification(message, 'error', duration)

  const showInfo = (message: string, duration?: number) => 
    addNotification(message, 'info', duration)

  const showWarning = (message: string, duration?: number) => 
    addNotification(message, 'warning', duration)

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}