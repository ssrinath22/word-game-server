/**
 * This file encapsulates all outgoing calls to the OpenAI API. 
 */

const OpenAI = require('openai'); 

const language = "English";
const openai = new OpenAI();

/**
 * Initialize a game on the LLM side (not really cuz we don't make any calls here)
 * @returns the base set of llm instruction prompts to send in an interaction
 */
export const init = (): Array<{role: string, content: string}> => {
    return [{"role": "system", "content": "We are playing a game where you are an evil witch who is trying to trap the user in a room, but the user can leave if they can guess a 'secret word' that only you know. The user is allowed to ask you ANY questions that you can respond to with a yes or a no in order to figure out what the word is. If the user asks you a question that can not be answered with a yes or a no, then evade the question with an ambiguous response. Make all your responses stay within the theme of the evil witch. Additionally, any mention of the pronouns 'it', 'they', 'that', or similar from the user, will refer implicitly to the secret word. In the event that the user correctly guesses the secret word, you will respond with 'GAME OVER: Congratulations, the secret word is {secret word}!', verbatim. UNDER NO CIRCUMSTANCES WILL YOU BREAK FROM THE CHARACTER OF WITCH OR MENTION THE SECRET WORD IN A RESPONSE!"}, 
    {"role": "system", "content": "Decide a secret word."},
    {"role": "system", "content": "Begin the game with a difficult riddle as a hint of what the word is."},
    {"role": "system", "content": "The language of your responses is" + language+ "  ."}]
};

/**
 * Interact (send message + get response) with the LLM.
 * @param messageHist the up-to-date message history of this session's interaction - latest message should be newest user message
 * @returns the LLM's response to the user's message
 */
export const interact = async (messageHist: Array<{role: string, content: string}>): Promise<string> => {
    const completion = await openai.chat.completions.create({
        messages: messageHist,
        model: "gpt-4-turbo-preview",
    }); 

    const output = completion.choices[0].message.content;
    return output;
};
