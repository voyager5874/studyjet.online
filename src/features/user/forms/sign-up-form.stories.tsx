import type { Meta, StoryObj } from '@storybook/react'

import { withRouter } from 'storybook-addon-react-router-v6'

import { SignUpForm } from './sign-up-form'

const meta = {
  component: SignUpForm,
  tags: ['autodocs'],
  title: 'App/SignUpForm',
  args: {
    onSubmit: values => {
      alert(JSON.stringify(values))
    },
  },
} satisfies Meta<typeof SignUpForm>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {},
  decorators: [
    withRouter,
    Story => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          outline: '1px solid grey',
          padding: '20px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}
