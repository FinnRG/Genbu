import React, { useEffect, useState } from 'react'
import { Navbar, Tooltip, UnstyledButton, createStyles, Stack, Indicator } from '@mantine/core'
import {
  TablerIcon,
  IconLogout,
  IconSwitchHorizontal,
  IconNotebook,
  IconUsers,
  IconMail
} from '@tabler/icons'
import TeamOverview from './overviews/TeamOverview'
import supabase from '../../clients/supabase'
import { useNavigate } from 'react-router-dom'
import NotebookOverview from './overviews/NotebookOverview'
import InviteOverview from './overviews/InviteOverview'

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0]
    }
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color
    }
  }
}))

interface NavbarLinkProps {
  icon: TablerIcon
  label: string
  active?: boolean
  onClick?: () => void
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ icon: Icon, label, active, onClick }) => {
  const { classes, cx } = useStyles()
  return (
    <Tooltip label={label} position='right' transitionDuration={0}>
      <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  )
}

const mockdata = [
  { icon: IconNotebook, label: 'Notebooks', component: <NotebookOverview /> },
  { icon: IconUsers, label: 'Teams', component: <TeamOverview /> },
  { icon: IconMail, label: 'Invites', component: <InviteOverview /> }
]

/**
const otherData = [
  { icon: IconUser, label: 'Account' },
  { icon: IconGauge, label: 'Dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconCalendarStats, label: 'Releases' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' }
] */

interface DashboardNavbarProps {
  setContent: React.Dispatch<React.SetStateAction<React.ReactElement>>
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ setContent }) => {
  const [active, setActive] = useState(0)
  const [inviteCount, setInviteCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInvites = async (): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user === null) {
        return
      }

      const { count } = await supabase.from('team_invite')
        .select('invitee_id', { count: 'exact' })
        .eq('invitee_id', user.id)
      setInviteCount(count ?? 0)
    }

    supabase.channel('public:team_invite')
      .on(
        'postgres_changes', { event: '*', schema: 'public', table: 'team_invite' },
        () => {
          fetchInvites()
        })
      .subscribe()

    fetchInvites()
  }, [])

  const links = mockdata.map((link, index) => (
    <Indicator
      disabled={link.label !== 'Invites' || inviteCount === 0}
      label={inviteCount}
      size={16}
      key={link.label}
    >
      <NavbarLink
        {...link}
        active={index === active}
        onClick={() => {
          setActive(index)
          setContent(mockdata[index].component)
        }}
      />
    </Indicator>
  ))

  const handleLogOut = (): void => {
    supabase.auth.signOut()
      .then(() => navigate('/'))
      .catch((err) => console.log(err))
  }

  return (
    <>
      <Navbar width={{ base: 80 }} p='md'>
        <Navbar.Section grow>
          <Stack justify='center' spacing={0}>
            {links}
          </Stack>
        </Navbar.Section>
        <Navbar.Section>
          <Stack justify='center' spacing={0}>
            <NavbarLink icon={IconSwitchHorizontal} label='Change account' />
            <NavbarLink onClick={handleLogOut} icon={IconLogout} label='Logout' />
          </Stack>
        </Navbar.Section>
      </Navbar>
    </>
  )
}

export default DashboardNavbar
