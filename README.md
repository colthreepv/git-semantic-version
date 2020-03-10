# git-semantic-version
Simple versioning system compatible with semver, based on git. Dockerizable

This is the personal project I use to produce versions in fast-moving git projects, or 1-man projects  
It produces a semver-compatible version based on **git tags** and the difference of commits from the last tag  

**WARNING:** it expects tags with only `{MAJOR}.{MINOR}` numbers, ex: `v1.4`, `0.8`, `2.0`

Example: last tag is `v1.4`, since that, 2 commits have been made, the resulting version would be: `1.4.2-sha1`

**State of the library**: midnight hack 😱 be careful using this.

# Commands

### git-semantic-version
```
git-semantic-version [directory]
```
`directory` is optional, if not provided, it will use the `Current Working Directory`

# git-semantic-replace
```
git-semantic-replace <valid semver> <destination directory>`
```
This is an helper for node.js projects, it helps replacing the value inside _package.json_ `version` field  
It **requires** a source package.json in the **Current Working Directory**

# Docker build
```
docker build -t git-semantic-version:test .
```

```
docker run --rm -v $(pwd):/repo git-semantic-version:test
```
