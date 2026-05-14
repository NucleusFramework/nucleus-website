import * as React from 'react';
import { KmpPlatformRow } from './KmpPlatformRow';
import { OneLanguageBar } from './OneLanguageBar';

export function Pitch() {
  return (
    <section className="pitch">
      <div className="section-inner">

        <div className="pitch-header">
          <h2 className="pitch-h">
            Everywhere else, Kotlin owns the whole platform.<br/>
            <span className="hero-grad">Now desktop does too.</span>
          </h2>
          <p className="pitch-sub">
            On <span className="pitch-em">Android</span>, Kotlin and Compose are first-class citizens. On <span className="pitch-em">iOS</span>, Kotlin/Native reaches every UIKit and Foundation API while Compose renders like a true native app. On the <span className="pitch-em">web</span>, Kotlin/JS and Wasm draw Compose UIs with the full browser API surface. Desktop had only half of that — you could render a window, but reaching the OS meant <span className="pitch-em">juggling pointers, compiling native libraries per platform, wiring JNI or FFM bridges, and learning a different native API for every OS</span> — a wall most Kotlin developers couldn't climb. Nucleus closes the gap.
          </p>
        </div>

        <KmpPlatformRow/>

        <OneLanguageBar/>
      </div>
    </section>
  );
}
