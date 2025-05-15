import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";



export class PaginationDto{

    @ApiProperty({
        default: 10, description: 'How many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    @Type(()=> Number) //Convierte los datos que vienen de la url del offset en numero para que la funcion los valga, porque no los leía
    limit?: number = 10;



    @ApiProperty({
        default: 0, description: 'How many rows do you want to skip'
    })
    @IsOptional()
    @Min(0)
    @Type(()=> Number) //Convierte los datos que vienen de la url del offset en numero para que la funcion los valga, porque no los leía
    offset?: number = 0;

}