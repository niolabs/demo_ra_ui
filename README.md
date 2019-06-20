# RA Demo UI

A nio-powered UI.

## What’s in the box

- From niolabs
    - [niolabs ui-kit](https://uikit.niolabs.com/) for components and styles
    - [niolabs pubkeeper](https://niolabs.com/product/pubkeeper) for publishing and subscribing to topics

- Third party software (click to review each library's licensing)
    - [ReactJS](https://reactjs.org/) site scaffold
    - [react-router](https://reacttraining.com/react-router/) for navigation
    - [webpack 4](https://webpack.js.org/) module bundling and development webserver

If you’re at all familiar with React, this simple example covers most of what you need to know to get started.

## Hello world

Follow these steps to create a simple UI that can publish to, subscribe to, and display the output of your nio services.

1. In your terminal, clone the UI scaffold, enter the directory, and install dependencies.
    ```
    git clone https://github.com/niolabs/demo_ra_ui.git my-project
    cd my-project
    npm i -s
    ```

1. In the root of the project, rename `config.js.example` to `config.js`.

1. Start the project.
    ```
    npm start
    ```

1. Visit the project at https://0.0.0.0:3000.
    - The development web server uses a self-signed certificate, and you may see a warning about the site being insecure. In your local development environment, it is safe to click "Advanced" > "proceed to site anyway."

## What’s actually happening?

  - The Pubkeeper Client connects to the Pubkeeper server and subscribes to every topic published to that server.
  - The Homepage loops through every topic and displays a box with the topic title, and each piece of data that's coming into the UI.

## Using a static Pubkeeper Server

Once your system is created and you're ready to move the UI into the public domain, you'll want to remove the Pubkeeper Server chooser and replace it with your system's production Pubkeeper details.

1. Get your Pubkeeper **hostname** and **token** from your nio-managed cloud-instance:
    1. Open the nio **System Designer** in a browser: https://designer.n.io/.
    1. Select your system in the left-hand navigation.
    1. Click the **edit** button in the contextual toolbar to open its configuration.

1. Open `config.js`
    1. Change `staticPubkeeper` to `true`.
    1. Set `PK_HOST` to your **hostname** value.
    1. Set `PK_JWT` to your **token** value.
    1. Set `WS_HOST` to your **hostname** value, but swap the word 'pubkeeper' for 'websocket'.
        1. e.g.- if your **hostname** is `aaaaa.pubkeeper.nio.works`, use `aaaaa.websocket.nio.works`.

## Using your own Auth0 account for authentication

If you'd still like to use auth0 for webauth, you can create a free auth0 account [here](https://auth0.com/signup)

Once you have an auth0 account, create a new application, copy your credentials, open `config.js`, and update the webAuth section appropriately.

## What’s next?
The output of any service that shares the same Pubkeeper host and token that you configured above can be consumed by your UI. All you need to do is update the patron’s topic (or add specific patrons and handlers for each topic), and render the data.

The nio UI Kit at [https://uikit.niolabs.com](https://uikit.niolabs.com) is full of components for layout, charts, etc. that can be pulled into any React project that accommodates scss (we use webpack).

Of course, if React isn’t your thing, the Pubkeeper browser client can be used on any site that supports JavaScript:
 ```
 npm i -s @pubkeeper/browser-client
 ```

## Apache 2.0 License

Copyright 2017-2019 n.io innovation, LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
