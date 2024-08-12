import { ConfigService } from '@nestjs/config';

function getFullVarName(name: string, prefix: string) {
  return `POSTGRES_${prefix + name}`;
}

export function createDatabase(configService: ConfigService) {
  const prefix = configService.get('NODE_ENV') === 'test' ? 'TEST_' : '';

  return {
    host: configService.get<string>(getFullVarName('HOST', prefix)),
    port: configService.get<number>(getFullVarName('PORT', prefix)),
    user: configService.get<string>(getFullVarName('USER', prefix)),
    password: configService.get<string>(getFullVarName('PASSWORD', prefix)),
    database: configService.get<string>(getFullVarName('DB', prefix)),
  };
}
