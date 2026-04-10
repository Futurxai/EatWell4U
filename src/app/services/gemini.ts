import { Injectable } from '@angular/core';
import { StateService } from './state';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private apiKey = environment.groqApiKey;
  private apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private chatHistory: ChatMessage[] = [];

  constructor(private state: StateService) {}

  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  private getSystemPrompt(): string {
    const st = this.state.getState();
    return `You are EatWell AI — a friendly Indian nutrition assistant inside the EatWell meal planning app.

USER PROFILE:
- Name: ${st.username || 'User'}
- Height: ${st.height || 'unknown'} cm
- Weight: ${st.weight || 'unknown'} kg
- Gender: ${st.gender || 'unknown'}
- Diet: ${st.profileDiet || 'Vegetarian'}
- Goal: ${st.profileGoal || 'Maintain weight'}
- Target weight: ${st.targetWeight || 'not set'} kg
- Preferred cuisines: ${Array.from(st.profileCuisines || []).join(', ') || 'South Indian'}
- Daily calorie target: 2000 kcal

RULES:
1. Always suggest Indian meals (South Indian, North Indian based on user preference)
2. Include calories for every meal suggestion
3. Use food emojis to make responses friendly
4. Keep responses short — max 150 words
5. If user asks non-food questions, politely redirect to nutrition
6. Use Tamil food names when suggesting South Indian food
7. Always consider the user's diet preference (veg/non-veg/vegan)
8. Suggest meals that fit within remaining daily calories
9. Be encouraging about the user's health goals
10. End with a helpful follow-up question`;
  }

  async sendMessage(userMessage: string): Promise<string> {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    this.chatHistory.push({
      role: 'user',
      text: userMessage,
      time: now
    });

    try {
      const messages = [
        { role: 'system', content: this.getSystemPrompt() },
        ...this.chatHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature: 0.7,
          max_tokens: 300
        })
      });

      const data = await response.json();
      const aiText = data?.choices?.[0]?.message?.content
        || 'Sorry, I couldn\'t process that. Try asking about meals or nutrition! 🍎';

      this.chatHistory.push({
        role: 'ai',
        text: aiText,
        time: now
      });

      return aiText;

    } catch (error) {
      const errorMsg = 'Oops! I\'m having trouble connecting. Please check your internet and try again. 🔄';
      this.chatHistory.push({
        role: 'ai',
        text: errorMsg,
        time: now
      });
      return errorMsg;
    }
  }

  clearChat(): void {
    this.chatHistory = [];
  }
}
