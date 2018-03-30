import * as React from 'react'
import { ComponentType, ReactNode, ReactElement } from 'react'

export type ChildrenFn<P> = (props: P) => ReactNode

export type RPC<Props> = ComponentType<{
  children?: ChildrenFn<Props>
}>

export type Mapper<R> = Record<keyof R, ReactElement<any> | any>

export function adopt<RP extends Record<string, any>>(
  mapper: Mapper<RP>
): RPC<RP> {
  if (!Object.values(mapper).some(React.isValidElement)) {
    throw new Error(
      'The render props object mapper just accept valid elements as value'
    )
  }

  const Initial = ({ children }: any) =>
    children && typeof children === 'function' && children()

  return Object.keys(mapper).reduce(
    (Component: RPC<RP>, key: keyof RP): RPC<RP> => ({ children }) => (
      <Component>
        {props =>
          React.cloneElement(mapper[key], {
            children: (childProps: any) =>
              children &&
              typeof children === 'function' &&
              children(Object.assign({}, props, { [key]: childProps })),
          })
        }
      </Component>
    ),
    Initial
  )
}
