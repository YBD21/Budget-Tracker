import ReCAPTCHA from 'react-google-recaptcha'
import { RECAPTCHA_KEY } from '@/constants/hashKey'
import { useTheme } from 'next-themes'

const Recaptcha = ({ onChange }) => {
  const { resolvedTheme } = useTheme()

  return resolvedTheme !== '' ? (
    <ReCAPTCHA
      sitekey={RECAPTCHA_KEY}
      size="normal"
      badge="inline"
      // theme={resolvedTheme}
      onChange={onChange}
    />
  ) : null
}

export default Recaptcha
