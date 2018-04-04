#ifndef __Schedule_c
#define __Schedule_c

/*
 * Preemptive, Time and event triggered scheduler.
 * Johan Lukkien, 12-01-2011
 *
 * Disclaimer: this code has only been tested for simple cases. There is a race
 *             condition between main program and interrupt routine regarding 
 *             going into sleep mode.
 * 
 * The scheduler is implemented by an array of tasks called Tasks, 
 * and a couple of functions. 
 *
 * Tasks must be declared as TRIGGERED, and pssibly PERIODIC.
 * Tasks are triggered (activated) by the timer (periodically or single shot) or 
 * by other tasks. The latter case is called event triggering. 
 *
 * One could regard the triggering of an event-based task the same as registering 
 * it. We discriminate between task registration and task triggering since the 
 * triggering may come from many different sources.
 *
 * Tasks execute according to their priorities and preempt each other if need be.
 *
 * The time resolution is TicksPS. We assume that all kernel functions execute in much
 * less than a single tick thus not causing timing inaccuracy. A proper overhead 
 * analysis needs to be done.
 *
 * Functions
 *   IntDisable():  disable interrupts and return previous status word;
 *   RestoreSW(sw): restore statusword
 *   Prio2Task(Prio): translate between priority and task pointer.
 *   InitTasks (): to be called upon the start of the system. Clears the
 *                 data structures.
 *   RegisterTask (): fill a Task structure. Operates under exclusion.
 *                    Activation of tasks is automatic for periodic
 *                    tasks; otherwise, specifying Flag TT will activate upon the next
 *                    timer interrupt. Activate() can also be called from other tasks.
 *                    Parameters have the following meaning.
 *         Phasing:  the number of time units to delay the first activation of a task
 *         Period:   period of a task
 *         TaskFunc: the function to call as the task body
 *         Prio:     priority (= index in Tasks)
 *         Flags:    TRIGGERED, PERIODIC, DIRECT
 *   Activate (): Activates a task after a number of ticks. May lead to interruption if Prio 
 *                is higher priority than that of current task.
 *                Prio must not be scheduled for time triggering.
 *     Prio: task to activate
 *     Ticks: delay for activation. Ticks = 0 specifies immediate activation. 
 *   UnRegisterTask (): remove task from registration
 *         t: the task identifier
 *   HandleTasks (): handle all tasks in the range MAXPRIO .. BusyPrio+1
 *   TimerIntrpt (): the timer interrupt routine. It counts down units for all 
 *                   TT marked tasks.
 *                   Whenever the count for a task reaches 0 the task get triggered.
 */

#include "Scheduler.h"

Task Tasks[NUMTASKS];           /* Lower indices: lower priorities           */
volatile int8_t BusyPrio;       /* Current priority being served             */
uint8_t Pending = 0;            /* Indicates if there is a pending task      */ 

void HandleTasks (void);

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
  if (Pending && (sw & INTRPT_BIT)) HandleTasks ();
    // r2 = sw
  asm volatile ("mov.w %0, r2\n\t" :: "r"(sw));
}  

Taskp Prio2Taskp (uint8_t Prio) __attribute__  ( (noinline) ); 
Taskp Prio2Taskp (uint8_t Prio)
{
  return (&Tasks[Prio]);
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
  BusyPrio = -1; Pending = 0; 
}

/*
 * Register a task, TRIGGERED only, with flags.
 * Testing and filling in defaults is done.
 * Each priority level has at most one task.
 */

uint8_t RegisterTask (uint16_t Phasing, uint16_t Period, 
                      void (*TaskFunc) (void), uint8_t Prio, uint8_t Flags)
{
  uint8_t  rtc = E_SUCCESS;
  uint16_t sw;

  if (Prio>=NUMTASKS) return (E_BOUNDS); // out of bounds
  sw = IntDisable (); 
  Taskp t = &Tasks[Prio]; 
  if (t->Flags) rtc = E_BUSY; 
  else {
    t->Remaining = Phasing;
    t->Period    = Period; 
    t->Activated = t->Invoked = 0; 
    t->Taskf     = TaskFunc; 
    if (Period>0) Flags |= PERIODIC;
    if (Phasing>0 || Period>0) Flags |= TT;
    t->Flags = Flags | TRIGGERED;
  }
  RestoreSW (sw);
  return (rtc);
}

/*
 * UnRegisterTask(): remove task from registration
 * Note: this function is perhaps too simple and
 *       should take into account whether the 
 *       task is active or not.
 */

uint8_t UnRegisterTask (uint8_t t)
{
  if (t>=NUMTASKS) return (E_BOUNDS); // out of bounds
  Tasks[t].Flags = 0;
  return (E_SUCCESS);
}  

/*
 * Missing (to be added): 
 *   Activate (t, d): activate task t after d time units
 */

void HandleTasks (void)
{ 
  int8_t oldBP = BusyPrio; // Save BusyPrio = current task handling level

  Pending = 0;             // This instance will handle all new
                           // pending tasks.
  BusyPrio = NUMTASKS-1;   // Start at highest priority
  while (BusyPrio != oldBP) { 
    Taskp CurTask = CurrentTask ();
    while (CurTask->Activated != CurTask->Invoked) {
      CurTask->Invoked++; 
      if (CurTask->Flags & TRIGGERED) {
        _EINT(); CurTask->Taskf(); _DINT();
      } else {
        CurTask->Activated = CurTask->Invoked;
      }
    }
    BusyPrio--;
} }

interrupt (TIMERA0_VECTOR) TimerIntrpt (void)
{
  uint8_t i = NUMTASKS-1; 
  do {
    Taskp t = &Tasks[i];
    if (t->Flags & TT) { // countdown
      if (t->Remaining-- == 0) {
        t->Activated++;
        if (t->Flags & PERIODIC) {
	  t->Remaining = t->Period-1; 
        } else {
	  t->Flags &= ~TT;
	}
        if (t->Flags & DIRECT) {
	  t->Invoked++; t->Taskf();
  	} else {
	  Pending |= i>BusyPrio;
	}
      }
    }
  } while (i--);
  if (Pending) HandleTasks (); /* stay in interrupt context *
                                * interrupts disabled       */
}

#endif
