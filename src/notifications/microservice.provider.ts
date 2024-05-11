import { ClientsModule, Transport } from '@nestjs/microservices';

export const NOTIFICATIONS_SERVICE_TOKEN = Symbol('NOTIFICATIONS_SERVICE');

export const notificationsConfig = {
  transport: Transport.TCP,
  options: { port: 3001 },
} as const;

export const notificationsMicroserviceProvider = () =>
  ClientsModule.register([
    {
      name: NOTIFICATIONS_SERVICE_TOKEN,
      ...notificationsConfig,
    },
  ]);
