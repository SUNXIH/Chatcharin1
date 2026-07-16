// ฟังก์ชันส่งข้อความกลับหา LINE
async function replyMessage(replyToken, textMessage, accessToken) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [{ type: 'text', text: textMessage }]
    })
  });
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    try {
      // 💡 จุดเปลี่ยนสำคัญ: ดึงคีย์โดยตรงจากแผงควบคุมที่พี่ส่งมา (ผ่านตัวแปร หรือ Header)
      const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || event.headers['authorization']?.replace('Bearer ', '');
      
      const body = JSON.parse(event.body);
      
      if (body.events && body.events.length > 0) {
        const lineEvent = body.events[0];

        if (lineEvent.type === 'message' && lineEvent.message.type === 'text') {
          const userText = lineEvent.message.text.trim();
          const replyToken = lineEvent.replyToken;

          if (userText === 'สวัสดี') {
            // ส่งข้อความกลับ โดยใช้ Token ที่ดึงมาได้
            await replyMessage(replyToken, 'ไง', channelAccessToken);
          }
        }
      }

      return { statusCode: 200, body: 'OK' };
    } catch (error) {
      console.error(error);
      return { statusCode: 500, body: 'Internal Error' };
    }
  }
  return { statusCode: 405, body: 'Method Not Allowed' };
};
