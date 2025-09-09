// Email notification service for Lone Star Wash & Dry
// This service handles sending email notifications for booking events

export interface BookingData {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  pickup_date: string;
  pickup_time: string;
  service_type: string;
  customer_address: string;
  special_instructions?: string;
  status: string;
  created_at: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Email templates for different booking events
export const emailTemplates = {
  bookingConfirmation: (booking: BookingData): EmailTemplate => {
    const pickupDateTime = new Date(`${booking.pickup_date}T${booking.pickup_time}`).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return {
      subject: `Booking Confirmation - ${booking.service_type} Pickup Scheduled`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #374151; }
            .detail-value { color: #6b7280; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            .highlight { background: #dbeafe; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌟 Lone Star Wash & Dry</h1>
            <p>Your pickup has been confirmed!</p>
          </div>
          
          <div class="content">
            <h2>Hello ${booking.customer_name}!</h2>
            <p>Thank you for choosing Lone Star Wash & Dry. Your ${booking.service_type} service has been successfully booked.</p>
            
            <div class="highlight">
              <strong>📅 Pickup Scheduled:</strong><br>
              ${pickupDateTime}
            </div>
            
            <div class="booking-details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Reference ID:</span>
                <span class="detail-value">${booking.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service Type:</span>
                <span class="detail-value">${booking.service_type}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pickup Address:</span>
                <span class="detail-value">${booking.customer_address}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${booking.customer_phone}</span>
              </div>
              ${booking.special_instructions ? `
              <div class="detail-row">
                <span class="detail-label">Special Instructions:</span>
                <span class="detail-value">${booking.special_instructions}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="highlight">
              <h4>What happens next?</h4>
              <ul>
                <li>We'll contact you within 2 hours to confirm your pickup</li>
                <li>Our team will arrive at your scheduled time</li>
                <li>Your laundry will be professionally cleaned and folded</li>
                <li>We'll deliver your clean clothes back to you</li>
              </ul>
            </div>
            
            <p><strong>Need to make changes?</strong> Please call us at <strong>(555) 123-4567</strong> or reply to this email.</p>
            
            <p>Thank you for trusting us with your laundry needs!</p>
            
            <div class="footer">
              <p>Lone Star Wash & Dry<br>
              123 Main Street, Austin, TX 78701<br>
              Phone: (555) 123-4567 | Email: info@lonestarwash.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Lone Star Wash & Dry - Booking Confirmation
        
        Hello ${booking.customer_name}!
        
        Thank you for choosing Lone Star Wash & Dry. Your ${booking.service_type} service has been successfully booked.
        
        PICKUP SCHEDULED: ${pickupDateTime}
        
        Booking Details:
        - Reference ID: ${booking.id}
        - Service Type: ${booking.service_type}
        - Pickup Address: ${booking.customer_address}
        - Phone: ${booking.customer_phone}
        ${booking.special_instructions ? `- Special Instructions: ${booking.special_instructions}` : ''}
        
        What happens next?
        - We'll contact you within 2 hours to confirm your pickup
        - Our team will arrive at your scheduled time
        - Your laundry will be professionally cleaned and folded
        - We'll deliver your clean clothes back to you
        
        Need to make changes? Please call us at (555) 123-4567 or reply to this email.
        
        Thank you for trusting us with your laundry needs!
        
        Lone Star Wash & Dry
        123 Main Street, Austin, TX 78701
        Phone: (555) 123-4567 | Email: info@lonestarwash.com
      `
    };
  },

  bookingReminder: (booking: BookingData): EmailTemplate => {
    const pickupDateTime = new Date(`${booking.pickup_date}T${booking.pickup_time}`).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return {
      subject: `Reminder: Your ${booking.service_type} Pickup is Tomorrow`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pickup Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .reminder-box { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⏰ Pickup Reminder</h1>
            <p>Your laundry pickup is tomorrow!</p>
          </div>
          
          <div class="content">
            <h2>Hello ${booking.customer_name}!</h2>
            
            <div class="reminder-box">
              <h3>📅 Your Pickup is Scheduled for:</h3>
              <p><strong>${pickupDateTime}</strong></p>
              <p><strong>Reference ID:</strong> ${booking.id}</p>
            </div>
            
            <h3>Please prepare your laundry:</h3>
            <ul>
              <li>Sort your clothes by color (whites, darks, colors)</li>
              <li>Remove any items from pockets</li>
              <li>Place delicate items in separate bags if needed</li>
              <li>Have your laundry ready at the pickup address</li>
            </ul>
            
            <p><strong>Questions or need to reschedule?</strong> Call us at <strong>(555) 123-4567</strong></p>
            
            <p>We look forward to serving you!</p>
            
            <div class="footer">
              <p>Lone Star Wash & Dry<br>
              123 Main Street, Austin, TX 78701<br>
              Phone: (555) 123-4567 | Email: info@lonestarwash.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Lone Star Wash & Dry - Pickup Reminder
        
        Hello ${booking.customer_name}!
        
        Your pickup is scheduled for: ${pickupDateTime}
        Reference ID: ${booking.id}
        
        Please prepare your laundry:
        - Sort your clothes by color (whites, darks, colors)
        - Remove any items from pockets
        - Place delicate items in separate bags if needed
        - Have your laundry ready at the pickup address
        
        Questions or need to reschedule? Call us at (555) 123-4567
        
        We look forward to serving you!
        
        Lone Star Wash & Dry
        123 Main Street, Austin, TX 78701
        Phone: (555) 123-4567 | Email: info@lonestarwash.com
      `
    };
  },

  statusUpdate: (booking: BookingData, newStatus: string): EmailTemplate => {
    const statusMessages = {
      confirmed: "Your pickup has been confirmed by our team!",
      in_progress: "We're currently processing your laundry.",
      completed: "Your laundry is ready for delivery!",
      cancelled: "Your booking has been cancelled."
    };

    const statusColors = {
      confirmed: "#10b981",
      in_progress: "#3b82f6", 
      completed: "#8b5cf6",
      cancelled: "#ef4444"
    };

    return {
      subject: `Status Update: ${booking.service_type} - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${statusColors[newStatus as keyof typeof statusColors]}, #6b7280); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColors[newStatus as keyof typeof statusColors]}; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📋 Status Update</h1>
            <p>${statusMessages[newStatus as keyof typeof statusMessages]}</p>
          </div>
          
          <div class="content">
            <h2>Hello ${booking.customer_name}!</h2>
            
            <div class="status-box">
              <h3>Booking Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</h3>
              <p><strong>Reference ID:</strong> ${booking.id}</p>
              <p><strong>Service:</strong> ${booking.service_type}</p>
            </div>
            
            <p>Thank you for choosing Lone Star Wash & Dry!</p>
            
            <div class="footer">
              <p>Lone Star Wash & Dry<br>
              123 Main Street, Austin, TX 78701<br>
              Phone: (555) 123-4567 | Email: info@lonestarwash.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Lone Star Wash & Dry - Status Update
        
        Hello ${booking.customer_name}!
        
        ${statusMessages[newStatus as keyof typeof statusMessages]}
        
        Booking Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
        Reference ID: ${booking.id}
        Service: ${booking.service_type}
        
        Thank you for choosing Lone Star Wash & Dry!
        
        Lone Star Wash & Dry
        123 Main Street, Austin, TX 78701
        Phone: (555) 123-4567 | Email: info@lonestarwash.com
      `
    };
  }
};

// Email service class
export class EmailService {
  private static instance: EmailService;
  private apiKey: string;
  private fromEmail: string;

  private constructor() {
    // In a real implementation, these would come from environment variables
    this.apiKey = import.meta.env.VITE_EMAIL_API_KEY || 'demo-key';
    this.fromEmail = import.meta.env.VITE_FROM_EMAIL || 'noreply@lonestarwash.com';
    
    // Suppress unused variable warning for demo purposes
    console.log('Email service initialized with API key:', this.apiKey ? '***' : 'none');
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send email using a service like SendGrid, Mailgun, or Resend
  public async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      // For demo purposes, we'll simulate sending emails
      // In production, you would integrate with a real email service
      
      console.log('📧 Email would be sent:', {
        to,
        from: this.fromEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, you would make an API call to your email service:
      /*
      const response = await fetch('https://api.emailservice.com/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          from: this.fromEmail,
          subject: template.subject,
          html: template.html,
          text: template.text
        })
      });

      return response.ok;
      */

      // For demo, always return true
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Send booking confirmation email
  public async sendBookingConfirmation(booking: BookingData): Promise<boolean> {
    if (!booking.customer_email) {
      console.log('No email address provided for booking confirmation');
      return false;
    }

    const template = emailTemplates.bookingConfirmation(booking);
    return await this.sendEmail(booking.customer_email, template);
  }

  // Send booking reminder email
  public async sendBookingReminder(booking: BookingData): Promise<boolean> {
    if (!booking.customer_email) {
      console.log('No email address provided for booking reminder');
      return false;
    }

    const template = emailTemplates.bookingReminder(booking);
    return await this.sendEmail(booking.customer_email, template);
  }

  // Send status update email
  public async sendStatusUpdate(booking: BookingData, newStatus: string): Promise<boolean> {
    if (!booking.customer_email) {
      console.log('No email address provided for status update');
      return false;
    }

    const template = emailTemplates.statusUpdate(booking, newStatus);
    return await this.sendEmail(booking.customer_email, template);
  }
}

// Utility functions for scheduling reminders
export const scheduleReminder = async (booking: BookingData): Promise<void> => {
  const pickupDate = new Date(`${booking.pickup_date}T${booking.pickup_time}`);
  const reminderDate = new Date(pickupDate);
  reminderDate.setDate(reminderDate.getDate() - 1); // Send reminder 1 day before

  const now = new Date();
  const timeUntilReminder = reminderDate.getTime() - now.getTime();

  if (timeUntilReminder > 0) {
    // In a real implementation, you would use a job queue like Bull, Agenda, or similar
    // For demo purposes, we'll just log the scheduled time
    console.log(`📅 Reminder scheduled for ${reminderDate.toLocaleString()} for booking ${booking.id}`);
    
    // Simulate scheduling with setTimeout (not recommended for production)
    setTimeout(async () => {
      const emailService = EmailService.getInstance();
      await emailService.sendBookingReminder(booking);
    }, timeUntilReminder);
  }
};

// Export singleton instance
export const emailService = EmailService.getInstance();
