import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseProvider } from './provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConnection } from '../db';

@Module({})
export class DatabaseModule {
  static forRoot(options: { isGlobal?: boolean } = {}): DynamicModule {
    const providers = [
      {
        provide: DatabaseProvider,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          const connectionString =
            configService.getOrThrow<string>('DATABASE_URL');
          return getDatabaseConnection(connectionString);
        },
      },
    ];

    return {
      module: DatabaseModule,
      global: options.isGlobal ?? false,
      imports: [ConfigModule], // Ensure ConfigService is available
      providers,
      exports: [DatabaseProvider],
    };
  }
}
