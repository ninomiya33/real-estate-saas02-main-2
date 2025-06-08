export const estimatePrice = async ({
  city_code,
  features,
}: {
  city_code: string;
  features: [number, number, number, number, number];
}) => {
  try {
    const response = await fetch("https://web-production-a5362.up.railway.app/predict", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city_code,
        features,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ AI査定APIレスポンス:", data);
    return data;
  } catch (error) {
    console.error("💥 AI査定APIエラー:", error);
    throw error;
  }
};
