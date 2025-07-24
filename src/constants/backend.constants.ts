import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export namespace BackendConstants {
  export namespace AuthConstants {
    export const BCRYPT_SALT_ROUNDS: number = 10;
  }

  export namespace DatabaseConstants {
    export const MONGODB_URI: string = 'MONGODB_URI';
  }

  export namespace UserConstants {
    export const USERFIELDS = {
      USERNAME: 'userName',
      FIRSTNAME: 'firstName',
      LASTNAME: 'lastName',
      PASSWORD: 'password',
    } as const;
  }

  export namespace ContactConstants {
    export const CONTACT_FIELDS = {
      USER_NAME: 'userName',
      CONTACT_NAME: 'contactName',
    } as const;
  }

  export namespace MessageConstants {
    export const MESSAGE_RESPONSE_FIELDS = {
      SENDER: 'sender',
      CONTENT: 'content',
      CHAT_ID: 'chatId',
    } as const;

    export const EXPIRES_IN: number = 12 * 60 * 60;
  }

  export namespace MicroServices {
    export const OPTIONS = {
      host: '0.0.0.0',
      port: 8877,
    };

    export const KAFKA_OPTIONS: MicroserviceOptions = {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
      },
    };
  }
}
