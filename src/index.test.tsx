import * as React from 'react'
import { shallow, mount } from 'enzyme'
import { Value } from 'react-powerplug'

import { adopt, Adopt } from './'

test('return one component with children props as function', () => {
  interface RenderProps {
    foo: { value: string }
  }

  const Composed = adopt<RenderProps>({
    foo: <Value initial="foo" />,
  })

  const result = mount(
    <Composed>{({ foo }) => <div>{foo.value}</div>}</Composed>
  )
  const { children } = result.props()

  expect(children).toBeDefined()
  expect(typeof children).toBe('function')
})

test('rendering children component', () => {
  interface RenderProps {
    foo: { value: string }
    bar: { value: string }
  }

  interface Props {
    tor: string
  }

  const Composed = adopt<RenderProps, Props>({
    foo: ({ tor, render }) => <Value initial={tor + 'foo'}>{render}</Value>,
    bar: ({ tor, render }) => <Value initial={tor + 'bar'}>{render}</Value>,
  })

  const result = shallow(
    <Composed tor="tor">
      {({ foo, bar }) => (
        <div>
          <div>{foo.value}</div>
          <div>{bar.value}</div>
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

test('inline composition using <Adopt> component', () => {
  const Foo = ({ children }) => children('foo')
  const children = jest.fn(({ foo }) => <div>{foo}</div>)

  const mapper = {
    foo: <Foo />,
  }

  const element = <Adopt mapper={mapper}>{children}</Adopt>

  mount(element)
  expect(children).toHaveBeenCalledWith({ foo: 'foo' })

  const result = shallow(element)

  expect(result.children().length).toBe(1)
  expect(result.html()).toBe('<div>foo</div>')
})

test('changing <Adopt> properties on the fly', () => {
  const Foo = ({ children, value }) => children(value)
  const children = jest.fn(({ foo }) => <div>{foo}</div>)

  const Component = ({ value }) => (
    <Adopt mapper={{ foo: <Foo value={value} /> }}>
      {({ foo }) => <div>{foo}</div>}
    </Adopt>
  )

  const wrapper = mount(<Component value="foo" />)

  expect(wrapper.text()).toBe('foo')
  wrapper.setProps({ value: 'bar' })
  expect(wrapper.text()).toBe('bar')
})
