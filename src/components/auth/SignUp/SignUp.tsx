'use client'

import ActionLink from '@/components/shared/ActionLink'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTranslation from '@/utils/hooks/useTranslation'
import type { OnSignUp } from './SignUpForm'
import SignUpForm from './SignUpForm'

type SignUpProps = {
    signInUrl?: string
    onSignUp?: OnSignUp
}

export const SignUp = ({ onSignUp, signInUrl = '/sign-in' }: SignUpProps) => {
    const t = useTranslation('auth')
    const [message, setMessage] = useTimeOutMessage()

    return (
        <>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignUpForm onSignUp={onSignUp} setMessage={setMessage} />
            <div>
                <div className="mt-6 text-center">
                    <span>{t('alreadyHaveAccount')} </span>
                    <ActionLink
                        href={signInUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        {t('signIn')}
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

export default SignUp
