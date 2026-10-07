"use client";

import { ExternalLink } from "lucide-react";

const SMART_LINK =
  "https://www.profitableratecpmnetwork.com/eg7kr74ck8?key=97fea73887b6610970becac26b3ef0a1";

export default function AdsterraSmartLink() {
  return (
    <a
      href={SMART_LINK}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="inline-flex items-center gap-1 text-nexa-emerald hover:text-[color:var(--text-primary)]"
    >
      Click here to earn
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}
