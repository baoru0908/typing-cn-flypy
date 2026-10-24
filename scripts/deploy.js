// 把 dist/ 发布到 GitHub Pages（gh-pages 分支）
// 用法: npm run deploy   （会先 build，再推送）
//
// 为什么不用 gh-pages 包：v3 没有 --no-history，每次发布都会在 gh-pages 上叠一个
// 约 19MB 的提交（14MB 中文字体），发几次分支历史就没法看了。
// 这里在临时目录 git init → 单次提交 → 强制推送，分支上永远只有一个提交。
const { execSync } = require('child_process');
const FS = require('fs');
const OS = require('os');
const Path = require('path');
const chalk = require('chalk');

const ROOT = Path.join(__dirname, '..');
const DIST = Path.join(ROOT, 'dist');
const BRANCH = 'gh-pages';

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });
const capture = (cmd, cwd) => execSync(cmd, { cwd, encoding: 'utf8' }).trim();

/**
 * 用仓库真实的 origin，**不要**读 package.json 的 repository ——
 * 那是原作者的项目地址（gitee.com/barneyZhao/typing-cn），
 * 照它推会把产物推到别人的仓库上去（也推不上去）。
 * 顺带把 https 形式换成 ssh，因为本机 Git 走的是 SSH key。
 */
const resolveRemote = () => {
    const url = capture('git remote get-url origin', ROOT);
    const m = /github\.com[/:]([^/]+)\/(.+?)(?:\.git)?$/.exec(url);
    if (!m) return url;
    return `git@github.com:${m[1]}/${m[2].replace(/\.git$/, '')}.git`;
};

if (!FS.existsSync(Path.join(DIST, 'index.html'))) {
    console.error(chalk.red('\n dist/index.html 不存在，请先 npm run build \n'));
    process.exit(1);
}

const remote = resolveRemote();
const name = capture('git config user.name', ROOT);
const email = capture('git config user.email', ROOT);
const message = `deploy: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;

console.log(
    chalk.yellow(`\n  发布到 ${BRANCH} 分支\n  ${remote}\n  ${message}\n`)
);

const tmp = FS.mkdtempSync(Path.join(OS.tmpdir(), 'gh-pages-'));
try {
    // 复制产物（含 .nojekyll，git add -A 会把点文件一起带上）
    FS.cpSync(DIST, tmp, { recursive: true });

    run('git init -q', tmp);
    run(`git checkout -q -b ${BRANCH}`, tmp);
    run('git add -A', tmp);
    run(
        `git -c user.name="${name}" -c user.email="${email}" commit -q -m "${message}"`,
        tmp
    );
    run(`git push -q -f ${remote} ${BRANCH}:${BRANCH}`, tmp);

    console.log(chalk.green(`\n  发布成功\n`));
    console.log(
        chalk.cyan(
            `  访问地址: https://${/github\.com[/:]([^/]+)\/(.+?)(?:\.git)?$/.exec(remote)?.[1]}.github.io/${/github\.com[/:]([^/]+)\/(.+?)(?:\.git)?$/.exec(remote)?.[2]}/\n`
        )
    );
    console.log(
        chalk.gray(
            '  首次发布需要在仓库 Settings → Pages 里把 Source 设为 gh-pages 分支 /(root)\n'
        )
    );
} finally {
    FS.rmSync(tmp, { recursive: true, force: true });
}
