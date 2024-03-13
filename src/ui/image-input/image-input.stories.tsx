import type { ImageInputRef } from './image-input-base'
import type { Meta, StoryObj } from '@storybook/react'

import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { flexCenter } from '@/common/flex-center'
import { AspectRatio } from '@/ui/aspect-ratio'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { TextArea } from '@/ui/text-area'
import { Typography } from '@/ui/typography'
import { getBase64DataUrl } from '@/utils'
import { useArgs } from '@storybook/preview-api'
import { LucideImageOff, LucidePencil, LucideTrash, LucideUndo } from 'lucide-react'

import {
  ImageInput,
  ImageInputClear,
  ImageInputDelete,
  ImageInputInfo,
  ImageInputTrigger,
  ImageRotationControl,
} from './image-input-base'
import { ImageInputPlaceholder, ImageInputValuePreview } from './value-preview'

const meta = {
  title: 'Components/ImageInput',
  component: ImageInput,
  argTypes: {},
  tags: ['autodocs'],
} satisfies Meta<typeof ImageInput>

export default meta

type Story = StoryObj<typeof meta>

const Template: Story = {
  args: {
    value: '',
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
    sourceImage: '',
  },
  render: args => {
    const { defaultValue, sourceImage, initialContent, value, onValueChange, ...restArgs } = args
    const [_, setArgs, _resetArgs] = useArgs()

    const handleValueChange = (newValue: string) => {
      setArgs({ value: newValue })
    }

    const handleSourceChange = (source: string) => {
      setArgs({ sourceImage: source })
    }

    return (
      <>
        <div className={'flex-row-center'}>
          <Card style={{ width: '500px' }}>
            <ImageInput
              {...restArgs}
              initialContent={initialContent}
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
                {value !== initialContent && value !== IMAGE_WAS_ERASED && <ImageInputInfo />}
              </div>
              <div style={flexCenter}>
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
              </div>
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
              {value && value !== IMAGE_WAS_ERASED && (
                <AspectRatio ratio={1} shape={'round'} src={value} />
              )}
              {value === IMAGE_WAS_ERASED && <LucideImageOff size={'30%'} />}
            </div>
            value:
            {value && value.startsWith('data:image') && (
              <Typography as={'a'} href={value} variant={'link2'}>
                {value.substring(0, 30) + '...'}
              </Typography>
            )}
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
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
    sourceImage: '',
  },
}

export const Uncontrolled: Story = {
  args: {
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
  },
  render: args => {
    const { sourceImage, initialContent, value, onValueChange, ...restArgs } = args
    const [_, updateArgs] = useArgs()

    const handleValueChange = (newValue: string) => {
      updateArgs({ value: newValue })
    }

    const handleSourceChange = (source: string) => {
      updateArgs({ sourceImage: source })
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
              initialContent={initialContent}
              onSourceImageChange={handleSourceChange}
              onValueChange={handleValueChange}
            >
              <div
                style={{
                  position: 'relative',
                  marginBottom: '24px',
                }}
              >
                <ImageInputValuePreview showGrid>
                  <ImageInputPlaceholder>
                    <LucideImageOff size={'30%'} />
                  </ImageInputPlaceholder>
                </ImageInputValuePreview>
              </div>
              <div style={flexCenter}>
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
              </div>

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
              {value && value !== IMAGE_WAS_ERASED && (
                <AspectRatio ratio={1} shape={'round'} src={value} />
              )}
              {value === IMAGE_WAS_ERASED && <LucideImageOff size={'30%'} />}
            </div>
          </Card>
        </div>
      </>
    )
  },
}

function RefTestCard({ reference }: { reference: ImageInputRef | null }) {
  const [valueFromRef, setValueFromRef] = useState('')
  const [initialContentFromRef, setInitialContentFromRef] = useState('')
  const [inputFirstFileItem, setInputFirstFileItem] = useState<string>('')

  const getDataFromImageInputRef = () => {
    if (!reference) {
      return
    }
    setValueFromRef(reference?.value || '')
    setInitialContentFromRef(reference?.initialContent || '')

    if (reference?.filesList && reference?.filesList?.length) {
      const file = reference.filesList.item(0)

      file && setInputFirstFileItem(file.name)
    }
  }

  if (reference === null) {
    return <Card>ref is null</Card>
  }

  return (
    <Card style={{ width: '400px' }}>
      <Typography as={'h1'} style={{ textAlign: 'center' }}>
        Result:
      </Typography>
      <div className={'flex-row-center'} style={{ width: '100%', minHeight: '100px' }}>
        <div style={{ width: '100px' }}>
          {valueFromRef && valueFromRef !== IMAGE_WAS_ERASED && (
            <AspectRatio ratio={1} shape={'round'} src={valueFromRef} />
          )}
        </div>
      </div>
      <Typography variant={'body2'}>ref.current.value: </Typography>

      <TextArea autoHeight maxHeight={150} resizeable={'vertical'} rows={3} value={valueFromRef} />
      {valueFromRef && valueFromRef.startsWith('data:image') && (
        <Typography as={'a'} href={valueFromRef} style={{ fontSize: '12px' }} variant={'link2'}>
          {valueFromRef.substring(16, 50) + '...'}
        </Typography>
      )}
      <Typography variant={'body2'}>ref.current.initialContent</Typography>
      <TextArea
        autoHeight
        maxHeight={150}
        resizeable={'vertical'}
        rows={3}
        value={initialContentFromRef}
      />
      <Typography variant={'body2'}>ref.current.filesList[0].name</Typography>
      <TextArea
        autoHeight
        maxHeight={150}
        resizeable={'vertical'}
        rows={3}
        value={inputFirstFileItem}
      />
      <Button onClick={getDataFromImageInputRef}>Read current ref data</Button>
    </Card>
  )
}

export const RefTestOfUncontrolled: Story = {
  args: {
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
  },
  render: args => {
    const [_, updateArgs] = useArgs()

    const { sourceImage, initialContent, value, onValueChange, ...restArgs } = args

    useEffect(() => {
      updateArgs({ value: initialContent })
    }, [])

    const imageInputRef = useRef<ImageInputRef>(null)

    const handleValueChange = (newValue: string) => {
      updateArgs({ value: newValue })
    }

    const handleSourceChange = (source: string) => {
      updateArgs({ sourceImage: source })
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
              ref={imageInputRef}
              {...restArgs}
              initialContent={initialContent}
              onSourceImageChange={handleSourceChange}
              onValueChange={handleValueChange}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '30px',
                  marginBottom: '50px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <ImageInputValuePreview cropShape={'round'} showGrid>
                    <ImageInputPlaceholder>
                      <LucideImageOff size={'30%'} />
                    </ImageInputPlaceholder>
                  </ImageInputValuePreview>
                  {value !== initialContent && value !== IMAGE_WAS_ERASED && <ImageInputInfo />}
                </div>
                <div style={flexCenter}>
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
                </div>
                <div>
                  <Typography as={'h3'} variant={'body2'}>
                    rotation
                  </Typography>
                  <ImageRotationControl />
                </div>
              </div>
            </ImageInput>
          </Card>
          <RefTestCard reference={imageInputRef.current} />
        </div>
      </>
    )
  },
}

export const RefTestOfControlled: Story = {
  args: {
    value: '',
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
    sourceImage: '',
  },
  render: args => {
    const { defaultValue, sourceImage, initialContent, value, onValueChange, ...restArgs } = args
    const [_, updateArgs, _resetArgs] = useArgs()

    useEffect(() => {
      updateArgs({ value: initialContent })
    }, [])

    const imageInputRef = useRef<ImageInputRef>(null)

    const handleValueChange = (newValue: string) => {
      updateArgs({ value: newValue })
    }

    const handleSourceChange = (source: string) => {
      updateArgs({ sourceImage: source })
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target)
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
              onChange={handleOnChange}
              ref={imageInputRef}
              {...restArgs}
              initialContent={initialContent}
              onSourceImageChange={handleSourceChange}
              onValueChange={handleValueChange}
              sourceImage={sourceImage || ''}
              value={value || ''}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '30px',
                  marginBottom: '50px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <ImageInputValuePreview cropShape={'round'} showGrid>
                    <ImageInputPlaceholder>
                      <LucideImageOff size={'30%'} />
                    </ImageInputPlaceholder>
                  </ImageInputValuePreview>
                  {value !== initialContent && value !== IMAGE_WAS_ERASED && <ImageInputInfo />}
                </div>
                <div style={flexCenter}>
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
                </div>
                <div>
                  <Typography as={'h3'} variant={'body2'}>
                    rotation
                  </Typography>
                  <ImageRotationControl />
                </div>
              </div>
            </ImageInput>
          </Card>
          <RefTestCard reference={imageInputRef.current} />
        </div>
      </>
    )
  },
}

