import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { sendOrderNotification, sendDriverNotification, sendCustomerNotification } from './notifications'

const db = admin.firestore()

// Triggered when a new order document is created
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data()
    const { orderId } = context.params

    // Notify vendor of new order
    const vendorDoc = await db.collection('vendors').doc(order.vendorId).get()
    const vendor = vendorDoc.data()

    if (vendor?.fcmToken) {
      await sendOrderNotification(vendor.fcmToken, {
        title: `New Order — $${order.total.toFixed(2)}`,
        body: `${order.customerName} ordered ${order.items.map((i: any) => `${i.quantity}lb ${i.name}`).join(', ')}`,
        data: { orderId, type: 'new_order', screen: 'VendorOrders' },
      })
    }

    // Update vendor order count
    await db.collection('vendors').doc(order.vendorId).update({
      pendingOrderCount: admin.firestore.FieldValue.increment(1),
    })

    console.log(`Order ${orderId} created for vendor ${order.vendorId}`)
  })

// Triggered when order status changes
export const onOrderStatusChanged = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()
    const { orderId } = context.params

    if (before.status === after.status) return

    // Notify customer of status update
    const customerDoc = await db.collection('users').doc(after.customerId).get()
    const customer = customerDoc.data()

    const messages: Record<string, { title: string; body: string }> = {
      confirmed: { title: 'Order Confirmed ✅', body: `${after.vendorName} confirmed your order. Est. prep time: 20 min.` },
      preparing: { title: 'Being Prepared 🥩', body: `${after.vendorName} is preparing your order!` },
      ready: { title: 'Ready for Pickup 📦', body: 'Your order is packed and ready for the driver.' },
      picked_up: { title: 'On the Way! 🚗', body: `${after.driverName || 'Your driver'} is heading your way. Est. ${after.estimatedDelivery}` },
      delivered: { title: 'Delivered! 🎉', body: 'Your order has been delivered. Enjoy the carne!' },
      cancelled: { title: 'Order Cancelled', body: 'Your order was cancelled. A full refund will be issued within 3-5 business days.' },
    }

    const msg = messages[after.status]
    if (msg && customer?.fcmToken) {
      await sendCustomerNotification(customer.fcmToken, { ...msg, data: { orderId, type: 'status_update', screen: 'OrderTracking' } })
    }

    // When order is ready, notify available drivers
    if (after.status === 'ready') {
      await assignDriver(orderId, after)
    }

    // Decrement pending count when confirmed
    if (after.status === 'confirmed') {
      await db.collection('vendors').doc(after.vendorId).update({
        pendingOrderCount: admin.firestore.FieldValue.increment(-1),
      })
    }
  })

// Find an available driver and assign the order
export const assignDriver = async (orderId: string, order: any) => {
  // Query online drivers in the same city/zone
  const driversSnap = await db.collection('users')
    .where('role', '==', 'driver')
    .where('isOnline', '==', true)
    .where('activeDelivery', '==', null)
    .limit(5)
    .get()

  if (driversSnap.empty) {
    console.log(`No available drivers for order ${orderId}`)
    return
  }

  // Pick closest driver (in production: use geohash/distance calculation)
  const driver = driversSnap.docs[0].data()
  const driverId = driversSnap.docs[0].id

  // Assign order to driver
  await db.collection('orders').doc(orderId).update({
    driverId,
    driverName: driver.name,
    assignedAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  // Mark driver as busy
  await db.collection('users').doc(driverId).update({
    activeDelivery: orderId,
  })

  // Notify driver
  if (driver.fcmToken) {
    await sendDriverNotification(driver.fcmToken, {
      title: `New Delivery — $${(order.deliveryFee * 0.7 + 2).toFixed(2)}`,
      body: `Pickup at ${order.vendorName}. Deliver to ${order.address.split(',')[0]}`,
      data: { orderId, type: 'new_delivery', screen: 'DriverActive' },
    })
  }

  console.log(`Driver ${driverId} assigned to order ${orderId}`)
}
