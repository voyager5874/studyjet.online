import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { getFileUrl } from '@/utils'
import { useArgs } from '@storybook/preview-api'

import { ImageInput } from './image-input'

const meta = {
  title: 'Components/ImageInput',
  component: ImageInput,
  tags: ['autodocs'],
} satisfies Meta<typeof ImageInput>

export default meta

type Story = StoryObj<typeof meta>

const TemplateWithDebug: Story = {
  args: {
    emptyInputButtonText: 'Choose image',
    nonEmptyInputButtonText: 'Cancel choice',

    cropAspect: 500 / 200,
    onImageCropSave: () => {},
  },

  render: args => {
    const { onImageCropEdit, onImageCropSave, ...restArgs } = args
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [_, setArgs] = useArgs()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [crop, setCrop] = useState<File | null>(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [image, setImage] = useState<File | null>(null)
    const handleImageSelect = (file: File | null) => {
      setArgs({ ...args, currentImage: file })
      setImage(file)
    }

    const handleCancelSelect = () => {
      setArgs({ ...args, currentImage: null, imageCropSaved: false })
      setCrop(null)
      setImage(null)
    }

    const handleImageCropSave = (file: File | null) => {
      console.log('story -> handleImageCropSave ->', file)
      setCrop(file)

      if (!file) {
        setArgs({ ...args, imageCropSaved: false })

        return
      }
      setArgs({ ...args, imageCropSaved: true })
    }

    const cropDataUrl = getFileUrl(crop)
    const imageDataUrl = getFileUrl(image)

    return (
      <div style={{ width: '500px' }}>
        <ImageInput
          {...restArgs}
          onChange={handleImageSelect}
          onClear={handleCancelSelect}
          // onImageEdit={handleImageEdit}
          onImageCropSave={handleImageCropSave}
        />
        <div style={{ border: '1px solid white', padding: '10px', marginBlock: '10px' }}>
          <div>{`saved crop: ${crop}`}</div>
          <a href={cropDataUrl || '#'}>{`url: ${cropDataUrl}`}</a>
        </div>
        <div style={{ border: '1px solid white', padding: '10px' }}>
          <div>{`chosen image: ${image}`}</div>
          <a href={imageDataUrl || '#'}>{`url: ${imageDataUrl}`}</a>
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
    onImageCropSave: () => {},
  },

  render: args => {
    const { onImageCropEdit, onImageCropSave, ...restArgs } = args
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [_, setArgs] = useArgs()
    const handleImageSelect = (file: File | null) => {
      setArgs({ ...args, currentImage: file })
    }

    const handleCancelSelect = () => {
      setArgs({ ...args, currentImage: null, imageCropSaved: false })
    }

    const handleImageCropSave = (file: File | null) => {
      console.log('story -> handleImageCropSave ->', file)

      if (!file) {
        setArgs({ ...args, imageCropSaved: false })

        return
      }
      setArgs({ ...args, imageCropSaved: true })
    }

    return (
      <div style={{ width: '500px' }}>
        <ImageInput
          {...restArgs}
          onChange={handleImageSelect}
          onClear={handleCancelSelect}
          onImageCropSave={handleImageCropSave}
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
