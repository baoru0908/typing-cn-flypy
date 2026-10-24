// 英文打字练习语料，按长度分三档
// short  短句：单句，适合热身与速度训练
// medium 段落：两三句成段，兼顾节奏与上下文
// long   长文：完整段落，练持续输入与耐力
export const englishSentences: { level: string; text: string }[] = [
    // ---------- 短句 ----------
    { level: 'short', text: 'The quick brown fox jumps over the lazy dog.' },
    { level: 'short', text: 'Practice makes perfect.' },
    { level: 'short', text: 'A journey of a thousand miles begins with one step.' },
    { level: 'short', text: 'Keep it simple and straightforward.' },
    { level: 'short', text: 'Time flies when you are having fun.' },
    { level: 'short', text: 'Actions speak louder than words.' },
    { level: 'short', text: 'Better late than never.' },
    { level: 'short', text: 'Every cloud has a silver lining.' },
    { level: 'short', text: 'Where there is a will, there is a way.' },
    { level: 'short', text: 'The early bird catches the worm.' },
    { level: 'short', text: 'A picture is worth a thousand words.' },
    { level: 'short', text: 'Fortune favours the bold.' },
    { level: 'short', text: 'Knowledge is power.' },
    { level: 'short', text: 'The best time to plant a tree was twenty years ago.' },
    { level: 'short', text: 'Slow and steady wins the race.' },

    // ---------- 段落 ----------
    {
        level: 'medium',
        text: 'The best way to predict the future is to invent it. Most people overestimate what they can do in one year and underestimate what they can do in ten.',
    },
    {
        level: 'medium',
        text: 'Simplicity is the ultimate sophistication. It takes a lot of hard work to make something look simple, and even more to keep it that way.',
    },
    {
        level: 'medium',
        text: 'Talk is cheap. Show me the code. Anyone can write a plan, but only the ones who ship it get to call themselves engineers.',
    },
    {
        level: 'medium',
        text: 'Stay hungry, stay foolish. The curiosity that made you ask questions as a child is the same tool you need now, only sharper.',
    },
    {
        level: 'medium',
        text: 'In the middle of difficulty lies opportunity. Every obstacle is a signal that you are close to something worth having.',
    },
    {
        level: 'medium',
        text: 'A room without books is like a body without a soul. Read widely, and let the ideas collide until something new falls out.',
    },
    {
        level: 'medium',
        text: 'Whether you think you can or you cannot, you are right. Confidence is not the absence of doubt but the decision to move anyway.',
    },
    {
        level: 'medium',
        text: 'The only way to do great work is to love what you do. If you have not found it yet, keep looking and do not settle for less.',
    },
    {
        level: 'medium',
        text: 'Good code is its own best documentation. When you are about to add a comment, ask how you could improve the code instead.',
    },
    {
        level: 'medium',
        text: 'The function of good software is to make the complex appear simple. Every feature you remove is a feature nobody has to learn.',
    },

    // ---------- 长文 ----------
    {
        level: 'long',
        text: 'Programs must be written for people to read, and only incidentally for machines to execute. A compiler will accept almost anything you throw at it, but the next person to open that file deserves better. Structure the code so that the intent survives the handoff, name things for what they mean rather than how they are stored, and let the tests carry the weight of the explanation.',
    },
    {
        level: 'long',
        text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. The machine is satisfied by any valid instruction stream, so it is a remarkably low bar. The real work begins the moment you imagine a colleague reading your file at two in the morning, trying to fix a bug you left behind.',
    },
    {
        level: 'long',
        text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. Every extra knob is a decision someone else has to make, and every optional feature is a path you have to test. Strip the design back until removing anything else would break the promise it makes.',
    },
    {
        level: 'long',
        text: 'Walking on water and developing software from a specification are easy if both are frozen. Requirements drift because the world moves, not because anyone is careless. The discipline is not resisting change but building something that survives it, so the cost of being wrong stays low.',
    },
    {
        level: 'long',
        text: 'There are only two hard things in computer science: cache invalidation, naming things, and off-by-one errors. The joke endures because each of those problems hides a small decision that looks trivial and turns out to be load bearing. Slow down on the small decisions, because that is where the bugs live.',
    },
    {
        level: 'long',
        text: 'The most disastrous thing you can ever learn is your first programming language. It teaches you a way to think, and for a while that way feels like the only way. Read code written in other languages, not to switch but to widen the range of shapes you can reach for when a problem arrives.',
    },
    {
        level: 'long',
        text: 'Measuring programming progress by lines of code is like measuring aircraft building progress by weight. Volume tells you nothing about whether the thing flies. What matters is how much of the problem you have actually retired, and how confidently you can prove it still works tomorrow.',
    },
    {
        level: 'long',
        text: 'Before software can be reusable it first has to be usable. Almost every abstraction that eventually paid for itself started life as a clumsy concrete solution that got copied three times. Write the concrete version first, and let the shape of the abstraction emerge from the second and third copies.',
    },
];
