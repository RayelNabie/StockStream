export async function apiRequest(endpoint, method = "GET", body = null) {
  const apiUrl = import.meta.env.VITE_SERVER_URL + endpoint;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 sec timeout

  try {
    const response = await fetch(apiUrl, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Serverfout: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request timeout na 10 seconden");
    } else {
      console.error("API-fout:", error.message);
    }
    throw error;
  }
}
