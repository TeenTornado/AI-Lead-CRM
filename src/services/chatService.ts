const TOGETHER_API_KEY =
  "b62d22ea274ae16d8478d29ccedb049f32bb64712463c4af531ee224eadf86fb";
const API_URL = "https://api.together.xyz/v1/chat/completions";

export async function sendChatMessage(message: string) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-classifier",
        max_tokens: 800,
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "You are SharpSys AI Assistant, an expert in AI-Lead-CRM system. You can help with lead management, analytics, data import/export, company profiles, goals & targets, communications, calendar management, and general system usage. You have access to features like user authentication, role-based access control (Admin, HR, Employee), dashboard analytics, and MongoDB integration. Provide specific, helpful responses about the CRM system's features and functionality.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
}
