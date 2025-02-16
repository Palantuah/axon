import { EmailTemplate } from '@/components/email-template';
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error: emailError } = await resend.emails.send({
      from: 'Axon AI <palantuah@gmail.com>',
      to: [user.email],
      subject: 'Welcome to Axon!',
      react: EmailTemplate({ username: user.email.split('@')[0] }) as React.ReactElement,
    });

    if (emailError) {
      return NextResponse.json(
        { error: emailError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully', data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 