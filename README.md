:sunglasses: _**React Adopt -**_ Compose render props components like a pro

[![GitHub release](https://img.shields.io/github/release/pedronauck/react-adopt.svg)]()
[![Build Status](https://travis-ci.org/pedronauck/react-adopt.svg?branch=master)](https://travis-ci.org/pedronauck/react-adopt)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ebdcc3e942b14363a96438b41c770b32)](https://www.codacy.com/app/pedronauck/react-adopt?utm_source=github.com&utm_medium=referral&utm_content=pedronauck/react-adopt&utm_campaign=Badge_Grade)

![](https://i.imgflip.com/27euu2.jpg)

## 🧐 &nbsp; Why

[Render Props](https://reactjs.org/docs/render-props.html) are the new hype of React's ecossystem, that's a fact. So, when you need to use more than one render props component together, this can be borring and generate something called a "render props callback hell", like that:

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

## 🕺 &nbsp; Contribute

1.  [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2.  Install dependencies using Yarn: `yarn install`
3.  Make the necessary changes and ensure that the tests are passing using `yarn test`
4.  Send a pull request 🙌
