export async function markAsRead(notificationsId: string[]) {
  const payload = notificationsId.map((n) => ({ id: n, isUnread: false }));

  try {
    const response = await fetch(`http://localhost:3009/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Unable to set as read ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
