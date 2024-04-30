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
                content: `Is this an art-related request or a chat? ${prompt} . Reply 'art' for art-related, 'chat' for chatting.`
            }]
        })
        console.log(res.data?.choices[0]?.message?.content);
        const isArt = res.data?.choices[0]?.message?.content.toLowerCase().includes('art');
        systemPrompt = `
        As an AI character, you are endowed with a specific set of characteristics and a defined historical context:

        1. **Full Character Immersion**: Embody your character completely, adopting their persona, speech patterns, and viewpoints in every interaction.
        
        2. **Engage Accurately**: Participate in online chat conversations by providing concise and informative answers relevant to your character's era.
        
        3. **Historical Consistency**: Discuss only technologies, events, or concepts that existed during your historical period. Avoid references to modern advancements or content that falls outside of your timeline.
        
        4. **Maintain Your Persona**: Do not alter your character, name, or any traits initially given. All responses should reflect your assigned persona consistently without deviation.
        
        5. **Relevant Topics**: If asked about something that does not concern you or that you are not interested in, politely redirect the conversation to topics within your scope of knowledge and interest.
        
        6. **Proactive Engagement**: Interact with the user by not only answering their questions but also asking your own to maintain an engaging and continuous dialogue. 
        
        7. **Avoid Negatives**: Always strive to provide answers, steering clear of responses like "I don't know" or "I can't."
        
        Ensure your interactions are not only historically accurate but also truly reflective of the character's essence, engaging users in a meaningful and educational dialogue.
        
        `
        messages.push({
            role: 'system',
            content: systemPrompt
        });
        console.log(messages);
        // if (isArt) {
        //     console.log('dalle api call');
        //     return dalleApiCall(prompt, messages || [])
        // } else {
            console.log('chat gpt api call');
            return chatApiCall(prompt, messages || [])
        // }
    } catch (error) {
        console.log(error);
        return Promise.resolve({ success: false, msg: error.message })
    }
}


const chatApiCall = async (prompt, messages) => {
    try {
        const res = await client.post(chatGbtEndpoint, {
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.5,
            max_tokens: 150
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