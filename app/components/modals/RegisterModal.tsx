'use client'

import axios from 'axios';
import { AiFillApple, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import { FieldValues,SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModal from '@/app/hooks/userRegisterModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import useLoginModal from '@/app/hooks/useLoginModal';
import { signIn } from 'next-auth/react';

const RegisterModal = () => {
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/register', data)
            .then(() => {
                registerModal.onClose()
                loginModal.onOpen()
                toast.success("Aww yeah! You are now registered!")
            })
            .catch((error) => {
                toast.error('Something went wrong.')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    function handleHaveAccount() {
        registerModal.onClose()
        loginModal.onOpen()
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title='Welcome to HeirBnB!' subtitle='Create an account, my lord.' />
            <Input id='email' label='Email' disabled={isLoading} register={register} errors={errors} />
            <Input id='name' label='Name' disabled={isLoading} register={register} errors={errors} />
            <Input id='password' label='Password' type='password' disabled={isLoading} register={register} errors={errors} />
            <Input id='password' label='Confirm Password' type='password' disabled={isLoading} register={register} errors={errors} />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            {/* <Button outline label="Sign up with Apple" icon={AiFillApple} onClick={() => {}} /> */}
            <Button outline label="Login with Google" icon={FcGoogle} onClick={() => signIn('google')} />
            <Button outline label="Login with GitHub" icon={AiFillGithub} onClick={() => signIn('github')} />
            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    <div>Already have an account?</div>
                    <div onClick={handleHaveAccount} className='text-neutral-800 cursor-pointer hover:underline'>Login</div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal 
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register" 
            actionLabel="Continue" 
            onClose={registerModal.onClose} 
            onSubmit={handleSubmit(onSubmit)} 
            body={bodyContent} 
            footer={footerContent} />
    )
}

export default RegisterModal