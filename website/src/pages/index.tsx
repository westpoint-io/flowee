import styles from './flowee.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Home(): JSX.Element {
  return (
    <main className={`${styles['main-content']}`}>
      <section className={`${styles.margin}`}>
        <h1 className={`${styles['text-5xl']} ${styles['margin-bot-1_5']}`}>Flowee</h1>
        <p className={`${styles['text-lg']} ${styles['gray-light']} ${styles['margin-bot-1_5']} ${styles['w-500']}`}>
          Generate AWS diagrams using your cloudformation templates as input directly from flowee CLI
        </p>
        <section className={`${styles.flex} ${styles['gap-2']} ${styles['margin-top-1']}`}>
          <a
            className={`${styles['github-button']}`}
            href="https://github.com/westpoint-io/flowee"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className={`${styles['text-sm']}`}>Github</span>
            <img className={`${styles['github-icon']}`} src={useBaseUrl('public/github.svg')} alt="github icon" />
          </a>
          <a className={`${styles['documentation-button']}`} href={useBaseUrl('/docs/Getting_Started')}>
            <span className={`${styles['text-sm']}`}>Documentation</span>
            <img className={`${styles['documentation-icon']}`} src={useBaseUrl('/public/documentation.svg')} alt="documentation icon" />
          </a>
        </section>
      </section>
      <section className="">
        <img className={`${styles['rounded-lg']} ${styles['shadows-gift']}`} src={useBaseUrl('/public/terminal.gif')} alt="terminal gif" />
      </section>
    </main>
  );
}
