import { Module } from '@nestjs/common';
import { VictimModule } from './victim/victim.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from './files/files.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database : process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, // Sincroniza la base de datos con cualquier cambio, si elimino columnas, creo, etc (En produccion esto no se utiliza tanto).
      
    }),
    VictimModule,
    FilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
