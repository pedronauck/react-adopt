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
  const Foo = ({ children }) =>
    children && typeof children === 'function' && children('foo')

  const Bar = ({ children }) =>
    children && typeof children === 'function' && children('bar')

  interface RenderProps {
    foo: 'foo'
    bar: 'bar'
  }

  const Composed = adopt<RenderProps>({
    bar: <Bar />,
    foo: <Foo />,
  })

  const result = shallow(
    <Composed>
      {props => (
        <div>
          {props.foo}
          {props.bar}
        </div>
      )}
    </Composed>
  )

  expect(result.children().length).toBe(1)
  expect(result.html()).toBe('<div>foobar</div>')
})

test('throw with a wrong value on mapper', () => {
  expect(() => {
    const Composed = adopt({ foo: 'helo' })
    return shallow(<Composed>{props => <div>{props.foo}</div>}</Composed>)
  }).toThrowError(
    'The render props object mapper just accept valid elements as value'
  )
})
