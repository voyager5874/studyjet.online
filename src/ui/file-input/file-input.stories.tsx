import type { FileInputRef } from './file-input'
import type { Meta, StoryObj } from '@storybook/react'

import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { flexCenter } from '@/common/flex-center'
import { AspectRatio } from '@/ui/aspect-ratio'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Typography } from '@/ui/typography'
import { getFileFromUrl } from '@/utils'
import { useArgs } from '@storybook/preview-api'
import {
  LucideFile,
  LucideHardDriveUpload,
  LucideImagePlus,
  LucideTrash,
  LucideX,
} from 'lucide-react'

import { FileInput, FileInputClear, FileInputPreview, FileInputTrigger } from './file-input'

const meta = {
  title: 'Experimental/FileInput',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
    },
  },
  component: FileInput,
} satisfies Meta<typeof FileInput>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {},
  render: args => {
    const { value, onValueChange, ...rest } = args

    const [, setArgs] = useArgs()

    const handleFileSelection = async (file: File | null) => {
      setArgs({ ...args, value: file })
    }

    return (
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <FileInput {...rest} onValueChange={handleFileSelection} value={value}>
          <Card style={{ position: 'relative', overflow: 'hidden' }}>
            {value ? <FileInputPreview ratio={3} /> : <LucideImagePlus size={64} />}
            <div style={{ ...flexCenter, gap: '20px', marginTop: '50px' }}>
              <FileInputTrigger>
                <Button size={'dense'}>trigger</Button>
              </FileInputTrigger>
              <FileInputClear>
                <Button size={'dense'} variant={'secondary'}>
                  Clear
                </Button>
              </FileInputClear>
            </div>
          </Card>
        </FileInput>
      </div>
    )
  },
}

export const Controlled: Story = {
  argTypes: {
    value: {
      control: 'file',
    },
  },
  args: {},
  render: args => {
    const { defaultValue, value, onValueChange, ...rest } = args
    const [, setArgs] = useArgs()

    const imgForPreviewRef = useRef<HTMLImageElement>(null)
    const componentRef = useRef<FileInputRef>(null)

    // args could be used installed of this useState
    const [file, setFile] = useState<File | null>(null)

    const [srcFromComponentRef, setSrcFromComponentRef] = useState('')

    const [srcFromLocalStateFile, setSrcFromLocalStateFile] = useState('')

    const handleFileSelection = useCallback((data: File | null) => {
      setFile(data)
    }, [])

    // this is intentional overhead for checking FileInput value on the ref
    useEffect(() => {
      if (!componentRef?.current) {
        return
      }

      if (componentRef?.current?.value === null) {
        setSrcFromComponentRef('')
      }

      if (componentRef?.current?.value) {
        const url = URL.createObjectURL(componentRef?.current?.value)

        setSrcFromComponentRef(url)
      }

      return () => URL.revokeObjectURL(srcFromComponentRef)
      // srcFromInputRefValue shouldn't be in the deps list
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])

    useEffect(() => {
      if (file === null) {
        setSrcFromLocalStateFile('')
        setArgs({ ...args, value: null })

        return
      }
      const url = URL.createObjectURL(file)

      setSrcFromLocalStateFile(url)

      return () => URL.revokeObjectURL(srcFromLocalStateFile)
      // srcFromLocalStateFile shouldn't be in the deps list
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])

    const handleExternalInput = (e: ChangeEvent<HTMLInputElement>) => {
      const data = e?.target?.files?.item(0)

      if (data) {
        setFile(data)
      }
    }

    useEffect(() => {
      // storybook control 'file' resulting in array of objectUrl
      // but args.value can still be used instead of useState for keeping chosen file as File
      // if (!Array.isArray(value)) {
      if (value instanceof File) {
        return
      }
      const val = value as null | string[] | undefined

      if (val && val?.length) {
        getFileFromUrl(val[0]).then(file => setFile(file))
      }
      // args.value
    }, [value])

    // useEffect(() => {
    //   if (!srcFromLocalStateFile) {
    //     setArgs({ ...args, value: null })
    //
    //     return
    //   }

    // this won't work

    //   setArgs({ ...args, value: [srcFromLocalStateFile] })
    // }, [srcFromLocalStateFile])

    return (
      <div>
        <div style={{ ...flexCenter, marginBottom: '50px' }}>
          <div>
            <Typography as={'h3'}>
              current value of the input (via ref within the parent)
            </Typography>
            <Typography variant={'body2'}>{componentRef?.current?.value?.name || '__'}</Typography>
            <div style={{ width: '500px' }}>
              <AspectRatio ratio={3} ref={imgForPreviewRef} src={srcFromComponentRef} />
            </div>
          </div>
          <div>
            <Typography as={'h3'}>local state file</Typography>
            <Typography variant={'body2'}>{file?.name || '__'}</Typography>
            <div style={{ width: '500px' }}>
              <AspectRatio ratio={3} src={srcFromLocalStateFile} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <FileInput {...rest} onValueChange={handleFileSelection} ref={componentRef} value={file}>
            <div>
              <Typography as={'h3'}>internal preview (special child component)</Typography>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '300px' }}>
                  <FileInputPreview ratio={3} />
                </div>
                <FileInputTrigger>
                  <Button size={'dense'} variant={'secondary'}>
                    trigger <LucideFile />
                  </Button>
                </FileInputTrigger>
                <FileInputClear>
                  <Button size={'dense'}>
                    Clear value <LucideX />
                  </Button>
                </FileInputClear>
              </div>
            </div>
          </FileInput>
        </div>

        <Typography as={'h3'}>
          native type=file input (chosen file will be set to local state as File instance)
        </Typography>

        <label>
          <input onChange={handleExternalInput} type={'file'} />
        </label>
      </div>
    )
  },
}

