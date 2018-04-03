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
  - [Leading with multiple params](#leading-with-multiple-params)
  - [Typescript support](#typescript-support)

## 🧐 &nbsp; Why

[Render Props](https://reactjs.org/docs/render-props.html) are the new hype of React's ecosystem, that's a fact. So, when you need to use more than one render props component together, this can be boring and generate something called a *"render props callback hell"*, like that:

![Bad](https://i.imgur.com/qmk3Bk5.png)

## 💡 &nbsp; Solution

* **Small**. 0.7kb minified!
* **Extremely Simple**. Just a method!

React Adopt is just a simple method that you can compose your components and return just one component that will be a render prop component that combining each prop result from your mapper.

## 📟 &nbsp; Demos

- [Basic example](https://codesandbox.io/s/vq1wl37m0y?hidenavigation=1)
- [Todo App example using React Apollo](https://codesandbox.io/s/3x7n8wyp15?hidenavigation=1)
- [Example with new Context API](https://codesandbox.io/s/qv3m6yk2n4?hidenavigation=1)

## 💻 &nbsp; Usage

Install as project dependency:

```bash
$ yarn add react-adopt
```

Now you can use adopt to compose your components. See above an example using the awesome [react-powerplug](https://github.com/renatorib/react-powerplug):

![Good](https://i.imgur.com/RXVlFwy.png)

### Working with new Context api

One of use case that React Adopt can fit perfectly is when you need to use [new React's context api](https://reactjs.org/docs/context.html) that use render props to create some context:

```js
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

See [this demo](https://codesandbox.io/s/qv3m6yk2n4?hidenavigation=1) for a better comprehension

### Custom render and retrieving props from composed

Some components don't use the `children` property as render props. For cases like that, you can pass a function as mapper value that will return your component. This function will receive as props the `render` method, the props passed on `Composed` component and the previous values from each mapper. See an example:

```js
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

And as I said above, you can retrieve the properties passed to the composed component using that way too:


```js
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

### Leading with multiples params

Some render props components return multiple arguments in the children function instead of single one, a simple example in the new [Query](https://www.apollographql.com/docs/react/essentials/queries.html#basic) and [Mutation](https://www.apollographql.com/docs/react/essentials/mutations.html) component from `react-apollo`. In that case, what you can do is a arbitrary render with `render` prop [using you map value as a function](#custom-render-and-retrieving-props-from-composed):

```js
import { adopt } from 'react-adopt'
import { Mutation } from 'react-apollo'

const ADD_TODO = /* ... */

const addTodo = ({ render }) => (
  <Mutation mutation={ADD_TODO}>
    {/* that's is arbitrary render where you will pass your two arguments into single one */}
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

See [this demo](https://codesandbox.io/s/3x7n8wyp15?hidenavigation=1) for a complete explanation about that.

### Typescript support

React adopt has a fully typescript support when you need to type the composed component:

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

## 🕺 &nbsp; Contribute

1.  [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2.  Install dependencies using Yarn: `yarn install`
3.  Make the necessary changes and ensure that the tests are passing using `yarn test`
4.  Send a pull request 🙌
