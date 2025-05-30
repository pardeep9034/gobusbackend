const sendSMS=require('../utils/sensSms');


const sendSmsController = async (req, res) => {
    const { phone, message } = req.body;
    const to=phone
    console.log('Phone:', phone," Message:", message);
    try {
      await sendSMS(to, message);
      res.status(200).json({ success: true, message: 'SMS sent!' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

module.exports = {
    sendSmsController   }