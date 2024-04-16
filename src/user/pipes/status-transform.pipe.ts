import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { UserStatus } from '../enum/status.enum';

@Injectable()
export class StatusTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.status === '승인') {
      value.status = UserStatus.Active;
    } else if (value.status === '거절') {
      value.status = UserStatus.Rejected;
    }

    if (!(value.status in UserStatus)) {
      throw new BadRequestException(
        `${value.status}은 유효한 상태 값이 아닙니다.`,
      );
    }
    return value;
  }
}
