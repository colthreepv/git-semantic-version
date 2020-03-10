#!/usr/bin/env node
const { execSync } = require('child_process')
const { statSync } = require('fs')
const { join } = require('path')
const directory = process.argv[2] || process.cwd()

function checkDir (dir) {
  try {
    const stat = statSync(dir)
    if (stat.isDirectory() === false) {
      console.error('Provided path is not directory:', dir)
      process.exit(1)
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('Provided path not found:', dir)
      process.exit(2)
    }

    console.error(err)
    process.exit(3)
  }
}

checkDir(directory)

const gitTagsOptions = {
  encoding: 'utf8',
  stdio: [],
}
if (directory != null) gitTagsOptions.cwd = directory

const gitDescribeOptions = { encoding: 'utf8' }
if (directory != null) gitDescribeOptions.cwd = directory

checkDir(join(directory, '.git'))

let hasTags = false
try {
  execSync('git describe --tags', gitTagsOptions)
  hasTags = true
} catch (err) {}

if (hasTags === false) {
  const rev = execSync('git describe --tags --always', gitDescribeOptions)
  console.log(`0.0.0-${rev.slice(0,4)}`)
  return
}

const gitVersion = execSync('git describe --tags --always', gitDescribeOptions)
const { base, minor, rev } = gitVersion.match(/(?<base>\d+\.\d+)(-(?<minor>\d+)?-g(?<rev>\w+))?/).groups

let simpleVersion
if (minor == null) {
  simpleVersion = `${base}.0`
} else {
  simpleVersion = `${base}.${minor}-${rev.slice(0,4)}`
}

console.log(simpleVersion)
