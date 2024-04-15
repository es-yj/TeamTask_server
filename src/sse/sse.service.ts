import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private teamManagerSubjects: Map<string, Subject<any>> = new Map();

  getSubjectForTmId(tmId: string): Subject<any> {
    let subject = this.teamManagerSubjects.get(tmId);
    console.log('1. ', tmId, subject);
    if (!subject) {
      subject = new Subject<any>();
      this.teamManagerSubjects.set(tmId, subject);
      console.log('not');
    }
    console.log('2. ', this.teamManagerSubjects);
    console.log('---------------------');

    return subject;
  }

  notifyTeamManagers(tmId: string, message: any) {
    const subject = this.getSubjectForTmId(tmId);

    if (subject) {
      console.log(subject);
      subject.next({ data: message });
    }
  }
}
