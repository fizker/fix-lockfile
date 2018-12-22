fix-lockfile
============

A small utility for reverting integrity-only changes in the NPM lockfiles. It does this by analyzing the lockfile and discard changes to any package that is only an integrity change.

Note: This tool requires that your project uses [git](http://git-scm.org), since it uses git to find the unmodified lockfile.


Usage
-----

The expected usage is to execute this after generating a lockfile. The steps are the following:

First, add the NPM hook to `package.json`:

```
...
"scripts": {
	...
	"postshrinkwrap": "fix-lockfile package-lock.json",
},
...
```

Note: If your project uses `npm-shrinkwrap.json` instead of `package-lock.json`,  update the reference in the script.

Then install the package:

```
npm install --save-dev @fizker/fix-lockfile
```

That's all there is to it. Any time NPM rebuilds the lockfile, including installing the `fix-lockfile`   dependency, the script will be executed and the lockfile will be cleaned of integrity-only changes.
