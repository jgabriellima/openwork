import { Stream } from 'stream'
import { createElement, type ReactNode } from 'react'
import { ThemeProvider } from './components/design-system/ThemeProvider.js'
import inkRender, {
  type Instance,
  createRoot as inkCreateRoot,
  type RenderOptions as RootRenderOptions,
  type Root,
} from './ink/root.js'
import type { ThemeSetting } from './utils/theme.js'

export type RenderOptions = RootRenderOptions & {
  /**
   * Seed ThemeProvider without calling getGlobalConfig() on first paint.
   * Stripped before options reach Ink (useful before enableConfigs() or when
   * global config must not be read).
   */
  themeInitialSetting?: ThemeSetting
}

export type { Instance, Root }

function splitRenderOptions(
  options?: NodeJS.WriteStream | RenderOptions,
): {
  inkOptions: NodeJS.WriteStream | RootRenderOptions | undefined
  themeInitialSetting?: ThemeSetting
} {
  if (options === undefined) {
    return { inkOptions: undefined }
  }
  if (options instanceof Stream) {
    return { inkOptions: options }
  }
  const { themeInitialSetting, ...rest } = options
  return { inkOptions: rest, themeInitialSetting }
}

// Wrap all CC render calls with ThemeProvider so ThemedBox/ThemedText work
// without every call site having to mount it. Ink itself is theme-agnostic.
function withTheme(
  node: ReactNode,
  themeInitialSetting?: ThemeSetting,
): ReactNode {
  if (themeInitialSetting !== undefined) {
    return createElement(ThemeProvider, {
      initialState: themeInitialSetting,
      children: node,
    })
  }
  return createElement(ThemeProvider, { children: node })
}

export async function render(
  node: ReactNode,
  options?: NodeJS.WriteStream | RenderOptions,
): Promise<Instance> {
  const { inkOptions, themeInitialSetting } = splitRenderOptions(options)
  return inkRender(withTheme(node, themeInitialSetting), inkOptions)
}

export async function createRoot(options?: RenderOptions): Promise<Root> {
  const { themeInitialSetting, ...rest } = options ?? {}
  const root = await inkCreateRoot(rest)
  return {
    ...root,
    render: node => root.render(withTheme(node, themeInitialSetting)),
  }
}

export { color } from './components/design-system/color.js'
export type { Props as BoxProps } from './components/design-system/ThemedBox.js'
export { default as Box } from './components/design-system/ThemedBox.js'
export type { Props as TextProps } from './components/design-system/ThemedText.js'
export { default as Text } from './components/design-system/ThemedText.js'
export {
  ThemeProvider,
  usePreviewTheme,
  useTheme,
  useThemeSetting,
} from './components/design-system/ThemeProvider.js'
export { Ansi } from './ink/Ansi.js'
export type { Props as AppProps } from './ink/components/AppContext.js'
export type { Props as BaseBoxProps } from './ink/components/Box.js'
export { default as BaseBox } from './ink/components/Box.js'
export type {
  ButtonState,
  Props as ButtonProps,
} from './ink/components/Button.js'
export { default as Button } from './ink/components/Button.js'
export type { Props as LinkProps } from './ink/components/Link.js'
export { default as Link } from './ink/components/Link.js'
export type { Props as NewlineProps } from './ink/components/Newline.js'
export { default as Newline } from './ink/components/Newline.js'
export { NoSelect } from './ink/components/NoSelect.js'
export { RawAnsi } from './ink/components/RawAnsi.js'
export { default as Spacer } from './ink/components/Spacer.js'
export type { Props as StdinProps } from './ink/components/StdinContext.js'
export type { Props as BaseTextProps } from './ink/components/Text.js'
export { default as BaseText } from './ink/components/Text.js'
export type { DOMElement } from './ink/dom.js'
export { ClickEvent } from './ink/events/click-event.js'
export { EventEmitter } from './ink/events/emitter.js'
export { Event } from './ink/events/event.js'
export type { Key } from './ink/events/input-event.js'
export { InputEvent } from './ink/events/input-event.js'
export type { TerminalFocusEventType } from './ink/events/terminal-focus-event.js'
export { TerminalFocusEvent } from './ink/events/terminal-focus-event.js'
export { FocusManager } from './ink/focus.js'
export type { FlickerReason } from './ink/frame.js'
export { useAnimationFrame } from './ink/hooks/use-animation-frame.js'
export { default as useApp } from './ink/hooks/use-app.js'
export { default as useInput } from './ink/hooks/use-input.js'
export { useAnimationTimer, useInterval } from './ink/hooks/use-interval.js'
export { useSelection } from './ink/hooks/use-selection.js'
export { default as useStdin } from './ink/hooks/use-stdin.js'
export { useTabStatus } from './ink/hooks/use-tab-status.js'
export { useTerminalFocus } from './ink/hooks/use-terminal-focus.js'
export { useTerminalTitle } from './ink/hooks/use-terminal-title.js'
export { useTerminalViewport } from './ink/hooks/use-terminal-viewport.js'
export { default as measureElement } from './ink/measure-element.js'
export { supportsTabStatus } from './ink/termio/osc.js'
export { default as wrapText } from './ink/wrap-text.js'
