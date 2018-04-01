import * as React from 'react'
import { ReactNode, ReactElement } from 'react'

const { values, keys, assign } = Object

export type ChildrenFn<P> = (props: P) => ReactNode

function omit<R = object>(omitProps: string[], obj: any): R {
  const newObj = keys(obj)
    .filter((key: string): boolean => omitProps.indexOf(key) === -1)
    .reduce(
      (returnObj: any, key: string): R => ({ ...returnObj, [key]: obj[key] }),
      {}
    )

  return newObj as R
}

function prop<T = any>(key: string, obj: any): T {
  return obj[key]
}

const isFn = (val: any): boolean => Boolean(val) && typeof val === 'function'

const isValidRenderProp = (prop: ReactNode | ChildrenFn<any>): boolean =>
  React.isValidElement(prop) || isFn(prop)

export type RPC<RP, P = {}> = React.SFC<
  P & {
    children: ChildrenFn<RP>
  }
>

export type MapperComponent<RP, P = {}> = React.SFC<
  P & {
    render?: ChildrenFn<RP & P>
  }
>

export type MapperValue<RP, P> = ReactElement<any> | MapperComponent<RP, P>

export type Mapper<RP, P> = Record<keyof RP, MapperValue<RP, P>>

export function adopt<RP, P = {}>(mapper: Mapper<RP, P>): RPC<RP, P> {
  if (!values(mapper).some(isValidRenderProp)) {
    throw new Error(
      'The render props object mapper just accept valid elements as value'
    )
  }

  const Children: any = ({ children, ...rest }: any) =>
    isFn(children) && children(rest)

  const reducer = (Component: RPC<RP>, key: string): RPC<RP> => ({
    children,
    ...rest
  }) => (
    <Component {...rest}>
      {props => {
        const element = prop(key, mapper)
        const propsWithoutRest = omit<RP>(keys(rest), props)

        const render: ChildrenFn<RP> = cProps =>
          isFn(children) &&
          children(
            assign({}, propsWithoutRest, {
              [key]: cProps,
            })
          )

        return isFn(element)
          ? React.createElement(element, assign({}, rest, props, { render }))
          : React.cloneElement(element, null, render)
      }}
    </Component>
  )

  return keys(mapper).reduce(reducer, Children)
}
