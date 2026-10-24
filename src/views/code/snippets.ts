// 常见编程语言范例代码：打字练习语料
// 每条形如 { name: 语言, code: 源码 }，缩进用制表符，引擎会展开为 4 空格
export interface CodeSnippet {
    name: string;
    code: string;
}

export const codeSnippets: CodeSnippet[] = [
    {
        name: 'JavaScript',
        code: `const sum = (arr) => arr.reduce((a, b) => a + b, 0);
console.log(sum([1, 2, 3, 4]));`,
    },
    {
        name: 'TypeScript',
        code: `interface User {
\tid: number;
\tname: string;
}
const greet = (u: User): string => \`hi \${u.name}\`;`,
    },
    {
        name: 'Python',
        code: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
    },
    {
        name: 'Java',
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}`,
    },
    {
        name: 'C',
        code: `#include <stdio.h>

int main(void) {
    printf("hello, world\\n");
    return 0;
}`,
    },
    {
        name: 'Go',
        code: `func main() {
\tch := make(chan int, 1)
\tch <- 42
\tfmt.Println(<-ch)
}`,
    },
    {
        name: 'Rust',
        code: `fn main() {
    let mut v = vec![1, 2, 3];
    v.iter().map(|x| x * 2).for_each(|x| print!("{} ", x));
}`,
    },
    {
        name: 'Shell',
        code: `for f in *.log; do
    echo "$f: $(wc -l < "$f") lines"
done`,
    },
    {
        name: 'SQL',
        code: `SELECT name, COUNT(*) AS total
FROM orders
WHERE created_at > '2024-01-01'
GROUP BY name
ORDER BY total DESC;`,
    },
    {
        name: 'HTML',
        code: `<div class="card">
  <h2>Title</h2>
  <p>Some description here.</p>
</div>`,
    },
];
