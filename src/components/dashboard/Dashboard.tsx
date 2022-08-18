import { AppShell } from '@mantine/core'
import React, { useState } from 'react'
import DashboardNavbar from './DashboardNavbar'

const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<React.ReactElement>(<></>)

  return (
    <AppShell
      navbarOffsetBreakpoint='sm'
      navbar={<DashboardNavbar setContent={setDashboard} />}
    >
      {dashboard}
    </AppShell>
  )
}

export default Dashboard
