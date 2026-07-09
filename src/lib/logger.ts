import { supabase } from './supabase';

type LogLevel = 'info' | 'warn' | 'error';
type LogSource = 'frontend' | 'stripe' | 'supabase' | 'modal' | 'auth';

interface LogEntry {
  level: LogLevel;
  source: LogSource;
  message: string;
  details?: Record<string, any>;
  userId?: string;
  timestamp: string;
}

class Logger {
  private queue: LogEntry[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private isDev = import.meta.env.DEV;

  log(level: LogLevel, source: LogSource, message: string, details?: Record<string, any>) {
    const entry: LogEntry = {
      level, source, message, details,
      timestamp: new Date().toISOString(),
    };

    // Always console log in dev
    if (this.isDev) {
      const style = level === 'error' ? 'color: red' : level === 'warn' ? 'color: orange' : 'color: blue';
      console.log(`%c[HMC ${source.toUpperCase()}] ${message}`, style, details || '');
    }

    // Queue for Supabase logging in production
    if (!this.isDev) {
      this.queue.push(entry);
      this.scheduleFlush();
    }
  }

  info(source: LogSource, message: string, details?: Record<string, any>) {
    this.log('info', source, message, details);
  }

  warn(source: LogSource, message: string, details?: Record<string, any>) {
    this.log('warn', source, message, details);
  }

  error(source: LogSource, message: string, details?: Record<string, any>) {
    this.log('error', source, message, details);
    // Errors flush immediately
    this.flush();
  }

  private scheduleFlush() {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => this.flush(), 5000);
  }

  private async flush() {
    if (this.queue.length === 0) return;
    const batch = [...this.queue];
    this.queue = [];
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    try {
      await supabase.from('app_logs').insert(
        batch.map(entry => ({
          level: entry.level,
          source: entry.source,
          message: entry.message,
          details: entry.details,
          created_at: entry.timestamp,
        }))
      );
    } catch (err) {
      // Silent fail — don't log logging errors
      console.error('Logger flush failed:', err);
    }
  }
}

export const logger = new Logger();

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
  logger.error('frontend', 'Unhandled promise rejection', {
    reason: event.reason?.message || String(event.reason),
  });
});

window.addEventListener('error', (event) => {
  logger.error('frontend', 'Unhandled error', {
    message: event.message,
    filename: event.filename,
    line: event.lineno,
  });
});
