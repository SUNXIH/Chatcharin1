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
  // 🔑 ฝัง Token ตรงๆ ตามคำขอ ไม่ต้องง้อระบบอื่น
  const channelAccessToken = "G2tV047Ye/9jN50ooyrY6QhRCXip8f0/WzaV965OuzbxAXvRzLJQOyurIKf8wYdBWwB/zN43ATmJSU8ne+vj+RqMTb1iq0qy94ldu60t/Cl/1Pf4r54/0GZriA9ZRZ1RQpwuxwHX5mAUYqvbXKDMIwdB04t89/1O/w1cDnyilFU=";

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      
      if (body.events && body.events.length > 0) {
        const lineEvent = body.events[0];

        if (lineEvent.type === 'message' && lineEvent.message.type === 'text') {
          const userText = lineEvent.message.text.trim();
          const replyToken = lineEvent.replyToken;

          if (userText === 'สวัสดี') {
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
