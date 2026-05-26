'use client'

import ActionLink from '@/components/shared/ActionLink'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTranslation from '@/utils/hooks/useTranslation'
import type { OnOauthSignIn } from './OauthSignIn'
import OauthSignIn from './OauthSignIn'
import type { OnSignIn } from './SignInForm'
import SignInForm from './SignInForm'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    onSignIn?: OnSignIn
    onOauthSignIn?: OnOauthSignIn
}

const SignIn = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    onSignIn,
    onOauthSignIn,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const t = useTranslation('auth')

    return (
        <>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2">
                        <ActionLink
                            href={forgetPasswordUrl}
                            className="font-semibold heading-text mt-2 underline"
                            themeColor={false}
                        >
                            {t('forgotPassword')}
                        </ActionLink>
                    </div>
                }
                onSignIn={onSignIn}
            />

            {onOauthSignIn && (
                <div className="mt-4">
                    <OauthSignIn
                        onOauthSignIn={onOauthSignIn}
                        setMessage={setMessage}
                    />
                </div>
            )}

            <div>
                <div className="mt-6 text-center">
                    <span>{t('dontHaveAccount')} </span>
                    <ActionLink
                        href={signUpUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        {t('signUp')}
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

export default SignIn
