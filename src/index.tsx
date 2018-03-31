import * as React from 'react'
import { ComponentType, ReactNode, ReactElement } from 'react'

export type ChildrenFn<P> = (props: P) => ReactNode

export type RPC<Props> = ComponentType<{
  children?: ChildrenFn<Props>
}>

export type Mapper<R> = Record<keyof R, ReactElement<any> | any>

const isValidRenderProp = (prop: ReactNode | ChildrenFn): boolean =>
  React.isValidElement(prop) || typeof prop === 'function'

const Children = ({ children }: any) => children()

export function adopt<RP extends Record<string, any>>(
  mapper: Mapper<RP>
): RPC<RP> {
  if (!Object.values(mapper).some(isValidRenderProp)) {
    throw new Error(
      'The render props object mapper just accept valid elements as value'
    )
  }

  return Object.keys(mapper).reduce(
    (Component: RPC<RP>, key: keyof RP): RPC<RP> => ({ children, ...rest }) => (
      <Component>
        {props => {
          const renderProp = (childProps: any) =>
            children(Object.assign({}, props, { [key]: childProps }))

          return typeof mapper[key] === 'function'
            ? mapper[key](Object.assign({}, rest, props, { renderProp }))
            : React.cloneElement(mapper[key], { children: renderProp })
        }}
      </Component>
    ),
    Children
  )
}
