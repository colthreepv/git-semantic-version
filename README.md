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
# Using with Gitlab CI
A very popular CI runner is the Gitlab one, and for good reasons.  
Currently it does not support sharing environment variables between stages [(22638)][gitlab22638], but
when there is a limitation, usually there is a workaround.

Example `.gitlab-ci.yml` to build a git-versioned [Create React App][cra]
```yaml
.version: &version
  before_script:
    - export VERSION=$(head -1 version.txt)

stages:
  - version
  - build

make-version:
  <<: *version
  image: colthreepv/git-semantic-version:v1.0.0
  stage: version
  script:
    - VERSION=$(git-semantic-version)
    - echo $VERSION > version.txt
    - cat version.txt
  artifacts:
    paths: ['version.txt']
    expire_in: 1 day

build:
  <<: *version
  image: node:lts-alpine
  stage: build
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
    - node_modules/
  script:
    - echo $VERSION
    - echo "REACT_APP_VERSION=$VERSION" >> .env.production
    - yarn install
    - yarn build
  artifacts:
    paths: ['build/']
```

With this proof-of-concept `.gitlab-ci.yml` there will be a resulting environment variable in CRA that can be
retrieved in frontend code.

Another example with gitlab ci could be replacing the `version` in `package.json`

Example `.gitlab-ci.yml` to build a git-versioned node.js project
```yaml
stages:
  - version
  - build

make-version:
  image: colthreepv/git-semantic-version:v1.0.0
  stage: version
  script:
    - pwd
    - VERSION=$(git-semantic-version)
    - git-semantic-replace $VERSION .
    - cat package.json # this will print the git-semantic-version output
  artifacts:
    paths: ['package.json']
    expire_in: 1 day

build:
  image: node:lts-alpine
  stage: build
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
    - node_modules/
  script:
    - cat package.json # this will print the git-semantic-version output
    - yarn install
```

In this pipeline, the `package.json` present in the git repository gets overwritten by the artifact produced in
`make-version` stage.

# Other use-cases
[I am Open to extend this tool][pr], for any other use case feel free to open a [PR][pr]

[cra]: https://create-react-app.dev/
[gitlab22638]: https://gitlab.com/gitlab-org/gitlab/issues/22638
[pr]: https://github.com/colthreepv/git-semantic-version/pulls
