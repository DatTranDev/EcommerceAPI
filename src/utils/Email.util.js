const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS
    }
});

const sendOrderConfirmation = async (to, { name, orderId, total }) => {
  const mailOptions = {
    from: `EcommerceWeb Customer's Service <${process.env.MAIL_USER}>`,
    to,
    subject: 'Xác nhận đơn hàng',
    html: `
      <h3>Xin chào ${name},</h3>
      <p>Đơn hàng #${orderId} của bạn đã được xác nhận.</p>
      <p>Tổng tiền: <strong>${total.toLocaleString()} VND</strong></p>
      <p>Cảm ơn bạn đã mua sắm!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOrderConfirmation
};