export const SourceMadeOutside: Story = {
  args: {
    value: '',
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
    sourceImage: '',
  },
  render: args => {
    const { defaultValue, sourceImage, initialContent, value, onValueChange, ...restArgs } = args
    const [_, updateArgs, _resetArgs] = useArgs()

    useEffect(() => {
      updateArgs({ value: '' })
    }, [])

    const imageInputRef = useRef<ImageInputRef>(null)
    const externalInputRef = useRef<HTMLInputElement>(null)

    const [externalSourceImageValue, setExternalSourceImageValue] = useState<string>('')

    const handleValueChange = (newValue: string) => {
      updateArgs({ value: newValue })
    }

    const handleSourceChange = (source: string) => {
      updateArgs({ sourceImage: source })
      if (source === '' && externalInputRef?.current) {
        externalInputRef.current.value = ''
        setExternalSourceImageValue('')
      }
    }

    const handleExternalInput = async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]

        if (!file || !file.type.includes('image')) {
          console.warn('not an image file')

          return
        }
        const imageDataUrl = await getBase64DataUrl(file)

        imageDataUrl && setExternalSourceImageValue(imageDataUrl)
      }
    }

    return (
      <>
        <div className={'flex-row-center'}>
          <Card style={{ width: '400px' }}>
            <ImageInput
              ref={imageInputRef}
              {...restArgs}
              initialContent={initialContent}
              onChange={() => {}}
              onSourceImageChange={handleSourceChange}
              onValueChange={handleValueChange}
              sourceImage={externalSourceImageValue || ''}
              value={value || ''}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '30px',
                  marginBottom: '50px',
                }}
              >
                <div className={'flex-row-center'}>
                  <div
                    style={{
                      width: '200px',
                    }}
                  >
                    <ImageInputValuePreview cropShape={'round'} showGrid>
                      <ImageInputPlaceholder>
                        <LucideImageOff size={'30%'} />
                      </ImageInputPlaceholder>
                    </ImageInputValuePreview>
                    {value !== initialContent && value !== IMAGE_WAS_ERASED && <ImageInputInfo />}
                  </div>
                </div>

                <div className={'flex-row-center'}>
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
                </div>
                <div>
                  <Typography as={'h3'} variant={'body2'}>
                    rotation
                  </Typography>
                  <ImageRotationControl />
                </div>
              </div>
            </ImageInput>
            <Typography as={'div'} variant={'body2'}>
              <span>ImageInput -- onValueChange -- value: </span>
              {value && value !== IMAGE_WAS_ERASED && (
                <Typography as={'a'} href={value} style={{ fontSize: '12px' }} variant={'link2'}>
                  {value.length < 100 ? value : value.substring(0, 30) + '...'}
                </Typography>
              )}
              {value && value === IMAGE_WAS_ERASED && (
                <Typography style={{ fontSize: '12px' }} variant={'body2'}>
                  {value}
                </Typography>
              )}
            </Typography>
          </Card>
          <Card style={{ width: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <input
              onChange={handleExternalInput}
              ref={externalInputRef}
              style={{ marginBottom: '20px' }}
              type={'file'}
            />

            <Typography style={{ textAlign: 'center' }} variant={'h1'}>
              external input info
            </Typography>

            {externalSourceImageValue && (
              <Typography
                as={'a'}
                href={externalSourceImageValue}
                style={{ fontSize: '12px' }}
                variant={'link2'}
              >
                {externalSourceImageValue.substring(0, 30) + '...'}
              </Typography>
            )}
            <Typography variant={'body2'}>
              readAsDataUrl(externalInput.ref.current.files[0]):
            </Typography>
            <TextArea resizeable={'vertical'} rows={3} value={externalSourceImageValue} />
          </Card>
          <RefTestCard reference={imageInputRef.current} />
        </div>
      </>
    )
  },
}
