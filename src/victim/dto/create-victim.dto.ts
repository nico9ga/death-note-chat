import { IsArray, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateVictimDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(2 /*,{message: 'El campo debe tener al menos 5 caracteres.'}*/)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2 /*,{message: 'El campo debe tener al menos 5 caracteres.'}*/)
    lastName: string;

    @IsString()
    @IsOptional()
    deathType?:string;

    @IsString({each:true})
    @IsOptional()
    @IsArray()
    images?:string[];
}
