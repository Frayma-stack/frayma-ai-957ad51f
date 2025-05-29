
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Img,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  confirmation_url: string
  user_email: string
}

export const ConfirmationEmail = ({
  confirmation_url,
  user_email,
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Frayma AI - Confirm your email to get started</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={logoContainer}>
          <Img
            src="https://rrltvtuuzljqkbdavzyw.supabase.co/storage/v1/object/public/assets/frayma-logo.png"
            width="50"
            height="50"
            alt="Frayma AI"
            style={logo}
          />
          <Heading style={h1}>Frayma AI</Heading>
        </div>
        
        <Text style={subtitle}>
          Frame POVs. Auto-craft resonant, compelling GTM narratives. Win your market.
        </Text>
        
        <Heading style={h2}>Welcome to Frayma AI!</Heading>
        
        <Text style={text}>
          Thank you for signing up for Frayma AI, {user_email}. We're excited to help you create compelling narratives that resonate with your target audience.
        </Text>
        
        <Text style={text}>
          To get started with the Frayma AI Narrative Engine, please confirm your email address by clicking the button below:
        </Text>
        
        <div style={buttonContainer}>
          <Link href={confirmation_url} style={button}>
            Confirm Email & Start Creating
          </Link>
        </div>
        
        <Text style={text}>
          Or copy and paste this link in your browser:
        </Text>
        <Text style={link}>{confirmation_url}</Text>
        
        <Text style={text}>
          Once confirmed, you'll be guided through a quick setup process where the Frayma AI Narrative Engine will analyze your profile, business, and target audience to create personalized content that drives results.
        </Text>
        
        <Text style={footerText}>
          If you didn't create an account with Frayma AI, you can safely ignore this email.
        </Text>
        
        <Text style={footer}>
          Best regards,<br />
          The Frayma AI Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Sora, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '32px',
}

const logo = {
  marginRight: '12px',
}

const h1 = {
  color: '#1E40AF',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'Sora, sans-serif',
}

const h2 = {
  color: '#1E40AF',
  fontSize: '24px',
  fontWeight: '600',
  margin: '32px 0 16px',
  textAlign: 'center' as const,
}

const subtitle = {
  color: '#6B7280',
  fontSize: '16px',
  textAlign: 'center' as const,
  margin: '0 0 32px',
  fontStyle: 'italic',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#1E40AF',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  fontFamily: 'Sora, sans-serif',
}

const link = {
  color: '#1E40AF',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  margin: '8px 0 24px',
}

const footerText = {
  color: '#6B7280',
  fontSize: '14px',
  margin: '32px 0 16px',
}

const footer = {
  color: '#6B7280',
  fontSize: '14px',
  margin: '16px 0',
}
