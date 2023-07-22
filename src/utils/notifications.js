export async function sendPushNotification(token, title, body, data, category) {
  if (token !== null) {
    const message = {
      to: token,
      sound: "default",
      title: title,
      body: body,
      data: data ?? {},
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
      categoryIdentifier: category ?? "",
    });
  }
  return;
}
