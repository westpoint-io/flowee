import { useEffect, useState } from 'react';
import styles from './flowee.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useHoverEffect } from '../hooks/index/useHover';

export default function Home(): JSX.Element {
  const { hoverEffect } = useHoverEffect();

  return (
    <main className={`${styles['main-content']}`}>
      <section className={`${styles['main-content-text']}`}>
        <h1 className={`${styles['font-weight-400']} ${styles['text-5xl']} ${styles['margin-bot-1_5']}`}>Flowee</h1>
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
          <a className={`${styles['documentation-button']}`} href={useBaseUrl('/docs/Introduction')}>
            <span className={`${styles['text-sm']}`}>Documentation</span>
            <img className={`${styles['documentation-icon']}`} src={useBaseUrl('/public/documentation.svg')} alt="documentation icon" />
          </a>
        </section>
      </section>

      <div className="flip-container">
        <div className="flipper" style={{ transform: hoverEffect ? 'rotateY(180deg)' : 'none' }}>
          <div className="front">
            <img className={`${styles['rounded-lg']} ${styles['shadows-gift']}`} src={useBaseUrl('/public/terminal.gif')} alt="Imagen 1" />
          </div>
          <div className="back">
            <img src={useBaseUrl('/public/diagram.png')} alt="Imagen 2" />
          </div>
        </div>
      </div>
    </main>
  );
}
