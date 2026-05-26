'use client'

import type { CommonProps } from '@/@types/common'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

type ForgotPasswordFormSchema = {
    email: string
}

export type OnForgotPasswordSubmitPayload = {
    values: ForgotPasswordFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
    setEmailSent: (complete: boolean) => void
}

export type OnForgotPasswordSubmit = (
    payload: OnForgotPasswordSubmitPayload,
) => void

interface ForgotPasswordFormProps extends CommonProps {
    onForgotPasswordSubmit?: OnForgotPasswordSubmit
    emailSent: boolean
    setEmailSent: (compplete: boolean) => void
    setMessage: (message: string) => void
}

const validationSchema = z.object({
    email: z.string().email().min(5),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const {
        className,
        onForgotPasswordSubmit,
        setMessage,
        setEmailSent,
        emailSent,
        children,
    } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
        if (onForgotPasswordSubmit) {
            onForgotPasswordSubmit({
                values,
                setSubmitting,
                setMessage,
                setEmailSent,
            })
        }
    }

    return (
        <div className={className}>
            {!emailSent ? (
                <Form onSubmit={handleSubmit(onForgotPassword)}>
                    <FormItem
                        label="Email"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
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
                        {isSubmitting ? 'Submiting...' : 'Submit'}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ForgotPasswordForm
