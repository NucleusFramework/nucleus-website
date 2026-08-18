import * as React from 'react';
import { type Lang, communityT, pick } from '@/lib/landing-i18n';
import { SITE } from '@/lib/site';
import { SlackIcon } from '@/components/icons/Slack';

interface CommunityProps {
  lang: Lang;
}

export function Community({ lang }: CommunityProps) {
  return (
    <section className="community" id="community">
      <div className="section-inner">
        <div className="community-card">
          <div className="community-icon" aria-hidden="true">
            <SlackIcon size={22} />
          </div>
          <div className="community-copy">
            <h2 className="community-title">{pick(communityT.title, lang)}</h2>
            <p className="community-body">{pick(communityT.body, lang)}</p>
          </div>
          <div className="community-actions">
            <a href={SITE.slack} className="btn btn-primary" target="_blank" rel="noreferrer">
              {pick(communityT.cta, lang)}
            </a>
            <a href={SITE.slackInvite} className="community-invite" target="_blank" rel="noreferrer">
              {pick(communityT.invite, lang)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
