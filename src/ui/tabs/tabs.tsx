import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { createContext, forwardRef, useContext } from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { clsx } from 'clsx'

import s from './tabs.module.scss'

type TabsContextType = {
  disabled: boolean | undefined
}

const defaultContext: TabsContextType = {
  disabled: undefined,
}

const TabsContext = createContext<TabsContextType>(defaultContext)

export type TabsProps = {
  /** Disable whole Tabs component */
  disabled?: boolean
} & ComponentPropsWithoutRef<typeof TabsPrimitive.Root>

const Tabs = forwardRef<ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ disabled, activationMode, className, ...props }, ref) => {
    const mode = disabled ? 'manual' : activationMode

    return (
      <TabsContext.Provider value={{ disabled }}>
        <TabsPrimitive.Root
          activationMode={mode}
          className={clsx(s.tabsRoot, className)}
          ref={ref}
          {...props}
        />
      </TabsContext.Provider>
    )
  }
)

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List className={clsx(s.tabsList, className)} ref={ref} {...props} />
))

TabsList.displayName = TabsPrimitive.List.displayName

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>

const TabsTrigger = forwardRef<ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ disabled, className, ...props }, ref) => {
    const ctx = useContext(TabsContext)
    const cn = clsx(s.tabsTrigger, className)

    return (
      <TabsPrimitive.Trigger
        className={cn}
        ref={ref}
        {...props}
        disabled={disabled || ctx.disabled}
      />
    )
  }
)

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content className={clsx(s.tabsContent, className)} ref={ref} {...props} />
))

TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
