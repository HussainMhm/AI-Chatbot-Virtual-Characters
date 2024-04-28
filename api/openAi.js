import axios from "axios";
import { API_KEY, API_URL } from "../constants";

const client = axios.create({
    headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    }
})

const chatGbtEndpoint = `${API_URL}v1/chat/completions`
const dalleEndpoint = `${API_URL}v1/images/generations`

export const apiCall = async (prompt, messages) => {
    try {
        const res = await client.post(chatGbtEndpoint, {
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: `Does this message want to generate an AI picture, image? ${prompt} . Simply answer with a yes or no.`
            }]
        })
        let isArt = res.data?.choices[0]?.message?.content;
        if (isArt.toLowerCase().includes('yes')) {
            console.log('dalle api call');
            return dalleApiCall(prompt, messages || [])
        } else {
            console.log('chat gpt api call');
            return chatApiCall(prompt, messages || [])
        }
    } catch (error) {
        console.log(error);
        return Promise.resolve({ success: false, msg: error.message })
    }
}


const chatApiCall = async (prompt, messages) => {
    try {
        const res = await client.post(chatGbtEndpoint, {
            model: 'gpt-3.5-turbo',
            messages
        });

        let answer = res.data?.choices[0]?.message?.content;
        messages.push({ role: 'assistant', content: answer.trim() });
        return Promise.resolve({ success: true, data: messages });
    } catch (err) {
        console.log('error: ', err);
        return Promise.resolve({ success: false, msg: err.message });
    }
}

const dalleApiCall = async (prompt, messages) => {
    try {
        const res = await client.post(dalleEndpoint, {
            prompt,
            n: 1,
            size: '512x512'
        });

        let url = res.data?.data[0]?.url;
        console.log(`got url of the image ${url}`);
        messages.push({ role: 'assistant', content: url });
        return Promise.resolve({ success: true, data: messages });
    } catch (err) {
        console.log('error: ', err);
        return Promise.resolve({ success: false, msg: err.message });
    }
}