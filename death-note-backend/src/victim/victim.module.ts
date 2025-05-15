import { Module } from '@nestjs/common';
import { VictimService } from './victim.service';
import { VictimController } from './victim.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Victim } from './entities/victim.entity';
import { VictimImage } from './entities/victim-image.entity';

@Module({
  controllers: [VictimController],
  providers: [VictimService],
  imports: [
    TypeOrmModule.forFeature([Victim, VictimImage]),
  ]
})
export class VictimModule {}
