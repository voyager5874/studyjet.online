import type { Meta, StoryObj } from '@storybook/react'

import { useForm } from 'react-hook-form'

import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Typography } from '@/ui/typography'
import { faker } from '@faker-js/faker'
import { useArgs } from '@storybook/preview-api'

import { Select, SelectItem } from './select'

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    // value: {
    //   control: {
    //     type: 'radio',
    //     options: ['item1', 'item2', 'item3', 'item4'],
    //   },
    // },
  },
} satisfies Meta<typeof Select>

type Story = StoryObj<typeof meta>

export default meta

const selectItems = [
  { name: 'item 1', value: 'item1' },
  { name: 'item 2', value: 'item2' },
  { name: 'item 3', value: 'item3' },
]

export const Overview: Story = {
  render: args => {
    return (
      <Select defaultValue={'item1'} {...args}>
        {selectItems.map(item => (
          <SelectItem key={item.value} value={item.value}>
            {item.name}
          </SelectItem>
        ))}
      </Select>
    )
  },
}

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const Pagination: Story = {
  render: args => {
    return (
      <Select defaultValue={'2'} {...args} dense>
        {pages.map(page => (
          <SelectItem dense key={page} value={String(page)}>
            {page}
          </SelectItem>
        ))}
      </Select>
    )
  },
  args: {},
}

export const WithDisabledItems: Story = {
  render: args => {
    return (
      <Select {...args} placeholder={'Select an item'}>
        <SelectItem disabled value={'item1'}>
          item 1
        </SelectItem>
        <SelectItem value={'item2'}>item 2</SelectItem>
        <SelectItem value={'item3'}>item 3</SelectItem>
        <SelectItem disabled value={'item4'}>
          item 4
        </SelectItem>
      </Select>
    )
  },
}

const generateSelectItems = (count: number) => {
  const arr = []

  for (let i = 0; i < count; i++) {
    arr.push({
      name: `${faker.word.adjective()} ${faker.word.noun()}`,
      value: `${faker.word.adjective()} ${faker.word.noun()}`,
    })
  }

  return arr
}

const withFormSelectItem = generateSelectItems(5)

export const UncontrolledWithinForm: Story = {
  args: {
    value: 'item1',
  },
  render: function Render(args) {
    const { onValueChange, onChange, value, ...restArgs } = args

    const [_args, updateArgs] = useArgs()

    const { register, control, ...form } = useForm({
      defaultValues: {
        selectValue: '',
      },
    })
    const makeSubmit = (data: any) => {
      console.log({ submitData: data })
      // setSubmitted(data?.selectValue)
      updateArgs({ value: data?.selectValue })
      // onSubmit && onSubmit(data)
    }

    const handleValueChange = (value: any) => {
      console.log(value)
    }

    // DevTools conflicts with useArgs - the page hangs
    return (
      <div>
        {/*<DevTool control={control} />*/}
        <Card style={{ width: '400px' }}>
          <Typography variant={'h1'}>Form</Typography>
          <form
            className={'flex-column'}
            onSubmit={form.handleSubmit(makeSubmit)}
            style={{ gap: '20px' }}
          >
            <Select
              {...restArgs}
              placeholder={'Select an item'}
              {...register('selectValue')}
              onValueChange={handleValueChange}
            >
              {withFormSelectItem.map(item => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>
            <Button type={'submit'}>submit</Button>
          </form>
        </Card>
      </div>
    )
  },
}
