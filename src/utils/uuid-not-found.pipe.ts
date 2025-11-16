import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class UuidNotFoundPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string' && value.length <= 36) {
      if (!uuidValidate(value)) {
        throw new NotFoundException('Not found');
      }
    }
    return value;
  }
}
