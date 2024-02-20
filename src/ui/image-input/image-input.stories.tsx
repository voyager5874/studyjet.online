import type { ImageInputRef } from './image-input-base'
import type { Meta, StoryObj } from '@storybook/react'

import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'

import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { flexCenter } from '@/common/flex-center'
import { AspectRatio } from '@/ui/aspect-ratio'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Typography } from '@/ui/typography'
import { blobToString, getBase64DataUrl } from '@/utils'
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

export const RefTestOfUncontrolled: Story = {
  args: {
    initialContent: 'https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg',
  },
  render: args => {
    const [_, updateArgs] = useArgs()

    const { sourceImage, initialContent, value, onValueChange, ...restArgs } = args

    const imageInputRef = useRef<ImageInputRef>(null)

    const [valueFromRef, setValueFromRef] = useState('')
    const [initialContentFromRef, setInitialContentFromRef] = useState('')
    const [inputFirstFileItem, setInputFirstFileItem] = useState<string>('')

    const handleValueChange = (newValue: string) => {
      updateArgs({ value: newValue })
    }

    const handleSourceChange = (source: string) => {
      updateArgs({ sourceImage: source })
    }

    const getDataFromImageInputRef = () => {
      if (!imageInputRef?.current) {
        return
      }
      setValueFromRef(imageInputRef?.current?.value || '')
      setInitialContentFromRef(imageInputRef?.current?.initialContent || '')

      if (imageInputRef?.current?.files && imageInputRef?.current?.files?.length) {
        const file = imageInputRef.current.files.item(0)

        file && setInputFirstFileItem(file.name)
      }
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
            <Button onClick={getDataFromImageInputRef}>Get current ref data</Button>
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
              {valueFromRef && valueFromRef !== IMAGE_WAS_ERASED && (
                <AspectRatio ratio={1} shape={'round'} src={valueFromRef} />
              )}
            </div>
            <Typography variant={'body2'}>ref.current.value: </Typography>
            {valueFromRef && valueFromRef.startsWith('data:image') && (
              <Typography as={'a'} href={valueFromRef} variant={'link2'}>
                {valueFromRef.substring(0, 30) + '...'}
              </Typography>
            )}
            <textarea
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                height: '300px',
                resize: 'vertical',
                fontSize: '10px',
                marginBottom: '20px',
              }}
              value={valueFromRef}
            />
            <Typography variant={'body2'}>
              ref.current.initialContent - {initialContentFromRef}
            </Typography>
            <Typography variant={'body2'}>
              ref.current.files[0].name - {inputFirstFileItem}
            </Typography>
          </Card>
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
    const [_, setArgs, _resetArgs] = useArgs()

    const imageInputRef = useRef<ImageInputRef>(null)

    const [valueFromRef, setValueFromRef] = useState('')
    const [initialContentFromRef, setDefaultValueFromRef] = useState('')
    const [inputFirstFileItem, setInputFirstFileItem] = useState<string>('')

    console.log('story render', { value, initialContent, sourceImage })
    const handleValueChange = (newValue: string) => {
      setArgs({ value: newValue })
    }

    const handleSourceChange = (source: string) => {
      setArgs({ sourceImage: source })
    }

    const getDataFromImageInputRef = () => {
      if (!imageInputRef?.current) {
        return
      }

      setValueFromRef(imageInputRef?.current?.value || '')
      setDefaultValueFromRef(imageInputRef?.current?.initialContent || '')

      if (imageInputRef?.current?.files && imageInputRef?.current?.files?.length) {
        const file = imageInputRef.current.files.item(0)

        file && setInputFirstFileItem(file.name)
      }
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
            <Button onClick={getDataFromImageInputRef}>Get current data from component ref</Button>
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
              {valueFromRef && valueFromRef !== IMAGE_WAS_ERASED && (
                <AspectRatio ratio={1} shape={'round'} src={valueFromRef} />
              )}
            </div>
            <Typography variant={'body2'}>ref.current.value:</Typography>
            {valueFromRef && valueFromRef.startsWith('data:image') && (
              <Typography as={'a'} href={valueFromRef} variant={'link2'}>
                {valueFromRef.substring(0, 30) + '...'}
              </Typography>
            )}
            <textarea
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                height: '300px',
                resize: 'vertical',
                fontSize: '10px',
              }}
              value={valueFromRef}
            />
            <Typography variant={'body2'}>
              ref.current.initialContent: {initialContentFromRef}
            </Typography>
            <Typography variant={'body2'}>ref.current.files[0]: {inputFirstFileItem}</Typography>
          </Card>
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
    const [_, setArgs, _resetArgs] = useArgs()
    // const [src, setSrc] = useState('')

    const imageInputRef = useRef<ImageInputRef>(null)
    const externalInputRef = useRef<HTMLInputElement>(null)

    const [valueFromRef, setValueFromRef] = useState('')
    const [initialContentFromRef, setDefaultValueFromRef] = useState('')
    const [inputFileItem, setInputFileItem] = useState<string>('')

    const [externalSourceImageValue, setExternalSourceImageValue] = useState<string>('')

    const [dataUrlFromFileList, setDataUrlFromFileList] = useState<string>('')

    const handleValueChange = (newValue: string) => {
      setArgs({ value: newValue })
      // setSrc(newValue)
    }

    const handleSourceChange = (source: string) => {
      setArgs({ sourceImage: source })
      if (source === '' && externalInputRef?.current) {
        externalInputRef.current.value = ''
        setExternalSourceImageValue('')
      }
    }

    const getDataFromImageInputRef = async () => {
      if (!imageInputRef?.current) {
        return
      }

      console.log('component ref', imageInputRef?.current)
      if (imageInputRef?.current?.value === '') {
        console.log('imageInputRef?.current?.value is empty string')
      }
      setValueFromRef(imageInputRef?.current?.value || '')
      setDefaultValueFromRef(imageInputRef?.current?.initialContent || '')

      if (imageInputRef?.current?.files?.length === 0) {
        setInputFileItem('no files in input FileList')
        setDataUrlFromFileList('')
      }
      // setFileListFromFromRef(imageInputRef?.current?.files)

      if (imageInputRef?.current?.files && imageInputRef?.current?.files?.length) {
        const file = imageInputRef.current.files.item(0)

        console.log('imageInputRef', { file })
        file && setInputFileItem(file.name)
        file &&
          blobToString(file).then(url => {
            setDataUrlFromFileList(url)
          })
        if (file) {
        }
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
            <Button onClick={getDataFromImageInputRef}>Get current ref data</Button>
          </Card>
          <Card style={{ minWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                minHeight: '300px',
              }}
            >
              <div style={{ width: '150px' }}>
                <h5>ref.current.value</h5>
                {valueFromRef && valueFromRef !== IMAGE_WAS_ERASED && (
                  <AspectRatio ratio={1} shape={'round'} src={valueFromRef} />
                )}
              </div>
              <div style={{ width: '150px' }}>
                <h5>ref.current.files[0] -{'>'} readAsDataUrl</h5>
                {dataUrlFromFileList && dataUrlFromFileList.startsWith('data:image') && (
                  <AspectRatio ratio={1} shape={'round'} src={dataUrlFromFileList} />
                )}
              </div>
            </div>

            <Typography variant={'body2'}>
              externalInput -{'>'} onChange -{'>'} event.target.files[0] -{'>'} readAsDataUrl
            </Typography>
            {externalSourceImageValue && (
              <Typography as={'a'} href={externalSourceImageValue} variant={'link2'}>
                {externalSourceImageValue.substring(0, 30) + '...'}
              </Typography>
            )}
            <textarea
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                height: '50px',
                resize: 'vertical',
                fontSize: '10px',
              }}
              value={externalSourceImageValue}
            />
            <Typography as={'div'} variant={'body2'}>
              <span>initialContent from ref: </span>
              <span style={{ wordWrap: 'break-word' }}>{initialContentFromRef}</span>
            </Typography>
            <Typography as={'div'} variant={'body2'}>
              fileList firstItem from ref: {inputFileItem}
            </Typography>
            <Typography as={'div'} variant={'body2'}>
              <span>value: </span>

              {value && value !== IMAGE_WAS_ERASED && (
                <Typography as={'a'} href={value} variant={'link2'}>
                  {value.length < 100 ? value : value.substring(0, 30) + '...'}
                </Typography>
              )}
              {!value && <span>empty</span>}
              {value === IMAGE_WAS_ERASED && <span>{value}</span>}
            </Typography>
          </Card>
          <input onChange={handleExternalInput} ref={externalInputRef} type={'file'} />
        </div>
      </>
    )
  },
}
