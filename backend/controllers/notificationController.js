const { sendWhatsAppMessage } = require('../services/whatsappService');

exports.notifyWinner = async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        await sendWhatsAppMessage(phoneNumber, message);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Notification failed' });
    }
};
