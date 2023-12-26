import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useState } from 'react'

import { getFileFromUrl } from '@/utils'
import { useArgs } from '@storybook/preview-api'

import { ImageInput } from './image-input'

const meta = {
  title: 'Components/ImageInputHookForm',
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
    const [_, setArgs] = useArgs()
    const [crop, setCrop] = useState<null | string>(null)
    const [image, setImage] = useState<null | string>(null)

    const [cropFile, setCropFile] = useState<File | null>(null)
    const [originalFile, setOriginalFile] = useState<File | null>(null)
    const handleImageSelect = (file: null | string) => {
      setArgs({ ...args, currentImageUrl: file })
      setImage(file)
    }

    const handleCancelSelect = () => {
      setArgs({ ...args, currentImageUrl: null, imageCropSaved: false })
      setCrop(null)
      setImage(null)
    }

    const handleImageCropSave = (file: null | string) => {
      console.log('story -> handleImageCropSave ->', file)
      setCrop(file)

      if (!file) {
        setArgs({ ...args, imageCropSaved: false })

        return
      }
      setArgs({ ...args, imageCropSaved: true })
    }

    useEffect(() => {
      const getCropFileObjects = async () => {
        let cropFileObject = null

        if (crop) {
          cropFileObject = await getFileFromUrl(crop)
        }

        setCropFile(cropFileObject)
      }

      getCropFileObjects()
    }, [crop])

    useEffect(() => {
      const getOriginalFileObjects = async () => {
        let originalImageFileObject = null

        if (image) {
          originalImageFileObject = await getFileFromUrl(image)
        }
        setOriginalFile(originalImageFileObject)
      }

      getOriginalFileObjects()
    }, [image])

    return (
      <div style={{ width: '500px' }}>
        <ImageInput
          {...restArgs}
          onChange={handleImageSelect}
          onClear={handleCancelSelect}
          onImageCropSave={handleImageCropSave}
        />
        <div style={{ border: '1px solid white', padding: '10px', marginBlock: '10px' }}>
          <div>{`saved crop: ${cropFile}`}</div>
          <a href={crop || '#'}>{crop ? 'crop base64 data url' : 'no data url'}</a>
        </div>
        <div style={{ border: '1px solid white', padding: '10px' }}>
          <div>{`chosen image: ${originalFile}`}</div>
          <a href={image || '#'}>{image ? 'original image base64 data url' : 'no data url'}</a>
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
    const handleImageSelect = (file: null | string) => {
      setArgs({ ...args, currentImageUrl: file })
    }

    const handleCancelSelect = () => {
      setArgs({ ...args, currentImageUrl: null, imageCropSaved: false })
    }

    const handleImageCropSave = (file: null | string) => {
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
