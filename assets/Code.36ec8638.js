import{r as s,j as n,a as c}from"./index.ab623644.js";import{T as h}from"./TypingArea.bd124a21.js";import{S as f}from"./SwapOutlined.f4a00626.js";import"./StatBar.e86c5253.js";const l=[{name:"JavaScript",code:`const sum = (arr) => arr.reduce((a, b) => a + b, 0);
console.log(sum([1, 2, 3, 4]));`},{name:"JavaScript",code:`class EventBus {
    constructor() {
        this.handlers = new Map();
    }

    on(type, fn) {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, new Set());
        }
        this.handlers.get(type).add(fn);
        return () => this.off(type, fn);
    }

    off(type, fn) {
        const set = this.handlers.get(type);
        if (set) set.delete(fn);
    }

    emit(type, payload) {
        const set = this.handlers.get(type);
        if (!set) return;
        for (const fn of set) {
            try {
                fn(payload);
            } catch (err) {
                console.error(type, err);
            }
        }
    }
}`},{name:"JavaScript",code:`async function fetchWithRetry(url, retries = 3, delay = 200) {
    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return await res.json();
        } catch (err) {
            if (attempt === retries) throw err;
            await new Promise((r) => setTimeout(r, delay * attempt));
        }
    }
}`},{name:"TypeScript",code:`interface User {
	id: number;
	name: string;
}
const greet = (u: User): string => \`hi \${u.name}\`;`},{name:"TypeScript",code:`type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };

function unwrap<T, E>(r: Result<T, E>): T {
    if (r.ok) {
        return r.value;
    }
    throw r.error;
}

function map<T, U, E>(r: Result<T, E>, fn: (v: T) => U): Result<U, E> {
    return r.ok ? { ok: true, value: fn(r.value) } : r;
}`},{name:"TypeScript",code:`class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    get size(): number {
        return this.items.length;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}`},{name:"Python",code:`def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`},{name:"Python",code:`from dataclasses import dataclass
from typing import Iterator


@dataclass(frozen=True)
class Point:
    x: float
    y: float

    def distance(self, other: "Point") -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5


def grid(width: int, height: int) -> Iterator[Point]:
    for row in range(height):
        for col in range(width):
            yield Point(col, row)


if __name__ == "__main__":
    pts = list(grid(3, 2))
    print(len(pts), pts[0].distance(pts[-1]))`},{name:"Python",code:`import re
from collections import Counter


def word_freq(text: str) -> Counter:
    words = re.findall(r"[a-z']+", text.lower())
    return Counter(words)


def top_n(text: str, n: int = 10):
    freq = word_freq(text)
    return freq.most_common(n)


if __name__ == "__main__":
    sample = "the quick brown fox jumps over the lazy dog the fox"
    for word, count in top_n(sample, 3):
        print(f"{word}: {count}")`},{name:"Java",code:`public class Main {
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}`},{name:"Java",code:`import java.util.List;
import java.util.Optional;

public class Repository<T extends Identifiable> {
    private final List<T> items;

    public Repository(List<T> items) {
        this.items = List.copyOf(items);
    }

    public Optional<T> findById(long id) {
        return items.stream()
                .filter(item -> item.getId() == id)
                .findFirst();
    }

    public List<T> snapshot() {
        return List.copyOf(items);
    }
}`},{name:"Java",code:`public class BinarySearch {
    public static int search(int[] arr, int target) {
        int lo = 0;
        int hi = arr.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) {
                return mid;
            }
            if (arr[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return -1;
    }
}`},{name:"C",code:`#include <stdio.h>

int main(void) {
    printf("hello, world\\n");
    return 0;
}`},{name:"C",code:`#include <stdlib.h>
#include <string.h>

typedef struct {
    char **data;
    size_t len;
    size_t cap;
} Vec;

static int vec_push(Vec *v, char *s) {
    if (v->len == v->cap) {
        size_t next = v->cap ? v->cap * 2 : 8;
        char **grown = realloc(v->data, next * sizeof(char *));
        if (!grown) return -1;
        v->data = grown;
        v->cap = next;
    }
    v->data[v->len++] = s;
    return 0;
}

static void vec_free(Vec *v) {
    for (size_t i = 0; i < v->len; i++) {
        free(v->data[i]);
    }
    free(v->data);
}`},{name:"C",code:`#include <stdio.h>

static void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void bubble_sort(int *arr, size_t n) {
    for (size_t i = 0; i + 1 < n; i++) {
        int swapped = 0;
        for (size_t j = 0; j + 1 < n - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}`},{name:"Go",code:`func main() {
	ch := make(chan int, 1)
	ch <- 42
	fmt.Println(<-ch)
}`},{name:"Go",code:`package main

import (
    "fmt"
    "sync"
)

type Counter struct {
    mu    sync.Mutex
    value int
}

func (c *Counter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}

func main() {
    var wg sync.WaitGroup
    c := &Counter{}
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            c.Inc()
        }()
    }
    wg.Wait()
    fmt.Println(c.Value())
}`},{name:"Go",code:`package main

import (
    "errors"
    "fmt"
    "strconv"
)

func parsePort(s string) (int, error) {
    port, err := strconv.Atoi(s)
    if err != nil {
        return 0, fmt.Errorf("parse port: %w", err)
    }
    if port < 1 || port > 65535 {
        return 0, errors.New("port out of range")
    }
    return port, nil
}

func main() {
    p, err := parsePort("8080")
    fmt.Println(p, err)
}`},{name:"Rust",code:`fn main() {
    let mut v = vec![1, 2, 3];
    v.iter().map(|x| x * 2).for_each(|x| print!("{} ", x));
}`},{name:"Rust",code:`use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct Cache {
    entries: HashMap<String, String>,
    hits: usize,
    misses: usize,
}

impl Cache {
    pub fn new() -> Self {
        Self { entries: HashMap::new(), hits: 0, misses: 0 }
    }

    pub fn get(&mut self, key: &str) -> Option<String> {
        match self.entries.get(key) {
            Some(v) => {
                self.hits += 1;
                Some(v.clone())
            }
            None => {
                self.misses += 1;
                None
            }
        }
    }

    pub fn put(&mut self, key: String, value: String) {
        self.entries.insert(key, value);
    }
}`},{name:"Rust",code:`pub enum Shape {
    Circle { radius: f64 },
    Rect { width: f64, height: f64 },
    Triangle { base: f64, height: f64 },
}

impl Shape {
    pub fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
            Shape::Rect { width, height } => width * height,
            Shape::Triangle { base, height } => 0.5 * base * height,
        }
    }
}`},{name:"Shell",code:`for f in *.log; do
    echo "$f: $(wc -l < "$f") lines"
done`},{name:"Shell",code:`#!/usr/bin/env bash
set -euo pipefail

SRC="\${1:-.}"
OUT="\${2:-backup.tar.gz}"

if [[ ! -d "$SRC" ]]; then
    echo "no such dir: $SRC" >&2
    exit 1
fi

tar -czf "$OUT" -C "$(dirname "$SRC")" "$(basename "$SRC")"
echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"`},{name:"Shell",code:`#!/usr/bin/env bash
# \u627E\u51FA\u76EE\u5F55\u4E0B\u6700\u5927\u7684 10 \u4E2A\u6587\u4EF6
find "\${1:-.}" -type f -printf '%s %p
' 2>/dev/null |
    sort -rn |
    head -10 |
    while read -r size path; do
        printf '%8.1fK  %s
' "$(echo "scale=1; $size/1024" | bc)" "$path"
    done`},{name:"SQL",code:`SELECT name, COUNT(*) AS total
FROM orders
WHERE created_at > '2024-01-01'
GROUP BY name
ORDER BY total DESC;`},{name:"SQL",code:`WITH monthly AS (
    SELECT
        date_trunc('month', created_at) AS month,
        user_id,
        SUM(amount) AS spend
    FROM orders
    WHERE status = 'paid'
    GROUP BY 1, 2
)
SELECT
    month,
    COUNT(DISTINCT user_id) AS buyers,
    ROUND(AVG(spend), 2) AS avg_spend,
    MAX(spend) AS top_spend
FROM monthly
GROUP BY month
ORDER BY month DESC;`},{name:"SQL",code:`SELECT
    p.id,
    p.title,
    p.price,
    c.name AS category,
    COALESCE(AVG(r.score), 0) AS rating,
    COUNT(DISTINCT r.id) AS review_count
FROM products p
JOIN categories c ON c.id = p.category_id
LEFT JOIN reviews r ON r.product_id = p.id
WHERE p.deleted_at IS NULL
    AND p.price BETWEEN 10 AND 500
GROUP BY p.id, p.title, p.price, c.name
HAVING COUNT(DISTINCT r.id) >= 5
ORDER BY rating DESC, p.price ASC
LIMIT 50;`},{name:"HTML",code:`<div class="card">
  <h2>Title</h2>
  <p>Some description here.</p>
</div>`},{name:"HTML",code:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Demo Page</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="site-header">
    <nav aria-label="Main">
      <a href="/">Home</a>
      <a href="/docs">Docs</a>
    </nav>
  </header>
  <main id="app"></main>
</body>
</html>`},{name:"HTML",code:`<form action="/subscribe" method="post">
  <fieldset>
    <legend>Subscribe</legend>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
    <label>
      <input type="checkbox" name="agree" value="yes">
      I agree to the terms
    </label>
    <button type="submit">Sign up</button>
  </fieldset>
</form>`}],p=Array.from(new Set(l.map(t=>t.name))),u=(t,o)=>{let r=l.filter(i=>i.name===t);if(r.length>1&&o){const i=r.filter(d=>d.code!==o);i.length&&(r=i)}const a=r.length?r:l;return a[Math.floor(Math.random()*a.length)].code},y=()=>{const[t,o]=s.exports.useState(p[0]),[r,a]=s.exports.useState(()=>u(p[0])),i=s.exports.useCallback(e=>{o(e),a(u(e))},[]),d=s.exports.useCallback(()=>{a(e=>u(t,e))},[t]),m=s.exports.useMemo(()=>l.filter(e=>e.name===t).length,[t]);return n("div",{className:"Code page",children:c("div",{className:"page__inner",children:[c("div",{className:"page__toolbar",children:[c("div",{className:"chips chips--scroll",children:[n("span",{className:"chips__label",children:"\u8BED\u8A00"}),p.map(e=>n("button",{type:"button",tabIndex:-1,className:`chips__item ${t===e?"is-active":""}`,onClick:()=>i(e),children:e},e))]}),c("button",{type:"button",tabIndex:-1,className:"ghost-btn",onClick:d,children:[n(f,{}),"\u6362\u4E00\u9898",n("span",{className:"ghost-btn__count",children:m})]})]}),n(h,{text:r,expandTabs:!0,variant:"code"})]})})};export{y as default};
