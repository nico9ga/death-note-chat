// import { PartialType } from '@nestjs/mapped-types';
// import { CreateVictimDto } from './create-victim.dto';
// export class UpdateVictimDto extends PartialType(CreateVictimDto) {}

import {IsNotEmpty, IsString } from 'class-validator';

export class UpdateDeathTypeDto {
    @IsNotEmpty()
    @IsString()
    deathType:string;
}

