# wadd
I don't know about you but there are three things that always annoys me when I'm adding a package to a monorepo
1. I don't remember the specific command for either yarn or lerna.
2. I'm not always sure whats the name of the workspace that I wish to add a new dependency to.
3. I want to be able to add multiple packages to multiple workspaces in a single command.

## Usage
first off install `wadd`
```bash
npm i -g wadd
```
once that's done, you can go ahead and run `wadd` in your monorepo and it will ask you which workspace you would like to add the packages and which packages you would like to add.  
Currently, the only monorepo clients that `wadd` support are, `lerna` and `yarn`. 

https://user-images.githubusercontent.com/40733145/132123405-aa2832e3-6d22-488c-8747-e2fbc2d91429.mp4

If you wish me to add more clients, feel free to open an issue.
