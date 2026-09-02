import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Photo } from '../../../types/photo';
import { Observable } from 'rxjs';

@Component({
  imports: [AsyncPipe],
  selector: 'app-member-photos',
  styleUrl: './member-photos.css',
  templateUrl: './member-photos.html',
})
export class MemberPhotos {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected photos$?: Observable<Photo[]>;

  constructor() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.photos$ = this.memberService.getMemberPhotos(memberId);
    }
  }

  get photoMocks() {
    return Array.from({length: 20}, (_, i) => ({
      url: '/user.png'
    }))
  }
}
