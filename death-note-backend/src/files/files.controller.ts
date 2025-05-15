import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService // Nos permite acceder a las variables de entorno
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string)
    {

      const path = this.filesService.getStaticProductImage(imageName);
      
      res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    // limits: { fileSize: 1000} /*para mirar más funciones de una propiedad o una funcion le damos a ctrl + space para ver más opciones limits{fileSize:(Ctrl + Space)}*/
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ){

    if(!file){
      throw new BadRequestException('Make sure that the file is an image ');
    }

    // const secureUrl = `${file.filename}`;

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return{secureUrl}; 
  }

}
