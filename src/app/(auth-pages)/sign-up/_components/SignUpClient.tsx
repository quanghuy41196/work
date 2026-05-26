'use client'

import type { OnSignUpPayload } from '@/components/auth/SignUp'
import SignUp from '@/components/auth/SignUp'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { apiSignUp } from '@/services/AuthService'
import { useRouter } from 'next/navigation'

const SignUpClient = () => {
    const router = useRouter()

    const handlSignUp = async ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignUpPayload) => {
        try {
            setSubmitting(true)
            await apiSignUp(values)
            toast.push(
                <Notification title="Account created!" type="success">
                    You can now sign in from our sign in page
                </Notification>,
            )
            router.push('/sign-in')
        } catch (error) {
            setMessage(error as string)
        } finally {
            setSubmitting(false)
        }
    }

    return <SignUp onSignUp={handlSignUp} />
}

export default SignUpClient
