import { useTranslation } from "react-i18next"
import ERRORS from "../assets/values/errors";

export const useErrorMessage = () => {
  
  const { t } = useTranslation();

  return (errorCode: string)=> {
    
    switch(errorCode) {
      case 'auth/invalid-phone-number':
        return t('_phone_number_invalid');

      case 'auth/code-expired':
        return t('Verification_code_has_expired');

      case 'photo_permission_denied':
        return t('_photo_permission_not_granted');

      case ERRORS.noInternetConnection:
        return t('No_network_connection');

      default:
        return t('_unknown_error_occured');
    }
  }
}
