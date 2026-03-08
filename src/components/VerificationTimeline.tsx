import styles from './VerificationTimeline.module.css';
import { RecordCard } from './RecordCard';

interface TimelineEvent {
  event_id: string;
  employer_id: string;
  event_type: string;
  start_date: string;
  end_date: string;
  rehire_eligible: boolean;
  record_hash: string;
  status: 'verified' | 'pending' | 'disputed';
}

interface VerificationTimelineProps {
  events: TimelineEvent[];
}

export const VerificationTimeline = ({ events }: VerificationTimelineProps) => {
  return (
    <div className={styles.timeline}>
      {events.map((event, index) => (
        <div key={event.event_id} className={styles.item}>
          <div className={styles.markerContainer}>
            <div className={styles.marker} />
            {index !== events.length - 1 && <div className={styles.line} />}
          </div>
          <div className={styles.content}>
            <RecordCard
              employer_id={event.employer_id}
              event_type={event.event_type}
              start_date={event.start_date}
              end_date={event.end_date}
              record_hash={event.record_hash}
              rehire_eligible={event.rehire_eligible}
              disputed={event.status === 'disputed'}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
