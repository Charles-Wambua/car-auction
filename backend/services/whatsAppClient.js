const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "/home/user/whatsapp-session",
  }),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log("Scan the QR code to log in:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp Client is ready!");
});

client.initialize();

const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    console.log("📤 Sending message to:", phoneNumber);
    console.log("Message:", message);

    const formattedPhoneNumber = phoneNumber.replace(/\D/g, "");
    const whatsappId = `${formattedPhoneNumber}@c.us`;

    const isRegistered = await client.isRegisteredUser(whatsappId);
    if (!isRegistered) {
      console.error(
        "⚠️ Error: Phone number is not registered on WhatsApp:",
        phoneNumber
      );
      return;
    }

    await client.sendMessage(whatsappId, message);
    console.log("✅ Message sent successfully to", phoneNumber);
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
  }
};

module.exports = { client, sendWhatsAppMessage };
