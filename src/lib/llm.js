
/**
 * Mock LLM Service
 * In a production environment, this would integrate with OpenAI, Anthropic, or Google Gemini.
 */

export async function generateExplanation(question, options, selectedAnswer, correctOption) {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isCorrect = selectedAnswer === correctOption;
    const selectedOptionText = options.find(o => o.id === selectedAnswer)?.text || selectedAnswer;
    const correctOptionText = options.find(o => o.id === correctOption)?.text || correctOption;

    let explanation = "";
    let confidence = 0.95;

    if (isCorrect) {
        explanation = `Correct! The answer is indeed "${correctOptionText}". \n\nKey Concept: This question tests your understanding of the core principles. You correctly identified that ${correctOptionText} is the right choice because it directly addresses the prompt's requirements. Keep up the great work!`;
    } else {
        explanation = `Not quite. You selected "${selectedOptionText}", but the correct answer is "${correctOptionText}". \n\nHere's why: While "${selectedOptionText}" might seem plausible in some contexts, "${correctOptionText}" is the more accurate answer here because of specific defining characteristics. A helpful way to remember this is to focus on the primary function/definition.`;
        confidence = 0.85; // Slightly lower confidence on corrections maybe? Just mocking.
    }

    return {
        explanation,
        confidence
    };
}
