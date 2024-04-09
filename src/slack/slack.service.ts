import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlackService {
  private slackClient: WebClient;
  private channel: string;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('SLACK_TOKEN');
    this.slackClient = new WebClient(token);
    this.channel = this.configService.get<string>('SLACK_CHANNEL');
  }

  async sendSlackMessage(message: string): Promise<void> {
    try {
      await this.slackClient.chat.postMessage({
        channel: this.channel,
        text: message,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
