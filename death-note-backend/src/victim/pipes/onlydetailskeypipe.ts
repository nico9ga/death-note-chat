import { BadRequestException, PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class OnlyDetailsKeyPipe implements PipeTransform {
  transform(value: any) {
    const allowedKeys = ['details'];
    const invalidKeys = Object.keys(value).filter(key => !allowedKeys.includes(key));

    if (invalidKeys.length) {
      throw new BadRequestException(`Solo se permite enviar la propiedad: ${allowedKeys.join(', ')}`);
    }

    return value;
  }
}