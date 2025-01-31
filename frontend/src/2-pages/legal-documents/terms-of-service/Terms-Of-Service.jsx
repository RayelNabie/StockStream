export default function Terms() {
  return (
    <article className="p-6 rounded-md shadow max-w-3xl mx-auto">
      {/* 🔹 Hoofdtitel */}
      <header>
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="mb-2">
          <strong>Last updated:</strong> February 06, 2024
        </p>
        <p className="mb-4">
          Please read these terms and conditions carefully before using Our
          Service.
        </p>
      </header>

      {/* 🔹 Interpretation and Definitions */}
      <section>
        <h2 className="text-2xl font-semibold mt-4 mb-2">
          Interpretation and Definitions
        </h2>

        <article>
          <h3 className="text-xl font-semibold mt-2">Interpretation</h3>
          <p>
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions.
          </p>
        </article>

        <article>
          <h3 className="text-xl font-semibold mt-2">Definitions</h3>
          <ul className="list-disc list-inside mt-2">
            <li>
              <strong>Affiliate:</strong> An entity that controls, is controlled
              by, or is under common control with a party.
            </li>
            <li>
              <strong>Country:</strong> Ontario, Canada.
            </li>
            <li>
              <strong>Company:</strong> Referred to as either{" "}
              {'"the Company", "We", "Us" or "Our"'}.
            </li>
            <li>
              <strong>Device:</strong> Any device that can access the Service
              such as a computer, cellphone, or tablet.
            </li>
            <li>
              <strong>Service:</strong> Refers to the Website.
            </li>
            <li>
              <strong>Website:</strong> Refers to Pandem, accessible from{" "}
              <a
                href="http://pandem.dev/"
                className="text-blue-600 hover:underline"
              >
                http://pandem.dev/
              </a>
            </li>
          </ul>
        </article>
      </section>

      {/* 🔹 Acknowledgment */}
      <section>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Acknowledgment</h2>
        <p>
          These are the Terms and Conditions governing the use of this Service
          and the agreement that operates between You and the Company.
        </p>
      </section>

      {/* 🔹 Links to Other Websites */}
      <section>
        <h2 className="text-2xl font-semibold mt-4 mb-2">
          Links to Other Websites
        </h2>
        <p>
          Our Service may contain links to third-party websites that are not
          owned or controlled by the Company.
        </p>
      </section>

      {/* 🔹 Termination */}
      <section>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Termination</h2>
        <p>
          We may terminate or suspend Your access immediately if You breach
          these Terms and Conditions.
        </p>
      </section>

      {/* 🔹 Governing Law */}
      <section>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Governing Law</h2>
        <p>
          The laws of the Country, excluding its conflicts of law rules, shall
          govern these Terms.
        </p>
      </section>

      {/* 🔹 Disputes Resolution */}
      <section>
        <h2 className="text-2xl font-semibold mt-4 mb-2">
          Disputes Resolution
        </h2>
        <p>
          If You have any dispute about the Service, You agree to first try to
          resolve it informally by contacting the Company.
        </p>
      </section>

      {/* 🔹 Contact Us */}
      <section>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Contact Us</h2>
        <p>
          If you have any questions about these Terms and Conditions, you can
          contact us:
        </p>
        <ul className="list-inside">
          <li>
            By email:{" "}
            <a
              href="mailto:myemail@gmail.com"
              className="text-blue-600 hover:underline"
            >
              myemail@gmail.com
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
