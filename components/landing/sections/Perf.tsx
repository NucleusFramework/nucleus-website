import * as React from 'react';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { RuntimeModeCards } from './RuntimeModeCards';

export function Perf() {
  return (
    <section className="perf" id="perf">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Two runtimes, one binary"
          title={<>Pick your tradeoff. <span className="hero-grad">Win either way.</span></>}
          subtitle="Nucleus is the only desktop framework where the same Kotlin code ships two ways: as a GraalVM native image — for instant cold start and a tiny resident set — or on a modern JDK with AOT cache, where HotSpot's JIT delivers throughput approaching C++ and Rust on hot paths. Same source. Same build. Two runtimes."
        />
        <RuntimeModeCards/>
      </div>
    </section>
  );
}
