import { sendMail } from './src/utils/mailer.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing Email Functionality...');

// Test email configuration
console.log('📧 Email Configuration:');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Not set');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'Not set');
console.log('SMTP_USER:', process.env.SMTP_USER || 'Not set');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : 'Not set');

async function testEmail() {
  try {
    console.log('\n📤 Sending test email...');
    
    const result = await sendMail({
      to: process.env.SMTP_USER || 'test@example.com',
      subject: 'Test Email from Job Board API',
      text: 'This is a test email to verify the email functionality is working.',
      html: '<h1>Test Email</h1><p>This is a test email to verify the email functionality is working.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔐 Authentication failed. Check your SMTP credentials.');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🌐 Connection failed. Check your SMTP host and port.');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🔍 SMTP host not found. Check your SMTP_HOST setting.');
    }
    
    console.log('\n💡 To fix email issues:');
    console.log('1. Set SMTP_HOST (e.g., smtp.gmail.com)');
    console.log('2. Set SMTP_PORT (e.g., 587)');
    console.log('3. Set SMTP_USER (your email)');
    console.log('4. Set SMTP_PASS (your app password)');
  }
}

// Only run if email credentials are set
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  testEmail();
} else {
  console.log('\n⚠️  Email credentials not configured. Skipping email test.');
  console.log('\n📝 To test email functionality, add these to your .env file:');
  console.log('SMTP_HOST=smtp.gmail.com');
  console.log('SMTP_PORT=587');
  console.log('SMTP_USER=your_email@gmail.com');
  console.log('SMTP_PASS=your_app_password');
}
