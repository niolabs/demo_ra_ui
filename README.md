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

## Getting Started Locally

Follow these steps to run the UI using a local dev webserver.

1. In your terminal, clone the project, enter the directory, and install dependencies.
    ```
    git clone https://github.com/niolabs/demo_ra_ui.git my-project
    cd my-project
    npm i -s
    ```

1. In the root of the project, rename `config.js.example` to `config.js` and update the variables with your Pubkeeper details.

1. Start the project.
    ```
    npm start
    ```

1. Visit the project at https://0.0.0.0:3000.
    - The development web server uses a self-signed certificate, and you may see a warning about the site being insecure. In your local development environment, it is safe to click "Advanced" > "proceed to site anyway."

## Building and Running the Docker Container

1. Build the container from the command line at the root of the project

    ```
    npm run build-docker
    ```

1. Update the `docker/docker-compose.yml` file with your Pubkeeper details

1. Run the container

    ```
    npm run run-docker
    ```

