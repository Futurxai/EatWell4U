import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { GeminiService, ChatMessage } from '../../services/gemini';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  @ViewChild('chatContent') chatContent!: IonContent;

  userInput = '';
  isTyping = false;
  username = 'User';
  messages: ChatMessage[] = [];

  constructor(
    private gemini: GeminiService,
    private state: StateService
  ) {
    this.username = this.state.getState().username || 'User';
    this.messages = this.gemini.getChatHistory();
  }

  async send() {
    const text = this.userInput.trim();
    if (!text || this.isTyping) return;

    this.userInput = '';
    this.isTyping = true;
    this.scrollToBottom();

    await this.gemini.sendMessage(text);
    this.messages = this.gemini.getChatHistory();

    this.isTyping = false;
    this.scrollToBottom();
  }

  sendQuick(text: string) {
    this.userInput = text;
    this.send();
  }

  clearChat() {
    this.gemini.clearChat();
    this.messages = [];
  }

  formatMessage(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.chatContent?.scrollToBottom(300);
    }, 100);
  }
}
