import type { Meta, StoryObj } from '@storybook/react'

import { SignInForm } from './sign-in-form'

const meta = {
  component: SignInForm,
  tags: ['autodocs'],
  title: 'App/SignInForm',
  args: {
    onSubmit: values => {
      alert(JSON.stringify(values))
    },
  },
} satisfies Meta<typeof SignInForm>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {},
  decorators: [
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
