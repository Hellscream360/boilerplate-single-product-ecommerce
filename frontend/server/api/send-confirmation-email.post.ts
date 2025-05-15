import { defineEventHandler, readBody } from 'h3';
import nodemailer from 'nodemailer';

// Create test account for development
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export default defineEventHandler(async (event) => {
  try {
    const { email, orderDetails } = await readBody(event);

    // Create test transporter
    const transporter = await createTestAccount();

    const mailOptions = {
      from: '"E-commerce Store" <store@example.com>',
      to: email,
      subject: 'Order Confirmation',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your payment has been successfully processed.</p>
        <h2>Order Details:</h2>
        <p>Product: ${orderDetails.product.title}</p>
        <p>Quantity: ${orderDetails.quantity}</p>
        <p>Total: ${orderDetails.amount}€</p>
        <p>Order ID: ${orderDetails.paymentIntentId}</p>
      `,
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);

    // Log test email URL
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    return { 
      success: true,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error: any) {
    console.error('Error sending confirmation email:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
}); 