// import { PartialType } from '@nestjs/mapped-types';
// import { CreateVictimDto } from './create-victim.dto';
// export class UpdateVictimDto extends PartialType(CreateVictimDto) {}

import {IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateDetailsDto {
    @IsOptional()
    @IsString()
    details?:string;
}

