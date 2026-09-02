import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';

export async function GET(req) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  const classId = url.searchParams.get('classId');
  const userEmail = url.searchParams.get('userEmail');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    if (sessionId) {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      const metadata = checkoutSession.metadata || {};

      const bookingPayload = {
        userEmail: metadata.userEmail || userEmail,
        classId: metadata.classId || classId,
        className: metadata.className || 'Fitness Class',
        price: parseFloat(metadata.price) || 0,
        image: metadata.image || '',
        trainerName: metadata.trainerName || 'Certified Trainer',
        classSchedule: metadata.classSchedule || 'Schedule TBD',
        transactionId: checkoutSession.payment_intent || sessionId,
      };

      if (bookingPayload.userEmail && bookingPayload.classId) {
        console.log("Saving booking from Stripe success redirect:", bookingPayload);
        const res = await fetch(`${API_URL}/api/user/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload),
        });
        if (!res.ok) {
          const errData = await res.json();
          console.error("Failed to save booking to MongoDB:", errData);
        }
      }
    }
  } catch (err) {
    console.error('Error processing Stripe success redirect:', err);
  }

  return NextResponse.redirect(`${url.origin}/dashboard/user/booked-classes`, 303);
}
