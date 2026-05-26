'use client'

import type { CommonProps } from '@/@types/common'
import OtpInput from '@/components/shared/OtpInput'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import sleep from '@/utils/sleep'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { ZodType } from 'zod'
import { z } from 'zod'

interface OtpVerificationFormProps extends CommonProps {
    setOtpVerified?: (message: string) => void
    setMessage?: (message: string) => void
}

type ForgotPasswordFormSchema = {
    otp: string
}

const OTP_LENGTH = 6

const validationSchema: ZodType<ForgotPasswordFormSchema> = z.object({
    otp: z.string().min(OTP_LENGTH, { message: 'Please enter a valid OTP' }),
})

const OtpVerificationForm = (props: OtpVerificationFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { className, setMessage, setOtpVerified } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onOtpSend = async (values: ForgotPasswordFormSchema) => {
        const { otp } = values
        setSubmitting(true)
        try {
            /** TODO: Replace with actual API call */
            // await verifyOtp(otp)
            await sleep(1000)
            setOtpVerified?.(`OTP ${otp} verified!`)
        } catch (errors) {
            setMessage?.(
                typeof errors === 'string' ? errors : 'Some error occurred!',
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onOtpSend)}>
                <FormItem
                    invalid={Boolean(errors.otp)}
                    errorMessage={errors.otp?.message}
                >
                    <Controller
                        name="otp"
                        control={control}
                        render={({ field }) => (
                            <OtpInput
                                placeholder=""
                                inputClass="h-[58px]"
                                length={OTP_LENGTH}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                </Button>
            </Form>
        </div>
    )
}

export default OtpVerificationForm
