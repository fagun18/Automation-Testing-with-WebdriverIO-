# Automation-Testing-with-WebdriverIO

Welcome to the WebdriverIO Testing repository! This repository contains code and examples for implementing test automation using WebdriverIO, a powerful test automation framework for Node.js. With WebdriverIO, you can conduct end-to-end, unit, and component testing in the browser environment.

![WebdriverIO](https://th.bing.com/th/id/OIP.Oih_pPGaXHEMV1uY_0erZQAAAA?rs=1&pid=ImgDetMain)

## Features

- End-to-end, unit, and component testing in the browser
- Supports BDD or TDD test frameworks
- Local and cloud-based testing
- Automated waiting for elements to appear before interaction
- Command line interface for easy configuration setup
- Integration with various test frameworks and reporter plugins
## Watch a Demo

Check out this demo of running WebdriverIO tests:

![Run Test](https://webdriver.io/img/create-wdio-dark.gif)

## Getting Started

To get started with WebdriverIO, follow these steps:

1. **Create a project folder and open it on Visual Studio Code or a text editor of your choice.**

2. **Install WebdriverIO in your project:**

    ```bash
    npm install @wdio/cli
    ```

3. **Create a configuration file for WebdriverIO:**

    ```bash
    npx wdio config
    ```

4. **Create a `Tests` folder in your project directory. Inside the `Tests` folder, create a `Specs` folder. Then, create a file called `test.e2e.js` inside the `Specs` folder and add your test script.**

    ```javascript
    const { expect, browser, $ } = require("@wdio/globals");

    describe("Form Submit Demo", () => {
        it("should fill form input fields", async () => {
            await browser.url('https://www.linkedin.com/in/mejbaur/');
            await $("#title").setValue("John Doe");
            await $("#description").setValue("Hello there");
            await $("#btn-submit").click();
        });
    });
    ```

5. **Run the test:**

    ```bash
    npm run wdio
    ```

Once the command is done running, you should be able to see the results of the tests on the command line.
## YouTube Video Tutorial 👇🏿

[![WebdriverIO](https://img.youtube.com/vi/EPjajfWZyPw/maxresdefault.jpg)](https://youtu.be/EPjajfWZyPw)

Watch the video tutorial for a visual guide on getting started with Jasmine.



## Contributing

We welcome contributions to this repository! To contribute, follow these steps:

1. Fork the repository
2. Create a new branch for your features or fixes
3. Make your changes
4. Test your changes thoroughly
5. Submit a pull request

## License

[MIT License](LICENSE)


## Follow Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/mejbaur/)
[![Facebook](https://img.shields.io/badge/Facebook-Follow-blue)](https://www.facebook.com/mbfagun)
[![YouTube](https://img.shields.io/badge/YouTube-Subscribe-red)](https://www.youtube.com/channel/UC4Pgj5J2ZUxAVH9iAPfqL5g)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-blue)](https://twitter.com/fagun018)
[![Website](https://img.shields.io/badge/Website-Visit-blue)](https://mbfagun.blogspot.com/)
[![Medium](https://img.shields.io/badge/Medium-Follow-blue)](https://fagun18.medium.com/)


![Mejbaur Bahar Fagun](https://th.bing.com/th/id/OIP.kZ7sZWgg-zvkLAeAjttqpgHaHa?rs=1&pid=ImgDetMain)  
**Mejbaur Bahar Fagun**  
Product Acceptance Engineer (L2) @ DEVxHUB | 🥸 Lead SQA and 🐞 Security Analysts 🐛 Bug Bounty 👻 DevSecOps
