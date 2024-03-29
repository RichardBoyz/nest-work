import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  });

  // Session
  // app.use(
  //   session({
  //     secret: 'RichardBoyz', // TODO: get from env vars
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: { maxAge: 3600000 },
  //   }),
  // );

  // app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
