import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @EventPattern('user_created')
  async handleUserCreated(data: Record<string, unknown>) {
    if (typeof data.email === 'string') {
      return await this.notificationsService.sendWelcomeEmail(data.email);
    }
  }
}
