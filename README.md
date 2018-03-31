:sunglasses: _**React Adopt -**_ Compose render props components like a pro

[![GitHub release](https://img.shields.io/github/release/pedronauck/react-adopt.svg)]()
[![Build Status](https://travis-ci.org/pedronauck/react-adopt.svg?branch=master)](https://travis-ci.org/pedronauck/react-adopt)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ebdcc3e942b14363a96438b41c770b32)](https://www.codacy.com/app/pedronauck/react-adopt?utm_source=github.com&utm_medium=referral&utm_content=pedronauck/react-adopt&utm_campaign=Badge_Grade)

![](https://i.imgflip.com/27euu2.jpg)

## 🧐 &nbsp; Why

[Render Props](https://reactjs.org/docs/render-props.html) are the new hype of React's ecossystem, that's a fact. So, when you need to use more than one render props component together, this can be boring and generate something called a *"render props callback hell"*, like that:

![Bad](https://i.imgur.com/qmk3Bk5.png)

## 💡 &nbsp; Solution

* **Small**. 0.7kb minified!
* **Extremely Simple**. Just a method!

React Adopt is just a simple method that you can compose your components and return all props in a function by mapping each child prop returned by your component.

## 💻 &nbsp; Usage ([demo](https://codesandbox.io/s/vq1wl37m0y?hidenavigation=1))

Install as project dependency:

```bash
$ yarn add react-adopt
```

Now you can use adopt to compose your components. See above an example using the awesome [react-powerplug](https://github.com/renatorib/react-powerplug):

![Good](https://i.imgur.com/RXVlFwy.png)

### Custom render and retrieving props from composed

Some components don't use the `children` property as render props. For cases like that, you can pass a function as mapper value that will return your component. This function will receive as props the `render` method, the props passed on `Composed` component and the previous values from each mapper. See an example:

```js
import { adopt } from 'react-adopt'
import MyCustomRenderProps from 'my-custom-render-props'

const Composed = adopt({
  custom: ({ render }) => <MyCustomRenderProps render={render} />
})

const App = () => (
  <Composed>
    {({ custom }) => (
      <div>{custom.value}</div>
    )}
  </Composed>
)
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

const App = () => (
  <Composed initialGreet="Hi">
    {({ greet }) => (
      <div>{greet.value}</div>
    )}
  </Composed>
)
```

## 🕺 &nbsp; Contribute

1.  [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2.  Install dependencies using Yarn: `yarn install`
3.  Make the necessary changes and ensure that the tests are passing using `yarn test`
4.  Send a pull request 🙌
