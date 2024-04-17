import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Role } from '../enum/roles.enum';

@Injectable()
export class RoleTransformPipe implements PipeTransform {
  private readonly roleMap = {
    팀장: Role.TM,
    실장: Role.VM,
    관리자: Role.Admin,
    'Jr.PM': Role.JrPM,
    'Sr.PM': Role.SrPM,
  };

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.role && this.roleMap[value.role]) {
      value.role = this.roleMap[value.role];
    } else if (value.role && !(value.role in Role)) {
      throw new BadRequestException(
        `${value.role}은(는) 유효한 직책 값이 아닙니다.`,
      );
    }

    return value;
  }
}
