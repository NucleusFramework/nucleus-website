'use client';

import * as React from 'react';
import { useState } from 'react';
import { SectionHeading } from '@/components/landing/SectionHeading';

export function RuntimeChoice() {
  const [mode, setMode] = useState<'graal' | 'jvm'>('graal');
  const isGraal = mode === 'graal';

  // numbers driven by mode
  const cold = isGraal ? '0.5' : '1.0';
  const peak = isGraal ? '82' : '96';
  const ram = isGraal ? '35' : '120';
  const bin = isGraal ? '40' : '60';

  return (
    <section className="rc" id="runtime-choice">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Two runtimes, one Gradle DSL"
          title={<>Cold-start of a binary. <br/><span className="hero-grad">Throughput of the JVM.</span></>}
          subtitle="Most desktop frameworks force a tradeoff: instant boot at the price of peak performance, or peak performance at the price of a slow start. Nucleus lets you pick — or ship both, and let the user choose."
        />

        <div className="rc-tabs">
          <button
            className={`rc-tab ${isGraal ? 'is-active' : ''}`}
            onClick={() => setMode('graal')}
          >
            <span className="rc-tab-num">A</span>
            <div className="rc-tab-body">
              <div className="rc-tab-name">GraalVM Native Image</div>
              <div className="rc-tab-sub">Closed-world · ahead-of-time</div>
            </div>
            <div className="rc-tab-tag">Instant boot</div>
          </button>
          <button
            className={`rc-tab ${!isGraal ? 'is-active' : ''}`}
            onClick={() => setMode('jvm')}
          >
            <span className="rc-tab-num">B</span>
            <div className="rc-tab-body">
              <div className="rc-tab-name">JVM&nbsp;+&nbsp;AOT cache</div>
              <div className="rc-tab-sub">JDK&nbsp;25 · JIT-tiered with warm profile</div>
            </div>
            <div className="rc-tab-tag rc-tab-tag-alt">Peak throughput</div>
          </button>
        </div>

        <div className={`rc-stage ${isGraal ? 'is-graal' : 'is-jvm'}`}>
          <div className="rc-stage-numbers">
            <div className="rc-num">
              <div className="rc-num-k">Cold start</div>
              <div className="rc-num-v">{cold}<span>s</span></div>
              <div className="rc-num-bar">
                <div className="rc-num-fill" style={{ width: isGraal ? '45%' : '90%' }}/>
              </div>
            </div>
            <div className="rc-num">
              <div className="rc-num-k">Peak CPU throughput</div>
              <div className="rc-num-v">{peak}<span>%</span></div>
              <div className="rc-num-sub">{isGraal ? 'AOT compiled, no JIT escalation' : 'JIT-tiered, approaches C++/Rust on hot paths'}</div>
              <div className="rc-num-bar">
                <div className="rc-num-fill" style={{ width: `${peak}%` }}/>
              </div>
            </div>
            <div className="rc-num">
              <div className="rc-num-k">RAM at idle</div>
              <div className="rc-num-v">{ram}<span>MB</span></div>
              <div className="rc-num-bar">
                <div className="rc-num-fill" style={{ width: isGraal ? '26%' : '90%' }}/>
              </div>
            </div>
            <div className="rc-num">
              <div className="rc-num-k">Binary size</div>
              <div className="rc-num-v">{bin}<span>MB</span></div>
              <div className="rc-num-sub">{isGraal ? 'Self-contained, no JRE' : 'Pre-baked AOT cache included'}</div>
              <div className="rc-num-bar">
                <div className="rc-num-fill" style={{ width: isGraal ? '60%' : '90%' }}/>
              </div>
            </div>
          </div>

          <div className="rc-pros">
            {isGraal ? (
              <>
                <div className="rc-pro">
                  <span className="rc-pro-dot"/>
                  <div>
                    <div className="rc-pro-h">Instant. Really instant.</div>
                    <div className="rc-pro-d">~0.5&nbsp;s from <code>./MyApp</code> to first frame — feels like opening a config file.</div>
                  </div>
                </div>
                <div className="rc-pro">
                  <span className="rc-pro-dot"/>
                  <div>
                    <div className="rc-pro-h">No JRE to bundle</div>
                    <div className="rc-pro-d">One self-contained binary per OS. Smallest possible installer, no Java surprise for your users.</div>
                  </div>
                </div>
                <div className="rc-pro">
                  <span className="rc-pro-dot"/>
                  <div>
                    <div className="rc-pro-h">Nucleus resolves reflection for you</div>
                    <div className="rc-pro-d">All required <code>reflect-config</code>, <code>resource-config</code> and JNI metadata for every Nucleus module — auto-injected. Zero manual config.</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rc-pro">
                  <span className="rc-pro-dot rc-pro-dot-jvm"/>
                  <div>
                    <div className="rc-pro-h">HotSpot, the most-tuned JIT in the world</div>
                    <div className="rc-pro-d">Decades of escape analysis, inlining, vectorization. Hot paths approach hand-written C++ and Rust.</div>
                  </div>
                </div>
                <div className="rc-pro">
                  <span className="rc-pro-dot rc-pro-dot-jvm"/>
                  <div>
                    <div className="rc-pro-h">AOT cache fixes cold start</div>
                    <div className="rc-pro-d">JDK&nbsp;25&apos;s CDS / AOT cache pre-warms classes, profiles, and code — start in ~1&nbsp;s with a fully-tiered JIT ready to compile.</div>
                  </div>
                </div>
                <div className="rc-pro">
                  <span className="rc-pro-dot rc-pro-dot-jvm"/>
                  <div>
                    <div className="rc-pro-h">No closed-world constraints</div>
                    <div className="rc-pro-d">Reflection, dynamic class loading, agents, JFR profiling, ScriptEngine — all of it. Useful for plugin hosts, devtools, anything dynamic.</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rc-snippet">
          <div className="rc-snippet-label">Same DSL, one switch</div>
          <div className="rc-snippet-code">
            <span className="ck-fn">nucleus</span>.<span className="ck-fn">application</span> {'{'}
            <br/>
            {'    '}<span className="ck-fn">runtime</span> = <span className="ck-kw">if</span> (<span className="ck-num">isReleaseBuild</span>) Runtime.<span className={isGraal ? 'rc-snippet-emph' : ''}>NativeImage</span> <span className="ck-kw">else</span> Runtime.<span className={!isGraal ? 'rc-snippet-emph' : ''}>JvmWithAotCache</span>
            <br/>
            {'}'}
          </div>
        </div>
      </div>
    </section>
  );
}
