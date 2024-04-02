import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from 'src/user/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 현재 실행 컨텍스트에서  필요한 역할을 가져옴
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 적용된 Role Guard가 없을 경우 true return(접근 허용)
    if (!requiredRoles) {
      return true;
    }

    // 사용자가 없을 경우 false return(접근 거부)
    const { user } = context.switchToHttp().getRequest();

    const userId = user.sub;
    if (!userId) {
      return false;
    }

    const currentUser = await this.userService.findUserById(userId);

    // 사용자가 필요한 역할 중 하나를 가지고 있는지 확인
    return requiredRoles.some((role) => role == currentUser.role);
  }
}
