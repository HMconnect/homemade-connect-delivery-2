# 📊 POST-LAUNCH MONITORING PLAN
# Homemade Connect Delivery

## CHECK DAILY (5 minutes):

### Supabase
- Go to supabase.com → your project
- Table Editor → app_logs
- Filter: level = 'error'
- Action if errors found: fix and redeploy

- Table Editor → user_profiles
- Count new signups: SELECT COUNT(*) FROM user_profiles WHERE created_at > NOW() - INTERVAL '24 hours'
- Track: vendors vs drivers vs customers

- Table Editor → orders
- Count orders: SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '24 hours'
- Track payment_status = 'pending' (investigate if > 0 after 1 hour)

### Vercel
- Go to vercel.com → your project → Analytics
- Check: page views, unique visitors, error rate
- Alert threshold: error rate > 1%

### Stripe (when live)
- Go to stripe.com → Dashboard
- Check: payments, transfers, disputes
- Alert: any dispute → respond within 24 hours
- Check webhook delivery rate: should be > 99%

---

## CHECK WEEKLY (15 minutes):

### Revenue tracking
```sql
SELECT 
  DATE_TRUNC('week', created_at) as week,
  COUNT(*) as orders,
  SUM(vendor_amount)/100 as vendor_payouts,
  SUM(driver_amount)/100 as driver_payouts,
  SUM(platform_fee)/100 as platform_revenue
FROM orders
WHERE payment_status = 'succeeded'
GROUP BY week
ORDER BY week DESC;
```

### Vendor health
```sql
SELECT 
  COUNT(*) as total_vendors,
  COUNT(*) FILTER (WHERE application_status = 'approved') as approved,
  COUNT(*) FILTER (WHERE application_status = 'pending') as pending,
  COUNT(*) FILTER (WHERE stripe_onboarding_complete = true) as stripe_ready
FROM user_profiles
WHERE role = 'vendor';
```

### Driver health
```sql
SELECT
  COUNT(*) as total_drivers,
  COUNT(*) FILTER (WHERE stripe_payouts_enabled = true) as payout_ready
FROM user_profiles
WHERE role = 'driver';
```

---

## ALERT CONDITIONS (act immediately):

| Alert | Threshold | Action |
|-------|-----------|--------|
| Error rate | > 1% | Check app_logs, fix and redeploy |
| Blank page reports | Any | Roll back to previous deploy |
| Stripe webhook failures | > 3 in 1 hour | Check Stripe dashboard, re-enable |
| Failed payments | > 5% | Check Stripe error logs |
| RLS breach | Any unauthorized access | Immediately review RLS policies |
| Supabase down | Any | Check status.supabase.com |

---

## EMERGENCY ROLLBACK:
```
1. Go to Netlify/Vercel → Deploys
2. Find last working deployment
3. Click "Publish deploy" / "Promote to Production"
4. App restored in < 60 seconds
```

---

## SUPPORT CONTACTS:
- Supabase: supabase.com/support
- Vercel: vercel.com/support  
- Stripe: stripe.com/support or 1-888-926-2289
- Stripe webhook debug: stripe.com/docs/webhooks/test
