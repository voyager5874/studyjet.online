import type { Meta, StoryObj } from '@storybook/react'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { AspectRatio } from '@/ui/aspect-ratio'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Typography } from '@/ui/typography'
import { useArgs } from '@storybook/preview-api'
import { LucideImageOff, LucidePencil, LucideTrash, LucideUndo } from 'lucide-react'

import {
  ImageInfo,
  ImageInput,
  ImageInputClear,
  ImageInputDelete,
  ImageInputTrigger,
  ImageRotationControl,
} from './image-input-base'
import { ImageInputPlaceholder, ImageInputValuePreview } from './value-preview'

const meta = {
  title: 'Components/ImageInput',
  component: ImageInput,
  argTypes: {
    value: {
      control: 'string',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageInput>

export default meta

type Story = StoryObj<typeof meta>

const Template: Story = {
  args: {
    value: '',
    defaultValue: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
    sourceImage: '',
  },
  render: args => {
    const { sourceImage, defaultValue, value, onValueChange, ...restArgs } = args
    const [_, setArgs, _resetArgs] = useArgs()
    // const [src, setSrc] = useState('')

    console.log('story render', { value, defaultValue, sourceImage })
    const handleValueChange = (newValue: string) => {
      console.log('handleValueChange', { newValue })
      setArgs({ value: newValue })
      // setSrc(newValue)
    }

    const handleSourceChange = (source: string) => {
      console.log('handleSourceChange', { source })
      setArgs({ sourceImage: source })
    }

    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '100px',
          }}
        >
          <Card style={{ width: '500px' }}>
            <ImageInput
              {...restArgs}
              defaultValue={defaultValue}
              onSourceImageChange={handleSourceChange}
              onValueChange={handleValueChange}
              sourceImage={sourceImage || ''}
              value={value || ''}
            >
              <div
                style={{
                  position: 'relative',
                  marginBottom: '24px',
                }}
              >
                <ImageInputValuePreview cropShape={'round'} showGrid>
                  <ImageInputPlaceholder>
                    <LucideImageOff size={'30%'} />
                  </ImageInputPlaceholder>
                </ImageInputValuePreview>
                {value !== defaultValue && value !== IMAGE_WAS_ERASED && <ImageInfo />}
              </div>
              <ImageInputTrigger>
                <Button size={'dense'} variant={'secondary'}>
                  <LucidePencil />
                </Button>
              </ImageInputTrigger>
              <ImageInputClear>
                <Button size={'dense'} variant={'secondary'}>
                  <LucideUndo />
                </Button>
              </ImageInputClear>
              <ImageInputDelete>
                <Button size={'dense'} variant={'secondary'}>
                  <LucideTrash />
                </Button>
              </ImageInputDelete>
              <Typography as={'h3'} variant={'body2'}>
                rotation
              </Typography>
              <ImageRotationControl />
            </ImageInput>
          </Card>
          <Card>
            <Typography as={'h3'}>Result:</Typography>
            <div
              style={{
                position: 'relative',
                minHeight: '100px',
                width: '300px',
                marginBottom: '50px',
              }}
            >
              {value && value !== defaultValue && value !== IMAGE_WAS_ERASED && (
                <AspectRatio ratio={1} shape={'round'} src={value} />
              )}
              {value && defaultValue && value === defaultValue && (
                <AspectRatio ratio={1} src={defaultValue} />
              )}
              {value === IMAGE_WAS_ERASED && <LucideImageOff size={'30%'} />}
            </div>
            <textarea
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                height: '300px',
                resize: 'vertical',
                fontSize: '10px',
              }}
              value={value}
            />
          </Card>
        </div>
      </>
    )
  },
}

export const Overview: Story = {
  ...Template,
  args: {
    value: '',
    defaultValue: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
    sourceImage: '',
  },
}

export const Uncontrolled: Story = {
  args: {
    defaultValue: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
  },
  render: args => {
    const { sourceImage, defaultValue, value, onValueChange, ...restArgs } = args
    const [_, updateArgs] = useArgs()

    console.log('story render', { value, defaultValue, sourceImage })
    const handleValueChange = (newValue: string) => {
      console.log('handleValueChange', { newValue })
      updateArgs({ value: newValue })
    }

    const handleSourceChange = (source: string) => {
      console.log('handleSourceChange', { source })
    }

    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '100px',
          }}
        >
          <Card style={{ width: '500px' }}>
            <ImageInput
              {...restArgs}
              defaultValue={defaultValue}
              onSourceImageChange={handleSourceChange}
              onValueChange={handleValueChange}
            >
              <div
                style={{
                  position: 'relative',
                  marginBottom: '24px',
                }}
              >
                <ImageInputValuePreview cropShape={'round'} showGrid>
                  <ImageInputPlaceholder>
                    <LucideImageOff size={'30%'} />
                  </ImageInputPlaceholder>
                </ImageInputValuePreview>
                {value !== defaultValue && value !== IMAGE_WAS_ERASED && <ImageInfo />}
              </div>
              <ImageInputTrigger>
                <Button size={'dense'} variant={'secondary'}>
                  <LucidePencil />
                </Button>
              </ImageInputTrigger>
              <ImageInputClear>
                <Button size={'dense'} variant={'secondary'}>
                  <LucideUndo />
                </Button>
              </ImageInputClear>
              <ImageInputDelete>
                <Button size={'dense'} variant={'secondary'}>
                  <LucideTrash />
                </Button>
              </ImageInputDelete>
              <Typography as={'h3'} variant={'body2'}>
                rotation
              </Typography>
              <ImageRotationControl />
            </ImageInput>
          </Card>
          <Card>
            <Typography as={'h3'}>Result:</Typography>
            <div
              style={{
                position: 'relative',
                minHeight: '100px',
                width: '300px',
                marginBottom: '50px',
              }}
            >
              {value && value !== defaultValue && value !== IMAGE_WAS_ERASED && (
                <AspectRatio ratio={1} shape={'round'} src={value} />
              )}
              {value && defaultValue && value === defaultValue && (
                <AspectRatio ratio={1} src={defaultValue} />
              )}
              {value === IMAGE_WAS_ERASED && <LucideImageOff size={'30%'} />}
            </div>
            <textarea
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                height: '300px',
                resize: 'vertical',
                fontSize: '10px',
              }}
              value={value}
            />
          </Card>
        </div>
      </>
    )
  },
}
