import ModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import dotenv from 'dotenv';

dotenv.config();

const client = new ModelClient(
    process.env.AZURE_INFERENCE_SDK_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_INFERENCE_SDK_KEY)
);

var messages = [
    {
        role: 'system',
        content: 'You are a helpful assistant.'
    },
    {
        role: 'user',
        content: "What are 3 things to see in Seattle?"
    }   
 ];

var response = await client.path('/chat/completions').post({
    body: {
        messages: messages,
        temperature: 1.0,
        top_p: 1.0,
        model: 'gpt-4'
    }
});

// Check for errors or missing choices
if (!response.body || !response.body.choices || !response.body.choices[0]) {
    console.error("API Error or unexpected response:", response.body);
} else {
    console.log(response.body.choices[0].message.content);
}