#ifndef __Schedule_c
#define __Schedule_c

/*
 * NonPreemptive, Time triggered scheduler.
 * Johan Lukkien, 12-01-2011
 *
 * Disclaimer: this code has only been tested for simple cases. 
 * 
 * The scheduler is implemented by an array of tasks called Tasks, 
 * and a couple of functions. 
 *
 * The time resolution is TicksPS. We assume that all kernel functions execute in much
 * less than a single tick thus not causing timing inaccuracy. A proper overhead 
 * analysis needs to be done.
 *
 * Functions
 *   IntDisable():  disable interrupts and return previous status word;
 *   RestoreSW(sw): restore statusword
 *   InitTasks (): to be called upon the start of the system. Clears the
 *                 data structures.
 *   RegisterTask (): fill a Task structure. Operates under exclusion.
 *                    Parameters have the following meaning.
 *         Phasing:  the number of time units to delay the first activation of a task
 *         Period:   period of a task
 *         TaskFunc: the function to call as the task body
 *         Prio:     priority (= index in Tasks)
 *         Flags:    TRIGGERED
 *   UnRegisterTask (): remove task from registration
 *         t: the task identifier
 *   TimerIntrpt (): the timer interrupt routine. It counts down units for all 
 *                   marked tasks.
 *                   Whenever the count for a task reaches 0 the task get triggered.
 */

#include "Scheduler.h"

Task Tasks[NUMTASKS];           /* Lower indices: lower priorities           */

/*
 * Get and set status word (sreg, or r2).
 */

uint16_t IntDisable (void)
{
  uint16_t sw;
    // sw = r2
  asm volatile ("mov.w r2, %0\n\t" : "=r"(sw));
  _DINT();
  return (sw);
}

void RestoreSW (uint16_t sw)
{
    // r2 = sw
  asm volatile ("mov.w %0, r2\n\t" :: "r"(sw));
}  

/* 
 * Initialize and clear task structures.
 * Should be called with interrupt disabled.
 * The clock must be started elsewhere.
 */

void InitTasks (void)
{			
  uint8_t i=NUMTASKS-1; 
  do { 
    Taskp t = &Tasks[i]; 
    t->Flags = t->Activated = t->Invoked = 0;
  } while (i--);
}

/*
 * Register a task, TRIGGERED only.
 * Testing and filling in defaults is done.
 * Each priority level has at most one task.
 */

uint8_t RegisterTask (uint16_t Phasing, uint16_t Period, 
                      void (*TaskFunc) (void), uint8_t Prio, uint8_t Flags)
{
  uint8_t  rtc = E_SUCCESS;
  uint16_t sw;

  if (Prio>=NUMTASKS) return (E_BOUNDS); // out of bounds
  if (Period == 0) return (E_WRONGPAR);
  sw = IntDisable (); 
  Taskp t = &Tasks[Prio]; 
  if (t->Flags) rtc = E_BUSY; 
  else {
    t->Remaining = Phasing;
    t->Period    = Period; 
    t->Activated = t->Invoked = 0; 
    t->Taskf     = TaskFunc; 
    t->Flags     = Flags | TRIGGERED;
  }
  RestoreSW (sw);
  return (rtc);
}

uint8_t UnRegisterTask (uint8_t t)
{
  Tasks[t].Flags = 0;
  return (E_SUCCESS);
}  

interrupt (TIMERA0_VECTOR) TimerIntrpt (void)
{
  uint8_t i = NUMTASKS-1; 
  do {
    Taskp t = &Tasks[i];
    if (t->Flags & TRIGGERED) { // countdown
      if (t->Remaining-- == 0) {
        t->Remaining = t->Period-1; 
	t->Activated++; t->Taskf(); t->Invoked++;
      }
    }
  } while (i--);
}

#endif

