import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-12-18.acacia' })
const db = admin.firestore()

// Create a PaymentIntent for checkout
export const createPaymentIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in')

  const { amount, vendorId, orderId, currency = 'usd' } = data

  if (!amount || amount < 100) {
    throw new functions.https.HttpsError('invalid-argument', 'Amount must be at least $1.00')
  }

  // Get vendor's Stripe connected account
  const vendorDoc = await db.collection('vendors').doc(vendorId).get()
  const vendor = vendorDoc.data()

  const applicationFeeAmount = Math.round(amount * 0.05) // 5% platform fee

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    application_fee_amount: applicationFeeAmount,
    transfer_data: vendor?.stripeAccountId
      ? { destination: vendor.stripeAccountId }
      : undefined,
    metadata: { orderId, vendorId, customerId: context.auth.uid },
    automatic_payment_methods: { enabled: true },
  })

  return { clientSecret: paymentIntent.client_secret }
})

// Stripe webhook handler for payment events
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const { orderId } = pi.metadata
      if (orderId) {
        await db.collection('orders').doc(orderId).update({
          paymentStatus: 'paid',
          paymentIntentId: pi.id,
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
        })
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      const { orderId } = pi.metadata
      if (orderId) {
        await db.collection('orders').doc(orderId).update({
          paymentStatus: 'failed',
          status: 'cancelled',
        })
      }
      break
    }

    case 'account.updated': {
      const account = event.data.object as Stripe.Account
      // Sync vendor Stripe account status
      const vendorsSnap = await db.collection('vendors')
        .where('stripeAccountId', '==', account.id)
        .limit(1)
        .get()
      if (!vendorsSnap.empty) {
        await vendorsSnap.docs[0].ref.update({
          stripePayoutsEnabled: account.payouts_enabled,
          stripeChargesEnabled: account.charges_enabled,
          stripeDetailsSubmitted: account.details_submitted,
        })
      }
      break
    }
  }

  res.json({ received: true })
})

// Create Stripe Connect account for a new vendor
export const createConnectedAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in')

  const { vendorId, email, businessName } = data

  const account = await stripe.accounts.create({
    type: 'express',
    email,
    business_type: 'individual',
    business_profile: { name: businessName, mcc: '5411' }, // Grocery stores
    capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
    metadata: { vendorId },
  })

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${data.appUrl}/vendor/settings?refresh=1`,
    return_url: `${data.appUrl}/vendor/settings?connected=1`,
    type: 'account_onboarding',
  })

  await db.collection('vendors').doc(vendorId).update({
    stripeAccountId: account.id,
    stripeOnboardingUrl: accountLink.url,
  })

  return { accountId: account.id, onboardingUrl: accountLink.url }
})
