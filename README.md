:sunglasses: _**React Adopt -**_ Compose render props components like a pro

[![GitHub release](https://img.shields.io/github/release/pedronauck/react-adopt.svg)]()
[![Build Status](https://travis-ci.org/pedronauck/react-adopt.svg?branch=master)](https://travis-ci.org/pedronauck/react-adopt)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ebdcc3e942b14363a96438b41c770b32)](https://www.codacy.com/app/pedronauck/react-adopt?utm_source=github.com&utm_medium=referral&utm_content=pedronauck/react-adopt&utm_campaign=Badge_Grade)

![](https://i.imgflip.com/27euu2.jpg)

## 📜 Table of content

- [Why](#--why)
- [Solution](#--solution)
- [Demos](#--demos)
- [Usage](#--usage-demo)
  - [Working with new Context api](#working-with-new-context-api)
  - [Custom render and retrieving props from composed](#custom-render-and-retrieving-props-from-composed)
  - [Mapping props from mapper](#mapping-props-from-mapper)
  - [Leading with multiple params](#leading-with-multiple-params)
  - [Typescript support](#typescript-support)
  - [Inline composition](#inline-composition)

## 🧐 &nbsp; Why

[Render Props](https://reactjs.org/docs/render-props.html) are the new hype of React's ecosystem, that's a fact. So, when you need to use more than one render props component together, this can be boring and generate something called a *"render props callback hell"*, like this:

![Bad](https://i.imgur.com/qmk3Bk5.png)

## 💡 &nbsp; Solution

* **Small**. 0.7kb minified!
* **Extremely Simple**. Just a method!

React Adopt is a simple method that composes multiple render prop components, combining each prop result from your mapper.

## 📟 &nbsp; Demos

- [Basic example](https://codesandbox.io/s/vq1wl37m0y?hidenavigation=1)
- [Todo App example using React Apollo](https://codesandbox.io/s/3x7n8wyp15?hidenavigation=1)
- [Example with new Context API](https://codesandbox.io/s/qv3m6yk2n4?hidenavigation=1)

## 💻 &nbsp; Usage

Install as project dependency:

```bash
$ yarn add react-adopt
```

Now you can use React Adopt to compose your components. See below for an example using the awesome [react-powerplug](https://github.com/renatorib/react-powerplug):

![Good](https://i.imgur.com/RXVlFwy.png)

### Working with new Context api

One use case that React Adopt can fit perfectly is when you need to use [React's new context api](https://reactjs.org/docs/context.html) that use render props to create some context:

```jsx
import React from 'react'
import { adopt } from 'react-adopt'

const ThemeContext = React.createContext('light')
const UserContext = React.createContext({ name: 'John' })

const Context = adopt({
  theme: <ThemeContext.Consumer />,
  user: <UserContext.Consumer />,
})

<Context>
  {({ theme, user }) => /* ... */}
</Context>
```

See [this demo](https://codesandbox.io/s/qv3m6yk2n4?hidenavigation=1) for a better explanation.

### Custom render and retrieving props from composed

Some components don't use the `children` prop for render props to work. For cases like this, you can pass a function instead of a jsx element to your mapper. This function will receive a `render` prop that will be responsible for your render, the props passed on `Composed` component, and the previous values from each mapper. See an example:

```jsx
import { adopt } from 'react-adopt'
import MyCustomRenderProps from 'my-custom-render-props'

const Composed = adopt({
  custom: ({ render }) => <MyCustomRenderProps render={render} />
})

<Composed>
  {({ custom }) => (
    <div>{custom.value}</div>
  )}
</Composed>
```

You can also retrieve the properties passed to the composed component this way too:


```jsx
import { adopt } from 'react-adopt'
import { Value } from 'react-powerplug'

const Composed = adopt({
  greet: ({ initialGreet, render }) => (
    <Value initial={initialGreet}>{render}</Value>
  )
})

<Composed initialGreet="Hi">
  {({ greet }) => (
    <div>{greet.value}</div>
  )}
</Composed>
```

And get previous mapper results as prop for compose:

```jsx
import { adopt } from 'react-adopt'

import { User, Cart, ShippingRate } from 'my-containers'

const Composed = adopt({
  cart: <Cart />,
  user: <User />,
  shippingRates: ({ user, cart, render }) => (
    <ShippingRate zipcode={user.zipcode} items={cart.items}>
      {render}
    </ShippingRate>
  )
})

<Composed>
  {({ cart, user, shippingRates }) => /* ... */ }
</Composed>
```

### Mapping props from mapper

Sometimes, get properties from your mappers can be kind of boring depending on how nested the result from each mapper. To easily avoid deeply nested objects or combine your results, you can map the final results into a single object using the `mapProps` function as the second parameter.

```js
import { adopt } from 'react-adopt'
import { Value } from 'react-powerplug'

const mapper = {
  greet: <Value initial="Hi" />,
  name: <Value initial="John" />,
}

const mapProps = ({ greet, name }) => ({
  message: `${greet.value} ${name.value}`,
})

const Composed = adopt(mapper, mapProps)

const App = () => (
  <Composed>
    {({ message }) => /* ... */}
  </Composed>
)
```

You can do that using the `<Adopt />` component as well:

```js
import { Adopt } from 'react-adopt'
import { Value } from 'react-powerplug'

const mapper = {
  greet: <Value initial="Hi" />,
  name: <Value initial="John" />,
}

const mapProps = ({ greet, name }) => ({
  message: `${greet.value} ${name.value}`,
})

const App = () => (
  <Adopt mapper={mapper} mapProps={mapProps}>
    {({ message }) => /* ... */}
  </Adopt>
)
```

### Leading with multiple params

Some render props components return multiple arguments in the children function instead of a single one (see a simple example in the new [Query](https://www.apollographql.com/docs/react/essentials/queries.html#basic) and [Mutation](https://www.apollographql.com/docs/react/essentials/mutations.html) component from `react-apollo`). In this case, you can do an arbitrary render with `render` prop [using your map value as a function](#custom-render-and-retrieving-props-from-composed):

```js
import { adopt } from 'react-adopt'
import { Mutation } from 'react-apollo'

const ADD_TODO = /* ... */

const addTodo = ({ render }) => (
  <Mutation mutation={ADD_TODO}>
    {/* this is an arbitrary render where you will pass your two arguments into a single one */}
    {(mutation, result) => render({ mutation, result })}
   </Mutation>
)

const Composed = adopt({
  addTodo,
})

const App = () => (
  <Compose>
    {({ addTodo: { mutation, result } }) => /* ... */}
  </Compose>
)
```

See [this demo](https://codesandbox.io/s/3x7n8wyp15?hidenavigation=1) for a complete explanation about multiple params..

### Typescript support

React Adopt has full typescript support when you need to type the composed component:

```ts
import * as React from 'react'
import { adopt } from 'react-adopt'
import { Value } from 'react-powerplug'

interface RenderProps {
  foo: { value: string }
}

interface Props {
  tor: string
}

const foo = ({ tor, render }) => (
  <Value initial="foo">{render}</Value>
)

const Composed = adopt<RenderProps, Props>({
  foo,
})

<Composed tor="tor">
  {({ foo, bar }) => (
    <div>{foo.value}</div>
  )}
</Composed>
```

### Inline composition

If you dont care about [typings](#typescript-support) and need something more easy and quick, you can choose to use an inline composition by importing the `<Adopt>` component and passing your mapper as a prop:

```js
import React from 'react'
import { Adopt } from 'react-adopt'
import { Value } from 'react-powerplug'

const mapper = {
  greet: <Value initial="Hi" />,
  name: <Value initial="John" />
}

<Adopt mapper={mapper}>
  {({ greet, name }) => /* ... */}
</Adopt>
```

## 🕺 &nbsp; Contribute

1.  [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2.  Install dependencies using Yarn: `yarn install`
3.  Make the necessary changes and ensure that the tests are passing using `yarn test`
4.  Send a pull request 🙌
