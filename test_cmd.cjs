const { execSync } = require('child_process');

function run(cmd) {
  try {
    console.log(`Running: ${cmd}`);
    const out = execSync(cmd, { encoding: 'utf8' });
    console.log(`=> Output:\n${out}`);
  } catch (err) {
    console.log(`=> Error: ${err.message}`);
    if (err.stderr) {
       console.log(`=> Stderr: ${err.stderr.toString()}`);
    }
  }
}

run('python --version');
run('py --version');
run('python3 --version');
run('where python');
run('where py');
run('pip list');
