export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Legal
        </p>
        <h1 className="mb-2 text-2xl font-semibold text-[#202A3C]">Terms of Service</h1>
        <p className="mb-8 text-sm text-[#8B8578]">Last updated: 31 August 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-[#3A3833]">
          <p>
            These terms govern your use of ALL JOB CV. By creating an account or using the
            service, you agree to them. ALL JOB CV is currently operated by an individual based
            in the United Kingdom.
          </p>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">1. Your account</h2>
            <p>
              You must provide accurate information when creating an account. You're responsible
              for keeping your login credentials secure and for all activity under your account.
              You must be at least 18 years old to use ALL JOB CV.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">2. The service</h2>
            <p>
              ALL JOB CV lets you build a CV, export it as a PDF, search job listings, and see
              AI-generated matches between your CV and available jobs. Job listings are sourced
              from Adzuna and other third parties; we don't control their accuracy or
              availability, and a job appearing here doesn't mean we've verified its details
              (including any mention of visa sponsorship, salary, or working conditions). Always
              confirm details directly with the employer.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">3. Subscriptions and payments</h2>
            <ul className="ml-5 list-disc space-y-1">
              <li>Some templates require either a one-time unlock fee or an active monthly subscription.</li>
              <li>Subscriptions renew automatically each month until cancelled. You can cancel anytime from your Account page; you'll retain access until the end of the current billing period.</li>
              <li>One-time unlock fees apply to a specific CV and are non-refundable once the template is unlocked, except where required by law.</li>
              <li>Payments are processed by Stripe. We don't store your card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">4. Acceptable use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Use the service for any unlawful purpose.</li>
              <li>Upload content that is abusive, fraudulent, or infringes on someone else's rights.</li>
              <li>Attempt to disrupt, reverse-engineer, or gain unauthorized access to the service.</li>
              <li>Use automated tools to scrape or bulk-download job listings or CV templates.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">5. Your content</h2>
            <p>
              You retain ownership of the CV content and photos you upload. By using the service,
              you grant us permission to store and process that content to provide the service to
              you, including sending relevant parts of it to third-party AI providers for job
              matching, as described in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">6. No employment guarantee</h2>
            <p>
              ALL JOB CV is a tool to help you build a CV and find relevant listings. We don't
              guarantee that using it will result in a job offer, interview, or any particular
              outcome.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">7. Service availability</h2>
            <p>
              We aim to keep ALL JOB CV available and reliable, but we don't guarantee
              uninterrupted access. We may suspend or change the service, in whole or part, at
              any time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">8. Limitation of liability</h2>
            <p>
              To the extent permitted by law, ALL JOB CV is provided "as is" without warranties of
              any kind. We are not liable for indirect, incidental, or consequential damages
              arising from your use of the service, including reliance on job listing details
              provided by third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">9. Termination</h2>
            <p>
              You can stop using the service and delete your account at any time. We may suspend
              or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">10. Changes to these terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the service after
              changes take effect means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">11. Governing law</h2>
            <p>These terms are governed by the laws of England and Wales.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[#202A3C]">12. Contact us</h2>
            <p>
              Questions about these terms? Contact us at{" "}
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
