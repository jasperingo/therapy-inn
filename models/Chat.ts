
export default interface Chat {
  id?: string;
  date: number;
  read: boolean;
  message: string;
  recipientId: string;
  recipientPhotoURL: string;
  recipientPhoneNumber: string;
  recipientDisplayName: string;
}
