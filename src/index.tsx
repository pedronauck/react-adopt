import * as React from 'react'
import { ReactNode, ReactElement } from 'react'
import * as hoistNonReactStatic from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'

const { values, keys, assign } = Object

export declare type ChildrenFn<P> = (props: P) => JSX.Element | null

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

export declare type RPC<RP, P = {}> = React.ComponentType<
  P & {
    children?: ChildrenFn<RP>
    render?: ChildrenFn<RP>
  }
>

export declare type MapperComponent<RP, P> = React.ComponentType<
  RP &
    P & {
      render?: ChildrenFn<any>
    }
>

export declare type MapperValue<RP, P> =
  | ReactElement<any>
  | MapperComponent<RP, P>

export declare type Mapper<RP, P> = Record<string, MapperValue<RP, P>>

export declare type MapProps<RP> = (props: any) => RP

export function adopt<RP = any, P = any>(
  mapper: Mapper<RP, P>,
  mapProps?: MapProps<RP>
): RPC<RP, P> {
  if (!values(mapper).some(isValidRenderProp)) {
    throw new Error(
      'The render props object mapper just accept valid elements as value'
    )
  }

  const mapperKeys = keys(mapper)
  const Children: any = ({ render, children, ...rest }: any) =>
    render && isFn(render)
      ? render(rest)
      : children && isFn(children) && children(rest)

  Children.displayName = 'Adopt'

  const reducer = (Component: RPC<RP>, key: string, idx: number): RPC<RP> => {
    const element = prop(key, mapper)
    const displayName = getDisplayName(Component)
    const nextDisplayName = getDisplayName(element)
    const isLast = idx === mapperKeys.length - 1

    const NewComponent: RPC<RP> = ({
      render: pRender,
      children,
      ...rest
    }: any) => (
      <Component {...rest}>
        {props => {
          const propsWithoutRest = omit<RP>(keys(rest), props)
          const render = pRender && isFn(pRender) ? pRender : children

          const renderFn: ChildrenFn<RP> = cProps => {
            const renderProps = assign({}, propsWithoutRest, {
              [key]: cProps,
            })

            const propsToPass =
              mapProps && isFn(mapProps) && isLast
                ? mapProps(renderProps)
                : renderProps

            return render && isFn(render) ? render(propsToPass) : null
          }

          return isFn(element)
            ? React.createElement(
                element,
                assign({}, rest, props, { render: renderFn })
              )
            : React.cloneElement(element, {}, renderFn)
        }}
      </Component>
    )

    NewComponent.displayName = `${displayName}(${nextDisplayName})`

    return isFn(element)
      ? hoistNonReactStatic(NewComponent, element)
      : NewComponent
  }

  return mapperKeys.reduce(reducer, Children)
}

export type AdoptProps<RP, P> = P & {
  mapper: Mapper<RP, P>
  children?: ChildrenFn<RP>
  render?: ChildrenFn<RP>
  mapProps?: MapProps<RP>
}

export class Adopt<RP = any, P = any> extends React.Component<AdoptProps<RP, P>> {
  private Composed: React.ComponentType<any>

  constructor(props: any) {
    super(props)
    this.Composed = adopt<RP, P>(props.mapper, this.props.mapProps)
  }

  public render(): JSX.Element {
    const { mapper, mapProps, ...props } = this.props
    return <this.Composed {...props} />
  }
}
