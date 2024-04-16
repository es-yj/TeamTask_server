import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Role } from '../enum/roles.enum';

@Injectable()
export class RoleTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.role === '팀장') {
      value.role = Role.TM;
    } else if (value.role === '실장') {
      value.role = Role.VM;
    } else if (value.role === '관리자') {
      value.role = Role.Admin;
    } else if (value.role === 'Jr.PM') {
      value.role = Role.JrPM;
    } else if (value.role === 'Sr.PM') {
      value.role = Role.SrPM;
    }

    if (!(value.role in Role)) {
      throw new BadRequestException(
        `${value.role}은 유효한 직책 값이 아닙니다.`,
      );
    }
    return value;
  }
}
