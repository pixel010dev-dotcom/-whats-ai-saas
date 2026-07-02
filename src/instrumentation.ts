import cron from 'node-cron'

let initialized = false

export async function register() {
  if (initialized || process.env.NODE_ENV !== 'production') return
  initialized = true

  cron.schedule('0 * * * *', async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/expire-subscriptions`, {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      })
      const data = await res.json()
      console.log('[CRON] Expire subscriptions:', data)
    } catch (err) {
      console.error('[CRON] Error:', err)
    }
  })

  console.log('[CRON] Registered: expire subscriptions every hour')
}
