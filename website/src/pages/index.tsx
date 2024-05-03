import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import './flowee.css';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (

      <main className="main-content">
        <section className="margin">
          <h1 className="text-5xl margin-bot-1_5">Flowee</h1>
          <p className="text-lg gray-light margin-bot-1_5 w-500">
            Generate AWS diagrams using your cloudformation templates as input
            directly from flowee CLI
          </p>
          <section className="flex gap-2 margin-top-1">
            <a className="github-button" href="https://github.com/westpoint-io/flowee">
              <span className="text-sm">Github</span>
              <img
                className="github-icon"
                src="/public/github.svg"
                alt="github icon"
              />
            </a>
            <a className="documentation-button" href="/docs/Getting_Started">
              <span className="text-sm">Documentation</span>
              <img
                className="documentation-icon"
                src="/public/documentation.svg"
                alt="documentation icon"
              />
            </a>
          </section>
        </section>
        <section className="">
          <img
            className="rounded-lg shadows-gift"
            src="/public/terminal.gif"
            alt=""
          />
        </section>
      </main>
  );
}
