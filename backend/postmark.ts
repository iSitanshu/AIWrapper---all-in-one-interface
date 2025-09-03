import axios from "axios";

export function sendEmail(to: string, subject: string, body: string) {
  let data = JSON.stringify({
    From: process.env.FROM_EMAIL,
    To: to,
    Subject: subject,
    TextBody: body,
    HtmlBody: body,
    MessageStream: "outbound",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.postmarkapp.com/email",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN,
    },
    data: data,
  };

  return axios.request(config);
}
