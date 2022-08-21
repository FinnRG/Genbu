import { upperFirst } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import {
  TextInput,
  PasswordInput,
  Group,
  Button,
  Divider,
  Anchor,
  Stack,
  Alert
} from '@mantine/core'
import React, { useState } from 'react'
import supabase from '../../clients/supabase'
import { IconAlertCircle } from '@tabler/icons'
import { User } from '@supabase/supabase-js'
import { Navigate } from 'react-router-dom'

interface AuthDialogProps {
  toggleTitle: (value?: React.SetStateAction<string> | undefined) => void
  title: string
}

interface FormValues {
  name: string
  email: string
  password: string
}

const AuthDialog: React.FC<AuthDialogProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      name: '',
      password: ''
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string) => (val.length <= 6 ? 'Password should include at least 6 characters' : null)
    }
  })

  const validateAuthSuccess = (user: User | null): void => {
    if (user === null) {
      setError(true)
    }
    setSuccess(true)
  }

  const onSubmit = ({ email, name, password }: FormValues): void => {
    setLoading(true)
    setError(false)
    let promise
    if (props.title === 'register') {
      promise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_name: name
          }
        }
      })
    } else {
      promise = supabase.auth.signInWithPassword({
        email,
        password
      })
    }
    promise
      .then((res) => validateAuthSuccess(res.data.user))
      .catch(() => setError(true))
  }

  if (success) {
    return <Navigate to='/app/dashboard' />
  }

  return (
    <>
      <Group grow mb='md' mt='md'>
        {/* <GoogleButton radius="xl">Google</GoogleButton> */}
        {/* <TwitterButton radius="xl">Twitter</TwitterButton> */}
      </Group>

      <Divider label='Or continue with email' labelPosition='center' my='lg' />

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title='Error' color='red'>
              An error occured. Please check if you have an active internet connection and try again in a few minutes.
            </Alert>
          )}
          {props.title === 'register' && (
            <TextInput
              label='Name'
              placeholder='Your name'
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
            />
          )}

          <TextInput
            required
            label='Email'
            placeholder='genbu@example.com'
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
          />

          <PasswordInput
            required
            label='Password'
            placeholder='Your password'
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
          />

        </Stack>

        <Group position='apart' mt='xl'>
          <Anchor
            component='button'
            type='button'
            color='dimmed'
            onClick={() => props.toggleTitle()}
            size='xs'
          >
            {props.title === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type='submit' loading={loading}>{upperFirst(props.title)}</Button>
        </Group>
      </form>
    </>
  )
}

export default AuthDialog
