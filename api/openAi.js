import axios from "axios";
import { API_KEY, API_URL } from "../constants";

const client = axios.create({
    headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    }
});

const chatGbtEndpoint = `${API_URL}v1/chat/completions`;
const dalleEndpoint = `${API_URL}v1/images/generations`;

export const apiCall = async (prompt, messages, imageUrl='') => {
    try {
        // Improved classification
        const classificationPrompt = `
            Given the following prompt: "${prompt}"
            Determine if this prompt is requesting to generate an image or if it is a regular chat conversation.
            Respond with only one word: "art" if it is related to generating an image, or "chat" if it is a regular conversation.
        `;

        let classificationRes, isArt;
        
        if (imageUrl == ''){

            classificationRes = await client.post(chatGbtEndpoint, {
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: classificationPrompt
                }],
                max_tokens: 10 // Ensure the response is very short
            });

            isArt = classificationRes?.data?.choices[0]?.message?.content.toLowerCase().trim() === 'art';
        }


        const systemPrompt = `
        As an AI character, you are endowed with a specific set of characteristics and a defined historical context:

        1. **Full Character Immersion**: Embody your character completely, adopting their persona, speech patterns, and viewpoints in every interaction.
        
        2. **Engage Accurately**: Participate in online chat conversations by providing concise and informative answers relevant to your character's era.
        
        3. **Historical Consistency**: Discuss only technologies, events, or concepts that existed during your historical period. Avoid references to modern advancements or content that falls outside of your timeline.
        
        4. **Maintain Your Persona**: Do not alter your character, name, or any traits initially given. All responses should reflect your assigned persona consistently without deviation.
        
        5. **Relevant Topics**: If asked about something that does not concern you or that you are not interested in, politely redirect the conversation to topics within your scope of knowledge and interest.
        
        6. **Proactive Engagement**: Interact with the user by not only answering their questions but also asking your own to maintain an engaging and continuous dialogue. 
        
        7. **Avoid Negatives**: Always strive to provide answers, steering clear of responses like "I don't know" or "I can't."
        
        8. **Token Limit**: Ensure your responses do not exceed 400 tokens to maintain concise and clear communication.
        
        9. **Response Length**: Keep responses short and to the point unless the user specifically requests more detail or a longer explanation.
        
        10. **Bold and Italic Text**: If there is bold text in your response, format it as **bold text example**. If there is italic text, format it as *italic text example*.
        
        11. **Handle Links**: If asked about a link that you have in your additional information on, provide the link directly instead of indicating inability to do so.

        Ensure your interactions are not only historically accurate but also truly reflective of the character's essence, engaging users in a meaningful and educational dialogue.
        `;

        messages.push({
            role: 'system',
            content: systemPrompt.trim()
        });

        if (imageUrl !== ''){
            return imageAnalysisApiCall(prompt, imageUrl, messages || [])
        } else {
            if (isArt) {
                return dalleApiCall(prompt, messages || []);
            } else {
                return chatApiCall(prompt, messages || []);
            }
        }
    } catch (error) {
        console.error(error);
        return Promise.resolve({ success: false, msg: error.message });
    }
};

const chatApiCall = async (prompt, messages) => {
    try {
        const res = await client.post(chatGbtEndpoint, {
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.5,
            max_tokens: 400
        });

        let answer = res.data?.choices[0]?.message?.content;
        messages.push({ role: 'assistant', content: answer.trim() });
        return Promise.resolve({ success: true, data: messages });
    } catch (err) {
        console.error('error: ', err);
        return Promise.resolve({ success: false, msg: err.message });
    }
};

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
        console.error('error: ', err);
        return Promise.resolve({ success: false, msg: err.message });
    }
};


const imageAnalysisApiCall = async (prompt, imageUrl, messages) => {
    try {
        const res = await client.post(chatGbtEndpoint, {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                }
            ],
            max_tokens: 300
        });

        let analysis = res.data?.choices[0]?.message?.content;

        messages.push({ role: 'assistant', content: analysis.trim() });
        return Promise.resolve({ success: true, data: messages });
    } catch (err) {
        console.error('error: ', err);
        return Promise.resolve({ success: false, msg: err.message });
    }
};

// Recursive function to handle nested objects
function formatAdditionalInfo(details, indent = '  ') {
    let formattedDetails = '';
    for (let [key, value] of Object.entries(details)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
            formattedDetails += `${indent}${key}:\n${formatAdditionalInfo(value, indent + '  ')}`;
        } else if (Array.isArray(value)) {
            formattedDetails += `${indent}${key}:\n`;
            value.forEach(item => {
                if (typeof item === 'object') {
                    formattedDetails += `${indent}- ${formatAdditionalInfo(item, indent + '  ')}`;
                } else {
                    formattedDetails += `${indent}- ${item}\n`;
                }
            });
        } else {
            formattedDetails += `${indent}${key}: ${value}\n`;
        }
    }
    return formattedDetails;
}

export function generateCharacterPrompt(character) {
    let prompt = `${character.system_content}\n\nHere are some recommendations:\n`;
    character.recommendations.forEach((rec, index) => {
        prompt += `${index + 1}. ${rec}\n`;
    });

    if (character.additional_information) {
        prompt += `\nAdditional Information that you have to remember:\n${formatAdditionalInfo(character.additional_information)}`;
    }

    return prompt;
}

// export function generateCharacterPrompt(character) {
//     let prompt = `${character.assistant_content}\n\nHere are some recommendations:\n`;
//     character.recommendations.forEach((rec, index) => {
//         prompt += `${index + 1}. ${rec}\n`;
//     });

//     if (character.additional_information) {
//         prompt += `\nAdditional Information:\n`;

//         for (let [section, details] of Object.entries(character.additional_information)) {
//             if (typeof details === 'object' && !Array.isArray(details)) {
//                 prompt += `${section}:\n`;
//                 for (let [key, value] of Object.entries(details)) {
//                     if (Array.isArray(value)) {
//                         prompt += `- ${key}: ${value.join(', ')}\n`;
//                     } else {
//                         prompt += `- ${key}: ${value}\n`;
//                     }
//                 }
//             } else if (Array.isArray(details)) {
//                 prompt += `${section}:\n`;
//                 details.forEach((item) => {
//                     if (typeof item === 'object') {
//                         for (let [key, value] of Object.entries(item)) {
//                             prompt += `- ${key}: ${value}\n`;
//                         }
//                     } else {
//                         prompt += `- ${item}\n`;
//                     }
//                 });
//             } else {
//                 prompt += `${section}: ${details}\n`;
//             }
//         }
//     }

//     return prompt;
// }