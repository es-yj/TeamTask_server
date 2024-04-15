import { Controller, Sse, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private sseService: SseService) {}

  @Sse('notifications')
  sseNotifications(@Query('tmId') tmId: string): Observable<MessageEvent> {
    const subject = this.sseService.getSubjectForTmId(tmId);
    return subject.asObservable();
  }
}
