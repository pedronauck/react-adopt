import * as React from 'react'
import { shallow, mount } from 'enzyme'

import { adopt } from './'

test('return one component with children props as function', () => {
  const Foo = ({ children }) =>
    children && typeof children === 'function' && children('foo')

  interface RenderProps {
    foo: string
  }

  const Composed = adopt<RenderProps>({
    foo: <Foo />,
  })

  const result = mount(<Composed>{props => <div>{props.foo}</div>}</Composed>)
  const { children } = result.props()

  expect(children).toBeDefined()
  expect(typeof children).toBe('function')
})

test('rendering children component', () => {
  const Foo = ({ children, tor }) =>
    children && typeof children === 'function' && children(tor + 'foo')

  const Bar = ({ render, tor }) =>
    render && typeof render === 'function' && render(tor + 'bar')

  interface RenderProps {
    foo: 'foo'
    bar: 'bar'
  }

  interface Props {
    tor: string
  }

  const Composed = adopt<RenderProps, Props>({
    bar: ({ tor, render }) => <Bar tor={tor} render={render} />,
    foo: ({ tor, render }) => <Foo tor={tor}>{render}</Foo>,
  })

  const result = shallow(
    <Composed tor="tor">
      {props => (
        <div>
          <div>{props.foo}</div>
          <div>{props.bar}</div>
        </div>
      )}
    </Composed>
  )

  expect(result.children().length).toBe(1)
  expect(result.html()).toBe('<div><div>torfoo</div><div>torbar</div></div>')
})

test('passing a function', () => {
  const Foo = ({ children }) => children('foo')
  const foo = jest.fn(({ render }) => <Foo>{render}</Foo>)
  const children = jest.fn(() => null)
  const Composed = adopt({ foo })

  mount(<Composed>{children}</Composed>)

  expect(foo).toHaveBeenCalled()
  expect(children).toHaveBeenCalledWith({ foo: 'foo' })
})

test('passing a function changing the render prop on mapper', () => {
  const Foo = ({ render }) => render('foo')

  const foo = jest.fn(({ render }) => <Foo render={render} />)
  const children = jest.fn(() => null)
  const Composed = adopt({ foo })

  mount(<Composed>{children}</Composed>)

  expect(foo).toHaveBeenCalled()
  expect(children).toHaveBeenCalledWith({ foo: 'foo' })
})

test('should provide a function mapper with all previous render prop results', () => {
  const Foo = ({ children }) => children('foo')
  const Bar = ({ children }) => children('bar')
  const bar = jest.fn(({ render }) => <Bar>{render}</Bar>)
  const children = jest.fn(() => null)

  interface RenderProps {
    foo: 'foo'
    bar: 'bar'
  }

  const Composed = adopt<RenderProps>({
    foo: <Foo />,
    bar,
  })

  mount(<Composed>{children}</Composed>)

  expect(bar.mock.calls[0][0]).toHaveProperty('foo', 'foo')
  expect(children).toHaveBeenCalledWith({ foo: 'foo', bar: 'bar' })
})

test('should provide mapper functions with Composed component props', () => {
  const Foo = ({ children }) => children('foo')
  const foo = jest.fn(({ render }) => <Foo>{render}</Foo>)
  const children = jest.fn(() => null)

  type RenderProps = {
    foo: string
  }

  type Props = {
    bar: string
  }

  const Composed = adopt<RenderProps, Props>({
    foo,
  })

  mount(<Composed bar="bar">{children}</Composed>)

  expect(foo.mock.calls[0][0]).toHaveProperty('bar', 'bar')
  expect(children).toHaveBeenCalledWith({ foo: 'foo' })
})

test('throw with a wrong value on mapper', () => {
  expect(() => {
    const Composed = adopt({ foo: 'helo' } as any)
    return shallow(<Composed>{props => <div>foo</div>}</Composed>)
  }).toThrowError(
    'The render props object mapper just accept valid elements as value'
  )
})
