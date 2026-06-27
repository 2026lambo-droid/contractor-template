import * as admin from 'firebase-admin'

interface NotificationPayload {
  title: string
  body: string
  data?: Record<string, string>
}

async function sendFCM(token: string, payload: NotificationPayload): Promise<void> {
  try {
    await admin.messaging().send({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'carnemx_orders',
          color: '#E85D04',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    })
  } catch (err: any) {
    if (err.code === 'messaging/registration-token-not-registered') {
      console.log('FCM token expired, removing from user record')
    } else {
      console.error('FCM send error:', err)
    }
  }
}

export const sendOrderNotification = async (token: string, payload: NotificationPayload) => {
  return sendFCM(token, payload)
}

export const sendCustomerNotification = async (token: string, payload: NotificationPayload) => {
  return sendFCM(token, payload)
}

export const sendDriverNotification = async (token: string, payload: NotificationPayload) => {
  return sendFCM(token, payload)
}

// Send to multiple tokens (e.g., all drivers in a zone)
export const sendMulticast = async (tokens: string[], payload: NotificationPayload) => {
  if (tokens.length === 0) return
  const chunks = []
  for (let i = 0; i < tokens.length; i += 500) chunks.push(tokens.slice(i, i + 500))

  for (const chunk of chunks) {
    await admin.messaging().sendEachForMulticast({
      tokens: chunk,
      notification: { title: payload.title, body: payload.body },
      data: payload.data || {},
    })
  }
}
