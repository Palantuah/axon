import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';
import { Container } from '@react-email/container';

interface EmailTemplateProps {
  username?: string;
  userId?: string;
}

export const EmailTemplate = ({
  username = 'there',
}: EmailTemplateProps) => {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Welcome to Axon!</Text>
          <Text style={paragraph}>Hi {username},</Text>
          <Text style={paragraph}>
            Thank you for using Axon! We're excited to have you on board.
          </Text>
          <Text style={paragraph}>
            Best regards,<br />
            The Axon Team
          </Text>
        </Container>
      </Section>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
}; 