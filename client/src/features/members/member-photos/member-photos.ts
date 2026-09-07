import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../../../types/photo';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { Member } from '../../../types/member';
import { StarButton } from "../../../shared/star-button/star-button";
import { DeleteButton } from "../../../shared/delete-button/delete-button";

@Component({
  imports: [ImageUpload, StarButton, DeleteButton],
  selector: 'app-member-photos',
  styleUrl: './member-photos.css',
  templateUrl: './member-photos.html',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  constructor() {}
  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe((photos) => {
        this.photos.set(photos);
      });
    }
  }
  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
      },
      error: error => {
        console.log('Error uploading photo:', error);
        this.loading.set(false);
      }
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) {
          this.accountService.setCurrentUser({
            ...currentUser,
            imageUrl: photo.url
          });
        }
        this.memberService.member.update(member => ({
          ...member,
          imageUrl: photo.url
        }) as Member)
      }
    })
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(p => p.id !== photoId));
      },
      error: error => {
        console.error('Error deleting photo:', error);
      }
    })
  }
}
