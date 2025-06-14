import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "deepseek/DeepSeek-V3-0324";

export async function main() {
  // Read the image file as base64
  const imagePath = "./contoso_layout_sketch.jpg";
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString("base64");

  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: [
            { type: "text", text: "What does this image show?" },
            { type: "image_url", image_url: `data:image/jpeg;base64,${imageBase64}` }
          ]
        }
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 4000,
      model: model
    }
  });

  if (isUnexpected(response)) {
    let errorMsg = "Unknown error";
    try {
      const body = typeof response.body === "string" ? JSON.parse(response.body) : response.body;
      errorMsg = body?.error?.message ?? errorMsg;
    } catch (e) {
      // ignore JSON parse errors
    }
    console.error("Unexpected response:", response);
    throw new Error(errorMsg);
  }

  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

