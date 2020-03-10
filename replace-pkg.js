#!/usr/bin/env node
const { join } = require('path')

const VERSION = process.argv[2]
const DEST_DIR = process.argv[3]
const CWD = process.cwd()

const prodPkg = require(join(CWD, './package.json'))
prodPkg.version = VERSION
require('fs').writeFileSync(join(CWD, DEST_DIR, 'package.json'), JSON.stringify(prodPkg, null, 2))
