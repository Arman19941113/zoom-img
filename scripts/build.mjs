import fs from 'fs-extra'
import { execSync } from 'child_process'

process.on('exit', exitCode => {
  if (exitCode === 1) {
    fs.removeSync('dist')
  }
})

const run = (command) => execSync(command, { stdio: 'inherit' })

await fs.remove('dist')
run('tsc --project tsconfig.json --rootDir src --outDir dist --declaration --emitDeclarationOnly')
run('rollup -c rollup.config.mjs')
