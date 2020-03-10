const VERSION = process.argv[2] || '0.0.0-empty'
const { base, minor, rev } = VERSION.match(/(?<base>\d+\.\d+)(-(?<minor>\d+)?-g(?<rev>\w+))?/).groups

let simpleVersion
if (minor == null) {
  simpleVersion = `${base}.0`
} else {
  simpleVersion = `${base}.${minor}-${rev.slice(0,4)}`
}

console.log(simpleVersion)
