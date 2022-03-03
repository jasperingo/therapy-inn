import { useTranslation } from "react-i18next"

export const useErrorMessage = () => {
  
  const { t } = useTranslation();

  return (errorCode: string)=> {
    console.log(errorCode)
    switch(errorCode) {
      case 'auth/invalid-phone-number':
        return t('_phone_number_invalid');

      case 'auth/code-expired':
        return t('Verification_code_has_expired');

      case 'photo_permission_denied':
        return t('_photo_permission_not_granted');

      default:
        return t('_unknown_error_occured');
    }
  }
}
