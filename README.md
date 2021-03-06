# Commonplace

Commonplace is the place for reusable components for the Firefox Marketplace (mozilla/fireplace).

## Getting Started

###  Install node/npm

#### OS X

Use `boxen` to install a node environment, or use `homebrew`:

```bash
brew install node
```

And make sure that `/usr/local/share/npm/bin` is in your `$PATH`, à la:

```bash
export PATH=/usr/local/share/npm/bin:$PATH
```

### Setting up your repo

Create a new repository for your project. In it, create a basic `package.json` file. You can do this very easily by running `npm init`.

Next, install commonplace by running `npm install commonplace --save`.

### Creating the commonplace base template

At this point, simply run `commonplace install`. Running this command will create a `src/` directory in your project containing the minimum files needed to run your code. Other directories will also be created for L10n and other functions.


## Updating Commonplace

Once you've run an `npm update`, you'll be running the latest commonplace scripts, but your modules will be out of date.

To update your commonplace installation, simply run `commonplace update` from the root of your project. Commonplace will update all of the shared modules in-place.


## Things that haven't been built yet

* `commonplace update`
* `commonplace lint`
* L10n tools
* a bunch of other stuff