export const DefaultValue: Story = {
  parameters: { controls: { exclude: ['value'] } },
  args: {
    defaultValue: 'https://ss.sport-express.ru/userfiles/materials/195/1954522/volga.jpg',
  },
  render: args => {
    const { defaultValue, value, onValueChange, ...rest } = args

    const [fileNameFromRef, setFileNameFromRef] = useState<null | string>(null)
    const [fileNameFromOnChange, setFileNameFromOnChange] = useState<null | string>(null)
    const [defaultValueFromRef, setDefaultValueFromRef] = useState<null | string>(null)

    const ref = useRef<FileInputRef>(null)

    const updateRefDisplay = (e: File | null) => {
      setFileNameFromOnChange(e?.name ? e.name : null)
    }

    const updateValuesText = () => {
      if (ref.current?.value?.name) {
        setFileNameFromRef(ref.current?.value.name)
      }
      if (
        typeof ref.current?.defaultValue === 'string' &&
        ref.current?.defaultValue !== defaultValueFromRef
      ) {
        setDefaultValueFromRef(ref.current?.defaultValue)
      }
    }

    return (
      <Card
        style={{
          position: 'relative',
          width: '500px',
          gap: '100px',
        }}
      >
        <FileInput {...rest} defaultValue={defaultValue} onValueChange={updateRefDisplay} ref={ref}>
          <FileInputPreview />

          <div
            style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              display: 'flex',
              gap: '10px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              zIndex: '10',
            }}
          >
            <Button onClick={updateValuesText} variant={'tertiary'}>
              get current values from component ref
            </Button>
            <FileInputTrigger>
              <Button size={'dense'} variant={'secondary'}>
                <LucideHardDriveUpload />
              </Button>
            </FileInputTrigger>
            <FileInputClear>
              <Button size={'dense'} variant={'secondary'}>
                <LucideTrash />
              </Button>
            </FileInputClear>
          </div>
        </FileInput>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '50px' }}>
          <Typography variant={'body2'}>
            value (File.name) via component ref: {fileNameFromRef || 'no value'}
          </Typography>
          <Typography variant={'body2'}>
            default value via component ref: {defaultValueFromRef}
          </Typography>
          <Typography variant={'body2'}>
            file name from onValueChange: {fileNameFromOnChange}
          </Typography>
        </div>
      </Card>
    )
  },
}
