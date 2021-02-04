# testcafe-reporter-testlink

This is the **testlink** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/simplyageek/testcafe-reporter-testlink/master/media/preview.png" alt="preview" />
</p>

## Install

```
npm install testcafe-reporter-testlink
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter testlink:results.xml
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('testlink') // <-
    .run();
```

## Changelog
v1.0.1 - Added check for skipped tests, so they won't be included in the report  
v1.0.0 - Initial release

## Author
Beniamin Kis 
