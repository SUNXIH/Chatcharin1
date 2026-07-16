// ฟังก์ชันสำหรับตอบกลับข้อความหาผู้ใช้โดยไม่ใช้ไลบรารีภายนอก
async function replyMessage(replyToken, textMessage, accessToken) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const payload = {
    replyToken: replyToken,
    messages: [{ type: 'text', text: textMessage }]
  };

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  });
}

exports.handler = async (event, context) => {
  // รับคีย์จากระบบตั้งค่า Environment Variables ของ Netlify
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  // LINE จะส่งข้อมูลมาในรูปแบบ HTTP POST
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      
      // ตรวจสอบว่ามีข้อมูลเหตุการณ์ส่งมาจาก LINE หรือไม่
      if (body.events && body.events.length > 0) {
        const lineEvent = body.events[0];

        // ตรวจสอบว่าเป็นข้อความตัวอักษร
        if (lineEvent.type === 'message' && lineEvent.message.type === 'text') {
          const userText = lineEvent.message.text.trim();
          const replyToken = lineEvent.replyToken;

          // เงื่อนไข: ถ้าพิมพ์ว่า "สวัสดี" ให้ตอบกลับว่า "ไง"
          if (userText === 'สวัสดี') {
            await replyMessage(replyToken, 'ไง', channelAccessToken);
          }
        }
      }

      // ส่งสถานะ 200 OK กลับไปให้ LINE รู้ว่าระบบได้รับข้อมูลแล้ว (แก้อาการ ERROR_STATUS_CODE)
      return { statusCode: 200, body: 'OK' };
    } catch (error) {
      console.error(error);
      return { statusCode: 500, body: 'Internal Error' };
    }
  }

  // หากไม่ใช่ POST ให้ส่ง 405 กลับไป
  return { statusCode: 405, body: 'Method Not Allowed' };
};
