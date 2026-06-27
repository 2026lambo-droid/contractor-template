import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export { onOrderCreated, onOrderStatusChanged, assignDriver } from './orders'
export { sendOrderNotification, sendDriverNotification, sendCustomerNotification } from './notifications'
export { createPaymentIntent, stripeWebhook, createConnectedAccount } from './payments'
