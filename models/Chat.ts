
export default interface Chat {
  id?: string;
  date: number;
  message: string;
  recipientId: string;
  recipientPhotoURL: string;
  recipientDisplayName: string;
}
