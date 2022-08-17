import { Button, Modal, PasswordInput, Stack, TextInput, useMantineTheme } from '@mantine/core'
import { useToggle } from '@mantine/hooks'
import { useState } from 'react'
import AuthDialog from './AuthDialog'

interface AuthButtonProps {
  style: string
}

const AuthButton: React.FC<AuthButtonProps> = (props) => {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState<boolean>(false)
  const [title, toggle] = useToggle(['login', 'register'])

  return (
    <>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Welcome to Mantine, ${title} with`}
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <AuthDialog toggleTitle={toggle} title={title} />
      </Modal>

      <Button radius='xl' size='md' className={props.style} onClick={() => setOpened(true)}>
        Log in
      </Button>
    </>
  )
}

export default AuthButton
