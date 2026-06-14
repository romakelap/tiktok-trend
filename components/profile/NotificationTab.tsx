import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { ProfileData } from '@/lib/profile/mock-data';
import { I } from './Icons';
import { SectionCard } from './SectionCard';
import { Toggle } from './FormElements';

interface NotificationTabProps {
  data: ProfileData;
  toggleNotif: (key: string) => void;
}

export function NotificationTab({ data, toggleNotif }: NotificationTabProps) {
  return (
    <div className="max-w-2xl space-y-4">
      <SectionCard title="Preferensi Notifikasi" icon={<I.Bell className="w-3.5 h-3.5" />}>
        <div className="space-y-0">
          {data.notifications.map((n, i) => (
            <div
              key={n.key}
              className="flex items-center justify-between py-4"
              style={{
                borderBottom: i < data.notifications.length - 1 ? `1px solid ${TOKENS.divider}` : 'none',
              }}
            >
              <div className="flex-1 pr-4">
                <p className="font-black text-sm" style={{ color: TOKENS.text }}>
                  {n.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: TOKENS.textMuted }}>
                  {n.desc}
                </p>
              </div>
              <Toggle enabled={n.enabled} onChange={() => toggleNotif(n.key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Notification channels */}
      <SectionCard title="Channel Pengiriman" icon={<I.Mail className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          {[
            { label: 'Email', desc: data.email, enabled: true },
            { label: 'Push Notification', desc: 'Browser & mobile app', enabled: false },
            { label: 'WhatsApp', desc: 'Belum dihubungkan', enabled: false },
          ].map((ch, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: i < 2 ? `1px solid ${TOKENS.divider}` : 'none' }}
            >
              <div>
                <p className="font-black text-sm" style={{ color: TOKENS.text }}>
                  {ch.label}
                </p>
                <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                  {ch.desc}
                </p>
              </div>
              <Toggle enabled={ch.enabled} onChange={() => {}} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
