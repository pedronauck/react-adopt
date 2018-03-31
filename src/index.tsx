import * as React from 'react'
import { ComponentType, ReactNode, ReactElement } from 'react'

const { values, keys, assign } = Object

export type ChildrenFn<P = any> = (props: P) => ReactNode

export type MapperValue =
  | ReactElement<any>
  | ChildrenFn<{
      renderProp?: ChildrenFn
      [key: string]: any
    }>

export type Mapper<R> = Record<keyof R, MapperValue>

export type RPC<RenderProps, Props = {}> = ComponentType<
  Props & {
    children: ChildrenFn<RenderProps>
  }
>

function omit<R = object>(obj: any, omitProps: string[]): R {
  const newObj = keys(obj)
    .filter((key: string): boolean => omitProps.indexOf(key) === -1)
    .reduce(
      (returnObj: any, key: string): R => ({ ...returnObj, [key]: obj[key] }),
      {}
    )

  return newObj as R
}

const isFn = (val: any): boolean => Boolean(val) && typeof val === 'function'

const isValidRenderProp = (prop: ReactNode | ChildrenFn<any>): boolean =>
  React.isValidElement(prop) || isFn(prop)

export function adopt<RP extends Record<string, any>, P = {}>(
  mapper: Mapper<RP>
): RPC<RP, P> {
  if (!values(mapper).some(isValidRenderProp)) {
    throw new Error(
      'The render props object mapper just accept valid elements as value'
    )
  }

  const Children: RPC<RP, P> = ({ children, ...rest }: any) =>
    isFn(children) && children(rest)

  const reducer = (Component: RPC<RP, P>, key: keyof RP): RPC<RP, P> => ({
    children,
    ...rest
  }: {
    children: ChildrenFn<RP>
  }) => (
    <Component {...rest}>
      {props => {
        const element: any = mapper[key]
        const propsWithoutRest = omit<RP>(props, keys(rest))

        const render = (cProps: Partial<RP>) =>
          isFn(children) &&
          children(assign({}, propsWithoutRest, { [key]: cProps }))

        return isFn(element)
          ? React.createElement(element, assign({}, rest, props, { render }))
          : React.cloneElement(element, null, render)
      }}
    </Component>
  )

  return keys(mapper).reduce(reducer, Children)
}
