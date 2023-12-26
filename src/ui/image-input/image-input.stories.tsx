import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useState } from 'react'

import { getFileFromUrl } from '@/utils'
import { useArgs } from '@storybook/preview-api'

import { ImageInput } from './image-input'

const meta = {
  title: 'Components/ImageInput',
  component: ImageInput,
  argTypes: {
    value: {
      control: 'array',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageInput>

export default meta

type Story = StoryObj<typeof meta>

const TemplateWithDebug: Story = {
  args: {
    emptyInputButtonText: 'Choose image',
    nonEmptyInputButtonText: 'Cancel choice',
    value: ['', ''],
    cropAspect: 500 / 200,
  },

  render: args => {
    // if onSave and onClear not extracted and thrown away the component acts as if they were passed
    const { value, onSave, onClear, ...restArgs } = args
    const [_, setArgs] = useArgs()

    const [cropFile, setCropFile] = useState<File | null>(null)
    const [originalFile, setOriginalFile] = useState<File | null>(null)

    const cropImageDataUrl = value ? value[1] : ''
    const originalImageDataUrl = value ? value[0] : ''

    const handleImageSelect = (urls: readonly string[]) => {
      setArgs({ ...args, value: urls })
    }

    const handleCancelSelect = () => {
      setArgs({ ...args, value: ['', ''] })
    }

    useEffect(() => {
      const getCropFileObjects = async () => {
        let cropFileObject = null

        if (cropImageDataUrl) {
          cropFileObject = await getFileFromUrl(cropImageDataUrl)
        }

        setCropFile(cropFileObject)
      }

      getCropFileObjects()
    }, [cropImageDataUrl])

    useEffect(() => {
      const getOriginalFileObjects = async () => {
        let originalImageFileObject = null

        if (originalImageDataUrl) {
          originalImageFileObject = await getFileFromUrl(originalImageDataUrl)
        }
        setOriginalFile(originalImageFileObject)
      }

      getOriginalFileObjects()
    }, [originalImageDataUrl])

    return (
      <div style={{ width: '500px' }}>
        <ImageInput
          {...restArgs}
          onChange={handleImageSelect}
          onClear={handleCancelSelect}
          value={value}
        />
        <div style={{ border: '1px solid white', padding: '10px', marginBlock: '10px' }}>
          <div>{`saved crop: ${cropFile}`}</div>
          <a href={cropImageDataUrl || '#'}>
            {cropImageDataUrl ? 'crop base64 data url' : 'no data url'}
          </a>
        </div>
        <div style={{ border: '1px solid white', padding: '10px' }}>
          <div>{`chosen image: ${originalFile}`}</div>
          <a href={originalImageDataUrl || '#'}>
            {originalImageDataUrl ? 'original image base64 data url' : 'no data url'}
          </a>
        </div>
      </div>
    )
  },
}

const Template: Story = {
  args: {
    emptyInputButtonText: 'Choose image',
    nonEmptyInputButtonText: 'Cancel choice',
    cropAspect: 500 / 200,
    value: ['', ''],
  },

  render: args => {
    // if onSave and onClear not extracted and thrown away the component acts as if they were passed
    const { onClear, onSave, value, ...restArgs } = args
    const [_, setArgs] = useArgs()
    const handleImageSelect = (urls: readonly string[]) => {
      setArgs({ ...args, value: urls })
    }

    return (
      <div style={{ width: '500px' }}>
        <ImageInput {...restArgs} onChange={handleImageSelect} value={value} />
      </div>
    )
  },
}

const ManualCropSaveTemplate: Story = {
  args: {
    emptyInputButtonText: 'Choose image',
    nonEmptyInputButtonText: 'Cancel choice',
    cropAspect: 500 / 200,
    value: ['', ''],
  },

  render: args => {
    // if onSave and onClear not extracted and thrown away the component acts as if they were passed
    const { onClear, onSave, value, ...restArgs } = args
    const [_, setArgs] = useArgs()
    const handleImageSelect = (urls: readonly string[]) => {
      setArgs({ ...args, value: urls })
    }

    const handleCropSave = (urls: readonly string[]) => {
      console.log(urls)
      setArgs({ ...args, value: urls })
    }

    return (
      <div style={{ width: '500px' }}>
        <ImageInput
          {...restArgs}
          onChange={handleImageSelect}
          onSave={handleCropSave}
          value={value}
        />
      </div>
    )
  },
}

export const Overview: Story = {
  ...Template,
}

export const WithDebug: Story = {
  ...TemplateWithDebug,
}

export const Manual: Story = {
  ...ManualCropSaveTemplate,
}
