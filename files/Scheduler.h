#ifndef __Scheduler_h
#define __Scheduler_h

#include <io.h>
#include <signal.h>
#include <sys/inttypes.h>
#include <iomacros.h>
#include <stdlib.h>
#include "ErrorCodes.h"

#define NUMTASKS    10  /* # tasks admitted                                 */

#define DIRECT      1   /* task flag: execute uninterruptable, when ready   */
#define PERIODIC    2   /* general flag: trigger by timer interrupt         */
#define TT          4   /* general flag: waiting to be Time Triggered       */
#define ACTIVE      8   /* task state: running, or interrupted while running
                         *             not ACTIVE is called PASSIVE         */
#define BLOCKED    16   /* task state: blocked on synchronization primitive */
#define THREAD     32   /* type: THREAD (context of task retained)          */
#define TRIGGERED  64   /* type: TRIGGERED: context created upon triggering */

#define THRBLKSIZ  256  /* thread context size: 256 bytes                   */
#define GLOBMEMSIZ 1024 /* space reserved for global stack                  */

typedef struct Task *Taskp;    /* task pointer                              */

typedef struct Task {
  volatile uint16_t Remaining; /* ticks remaing till activation             */
           uint16_t Period;    /* activation period                         */
  volatile uint16_t SP;        /* saved stack, represents return context    */
  volatile uint8_t Activated;  /* # pending activations (8 bit wrap around) */
           uint8_t Invoked;    /* # activations served (8 bit wrap around)  */
  volatile uint16_t Flags;     /* task properties                           */
  void (*Taskf) (void);        /* function to be called as task body        */
  volatile Taskp Next;         /* next pointer, used in ready queue         */
  uint8_t Mem;                 /* Stack, if this is a thread                */
  uint8_t Prio;                /* priority, field needed for reverse lookup */
} Task;

#define NULLTASK (Taskp) 0

#define INTRPT_BIT  0x8        /* Interrupt enable in PSW                   */

uint16_t IntDisable (void);
void     RestoreSW (uint16_t sw);

void    InitTasks (void);
uint8_t RegisterTask (uint16_t Phasing, uint16_t Period, 
                      void (*TaskFunc) (void), uint8_t Prio, uint8_t Flags);
uint8_t UnRegisterTask (uint8_t Prio);

#ifdef NONPRE
void HandleTasks (void);

#else
volatile extern  int8_t BusyPrio;
Taskp   Prio2Taskp    (uint8_t Prio);
#define Taskp2Prio(t) (t->Prio)
#define CurrentTask() (Prio2Taskp(BusyPrio))
#define CurrentPrio() (BusyPrio)
uint8_t Activate (uint8_t Prio, uint16_t Ticks);
#endif


#ifdef THREADS
uint8_t Suspend (void);
#endif

#endif
