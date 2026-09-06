import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { EditableMember } from '../../../types/editableMember';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';

@Component({
  imports: [DatePipe, FormsModule],
  selector: 'app-member-profile',
  styleUrl: './member-profile.css',
  templateUrl: './member-profile.html',
})
export class MemberProfile implements OnInit, OnDestroy {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private toast = inject(ToastService);
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  };


  ngOnInit(): void {

      this.editableMember = {
        displayName: this.memberService.member()?.displayName || '',
        description: this.memberService.member()?.description,
        city: this.memberService.member()?.city || '',
        country: this.memberService.member()?.country || ''
      }
  }

  updateProfile() {
    if (!this.memberService.member()) return;

    const updatedMember = {...this.memberService.member(), ...this.editableMember}
    this.memberService.updateMember(updatedMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser && currentUser.displayName !== updatedMember.displayName) {
          this.accountService.setCurrentUser({
            ...currentUser,
            displayName: updatedMember.displayName
          });
        }
        this.toast.success('Profile updated successfully.');
        this.memberService.member.set(updatedMember as Member);
        this.memberService.editMode.set(false);
        this.editForm?.reset(this.editableMember);
      }
    })
}

    ngOnDestroy(): void {
      if (this.memberService.editMode()) {
        this.memberService.editMode.set(false);
      }
  }
}
