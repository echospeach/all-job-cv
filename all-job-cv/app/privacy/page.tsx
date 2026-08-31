export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Legal
        </p>
        <h1 className="mb-2 text-2xl font-semibold text-[#202A3C]">Privacy Policy</h1>
        <p className="mb-8 text-sm text-[#8B8578]">Last updated: 31 August 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-[#3A3833]">
          <p>
            ALL JOB CV ("we", "us", "our") is currently operated by an individual based in the
            United Kingdom. This policy explains what personal data we collect when you use ALL
            JOB CV, why we collect it, and what rights you have over it.
          </p>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">1. What we collect</h2>
            <ul className="ml-5 list-disc space-y-1">
              <li>Account details: name, email address, and a securely hashed password if you sign up with email.</li>
              <li>If you sign in with Google, we receive your name, email, and profile photo from Google.</li>
              <li>CV content you choose to enter: contact details, work history, education, skills, and any photo you upload.</li>
              <li>Payment information processed by Stripe. We never see or store your card details directly.</li>
              <li>Usage data such as which jobs you view or mark as applied.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">2. How we use it</h2>
            <ul className="ml-5 list-disc space-y-1">
              <li>To create and manage your account and CVs.</li>
              <li>To generate PDF exports of your CV.</li>
              <li>To match your CV against job listings using Anthropic's Claude AI. Relevant parts of your CV content are sent to Anthropic for this purpose.</li>
              <li>To process payments for subscriptions and one-time template unlocks via Stripe.</li>
              <li>To show you job listings sourced from Adzuna's API.</li>
              <li>To send you service-related communications, such as sign-in confirmations.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">3. Who we share data with</h2>
            <p className="mb-2">We use the following third-party services to operate ALL JOB CV:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong>Google</strong> — for sign-in, if you choose that option.</li>
              <li><strong>Stripe</strong> — for processing payments. See Stripe's own privacy policy for how they handle payment data.</li>
              <li><strong>Anthropic</strong> — to power AI-based job matching. Your CV content is sent to their API for this purpose only.</li>
              <li><strong>Adzuna</strong> — the source of job listing data shown in search and matches.</li>
              <li><strong>Supabase</strong> — our database and file storage provider (including uploaded CV photos).</li>
              <li><strong>Vercel</strong> — our hosting provider.</li>
            </ul>
            <p className="mt-2">We do not sell your personal data to anyone.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">4. Your rights</h2>
            <p>
              If you are in the UK or EU, you have the right to access, correct, delete, or export
              your personal data, and to object to certain processing. You can delete individual
              CVs yourself from the "My CVs" page. To request full account deletion or export,
              contact us using the details below.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">5. Data retention</h2>
            <p>
              We keep your account and CV data for as long as your account is active. If you
              request deletion, we remove your data within a reasonable time, except where we're
              required to retain records (for example, payment records for tax purposes).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">6. Cookies</h2>
            <p>
              We use essential cookies to keep you signed in. We do not use advertising or
              tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">7. Children</h2>
            <p>
              ALL JOB CV is not directed at children. You must be at least 18 years old, or the
              age of majority in your jurisdiction, to use this service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">8. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. We'll update the "Last updated" date
              above when we do.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">9. Contact us</h2>
            <p>
              For any questions about this policy or your data, contact us at{" "}
              <a href="mailto:echospeach@gmail.com" className="text-[#3F6C51] hover:underline">
                echospeach@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
