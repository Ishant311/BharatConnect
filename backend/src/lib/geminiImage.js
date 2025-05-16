const { GoogleGenerativeAI } =  require("@google/generative-ai");
const fs = require("fs");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


function fileToGenerativePart(path, mimeType) {

  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType
    }
  };
}

const analyzeImage = async (imagePath, prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  try {
    const result = await model.generateContent([
      prompt,
      fileToGenerativePart(imagePath, "image/jpeg")
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    return "video";
  }
};
module.exports = {analyzeImage};
