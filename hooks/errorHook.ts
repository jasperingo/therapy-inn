import { useTranslation } from "react-i18next"

export const useErrorMessage = () => {
  
  const { t } = useTranslation();

  return (errorCode: string)=> {
    switch(errorCode) {
      case 'auth/invalid-phone-number':
        return t('_phone_number_invalid');

      default:
        return t('_unknown_error_occured');
    }
  }
}
