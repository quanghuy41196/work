'use client'

import type { CommonProps } from '@/@types/common'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import useTranslation from '@/utils/hooks/useTranslation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { z } from 'zod'
type SignUpFormSchema = {
    firstName: string
    lastName: string
    email: string
    phone: string
    referralCode?: string
}

export type OnSignUpPayload = {
    values: SignUpFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
}

export type OnSignUp = (payload: OnSignUpPayload) => void

interface SignUpFormProps extends CommonProps {
    setMessage: (message: string) => void
    onSignUp?: OnSignUp
}

const validationSchema = z.object({
    firstName: z.string().min(1, 'Vui lòng nhập họ & tên đệm'),
    lastName: z.string().min(1, 'Vui lòng nhập tên khách hàng'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().min(6, 'Số điện thoại không hợp lệ'),
    referralCode: z.string().optional(),
})

const SignUpForm = (props: SignUpFormProps) => {
    const { onSignUp, className, setMessage } = props
    const t = useTranslation()
    const [isSubmitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const handleSignUp = (values: SignUpFormSchema) => {
        onSignUp?.({ values, setSubmitting, setMessage })
    }

    return (
        <div className={className}>
            <Form
                onSubmit={handleSubmit(handleSignUp)}
                containerClassName="grid grid-cols-1 md:grid-cols-2 gap-4 [&>div]:mb-0"
            >
                <FormItem
                    label={t('auth.firstName')}
                    invalid={!!errors.firstName}
                    errorMessage={errors.firstName?.message}
                >
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('auth.enterFirstName')}
                                {...field}
                                className="border border-gray-200"
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={t('auth.lastName')}
                    invalid={!!errors.lastName}
                    errorMessage={errors.lastName?.message}
                >
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('auth.enterLastName')}
                                {...field}
                                className="border border-gray-200"
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    className="col-span-2"
                    label={t('auth.email')}
                    invalid={!!errors.email}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('auth.enterEmail')}
                                type="email"
                                {...field}
                                className="border border-gray-200"
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={t('auth.phone')}
                    invalid={!!errors.phone}
                    errorMessage={errors.phone?.message}
                    className="col-span-1"
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <PhoneInput
                                {...field}
                                defaultCountry="vn"
                                disableDialCodeAndPrefix
                                className="flex [&_input]:flex-1 [&>div>button]:w-[50px]"
                                style={
                                    {
                                        '--react-international-phone-height':
                                            '48px',
                                    } as React.CSSProperties
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={t('auth.referralCode')}
                    invalid={!!errors.referralCode}
                    errorMessage={errors.referralCode?.message}
                >
                    <Controller
                        name="referralCode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('auth.enterReferralCode')}
                                {...field}
                                className="border border-gray-200"
                            />
                        )}
                    />
                </FormItem>

                <div className="col-span-2">
                    <Button
                        block
                        type="submit"
                        variant="solid"
                        loading={isSubmitting}
                    >
                        {isSubmitting
                            ? t('auth.signingUp')
                            : t('auth.signUpButton')}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default SignUpForm
