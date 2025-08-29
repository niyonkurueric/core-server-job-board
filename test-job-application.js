import { sendMail } from './src/utils/mailer.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing Job Application Email Functionality...');

// Simulate a job application
const mockApplication = {
  user: {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com'
  },
  job: {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp'
  },
  cover_letter: 'I am excited to apply for this position...'
};

async function testJobApplicationEmails() {
  try {
    console.log('\n📝 Simulating job application...');
    console.log('Applicant:', mockApplication.user.name);
    console.log('Job:', mockApplication.job.title);
    console.log('Company:', mockApplication.job.company);
    
    // Test 1: Send confirmation email to applicant
    console.log('\n📤 Sending confirmation email to applicant...');
    const applicantEmail = await sendMail({
      to: mockApplication.user.email,
      subject: 'Application Submitted Successfully',
      text: `Your application for job "${mockApplication.job.title}" was submitted successfully! We will review your application and get back to you soon.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Application Submitted Successfully!</h2>
          <p>Dear ${mockApplication.user.name},</p>
          <p>Your application for the position of <strong>${mockApplication.job.title}</strong> at <strong>${mockApplication.job.company}</strong> has been submitted successfully.</p>
          <p>We will review your application and get back to you within 3-5 business days.</p>
          <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
          <p style="color: #7f8c8d; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });
    console.log('✅ Applicant confirmation email sent successfully!');
    console.log('Message ID:', applicantEmail.messageId);
    
    // Test 2: Send notification email to admin
    console.log('\n📤 Sending notification email to admin...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminNotification = await sendMail({
      to: adminEmail,
      subject: `New Job Application: ${mockApplication.job.title}`,
      text: `A new application has been submitted for the job "${mockApplication.job.title}" by ${mockApplication.user.name} (${mockApplication.user.email}).`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">New Job Application Received</h2>
          <p><strong>Job:</strong> ${mockApplication.job.title}</p>
          <p><strong>Company:</strong> ${mockApplication.job.company}</p>
          <p><strong>Applicant:</strong> ${mockApplication.user.name} (${mockApplication.user.email})</p>
          <p><strong>Applied:</strong> ${new Date().toLocaleString()}</p>
          <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
          <p style="color: #7f8c8d; font-size: 14px;">
            Review this application in your admin dashboard.
          </p>
        </div>
      `,
    });
    console.log('✅ Admin notification email sent successfully!');
    console.log('Message ID:', adminNotification.messageId);
    
    console.log('\n🎉 All job application emails sent successfully!');
    console.log('\n📧 Email Summary:');
    console.log(`- Applicant confirmation sent to: ${mockApplication.user.email}`);
    console.log(`- Admin notification sent to: ${adminEmail}`);
    
  } catch (error) {
    console.error('❌ Job application email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔐 Authentication failed. Check your SMTP credentials.');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🌐 Connection failed. Check your SMTP host and port.');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🔍 SMTP host not found. Check your SMTP_HOST setting.');
    }
  }
}

// Run the test
testJobApplicationEmails();
