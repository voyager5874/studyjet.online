import type { Meta, StoryObj } from '@storybook/react'

import { useForm } from 'react-hook-form'

import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Typography } from '@/ui/typography'
import { useArgs } from '@storybook/preview-api'

import { Checkbox } from './checkbox'

/**
 * ## Checkbox based on radix-ui checkbox
 *  This component is based on radix-ui checkbox and render a button underneath,
 *  it does render an input when used within a form, but
 *  a ref given to the component 'root' goes to the button anyway,
 *  so react-hook-form can't track the value without the component to be 'controlled'
 */

const meta = {
  component: Checkbox,
  tags: ['autodocs'],
  title: 'Components/CheckboxRadix',
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    checked: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {}

const Template: Story = {
  render: args => <Checkbox {...args} />,
}

export const WithText: Story = {
  ...Template,
  decorators: [
    Story => (
      <Card>
        <Story />
      </Card>
    ),
  ],
  args: {
    label: 'Accept terms and conditions',
  },
}

export const OnChangeTest: Story = {
  render: function Render(args) {
    const { onChange, ...rest } = args

    const handleOnChange = (data: unknown) => {
      console.log(data)
    }

    return <Checkbox {...rest} onChange={handleOnChange} />
  },
}

export const WithinForm: Story = {
  args: {},
  render: function Render(args) {
    const { onCheckedChange, checked, onChange, ...rest } = args

    const [_args, updateArgs] = useArgs()

    const { register, control, ...form } = useForm({
      defaultValues: {
        checkboxValue: '',
      },
    })

    const makeSubmit = (data: any) => {
      console.log({ submitData: data })
      console.log('submitted data type: ', typeof data?.checkboxValue, { data })
      updateArgs({ checked: data?.checkboxValue })
    }

    const handleOnCheckedChange = (data: unknown) => {
      console.log(data)
    }

    return (
      <Card style={{ width: '400px' }}>
        <Typography variant={'h1'}>Form</Typography>
        <form
          className={'flex-column'}
          onSubmit={form.handleSubmit(makeSubmit)}
          style={{ gap: '20px' }}
        >
          <Checkbox
            {...rest}
            {...register('checkboxValue')}
            onCheckedChange={handleOnCheckedChange}
          />
          <Button type={'submit'}>submit</Button>
        </form>
      </Card>
    )
  },
}
