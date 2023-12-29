# Mitch the Art Dealer

## Workflow

```sh
npm install
npm run start
npm run build
```

## Phaser 3 version

[API docs for Arcade](https://newdocs.phaser.io/docs/3.70.0/Phaser.Physics.Arcade)

## Original Phaser 3 + TypeScript + Vite.js Template

Followed [part 1](https://www.youtube.com/watch?v=tFkMxzHwmDw&t=0s&ab_channel=ourcade) to set up the project.

Since Phaser now has a TypeScript starter, we used [this template](https://github.com/ourcade/phaser3-typescript-vite-template) which differs from the tutorial.

I also followed along with the code examples from the official [tutorial](https://phaser.io/tutorials/making-your-first-phaser-3-game/part7), converting them to TypeScript along the way.

[Collecting stars](https://phaser.io/tutorials/making-your-first-phaser-3-game/part8) is part of the tutorial to give you an idea.

An example of would be:

```js
function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}
```

Using TypeScript looks like this:

```ts
  private handleCollectStar(
    player: Phaser.GameObjects.GameObject,
    s: Phaser.GameObjects.GameObject
  ) {
    const star = s as Phaser.Physics.Arcade.Image;
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText?.setText("Score: " + this.score);
    if (this.stars?.countActive(true) === 0) {
      this.stars.children.iterate((c) => {
        const child = c as Phaser.Physics.Arcade.Image;
        child.enableBody(true, child.x, 0, true, true);
      });
      if (this.player) {
        const x =
          this.player?.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);
        const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(
          x,
          16,
          "bomb"
        );
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }
  }
```
  
The [ourcade blog](https://blog.ourcade.co/posts/2020/make-first-phaser-3-game-modern-javascript-part2/) covers splitting up code in a more professional manner.  This would be a good next step to set up the project to grow bigger.

## Generated content

> Make Phaser 3 games with TypeScript and modern frontend tooling.

![License](https://img.shields.io/badge/license-MIT-green)

This is a TypeScript specific fork of [phaser3-vite-template](https://github.com/ourcade/phaser3-vite-template).

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm.

For Windows users there is [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows`.

## Getting Started

You can clone this repository or use [degit](https://github.com/Rich-Harris/degit) to scaffold the project like this:

```bash
npx degit https://github.com/ourcade/phaser3-typescript-vite-template my-folder-name
cd my-folder-name

npm install
```

Start development server:

```
npm run start
```

To create a production build:

```
npm run build
```

Production files will be placed in the `dist` folder. Then upload those files to a web server. 🎉

## Project Structure

```
    .
    ├── dist
    ├── node_modules
    ├── public
    ├── src
    │   ├── HelloWorldScene.ts
    │   ├── main.ts
	├── index.html
    ├── package.json
```

TypeScript files are intended for the `src` folder. `main.ts` is the entry point referenced by `index.html`.

Other than that there is no opinion on how you should structure your project.

There is an example `HelloWorldScene.ts` file that can be placed inside a `scenes` folder to organize by type or elsewhere to organize by function. For example, you can keep all files specific to the HelloWorld scene in a `hello-world` folder.

It is all up to you!

## Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served from the root. For example: http://localhost:8000/images/my-image.png

Example `public` structure:

```
    public
    ├── images
    │   ├── my-image.png
    ├── music
    │   ├── ...
    ├── sfx
    │   ├── ...
```

They can then be loaded by Phaser with `this.image.load('my-image', 'images/my-image.png')`.

# TypeScript ESLint

This template uses a basic `typescript-eslint` set up for code linting.

It does not aim to be opinionated.

[See here for rules to turn on or off](https://eslint.org/docs/rules/).

## Dev Server Port

You can change the dev server's port number by modifying the `vite.config.ts` file. Look for the `server` section:

```js
{
	// ...
	server: { host: '0.0.0.0', port: 8000 },
}
```

Change 8000 to whatever you want.

## License

[MIT License](https://github.com/ourcade/phaser3-vite-template/blob/master/LICENSE)
