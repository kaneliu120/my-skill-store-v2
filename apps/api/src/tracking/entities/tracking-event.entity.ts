import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tracking_events')
export class TrackingEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_name: string;

  @Column({ nullable: true })
  element_id: string;

  @Column()
  page_url: string;

  @Column({ nullable: true })
  user_id: number;

  @Column('jsonb', { nullable: true }) // Use jsonb for better performance/querying if supported, else json
  metadata: any;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  user_agent: string;

  @CreateDateColumn()
  created_at: Date;
}
