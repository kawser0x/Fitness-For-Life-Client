import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../lib/stripe';

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    let classId, userEmail, className, price, image, trainerName, classSchedule;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      classId = formData.get('classId');
      userEmail = formData.get('userEmail');
      className = formData.get('className') || 'Fitness Class';
      price = parseFloat(formData.get('price')) || 0;
      image = formData.get('image') || '';
      trainerName = formData.get('trainerName') || 'Certified Trainer';
      classSchedule = formData.get('classSchedule') || 'Schedule TBD';
    } else {
      const json = await req.json();
      classId = json.classId;
      userEmail = json.userEmail;
      className = json.className || 'Fitness Class';
      price = parseFloat(json.price) || 0;
      image = json.image || '';
      trainerName = json.trainerName || 'Certified Trainer';
      classSchedule = json.classSchedule || 'Schedule TBD';
    }

    const unitAmount = Math.max(Math.round(price * 100), 100);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: className,
              description: `Fitness session led by ${trainerName}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userEmail || undefined,
      metadata: {
        classId: classId || '',
        userEmail: userEmail || '',
        className: className || '',
        price: price.toString(),
        image: image || '',
        trainerName: trainerName || '',
        classSchedule: classSchedule || '',
      },
      success_url: `${origin}/api/checkout_sessions/success?session_id={CHECKOUT_SESSION_ID}&classId=${encodeURIComponent(classId || '')}&userEmail=${encodeURIComponent(userEmail || '')}`,
      cancel_url: `${origin}/payment/${classId}?canceled=true`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error('Stripe Checkout Session Error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}