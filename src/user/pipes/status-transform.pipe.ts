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
    // 한글 상태 값을 UserStatus의 값으로 매핑
    const statusMap = {
      승인: UserStatus.Active,
      거절: UserStatus.Rejected,
      재직중: UserStatus.Active,
      휴직: UserStatus.OnLeave,
      퇴사: UserStatus.Resigned,
    };

    // 매핑된 값 확인
    if (value.status && statusMap[value.status]) {
      value.status = statusMap[value.status];
    } else if (value.status) {
      throw new BadRequestException(
        `${value.status}은 유효한 상태 값이 아닙니다.`,
      );
    }

    return value;
  }
}
