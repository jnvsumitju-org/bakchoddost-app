export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">About Bakchoddost</h1>
        <p className="text-sm text-muted">Thodi Hindi, thodi Hinglish, thodi bakchodi.</p>
      </header>

      <section className="rounded-lg border p-6 bg-card text-card-foreground">
        <h2 className="text-xl font-semibold">What is this?</h2>
        <p className="mt-2 text-sm leading-6">
          Bakchod Dost is that one dost in your group jo har baat ko shayari aur mazaak mein badal deta hai.
          Yahan, we create personalized poems for you and your friends — quick, fun, and full of dosti vibes.
        </p>
      </section>

      <section className="rounded-lg border p-6 bg-card text-card-foreground">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ol className="mt-3 text-sm leading-6 list-decimal ml-5 space-y-1">
          <li>Apna naam daalo (your name).</li>
          <li>Apne doston ke naam daalo (one ya pura gang).</li>
          <li>Click “Generate Poem” → aur ho gaya kaam! 🎉</li>
        </ol>
        <p className="mt-2 text-sm leading-6">A poem will appear jisme aapke aur aapke doston ke naam honge.</p>
      </section>

      <section className="rounded-lg border p-6 bg-card text-card-foreground">
        <h2 className="text-xl font-semibold">Why we made this</h2>
        <ul className="mt-3 text-sm leading-6 list-disc ml-5 space-y-1">
          <li>Shayari maar deta hai bina context ke.</li>
          <li>Sabke naam se rhyme bana deta hai.</li>
          <li>Thodi bakchodi karke sabko hasa deta hai.</li>
        </ul>
        <p className="mt-2 text-sm leading-6">So we thought — why not make a website that does the same? 😎</p>
      </section>

      <section className="rounded-lg border p-6 bg-card text-card-foreground">
        <h2 className="text-xl font-semibold">What’s next</h2>
        <ul className="mt-3 text-sm leading-6 list-disc ml-5 space-y-1">
          <li>More poem templates.</li>
          <li>User submissions — register and submit your own poems.</li>
          <li>Maybe even merch with your dost’s names (mugs, tees, etc.).</li>
        </ul>
      </section>

      <section className="rounded-lg border p-6 bg-card text-card-foreground">
        <h2 className="text-xl font-semibold">Our promise</h2>
        <ul className="mt-3 text-sm leading-6 list-disc ml-5 space-y-1">
          <li>Free to use</li>
          <li>Masti-filled</li>
          <li>Relatable for every dost gang</li>
        </ul>
        <p className="mt-4 text-sm leading-6">
          👉 Next time jab koi bole “kuch shayari sunao”, bas bolo:
          <span className="font-semibold"> “Ek sec, Bakchod Dost khol leta hoon.”</span> 😏
        </p>
      </section>
    </div>
  );
}


