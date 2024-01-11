import { useCallback, useEffect, useRef } from 'react'

export type ControlledPromiseType = {
  cancel: Function
  confirm: Function
  promise: Promise<any> | null
}

export const useConfirm = () => {
  const wait = useRef<ControlledPromiseType | null>(null)
  const initialize = useCallback((onConfirm?: Function, onCancel?: Function) => {
    const init = {} as ControlledPromiseType

    const promise = new Promise((resolve, reject) => {
      init.confirm = resolve
      init.cancel = reject
    })

    init.promise = promise

    if (onConfirm && onCancel) {
      promise
        .then(() => {
          onConfirm()
        })
        .catch(() => {
          onCancel()
        })
        .finally(() => {
          wait.current = null
        })
    }

    if (onConfirm && !onCancel) {
      promise
        .then(() => {
          onConfirm()
        })
        .finally(() => {
          wait.current = null
        })
    }

    wait.current = init
  }, [])

  useEffect(() => {
    initialize()

    return () => {
      wait.current = null
    }
  }, [])

  return {
    waitConfirm: wait?.current?.promise,
    initialize,
    cancel: wait?.current?.cancel,
    confirm: wait?.current?.confirm,
  }
}
