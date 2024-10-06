import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    //nest
    ConfigModule.forRoot(),

    //terceros
    MongooseModule.forRoot(process.env.MONGO_URI),
    

    //mi código
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
