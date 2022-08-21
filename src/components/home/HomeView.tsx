import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon
} from '@mantine/core'
import { IconCheck } from '@tabler/icons'
import React from 'react'
import AuthButton from './AuthButton'
import image from './image.svg'

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0
    }
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily ?? ''}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28
    }
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1
    }
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none'
    }
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: '4px 12px'
  }
}))

const HomeView: React.FC = () => {
  const { classes } = useStyles()
  return (
    <Container>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A <span className={classes.highlight}>better</span> way to <br /> take and share notes
          </Title>
          <Text color='dimmed' mt='md'>
            Use highly collaborative notebooks to increase your team's efficiency and productivity
            while keeping everyone's thoughts organized.
          </Text>

          <List
            mt={30}
            spacing='sm'
            size='sm'
            icon={
              <ThemeIcon size={20} radius='xl'>
                <IconCheck size={12} stroke={1.5} />
              </ThemeIcon>
              }
          >
            <List.Item>
              <b>Collaborative</b> – share your ideas and thoughts with your team
            </List.Item>
            <List.Item>
              <b>Privacy</b> – none of the user data will be shared in any form
            </List.Item>
            <List.Item>
              <b>Free and open source</b> – anyone can view the source code and deploy
              their own Genbu instance
            </List.Item>

          </List>

          <Group mt={30}>
            <AuthButton style={classes.control} />
            <a href='https://github.com/FinnRG/genbu'>
              <Button variant='default' radius='xl' size='md' className={classes.control}>
                Source code
              </Button>
            </a>
          </Group>
        </div>
        <Image src={image} className={classes.image} />
      </div>
    </Container>
  )
}

export default HomeView
