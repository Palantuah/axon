import { EmailTemplate } from '@/components/email-template';
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Newsletter content is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error: emailError } = await resend.emails.send({
      from: 'Axon AI <palantuah@meetmantra.ai>',
      to: [user.email],
      subject: 'Your Axon AI Newsletter',
      react: EmailTemplate({ content }) as React.ReactElement,
    });

    if (emailError) {
      return NextResponse.json(
        { error: emailError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Newsletter sent successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 